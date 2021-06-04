<template>
    <div class="detail_wrap">
        <div class="title_btn_group" >
            <div class="normal_btn qw-return_btn" @click="goBack"></div>
            <span class="c999">目标</span> / 目标详情
            <div class="normal_btn normal_orangeBtn edit_btn" v-perm="'goalEdit'" @click="editGoal">编辑</div>
        </div>
        <div class="goal_detail">
            <div class="goal_title">{{goalYear}}年{{teamName}}{{goalTypeName}}</div>
            <ul class="detail_msg">
                <li>
                    <p class="c888 mb5"><span class="c333 year_goal">年目标</span> (万元)</p>
                    <p class="goal_data">{{goalAmount | formatMoney}}</p>
                </li>
                <li>
                    <div>
                        <p class="c888 mb5"><span class="c333 finish_goal">已完成目标</span> (万元)</p>
                        <p class="goal_data">{{finishedAmount | formatMoney}}</p>
                    </div>
                    <div>
                        <chart class="circle_chart" id="circlel_statics" :option="circleChartOption" ref="circlel_statics_chart" ></chart>
                    </div>
                </li>
            </ul>
        </div>
        <div class="data_show">
            <chart class="column_chart" id="container" :option="chartOption" ref="hightChart"></chart>
        </div>
    </div>
