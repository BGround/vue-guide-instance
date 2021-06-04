<template>
  <div class="important">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card overview">
          <div class="overview__top">
            <div class="overview__header">
              <h3 class="overview__header__title">整体情况</h3>
            </div>
            <h3 class="overview__data">
              <div class="overview__data__value">
                <span class="red-font">{{dealerTotals}}</span>/{{checkTotals}}
              </div>
              <div class="overview__data__label">总计违规/总计考核</div>
            </h3>
          </div>
          <div class="overview__bottom">
            <div class="overview__legend">
              <div class="overview__legend__item blue">
                <div class="legend__label">违规销售</div>
                <div class="legend__value">{{saleCount && saleCount.total || 0}}</div>
              </div>
              <div class="overview__legend__item green">
                <div class="legend__label">违规展示</div>
                <div class="legend__value">{{showCount && showCount.total || 0}}</div>
              </div>
              <div class="overview__legend__item yellow">
                <div class="legend__label">钓鱼执法</div>
                <div class="legend__value">{{lawCount && lawCount.total || 0}}</div>
              </div>
              <div class="overview__legend__item red">
                <div class="legend__label">现场检查</div>
                <div class="legend__value">{{checkCount && checkCount.total || 0}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="board__card mt16 desc">
          <div class="board__card__header">
            本周变化
          </div>
          <div class="desc__content">

            <div v-if="newWeekChange" v-html="newWeekChange"></div>
            <div v-else>暂无</div>
<!--
            <div class="desc__content__part">
              <div class="desc__content__part__title">本周共计处理21例</dicircularChart.vuev>
              <div class="desc__item">
                <span class="desc__item__label">违规销售：</span>
                <span class="desc__item__value">19例（淮北安奇、莆田步峰、成都建国、成都精瑞、清镇鼎信、郑州盈丰、淮北安奇、郑州联发、成都瑞一、滨州汇源、成都瑞一、宿州盈丰、滁州和奇祥、上海泰莫斯、周口顺翔、苏州恒众、北京新瑞福、江西永瑞）</span>
              </div>
              <div class="desc__item">
                <span class="desc__item__label">违规展示：</span>
                <span class="desc__item__value">2例（保定林瑞、合肥盈丰）</span>
              </div>
            </div>

            <div class="desc__content__part">
              <div class="desc__content__part__title">本周考核共计5例</div>
              <div class="desc__item">
                <span class="desc__item__value">山东长劲、上海联海、邵阳久富、莆田步峰、淮北安奇</span>
              </div>
            </div>
-->
          </div>
        </div>
      </div>

      <div class="board__content__right">
        <div id="marketDisciplineChart1"></div>
      </div>

    </div>
  </div>
</template>

<script>
    const chartOption = {
        color: ['#5B8FF9', '#73DEB3', '#F7C739','#E63752','#E63752'],
        legend: {
            bottom: 10,
            left: 'center',
            itemHeight: 13,
            itemWidth: 13,
            data: [{
                name: '违规销售',
                icon: 'rect'
            },{
                name: '违规展示',
                icon: 'rect'
            } ,{
                name: '钓鱼执法',
                // itemHeight: 13,
                // icon: 'circle'
                icon: 'rect'
            },{
                name: '现场检查',
                icon: 'rect'
                // itemHeight: 13,
                // icon: 'circle'
            },{
                name: '考核率',
                // itemHeight: 13,
                itemWidth: 26,
            }],
        },
        tooltip: {
            backgroundColor: '#ffffff',
            textStyle: {
                color: '#2781DB'
            },
            trigger: 'item',
            extraCssText: 'box-shadow:0px 2px 3px rgba(0,0,0,0.1);',
            formatter: function (params) {
                if(params.seriesType === 'line'){
                    return `${params.seriesName} <br/>${params.name}月: ${params.value}%`
                }else{
                    return `${params.seriesName} <br/>${params.name}月: ${params.value}`
                }
            }
        },
        grid: {
            top: 40,
            left: 18,
            right: 18,
            bottom: 40,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: [1,2,3,4,5,6,7,8,9,10,11,12],
            axisLabel: {
                // 刻度值
                interval: function(index, value) {
                    // 如果跳过则返回 false。
                    return true
                },
                textStyle: {
                    color: function(value, index) {
                        return '#999999'
                    }
                },
                showMaxLabel: true // 显示最后一个
            },
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                }
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            }
        },
        yAxis: [{
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                },
                show: false
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            }
        },{
            axisTick: {
                // 刻度
                show: false
            },
            axisLine: {
                // 轴线
                lineStyle: {
                    color: '#DBDBDB'
                },
                show: false
            },
            splitLine: {
                // 分割线
                lineStyle: {
                    color: '#E6E6E6',
                    type: 'dashed'
                }
            },
            axisLabel: {
                formatter: '{value}%'
            }
        }],
        series:[
            {
                name: '违规销售',
                type: 'bar',
                stack: '广告',
                barWidth: 16,
                data: [],
                label: {
                    show: true,
                    position: 'insideRight'
                },
            },
            {
                name: '违规展示',
                type: 'bar',
                stack: '广告',
                barWidth: 16,
                label: {
                    show: true,
                    position: 'insideRight'
                },
                data: []
            },
            {
                name: '钓鱼执法',
                type: 'bar',
                stack: '广告',
                barWidth: 16,
                label: {
                    show: true,
                    position: 'insideRight'
                },
                data: []
            },
            {
                name: '现场检查',
                type: 'bar',
                barWidth: 16,
                stack: '广告',
                label: {
                    show: true,
                    position: 'insideRight'
                },
                data: []
            },
            {
                name: '考核率',
                type: 'line',
                label: {
                    show: true,
                    position: 'top',
                    formatter(params) {
                        return `${params.value}%`;
                    }
                },
                smooth: true,
                // showSymbol: false,
                data: [],
                yAxisIndex:1,
            }

        ]
    }
    import echarts from 'echarts'

    export default {
        data() {
            return {
                chartId: 'marketDisciplineChart1',
                dealerTotals: 0,
                typeStatistics: [],
                checkStatistics: [],
                checkTotals: 0,
                typeViolation: [],
                showCount: null,
                lawCount: null,
                saleCount: null,
                checkCount: null,
                newWeekChange: ''
            };
        },
        created(){

        },
        methods: {
            resetChartSize() {
                this.chart.resize()
            },
            setData(data){
                //总计违规：展示当年1月至当月累计的违规经销商数总和
                this.dealerTotals = data.dealerTotals || 0
                //总计考核：展示当年1月至当月累计的考核经销商数总和（后台数据【经销商举报数据明细】中字段【考核】为【是】的数据）
                this.checkTotals = data.checkTotals || 0
                //违规销售/违规展示/钓鱼执法/现场检查：展示当年1月至当月累计的各考核类型数总和（后台数据【经销商违规数据明细】中【考核类型】为【违规销售/违规展示/钓鱼执法/现场检查】的数据）
                this.typeViolation = data.typeViolation
                //展示后台手工维护的富文本信息；
                this.newWeekChange = data.newWeekChange
                //以柱状图按月展示每月的经销商违规总数，并按不同色块展示不同违规类型数；
                this.typeStatistics = data.typeStatistics
                //以曲线图（平滑线）展示每月的考核率（考核率=对应月份中字段【考核】为【是】的数据总和÷对应月份的举报总数×100%）
                this.checkStatistics = data.checkStatistics

                 this.showCount = data.typeViolation.find((item)=>item.type === '违规展示')
                this.saleCount = data.typeViolation.find((item)=>item.type === '违规销售')
                 this.lawCount= data.typeViolation.find((item)=>item.type === '钓鱼执法')
                this.checkCount= data.typeViolation.find((item)=>item.type === '现场检查')
            },

            chartOptions(typeStatistics=[], checkStatistics=[]){
                console.log(typeStatistics)
                const months = [1,2,3,4,5,6,7,8,9,10,11,12];
                const law = months.map((month)=>{
                    const target = typeStatistics.find(item=>item.month === month && item.type === '钓鱼执法' )
                    console.log(target)
                    return {
                        value: target && target.total || '',
                    }
                })
                const sale = months.map((month)=>{
                    const target = typeStatistics.find(item=>item.month === month && item.type === '违规销售' )
                    return {
                        value: target && target.total || '',
                    }
                })
                const show = months.map((month)=>{
                    const target = typeStatistics.find(item=>item.month === month && item.type === '违规展示' )
                    return {
                        value: target && target.total || '',
                    }
                })
                const check = months.map((month)=>{
                    const target = typeStatistics.find(item=>item.month === month && item.type === '现场检查' )
                    return {
                        value: target && target.total || '',
                    }
                })

                const assess = months.map((month)=>{
                    const target = checkStatistics.find(item=>item.month === month )
                    console.log(target)
                    return {
                        value: target && target.proportion? parseFloat(target.proportion) : 0
                    }
                })



                chartOption.series[0].data = sale
                chartOption.series[1].data = show
                chartOption.series[2].data = law
                chartOption.series[3].data = check
                chartOption.series[4].data = assess
                this.chart.setOption(chartOption)

            }

        },
        props:{
            config:{
                type: Object,
                required: true,
            }
        },
        watch:{
            'config':{
                deep: true,
                handler: function (data) {
                    this.setData(data)
                    this.chartOptions(data.typeStatistics, data.checkStatistics)

                }
            }
        },
        components: {

        },
        mounted() {
            this.chart = echarts.init(document.getElementById(this.chartId));
            this.chart.setOption(chartOption)
            window.addEventListener('resize', this.resetChartSize)
        },
    }
