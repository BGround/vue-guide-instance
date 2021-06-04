<template>
  <!-- 运营管理信息 -->
  <div class="operateManageWrap">

    <!-- 盈利情况 start -->
    <div class="titWrap mb10">
      <h4>盈利情况</h4>
    </div>
    <div class="profitWrap">
        <profit-table :columns="profitList"></profit-table>
    </div>
    <!-- 盈利情况 end -->

    <!-- 销量情况 start -->
    <div class="titWrap mb10">
      <h4>销量情况</h4>
    </div>
    <div class="saleVolumeWrap">
      <div class="subTit">
        <p> · 总体销量</p>
      </div>
      <over-all-sales-table :columnsStore="overAllStoreMonth" :columnsProvice="overAllProvinceMonth" :columnsWarzone="overAllWarzone" :columnsCountry="overAllWholeCountry" :columnsTarget="overAllYearTarget" :columnsYearCount="overAllYearAccumulated"></over-all-sales-table>

      <div class="subTit">
        <p> · 销售趋势</p>
      </div>
      <div class="trendWrap">
        <div class="month"><broken-line v-if="monthBorkenShow" :id="monthBrokenId" :columns="monthBorkenData"></broken-line></div>
        <div class="year"><broken-line v-if="yearBorkenShow" :id="yearBrokenId" :columns="yearBrokenData"></broken-line></div>
      </div>

      <div class="subTit">
        <p> · 历史销量</p>
      </div>
      <history-table :columns="historyData"></history-table>

      <div class="subTit">
        <p> · 分产品销量</p>
      </div>
      <product-sale-table :columnsMonth="proMonthList" :columnsYear="proYearList" :columnsYearTotal="proYearTotal" :columnsMonthTotal="proMonthTotal"></product-sale-table>

      <div class="subTit">
        <p> · 直营店实销</p>
      </div>
      <direct-shop-table v-if="shopYearList.length>0" :columnsYear="shopYearList" :yearTit="yearTit"></direct-shop-table>
    </div>
    <!-- 销量情况 end -->

    <!-- 销售线索 start -->
    <div class="titWrap mb10">
      <h4>销售运营</h4>
    </div>
    <div class="saleOperate">
      <div class="saleSearch mb10">
          <el-date-picker
            v-model="saleYear"
            type="month"
            :clearable="false"
            @change="saleDateChange"
            placeholder="选择年月">
          </el-date-picker>
        </el-date-picker>
        <qwui-button @click="querySaleOperateFun">查询</qwui-button>
      </div>
      <sale-table :bdxsyyList="bdxsyyList" :sxsyyList="sxsyyList" :qyxsyyList="qyxsyyList" :qgxsyyList="qgxsyyList"></sale-table>

    </div>
    <!-- 销售线索 end -->

    <!-- 销售运营 start -->
    <div class="titWrap mb10">
      <h4>销售运营</h4>
    </div>
    <div class="saleOperate">
      <div class="saleSearch mb10">
        <el-date-picker
                v-model="saleOperationYearValue"
                type="year"
                :clearable="false"
                value-format="yyyy"
                @change="handleSelectYearOfSaleOperation"
                placeholder="选择年份">
        </el-date-picker>
        </el-date-picker>
        <qwui-button @click="handleSearchSaleOperation">查询</qwui-button>
      </div>
      <sale-operation-table :data="saleOperationTableData"></sale-operation-table>
    </div>
    <!-- 销售运营 end -->



    <!-- 服务运营 start -->
    <div class="titWrap mb10">
      <h4>服务运营</h4>
    </div>
    <div class="serviceOperate">
      <div class="saleSearch mb10">
        <el-date-picker
          v-model="serviceYear"
          type="year"
          placeholder="选择年">
        </el-date-picker>
        <qwui-button @click="searchServiceFun">查询</qwui-button>
      </div>
      <service-operate-table :columns="serviceList"></service-operate-table>
    </div>
    <!-- 服务运营 end -->

    <!-- 综合运营评估 start -->
    <div class="titWrap mb10">
      <h4>综合运营评估</h4>
    </div>
    <compre-table :columns="compreList"></compre-table>
    <!-- 综合运营评估 end -->

    <!-- 奖惩信息 start -->
    <div class="titWrap mb10">
      <h4>奖惩信息</h4>
    </div>
    <div class="prizeWrap">
      <div class="subTit">
        <p> · 日常奖惩
          <el-date-picker
            v-model="prizeForm.startYear"
            type="year"
            @change="prizeStartYearChange"
            placeholder="选择开始年">
          </el-date-picker>
          至
          <el-date-picker
            v-model="prizeForm.endYear"
            type="year"
            @change="prizeEndYearChange"
            placeholder="选择结束年">
          </el-date-picker>
          <el-select v-model="prizeForm.rewardsType" placeholder="奖惩类别">
            <el-option
              v-for="item in prizeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <qwui-button @click="queryPrizeFun">查询</qwui-button>
        </p>
      </div>
      <reward-punish-table :columns="rewardList"></reward-punish-table>

      <div class="subTit">
        <p> · 年度表彰</p>
      </div>
      <annual-commend :columns="annualList"></annual-commend>
    </div>
    <!-- 奖惩信息 end -->
  </div>