</template>
<script>
import chart from "@/components/list/chart";
import { getGoalDetail } from "@/module/crm/api/goal";
import { mapActions, mapGetters } from 'vuex';
export default {
    data() {
        return {
            dataBase,
            teamName: '',  // 团队名称
            goalTypeName: '',  //目标类型
            goalAmount: 0,  // 年目标
            finishedAmount: 0,  // 已完成目标
            completionRate: '',  // 完成度
            goalYear: '',  // 对应年份
            chartOption: {  // 统计图数据
                chart: {
                    type: 'column',
                    backgroundColor:'#fafafa'
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    symbolRadius: 2, //图例圆角
                    itemDistance: 58, //图例间隙
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: [],
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table >',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true,
                    backgroundColor:'rgba(0,0,0,0.5)',
                    borderWidth:0,
                    borderRadius:5,
                    shadow:false,
                    style: {
                        color: '#fff',
                    },
                    pointFormatter: function() {
                        return `<tr>
                                    <td class="${this.series.name == "目标" ? 'qwui-chart_tooltips_disc__goal': 'qwui-chart_tooltips_disc__finish' }" style="color:${this.series.color};padding-left:12px;padding-top:6px;">${this.series.name}： </td>
                                    <td style="padding-right:12px;padding-top:6px;"><b>${this.y.toFixed(2)}</b></td>
                                </tr>`;
				    }
                },
                plotOptions: {
                    column: {
                        borderWidth: 0
                    }
                },
                series: [{
                    name: '目标',
                    data: [],
                    color: '#FD744D'
                }, {
                    name: '完成',
                    data: [],
                    color: '#80C9F8'
                }],
            },
            circleChartOption: { // 环形图 highchart配置项
                chart: {
                    backgroundColor:'#fafafa',
                    width: 320,
                    height: 146,
                    spacing: 0,
                    margin: 0,
                },
                credits: { enabled: false },
                title: {
                    floating:true,
                    text: "",
                    useHTML: true,
                    align: 'center',
                    y: 70
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: false,
                        },
                        point: {
                            events: {
                                mouseOver: function(e) {  // 鼠标滑过时动态更新标题

                                }
                            }
                        },
                    },
                },
                tooltip: {
                    enabled: false
                },
                series: [{
                    type: 'pie',
                    innerSize: '88%',
                    name: '',
                    data: [
                        {name:'已完成目标',   y: 45.0,
                        color: {
                            linearGradient: { x1: 0, x2: 1, y1: 0, y2: 1 },
                            stops: [
                                [0, '#79B1F8'],
                                [1, '#96E3FF']
                            ]
                        }},
                        {name:'未完成目标',   y: 45.0, color: '#f5f5f5'},
                    ]
                }]
            }
        }
    },
    created () {
        let id = this.$route.query.id;
        if(id){
            this.loadData(id);
        }
        else{
            // 没有id则返回
            this.goBack();
        }

    },
    components: {
        chart
    },
    computed: {
        ...mapGetters('goal',[
            'goalBoxOperate'
        ])
    },
    watch: {
        goalBoxOperate:function(newVal,oldVal){
            let id = this.$route.query.id;
            if(newVal == 'saveUpdate'){
                this.loadData(id);
            }
        }
    },
    methods: {
        ...mapActions('goal',[
            'setshowGoalBox',
            'setGoalBoxTitel',
            'setGoalBoxType',
            'setGoalBoxOperate',
            'setGoalDetail'
        ]),
        // 返回
        goBack(){
            this.$router.back(-1);
        },

        // 获取条形图数据
        loadData(id){
            let { alert:_alert } = this.dataBase;
            getGoalDetail(id)
            .then(res => {
                if(res.code == '0'){
                    let { teamName, goalTypeName, goalAmount, finishedAmount, completionRate, goalYear, stageList, goalName } = res.data.detail;
                    let stageAmountArr = [], finishedAmountArr = [];
                    this.teamName = teamName;
                    this.goalTypeName = goalTypeName;
                    this.goalAmount = goalAmount.toFixed(2);
                    this.finishedAmount = finishedAmount.toFixed(2);
                    this.completionRate = completionRate;
                    this.goalYear = goalYear;
                    this.setGoalDetail(res.data.detail);

                    // 拼接图表数据
                    stageList.map((item,idx) => {
                        stageAmountArr.push(item.stageAmount);
                        finishedAmountArr.push(item.finishedAmount);
                    });
                    this.chartOption.xAxis.categories = res.data.stageNameList;
                    this.chartOption.series[0].data = stageAmountArr;
                    this.chartOption.series[1].data = finishedAmountArr;
                    this.$refs.hightChart.inintChart();
                    this.initCircleChart(this.completionRate);
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {
                _alert('提示','网络错误');
            });
        },

        // 初始化 目标-环形图
        initCircleChart(data){
            var finishNum;
            var unFinishNum;
            if( data === ">100%" ){
                // 如果完成比为 ">100%"时将 已完成 设为 100；未完成设为 0
                finishNum = 100;
                unFinishNum = 0;
            }else{
                finishNum = parseFloat( data.replace("%","") );
                unFinishNum = parseFloat( 100 - finishNum );
            }
            this.circleChartOption.series[0].data[0].y = finishNum;
            this.circleChartOption.series[0].data[1].y = unFinishNum;
            this.circleChartOption.title.text = `<div class='circle_chart_title'>${data}</div><div class='circle_chart_subtitle' >完成度</div>`
            this.$refs.circlel_statics_chart.inintChart();
        },

        // 编辑目标
        editGoal(){
            this.setGoalBoxTitel('编辑目标');
            this.setGoalBoxType('edit');
            this.setshowGoalBox(true);
            this.setGoalBoxOperate('open');
        }
    }
}
</script>
<style scoped>
.mb5{
    margin-bottom: 5px;
}
.mb40{
    margin-bottom: 40px;
}
.c999{
    color: #999;
}
.c888{
    color: #888;
}
.mr20{
    margin-right: 20px;
}
.detail_wrap{
   margin-top: 20px;
}
.goal_detail{
    margin-top: 30px;
}
.detail_msg{
    margin-top: 27px;
}
.detail_msg li{
    display: flex;
    flex-direction: column;
    justify-content: center;
    float: left;
    width: 380px;
    height: 180px;
    padding: 20px 0 25px 61px;
    box-sizing: border-box;
    box-shadow: 0 4px 8px 0px rgba(0, 0, 0, 0.1);
}
.detail_msg li:last-child{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 530px;
    margin-left: 28px;
}
.goal_title{
    font-size: 22px;
}
.goal_data{
    font-size: 40px;
    color: #666;
}
.data_show{
    margin: 10px 0 30px;
    padding: 20px;
}
.edit_btn{
    float: right;
}
.title_btn_group{
    height: 32px;
    line-height: 32px;
}
.title_btn_group:after,.detail_msg:after{
    /* 使用伪类清除浮动 */
    content: "";
    display: block;
    line-height: 0;
    clear: both;
    visibility: hidden;
}
.year_goal:before,.finish_goal:before{
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-left: -22px;
    margin-right: 12px;
    border-radius: 50%;
    content: "";
}
.year_goal:before{
    background-color: #FD744D;
}
.finish_goal:before{
    background-color: #80C9F8;
}
.circle_chart >>> .circle_chart_title{
    font-size: 24px;
    color: #78B1F8;
    font-family: 微软雅黑;
    text-align:center
}
.circle_chart >>> .circle_chart_subtitle{
    color:#999;
    font-size:14px;
    text-align:center
}
.column_chart >>> .qwui-chart_tooltips_disc__finish:before,.column_chart >>> .qwui-chart_tooltips_disc__goal:before{
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-left: -8px;
    margin-right: 6px;
    border:1px solid #fff;
    border-radius: 50%;
    content: "";
}
.column_chart >>> .qwui-chart_tooltips_disc__goal:before{
    background-color: #FD744D;
}
.column_chart >>> .qwui-chart_tooltips_disc__finish:before{
    background-color: #80C9F8;
}
</style>


