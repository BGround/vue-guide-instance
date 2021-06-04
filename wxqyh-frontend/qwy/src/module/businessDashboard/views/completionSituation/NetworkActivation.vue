<template>
  <div class="general">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card overview">
            <div class="overview__top">
              <div class="overview__value">{{yearTarget}}</div>
              <div class="overview__label">年度计划</div>
            </div>
            <div class="overview__bottom">
                <div class="overview__legend">
                  <div class="overview__legend__item">
                    <div class="legend__label">已开通</div>
                    <div class="legend__value">{{sumResult}}</div>
                  </div>
                  <div class="overview__legend__item red">
                    <div class="legend__label">未开通</div>
                    <div class="legend__value">{{noOpened}}</div>
                  </div>
                  <div class="overview__legend__item large">
                    <div class="legend__label">已提车/未提车</div>
                    <div class="legend__value">{{openedOrTransition}}</div>
                  </div>

                </div>
            </div>
        </div>

        <div class="board__card mt16 ">
          <div class="board__card__header">
            完成进度
          </div>
          <div>
            <div class="board__card__content">
              <div class="card__progress" >
                <div class="card__progress__name">第一季度</div>
                <div class="card__progress__bar">
                  <el-progress stroke-linecap="square" :stroke-width="16" :color="'#5B8FF9'" :percentage="firstQuarter"></el-progress>
                </div>
              </div>

              <div class="card__progress" >
                <div class="card__progress__name">第二季度</div>
                <div class="card__progress__bar">
                  <el-progress  stroke-linecap="square" :stroke-width="16" :color="'#5B8FF9'" :percentage="secondQuarter"></el-progress>
                </div>
              </div>

              <div class="card__progress" >
                <div class="card__progress__name">第三季度</div>
                <div class="card__progress__bar">
                  <el-progress stroke-linecap="square" :stroke-width="16" :color="'#5B8FF9'" :percentage="thirdQuarter"></el-progress>
                </div>
              </div>

              <div class="card__progress" >
                <div class="card__progress__name">第四季度</div>
                <div class="card__progress__bar">
                  <el-progress  stroke-linecap="square" :stroke-width="16" :color="'#5B8FF9'" :percentage="fourQuarter"></el-progress>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="board__card mt16 desc">
          <div class="board__card__header">
            备注
          </div>
          <div class="desc__content">
              <div v-if="dataChange && dataChange.content" v-html="dataChange.content"></div>
              <div v-else>暂无</div>

          </div>
        </div>
      </div>

      <div class="board__content__right">
        <div id="changeEnterpriseInfo"></div>
      </div>

    </div>
  </div>
</template>

