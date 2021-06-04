<template>
  <div id="saleStackMonth" class="saleClueMonth"></div>
</template>

<script>
  import echarts from 'echarts'
  export default {
      data () {
          return {}
      },
      mounted(){
          this.renderFun()
      },
      methods:{
        renderFun(){
            let dom = document.getElementById("saleStackMonth")
            let myChart = echarts.init(dom)
            let option = {
                title: {
                    text: '月度销售',
                    x:'center',
                    y:'bottom',
                    padding:0,
                    textStyle: {
                        fontSize: 14
                    }
                },
                tooltip: {
                    trigger: "axis",
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '18%',
                    top:'7%',
                    containLabel: true
                },
                legend: {
                    itemWidth:15,
                    itemHeight:15,
                    data:['日常检查','飞行检查','销售满意度'],
                    bottom:22,
                    textStyle: {
                        fontFamily: 'Arial, Verdana, sans...',
                        fontSize: 12,
                        fontStyle: 'normal',
                        fontWeight: 'normal',
                    },
                },
                xAxis: {
                    data: ["1月","2月","3月","4月","5月","6月",'7月','8月','9月','10月','11月','12月'],
                    splitLine:{
                        show:false,
                    },

                },
                yAxis: {
                    splitLine:{
                        show:false,
                    },
                },
                series: [{
                    name: '日常检查',
                    type: 'bar',
                    stack:'使用情况',
                    data: [5, 20, 36, 10, 10, 20],
                    itemStyle:{
                        normal:{color:"#C6001F"},
                    }
                },{
                    name: '飞行检查',
                    type: 'bar',
                    stack:'使用情况',
                    data: [40, 22, 18, 35, 42, 40],
                    itemStyle:{
                        normal:{color:"#FF99A8"},
                    }
                },,{
                    name: '销售满意度',
                    type: 'bar',
                    stack:'使用情况',
                    data: [50, 24, 22, 40, 50, 50],
                    itemStyle:{
                        normal:{color:"#D0D0D0"},
                    }
                }]
            };
            myChart.setOption(option, true)
        }
      }
  }
</script>
