<template>
  <div class="city-share ">

    <div class="selectbar">

      <div class="selectbar__item location">
        <i class="location__icon"><img :src="iconLocation" alt=""></i>
       <span class="location__text"> {{cityName || '暂无'}}</span>
      </div>

      <div class="selectbar__item selectbar__item--province"
        @click="handleClickDatePicker">
        <span class="selectbar__value">{{year}}-{{month | formatMonth}}</span>
        <i class="section__icon"></i>
      </div>
      <div class="selectbar__item selectbar__item--city"
        @click="handleClickTypePicker">
        <span class="selectbar__value">{{typeName}}</span>
        <i class="section__icon"></i>
      </div>
    </div>

    <div class="card">
      <div class="card__title bl">
        <div class="card__title__text">城市市占率</div>
        <div class="card__title__desc">
          <span class="desc__date">更新日期：{{updateTime || '暂无'}}</span>
          <span class="desc__department">更新人：{{updateUser || '暂无'}}</span>
        </div>
      </div>
      <div class="card__content">
        <div id="city_share_chart" class="chart"></div>
      </div>

    </div>

    <div class="gutter"></div>

   <qw-tabs v-model="currentTabValue" @change="handleChangeTab">
        <qw-tab-pane :value="item.value" :label="item.label" v-for="item in tabs" :key="item.value"></qw-tab-pane>
    </qw-tabs>

    <div class="gutter"></div>

    <div class="table">
      <table>
        <colgroup align="center" width="30%"></colgroup>
        <colgroup align="center" width="20%"></colgroup>
        <colgroup align="center"
          width="20%"></colgroup>
        <colgroup align="center"
          width="20%"></colgroup>

        <thead>
          <tr>
            <th></th>
            <th class="cell">
               <p class="cell__month">1-{{this.month}}月</p>
               <p class="cell__year">（{{this.year-1}}年）</p>
            </th>
            <th class="cell">
               <p class="cell__month">1-{{this.month}}月</p>
               <p class="cell__year">（{{this.year}}年）</p>
            </th>
            <th class="cell">
              <p class="cell__text">同比</p>
              <p class="cell__text">变化</p>
            </th>
          </tr>
        </thead>
        <tbody v-if="isNonEmptyObject(statisticsDetail)">
          <tr>
             <td>市场容量</td>
              <td>{{statisticsDetail.lastMarketCapacity|| '-'}}</td>
              <td>{{statisticsDetail.curMarketCapacity|| '-'}}</td>
              <td :class="{
                    red: isRed(statisticsDetail.marketCapacityRatio),
                    green: isGreen(statisticsDetail.marketCapacityRatio)
                  }">{{statisticsDetail.marketCapacityRatio | formatPercent}}</td>
          </tr>
          <tr>
              <td>市场容量占比</td>
              <td>{{statisticsDetail.lastCityCapacityRatio | formatPercent}}</td>
              <td>{{statisticsDetail.curCityCapacityRatio | formatPercent}}</td>
              <td :class="{
            red: isRed(statisticsDetail.marketCityCapacityRatio),
            green: isGreen(statisticsDetail.marketCityCapacityRatio)
            }">{{statisticsDetail.marketCityCapacityRatio | formatPercent}}</td>
          </tr>
          <tr>
             <td>奇瑞销量</td>
              <td>{{statisticsDetail.lastCherySales|| '-'}}</td>
              <td>{{statisticsDetail.curCherySales|| '-'}}</td>
              <td :class="{
            red: isRed(statisticsDetail.marketCherySales),
            green: isGreen(statisticsDetail.marketCherySales)
            }">{{statisticsDetail.marketCherySales | formatPercent}}</td>
          </tr>
          <tr>
             <td>奇瑞销量占比</td>
              <td>{{statisticsDetail.lastCherySalesRatio | formatPercent}}</td>
              <td>{{statisticsDetail.curCherySalesRatio | formatPercent}}</td>
              <td :class="{
            red: isRed(statisticsDetail.marketCherySalesRatio),
            green: isGreen(statisticsDetail.marketCherySalesRatio)
            }">{{statisticsDetail.marketCherySalesRatio | formatPercent}}</td>
          </tr>
          <tr>
             <td>市占率</td>
              <td>{{statisticsDetail.lastPercent | formatPercent}}</td>
              <td>{{statisticsDetail.curPercent | formatPercent}}</td>
              <td :class="{
            red: isRed(statisticsDetail.percentRatio),
            green: isGreen(statisticsDetail.percentRatio)
            }">{{statisticsDetail.percentRatio| formatPercent}}</td>
          </tr>
          <tr>
             <td>品牌排名</td>
              <td>{{statisticsDetail.lastBrandRanking || '-'}}</td>
              <td>{{statisticsDetail.curBrandRanking|| '-'}}</td>
              <td :class="{
            red: isRed(statisticsDetail.marketBrandRanking),
            green: isGreen(statisticsDetail.marketBrandRanking)
            }">{{statisticsDetail.marketBrandRanking }}</td>
          </tr>
           <tr>
             <td>容量排名</td>
              <td>{{statisticsDetail.lastCapacityRanking|| '-'}}</td>
              <td>{{statisticsDetail.curCapacityRanking|| '-'}}</td>
              <td :class="{
            red: isRed(statisticsDetail.marketCapacityRanking),
            green: isGreen(statisticsDetail.marketCapacityRanking)
            }">{{statisticsDetail.marketCapacityRanking }}</td>
          </tr>
           <tr>
             <td>销量排名</td>
              <td>{{statisticsDetail.lastSalesRanking|| '-'}}</td>
              <td>{{statisticsDetail.curSalesRanking|| '-'}}</td>
              <td :class="{
            red: isRed(statisticsDetail.marketSalesRanking),
            green: isGreen(statisticsDetail.marketSalesRanking)
            }">{{statisticsDetail.marketSalesRanking }}</td>
          </tr>
        </tbody>
      </table>
    </div>


    <qw-date-picker
        v-model="isVisibleDatePicker"
        :column-count="2"
        :current="current"
        @select="handleSelectDate"
    >
    </qw-date-picker>

  </div>