</template>

<script>
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import profitTable from "./operateManage/profitTable";
import rewardPunishTable from "./operateManage/rewardPunishTable";
import annualCommend from "./operateManage/annualCommend";
import brokenLine from "./operateManage/brokenLine";
import serviceOperateTable from "./operateManage/serviceOperateTable";
import compreTable from "./operateManage/compreTable";
import historyTable from "./operateManage/historyTable";
import directShopTable from "./operateManage/directShopTable";
import productSaleTable from './operateManage/productSaleTable'
import overAllSalesTable from "./operateManage/overAllSalesTable";
import saleTable from "./operateManage/saleTable";
import saleClueMonth from "./operateManage/saleClueMonth";
import saleStackMonth from "./operateManage/saleStackMonth";
import saleOperationTable from "./operateManage/saleOperationTable"
import {ajaxGetProfitInfoListByErp,ajaxGetRewardsList,ajaxGetRewardsAnnualList,ajaxGetServiceOperateList,ajaxGetCompreOperateList,ajaxGetHistorySales,
    ajaxGetMonthSalesTrend,ajaxGetZhiYingDianShiXiao,ajaxGetFenChanPinXiaoLiang,ajaxGetYearSalesTrend,ajaxGetYearTarget,ajaxGetYearAccumulated,ajaxGetOverallSalesBDDYWC,
    ajaxGetOverallSalesQSDYWC,ajaxGetOverallSalesZQDYWC,ajaxGetOverallSalesQGDYWC,ajaxGetSalesOperation,ajaxGetSalesOperationStoreTable,ajaxGetSalesOperationQgTable,
    ajaxGetSalesOperationQsTable,ajaxGetSalesOperationZqTable,ajaxGetZhiYingDianShiXiao2, ajaxGetSalesOperationByDealerId} from '../../../api/getData'

