<template>
  <div class="user-analyze_container">
    <div class="user-analyze_bar">
      <div :class="['bar-item',currentDate === '7' ? 'bar-select' : '']" @click="changeDay('7')">近7天</div>
      <div :class="['bar-item',currentDate === '15' ? 'bar-select' : '']" @click="changeDay('15')">近15天</div>
      <div :class="['bar-item',currentDate === '30' ? 'bar-select' : '']" @click="changeDay('30')">近30天</div>
    </div>
    <!-- 圆环图 -->
    <div class="chart-item">
      <div class="chart-item_name" :class="pcOrMobile? 'chart-item_name_size':''">用户兴趣</div>
      <div class="chart-item_wrap">
        <div id="ringChart" class="ring-chart"></div>
        <div class="interest-tip">
          <span class="interest-tip_item interest-me">对我感兴趣</span>
          <span class="interest-tip_item interest-product">对产品感兴趣</span>
          <span class="interest-tip_item interest-web">对官网感兴趣</span>
        </div>
      </div>
    </div>
    <!-- 圆环图 -->
    <!-- 折线图 -->
    <div class="chart-item chart-item_mt">
      <div class="chart-item_name" :class="pcOrMobile? 'chart-item_name_size':''">用户活跃度</div>
      <div class="chart-item_wrap">
        <div id="lineChart" class="line-chart"></div>
      </div>
    </div>
    <!-- 折线图 -->
  </div>
</template>

<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts');
// 引入饼状图
require('echarts/lib/chart/pie');
// 引入折线图
require('echarts/lib/chart/line');
require('echarts/lib/component/tooltip');

import { getSmartAnalyse } from '../../../../api/smallProgram/getBata.js';
export default {
  props:{
    customerId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 判断日期选择的标识符
      currentDate: '7',
      ringChart: null,
      // 圆环图数据
      pieData: [],
      // 用来处理圆环图加载时机
      pieUpFlag:false,
      lineChart: null,
      // 折线图数据
      lineData: {
        dateArray: [],
        visitNumber: []
      },
      // 用来处理折线图加载时机
      lineUpFlag: false,
      // 用来处理折线图点击的提示数据
      showData:[],
      pcOrMobile: false
    };
  },
  components: {
    
  },
  created() {
    // 判断是否为手机端,开启电话按钮功能
    if (_.isMobileApp()) {
      this.pcOrMobile = true
    }
    this.getSmartAnalyse(this.currentDate);
  },
  mounted() {
    this.drawRing();
    this.drawLine();
  },
  methods: {
    getSmartAnalyse(day){
      const data = {
        customerId: this.customerId,
        days: day
      };

      getSmartAnalyse(data,res => {

        // 折线图提示数据
        let list = res.smartAnalyseVO.lineDataVOList;

        // 折线图横坐标数据
        let dateArray = list.map((value,index) => {
          let tem = value.date.split('-');
          return tem[1] + '-' + tem[2];
        });

        // 折线图纵坐标数据
        let visitNumber = list.map((value,index) => {
          return value.value;
        });
        
        this.currentDate = day;
        this.pieData = res.smartAnalyseVO.pieDataVOList;
        this.pieUpFlag = true;
        this.lineUpFlag = true;
        this.lineData.dateArray = dateArray;
        this.lineData.visitNumber = visitNumber;
        this.showData = list;

        this.drawRing(this.pieData);
        this.drawLine(this.lineData);
      });
    },
    changeDay(day){
      if(this.currentDate === day) return;
      this.getSmartAnalyse(day);
    },
    drawRing(option) {
      if(!this.pieUpFlag){
        this.ringChart = echarts.init(document.getElementById('ringChart'));
      }

      if(!option) return;
      // 对我感兴趣
      const a = option[0].value;
      // 对产品感兴趣
      const b = option[1].value;
      // 对官网感兴趣
      const c = option[2].value;
      const total = a + b + c;
      const percentA = Math.floor(a / total * 100);
      const percentB = Math.floor(b / total * 100);
      const percentC = Math.floor(c / total * 100);
     
      let config = {
        series: [{
          type: 'pie',
          radius: ['40%', '75%'],
          center: ['50%', '50%'],
          // 关闭圆环触发交互
          silent: true,
          data: [
            {
              value: percentB,
              name: b + '次',
              itemStyle: {
                color: '#03D890',
              },
              label:{
                show: true,
                color: '#0A1735'
              },
              labelLine: {
                show: true,
                smooth: 0,
                length: 5,
                length2: 30
              }
            },
            {
              value: percentC,
              name: c + '次',
              itemStyle: {
                color: '#FFCF63'
              },
              label:{
                show: true,
                color: '#0A1735'
              },
              labelLine: {
                show: true,
                smooth: 0,
                length: 5,
                length2: 30
              }
            },
            {
              value: percentA,
              name: a + '次',
              itemStyle: {
                color: '#5585F0'
              },
              label:{
                show: true,
                color: '#0A1735'
              },
              labelLine: { //指示线状态
                show: true,
                smooth: 0,
                length: 5,
                length2: 30
              }
            }
          ],
        }]
      }

      //过滤0的数值
      let newData = config.series[0].data.filter((val,index) => {
        return val.value != 0;
      });
      config.series[0].data = newData;

      // 绘制图表
      this.ringChart.setOption(config);
    },
    drawLine(option){

      if(!this.lineUpFlag){
        this.lineChart = echarts.init(document.getElementById('lineChart'));
      }

      if(!option) return;
      const dateArray = option.dateArray;
      const visitNumber = option.visitNumber;

      this.lineChart.setOption({
       // 左右两边缩的时候,横坐标也会自动适应隐藏个别的显示
        grid: {
          left: '10%',
          right: '5%',
          top: '5%'
        },

        tooltip: {
          trigger: 'axis',
          // triggerOn: 'click',
          axisPointer: {
            lineStyle: {
              color: '#085ABF'
            }
          },
          // backgroundColor: '#ccc',
          // position: ['120%', '0%'],
          position:function (pos, params, dom, rect, size) {
            if(+(pos[0] < size.viewSize[0] / 2)){
              return {left: pos[0], top: pos[1] - 80};
            }else{
              return {right: size.viewSize[0] - pos[0], top: pos[1] - 80};
            }
          },
          padding: [5, 10],
          textStyle: {
            color: '#fff'
          },
          extraCssText: 'background: rgba(0,0,0,0.5)',
          formatter:(datas) => {
              return  this.showData[datas[0].dataIndex].date + '</br>' + datas[0].data + '次' + ' ' + datas[0].seriesName;
          }
        },

        dataZoom: [{
          type: 'slider',
          xAxisIndex: 0,
          height: '0',
          show: false,
          start: 0,
          end: 100,
          // 手柄的样式
          handleStyle: {
            width: '20',
            color: "#085ABF",
            borderColor: "#085ABF"
          },
          // 背景
          backgroundColor: "#f7f7f7",
          // 数据背景
          dataBackground: {
            lineStyle: {
              color: "#dfdfdf"
            },
            areaStyle: {
              color: "#dfdfdf"
            }
          },
          // 被start和end遮住的背景
          fillerColor: "#FFEFBE",
          // 拖动时两端的文字提示
          labelFormatter: function (value, params) {
            var str = "";
            if (params.length > 4) {
              str = params.substring(0, 4) + "…";
            } else {
              str = params;
            }
            return str;
          }
        }],

        xAxis: {
          type: 'category',
          // name:'日期',
          data: dateArray,
          boundaryGap: false,
          position: 'end',
          offset: 5,
          nameLocation: 'end',
          nameGap: 5,
          // 竖直线
          splitLine: {
            show: false,
            interval: 'auto',
            lineStyle: {
              color: ['#EEEEEE']
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#85868F'
            }
          },
          axisLabel: {
            margin: 0,
            textStyle: {
              color: '#85868F',
              fontSize: 13
            }
          }
        },
        yAxis: {
          type: 'value',
          // name:'浏览+转发(次)',
          splitLine: {
            lineStyle: {
              color: ['#D8DADD']
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#85868F'
            }
          },
          axisLabel: {
            margin: 5,
            textStyle: {
              color: '#85868F',
              fontSize: 13
            }
          }
        },
        series: [{
            name: '关注',
            type: 'line',
            smooth: false,
            showSymbol: false,
            symbol: 'circle',
            symbolSize: 1,
            data: visitNumber,
            areaStyle: {
              normal: {
                color: '#EEF2FD'
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(16, 79, 193,1)'
              }
            },
            lineStyle: {
              normal: {
                width: 0
              }
            }
          },
          {
            name: '折线',
            type: 'line',
            symbol: 'circle',
            symbolSize: 0,
            data: visitNumber,
            itemStyle: {
              normal: {
                color: '#5585F0'
              }
            },
            lineStyle: {
              normal: {
                color: '#5585F0',
              }
            }
          }
        ]
      });
    }
  }
};
</script>