</script>

<style lang="scss" scoped>
  @import '~@/module/businessDashboard/scss/common/board.scss';
  .important{
    .overview{
      padding: 32px 24px 0;
      .overview__top{
        display: flex;
        border-bottom: 1px solid #E6E6E6;
        align-items: flex-start;
        padding-bottom: 17px;
      }
      .overview__header{
        margin-right: auto;
      }
      .overview__header__title{
        height:26px;
        font-size:20px;
        font-weight:bold;
        line-height: 20px;
        color:rgba(20,30,40,1);
      }
      .overview__header__subtitle{
        font-size:14px;
        font-weight:400;
        line-height:24px;
        color:rgba(209,3,28,1);
        height:24px;
        background:rgba(209,3,28,0.1);
        padding: 0 12px;
        border-radius:4px;
        margin-top: 12px;
        &.yellow{
          color: #FD9707;
          background:rgba(253,151,7,0.1)
        }
      }
      .overview__data{
        text-align: right;
        .overview__data__value{
          height:42px;
          font-size:32px;
          font-weight:bold;
          line-height:42px;
          color:rgba(195,23,37,1);
          margin-bottom: 4px;
          .red-font{
            color: #C31725;
          }
        }
        .overview__data__label{
          height:19px;
          font-size:14px;
          font-weight:400;
          line-height:19px;
          color:rgba(102,102,102,1);
        }
      }
      .overview__bottom{
        /*height: 50px;*/
        /*line-height: 50px;*/
      }
      .overview__legend{
        display: flex;
        justify-content: space-between;
        .overview__legend__item{
          padding-top: 16px;
          padding-bottom: 16px;
          /*margin-right: 20px;*/
          &:last-child{
            margin-right: 0;
          }
          &.blue{
            .legend__label{
              &:before{
                background: #5B8FF9;
              }
            }
          }
          &.green{
            .legend__label{
              &:before{
                background: #73DEB3;
              }
            }
          }
          &.gray{
            .legend__label{
              &:before{
                background: #7585A2;
              }
            }
          }
          &.red{
            .legend__label{
              &:before{
                background: #E63752;
              }
            }
          }
          &.yellow{
            .legend__label{
              &:before{
                background: #F7C739;
              }
            }
          }

        }
        .legend__label{
          font-size:14px;
          font-weight:400;
          color:rgba(102,102,102,1);
          &:before{
            content: '';
            height:10px;
            width: 10px;
            background:rgba(91,143,249,1);
            display: inline-block;
            margin-right: 8px;
          }
        }
        .legend__value{
          font-size:14px;
          font-weight:bold;
          color:rgba(51,51,51,1);
          margin-left: 18px;
        }
      }
      .meeting{
        padding-top: 2px;
        padding-bottom: 16px;
        display: flex;
        .meeting__item{
          width: 50%;
          justify-content: center;
          display: flex;
        }
        .meeting__item__label{
          height:19px;
          font-size:14px;
          font-weight:400;
          line-height:19px;
          color:rgba(51,51,51,1);
          margin-right: 10px;
        }
        .meeting__item__value{
          height:19px;
          line-height:19px;
          font-size:14px;
          font-weight:bold;
          color:rgba(51,51,51,1);
        }
      }
    }
    .desc__content{
      padding: 16px 24px;
      height: 266px;
      & /deep/ img{
        max-width: 100% !important;
      }
      .desc__content__part__title{
        height:19px;
        font-size:14px;
        font-weight:bold;
        line-height:19px;
        color:rgba(51,51,51,1);
        margin-bottom: 10px;
      }
      .desc__item{
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
      }
      .desc__item__label{
        height:19px;
        margin-right: 8px;
        font-size:14px;
        line-height:19px;
        color:rgba(51,51,51,1);
        flex-basis: 70px;
        flex-shrink: 0;
      }
      .desc__item__value{
        font-size:14px;
        font-weight:400;
        line-height:22px;
        color:rgba(102,102,102,1);
      }
    }
  }
  #marketDisciplineChart1{
    height: 520px;




  }
</style>

