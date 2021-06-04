<template>
  <div class="region">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card">
          <div class="situation">
            <div class="situation__item">
              <div class="situation__item__data">

                <div class="situation__item__value">{{monthlyNetworkSize}}</div>
                <div class="situation__item__label">当前规模</div>
                <div class="situation__item__title">年度目标: <b>{{yearTarget}}</b></div>

              </div>
              <div class="situation__item__dashboard">
                <el-progress color="#5B8FF9" :show-text="false" :width="140" :stroke-width="16" stroke-linecap="square" type="circle" :percentage="normalizePercent(calculation)"></el-progress>
                <div class="progress-text">
                  <p class="progress-text__label">完成率</p>
                  <p class="progress-text__value">{{calculation}}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="board__card mt16">
          <div class="situation">
            <div class="situation__item">
              <div class="situation__item__data">

                <div class="situation__item__value green">{{openingTarget}}</div>
                <div class="situation__item__label">当年开通</div>
                <div class="situation__item__title">年度目标: <b>{{openingYearTarget}}</b></div>

              </div>
              <div class="situation__item__dashboard">
                <el-progress color="#73DEB3" :show-text="false" :width="140" :stroke-width="16" stroke-linecap="square" type="circle" :percentage="normalizePercent(openingCalculation)"></el-progress>
                <div class="progress-text">
                  <p class="progress-text__label">完成率</p>
                  <p class="progress-text__value">{{openingCalculation}}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>



      </div>

      <div class="board__content__right">
        <div class="chart-wrapper">
          <div class="networkSaleRegionChart" id="chart1"></div>
          <div class="chart-title">当前规模</div>
        </div>
        <div class="chart-wrapper">
          <div class="networkSaleRegionChart" id="chart2"></div>
          <div class="chart-title">当年开通</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
    const chartOption1 = {
        color: ['#5B8FF9', '#73DEB3', '#FD9707'],
        legend: {
            bottom: 10,
            left: 'center',
            itemHeight: 13,
            itemWidth: 13,
            data: [{
                name: '目标',
                backgroundColor: '#ffffff',
                icon: 'rect'
            },{
                name: '完成',
                icon: 'rect'
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
                    return `${params.seriesName} <br/>${params.name}: ${params.value}%`
                }else{
                    return `${params.seriesName} <br/>${params.name}: ${params.value}`
                }

            }
        },
        grid: {
            top: 70,
            left: 18,
            right: 18,
            bottom: 40,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: [],
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
        yAxis: [
            {
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
            },
            {
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
            },
        ],
        series: [
            {
                name: '目标',
                type: 'bar',
                barWidth: 13,
                data: [],
                label: {
                    show: true,
                    position: 'top',
                    fontsize:14,
                },
            },
            {
                name: '完成',
                type: 'bar',
                barWidth: 13,
                data: [],
                label: {
                    show: true,
                    position: 'top',
                    fontsize:14,
                },
            }
        ]
    }
    const chartOption2 = {
        color: ['#5B8FF9', '#73DEB3',  '#FD9707'],
        legend: {
            bottom: 10,
            left: 'center',
            itemHeight: 13,
            itemWidth: 13,
            data: [{
                name: '目标',
                backgroundColor: '#ffffff',
                icon: 'rect'
            },{
                name: '完成',
                icon: 'rect'
            } ],

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
                    return `${params.seriesName} <br/>${params.name}: ${params.value}%`
                }else{
                    return `${params.seriesName} <br/>${params.name}: ${params.value}`
                }

            }
        },
        grid: {
            top: 70,
            left: 18,
            right: 18,
            bottom: 40,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: [],
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
        series: [
            {
                name: '目标',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'top',
                    fontsize:14,
                },
                data: []
            },
            {
                name: '完成',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'top',
                    fontsize:14,
                },
                data: []
            }
        ]
    }

    import echarts from 'echarts'
    import circularChart from "@/module/businessDashboard/components/circularChart";
    import getData from '../../api/getData'

    export default {
        data() {
            return {
                form: {
                    year: this.date.year,
                    month: this.date.month,
                },
                chartId1: 'chart1',
                chartId2: 'chart2',

                calculation: 0,
                monthlyNetworkSize:  0,
                oneScaleManagementList:  [],
                openingCalculation:  0,
                openingProgressList:  [],
                openingTarget:  0,
                openingYearTarget:  0,
                yearTarget:  0,
            };
        },
        props:{
            date: {
                type: Object,
                required: true,
            },

        },
        watch:{
            date:{
                deep: true,
                handler(date){
                    console.log(date)
                    this.form.month = date.month
                    this.form.year = date.year
                    this.getOneProgressNetworkPlanning()
                }
            },

        },
        created(){
            this.getOneProgressNetworkPlanning()

        },
        methods: {

            normalizePercent(value){
                return  value > 100? 100: value;
            },

            formatProgressValue(percentage){
                return Number(percentage).toFixed(0)
            },
            formatProgressRatioValue(percentage){
                return Number(percentage).toFixed(1)
            },

            /***
             *
             */
            getOneProgressNetworkPlanning(){
                getData.getOneProgressNetworkPlanning(this.form).then((data)=>{
                    if(data){
                        this.calculation = data.calculation || 0
                        this.monthlyNetworkSize = data.monthlyNetworkSize || 0
                        this.oneScaleManagementList = data.oneScaleManagementList || []
                        this.openingCalculation = data.openingCalculation || 0
                        this.openingProgressList = data.openingProgressList || []
                        this.openingTarget = data.openingTarget || 0
                        this.openingYearTarget = data.openingYearTarget || 0
                        this.yearTarget = data.yearTarget || 0;
                    }else{
                        this.calculation = 0;
                        this.monthlyNetworkSize = 0;
                        this.oneScaleManagementList = [];
                        this.openingCalculation = 0;
                        this.openingProgressList = [];
                        this.openingTarget = 0;
                        this.openingYearTarget = 0;
                        this.yearTarget = 0;
                    }
                    this.setChartOptions(this.oneScaleManagementList, this.openingProgressList)
                })
            },

            resetChartSize() {
                this.chart.resize()
            },



            setChartOptions(oneScaleManagementList, openingProgressList){
                const monthList = [1,2,3,4,5,6,7,8,9,10,11,12];

                const xAxisDataOfChart1 = [];
                const targetDataOfChart1 = [];
                const completeDataOfChart1 = [];
                monthList.forEach((month)=>{
                    xAxisDataOfChart1.push(`${month}月`);
                    const item = oneScaleManagementList.find(item=>item.month === month);
                    if(item){
                        targetDataOfChart1.push(item.monthlyTarget || 0)
                        completeDataOfChart1.push(item.monthlyNetworkSize || 0)
                    }else{
                        targetDataOfChart1.push('')
                        completeDataOfChart1.push('');
                    }
                })

                const xAxisDataOfChart2 = [];
                const targetDataOfChart2 = [];
                const completeDataOfChart2 = [];
                monthList.forEach((month)=>{
                    xAxisDataOfChart2.push(`${month}月`);
                    const item = openingProgressList.find(item=>item.month === month);
                    if(item){
                        targetDataOfChart2.push(item.monthlyTarget || 0)
                        completeDataOfChart2.push(item.transferredRegular || 0)
                    }else{
                        targetDataOfChart2.push('')
                        completeDataOfChart2.push('');
                    }
                })


                chartOption1.xAxis.data = xAxisDataOfChart1;
                chartOption1.series[0].data = targetDataOfChart1;
                chartOption1.series[1].data = completeDataOfChart1;

                chartOption2.xAxis.data = xAxisDataOfChart2;
                chartOption2.series[0].data = targetDataOfChart2;
                chartOption2.series[1].data = completeDataOfChart2;

                this.chart1.setOption(chartOption1)
                this.chart2.setOption(chartOption2)

            },

            resetChartSize() {
                this.chart1.resize()
                this.chart2.resize()
            },


        },
        components: {
            circularChart
        },
        mounted() {
            this.chart1 = echarts.init(document.getElementById(this.chartId1));
            this.chart1.setOption(chartOption1)

            this.chart2 = echarts.init(document.getElementById(this.chartId2));
            this.chart2.setOption(chartOption2)

            window.addEventListener('resize', this.resetChartSize)
        },
    }
