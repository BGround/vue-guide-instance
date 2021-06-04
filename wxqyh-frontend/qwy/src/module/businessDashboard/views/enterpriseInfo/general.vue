<template>
  <div class="general">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card overview">
            <div class="overview__top">
              <h3 class="overview__title">一般变更</h3>
              <h3 class="overview__data">
                <div class="overview__data__value">{{totalCount}}</div>
                <div class="overview__data__label">累计变更</div>
              </h3>
            </div>
            <div class="overview__bottom">
                <div class="overview__legend">
                  <div class="overview__legend__item">
                    <div class="legend__label">已完成</div>
                    <div class="legend__value">{{finishCount}}</div>
                  </div>
                  <div class="overview__legend__item green">
                    <div class="legend__label">进行中</div>
                    <div class="legend__value">{{ongoingCount}}</div>
                  </div>
                </div>
            </div>
        </div>

        <div class="board__card mt16 desc">
          <div class="board__card__header">
            本周变化
          </div>
          <div class="desc__content">
              <div v-if="generalChange" v-html="generalChange"></div>
              <div v-else>暂无</div>
<!--              <div class="desc__item">-->
<!--                <span class="desc__item__label">本周完成：</span>-->
<!--                <span class="desc__item__value">0家</span>-->
<!--              </div>-->
<!--            <div class="desc__item">-->
<!--              <span class="desc__item__label">进行中：</span>-->
<!--              <span class="desc__item__value">14家（黄石东瑞，临沂骏驰，信阳新东方，大同驭领，苍南鹏瑞，青海诚骏，承德瑞虎，常州瑞彩，汕头汕阳，景德镇安顺，海南和奇祥，开封裕上，徐州瑞彩，徐州瑞彩云龙分公司）</span>-->
<!--            </div>-->
<!--            <div class="desc__item">-->
<!--              <span class="desc__item__label">取消/暂缓：</span>-->
<!--              <span class="desc__item__value">0家</span>-->
<!--            </div>-->
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
    import {debitDetail} from "module/approve/api/reimbursement/debit";

    const chartOption = {
        color: ['#2781DB', '#06ACFF', '#7585A2'],
        legend: {
            data: [ '已完成', '进行中', '取消/暂缓'],
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
            formatter: function (event) {
                const series =  chartOption.series.find(item=>item.name ===event.seriesName)
                let str = ''
                const list = series.tooltipList[event.dataIndex].filter((item)=>item.changeState === event.seriesName)
                list.forEach((item)=>{
                    const  dealerShortName = item.dealerShortName|| ''
                    const mark = item.mark? `(${item.mark})`: ''
                    str = str + `${dealerShortName}${mark}<br>`
                })
                return str
            }
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
                name: '已完成',
                type: 'bar',
                barWidth: 16,
                stack: '广告',
                tooltipList: [],
                label: {
                    show: true,
                    position: 'insideRight'
                },
                data: [1]
            },
            {
                name: '进行中',
                type: 'bar',
                stack: '广告',
                barWidth: 16,
                tooltipList: [],
                label: {
                    show: true,
                    position: 'insideRight'
                },
                data: []
            },
            {
                name: '取消/暂缓',
                type: 'bar',
                stack: '广告',
                barWidth: 16,
                tooltipList: [],
                label: {
                    show: true,
                    position: 'insideRight'
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
                ongoingCount: 0,
                risksCount: 0,
                cancelCount: 0,
                finishCount: 0,
                noUpperCount: 0,
                otherCount: 0,
                upperCount: 0,
                totalCount: 0,
                generalChange: '',
            };
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
                    this.setChartOption(data.chart)
                }
            }
        },
        created(){

        },
        methods: {
            resetChartSize() {
                this.chart.resize()
            },

            setData({count={}, change={}}){
                this.ongoingCount = count.ongoingCount || 0
                this.risksCount = count.risksCount || 0
                this.cancelCount = count.cancelCount || 0
                this.finishCount = count.finishCount || 0
                this.noUpperCount = count.noUpperCount || 0
                this.otherCount = count.otherCount || 0
                this.upperCount = count.upperCount || 0
                this.totalCount = count.totalCount || 0
                this.generalChange = change.generalChange || ''
            },

            setChartOption(list=[]){
                // const processing =  data.map((item)=>{
                //     if(Array.isArray((item.countVOList))){
                //         const target = item.countVOList.find(state=>state.changeState === '进行中')
                //         return target && target.count? target.count: 0
                //     }else {
                //         return 0
                //     }
                // })
                //
                //
                //
                // const completed =  data.map((item)=>{
                //     if(Array.isArray((item.countVOList))){
                //         const target = item.countVOList.find(state=>state.changeState === '已完成')
                //         return target && target.count? target.count: 0
                //     }else {
                //         return 0
                //     }
                // })

                const processing = []
                const processingChangeList = []
                const months = [1,2,3,4,5,6,7,8,9,10,11,12];
                const data = months.map((month)=>list.find(item=>item.month === month))
                data.forEach((item)=>{
                    if(item && Array.isArray((item.countVOList))){
                        const target = item.countVOList.find(state=>state.changeState === '进行中')
                        if(target){
                            const count = target.count? target.count: 0
                            const list = item.changeDealerVOList? item.changeDealerVOList: []
                            processing.push(count)
                            processingChangeList.push(list);
                        }else{
                            processing.push('')
                            processingChangeList.push([]);
                        }
                    }else{
                        processing.push('')
                        processingChangeList.push([]);
                    }
                })



                const completedList = []
                const completed = []
                data.forEach((item)=>{
                    if(item && Array.isArray((item.countVOList))) {
                        const target = item.countVOList.find(state => state.changeState === '已完成')
                        if (target) {
                            const count = target.count ? target.count : 0
                            const list = item.changeDealerVOList ? item.changeDealerVOList : []
                            completed.push(count)
                            completedList.push(list);
                        }else{
                            completed.push('')
                            completedList.push(list);
                        }
                    }else{
                        completed.push('')
                        completedList.push(list);
                    }
                })
                const cancel = []
                const cancelList = []
                data.forEach((item)=>{
                    if(item && Array.isArray((item.countVOList))){
                        const target = item.countVOList.find(state=>state.changeState.indexOf('取消') !==-1)

                        if (target) {
                            const count = target.count ? target.count : 0
                            const list = item.changeDealerVOList ? item.changeDealerVOList : []
                            cancel.push(count)
                            cancelList.push(list);
                        }else{
                            cancel.push('')
                            cancelList.push(list);
                        }
                    }else{
                        completed.push('')
                        completedList.push(list);
                    }
                })

                chartOption.series[0].data = completed;
                chartOption.series[1].data = processing;
                chartOption.series[2].data = cancel;
                chartOption.series[0].tooltipList = completedList;
                chartOption.series[1].tooltipList = processingChangeList;
                chartOption.series[2].tooltipList = cancelList;

                this.chart.setOption(chartOption)
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
  .general{
    .overview{
      padding: 32px 24px 0;
      .overview__top{
        display: flex;
        border-bottom: 1px solid #E6E6E6;
        align-items: flex-start;
        padding-bottom: 17px;
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
        .overview__legend__item{
          display: flex;
          width: 50%;
          text-align: center;
          &.green{
            .legend__label{
              &:before{
                background: #73DEB3;
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
            background:rgba(91,143,249,1);
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

