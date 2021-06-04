<template>
  <div id="marketShareTrend"></div>
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
          this.init()
      },
      methods:{
          init(){
            let dom = document.getElementById('marketShareTrend')
            let myChart = echarts.init(dom)
            let option = {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis',
                    // formatter: "{b} <br/>{a0} : {c0}%"
                     formatter(params){
                        const data = params && params[0]? params[0]: {}
                        if(data.value){
                            return `${data.name}<br>${data.seriesName}:${data.value}%`
                        }else{
                            return `${data.name}<br>${data.seriesName}:0%`
                        }
                    }
                },
                legend: {
                    data:['市占率'],
                    x:'center',
                    y:'bottom'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '12%',
                    top:'8%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月']
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                series: [
                    {
                        name:'市占率',
                        type:'line',
                        data:this.columns
                    }
                ]
            };
            myChart.setOption(option)
          }
      }
  }
</script>