</script>

<style lang="scss" scoped>
  @import '../../scss/common/board.scss';
  .region{



    .situation{
      padding-top: 24px;
    }
      .situation__item{
        display: flex;
        height: 144px;
        padding-left: 24px;
        padding-right: 37px;
        margin-bottom: 24px;
        align-items: center;
        justify-content: space-between;


        .situation__item__data{
          text-align: center;
          width: 130px;
          .situation__item__value{
            height:42px;
            font-size:32px;
            font-weight:bold;
            line-height:42px;
            color:rgba(91,143,249,1);
            margin-bottom: 4px;
            text-align: center;
            &.green{
              color: #73DEB3;
            }
          }
          .situation__item__title{
            height:20px;
            font-size:14px;
            font-weight:400;
            line-height:20px;
            color:rgba(102,102,102,1);
            padding-top: 16px;
            border-top: 1px solid #E6E6E6;
          }
          .situation__item__label{
            height:19px;
            font-size:14px;
            font-weight:400;
            line-height:19px;
            color:rgba(102,102,102,1);
            padding-bottom: 17px;
          }
        }

        .situation__item__dashboard{
          width:144px;
          height:144px;
          flex-basis: 144px;
          position: relative;
        }
        .progress-text{
          position: absolute;
          left: 50%;
          top:50%;
          transform: translate(-50%, -50%);
          .progress-text__label{
            text-align: center;
            height:19px;
            font-size:14px;
            font-weight:400;
            line-height:19px;
            color:rgba(102,102,102,1);
            margin-bottom: 2px;
          }
          .progress-text__value{
            text-align: center;
            height:26px;
            font-size:20px;
            font-weight:bold;
            line-height:26px;
            color:rgba(51,51,51,1);
          }
        }
      }

    .ranking{
      padding: 0 24px;
      .ranking__item{
        padding: 16px 0;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #E6E6E6;
      }
      .ranking__item__label{
        flex-basis: 56px;
      }
      .ranking__item__chart{
        flex-grow: 1;
        & /deep/{
          .el-progress-bar__outer, .el-progress-bar__inner{
            border-radius: 0;
          }
        }
        & /deep/{
          .el-progress.el-progress--line{
            white-space: nowrap;
          }
        }
      }
      .ranking__item__chart__highest, .ranking__item__chart__lowest{
        display: flex;
        align-items: center;
        .ranking__item__chart__lowest__label, .ranking__item__chart__highest__label{
          flex-basis: 108px;
          font-size:14px;
          font-weight:400;
          line-height:24px;
        }
        .ranking__item__chart__highest__bar, .ranking__item__chart__lowest__bar{
          flex-grow: 1;
        }
      }

    }
  }
  .networkSaleRegionChart{
    height: 520px;
    margin-bottom: 20px;
  }
  .chart-wrapper{
    background: rgba(247, 247, 247, 1);
    position: relative;
  }
  .chart-title{
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translate(-50%,0);
    z-index: 10;
    height:31px;
    font-size:24px;
    font-weight:400;
    line-height:21px;
    color:rgba(51,51,51,1);
  }
</style>

