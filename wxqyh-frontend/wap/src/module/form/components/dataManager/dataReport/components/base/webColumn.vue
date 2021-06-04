<template>
  <div class="webColumn">
    <div :id="'webColumn'+ itemKey" :style="{ height: '300px'}"></div>
  </div>
</template>
<script>
  export default {
    name: "webColumn",
    props: {
      itemKey: {
        type:String
      },
      data: {
        type: Array
      }
    },
    data(){
      return{
        myChart:''
      }
    },
    mounted(){
      this.renderData()
    },
    methods:{
      renderData(){
        var _this = this;
        var data = this.data;
        var dataX = [];
        var dataY = [];
        for(let i=0;i<data.length;i++){
          dataX.push(data[i].name)
          dataY.push(data[i].value)
        }
        var myChart = this.$echarts.init(document.getElementById('webColumn'+_this.itemKey))
        // 绘制图表
        var option = {
          color: ['#5585F0'],
          tooltip: {},
          xAxis: {
            data: dataX,
            axisLine:{
              show: false
            },
            axisTick:{
              show:false
            },
            axisLabel:{
              color:"#7A7D80",
              interval:0,
              formatter : function(params){
                var newParamsName = "";// 最终拼接成的字符串
                var paramsNameNumber = params.length;// 实际标签的个数
                var provideNumber = 6;// 每行能显示的字的个数
                var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
                /**
                 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                 */
                // 条件等同于rowNumber>1
                if (paramsNameNumber > provideNumber) {
                  /** 循环每一行,p表示行 */
                  for (var p = 0; p < rowNumber; p++) {
                    var tempStr = "";// 表示每一次截取的字符串
                    var start = p * provideNumber;// 开始截取的位置
                    var end = start + provideNumber;// 结束截取的位置
                    // 此处特殊处理最后一行的索引值
                    if (p == rowNumber - 1) {
                      // 最后一次不换行
                      tempStr = params.substring(start, paramsNameNumber);
                    } else {
                      // 每一次拼接字符串并换行
                      tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr;// 最终拼成的字符串
                  }

                } else {
                  // 将旧标签的值赋给新标签
                  newParamsName = params;
                }
                //将最终的字符串返回
                return newParamsName
              }
            }
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#E3E4E8',
                opacity: 0.5
              }
            },
            axisLine:{
              show: false
            },
            axisTick:{
              show:false,
            },
            axisLabel:{
              color: '#7A7D80'
            }
          },
          series: [{
            type: 'bar',
            data: dataY,
            barWidth: 24
          }],
          dataZoom:[]
        }
        if(data.length>6){
          option.dataZoom = [{
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            left: 35,
            start: 0,
            end: 50,//初始化滚动条
            height: 8,//组件高度
            right: 40,//右边的距离
            bottom: 0,
            handleColor: '#ddd',//h滑动图标的颜色
            handleStyle: {
              borderColor: "#cacaca",
              borderWidth: "0",
              shadowBlur: 2,
              background: "#ddd",
              shadowColor: "#ddd",
            },
            showDataShadow: false,//是否显示数据阴影 默认auto
            showDetail: false,//即拖拽时候是否显示详细数值信息 默认true
            handleSize: 0
          }];
        }
        myChart.setOption(option);
        this.myChart = myChart
      }
    },
    watch:{
      data(){
        this.myChart.dispose();
        this.renderData()
      }
    }
  }
</script>
<style scopd>
  .webColumn{
    min-height: 224px;
  }
</style>
