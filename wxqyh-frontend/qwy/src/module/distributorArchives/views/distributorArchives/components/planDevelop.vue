<template>
  <!-- 规划开发信息 -->
  <div class="ghkfWrap">

    <!-- 城市信息 start -->
    <div class="titWrap mb10">
      <h4>城市信息</h4>
      <!-- <a href="javascript:;"
        @click="openCityHistory">查看更多 ></a> -->
    </div>

    <div class="cityWrap">
      <div class="cityTable">

        <div class="table-head">
          <table>
            <colgroup>
              <col style="width: 50px;" />
              <col style="width: 80px;" />
              <col style="width: 80px;" />
              <col style="width: 80px;" />
              <col style="width: 100px;" />
              <col style="width: 80px;" />
              <col style="width: 80px;" />
            </colgroup>
            <thead>
              <tr>
                <th>省份</th>
                <th>城市</th>
                <th>行政区</th>
                <th>面积(km2) <img v-if="!cityData.areaType"
                    @click="areaSortFun('asc')"
                    :src="icon.iconNormal"><img v-if="cityData.areaType==='asc'"
                    @click="areaSortFun('desc')"
                    :src="icon.iconUp"><img v-if="cityData.areaType==='desc'"
                    @click="areaSortFun('asc')"
                    :src="icon.iconDown"></th>
                <th>常住人口(万人) <img v-if="!cityData.populationType"
                    @click="populationSortFun('asc')"
                    :src="icon.iconNormal"><img v-if="cityData.populationType==='asc'"
                    @click="populationSortFun('desc')"
                    :src="icon.iconUp"><img v-if="cityData.populationType==='desc'"
                    @click="populationSortFun('asc')"
                    :src="icon.iconDown"></th>
                <th>GDP <img v-if="!cityData.gdpType"
                    @click="gdpSortFun('asc')"
                    :src="icon.iconNormal"><img v-if="cityData.gdpType==='asc'"
                    @click="gdpSortFun('desc')"
                    :src="icon.iconUp"><img v-if="cityData.gdpType==='desc'"
                    @click="gdpSortFun('asc')"
                    :src="icon.iconDown"></th>
                <th>行政中心</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="table-body">
          <city-table :columns="cityData.list"></city-table>
        </div>
      </div>
      <div class="cityMap">
        <areaMap
          :columns="cityMap"
          :mapId="cityMap.id"></areaMap>
      </div>
    </div>
    <!-- 城市信息 end -->

    <!-- 市场信息 start -->
    <div class="titWrap">
      <h4>市场信息</h4>
      <!-- <a href="javascript:;">查看更多 ></a> -->
    </div>

    <div class="cityRateWrap">
      <div class="subTit">
        <p> · 城市区县市占率</p>
        <a href="javascript:;"
          @click="isShowMoreCityStatistics=true">查看更多 ></a>
      </div>
      <div class="cityRateTableWrap">
       <city-rate-table :columns="cityStatisticsList"></city-rate-table>
      </div>

      <div class="subTit">
        <p> · 分产品市占率</p>
        <!--        <a href="javascript:;">查看更多 ></a>-->
      </div>
      <div class="dateWrap">
        <el-date-picker v-model="proDate"
          type="monthrange"
          @change="proDateChangeFun"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份">
        </el-date-picker>
      </div>
      <div class="proRateWrap">
        <productStatistic v-if="proStatisticsList.cityList.length>0"
          :columns="proStatisticsList"></productStatistic>
      </div>
    </div>

    <div class="titWrap mb10">
      <div class="marketTab">
        <p> · 分品牌市占率  <span :class="{current:brandForm.type===1}"
                            @click="switchBrandTab(1)">全市场</span> <i>|</i> <span :class="{current:brandForm.type===2}"
                                                                                 @click="switchBrandTab(2)">自主品牌</span></p>
       </div>
    </div>
    <div class="dateWrap" v-show="isIndependent">
      <el-date-picker v-model="brandDate"
                      type="monthrange"
                      @change="brandDateChangeFun"
                      range-separator="至"
                      start-placeholder="开始月份"
                      end-placeholder="结束月份">
      </el-date-picker>
    </div>
    <div class="marketTable">
      <brandAllStatistic v-if="brandForm.type===1"
        :columns="brandStatisticsList"></brandAllStatistic>
      <autonomyBrandStatistic v-if="brandForm.type===2"
        :columns="selfBrandStatisticsList"></autonomyBrandStatistic>
    </div>
    <!-- 市场信息 end -->

    <!-- 商圈信息 start -->
    <div class="titWrap">
      <h4>商圈信息</h4>
      <!-- <a href="javascript:;">查看更多 ></a> -->
    </div>

    <div class="ghWrap">
      <businessCircleInfo></businessCircleInfo>
    </div>
    <!-- 商圈信息 end -->

    <!-- 网络规划方案 start -->
    <div class="titWrap">
      <h4>网络规划方案</h4>
      <!-- <a href="javascript:;">查看更多 ></a> -->
    </div>
    <div class="networkWrap">
      <div class="subTit">
        <p> · 一网规划方案</p>
        <a v-show="false"
          href="javascript:;">查看更多 ></a>
      </div>

      <one-net :tbEntQrPlanAnetVo="tbEntQrPlanAnetVo"></one-net>
      <develop-schedule-table :columns="tbEntQrPlanDevVo"></develop-schedule-table>

      <div class="subTit">
        <p> · 二网建设进度</p>
        <a v-show="false"
          href="javascript:;">查看更多 ></a>
      </div>
      <second-net-table :columns="tbEntQrPlanBnetVos"></second-net-table>
    </div>
    <!-- 网络规划方案 end -->

    <!-- 更多城市弹框 start -->
    <cityHistoryPop v-if="cityMore.show"
      @closeCityHistory="closeCityHistory"></cityHistoryPop>
    <!-- 更多城市弹框 end -->

    <!--    更多城市市占率 start -->
    <cityStatisticsMorePop v-if="isShowMoreCityStatistics" :dealerId="dealerId"
      @closeCityStatistic="closeCityStatistic"></cityStatisticsMorePop>
    <!--    更多城市市占率 end -->
  </div>