<style scoped lang="scss">
.user-analyze_container {
  margin-top: 20px;
}
.user-analyze_bar {
  font-size: 0;
  text-align: center;
}

.bar-item {
  font-size: 13px;
  color: #85868F;
  display: inline-block;
  width: 68px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border: 1px solid #D7DADD;
  margin-left: -1px;
  box-sizing: border-box;
  position: relative;
}

.bar-item:first-child {
  border-radius: 4px 0 0 4px;
}

.bar-item:last-child {
  border-radius: 0 4px 4px 0;
}

.bar-select {
  background: #5585F0;
  border-color: #5585F0;
  color: #fff;
  z-index: 4;
}
.chart-item {
  margin-top: 28px;
}
.chart-item_mt {
  margin-top: 56px;
}

.chart-item_name {
  height: 28px;
  font-size: 17px;
  font-weight: bold;
  color: #0A1735;
  position: relative;
  padding-left: 10px;
  margin-left: 14px;
  line-height: 25px;
}


.chart-item_name::before {
  content: "";
  width: 4px;
  height: 16px;
  background: #5585F0;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  // right: 0;
  margin: auto;
}
.chart-item_name_size {
  height: 26px;
  line-height: 28px;
}


.chart-item_wrap {
  margin-top: 28px;
}


.interest-tip {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 15px;
}

.interest-tip_item {
  font-size: 12px;
  color: #5A5E66;
  position: relative;
  padding-left: 15px;
}

.interest-tip_item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.interest-me::after {
  background: #5585F0;
}

.interest-product::after {
  background: #03D890;
}

.interest-web::after {
  background: #FFCF63;
}
.ring-chart {
  width: 100%;
  height: 300px;
}
.line-chart {
  width: 100%;
  height: 300px;
}
</style>
