<template>
  <div class="important">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card overview">
          <div class="overview__top">
           <div class="overview__header">
             <h3 class="overview__header__title">重大变更</h3>
             <h4 class="overview__header__subtitle">业务进展</h4>
           </div>
            <h3 class="overview__data">
              <div class="overview__data__value">{{totalCount}}</div>
              <div class="overview__data__label">累计变更</div>
            </h3>
          </div>
          <div class="overview__bottom">
            <div class="overview__legend">
              <div class="overview__legend__item blue">
                <div class="legend__label">已完成</div>
                <div class="legend__value">{{finishCount}}</div>
              </div>
              <div class="overview__legend__item green">
                <div class="legend__label">进行中</div>
                <div class="legend__value">{{ongoingCount}}</div>
              </div>
              <div class="overview__legend__item gray">
                <div class="legend__label">取消/暂缓变更</div>
                <div class="legend__value">{{cancelCount}}家 <small>（累计变更不含）</small></div>
              </div>
            </div>
            <div class="meeting">
              <div class="meeting__item">
                <div class="meeting__item__label">上会</div>
                <div class="meeting__item__value">{{upperCount}}</div>
              </div>
              <div class="meeting__item">
                <div class="meeting__item__label">未上会</div>
                <div class="meeting__item__value">{{noUpperCount}}</div>
              </div>
            </div>
          </div>

        </div>

        <div class="board__card mt16 desc">
          <div class="board__card__header">
            本周变化
          </div>
          <div class="desc__content">
            <div v-if="progressChange" v-html="progressChange"></div>
            <div v-else>暂无</div>
            <!--
            <div class="desc__item">
              <span class="desc__item__label">完成重大变更：</span>
              <span class="desc__item__value">3家（金昌昶瑞源，青岛英瑞，广州陆高）</span>
            </div>
            <div class="desc__item">
              <span class="desc__item__label">完成陈述：</span>
              <span class="desc__item__value">1家（湛江东富）</span>
            </div>
            <div class="desc__item">
              <span class="desc__item__label">完成网络委员会：</span>
              <span class="desc__item__value">1家（广州陆高）</span>
            </div>
            <div class="desc__item">
              <span class="desc__item__label">完成缴纳保证金：</span>
              <span class="desc__item__value">3家（青岛华泰，宁波宏瑞，广州陆高）</span>
            </div>
            <div class="desc__item">
              <span class="desc__item__label">完成清算：</span>
              <span class="desc__item__value">0家</span>
            </div>
            <div class="desc__item">
              <span class="desc__item__label">异常（超期等）：</span>
              <span class="desc__item__value">简阳百兴取消变更</span>
            </div>
            -->
          </div>
        </div>
      </div>

      <div class="board__content__right">
        <div id="changeEnterpriseInfo1"></div>
      </div>

    </div>
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card overview">
          <div class="overview__top">
            <div class="overview__header">
              <h3 class="overview__header__title">重大变更</h3>
              <h4 class="overview__header__subtitle yellow">变更原因</h4>
            </div>
            <h3 class="overview__data">
              <div class="overview__data__value">{{totalCount}}</div>
              <div class="overview__data__label">累计变更</div>
            </h3>
          </div>
          <div class="overview__bottom">
            <div class="overview__legend">
              <div class="overview__legend__item red">
                <div class="legend__label">买卖关系</div>
                <div class="legend__value">{{buyAndSellCount}}</div>
              </div>
              <div class="overview__legend__item yellow">
                <div class="legend__label">规避风险</div>
                <div class="legend__value">{{risksCount}}</div>
              </div>
              <div class="overview__legend__item gray">
                <div class="legend__label">增资/减资及其他</div>
                <div class="legend__value">{{otherCount}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="board__card mt16 desc">
          <div class="board__card__header">
            本周变化
          </div>
          <div class="desc__content">

            <div v-if="reasonChange" v-html="reasonChange"></div>
            <div v-else>暂无</div>
<!--            <div class="desc__item">-->
<!--              <span class="desc__item__label">新增买卖关系：</span>-->
<!--              <span class="desc__item__value">0家</span>-->
<!--            </div>-->
<!--            <div class="desc__item">-->
<!--              <span class="desc__item__label">新增规避风险：</span>-->
<!--              <span class="desc__item__value">1家</span>-->
<!--            </div>-->
<!--            <div class="desc__item">-->
<!--              <span class="desc__item__label">新增增资/减资及其它：</span>-->
<!--              <span class="desc__item__value">2家（广州陆高-控股，湛江东富-控股）</span>-->
<!--            </div>-->
<!--            <div class="desc__item">-->
<!--              <span class="desc__item__label">取消：</span>-->
<!--              <span class="desc__item__value">9家（襄阳行有道，吉林瑞宏，巴州龙驰，大连通洋，重庆万泰，汕头福和，如皋广益 简阳百兴，上海泰莫斯）</span>-->
<!--            </div>-->
          </div>
        </div>
      </div>

      <div class="board__content__right">
        <div id="changeEnterpriseInfo2"></div>
      </div>

    </div>
  </div>
</template>

<script>
    // 进展
    const chartOption1 = {
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
                const series =  chartOption1.series.find(item=>item.name ===event.seriesName)
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
                data: [],
                tooltipList:[],
                label: {
                    show: true,
                    position: 'insideRight'
                },
            },
            {
                name: '进行中',
                type: 'bar',
                stack: '广告',
                barWidth: 16,
                label: {
                    show: true,
                    position: 'insideRight'
                },
                data: [],
                tooltipList:[]
            },
            {
                name: '取消/暂缓',
                type: 'bar',
                stack: '广告',
                barWidth: 16,
                label: {
                    show: true,
                    position: 'insideRight'
                },
                data: [],
                tooltipList:[]
            },

        ]
    }

    // 变更原因
    const chartOption2 = {
        color: ['#E63752', '#F7C739', '#7585A2'],
        legend: {
            data: [ '买卖关系', '规避风险', '增资/减资及其他'],
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
                const series =  chartOption2.series.find(item=>item.name ===event.seriesName)
                let str = ''
                const list = series.tooltipList[event.dataIndex].filter((item)=>item.changeReason === event.seriesName)
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
                name: '买卖关系',
                type: 'bar',
                barWidth: 16,
                stack: '广告',
                tooltipList: [],
                label: {
                    show: true,
                    position: 'insideRight'
                },
                data: []
            },
            {
                name: '规避风险',
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
                name: '增资/减资及其他',
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
                chartId1: 'changeEnterpriseInfo1',
                chartId2: 'changeEnterpriseInfo2',
                totalCount: 0,
                finishCount: 0,
                ongoingCount: 0,
                cancelCount: 0,
                upperCount: 0,
                noUpperCount: 0,
                buyAndSellCount: 0,
                risksCount: 0,
                otherCount: 0,
                progressChange: '',
                reasonChange: '',
            };
        },
        props:{
            config:{
                type: Object,
                required: true,
            }
        },
        created(){

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
        methods: {
            resetChartSize() {
                this.chart1.resize()
                this.chart2.resize()
            },

            setData({count={}, change={}}){
                this.totalCount = count.totalCount
                //已完成
                this.finishCount = count.finishCount
                //进行中
                this.ongoingCount = count.ongoingCount
                //取消暂缓
                this.cancelCount = count.cancelCount
                //上会
                this.upperCount = count.upperCount
                //未上会
                this.noUpperCount = count.noUpperCount
                //买卖关系
                this.buyAndSellCount = count.buyAndSellCount
                //规避风险
                this.risksCount = count.risksCount
                //其他
                this.otherCount = count.otherCount
                this.progressChange = change.progressChange || ''
                this.reasonChange = change.reasonChange || ''
            },

            setChartOption(list=[]){

                const months = [1,2,3,4,5,6,7,8,9,10,11,12];
                const data = months.map((month)=>list.find(item=>item.month === month))

                const processing = []
                const processingChangeList = []

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
                        }else {
                            completed.push('')
                            completedList.push([]);
                        }
                    }else{
                        completed.push('')
                        completedList.push([]);
                    }

                })

                const cancel = []
                const cancelList = []
                data.forEach((item)=>{
                    if(item && Array.isArray((item.countVOList))){
                        console.log(JSON.stringify(item.countVOList))
                        const target = item.countVOList.find(state=>state.changeState === '取消/暂缓')
                        if (target) {
                            const count = target.count ? target.count : 0
                            const list = item.changeDealerVOList ? item.changeDealerVOList : []
                            cancel.push(count)
                            cancelList.push(list);
                        }else {
                            cancel.push('')
                            cancelList.push([]);
                        }
                    }else{
                        cancel.push('')
                        cancelList.push([]);
                    }

                })

                const relation = []
                const relationList = []
                data.forEach((item)=>{
                    if(item && Array.isArray((item.countReasonVOList))){
                        const target = item.countReasonVOList.find(reason=>reason.changeReason === '买卖关系')
                        if (target) {
                            const count = target.count ? target.count : 0
                            const list = item.changeDealerVOList ? item.changeDealerReasonVOList : []
                            relation.push(count)
                            relationList.push(list);

                        }else{
                            relation.push('')
                            relationList.push([]);
                        }
                    }else{
                        relation.push('')
                        relationList.push([]);
                    }

                })

                const risk =[]
                const riskList = []
                data.forEach((item)=>{
                    if(item && Array.isArray((item.countReasonVOList))){
                        const target = item.countReasonVOList.find(reason=>reason.changeReason === '规避风险')
                        if (target) {
                            const count = target.count ? target.count : 0
                            const list = item.changeDealerVOList ? item.changeDealerReasonVOList : []
                            risk.push(count)
                            riskList.push(list);
                        }else{
                            risk.push('')
                            riskList.push([]);
                        }
                    }else{
                        risk.push('')
                        riskList.push([]);
                    }

                })

                const other =[]
                const otherList = []
                data.forEach((item)=>{
                    if(item && Array.isArray((item.countReasonVOList))){
                        const target = item.countReasonVOList.find(reason=>reason.changeReason && reason.changeReason.indexOf('增资') !== -1)
                        if (target) {
                            const count = target.count ? target.count : 0
                            const list = item.changeDealerVOList ? item.changeDealerReasonVOList : []
                            other.push(count)
                            otherList.push(list);
                        }else{
                            other.push('')
                            otherList.push([]);
                        }
                    }else{
                        other.push('')
                        otherList.push([]);
                    }

                })





                chartOption1.series[0].data = completed;
                chartOption1.series[1].data = processing;
                chartOption1.series[2].data = cancel;

                chartOption1.series[1].tooltipList = processingChangeList;
                chartOption1.series[0].tooltipList = completedList;
                chartOption1.series[2].tooltipList = cancelList;

                chartOption2.series[0].data = relation
                chartOption2.series[1].data = risk
                chartOption2.series[2].data = other

                chartOption2.series[0].tooltipList = relationList
                chartOption2.series[1].tooltipList = riskList
                chartOption2.series[2].tooltipList = otherList
                this.chart1.setOption(chartOption1)
                this.chart2.setOption(chartOption2)
            }

        },
        components: {

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
        .overview__legend__item{
          padding-top: 16px;
          padding-bottom: 16px;
          margin-right: 20px;
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
      min-height: 190px;
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
        margin-right: 8px;
        font-size:14px;
        font-weight:bold;
        line-height:19px;
        color:rgba(51,51,51,1);
        flex-basis: 112px;
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
  #changeEnterpriseInfo1,#changeEnterpriseInfo2{
    height: 520px;
    background: #F7F7F7;
  }
</style>

