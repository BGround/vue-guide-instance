<template>
  <div :id="id" class="borkenLine"></div>
</template>

<script>
  import echarts from 'echarts'
  export default {
      data () {
          return {}
      },
      props:{
          id:{
              type:String,
              default(){
                  return 'borkenLineWrap'
              }
          },
          columns:{
              type:Object
          }
      },
      mounted(){
          setTimeout(()=>{
              this.renderFun()
          },500)
      },
      methods:{
        renderFun(){
            let dom = document.getElementById(this.id)
            let myChart = echarts.init(dom)
            let option = {
                title: {
                    // text: '月度销售',
                    text: this.columns.title,
                    x:'center',
                    y:'bottom',
                    padding:0,
                    textStyle: {
                        fontSize: 14,
                    },
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['提车','实销','库存'],
                    bottom:25,
                    textStyle: {
                        fontFamily: 'Arial, Verdana, sans...',
                        fontSize: 12,
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '18%',
                    top:'5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    // data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                    data:this.columns.xAxisData
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'提车',
                        type:'line',
                        itemStyle: {
                            normal: {
                                color: "#FF5D83",
                                lineStyle: {
                                    color: "#FF5D83"
                                }
                            }
                        },
                        // stack: '总量',
                        // data:[120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 230, 210]
                        data: this.columns.seriesData1
                    },
                    {
                        name:'实销',
                        type:'line',
                        itemStyle: {
                            normal: {
                                color: "#39DA76",
                                lineStyle: {
                                    color: "#39DA76"
                                }
                            }
                        },
                        // stack: '总量',
                        // data:[120, 182, 191, 234, 290, 330, 310, 101, 134, 90, 230, 210]
                        data:this.columns.seriesData2
                    },
                    {
                        name:'库存',
                        itemStyle: {
                            normal: {
                                color: "#AF9A9F",
                                lineStyle: {
                                    color: "#AF9A9F"
                                }
                            }
                        },
                        type:'line',
                        // stack: '总量',
                        // data:[0, 232, 201, 154, 190, 330, 410, 101, 134, 90, 230, 210]
                        data:this.columns.seriesData3
                    },
                ]
            };
            myChart.setOption(option, true)
        }
      }
  }
</script>
