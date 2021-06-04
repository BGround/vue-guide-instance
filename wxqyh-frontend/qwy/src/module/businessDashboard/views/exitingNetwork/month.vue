<template>
  <div class="month">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card">
          <div class="board__card__header">
            整体情况
          </div>
           <div class="situation">

            <div class="situation__item" v-for="(item, index) in situationList" :key="index">
              <div class="situation__left">
                <h4 class="situation__left__value">{{item.dotTypeCount}}家</h4>
                <div class="situation__left__label">{{item.dotType}}</div>
              </div>
              <div class="situation__right">
                <span>主动申请：{{item.netTypeApply}}家</span>
                <span>主动清退：{{item.netTypeRetreat}}家</span>
              </div>
            </div>

          </div>
        </div>

        <div class="board__card mt16">
          <div class="board__card__header">
            本周变化
          </div>

          <div class="change">
            <div class="change__top">
              <div class="change__header">
                <h3 class="change__header__title">整体情况</h3>
              </div>
              <h3 class="change__data" v-popover:popover>
                <div class="change__data__value" >
                 <span> {{total}}</span><small>家</small>
                </div>
                <div class="change__data__label">已办理退网</div>
              </h3>
            </div>
            <div class="change__bottom">
                <div class="dot">
                  <div class="dot__item" v-for="(item, index) in weekList" :key="index">
                    <div class="dot__item__name">{{item.dotType}}</div>
                    <div class="dot__item__name">{{item.dotTypeCount}}</div>
                  </div>
                </div>
            </div>
          </div>

        </div>
      </div>

      <div class="board__content__right">
        <div class="chart">
          <div class="chart__item">
            <div class="chart__item__label">在网网点</div>
            <div class="chart__item__wrapper">
              <exitingNetworkMonthChart ref="chart" :list="onlineList"></exitingNetworkMonthChart>
            </div>
          </div>

          <div class="chart__item">
            <div class="chart__item__label">冻结网点</div>
            <div class="chart__item__wrapper">
              <exitingNetworkMonthChart ref="chart" :list="frozenList"></exitingNetworkMonthChart>
            </div>
          </div>


          <div class="chart__item">
            <div class="chart__item__label">僵尸网点</div>
            <div class="chart__item__wrapper">
              <exitingNetworkMonthChart ref="chart" :list="zombieList"></exitingNetworkMonthChart>
            </div>
          </div>

          <div class="chart__item">
            <div class="chart__item__label">1.5网</div>
            <div class="chart__item__wrapper">
              <exitingNetworkMonthChart ref="chart" :list="net15List"></exitingNetworkMonthChart>
            </div>
          </div>

          <div class="chart__item">
            <div class="chart__item__label">汇总</div>
            <div class="chart__item__wrapper">
              <exitingNetworkMonthChart ref="chart" :list="totalList"></exitingNetworkMonthChart>
            </div>
          </div>

          <div class="chart__item x">
            <div class="chart__item__label"></div>
            <div class="chart__item__wrapper">
              <div id="exitingNetworkChart"></div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <el-popover
      ref="popover"
      placement="right"
      title="已办理退网经销商"
      width="200"
      trigger="hover"
      :content="exitingNetworkDealers.join(',') || '暂无'">
    </el-popover>
  </div>
</template>

