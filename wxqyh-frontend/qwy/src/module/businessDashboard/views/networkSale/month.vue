<template>
  <div class="general">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card overview">
            <div class="overview__top">
              <h3 class="overview__title">整体情况</h3>
              <h3 class="overview__data">
                <div class="overview__data__value">{{newNetworkHomeNumber}}</div>
                <div class="overview__data__label">新网累计</div>
              </h3>
            </div>
            <div class="overview__bottom">
                <div class="overview__legend">
                  <div class="overview__legend__item">
                    <div class="legend__label">提车</div>
                    <div class="legend__value">{{newNetworkLift}}</div>
                  </div>
                  <div class="overview__legend__item green">
                    <div class="legend__label">实销</div>
                    <div class="legend__value">{{newNetworkSales}}</div>
                  </div>
                </div>

              <div class="overview__bottom__chart">
                <circularChart color="#FD9707" auxiliaryColor="#FFF5E7" label="贡献率" :ratio="carContributionRate"></circularChart>
                <circularChart color="RGBA(231, 56, 86, 1)" auxiliaryColor="RGBA(251, 235, 238, 1)" label="贡献率" :ratio="salesContributionRate"></circularChart>
              </div>

            </div>
        </div>

        <div class="board__card mt16 desc">
          <div class="board__card__header">
            本周变化
          </div>
          <div class="desc__content">
            <div v-if="weekChange" v-html="weekChange"></div>
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


    const chartOption = {
        color: ['#5B8FF9', '#73DEB3', '#FD9707', '#E63752'],
        legend: {
            bottom: 10,
            left: 'center',
            itemHeight: 13,
            itemWidth: 13,
            data: [{
                name: '新网提车',
                backgroundColor: '#ffffff',
                icon: 'rect'
            },{
                name: '新网实销',
                icon: 'rect'
            } ,{
                name: '提车贡献率',
                // itemHeight: 13,
                itemWidth: 26,
                // icon: 'circle'
            },{
                name: '实销贡献率',
                // itemHeight: 13,
                itemWidth: 26,
                // icon: 'circle'
            }],

        },
        tooltip: {
            backgroundColor: '#ffffff',
            textStyle: {
                color: '#2781DB'
            },
            trigger: 'item',
            extraCssText: 'box-shadow:0px 2px 3px rgba(0,0,0,0.1);',
            formatter(event){
                if(event.seriesType==='line'){
                    return `${event.seriesName}<br>${event.value}%`
                }else{
                    return `${event.seriesName}<br>${event.value}`
                }
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
            }
        ],
        series: [
            {
                name: '新网提车',
                type: 'bar',
                label: {
                    show: true,
                    position: 'left',
                    fontSize:10,
                },
                barWidth: 13,
            },
            {
                name: '新网实销',
                type: 'bar',
                barWidth: 13,
                label: {
                    show: true,
                    position: 'right',
                    fontSize:10,
                },
                data: []
            },
            {
                name: '提车贡献率',
                type: 'line',
                smooth: true,
                yAxisIndex: 1,
                label: {
                    show: true,
                    position: 'top',
                    formatter(params) {
                        return `${params.value}%`;
                    }
                },
                lineStyle: {
                    width: 2,
                    shadowColor: 'rgba(253, 151, 7, 0.5)',
                    shadowBlur: 4,
                    shadowOffsetY: 8
                },
                // barWidth: 13,
                data: []
            },
            {
                name: '实销贡献率',
                type: 'line',
                smooth: true,
                yAxisIndex: 1,
                // showSymbol: false,
                label: {
                    show: true,
                    position: 'bottom',
                    formatter(params) {
                        return `${params.value}%`;
                    }
                },
                lineStyle: {
                    width: 2,
                    shadowColor: 'rgba(230,55,82,0.5)',
                    shadowBlur: 4,
                    shadowOffsetY: 8
                },
                // barWidth: 13,
                data: []
            }
        ]
    }
    import echarts from 'echarts'
    import networkSaleApi from '../../api/networkSaleApi'
    import circularChart from "@/module/businessDashboard/components/circularChart";
    export default {
        data() {
            return {
                chartId: 'changeEnterpriseInfo',
                form: {
                    year: this.date.year,
                    month: this.date.month,
                },
                monthlyDate: '',
                newNetworkHomeNumber: 0,
                newNetworkLift: 0,
                newNetworkSales: 0,
                nationwideCarLift: 0,
                nationwideSales: 0,
                carContributionRate: 0,
                salesContributionRate: 0,
                weekChange: '',
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
                    this.getMonthlyStatistics()
                }
            },

        },
        created(){
            console.log(this.form)
          this.getMonthlyStatistics()
        },
        methods: {
            resetChartSize() {
                this.chart.resize()
            },

            getMonthlyStatistics(){
                networkSaleApi.getMonthlyStatistics(this.form).then((data)=>{
                    console.log(data)
                    if(data && data.vo){
                        this.monthlyDate= data.vo.monthlyDate || ''
                        this.newNetworkHomeNumber= data.vo.newNetworkHomeNumber || ''
                        this.newNetworkLift= data.vo.newNetworkLift || ''
                        this.newNetworkSales= data.vo.newNetworkSales || ''
                        this.nationwideCarLift= data.vo.nationwideCarLift || ''
                        this.nationwideSales= data.vo.nationwideSales || ''
                        this.carContributionRate= data.vo.carContributionRate? data.vo.carContributionRate/100 : 0
                        this.salesContributionRate= data.vo.salesContributionRate? data.vo.salesContributionRate/100 : 0
                        this.weekChange= data.vo.weekChange || ''

                        this.$emit('change',{
                            updateUser: data.vo.updateUser || '',
                            updateTime: data.vo.updateTime || '',
                        })
                    }else{
                        this.$emit('change',{
                            updateUser:'',
                            updateTime: ''
                        })
                    }
                    if(data && data.list){
                        this.setChartOptions(data.list)
                    }
                })
            },

            setChartOptions(list){
                const months = [1,2,3,4,5,6,7,8,9,10,11,12]
                const pickCarList = []
                const realSaleList = []
                const pickCarContributionRatioList = []
                const realSaleListContributionRatioList = []
                months.forEach(month=>{
                    const target = list.find((item)=>item.month === month)
                    if(target){
                        // pickCarList =
                        const newNetworkSales = target.newNetworkSales || 0
                        const newNetworkLift = target.newNetworkLift || 0
                        const carContributionRate = target.carContributionRate || 0
                        const salesContributionRate = target.salesContributionRate || 0
                        realSaleList.push(newNetworkSales)
                        pickCarList.push(newNetworkLift)
                        pickCarContributionRatioList.push(carContributionRate)
                        realSaleListContributionRatioList.push(salesContributionRate)
                    }else{
                        realSaleList.push(0)
                        pickCarList.push(0)
                        pickCarContributionRatioList.push(0)
                        realSaleListContributionRatioList.push(0)
                    }
                })

                chartOption.series[0].data = pickCarList
                chartOption.series[1].data = realSaleList
                chartOption.series[2].data = pickCarContributionRatioList
                chartOption.series[3].data = realSaleListContributionRatioList
                this.chart.setOption(chartOption)
            }

        },
        components: {
            circularChart
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

      }
      .overview__bottom__chart{
        display: flex;
        justify-content: space-between;
        padding-bottom: 18px;
      }
      .overview__legend{
        height: 50px;
        line-height: 50px;
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
    background: rgba(247, 247, 247, 1);



  }
</style>

