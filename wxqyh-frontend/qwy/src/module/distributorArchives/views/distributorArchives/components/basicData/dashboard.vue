<template>
  <div class="dashboardWrap">
    <div :id="chartId"
      style="width:200px;height:120px;"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {}
  },
  mounted() {
      setTimeout(()=>{
          this.renderFun()
      },500)
  },
  methods: {
    renderFun() {
      let dom = document.getElementById(this.chartId)
      let myChart = echarts.init(dom)
      let option = {
        tooltip: {
          show: true,
          formatter: '{b}：{c}%',
          backgroundColor: 'rgba(50,50,50,0.7)', // 提示框浮层的背景颜色。注意：series.tooltip 仅在 tooltip.trigger 为 'item' 时有效。
          borderColor: '#333', // 提示框浮层的边框颜色。...
          borderWidth: 0, // 提示框浮层的边框宽。...
          padding: 5, // 提示框浮层内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。...
          textStyle: {
            // 提示框浮层的文本样式。...
            // color ,fontStyle ,fontWeight ,fontFamily ,fontSize ,lineHeight ,.......
          }
        },
        grid: {
          left: '0',
          right: '0'
        },
        series: [
          {
            name: '业务指标',
            type: 'gauge',
            detail: { formatter: '{value}%' },
            data: [{ value: 50, name: '完成率' }],
            min: 0,
            max: 160,
            splitNumber: 1,
            radius: '100%',
            startAngle: 180, //开始角度 左侧角度
            endAngle: 0, //结束角度 右侧
            center: ['50%', '50%'],
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[0.4, '#5294FF'], [1, '#edf4ff']],
                width: 10
              }
            },
            // data: [{ value: 10, name: '在职率' }],
            data:
              this.columns.length > 0
                ? this.columns : [{ value: 0, name: '配备率' }],
            splitLine: {
              // 分隔线样式。
              show: false // 是否显示分隔线,默认 true。
            },
            axisLabel: {
              // 刻度标签。
              show: true, // 是否显示标签,默认 true。
              distance: -40, // 标签与刻度线的距离,默认 5。
              color: '#000', // 文字的颜色,默认 #fff。
              fontSize: 12, // 文字的字体大小,默认 5。
              formatter: '{value}' // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
            },
            axisTick: {
              // 刻度(线)样式。
              show: false // 是否显示刻度(线),默认 true。
            },

            pointer: {
              // 仪表盘指针。
              show: false // 是否显示指针,默认 true。
            },

            title: {
              // 仪表盘标题。
              show: true, // 是否显示标题,默认 true。
              offsetCenter: [0, '-40%'], //相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: '#999', // 文字的颜色,默认 #333。
              fontSize: 12 // 文字的字体大小,默认 15。
            },
            detail: {
              // 仪表盘详情，用于显示数据。
              show: true, // 是否显示详情,默认 true。
              offsetCenter: [0, '1%'], // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: '#333', // 文字的颜色,默认 auto。
              fontSize: 14, // 文字的字体大小,默认 15。
              formatter: '{value}%' // 格式化函数或者字符串
            }
          }
        ]
      }

      // setInterval(function () {
      option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0
      myChart.setOption(option, true)
      // },2000);
    }
  },
  props: {
    chartId: {
      type: String,
      default: 'ashboardChart'
    },
    columns: {
      type: Array
    }
  }
}
</script>