</template>

<script>
import echarts from 'echarts'
import {
  getStatisticsVoList,
  getCityStatistics,
  getCityList
} from '@/module/channelManagement/api/development/index'
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import noData from '@/module/channelManagement/components/noData'
import iconLocation from '@/module/channelManagement/static/images/icon_location.png'
import  * as developmentApi from '@/module/channelManagement/api/development/index'
import dayjs from 'dayjs';

const chartOption = {
  color: ['#C6001F', '#2781DB', '#999999'],
  legend: {
    data: ['市占率', '环比', '同比'],
    backgroundColor: '#ffffff',
    bottom: 10,
    left: 'center',
    itemHeight: 13,
    itemWidth: 13,
    icon: 'rect'
  },
  tooltip: {
    backgroundColor: '#ffffff',
    textStyle: {
      color: '#2781DB'
    },
    trigger: 'item',
    extraCssText: 'box-shadow:0px 2px 3px rgba(0,0,0,0.1);',
    formatter: '{a} <br/>{b}: {c}%'
  },
  grid: {
    top: 30,
    left: 18,
    right: 18,
    bottom: 40,
    containLabel: true
  },
  xAxis: [{
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
  }],
  yAxis: [{
      axisTick: {
          // 刻度
          show: false
      },
      axisLine: {
          // 轴线
          lineStyle: {
              color: '#DBDBDB'
          },
          show: false
      },
      splitLine: {
          // 分割线
          lineStyle: {
              color: '#E6E6E6',
              type: 'dashed'
          }
      },
      axisLabel: {
          formatter: '{value}%'
      }
  }],
  series: [
    {
        name: '市占率',
        type: 'line',
        barWidth: 13,
        yAxisIndex: 0,
        // label: {
        //     show: true,
        //     position: 'top'
        // },
        data: []
    },
    {
      name: '环比',
      type: 'bar',
      // label: {
      //     show: true,
      //     position: 'top'
      // },
      barWidth: 7,
      data: []
    },
    {
      name: '同比',
      type: 'bar',
      // label: {
      //     show: true,
      //     position: 'top'
      // },
      barWidth: 7,
      data: []
    },

  ]
}