</template>

<script>
import areaMap from './areaMap'
import cityHistoryPop from './planDevelop/cityHistoryPop'
import businessCircleInfo from './planDevelop/businessCircleInfo'
import cityStatisticsMorePop from './planDevelop/cityStatisticsMorePop'
import brandAllStatistic from './planDevelop/brandAllStatistic'
import autonomyBrandStatistic from './planDevelop/autonomyBrandStatistic'
import productStatistic from './planDevelop/productStatistic'
import cityRateTable from "./planDevelop/cityRateTable";
import secondNetTable from "./planDevelop/secondNetTable";
import oneNet from "./planDevelop/oneNet";
import developScheduleTable from "./planDevelop/developScheduleTable";
import cityTable from "./planDevelop/cityTable";
import iconDown from '../images/icon_down.png'
import iconUp from '../images/icon_up.png'
import iconNormal from '../images/icon_normal.png'
import {
  ajaxPlanCityInfoAction,
  ajaxGetCityStatistics,
  ajaxGetProductStatistics,ajaxGetBrandStatistics,
    ajaxGetBrandStatisticsByType,
  ajaxSearchPlanNetAnetInfoBykey,ajaxSearchPlanNetBnetInfoBykey
} from '../../../api/getData'
export default {
  data() {
    return {
      tradMap: 'tradMap',
      icon: {
        iconDown: iconDown,
        iconUp: iconUp,
        iconNormal: iconNormal
      },
      cityMore: {
        show: false
      },
      cityData: {
        list: [],
        areaType: '',
        populationType: '',
        gdpType: ''
      },
      cityMap: {
        id: 'cityMapId',
        province: '',
        mapPoints: []
      },
      cityForm: {
        dealerId: this.dealerId,
        sortField: '',
        sortType: '',
        searchValue: {
          startYear: '',
          endYear: ''
        },
        page: 1,
        pageSize: 50
      },
      proForm: {
        // 分产品市占率
        dealerId: this.dealerId,
        startYearmonth: '', // 201905
        endYearmonth: '' // 201908
      },
      allBrandForm:{ // 分品牌市占率
          type: 1,
          dealerId: this.dealerId,
          startYearmonth: '', // 201906
          endYearmonth: '' // 201909
      },
      brandForm:{ // 分品牌市占率
          type: 1,
          dealerId: this.dealerId,
          startYearmonth: '', // 201906
          endYearmonth: '' // 201909
      },
      proDate: [], // 分产品日期选择
      brandDate:[], // 分品牌日期选择
      isShowMoreCityStatistics: false,
      cityStatisticsList: [], // 县区市占率
      proStatisticsList: {
        cityName: '',
        provinceName: '',
        cityList: [],
        countryList: [],
        provinceList: []
      }, // 产品市占率
      isIndependent:false, // 是否切換至自主品牌
      brandStatisticsList: [], // 品牌市占率
      selfBrandStatisticsList: [], // 自主品牌
      tbEntQrPlanAnetVo: {}, //一网规划数据
      tbEntQrPlanDevVo: [], //一网规划数据开发进度
      tbEntQrPlanBnetVos: [], //二网数据
      nowYear: '', //当前年份
    }
  },
  props: {
    dealerId: {
      required: true,
      type: [String,Number],
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.proForm.dealerId = this.dealerId
      this.cityForm.dealerId = this.dealerId
      let today = new Date()
      this.nowYear = today.getFullYear()
      let start = this.formatDate(this.getBeforeThreeMonth(today))
      let end = this.formatDate(today)
      this.proForm.startYearmonth = start
      this.proForm.endYearmonth = end
      this.brandForm.startYearmonth = start
      this.brandForm.endYearmonth = end
      this.allBrandForm.startYearmonth = start
      this.allBrandForm.endYearmonth = end
      // 日期给值
      this.proDate = [this.getBeforeThreeMonth(today),today]
      this.brandDate = [this.getBeforeThreeMonth(today),today]

      setTimeout(() => {
        this.getCityInfo()
        this.getCityStatistics()
        this.getProductStatistics()
        this.getBrandStatistics()
        this.getOneWInfo()
        this.getTwoWInfo()
      }, 100)
    },
    // 产品日期更改
    proDateChangeFun(val) {
      if (val) {
        this.proForm.startYearmonth = this.formatDate(val[0])
        this.proForm.endYearmonth = this.formatDate(val[1])
      } else {
        this.proForm.startYearmonth = ''
        this.proForm.endYearmonth = ''
      }
      this.getProductStatistics()
    },
    // 品牌日期更改
    brandDateChangeFun(val){
        if (val) {
            this.brandForm.startYearmonth = this.formatDate(val[0])
            this.brandForm.endYearmonth = this.formatDate(val[1])
        } else {
            this.brandForm.startYearmonth = ''
            this.brandForm.endYearmonth = ''
        }
        if(this.brandForm.type  === 1){
            // 全市场
            this.getBrandStatistics()
        } else if(this.brandForm.type === 2){
            // 自主品牌
            this.getBrandStatisticsByType()
        }
    },
    getBeforeThreeMonth(val){
      let dateVal = new Date(val)
      dateVal.setMonth(dateVal.getMonth()-3);
      return dateVal
    },
    add0(val) {
      if (val < 10) {
        return '0' + val
      } else {
        return val
      }
    },
    // 日期格式化
    formatDate(val) {
      let dateVal = new Date(val)
      let year = dateVal.getFullYear()
      let month = dateVal.getMonth()
      return year +''+ this.add0(month + 1)
    },
    // 切换品牌
    switchBrandTab(index) {
        this.brandForm.type = index
        if(index === 1){
            // 全市场
            this.isIndependent = false
            this.getBrandStatistics()
        } else if(index === 2){
            // 自主品牌
            this.isIndependent = true
            this.getBrandStatisticsByType()
        }
    },
    // 分品牌全市场市占率
    getBrandStatistics() {
      ajaxGetBrandStatistics(this.allBrandForm, data => {
        if (data && data.brandStatistics) {
          this.brandStatisticsList = data.brandStatistics
        } else {
          this.brandStatisticsList = []
        }
      })
    },
    // 分品牌自主品牌
    getBrandStatisticsByType() {
      ajaxGetBrandStatisticsByType(this.brandForm, data => {
        if (data && data.brandStatistics) {
          this.selfBrandStatisticsList = data.brandStatistics
        } else {
          this.selfBrandStatisticsList = []
        }
      })
    },
    // 分产品市占率
    getProductStatistics() {
      ajaxGetProductStatistics(this.proForm, data => {
        if (data && data.cityList) {
          this.proStatisticsList = data
        } else {
          this.proStatisticsList = {
            cityName: '',
            provinceName: '',
            cityList: [],
            countryList: [],
            provinceList: []
          }
        }
      })
    },
    // 获取县区市占率
    getCityStatistics() {
      let params = { dealerId: this.dealerId }
      ajaxGetCityStatistics(params, data => {
        if (data && data.statisticsList) {
          this.cityStatisticsList = data.statisticsList
        }
      })
    },
    // 关闭
    closeCityStatistic() {
      this.isShowMoreCityStatistics = false
    },
    // 打开城市弹框
    openCityHistory() {
      this.cityMore.show = true
    },
    // 关闭城市弹框
    closeCityHistory() {
      this.cityMore.show = false
    },
    // 获取城市信息
    getCityInfo() {
      ajaxPlanCityInfoAction(this.cityForm, data => {
        if (data && data.pageData && data.pageData.length > 0) {
          this.cityData.list = data.pageData
          this.cityMap.province = data.pageData[0].planProvinces

          let temp = []
          data.pageData.map(item => {
            temp.push({
              latitude: item.administrativeLatitude,
              longitude: item.administrativeLongitude,
              title: item.planCity + ' ' + item.administrativeRegion,
              con:
                '面积：' +
                item.administrativeArea +
                'km2<br>常住人口：' +
                item.administrativePopulation +
                '万人<br>GDP：' +
                item.administrativeGdp,
              branch: item.planCity
            })
          })
          this.cityMap.mapPoints = temp
          this.cityMap.show = true
        }
      })
    },
    reInitCityFun() {
      this.cityForm.page = 1
      this.cityForm.pageSize = 7
      this.getCityInfo()
    },
    // 城市按面积排序
    areaSortFun(item) {
      this.cityData.areaType = item
      this.cityForm.sortField = 'area'
      this.cityForm.sortType = item
      this.reInitCityFun()
    },
    // 城市按人口排序
    populationSortFun(item) {
      this.cityData.populationType = item
      this.cityForm.sortField = 'population'
      this.cityForm.sortType = item
      this.reInitCityFun()
    },
    // 城市按gdp排序
    gdpSortFun(item) {
      this.cityData.gdpType = item
      this.cityForm.sortField = 'gdp'
      this.cityForm.sortType = item
      this.reInitCityFun()
    },
    // 获取一网信息
    getOneWInfo() {
      let params = {
        dealerId: this.dealerId,
        year: this.nowYear
      }
      ajaxSearchPlanNetAnetInfoBykey(params, data => {
        if (data.tbEntQrPlanAnetVo) {
          data.tbEntQrPlanAnetVo.planNumber = data.tbEntQrPlanAnetVo.planNumber.toString()
          data.tbEntQrPlanAnetVo.planDevNumber = data.tbEntQrPlanAnetVo.planDevNumber.toString()
          data.tbEntQrPlanAnetVo.nowBuildShop = data.tbEntQrPlanAnetVo.nowBuildShop.toString()
          data.tbEntQrPlanAnetVo.cashDepositNumber = data.tbEntQrPlanAnetVo.cashDepositNumber.toString()
        }
        if (data.tbEntQrPlanDevVos) {
          // data.tbEntQrPlanDevVos.marginMoney = data.tbEntQrPlanDevVos.marginMoney.toString()
          this.tbEntQrPlanDevVo = data.tbEntQrPlanDevVos
        }
        this.tbEntQrPlanAnetVo = data.tbEntQrPlanAnetVo
      })
    },
    // 获取一网信息
    getTwoWInfo() {
      let params = {
        dealerId: this.dealerId,
        year: this.nowYear
      }
      ajaxSearchPlanNetBnetInfoBykey(params, data => {
          if(data && data.tbEntQrPlanBnetVos) {
              this.tbEntQrPlanBnetVos = data.tbEntQrPlanBnetVos
          }
      })
    }
  },
  components: {
    areaMap,
    cityHistoryPop,
    businessCircleInfo,
    cityStatisticsMorePop,
    brandAllStatistic,
    autonomyBrandStatistic,
    productStatistic,cityRateTable,secondNetTable,developScheduleTable,oneNet,cityTable
  },
  filters: {
    filterNum: function(val) {
      if (val) {
        return val.toFixed(2)
      } else {
        return 0
      }
    }
  }
}
</script>
