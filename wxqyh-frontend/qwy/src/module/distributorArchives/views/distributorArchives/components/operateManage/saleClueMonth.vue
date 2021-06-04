<template>
  <div id="saleClueMonth" class="saleClueMonth"></div>
</template>

<script>
  import echarts from 'echarts'
  export default {
      data () {
          return {}
      },
      props:{
          columns:{
              type: Array
          }
      },
      mounted(){
          this.renderFun()
      },
      methods:{
        renderFun(){
            let dom = document.getElementById("saleClueMonth")
            let myChart = echarts.init(dom)

            let [xAxisData,xslData,gjlData,ddlData,cjlData,sjlData] = [[],[],[],[],[],[]]
            this.columns.map(item => {
                xAxisData.push(item.month+'月')
                xslData.push(item.xsl)
                gjlData.push(item.gjl)
                ddlData.push(item.ddl)
                cjlData.push(item.cjl)
                sjlData.push(item.sjl)
            })

            let option = {
                title: {
                    text: '月度销售',
                    x:'center',
                    y:'bottom',
                    padding:0,
                    textStyle:{
                        fontSize:14
                    }
                },
                tooltip: {
                    trigger: "axis",
                },
                legend: {
                    data:['线索量','跟进率','到店率','试驾率','成交率'],
                    bottom:22,
                    left:'center',
                    textStyle:{
                        color:'#666',
                        fontSize:12
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '18%',
                    top:'7%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    // data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                    data: xAxisData
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'线索量',
                        type:'bar',
                        barWidth : '50%',
                        barGap:'20%',
                        data:xslData
                    },

                    {
                        name:'跟进率',
                        type:'line',
                        data:gjlData,
                        itemStyle:{
                            normal:{
                                color:"#707070"
                            }

                        }
                    },
                    {
                        name:'到店率',
                        type:'line',
                        data:ddlData,
                        itemStyle:{
                            normal:{
                                color:"#2781DB"
                            }

                        }
                    },
                    {
                        name:'试驾率',
                        type:'line',
                        data:sjlData,
                        itemStyle:{
                            normal:{
                                color:"#39DA76"
                            }

                        }
                    },
                    {
                        name:'成交率',
                        type:'line',
                        data:cjlData,
                        itemStyle:{
                            normal:{
                                color:"#F5D023"
                            }

                        }
                    }
                ]
            };

            myChart.setOption(option, true)
        }
      }
  }
</script>
