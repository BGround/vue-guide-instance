<template>
  <div class="region">
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
                <div class="change__data__value">
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
        <div id="marketDisciplineChart1"></div>
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
    const chartOption = {
        color: ['#5B8FF9', '#73DEB3', '#F7C739','#E63752','#E63752'],
        legend: {
            data: [ '在网网点', '冻结网点', '僵尸网点','1.5网网点'],
            backgroundColor: '#ffffff',
            bottom: 10,
            left: 'center',
            itemHeight: 13,
            itemWidth: 13,
            icon: 'rect'
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
            top: 30,
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
                name: '在网网点',
                type: 'bar',
                stack: '广告',
                barWidth: 16,
                data: [],
                label: {
                    show: true,
                    position: 'inside'
                },
            },
            {
                name: '冻结网点',
                type: 'bar',
                stack: '广告',
                barWidth: 16,
                data: [],
                label: {
                    show: true,
                    position: 'inside'
                },
            },
            {
                name: '僵尸网点',
                type: 'bar',
                stack: '广告',
                barWidth: 16,
                data: [],
                label: {
                    show: true,
                    position: 'inside'
                },
            },
            {
                name: '1.5网网点',
                type: 'bar',
                barWidth: 16,
                stack: '广告',
                data: [],
                label: {
                    show: true,
                    position: 'inside'
                },
            }
        ]
    }
    import echarts from 'echarts'
    import exitingNetworkApi from '../../api/exitingNetworkApi'
    export default {
        data() {
            return {
                chartId: 'marketDisciplineChart1',
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
                total: 0,
                exitingNetworkDealers: []
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
                    this.getLargeAreaWithdrawalNetworkList()
                }
            },

        },
        created(){
            console.log(this.form)
            this.getMonthWithdrawalNetwork()
            this.getLargeAreaWithdrawalNetworkList()
        },
        methods: {


            getMonthWithdrawalNetwork() {
                exitingNetworkApi.getMonthWithdrawalNetwork(this.form).then(data => {
                    if (data) {
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

            getLargeAreaWithdrawalNetworkList() {
                exitingNetworkApi.getLargeAreaWithdrawalNetworkList(this.form).then(data => {
                    const list = data && data.list ? data.list : [];
                    const onlineList = [];
                    const frozenList = [];
                    const zombieList = [];
                    const net15List = [];
                    const xAxisData = []
                    list.forEach((item) => {
                        onlineList.push(item.dotTypeTheNet || '')
                        frozenList.push(item.dotTypeFrozen || '')
                        zombieList.push(item.dotTypeCorpse || '')
                        net15List.push(item.dotType4 || '')
                        xAxisData.push(item.warZone)
                    })

                    chartOption.series[0].data = onlineList
                    chartOption.series[1].data = frozenList
                    chartOption.series[2].data = zombieList
                    chartOption.series[3].data = net15List
                    chartOption.xAxis.data = xAxisData
                    this.chart.setOption(chartOption)
                })
            },

            resetChartSize() {
                this.chart.resize()
            },
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
  .region{
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
  }
  #marketDisciplineChart1{
    height: 520px;




  }
</style>

