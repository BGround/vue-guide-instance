<template>
  <div class="region">
    <div class="board__content">

      <div class="board__content__left">
        <div class="board__card">
          <div class="board__card__header">
            整体情况
          </div>
          <div class="situation">

            <div class="situation__col">
              <div class="situation__item" v-if="index%2===0" v-for="(item,index) in areaTotals" :key="index">
                <div class="situation__item__label">{{item.area}}：</div>
                <div class="situation__item__value">{{item.total}}例</div>
              </div>
            </div>

            <div class="situation__col">
              <div class="situation__item" v-if="index%2===1" v-for="(item,index) in areaTotals" :key="index">
                <div class="situation__item__label">{{item.area}}：</div>
                <div class="situation__item__value">{{item.total}}例</div>
              </div>
            </div>


          </div>
        </div>

        <div class="board__card mt16">
          <div class="board__card__header">
            本周变化
          </div>
          <div class="change">
            <div v-if="newWeekChange" v-html="newWeekChange"></div>
            <div v-else>暂无</div>
            <!--

                         <div class="change__title">本周共计处理21例</div>
            <div class="change__content">
              <div class="change__col">
                <div class="change__col__item">
                  <div class="change__col__item__label">华东大区：</div>
                  <div class="change__col__item__value">7例</div>
                </div>
                <div class="change__col__item">
                  <div class="change__col__item__label">东南大区：</div>
                  <div class="change__col__item__value">7例</div>
                </div>
              </div>
              <div class="change__col">
                <div class="change__col__item">
                  <div class="change__col__item__label">华东大区：</div>
                  <div class="change__col__item__value">7例</div>
                </div>
                <div class="change__col__item">
                  <div class="change__col__item__label">东南大区：</div>
                  <div class="change__col__item__value">7例</div>
                </div>
              </div>
            </div>

             -->
          </div>
        </div>
      </div>

      <div class="board__content__right">
        <div class="chart">
          <div class="chart__item" v-for="(item, key) in areaOptions" :key="key">
            <div class="chart__item__label">{{key}}</div>
            <div class="chart__item__wrapper">
              <marketDisciplineAreaChart ref="chart" :option="item"></marketDisciplineAreaChart>
            </div>
          </div>

          <div class="chart__item x">
            <div class="chart__item__label"></div>
            <div class="chart__item__wrapper">
              <div id="marketDisciplineChat"></div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
    import {debitDetail} from "module/approve/api/reimbursement/debit";

    const chartOption = {
        color: ['#5B8FF9', '#E63752'],
        legend: {
            data: ['违规展示', '违规销售'],
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
                name: '违规展示',
                type: 'line',
                barWidth: 13,
                data: [],
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 2,
                    shadowColor: 'rgba(91,143,249,0.5)',
                    shadowBlur: 2,
                    shadowOffsetY: 4
                },
            },
            {
                name: '违规销售',
                type: 'line',
                barWidth: 13,
                data: [],
                smooth: true,
                showSymbol: false,
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
    import marketDisciplineAreaChart from '../../components/marketDisciplineAreaChart'
    export default {
        components:{
            marketDisciplineAreaChart
        },
        data() {
            return {
                chartId: 'marketDisciplineChat',
                areaTotals: [],
                newWeekChange: '',
                areaShow:[],
                areaSale:[],
                areaOptions: {}
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
                    this.chartOptions(data.areaShow, data.areaSale)
                    this.$nextTick(()=>{
                        this.initChart()
                    })
                }
            }
        },
        created(){

        },
        methods: {
            resetChartSize() {
                this.chart.resize()
            },

            setData(data){
                console.log(data)
                this.areaTotals = data.areaTotals
                this.newWeekChange = data.newWeekChange || ''
                this.areaShow = data.areaShow
                this.areaSale = data.areaSale
                this.maxUpdateTimeUser = data.maxUpdateTimeUser
            },

            chartOptions(areaShow=[], areaSale=[]){

                const showTypes = { }
                areaShow.forEach((item)=>{
                    if (typeof showTypes[item.area] === 'undefined'){
                        showTypes[item.area] = [item]
                    }else{
                        showTypes[item.area].push(item)
                    }
                })

                const months = [1,2,3,4,5,6,7,8,9,10,11,12];

                Object.keys(showTypes).forEach(key=>{
                    showTypes[key]= months.map((month)=>{
                        const target = showTypes[key].find(item=>item.month === month )
                        return target && target.total || 0
                    })
                })

                const saleTypes = {}
                areaSale.forEach((item)=>{
                    if (typeof saleTypes[item.area] === 'undefined'){
                        saleTypes[item.area] = [item]
                    }else{
                        saleTypes[item.area].push(item)
                    }
                })

                Object.keys(saleTypes).forEach(key=>{
                    saleTypes[key]= months.map((month)=>{
                        const target = saleTypes[key].find(item=>item.month === month )
                        return target && target.total || 0
                    })
                })

                // 合并数据
                const areas = {}
                Object.keys(showTypes).forEach(key=>{
                    if(typeof areas[key] === 'undefined'){
                        areas[key] = {}
                    }
                    areas[key]['show'] = showTypes[key]
                })

                Object.keys(saleTypes).forEach(key=>{
                    if(typeof areas[key] === 'undefined'){
                        areas[key] = {}
                    }
                    areas[key]['sale'] = saleTypes[key]
                })
                this.areaOptions = {}
                this.$nextTick(()=>{
                    this.areaOptions = areas
                })
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


        },
    }
</script>

<style lang="scss" scoped>
  @import '~@/module/businessDashboard/scss/common/board.scss';
  .region{
    .board__card{
      min-height: 240px;
    }
    .situation{
      padding: 16px 25px 16px;
      display: flex;
      .situation__col{
        width: 50%;
        .situation__item{
          display: flex;
          align-items: center;
        }
        .situation__item__label{
          width:70px;
          font-size:14px;
          font-weight:bold;
          line-height:28px;
          color:rgba(51,51,51,1);
        }
        .situation__item__value{
          height:28px;
          font-size:14px;
          font-weight:400;
          line-height:28px;
          color:rgba(102,102,102,1);
        }
      }
    }
    .change{
      padding: 16px 24px;
      .change__content{
        display: flex;
        flex-wrap: nowrap;
        & /deep/ img{
          max-width: 100% !important;
        }
      }
      .change__col__item{
        display: flex;
        height:19px;
        font-size:14px;
        font-weight:400;
        line-height:25px;
        color:rgba(51,51,51,1);
        margin-bottom: 10px;
        .change__col__item__label{
          width:70px;
        }
      }
      .change__title{
        flex-grow: 1;
        height:19px;
        font-size:14px;
        line-height: 19px;
        font-weight:bold;
        margin-bottom: 10px;
        color:rgba(51,51,51,1);
      }
      .change__col{
        width: 50%;
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

  #marketDisciplineChat{
    height: 60px;
  }
</style>

