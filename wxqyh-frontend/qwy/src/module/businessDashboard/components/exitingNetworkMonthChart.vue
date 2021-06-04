<template>
  <div  ref="area-chart" class="market-discipline-area-chart" >

  </div>
</template>

<script>
    const chartOption = {
        color: ['#E63752'],
        legend: {
            show: false,
            data: ['违规展示', '违规销售'],
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
            formatter: '{a} <br/>{b}月: {c}'
        },
        grid: {
            top: 22,
            left: 0,
            right: 0,
            bottom: 0,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            show: false,
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
            show: false,
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
                    position: 'top',
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
    export default {
        name: "exitingNetworkMonthChart",
        data(){
            return {
                chart: null,
            }
        },
        props:{
            list:{
                type: Array,
                default(){
                    return []
                }
            },

        },
        watch:{
            list:{
                deep: true,
                handler(value){
                    chartOption.series[0].data = value
                    this.chart.setOption(chartOption)
                }
            }
        },
        methods:{
            legendToggleSelect(name){
                this.chart.dispatchAction({
                    type: 'legendToggleSelect',
                    name: name                    // 图例名称
                })
            }
        },
        mounted() {
            const dom = this.$refs['area-chart']
            this.chart = echarts.init(dom);
            if(this.list){
                chartOption.series[0].data = this.list
            }
            this.chart.setOption(chartOption)
            window.addEventListener('resize', this.resetChartSize)
        }
    }
</script>

<style lang="scss" scoped>
  .market-discipline-area-chart{
    height: 100%;
  }
</style>
