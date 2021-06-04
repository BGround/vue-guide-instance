<!-- 销量情况 -->
<template>
  <div class="sales-volume-status">

    <div class="selectbar">
      <div class="selectbar__item selectbar__item--year"
        @click="handleClickYearPicker">
        <span class="selectbar__value">{{currentYear}}年</span>
        <i class="section__icon"></i>
      </div>
      <div class="selectbar__item selectbar__item--month"
        @click="handleClickMonthPicker">
        <span class="selectbar__value">{{currentMonth}}月</span>
        <i class="section__icon"></i>
      </div>
      <!-- <div class="selectbar__item selectbar__item--company"
        @click="handleClickCompanyPicker">
        <span class="selectbar__value">{{companyName}}</span>
        <i class="section__icon"></i>
      </div> -->
    </div>

    <div class="gutter"></div>

    <div class="chart"
      id="sales_status_chart">
    </div>

    <div class="section">
      <div class="section__row">
        <div class="section__col">
          <div class="cell">
            <p class="cell__label">提车数</p>
            <p class="cell__value">
              <span>{{info.getCar ||'-'}}</span>
            </p>
            <p class="cell__attr">
              <span>环比{{info.tiCheHeuanBi? `${info.tiCheHeuanBi}%`:'-'}}</span>
              <span>同比 {{info.tiCheTongBi? `${info.tiCheTongBi}%`:'-'}}</span>
            </p>
          </div>
        </div>

        <div class="section__col">
          <div class="cell">
            <p class="cell__label">实销数</p>
            <p class="cell__value">
              <span>{{info.saleCar ||'-'}}</span>
            </p>
            <p class="cell__attr">
              <span>环比{{info.shiXiaoHuanBi? `${info.shiXiaoHuanBi}%`:'-'}}</span>
              <span>同比 {{info.shiXiaoTongBi? `${info.shiXiaoTongBi}%`:'-'}}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="section__row">
        <div class="section__col">
          <div class="cell">
            <p class="cell__label">库存</p>
            <p class="cell__value">
              <span>{{info.inventory  ||'-'}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="table">
      <div class="table__header">
        <div class="table__row">
          <span class="table__col">品牌</span>
          <span class="table__col">提车数</span>
          <span class="table__col">实销数</span>
        </div>
      </div>
      <div class="table__body">
        <div class="table__row"
          v-for="(item, index) in list"
          :key="index">
          <span class="table__col">{{item.txtsh ||'-'}}</span>
          <span class="table__col table__col--warning">{{item.getCar ||'-'}}</span>
          <span class="table__col">{{item.saleCar ||'-'}}</span>
        </div>

      </div>
    </div>

    <div class="more">
      <p v-if="list.length>0">暂无更多</p>
      <p v-else>暂无数据</p>
    </div>

    <qw-date-picker v-model="isVisibleYearPicke"
      :column-count="1"
      :current="current"
      :format="format"
      @select="handleSelectYear"
      title="">
    </qw-date-picker>

    <qw-picker v-model="isVisibleMonthPicker"
      title="选择"
      :data="monthOptions"
      :selected-index="[1]"
      @select="handleSelectMonth">
    </qw-picker>

  </div>
</template>

<script>
import echarts from 'echarts'
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import {
  getMonthSalesTrend,
  getBdOverallSalesByMonth,
  fenChanPinXiaoLiang
} from '@/module/channelManagement/api/operation'

export default {
  mixins: [reloadApp],
  data() {
    const date = new Date()
    return {
      isVisibleYearPicke: false,
      isVisibleMonthPicker: false,
      format: {
        year: 'YYYY年'
      },
      current: date,
      currentMonth: date.getMonth() + 1,
      companyName: '上海瑞杰汽车有限公司',
      info: {},
      currentYear: date.getFullYear(),
      chartOption: {
        color: ['#53C4FF', '#2DCC82'],
        legend: {
          data: ['提车', '实销'],
          backgroundColor: '#ffffff',
          top: 20,
          right: 15,
          itemHeight: 13,
          itemWidth: 13,
          icon: 'rect'
        },
        grid: {
          top: 50,
          left: 10,
          right: 10,
          bottom: 20,
          containLabel: true
        },
        tooltip: {
          backgroundColor: '#ffffff',
          textStyle: {
            color: '#53C4FF'
          },
          position: 'top',
          trigger: 'item',
          formatter: '{c}',
          extraCssText: 'box-shadow:0px 2px 3px rgba(0,0,0,0.1);'
        },

        xAxis: {
          type: 'category',
          data: [],
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
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999999',
              fontSize: 10
            },
            show: false
          },
          axisTick: {
            // 刻度
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
            name: '提车',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              opacity: 0.5
            },
            emphasis: {
              itemStyle: {
                opacity: 1
              }
            },
            data: []
          },
          {
            name: '实销',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              opacity: 0.5
            },
            emphasis: {
              itemStyle: {
                opacity: 1
              }
            },
            data: []
          }
        ]
      },
      monthOptions: [
        [
          { text: '1月', value: '01' },
          { text: '2月', value: '02' },
          { text: '3月', value: '03' },
          { text: '4月', value: '04' },
          { text: '5月', value: '05' },
          { text: '6月', value: '06' },
          { text: '7月', value: '07' },
          { text: '8月', value: '08' },
          { text: '9月', value: '09' },
          { text: '10月', value: '10' },
          { text: '11月', value: '11' },
          { text: '12月', value: '11' }
        ]
      ],
      companyOptions: [
        {
          value: 0,
          label: 'Option'
        },
        {
          value: 1,
          label: 'Option1'
        },
        {
          value: 2,
          label: 'Option2'
        }
      ],
      list: [], //
      
      erpCarNo: ''
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById('sales_status_chart'))
    this.chart.setOption(this.chartOption)
    window.addEventListener('resize', this.resetChartSize)
  },
  destroyed() {
    window.removeEventListener('resize', this.resetChartSize)
  },

  methods: {
    
    handleClickYearPicker() {
      this.isVisibleYearPicke = true
    },

    handleClickMonthPicker() {
      this.isVisibleMonthPicker = true
    },
    /**
     * 处理选择年份
     */
    handleSelectYear(_, [year, month]) {
      this.currentYear = year
      this.fetchPageData();
    },
    /**
     * 处理选择月份
     */
    handleSelectMonth([value]) {
      this.currentMonth = value;
      this.fetchPageData();
    },

    handleClickCompanyPicker() {
      this.$actionsheet({
        title: '描述',
        options: this.companyOptions
      })
        .then(({ action, item }) => {
          this.companyName = item.label
          this.form.companyId = item.value
        })
        .catch(() => {})
    },

    resetChartSize() {
      this.chart.resize()
    },

    /**
     * 请求页面数据
     */
    fetchPageData() {
      const params = {
        erp: `00000${this.erpCarNo}`,
        yyyymm: `${this.currentYear}${this.currentMonth}`
      }
      // { erp: '0000010145', yyyymm: '201902' }
      //销售情况-提车实销库存
      getBdOverallSalesByMonth(params).then(data => {
        if (data) {
          this.info = data.benDianMonthFinish || {}
        }
      })

      //销售情况-车型提车实销
      fenChanPinXiaoLiang(params).then(data => {
        if (data && data.data && Array.isArray(data.data.monthList)) {
          this.list = data.data.monthList || []
        }
      })
    },

    /**
     * 初始化图表数据
     */
    initChartData() {
      const params = { erp: `00000${this.erpCarNo}` }
      //销售情况-按照月分查询提车实销图标
      getMonthSalesTrend(params).then(data => {
        if (data && data.monthSalesMap && Array.isArray(data.monthSalesMap.getSaleList) ) {
          const options = this.normalizeChartOption(data.monthSalesMap.getSaleList);
          this.chart.setOption(options);
        }
      })
    },

    /**
     * 
     */
    normalizeChartOption(list){
      const xAxisData = list.map((item)=>`${item.month}月`);
      const  pickUpCarSeries = list.map((item)=>item.getcar);
      const  ActualSalesSeries = list.map((item)=>item.salesCar);
      this.chartOption.xAxis.data = xAxisData; 
      this.chartOption.series[0].data = pickUpCarSeries;
      this.chartOption.series[1].data = ActualSalesSeries;
      return this.chartOption;
    }
  },
  created() {
    
    this.erpCarNo = this.$route.query.erpCarNo || ''
    if(!this.erpCarNo){
      this.reloadApp();
      return;
    }
    this.initChartData()
    this.fetchPageData()
  }
}
</script>