<script>


    import getData from "../../api/getData";

    const chartOption = {
        color: ['#5B8FF9'],
        legend: {
            data: [ '已开通'],
            bottom: 10,
            left: 'center',
            itemHeight: 13,
            itemWidth: 13,
            icon: 'rect'
        },
        tooltip: {
            confine: true,
            backgroundColor: '#ffffff',
            textStyle: {
                color: '#2781DB'
            },
            trigger: 'item',
            extraCssText: 'box-shadow:0px 2px 3px rgba(0,0,0,0.1);',
            // formatter: function (event) {
            //     const series =  chartOption.series.find(item=>item.name ===event.seriesName)
            //     let str = ''
            //     const list = series.tooltipList[event.dataIndex].filter((item)=>item.changeState === event.seriesName)
            //     list.forEach((item)=>{
            //         const  dealerShortName = item.dealerShortName|| ''
            //         const mark = item.mark? `(${item.mark})`: ''
            //         str = str + `${dealerShortName}${mark}<br>`
            //     })
            //     return str
            // }
        },
        grid: {
            top: 30,
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
        yAxis: {
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
        series:[
            {
                name: '已开通',
                type: 'bar',
                barWidth: 16,
                stack: '广告',
                tooltipList: [],
                label: {
                    show: true,
                    // position: 'insideRight'
                },
                data: []
            },
        ]
    }
    import echarts from 'echarts'

    export default {
        data() {
            return {
                chartId: 'changeEnterpriseInfo',
                form: {
                    year: this.date.year,
                    month: this.date.month,
                },
                yearTarget: 0,
                sumResult: 0,
                noOpened: 0,
                openedOrTransition: '0/0',
                thisYearList: [],
                dataChange: {},
                firstQuarter: 0,
                secondQuarter: 0,
                thirdQuarter: 0,
                fourQuarter: 0,
            };
        },
        props:{
            date:{
                type: Object,
                required: true,
            }
        },
        watch:{
            'date':{
                deep: true,
                handler: function (date) {
                    this.form.month = date.month
                    this.form.year = date.year
                    this.getOpeningProgress()
                }
            }
        },
        created(){
            this.getOpeningProgress()
        },
        methods: {

            getOpeningProgress(){
                getData.getOpeningProgress(this.form).then((data)=>{
                    this.yearTarget = data && data.openingProgress && data.openingProgress.yearTarget ? data.openingProgress.yearTarget: 0; //	年度目标
                    this.sumResult = data && data.openingProgress && data.openingProgress.sumResult ? data.openingProgress.sumResult: 0; //	已开通
                    this.noOpened = data && data.openingProgress && data.openingProgress.noOpened ? data.openingProgress.noOpened: 0; //	未开通
                    this.openedOrTransition = data && data.openingProgress && data.openingProgress.openedOrTransition ? data.openingProgress.openedOrTransition: '0/0'; //	转正/过渡
                    this.thisYearList = data && data.openingProgress && data.openingProgress.thisYearList? data.openingProgress.thisYearList : []; //当年 一网开通进展
                    this.dataChange = data && data.dataChange? data.dataChange: {};
                    this.firstQuarter = this.parseCompleteProgressValue(data.completeProgress, 'firstQuarter');
                    this.secondQuarter = this.parseCompleteProgressValue(data.completeProgress, 'secondQuarter');
                    this.thirdQuarter = this.parseCompleteProgressValue(data.completeProgress, 'thirdQuarter');
                    this.fourQuarter = this.parseCompleteProgressValue(data.completeProgress, 'fourQuarter');
                    this.setChartOption(this.thisYearList)
                    const updateTime = data && data.modifyTime ? data.modifyTime: ''
                    const updateUser = data && data.modifyUser ? data.modifyUser: ''
                    this.$emit('change', {updateTime,updateUser})
                })
            },

            parseCompleteProgressValue(completeProgress,key){
                if(typeof completeProgress === 'object' && !!completeProgress){
                    const value = parseInt(completeProgress[key]);
                    return value? value :0;
                }else{
                    return 0;
                }
            },

            resetChartSize() {
                this.chart.resize()
            },



            setChartOption(list=[]){
                const monthList = [1,2,3,4,5,6,7,8,9,10,11,12];
                const hasOpenedData = [];
                const xAxisData = [];
                monthList.forEach((month)=>{
                    const [item] = list.filter(item=>parseInt(item.month) === month);
                    const transferredRegular = item && item.transferredRegular? parseInt(item.transferredRegular) : '';
                    hasOpenedData.push(transferredRegular);
                    xAxisData.push(`${month}月`)
                })
                chartOption.series[0].data = hasOpenedData;
                chartOption.xAxis.data = xAxisData;
                this.$nextTick(()=>{
                    this.chart.setOption(chartOption);
                })
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
  @import '../../scss/common/board.scss';
  .general{

    & /deep/{
      .el-progress-bar__outer, .el-progress-bar__inner{
        border-radius: 0;
      }
      .el-progress{
        white-space: nowrap;
      }

      .el-progress__text{
        font-size: 14px !important;
      }
    }

    .board__card__content{
      padding: 8px 19px 0 24px;
      .card__progress{
        margin: 16px 0;
        display: flex;
        .card__progress__name{
          flex-basis: 84px;
          margin-right: 8px;
          font-size:14px;
          font-weight:400;
          line-height:19px;
          color:rgba(102,102,102,1);
        }
        .card__progress__bar{
          flex-grow: 1;
        }
      }
    }

    .overview{
      padding: 24px 24px 0;
      .overview__top{
        border-bottom: 1px solid #E6E6E6;
        align-items: flex-start;
        padding-bottom: 25px;
      }
      .overview__value{
        height:42px;
        font-size:32px;
        font-weight:bold;
        line-height:42px;
        color:rgba(195,23,37,1);
        margin: 4px;
        text-align: center;
      }
      .overview__label{
        height:19px;
        font-size:14px;
        text-align: center;
        font-weight:400;
        line-height:19px;
        color:rgba(102,102,102,1);
      }
      .overview__title{
        margin-right: auto;
        height:26px;
        font-size:20px;
        font-weight:bold;
        line-height: 20px;
        color:rgba(20,30,40,1);
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
        padding: 7px 0;
      }
      .overview__legend{
        display: flex;
        padding: 0 30px;
        justify-content: space-between;
        flex-wrap: wrap;
        .overview__legend__item{
          &.large{
            flex-grow: 1;
          }
          display: flex;
          flex-basis: 50%;
          text-align: center;
          height:20px;
          line-height: 20px;
          margin-bottom: 2px;
          &.red{
            .legend__value,
            .legend__label{
              color: #E63752;
            }
          }
        }
        .legend__label{
          font-size:14px;
          font-weight:400;
          color:rgba(102,102,102,1);
          margin-right: 20px;

        }
        .legend__value{
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
      .desc__item{
        display: flex;
        align-items: flex-start;
        margin-bottom: 10px;
      }
      .desc__item__label{
        height:19px;

        font-size:14px;
        font-weight:bold;
        line-height:19px;
        color:rgba(51,51,51,1);
        margin-right: 8px;
        flex-basis: 77px;
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
  #changeEnterpriseInfo{
    height: 520px;
    background: #F7F7F7;
  }
</style>

