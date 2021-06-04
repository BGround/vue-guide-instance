<template>
  <div class="stackBarChart"
       id="stackBarChart"></div>
</template>

<script>
  import echarts from 'echarts'
  export default {
      data(){
          return {}
      },
      props:{
          columns:{
              type:Array
          },
          tabTitList:{
              type:Array
          }
      },
      mounted(){
          this.renderStackChart() // 叠加条形图
      },
      methods:{
          renderStackChart() {
              let dom = document.getElementById('stackBarChart')
              let myChart = echarts.init(dom)
              let branName=[]
              let data1=[]
              let data2=[]
              let data3=[]
              let data4=[]
              let data5=[]
              let data6=[]

              this.columns.map(item =>{
                  branName.push(item.brandName)
                  data1.push(item.old)
                  data2.push(item.current)
                  data3.push(item.current_first_quarter)
                  data4.push(item.current_second_quarter)
                  data5.push(item.current_third_quarter)
                  data6.push(item.current_fourth_quarter)
              })

              let option = {
                  tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                          // 坐标轴指示器，坐标轴触发有效
                          type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                      }
                  },
                  legend: {
                      data: this.tabTitList
                      // data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                  },
                  grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      top: '12%',
                      containLabel: true
                  },
                  xAxis: {
                      type: 'value'
                  },
                  yAxis: {
                      type: 'category',
                      data: branName
                  },
                  series: [ {
                      name: this.tabTitList[0],
                      type: 'bar',
                      stack: '总量',
                      label: {
                          normal: {
                              show: true,
                              position: 'insideRight'
                          }
                      },
                      data: data1
                  },
                      {
                          name: this.tabTitList[1],
                          type: 'bar',
                          stack: '总量',
                          label: {
                              normal: {
                                  show: true,
                                  position: 'insideRight'
                              }
                          },
                          data: data2
                      },
                      {
                          name: this.tabTitList[2],
                          type: 'bar',
                          stack: '总量',
                          label: {
                              normal: {
                                  show: true,
                                  position: 'insideRight'
                              }
                          },
                          data: data3
                      },{
                          name: this.tabTitList[3],
                          type: 'bar',
                          stack: '总量',
                          label: {
                              normal: {
                                  show: true,
                                  position: 'insideRight'
                              }
                          },
                          data: data4
                      },{
                          name: this.tabTitList[4],
                          type: 'bar',
                          stack: '总量',
                          label: {
                              normal: {
                                  show: true,
                                  position: 'insideRight'
                              }
                          },
                          data: data5
                      },
                      {
                          name: this.tabTitList[5],
                          type: 'bar',
                          stack: '总量',
                          label: {
                              normal: {
                                  show: true,
                                  position: 'insideRight'
                              }
                          },
                          data: data6
                      },
                  ]
              }
              myChart.setOption(option, true)
          },
      }
  }
</script>