<script>

    import exitingNetworkApi from '../../api/exitingNetworkApi'

    const chartOption = {
        color: [ '#E63752'],
        legend: {
            data: ['退网展示'],
            bottom: 12,
            left: 'center',
            itemHeight: 13,
            itemWidth: 26,
        },
        tooltip: {
            backgroundColor: '#ffffff',
            textStyle: {
                color: '#2781DB'
            },
            trigger: 'item',
            extraCssText: 'box-shadow:0px 2px 3px rgba(0,0,0,0.1);',
            formatter: '{a} <br/>{b}: {c}'
        },
        grid: {
            top: 0,
            left: 25,
            right: 0,
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
        series: [
            {
                name: '退网展示',
                type: 'line',
                barWidth: 13,
                data: [],
                smooth: true,
                // showSymbol: false,
                label: {
                    show: true,
                    position: 'bottom',
                },
                lineStyle: {
                    width: 2,
                    shadowColor: 'rgba(230,55,82,0.5)',
                    shadowBlur: 2,
                    shadowOffsetY: 4
                },
            }
        ]
    }
    import echarts from 'echarts'
    import exitingNetworkMonthChart from '../../components/exitingNetworkMonthChart'
    export default {
        components:{
            exitingNetworkMonthChart
        },
        data() {
            return {
                chartId: 'exitingNetworkChart',
                areaTotals: [],
                newWeekChange: '',
                areaShow:[],
                areaSale:[],
                areaOptions: {},
                form:{
                  month: this.date.month,
                  year: this.date.year
                },

                onlineList: [],
                frozenList : [],
                zombieList: [],
                net15List: [],
                totalList: [],
                situationList: [],
                weekList:[],
                exitingNetworkDealers:  [], // 本周已退网经销商
                total: 0,
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
                    this.getMonthWithdrawalNetwork()
                    this.getMonthWithdrawalNetworkList()
                }
            },

        },
        created(){
            console.log(this.form)
            this.getMonthWithdrawalNetwork()
            this.getMonthWithdrawalNetworkList()
        },
        methods: {


          getMonthWithdrawalNetwork(){
            exitingNetworkApi.getMonthWithdrawalNetwork(this.form).then(data=>{
              if(data){
                  this.situationList = data.list || []
                  this.weekList = data.weekList || [];
                  const total = this.weekList.map((item)=> item.dotTypeCount).reduce((init, count)=> {
                      return init + count
                  }, 0)
                  this.exitingNetworkDealers = this.weekList.map((item)=>{
                      return item.dealerName
                  })
                  this.total = total
              }

              if(data && data.user){
                this.$emit('change',{
                    updateUser: data.user.updateUser || '',
                    updateTime: data.user.updateTime || '',
                })
              }else {
                  this.$emit('change', {
                      updateUser: '',
                      updateTime: ''
                  })
              }

            })
          },

            getMonthWithdrawalNetworkList(){
                this.onlineList = [];
                this.frozenList = [];
                this.zombieList = [];
                this.net15List = [];
                this.totalList = [];
                exitingNetworkApi.getMonthWithdrawalNetworkList(this.form).then(data=>{
                    const list = data && data.list ? data.list : [];
                    const months = [1,2,3,4,5,6,7,8,9,10,11,12]
                    months.forEach((month)=>{
                        const target = list.find(item => item.month === month)
                        if(target){
                            this.onlineList.push(target.dotTypeTheNet || 0)
                            this.frozenList.push(target.dotTypeFrozen || 0)
                            this.zombieList.push(target.dotTypeCorpse || 0)
                            this.net15List.push(target.dotType4 || 0)
                            this.totalList.push(target.dotTypeCount || 0)
                        }else {
                            this.onlineList.push(0)
                            this.frozenList.push(0)
                            this.zombieList.push(0)
                            this.net15List.push(0)
                            this.totalList.push(0)
                        }
                    })
                })
            },

            resetChartSize() {
                this.chart.resize()
            },

            initChart(){
                const dom = document.getElementById(this.chartId)
                this.chart = echarts.init(dom);
                this.chart.setOption(chartOption)
                window.addEventListener('resize', this.resetChartSize)
                this.chart.on('legendselectchanged', (event)=>{
                    this.$refs['chart'].forEach((chart)=>{
                        chart.legendToggleSelect(event.name)
                    })
                })
            }

        },
        computed:{
            hasChartData(){
                console.log(Object.keys(this.areaOptions).length >0)
                return Object.keys(this.areaOptions).length > 0
            }
        },
        mounted() {

          this.initChart()
        },
    }
</script>

<style lang="scss" scoped>
  @import '~@/module/businessDashboard/scss/common/board.scss';
  .month{
    .board__card{
      min-height: 286px;
    }
     .situation{
      padding: 0 24px 0 24px;
      .situation__item{
        padding: 16px 0 17px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        border-bottom: 1px solid rgba(230, 230, 230, 1);
        &:nth-child(1){
          .situation__left__value{
            color: #5B8FF9;
          }
        }
        &:nth-child(2){
          .situation__left__value{
            color: #73DEB3;
          }
        }
        &:nth-child(3){
          .situation__left__value{
            color: #FD9707;
          }
        }
        &:nth-child(4){
          .situation__left__value{
            color: #EB7F65;
          }
        }
        &:last-child{
          border-bottom: none;
        }
        .situation__left__value{
          height:26px;
          font-size:20px;
          font-weight:bold;
          line-height:26px;
          color:rgba(51,51,51,1);
        }
        .situation__left__label{
          height:19px;
          font-size:14px;
          font-weight:400;
          line-height:19px;
          color:rgba(102,102,102,1);
        }
      }
    }
    .change{
      & /deep/ img{
        max-width: 100% !important;
      }
      padding: 32px 24px 0;
      .change__top{
        display: flex;
        border-bottom: 1px solid #E6E6E6;
        align-items: flex-start;
        padding-bottom: 17px;
      }
      .change__header{
        margin-right: auto;
      }
      .change__header__title{
        height:26px;
        font-size:20px;
        font-weight:bold;
        line-height: 20px;
        color:rgba(20,30,40,1);
      }
      .change__header__subtitle{
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
      .change__data{
        text-align: right;
        cursor: pointer;
        .change__data__value{
          span{
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
          small{
            font-size: 14px;
          }
        }
        .change__data__label{
          height:19px;
          font-size:14px;
          font-weight:400;
          line-height:19px;
          color:rgba(102,102,102,1);
        }
      }
      .change__bottom{
        /*height: 50px;*/
        /*line-height: 50px;*/
        padding-bottom: 16px;
        .dot{
          display: flex;
          flex-wrap: wrap;
          .dot__item{
            flex-basis: 25%;
            margin-top: 18px;
            .dot__item__name{
              height:19px;
              font-size:14px;
              font-weight:400;
              line-height:19px;
              color:rgba(102,102,102,1);
            }
            .dot__item__value{
              height:19px;
              font-size:14px;
              font-weight:bold;
              line-height:19px;
              color:rgba(51,51,51,1);
            }
          }
        }
      }
    }

    .board__content__right{
      min-height: 645px;
    }

    .chart{
      padding-top: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #F7F7F7;
      justify-content: flex-end;
      .chart__item{
        justify-content: space-around;
        flex-basis: 80px;
        flex-grow: 1;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        text-align: center;
        &.x{
          flex-basis: 48px;
          flex-grow: 0;
        }
        .chart__item__label{
          flex-basis: 100px;
          flex-shrink: 0;
        }
        .chart__item__wrapper{
          flex-grow: 1;
          height: 100%;
          padding-right: 50px;
        }
      }
    }
  }

  #exitingNetworkChart{
    height: 60px;
  }
</style>