export default {
  mixins: [reloadApp],
  components:{
    noData
  },
    filters:{
        formatMonth(month){
          return month /10 >= 1? `${month}` : `0${month}`
        },
        formatPercent(value){
            const floatValue = parseFloat(value);
            if(Number.isNaN(floatValue)){
                return '-'
            }else{
                return `${floatValue}%`
            }
        }
    },
  data() {
    const now = dayjs(new Date()).subtract(1, 'month').toDate();
    return {
      iconLocation: iconLocation,
      province: '全省',
      city: '',
      dealerId: '',
      type: 2,
      typeName: '自主品牌',
      isVisibleCityPicker: false,
      cityData: [],
      selectedTabIndex: 1,
      yearTabs: [],
      selectedYear: 0,
      chart: null,
      statisticsVoList: [], // 表格数据
      provincestatisticsList: [],
      loading: false,
      typeOptions:[
          {
            value: 1,
            label: '全市场'
          },
          {
            value: 2,
            label: '自主品牌'
          }
      ],
      tabs:[],
      currentTabValue: 'city',


        statisticsDetail:{

        },

        isVisibleDatePicker:false,
        current: now,
        year: now.getFullYear(),
        month: now.getMonth()+1,

        updateTime: '',
        updateUser: ''
    }
  },
  methods: {

      isRed(val){
        return parseFloat(val) < 0;
      },

      isGreen(val){
          return parseFloat(val) > 0;
      },

    isNonEmptyObject(target) {
        const isObject =
            Object.prototype.toString.call(target) === '[object Object]'
        return isObject && !!Object.keys(target).length
    },
    /**
     * 索引转编号
     */
    indexConvertToNumber(index){
      return index +1;
    },


    /**
     * 初始胡时间选项
     */
    initYearTabsData() {
      // const thisYear = new Date().getFullYear()
      // this.yearTabs = [...Array(4)].map((_, index) => {
      //   return {
      //     value: thisYear - index,
      //     label: `${thisYear - index}年`
      //   }
      // })
      // this.selectedYear = thisYear
    },

      handleClickDatePicker(){
          this.isVisibleDatePicker = true;
      },

      handleSelectDate(_,[year,month]){
        this.year = year;
        this.month = month;
        this.handleChangeTab(this.currentTabValue);
        this.getCityStatistics();
      },

    /**
     * 处理点击类型
     */
    handleClickTypePicker() {
      this.$actionsheet({
        options: this.typeOptions
      }).then(({ action, item }) => {
        this.type = item.value
        this.typeName = item.label
        // this.fetchCityStatistics()
        // this.fetchStatisticsVoList()
          this.handleChangeTab(this.currentTabValue);
           this.getCityStatistics();
      })
    },

    /**
     * 处理点击城市摘取器
     */
    handleClickCityPicker() {
      this.isVisibleCityPicker = true
    },

    /**
     * 重置图表配置
     */
    resetChartSize() {
      this.chart.resize()
    },


    /**
     * 城市统计
     */
    fetchCityStatistics() {
      const params = {
        dealerId: this.dealerId,
        year: this.selectedYear,
        month: this.month,
        type: this.type,
      }
      return getCityStatistics(params).then(data => {
        const option = this.normalizeChartOption(data.cityStatisticsVoList)
        this.chart.setOption(option)
        return data.dealerProvince
      })
    },

    /**
     * 规范化图表配置
     */
    normalizeChartOption(list = []) {
      const cherySeriesData = list.map(item => item.qiruiNum)
      const totalSeriesData = list.map(item => item.totalNum)
      const xAxisData = list.map(item => item.year)
      chartOption.series[0].data = cherySeriesData
      chartOption.series[1].data = totalSeriesData
      chartOption.xAxis.data = xAxisData
      return chartOption
    },

    /**
     * 获取城市列表数据
     */
    fetchCityList(provinceName) {
      this.province = provinceName
      getCityList({ pName: provinceName }).then(data => {
        if (data) {
          const defaultOption = { text: this.province, value: '' }
          const cityList = data.cityList
            ? data.cityList.map(item => {
                return { text: item.city, value: item.id }
              })
            : []
          cityList.unshift(defaultOption)
          this.cityData = [cityList]
        }
      })
    },

      /**
       *
       * @param list
       */
      setChartOption(list){
          const months = [1,2,3,4,5,6,7,8,9,10,11,12];
          const percentData = []; //
          const linkRatioData = []; // 环比
          const equalRatioData = []; // 同比
          months.forEach((month, index)=>{
              const item = list[index];
              if(item && item.month === month){
                  percentData.push(parseFloat(item.percent) || 0)
                  linkRatioData.push(parseFloat(item.linkRatio) || 0)
                  equalRatioData.push(parseFloat(item.equalRatio) || 0)
              }
          })
          chartOption.xAxis[0].data = months.map((item)=>`${item}月`);
          chartOption.series[0].data = percentData;
          chartOption.series[1].data = linkRatioData;
          chartOption.series[2].data = equalRatioData;
          this.chart.setOption(chartOption)
      },

      createForm(){
          return {
              dealerId: this.dealerId,
              type: this.type,
              year: this.year,
              month: this.month
          }
      },

      getCityStatistics(){
          const form = this.createForm();
          developmentApi.getCityStatistics(form).then((data)=>{
            const list = data && data.planningDevStatisticsVOList ? data.planningDevStatisticsVOList : [];
            this.setChartOption(list)

              if(data && data.lastUpdateVO){
                  this.updateTime = data.lastUpdateVO.updateTime || '';
                  this.updateUser = data.lastUpdateVO.updateUser || '';
              }
          })
      },

      getCityStatisticsDetail(){
          const form = this.createForm();
          this.statisticsDetail = {};
          developmentApi.getCityStatisticsDetail(form).then((data)=>{
              this.statisticsDetail = data && data.planningStatisticsDetailVO ? data.planningStatisticsDetailVO : {};
              console.log(data)
          })
      },

      getProvinceStatisticsDetail(){
          const form = this.createForm();
          this.statisticsDetail = {};
          developmentApi.getProvinceStatisticsDetail(form).then((data)=>{
              this.statisticsDetail = data && data.planningStatisticsDetailVO ? data.planningStatisticsDetailVO : {};
              console.log(data)
          })
      },

      getCountryStatisticsDetail(){
          const form = this.createForm();
          this.statisticsDetail = {};
          developmentApi.getCountryStatisticsDetail(form).then((data)=>{
              this.statisticsDetail = data && data.planningStatisticsDetailVO ? data.planningStatisticsDetailVO : {};
              console.log(data)
          })
      },

      handleChangeTab(tab){
          switch(tab){
              case 'city':
                  this.getCityStatisticsDetail();
                  break;
              case 'province':
                  this.getProvinceStatisticsDetail();
                  break;
              case 'country':
                  this.getCountryStatisticsDetail();
                  break;
              default:
                  break
          }
      },

      init(){
          const {dealerId, province, city} = this.$route.query
          if (!dealerId) {
              this.reloadApp()
              return
          }
          this.dealerId = dealerId;
          this.getCityStatistics(dealerId);
          this.cityName = city;

          this.tabs = [
              {
                  value: 'city',
                  label: city
              },
              {
                  value: 'province',
                  label: province
              },
              {
                  value: 'country',
                  label: '全国'
              },
          ];



          this.handleChangeTab(this.currentTabValue);
      }

  },
  created() {

      this.init();

  },

    watch:{
        '$route.query'(){
            this.init();
        }
    },

  mounted() {
    this.chart = echarts.init(document.getElementById('city_share_chart'))
    this.chart.setOption(chartOption)
    window.addEventListener('resize', this.resetChartSize)
  },
  destroyed() {
    window.removeEventListener('resize', this.resetChartSize)
  }
}
</script>

