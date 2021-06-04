<template>
    <div class="polar-chart">
        <div class="section">
            <div class="polar-chart__left">
              <div class="polar-chart__title">新网开发</div>
              <div class="legend">
                <el-row class="row">
                  <el-col :span="14" class="col">
                    <a @click="handleClick('目标', 'isActiveTarget')" :class="{'active':isActiveTarget}" href="JavaScript:;"><i class="legend-dot blue"></i><span>目标</span></a>
                  </el-col>
                  <el-col :span="10" class="col">{{monthlyTarget}}</el-col>
                </el-row>
                <el-row class="row">
                  <el-col :span="14" class="col">
                    <a @click="handleClick('上会', 'isActiveMeeting')" :class="{'active':isActiveMeeting}" href="JavaScript:;"><i class="legend-dot yellow"></i><span>上会/</span></a>
                    <a @click="handleClick('审批', 'isActiveApprove')" :class="{'active':isActiveApprove}" href="JavaScript:;"><i class="legend-dot green"></i><span>审批</span></a>
                  </el-col>
                  <el-col :span="10" class="col">{{meetingNum}}/{{approvalNum}}</el-col>
                </el-row>
                <el-row class="row">
                  <el-col :span="14" class="col">
                    <a  @click="handleClick('打款', 'isActivePaid')" :class="{'active':isActivePaid}" href="JavaScript:;"><i class="legend-dot gray"></i><span>打款/</span></a>
                    <a  @click="handleClick('未打款', 'isActiveUnpaid')" :class="{'active':isActiveUnpaid}" href="JavaScript:;"><i class="legend-dot red"></i><span>未打款</span></a>
                  </el-col>
                  <el-col :span="10" class="col">{{paymentNum}}/{{unPaymentNum}}</el-col>
                </el-row>
              </div>
            </div>
            <div class="polar-chart__right">
              <div ref="chart" class="polar-chart__chart">

              </div>
            </div>
        </div>
    </div>
</template>

<script>

    import echarts from "echarts";
    const chartOption = {
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            containLabel: false,
        },
        legend: {
            show: false,
            data: ['目标', '上会', '审批', '打款', '未打款'],
        },
        angleAxis: {
            boundaryGap: [0, 0],
            nameGap: 0,
            show: false,
        },
        radiusAxis: {
            show: false,
            nameGap: 0,
            type: 'category',
            boundaryGap: [0, 0],
            data: ['一', '二', '三', '四'],
            z: 10,
        },
        polar: {
            radius: ['0%', '100%'],
        },
        series: [
            {
                name: '目标',
                type: 'bar',
                stack: '总量',
                coordinateSystem: 'polar',
                data: [0, 0, 0, 0],
            },
            {
                name: '上会',
                type: 'bar',
                stack: '总量',
                coordinateSystem: 'polar',
                data: [0, 0, 0, 0],
            },
            {
                name: '审批',
                type: 'bar',
                stack: '总量',
                coordinateSystem: 'polar',
                data: [0, 0, 0, 0],
            },
            {
                name: '打款',
                type: 'bar',
                stack: '总量',
                coordinateSystem: 'polar',
                data: [0, 0, 0, 0],
            },
            {
                name: '未打款',
                type: 'bar',
                stack: '总量',
                coordinateSystem: 'polar',
                data: [0, 0, 0, 0],
            },
        ],
    };

    export default {
        name: "polarChart",
        components: {},
        data() {
            return {
                chart: null,
                isActiveTarget: true,
                isActiveMeeting: true,
                isActiveApprove: true,
                isActivePaid: true,
                isActiveUnpaid: true,

                monthlyTarget: 0,
                meetingNum: 0,
                approvalNum: 0,
                paymentNum: 0,
                unPaymentNum: 0,
            }
        },
        props: {
            color: {
                type: Array,
                required: true,
            },
            data: {
                type: Object,
                default(){
                    return {
                        meetingNum: 0, //	新网开发-已上会
                        approvalNum	: 0, //	新网开发-已审批
                        paymentNum: 0, //	新网开发-已打款
                        unPaymentNum: 0, //	新网开发-未打款
                        monthlyTarget: 0,
                        hasData: false,
                    }
                }
            }
        },
        methods: {
            handleClick(name, field){
                if(!this.hasData){
                    return
                }
                this.chart.dispatchAction({
                    type: 'legendToggleSelect',
                    name: name                    // 图例名称
                })
                this[field] = !this[field];
            },

            setOptionOfChart(data){
                if(this.hasData){
                    chartOption['color'] = this.color;
                    chartOption.series[0].data = [0, 0, 0, data.monthlyTarget]; // 目标
                    chartOption.series[1].data = [0, 0, data.meetingNum, 0];
                    chartOption.series[2].data = [0, data.approvalNum, 0, 0];
                    chartOption.series[3].data = [data.paymentNum, 0, 0, 0];
                    chartOption.series[4].data = [data.unPaymentNum, 0, 0, 0];
                }else{
                    chartOption.series[0].data = [0, 0, 0, 1]; // 目标
                    chartOption.series[1].data = [];
                    chartOption.series[2].data = [];
                    chartOption.series[3].data = [];
                    chartOption.series[4].data = [];
                    chartOption['color'] = ['#ebeef5'];
                }
                this.chart.setOption(chartOption);
            },

            setData(data){
                this.monthlyTarget = data.monthlyTarget || 0;
                this.meetingNum = data.meetingNum || 0;
                this.approvalNum = data.approvalNum || 0;
                this.paymentNum = data.paymentNum || 0;
                this.unPaymentNum = data.unPaymentNum || 0;
            },

            checkOptions(data){
                return !!(data.monthlyTarget || data.meetingNum ||  data.approvalNum || data.paymentNum || data.unPaymentNum)
            },
        },
        watch:{
            data:{
                deep: true,
                handler(data){
                  console.log(data, '-------')
                    this.hasData = this.checkOptions(data);
                    this.setData(data)
                    this.setOptionOfChart(data)
                }
            }
        },
        created() {
            this.hasData = this.checkOptions(this.data);
            console.log(this.data, '++++')
        },
        mounted() {
            this.chart = echarts.init(this.$refs['chart']);
            this.chart.setOption(chartOption)
            this.setOptionOfChart(this.data);
        }
    }
</script>

<style scoped lang="scss">
  .polar-chart{
    .section{
      box-sizing: border-box;
      width:374px;
      height:188px;
      background:rgba(247,247,247,1);
      border:1px solid rgba(230,230,230,1);
      border-radius:4px;
      display: flex;
      padding: 24px;
    }

    .polar-chart__left{
      flex-grow: 1;
    }
    .polar-chart__right{
      margin-top: 7px;
      flex-shrink: 0;
      flex-basis: 142px;
      .polar-chart__chart{
        width: 142px;
        height: 142px;
      }
    }
    .legend-dot{
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #eee;
      line-height: 19px;
      margin-right: 2px;
      vertical-align: top;
      margin-top: 6px;
      background: #eee;
    }
    .polar-chart__title{
      height:26px;
      font-size:20px;
      font-weight:400;
      line-height:26px;
      color:rgba(51,51,51,1);
    }
    .legend{
      width: 100%;
      height:19px;
      font-size:14px;
      font-weight:400;
      line-height:19px;
      color:rgba(153,153,153,1);
      .active{
        .blue{
          background: #5B8FF9;
        }
        .yellow{
          background: #F5D023;
        }
        .green{
          background: #3CD083;
        }
        .gray{
          background: #7585A2;
        }
        .red{
          background: #C31725;
        }
      }


      .row{
        margin: 15px 0;
      }

    }
  }
</style>
