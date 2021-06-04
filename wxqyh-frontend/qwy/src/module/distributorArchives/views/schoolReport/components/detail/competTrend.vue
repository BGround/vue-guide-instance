<template>
  <div id="competTrend"></div>
</template>

<script>
  import echarts from 'echarts'
  export default {
      data() {
          return {}
      },
      props:{
          columns:{
              type: Array
          }
      },
      mounted(){
          this.init()
      },
      methods: {
          init() {
              let dom = document.getElementById('competTrend')
              let myChart = echarts.init(dom)
              let [brand,percentData] = [[],[]]
              this.columns.map(item => {
                  if(item.brand !== '奇瑞') {
                      brand.push('奇瑞-'+item.brand)
                      percentData.push({
                          name: '奇瑞-'+item.brand,
                          type: 'bar',
                          data: [parseFloat(item.relativePercent)]
                      })
                  }
              })

              let option = {
                  title: {
                      text: '',
                  },
                  tooltip: {
                    //   trigger: 'axis',
                      axisPointer: {
                          type: 'shadow'
                      },
                      formatter: "{a} <br/>{b} : ({c}%)",
                    //   formatter: function(a,b,c){
                    //       console.log(a,b,c)
                    //     return 'xx'
                    //   }
                  },
                  legend: {
                      data: brand,
                      x:'center',
                      y:'bottom'
                  },
                  
                  grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '12%',
                      top:'2%',
                      containLabel: true
                  },
                  xAxis: {
                      type: 'value',

                  },
                  yAxis: {
                      type: 'category',
                      data: ['市占率']
                  },
                  series: percentData
              };
              myChart.setOption(option)
          }
      }
  }
</script>
