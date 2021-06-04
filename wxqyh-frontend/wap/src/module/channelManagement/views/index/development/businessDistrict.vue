<template>
  <div class="business-district-info">

    <div class="selectbar">

      <div class="selectbar__item selectbar__item--province"
        @click="handleClickRegionPicker">
        <span class="selectbar__value">{{regionName}}</span>
        <i class="section__icon"></i>
      </div>

      <div class="selectbar__item selectbar__item--province"
        @click="handleClickYearPicker">
        <span class="selectbar__value">{{year}}年</span>
        <i class="section__icon"></i>
      </div>
      <div class="selectbar__item selectbar__item--city"
        @click="handleClickQuarterPicker">
        <span class="selectbar__value">{{quarterName(quarter)}}</span>
        <i class="section__icon"></i>
      </div>
    </div>

    <div class="map" v-show="tradingData.length"
      id="business_chart">

    </div>

    <div class="table"
      v-show="tradingData.length">
      <div class="table__header">
        <div class="table__row">
          <span class="table__col">品牌</span>
          <span class="table__col">网络规模</span>

        </div>
      </div>
      <div class="table__body">
        <div class="table__row"
          v-for="(item, index) in tradingData"
          :key="index">
          <span class="table__col">{{item.brandName}}</span>
          <span class="table__col">{{item.scale}}</span>
        </div>
      </div>
    </div>

    <div class="pic"
      v-if="info && info.enclosure">
      <img :src="getPicUrl(info.enclosure)">
    </div>

    <div class="desc" v-show="info.tradingDesc">
      <div class="desc__header">
        <h4 class="desc__title">商圈概述</h4>
      </div>
      <div class="desc__text">
        {{info.tradingDesc||'暂无'}}
      </div>
    </div>

    <div class="store">
      <div class="store__item"
        v-for="(item, index) in stores"
        :key="index">
        <div class="store__info">
          <h4 class="store__name">{{item.tradingName}}</h4>
          <p class="store__address">{{item.tradingAddress}}</p>
        </div>
        <div class="store__arrow"
          @click="handleClickStoreItem(item)">
          <img :src="iconArrowRight"
            alt="">
        </div>
      </div>
    </div>

    <noData style="paddingTop: 20vh" :visible="!isLoading && !hasData"></noData>

    <qw-date-picker v-model="isVisibleYearPicker"
      @select="handleSelectDate"
      :column-count="1"
      :current="current">
    </qw-date-picker>

    <qw-picker v-model="isVisibleQuarterPicker"
      :data="quarterOptions"
      @select="handleSelectQuarter">
    </qw-picker>

    <qw-cascade-picker v-model="isVisibleRegionPicker"
      :data="regionData"
      ref="region"
      :async="true"
      :selectedIndex="regionOptionIndex"
      @change="handleChangeRegion"
      @select="handleSelectRegion">
    </qw-cascade-picker>

  </div>
</template>