<style lang="scss" scoped>
.city-share {
  min-height: calc(100vh - 40px);
  background: #fff;
  padding-bottom: 50px;
  .selectbar {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: space-around;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      height: 1px;
      background: #dbdbdb;
      left: 0;
      right: 0;
      bottom: 0;
      transform: scaleY(0.5);
    }
  }
  .location__icon{
    width: 15px;
    height: 15px;
    margin-right: 3px;
    &>img{
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }
  .location__text{
    height: 21px;
    font-size: 15px;
    font-weight: 400;
    line-height: 22px;
    color: rgba(0, 0, 0, 1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 70px;
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
    width: 70px;
    text-align: center;
  }
  // .selectbar__item--city {
  //   .selectbar__value {
  //     width: 60px;
  //   }
  // }
  .selectbar__item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-shrink: 0;
  }

  background: #ffffff;
  .chart {
    height: 210px;
  }
  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }
  .table {
    background: #ffffff;
    table {
      border-collapse: collapse;
      width: 100%;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        height: 1px;
        background: #dbdbdb;
        left: 0;
        right: 0;
        bottom: 0;
        transform: scaleY(0.5);
      }
    }
    thead {
      height: 40px;
      background: rgba(39, 129, 219, 1);
      padding: 0 10px;
      th {
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        color: #ffffff;
        &:first-child {
          padding-left: 10px;
        }
        &:last-child {
          padding-right: 10px;
        }
      }

      .cell{
        height:32px;
        font-size:10px;
        font-weight:400;
        line-height:13px;
        color:rgba(255,255,255,1);
        .cell__month{
          font-size:14px;
          font-weight:400;
          line-height:13px;
        }
        .cell__text{
          font-size:14px;
          font-weight:400;
          line-height:13px;
        }
      }
    }
    tbody {
      width: 100%;
      tr {
        padding: 0 10px;
        width: 100%;
        &:nth-child(2n + 1) {
          background: rgba(247, 247, 247, 1);
        }
        &:nth-child(2n) {
          background: #ffffff;
        }
        td {
          text-align: center;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          color: #333333;
          &:first-child {
            padding-left: 10px;
          }
          &:last-child {
            padding-right: 10px;
          }
          &.red{
            color: #C6001F;
          }
          &.green{
            color:#00B563;
          }
        }
      }
    }
  }

  .more {
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 19px;
    color: rgba(153, 153, 153, 1);
    margin: 0 auto;
    // margin-top: 15px;
    padding-bottom: 15px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
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

  .bl{
    position: relative;
    &::after{
      content: '';
      position: absolute;
      bottom: 0;
      height: 1px;
      left: 15px;
      right: 15px;
      transform: scaleY(0.5);
      background: #D0D0D0;
    }
  }

  .card__title{
    height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 12px 15px;
    .card__title__text{
      height:24px;
      font-size:17px;
      font-weight:600;
      line-height:24px;
      color:rgba(20,30,40,1);
      position: relative;
      text-indent: 10px;
      &:before{
        position: absolute;
        content: '';
        left: 0;
        top: 50%;
        height: 17px;
        width: 2px;
        border-radius: 1px;
        background: #C6001F;
        transform: translate(0, -50%);
      }
    }
    .card__title__desc{
      height:12px;
      font-size:12px;
      font-weight:300;
      line-height:12px;
      color:rgba(20,30,40,1);
      transform: scale(0.85);
      transform-origin: bottom right;
      &>span:first-child{
        margin-right: 10px;
      }
    }
  }

  /deep/ {
      .qw-tab-bar__wrapper{
        height: 42px;
      }
      .qw-tab-pane{
        padding: 0;
      }
      .qw-tab-bar{
        height: 42px;
        background: rgba(198, 0, 31, 0);
      }
      .qw-tabs__wrapper{
        border-top: none;
      }
      .header{
        background: rgba(198, 0, 31, 0);
      }
      .qw-search-bar{
        background:rgba(240,240,240,1);
      }
      .qw-tab-bar__pane{
        color:rgba(153,153,153,1);
      }
      .qw-tab-bar__pane.is-active{
        color:rgba(0,0,0,1);
        font-weight:600;
      }
      .qw-tab-bar__slider{
        background-color: rgba(198, 0, 31, 1);
      }

    }

}
</style>