export default {
  data() {
    return {
      origialErpId:'',
      erpId:'',
      monthBrokenId:'monthBrokenId',
      monthBorkenShow: false,
      monthBorkenData:{
          title:'月度销售',
          // xAxisData:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
          // seriesData1:[120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 230, 210], // 提车
          // seriesData2:[120, 182, 191, 234, 290, 330, 310, 101, 134, 90, 230, 210], // 实销
          // seriesData3:[0, 232, 201, 154, 190, 330, 410, 101, 134, 90, 230, 210] // 库存
      },
      yearBrokenId:'yearBrokenId',
      yearBorkenShow: false,
      yearBrokenData:{
          title:'年度销售',
          // xAxisData:['2019年','2018年','2017年','2016年','2015年'],
          // seriesData1:[120, 132, 101, 134, 90], // 提车
          // seriesData2:[120, 182, 191, 234, 290], // 实销
          // seriesData3:[0, 232, 201, 154, 190] // 库存
      },
      prizeForm:{
          rewardsType:'',
          startYear:'2017',
          endYear:'2019',
      },
      prizeOptions:[{label:'全部类型',value:''},{label:'奖励',value:'奖励'},{label:'考核',value:'考核'},{label:'调整',value:'调整'}],
      serviceYear:new Date(),
      saleYear:'',
      saleYearVal:'',

      saleClueYearMonthValue:  new Date(),
      saleOperationYearValue:  new Date(),
      saleClueYearMonth: '',
      saleOperationYear: '',
     saleOperationTableData:[], // 销售运营数据

      profitList:[], // 盈利情况
      rewardList:[], // 奖惩信息
      annualList:[], // 年度表彰
      serviceList:[], // 服务运营
      compreList:[], // 综合运营
      historyData:{}, // 历史销量
      proMonthList:[], // 产品销量
      proYearList:[],  // 产品销量
      proYearTotal:[], // 产品销量
      proMonthTotal:{}, // 产品销量
      shopMonthList:[], // 直营店
      shopYearList:[], // 直营店
        yearTit:[],
      overAllYearTarget:{}, // 总体销量-当年目标
      overAllYearAccumulated:{}, // 总体销量-当年累计
      bdxsyyList:{},qgxsyyList:{},sxsyyList:{},qyxsyyList:{}, // 销售运营
      saleChartData:[],
      overAllStoreMonth:{cunXiaoBi: "",
          getCar: "325",
          inventory: "622",
          saleCar: "365",
          "shiXiaoHuanBi": "-20.0",
          "shiXiaoTongBi": "5.0",
          "tiCheHeuanBi": "-30.0",
          "tiCheTongBi": "-21.0"}, // 总体销量-本店当月完成
      overAllProvinceMonth:{}, // 总体销量-省当月完成
      overAllWarzone:{}, // 总体销量-战区当月完成
      overAllWholeCountry:{}, // 总体销量-全国当月完成
    }
  },
  props:['dealerId'],
  created(){
      let erpId = this.$route.query.erpId
      this.erpId = '00000'+erpId
      this.origialErpId = erpId
      this.init()
  },
  methods: {
    init(){
        // 获取当前年月
        let dateVal = new Date()
        this.saleYear = dateVal
        let year = dateVal.getFullYear()
        let month = dateVal.getMonth()
        this.saleYearVal = year + this.add0(month+1)

        this.getProfitInfoListByErp()
        this.getRewardsList()
        this.getRewardsAnnualList()
        this.getServiceOperateList()
        this.getCompreOperateList()
        this.getHistorySales()
        this.getZhiYingDianShiXiao()
        this.getFenChanPinXiaoLiang()
        this.getMonthSalesTrend()
        this.getYearSalesTrend()
        this.getYearAccumulated()
        this.getOverallSalesBDDYWC()
        this.getOverallSalesQSDYWC()
        this.getOverallSalesZQDYWC()
        this.getOverallSalesQGDYWC()
        this.getYearTarget()

        this.getSalesOperationStoreTable()
        this.getSalesOperationQgTable()
        this.getSalesOperationQsTable()
        this.getSalesOperationZqTable()
        this.handleSearchSaleOperation()
    },
    // 销售运营-切换年月
    saleDateChange(){
      let val = this.saleYear
      if(val) {
          this.saleYearVal = this.formatMonth(val)
      } else {
          this.saleYearVal = ''
      }
    },

    handleSelectYearOfSaleOperation(value){
        this.saleOperationYear = value? value: '';
    },

    add0(val){
        let txt = val
      if(val<10){
          txt = '0'+val
      }
      return txt+''
    },
    formatMonth(val){
        let dateVal = new Date(val)
        let year = dateVal.getFullYear()
        let month = dateVal.getMonth()
        return year + this.add0(month+1)
    },
    // 查询销售运营
    querySaleOperateFun(){
        this.getSalesOperationStoreTable()
        this.getSalesOperationQgTable()
        this.getSalesOperationQsTable()
        this.getSalesOperationZqTable()
    },


      /**
       * 查询销售运营
       */
      handleSearchSaleOperation(){
          const params = {
              dealerId:this.dealerId,
              year: this.saleOperationYear
          }
          ajaxGetSalesOperationByDealerId(params, (data)=>{
              this.saleOperationTableData = data.list || [];
          })
      },

      // 销售运营-表格- 本店
    getSalesOperationStoreTable(){
      let params = {
          erp:this.erpId,
          calmonth: this.saleYearVal
      }
      let self = this
      ajaxGetSalesOperationStoreTable(params,data => {
          if(data && data.bdXsyy) {
            self.bdxsyyList = data.bdXsyy || {}
          }
      })
    },
    // 销售运营-表格- 全国
    getSalesOperationQgTable(){
        let params = {
            erp:this.erpId,
            calmonth: this.saleYearVal
        }
        let self = this
        ajaxGetSalesOperationQgTable(params,data => {
            if(data && data.qgXsyy) {
              self.qgxsyyList = data.qgXsyy || {}
            }
        })
    },
    // 销售运营-表格- 全省
    getSalesOperationQsTable(){
        let params = {
            erp:this.erpId,
            calmonth: this.saleYearVal
        }
        let self = this
        ajaxGetSalesOperationQsTable(params,data => {
            if(data && data.sXsyy) {
              self.sxsyyList = data.sXsyy || {}
            }
        })
    },
    // 销售运营-表格- 战区
    getSalesOperationZqTable(){
        let params = {
            erp:this.erpId,
            calmonth: this.saleYearVal
        }
      let self = this
        ajaxGetSalesOperationZqTable(params,data => {
            if(data && data.qyXsyy) {
              self.qyxsyyList = data.qyXsyy
            }
        })
    },

    // 总体销量-全国当月完成
    getOverallSalesQGDYWC(){
        let params = {
            erp:this.erpId
        }
        ajaxGetOverallSalesQGDYWC(params,data => {
            if(data && data.nationwideMonthFinish) {
                this.overAllWholeCountry = data.nationwideMonthFinish
            }
        })
    },
    // 总体销量-战区当月完成
    getOverallSalesZQDYWC(){
        let params = {
            erp:this.erpId
        }
        ajaxGetOverallSalesZQDYWC(params,data => {
            if(data && data.distMonthFinish) {
                this.overAllWarzone = data.distMonthFinish
            }
        })
    },
    //总体销量-省当月完成
    getOverallSalesQSDYWC(){
        let params = {
            erp:this.erpId
        }
        ajaxGetOverallSalesQSDYWC(params,data => {
            if(data && data.provinceMonthFinish) {
                this.overAllProvinceMonth = data.provinceMonthFinish
            }
        })
    },
    // 总体销量-本店当月完成
    getOverallSalesBDDYWC(){
        let params = {
            erp:this.erpId
        }
        ajaxGetOverallSalesBDDYWC(params,data => {
            if(data && data.benDianMonthFinish) {
                this.overAllStoreMonth = data.benDianMonthFinish
            }
        })
    },
    // 总体销量-当年累计
    getYearAccumulated(){
        let params = {
            erp:this.erpId
        }
        ajaxGetYearAccumulated(params,data => {
            if(data && data.yearAccumulated) {
                this.overAllYearAccumulated = data.yearAccumulated
            }
        })
    },
    // 总体销量-当年目标
    getYearTarget(){
        let params = {
            erp:this.erpId
        }
        ajaxGetYearTarget(params,data => {
            if(data && data.yearTarget) {
                this.overAllYearTarget = data.yearTarget
            }
        })
    },
    // 分产品销量
    getFenChanPinXiaoLiang(){
        let params = {
            erp:this.erpId
        }
        let self = this
        ajaxGetFenChanPinXiaoLiang(params,data => {
            if(data && data.data) {
                self.proMonthList = data.data.monthList
                self.proYearList = data.data.yearList
                self.proYearTotal = data.data.yearTotalList
                self.proMonthTotal = data.data.currentMonthTotal
            }
        })
    },
    // 直营店实销
    getZhiYingDianShiXiao(){
        let params = {
            erp:this.erpId
        }
        let self = this
        ajaxGetZhiYingDianShiXiao2(params,data => {
            if(data && data.dealer){
              self.shopYearList = data.dealer
                if(data.dealer.length>0) {
                    let temp = []
                    data.dealer[0].timeList.map(titem => {
                        temp.push(parseInt(titem.time))
                    })
                    let sortTemp = temp.sort(self.sortFun)
                    let tempB = []
                    // sortTemp.map(item => {
                    //     if(item<10) {
                    //         tempB.push('0'+item)
                    //     } else {
                    //         tempB.push(item+'')
                    //     }
                    // })
                    // data.dealer.map(item => {
                    //     let temp = item.timeList
                    //     tempB.pu
                    // })
                    self.yearTit = sortTemp

                }
            }
        })
    },
    sortFun(a,b){
        if(a>b){
            return 1
        }else if(a===b){
            return 0
        }else if(a<b){
            return -1
        }
    },
    // 销售趋势-年度销量
    getYearSalesTrend(){
        let params = {
            erp:this.erpId
        }
        ajaxGetYearSalesTrend(params,data => {
            if(data && data.yearSalesMap){
                let temp = data.yearSalesMap
                let xAxisData = []
                // 库存
                let kucun = []
                temp.stockList.map(item => {
                    kucun.push(item.salesCar)
                })

                // 提车和实销
                let getCar = []
                let salesCar = []
                temp.getSaleList.map(item => {
                    getCar.push(item.getcar)
                    salesCar.push(item.salesCar)
                    xAxisData.push(item.year+'年')
                })
                this.yearBrokenData.xAxisData = xAxisData
                this.yearBrokenData.seriesData1 = getCar
                this.yearBrokenData.seriesData2 = salesCar
                this.yearBrokenData.seriesData3 = kucun
                this.yearBorkenShow = true
            }
        })
    },
    //销售趋势-月度销量
    getMonthSalesTrend(){
        let params = {
            erp:this.erpId
        }
        ajaxGetMonthSalesTrend(params,data => {
            if(data && data.monthSalesMap){
                let temp = data.monthSalesMap
                let xAxisData = []
                // 库存
                let kucun = []
                temp.stockList.map(item => {
                    kucun.push(item.salesCar)
                    xAxisData.push(item.month+'月')
                })

                // 提车和实销
                let getCar = []
                let salesCar = []
                temp.getSaleList.map(item => {
                    getCar.push(item.getcar)
                    salesCar.push(item.salesCar)
                })
              this.monthBorkenData.xAxisData = xAxisData
              this.monthBorkenData.seriesData1 = getCar
              this.monthBorkenData.seriesData2 = salesCar
              this.monthBorkenData.seriesData3 = kucun
              this.monthBorkenShow = true
            }
        })
    },
    // 历史销量
    getHistorySales(){
        let params={
          erp:this.erpId
        }
        ajaxGetHistorySales(params,data => {
            if(data && data.historySalesMap){
                this.historyData = data.historySalesMap
            }
        })
    },
    // 获取综合运营评估
    getCompreOperateList(){
      let params = {
          dealerId: this.dealerId
      }
      let self = this
      ajaxGetCompreOperateList(params,data => {
          if(data && data.voList){
              let temp = data.voList
              temp.map(item => {
                  if(item.starLevel) {
                      let star = parseInt(item.starLevel)
                      if(star > 10) {
                          star = 10
                      }
                      item.starLevel = star
                  }
                  item.functional = item.functional.replaceAll(',',',<br/>')
              })
              self.compreList = temp
          }
      })
    },
    // 获取服务运营
    getServiceOperateList(){
      let year = this.getCurrentYear()
      if(this.serviceYear){
          year = this.formatYear(this.serviceYear)
      }

      let params = {
          dealerId:this.dealerId,
          year:year
      }
      ajaxGetServiceOperateList(params,data=>{
          this.serviceList = []
          if(data && data.voList){
            this.serviceList = data.voList
          }
      })
    },
    // 服务运营查询
    searchServiceFun(){
        this.getServiceOperateList()
    },
    // 获取年度表彰
    getRewardsAnnualList(){
        let params = {
            dealerId: this.dealerId
        }
        ajaxGetRewardsAnnualList(params,data=>{
          this.annualList = []
          if(data && data.annualRecognitionVOList){
              this.annualList = data.annualRecognitionVOList
          }
        })
    },
    // 获取奖惩信息
    getRewardsList(){
      let params = {
          dealerId: this.dealerId,
          rewardsType:this.prizeForm.rewardsType,
          startYear:this.formatYear(this.prizeForm.startYear),
          endYear:this.formatYear(this.prizeForm.endYear)
      }
      ajaxGetRewardsList(params,data=>{
          this.rewardList = []
          if(data && data.rewardsInfoVOList){
              this.rewardList = data.rewardsInfoVOList
          }
      })
    },
    // 查询奖惩信息
    queryPrizeFun(){
      this.getRewardsList()
    },
    // 获取盈利情况
    getProfitInfoListByErp(){
        let params = {
            erp: this.origialErpId
        }
        let self = this
        ajaxGetProfitInfoListByErp(params,data => {
            if(data && data.profitInfoList) {
                self.profitList = data.profitInfoList
            }
        })
    },
    prizeStartYearChange(val){
        let startYear = this.formatYear(val)
        let endYear = this.formatYear(this.prizeForm.endYear)
        if(endYear && (parseInt(endYear)<parseInt(startYear))){
            this.$message('开始年不能大于结束年');
            this.prizeForm.startYear = ''
            return false
        }
    },
    prizeEndYearChange(val){
        let startYear = this.formatYear(this.prizeForm.startYear)
        let endYear = this.formatYear(val)
        if(startYear && (parseInt(startYear)>parseInt(endYear))){
            this.$message('结束年不能小于开始年');
            this.prizeForm.endYear = ''
            return false
        }
    },
    formatYear(val){
        if(val){
          let dateVal = new Date(val)
          let year = dateVal.getFullYear()
          return year
        } else {
            return ''
        }
    },
    // 获取当前年
    getCurrentYear(){
      let dateVal = new Date()
      let year = dateVal.getFullYear()
      return year
    },
    chooseRegion(optionName, val) {
      this.selectRegion = {
        idx: val,
        val: val,
        name: optionName
      }
    }
  },
  components: {
      saleOperationTable,
      qwuiButton,profitTable,rewardPunishTable,annualCommend,brokenLine,serviceOperateTable,compreTable,historyTable,directShopTable,productSaleTable,overAllSalesTable,saleTable,saleClueMonth,saleStackMonth
  }
}
</script>
