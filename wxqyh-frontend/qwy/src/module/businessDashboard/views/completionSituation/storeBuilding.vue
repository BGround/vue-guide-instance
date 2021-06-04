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
                    <div class="legend__label">已完工</div>
                    <div class="legend__value">{{finishedNum}}</div>
                  </div>
                  <div class="overview__legend__item green">
                    <div class="legend__label">在建</div>
                    <div class="legend__value">{{unfinishedNum}}</div>
                  </div>
                </div>
            </div>
        </div>

        <div class="board__card mt16 desc">
          <div class="board__card__header">
            本月变化
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
        color: ['#5B8FF9', '#E63752'],
        legend: {
            data: [ '已完工', '在建', ],
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
                name: '已完工',
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
            {
                name: '在建',
                type: 'bar',
                stack: '广告',
                barWidth: 16,
                tooltipList: [],
                label: {
                    show: true,
                    // position: 'insideRight'
                },
                data: []
            }
        ]
    }
    import echarts from 'echarts'

    export default {
        data() {
            return {
                chartId: 'changeEnterpriseInfo',
                yearTarget : 0, //	店面建设-计划完工
                finishedNum : 0, //	店面建设-已完工
                unfinishedNum : 0, //	店面建设-未完工
                dataChange: {},
                onenetStorefrontBuild: [],
                form: {
                    year: this.date.year,
                    month: this.date.month,
                },
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
                    this.getNetStorefrontBuild()

                }
            }
        },
        created(){
            this.getNetStorefrontBuild()
        },
        methods: {
            resetChartSize() {
                this.chart.resize()
            },

            getNetStorefrontBuild(){

                getData.getNetStorefrontBuild(this.form).then((data)=>{
                    this.yearTarget = data && data.yearTarget ? data.yearTarget : 0; //	店面建设-计划完工
                    this.finishedNum = data && data.finishedNum ? data.finishedNum : 0; //	店面建设-已完工
                    this.unfinishedNum = data && data.unfinishedNum ? data.unfinishedNum : 0; //	店面建设-未完工
                    this.dataChange = data && data.dataChange? data.dataChange: {};
                    this.onenetStorefrontBuild = data && data.onenetStorefrontBuild ? data.onenetStorefrontBuild: [];
                    this.setChartOption(this.onenetStorefrontBuild)
                    const updateTime = data && data.modifyTime ? data.modifyTime: ''
                    const updateUser = data && data.modifyUser ? data.modifyUser: ''
                    this.$emit('change', {updateTime,updateUser})
                })
            },

            setChartOption(list=[]){
                const monthList = [1,2,3,4,5,6,7,8,9,10,11,12];
                const finishedData = [];
                // const unfinishedData = [];
                const underConstrucNumData = [];
                const xAxisData = [];
                monthList.forEach((month)=>{
                    const [item] = list.filter(item=>parseInt(item.month) === month);
                    const finishedNum = item && item.finishedNum? parseInt(item.finishedNum) : '';
                    // const unfinishedNum = item && item.unfinishedNum? parseInt(item.unfinishedNum) : '';
                    const underConstrucNum = item && item.underConstrucNum ? parseInt(item.underConstrucNum): '';
                    finishedData.push(finishedNum);
                    // unfinishedData.push(unfinishedNum);
                    underConstrucNumData.push(underConstrucNum)
                    xAxisData.push(`${month}月`)
                })
                chartOption.series[0].data = finishedData;
                chartOption.series[1].data = underConstrucNumData;
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
        height: 50px;
        line-height: 50px;
      }
      .overview__legend{
        display: flex;
        padding: 0 30px;
        justify-content: space-between;
        .overview__legend__item{
          display: flex;
          width: 50%;
          text-align: center;
          &.green{
            .legend__label{
              &:before{
                background: #E63752;
              }
            }
          }
        }
        .legend__label{
          font-size:14px;
          font-weight:400;
          color:rgba(102,102,102,1);
          margin-right: 20px;
          &:before{
            content: '';
            height:10px;
            width: 10px;
            background: #5B8FF9;
            display: inline-block;
            margin-right: 8px;
          }
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