<style lang="scss" scoped>
.sales-volume-status {
  background: #ffffff;
  padding-bottom: 50px;
  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }
  .selectbar {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: center;
    background: #ffffff;
  }
  .section__icon {
    display: block;
    width: 9px;
    height: 6px;
    background-image: url('~@/module/channelManagement/static/images/icon_select_arrow.png');
    background-repeat: no-repeat;
    background-size: 100%;
    margin-left: 16px;
  }
  .selectbar__value {
    height: 21px;
    font-size: 15px;
    font-weight: 400;
    line-height: 22px;
    color: rgba(0, 0, 0, 1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .selectbar__item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-shrink: 0;
    margin: 0 30px;
  }
  .selectbar__item--year {
    .selectbar__value {
      width: 55px;
    }
  }
  .selectbar__item--month {
    .selectbar__value {
      width: 36px;
    }
  }
  .selectbar__item--company {
    .selectbar__value {
      width: 150px;
    }
  }

  .chart {
    height: 246px;
  }

  .section {
    padding: 15px;
  }
  .section__row {
    display: flex;
    padding-bottom: 10px;
    justify-content: space-between;
  }

  .section__col {
    width: calc(50vw - 20px);
    @media screen and (min-width: 1024px) {
      width: 350px;
      // width: calc(50vw - 20px);
    }
    &:last-child {
      margin-right: 0;
    }
  }

  .cell {
    background: rgba(247, 248, 250, 1);
    padding: 15px 10px 15px 15px;
  }

  .cell__value {
    height: 28px;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: rgba(198, 0, 31, 1);
    margin-top: 5px;
    display: flex;
    align-items: center;
    .cell__symbol {
      height: 19px;
      font-size: 13px;
      line-height: 19px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      margin-left: auto;
      vertical-align: middle;
    }
  }

  .cell__attr {
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 19px;
    margin-top: 5px;
  }

  .cell__label {
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 19px;
    color: rgba(102, 102, 102, 1);
  }

  .table {
    padding: 13px 15px;
  }

  .table__header {
    background: #666666;
    .table__row {
      color: #ffffff;
    }
  }

  .table__row {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px 0 15px;
  }

  .table__col {
    font-size: 15px;
    width: 30%;
    text-align: center;
  }

  .table__body .table__row {
    &:nth-child(2n + 1) {
      background: rgba(250, 250, 250, 1);
    }
  }

  .table_col {
    font-size: 15px;
    font-weight: 400;
    line-height: 40px;
    color: rgba(102, 102, 102, 1);
  }

  .more {
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 19px;
    color: rgba(153, 153, 153, 1);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 0;
  }

  .more__icon {
    width: 7px;
    display: inline-block;
    height: 11px;
    background-image: url('~@/module/channelManagement/static/images/icon_arrow_right.png');
    background-repeat: no-repeat;
    background-size: 100%;
    margin-left: 10px;
  }
}
</style>