<script>
import iconArrowRight from '@/module/channelManagement/static/images/icon_arrow_right.png'
import {
  getTradingMobile,
  getTradingInfo,
  getProvinceList,
  getCityList
} from '@/module/channelManagement/api/development/index'
import echarts from 'echarts'
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import noData from '@/module/channelManagement/components/noData';
import { mapMutations } from 'vuex'
const chartOption = {
  color: ['#2781DB'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
    },
    backgroundColor: '#ffffff',
    textStyle: {
      color: '#2781DB'
    },
    trigger: 'item',
    extraCssText: 'box-shadow:0px 2px 3px rgba(0,0,0,0.1);',
    formatter: '{a} <br/>{b}: {c}%'
  },
  grid: {
    left: 20,
    right: 10,
    bottom: 10,
    top: 40,
    containLabel: true
  },
  xAxis: [
    {
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
    }
  ],
  yAxis: [
    {
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
    }
  ],
  series: [
    {
      name: '占有率',
      type: 'bar',
      barWidth: '60%',
      barWidth: 13,
      data: []
    }
  ]
}
export default {
  mixins: [reloadApp],
  name: 'DevelopmentInfor',
  components:{
    noData
  },
  data() {
    return {
      current: new Date(),
      iconArrowRight,
      isVisibleQuarterPicker: false,
      isVisibleYearPicker: false,
      stores: [],
      quarterOptions: [
        [
          { text: '第一季度', value: '1' },
          { text: '第二季度', value: '2' },
          { text: '第三季度', value: '3' },
          { text: '第四季度', value: '4' }
        ]
      ],
      tradingData: [],
      info: {},
      province: '',
      city: '',
      quarter: 1,
      year: new Date().getFullYear(),
      isVisibleRegionPicker: false,
      regionData : [],
      regionName: '',
      regionOptionIndex: [0,0],
      isLoading: false,
    }
  },
  computed:{
    hasData(){
      return !!this.tradingData.length || this.isNonEmptyObject(this.info) || !!this.stores.length
    }
  },
  watch:{
    tradingData(value){
      if(value.length){
        this.$nextTick(()=>{
          this.resetChartSize()
        })
      }
    }
  },
  methods: {

    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      return isObject && !!Object.keys(target).length
    },

    getPicUrl(url) {
      return _.fileDownURL + url
    },

    quarterName(value) {
      const map = { 1: '一', 2: '二', 3: '三', 4: '四' }
      return `第${map[value]}季度`
    },

    handleClickQuarterPicker() {
      this.isVisibleQuarterPicker = true
    },

    handleClickYearPicker() {
      this.isVisibleYearPicker = true
    },

    /**
     * 选项
     */
    handleClickRegionPicker() {
      this.isVisibleRegionPicker = true
      if (!this.regionData.length) {
        this.fetchProvinceOptions().then((regionData)=>{
          if(regionData.length){
            const targetOption =  this.regionData.find(item=>item.text === this.province);
            const index = this.regionData.indexOf(targetOption)
            const provinceOptionIndex = Math.max(0, index);
            const provinceOption = this.regionData[provinceOptionIndex];
            this.regionOptionIndex = [provinceOptionIndex,0];
            this.fetchCityList(provinceOption)
          }
        })
      }
    },
    

    fetchCityList(provinceOption){
      if(provinceOption && provinceOption.children.length === 0){
        const provinceName = provinceOption.text;
        getCityList({pName: provinceName}).then((data)=>{
          if(data && Array.isArray(data.cityList)){
            const cityOptions = data.cityList.map((city)=>{
              return {
                 value: city.city,
                 text: city.city,
              }
            })
            // cityOptions.unshift({text:`全${provinceOption.text}`, value: ''})
            const provinceOptionIndex = this.regionData.indexOf(provinceOption);
            this.regionData[provinceOptionIndex].children = cityOptions;
            const selectCity = cityOptions.find(item=>item.text === this.city);
            const cityOptionIndex = Math.max(0, cityOptions.indexOf(selectCity));
            this.$refs['region'].setData(this.regionData, [provinceOptionIndex, cityOptionIndex])
          }
        })
      }
    },

    handleChangeRegion(columnIndex, optionsIndex){
      if(columnIndex === 0){ // 第一列
        this.fetchCityList(this.regionData[optionsIndex]);
      }
    },

    /**
     *
     */
    fetchProvinceOptions() {
      return getProvinceList().then(data => {
        if (data && data.provinceList) {
          this.regionData = data.provinceList.map(item => {
            return {
              value: item.province,
              text: item.province,
              children: []
            }
          })
          return this.regionData;
        }
      })
    },

    handleSelectRegion([provinceValue, cityValue], indexs){
      this.regionName = cityValue ? cityValue : provinceValue;
      this.regionOptionIndex = indexs;
      this.province = provinceValue;
      this.city = cityValue;
      this.fetchChartData();
    },

    handleClickStoreItem(item) {
      const detail = item || {}
      this.$router.push({
        name: 'businessDistrictDetail',
        query: this.$route.query,
        params: item
      })
    },

    handleSelectDate(_, [year]) {
      this.year = year
      this.fetchChartData()
    },

    handleSelectQuarter([v], k, e) {
      this.quarter = v
      this.fetchChartData()
    },

    handleSelect(v, k, e) {
      let content = e.join('，')
      this.$toast({
        content
      })
    },
    resetChartSize() {
      this.chart.resize()
    },

    fetchChartData() {
      const prams = {
        quarter: this.quarter,
        year: this.year,
        province: this.province, 
        city: this.city,
      }
      getTradingMobile(prams).then(data => {
        if (data) {
          this.tradingData = data
          const xAxisData = data.map(item => item.brandName)
          const seriesData = data.map(item => parseFloat(item.scale || 0))
          chartOption.xAxis[0].data = xAxisData
          chartOption.series[0].data = seriesData
          this.chart.setOption(chartOption)
        }
      })
    },

    initBusinessDistrictData() {
      getTradingInfo({ province: this.province, city: this.city }).then(
        data => {
          if (data) {
            this.info = data.infoPO || {}
            this.stores = data.detailPOList || []
          }
        }
      )
    }
  },
  created() {
    const { province, city, dealerId } = this.$route.query
    this.province = province
    this.city = city;
    this.regionName = city;
    this.dealerId = dealerId || ''
    if (province && city && dealerId) {
      this.isLoading = true;
      const p1 = this.fetchChartData()
      const p2 = this.initBusinessDistrictData()
      Promise.all([p1,p2]).finally(()=>{
         this.isLoading = false;
      })
    } else {
      this.reloadApp()
    }
  },
  mounted() {
    this.chart = echarts.init(document.getElementById('business_chart'))
    this.chart.setOption(chartOption)
    window.addEventListener('resize', this.resetChartSize)
  },
  destroyed() {
    window.removeEventListener('resize', this.resetChartSize)
  }
}
</script>

<style lang="scss" scoped>
.business-district-info {
  padding-bottom: 50px;
  .pic {
    background: #fff;
    & > img {
      width: 100%;
      height: 100%;
    }
  }

  .selectbar {
    background: #ffffff;
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
    font-family: PingFang SC;
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
  }

  .map {
    height: 210px;
    background: #ffffff;
  }
  .desc {
    padding-top: 18px;
    background: #ffffff;
  }
  .desc__header {
    border-bottom: 3px solid #262222;
  }
  .desc__title {
    display: inline-block;
    height: 27px;
    font-size: 16px;
    line-height: 27px;
    color: rgba(255, 255, 255, 1);
    background: rgba(38, 34, 34, 1);
    padding: 0 18px;
  }
  .desc__text {
    padding: 15px 15px 30px 15px;
    font-size: 15px;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
  }

  .store__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 48px;
    margin: 10px;
    background: rgba(255, 255, 255, 1);
    padding: 15px 16px 15px 18px;
  }
  .store__name {
    font-size: 17px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 24px;
    color: rgba(68, 68, 68, 1);
  }
  .store__address {
    margin-top: 5px;
    font-size: 13px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 20px;
    color: rgba(153, 153, 153, 1);
  }
  .store__arrow {
    width: 7px;
    height: 11px;
    flex-shrink: 0;
    margin-left: 5px;
    & > img {
      width: 100%;
    }
  }

  .table {
    padding: 13px 15px;
    background: #ffffff;
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
    width: 30%;
    text-align: center;
    font-size: 15px;
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
    margin: 0 auto;
    margin-top: 15px;
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
}
</style>