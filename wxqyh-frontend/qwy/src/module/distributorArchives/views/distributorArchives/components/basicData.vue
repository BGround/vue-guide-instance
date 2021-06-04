<template>
  <!-- 基础数据信息 -->
  <div class="basicDataWrap">
    <!-- 公司基本信息 start  -->
    <div class="titWrap">
      <h4>公司基本信息</h4>
    </div>
    <div class="basicWrap">
      <div class="subTit">
        <p> · 基础信息</p>
        <!-- <a href="javascript:;">查看更多 ></a> -->
      </div>
      <div class="basicInfo">
        <basicInfo :columns="basicInfoData"></basicInfo>
      </div>

      <div class="subTit">
        <p>· 核心人员</p>
      </div>
      <div class="corePerson">
        <corePerson :columns="corePersonData"></corePerson>
      </div>

      <div class="subTit marketTab">
        <p>· 开票信息
          <span class="mrl"
            :class="{current:invoiceSaleIndex===1}"
            @click="invoiceSaleChangeFun(1)">售前</span> <i>|</i> <span :class="{current:invoiceSaleIndex===2}"
            @click="invoiceSaleChangeFun(2)">售后</span>
        </p>
      </div>
      <div class="invoiceInfo">
        <before-invoice-info v-if="invoiceSaleIndex===1" :columns="invoiceData"></before-invoice-info>
        <after-invoice-info v-else :columns="invoiceData"></after-invoice-info>
      </div>

      <div class="subTit">
        <p>· 经营服务权限</p>
      </div>
      <div class="serviceInfo">
        <serviceInfo></serviceInfo>
        <afterServiceInfo></afterServiceInfo>
      </div>
    </div>
    <!-- 公司基本信息 end -->

    <!-- 股东股本信息 start -->
    <div class="titWrap">
      <h4>股东股本信息</h4>
    </div>
    <div class="shareholdersInfo">
      <div class="subTit">
        <p @click="openShareholder"><a href="javascript:;">· 查看变更信息</a></p>
        <p class="dateItem"><span style="margin-right:10px">更新日期：{{modifyTime}}</span><span>更新人：{{updateUser}}</span></p>
      </div>
      <shareholder-table :columns="shareholderList" :gdgbTotal="gdgbTotal"></shareholder-table>
    </div>
    <!-- 股东股本信息 end -->

    <!-- 资金状况 start -->
    <div class="titWrap">
      <h4>资金状况</h4>
      <div class="dateItem">更新日期：{{statusData.updateTime}} &nbsp;&nbsp;&nbsp;&nbsp;更新人：{{statusData.updateUser}}</div>
    </div>
    <div class="capitalInfo">
      <div class="subTit">
        <p>· 授信额度(万元)</p>
        <p class="dateItem">更新日期：{{statusData.updateTime}}</p>
      </div>

      <div class="specialNumWrap">
        <ul>
          <li>
            <p>金<br>融</p>
            <div class="specialNum"
              v-if="statusData.financialRealCredit && statusData.financialRealCredit.length"><span>&yen;</span><span v-for="(item,index) in statusData.financialRealCredit.length"
                :key="index">{{statusData.financialRealCredit.substr(index,1)}}</span></div>
          </li>
          <li>
            <p>三<br>方</p>
            <div class="specialNum"
              v-if="statusData.threeWayRealCredit && statusData.threeWayRealCredit.length"><span>&yen;</span><span v-for="(item,index) in statusData.threeWayRealCredit.length"
                :key="index">{{statusData.threeWayRealCredit.substr(index,1)}}</span></div>
          </li>
        </ul>
      </div>

      <div class="subTit">
        <p>· 当月提车资金构成（万元)</p>
        <p class="dateItem">更新日期：{{statusData.updateTime}}</p>
      </div>
      <car-lift-fund-table :columns="statusData"></car-lift-fund-table>

      <div class="subTit">
        <p>· 当年累计提车资金构成(万元)</p>
        <p class="dateItem">更新日期：{{statusData.updateTime}}</p>
      </div>
      <car-lift-fund-total-table :columns="statusData"></car-lift-fund-total-table>

      <div class="subTit">
        <p>· 备注：{{statusData.mark?statusData.mark:'无'}}</p>
      </div>
    </div>
    <!-- 资金状况 end -->

    <!-- 资金余额 start -->
    <div class="titWrap">
      <h4>资金余额</h4>
      <div class="dateItem">更新日期：{{balanceData.updateTime}} &nbsp;&nbsp;&nbsp;&nbsp;更新人：{{balanceData.updateUser}}</div>
    </div>
    <div class="fundBalanceInfo">
      <div class="subTit">
        <p> · 整车资金余额</p>
      </div>
      <vehicle-capital-balance-table :columns="balanceData"></vehicle-capital-balance-table>

      <div class="subTit">
        <p> · 备件资金余额</p>
      </div>
      <capital-balance-table :columns="balanceData"></capital-balance-table>
    </div>
    <!-- 资金余额 end -->

    <!-- 人员信息 start -->
    <div class="titWrap mb10 tabTitWrap">
      <h4>人员信息 <span class="mrl"
          :class="{current:sale.index===1}"
          @click="saleChangeFun(1)">售前人员</span> <i>|</i> <span :class="{current:sale.index===2}"
          @click="saleChangeFun(2)">售后人员</span></h4>
      <!-- <div class="dateItem">更新日期：2019年1月1日 更新人：张三</div> -->
    </div>
    <div class="personInfo">

      <div class="subTit">
        <p>· 关键岗位</p>
      </div>
      <key-position-table :columns="keyData"></key-position-table>

      <div class="subTit">
        <p v-if="!isAfterSale">· 核心业务岗位</p>
        <p v-else>· 业务岗位</p>
      </div>
      <certification-post-table :columns="authData"></certification-post-table>

      <div class="subTit">
        <p v-if="!isAfterSale">· 一般业务岗位</p>
        <p v-else>· 认证岗位</p>
      </div>
      <one-filve-post-table :columns="netData"></one-filve-post-table>

      <template v-if="!isAfterSale">
        <div class="subTit">
          <p>· 业务岗位</p>
        </div>
        <business-position-table :columns="businessData"></business-position-table>
      </template>
      


      <div class="subTit">
        <p>· 在职人员信息</p>
      </div>
      <incumbents-table :columns="personInfoList"></incumbents-table>

      <div class="subTit">
        <p>· 人员变更记录</p>
      </div>
      <personal-change-table :columns="personChangeData"></personal-change-table>

    </div>
    <!-- 人员信息 end -->

    <!-- 人员培训 start  -->
    <div class="titWrap">
      <h4>人员培训 </h4>
      <div class="dateItem">更新日期：{{yearPXList.updateTime}} &nbsp;&nbsp;&nbsp;&nbsp;更新人：{{yearPXList.updateUser}}</div>
    </div>
    <!-- 年度培训统计 -->
    <div class="trainingInfo">
      <div class="subTit">
        <p> · 年度培训统计


          <el-date-picker
            v-model="trainYear"
            type="year"
            @change="trainChangeFun"
            placeholder="选择年">
          </el-date-picker>


        </p>
      </div>
      <annual-train-table :columns="yearPXList"></annual-train-table>
    </div>
    <!-- 岗位培训情况 -->
    <div class="trainingInfo">
      <div class="subTit">
        <p> · 岗位培训情况


          <el-select v-model="postParam.typeName" placeholder="请选择" @change="postChange">
            <el-option
              v-for="(item,index) in jobOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </p>
      </div>
      <job-train-table :columns="postPXList"></job-train-table>
    </div>
    <!-- 人员培训 end  -->

    <!-- 直营店信息 start -->
    <div class="titWrap mb10">
      <h4>直营店基本信息</h4>
<!--      <div class="dateItem">更新日期：2019年1月1日 &nbsp;&nbsp;&nbsp;&nbsp;更新人：张三</div>-->
    </div>
    <direct-shop-table :columns="marketList"></direct-shop-table>
    <!-- 直营店信息 end -->

    <!-- 网销平台 start -->
    <div class="titWrap mb10">
      <h4>网销平台 </h4>
    </div>
    <div class="platformInfo">
      <netpinInfo :columns="netpinList"></netpinInfo>
    </div>
    <!-- 网销平台 end -->

    <!-- 股东变更弹框 -->
    <shareholderChangePop v-show="pop.isShareholderShow"
      :shareholderInfo="shareholderInfoData"
      @closeShareholder="closeShareholder"></shareholderChangePop>
  </div>
</template>

<script>
import qwuiSelect from '@/components/qwuiBase/qwuiSelect/qwuiSelect'
import shareholderChangePop from './shareholderChangePop'
import preSaleAfterSale from './basicData/preSaleAfterSale'
import basicInfo from './basicData/basicInfo'
import corePerson from './basicData/corePerson'
import serviceInfo from './basicData/serviceInfo'
import afterServiceInfo from './basicData/afterServiceInfo'
import netpinInfo from './basicData/netpinInfo'
import shareholderTable from "./basicData/shareholderTable";
import jobTrainTable from "./basicData/jobTrainTable";
import directShopTable from "./basicData/directShopTable";
import dashboard from './basicData/dashboard'
import keyPositionTable from "./basicData/keyPositionTable";
import businessPositionTable from "./basicData/businessPositionTable";
import certificationPostTable from "./basicData/certificationPostTable";
import oneFilvePostTable from "./basicData/oneFilvePostTable";
import incumbentsTable from "./basicData/incumbentsTable";
import personalChangeTable from "./basicData/personalChangeTable";
import vehicleCapitalBalanceTable from "./basicData/vehicleCapitalBalanceTable";
import capitalBalanceTable from "./basicData/capitalBalanceTable";
import carLiftFundTable from "./basicData/carLiftFundTable";
import carLiftFundTotalTable from "./basicData/carLiftFundTotalTable";
import annualTrainTable from "./basicData/annualTrainTable";
import {
  ajaxGetAllFundBalance,
  ajaxGetAllFundingStatus,
  ajaxGetBasisInfo,
  ajaxGetSelUserInfo,
  ajaxGetShareHolder,
  ajaxGetShareHolderLog,
  ajaxTrainingStatistics,
  ajaxTrainingPage,
  ajaxGetSelNoteInfo,
  ajaxGetselMarketList,
  ajaxGetselPlatFromInfo,ajaxGetPersonRate,ajaxGetPersonInfoList,ajaxGetPersonChange
} from '../../../api/getData'
import beforeInvoiceInfo from "./basicData/beforeInvoiceInfo";
import afterInvoiceInfo from "./basicData/afterInvoiceInfo";

export default {
  props: ['dealerId'],
  data() {
    return {
      erpId:'',
      pop: {
        isShareholderShow: false
      },
      trainYear:'', // 人员培训-年
      trainYearVal:'',
      yearRegion: {
        regionData: [{ idx: '111', val: 'sfdfdf', optionName: '2019' }],
        selectRegion: {}
      },
      saleRegion: {
        regionData: [{ idx: '111', val: 'sfdfdf', optionName: 'A网' }],
        selectRegion: {}
      },
      jobOptions:[{value:'',label:'培训类型'},{value:'产品培训',label:'产品培训'},{value:'等级认证',label:'等级认证'},{value:'岗位培训',label:'岗位培训'},{value:'专项培训',label:'专项培训'},{value:'关键岗位',label:'关键岗位'},{value:'业务岗位',label:'业务岗位'},{value:'认证岗位',label:'认证岗位'}],
      // jobOptions:[{value:'',label:'培训类型'},{value:'关键岗位',label:'关键岗位'},{value:'业务岗位',label:'业务岗位'}],
      levalOptions:[{value:'',label:'认证等级'},{value:'一级',label:'一级'},{value:'二级',label:'二级'},{value:'三级',label:'三级'},{value:'四级',label:'四级'}],
      personRate:{allocation:'',realPeople:''},
      chart: {
          authChartId: 'authChartId',
          lossRate: 'lossRate',
          rateData: [],
          rzRateData: [{ value: 76.5, name: '认证率' }],
          loseRateData: [{ value: 45.6, name: '流失率' }]
      },
      sale: {
        index: 1
      },
      invoiceSaleIndex: 1,
      statusData: { updateTime: '' }, // 资金状况
      balanceData: { updateTime: '' }, // 资金余额
      basicInfoData: {}, // 基础信息
      corePersonData: {}, // 核心人员
      invoiceData: {}, // 开票信息
      basicInfoData: {}, // 基础信息
      corePersonData: {}, // 核心人员
      marketList: [], // 直营店
      keyData: [], // 关键岗位
      businessData: [], // 业务岗位
      authData: [], // 认证岗位
      netData: [], // 1.5网
      personInfoList: [], //在职人员信息列表
      personChangeData:[], // 变更人员信息
      netpinList: [],
      shareholderList: [], //股东股本列表信息
      gdgbTotal:0,// 股东股本合计
      shareholderInfoData: [], //股东变更信息数据
      modifyTime: '', //变更更新时间
      updateUser: '', //变更人
      idx: '1', //样式切换
      selectRegion: {
        idx: '',
        val: '',
        name: ''
      },
      //获取岗位数据传参
      postParam: {
        dealerId: '',
        typeName: '',
        page: 1,
        pageSize: 99
      },
      levelVal:'',
      yearPXList: {}, //年度培训列表
      postPXList: [], //岗位培训列表
      isAfterSale: false, // 售后类型
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.erpId = this.$route.query.erpId
      this.postParam.dealerId = this.dealerId
      this.trainYear = new Date()
      this.trainYearVal = new Date().getFullYear()
      this.getAllFundingStatus()
      this.getAllFundBalance()
      this.getBasisInfo()
      this.getUserInfo()
      this.getShareholder()
      this.getselMarketList()
      this.getYearPXList()
      this.postChange()
      this.getselPlatFromInfo()
      this.getSelNoteInfo()
      // this.getPersonRate() // 配备率接口被改造
      this.getKeyPersonInfo()
      this.getBusinessPersonInfo()
      this.getAuthPersonInfo()
      this.getNetPersonInfo()
      this.getzzPersonInfo()
      this.getPersonChange()
    },
    // 获取关键岗位
    getKeyPersonInfo() {
        let params = {
            businessType: this.sale.index, // 业务类型：售前1，售后2
            postType: 1, // 岗位类型：关键岗位1、业务岗位2、认证岗位3、1.5网人员4
            erp: this.erpId
        }
        ajaxGetPersonRate(params, data => {
            if(data && data.personInfo) {
                this.keyData = data.personInfo
            }
        })
    },
    // 获取业务岗位
    getBusinessPersonInfo() {
        let params = {
            businessType: this.sale.index, // 业务类型：售前1，售后2
            postType: 2, // 岗位类型：关键岗位1、业务岗位2、认证岗位3、1.5网人员4
            erp: this.erpId
        }
        ajaxGetPersonRate(params, data => {
            if(data && data.personInfo) {
                this.businessData = data.personInfo
            }
        })
    },
    // 认证岗位
    getAuthPersonInfo() {
        let params = {
            businessType: this.sale.index, // 业务类型：售前1，售后2
            postType: 5, // 岗位类型：关键岗位1、业务岗位2、认证岗位3、1.5网人员4 核心岗位5
            erp: this.erpId
        }
        ajaxGetPersonRate(params, data => {
            if(data && data.personInfo) {
                this.authData = data.personInfo
            }
        })
    },
    // 一般业务岗位
    getNetPersonInfo() {
        let params = {
            businessType: this.sale.index, // 业务类型：售前1，售后2
            postType: 6, // 岗位类型：关键岗位1、业务岗位2、认证岗位3、1.5网人员4 一般业务岗位，传6
            erp: this.erpId
        }
        ajaxGetPersonRate(params, data => {
            if(data && data.personInfo) {
                this.netData = data.personInfo
            }
        })
    },
    // 售前售后切换
    saleChangeFun(inx) {
        this.sale.index = inx
        this.isAfterSale = inx === 2;
        this.getKeyPersonInfo()
        this.getBusinessPersonInfo()
        this.getAuthPersonInfo()
        this.getNetPersonInfo()
    },
    // 获取在职人员信息
    getzzPersonInfo() {
        let params = {
            erpNo: this.erpId
        }
        ajaxGetPersonInfoList(params, data => {
            if(data && data.personInfo) {
              this.personInfoList = data.personInfo
            }
        })
    },
    // 获取变更人员
    getPersonChange(){
        let params = {
            // dealerId: this.dealerId,
            erpNo: this.erpId
        }
        ajaxGetPersonChange(params, data => {
            if (data && data.personChangeList) {
                this.personChangeData = data.personChangeList
                console.log(data.personChangeList)
            }
        })
    },
    // 年度培训变化
    trainChangeFun(year){
      let newYear = new Date(year).getFullYear()
      this.trainYearVal = newYear
      this.getYearPXList()
    },
    // 获取配备率
    getPersonRate() {
        let params = {
            deptId: this.erpId,
            btype: this.sale.index // 售前1，售后2
        }
        ajaxGetPersonRate(params, data => {
            if (data) {
                this.personRate = data
                this.chart.rateData = [{ value: data.rate, name: '配备率' }]
            }
        })
    },
    // 网销平台
    getselPlatFromInfo() {
      let params = {
        id: this.dealerId
      }
      ajaxGetselPlatFromInfo(params, data => {
        if (data && data.platFromVO) {
          this.netpinList=data.platFromVO
        }
      })
    },
    // 直营店信息
    getselMarketList() {
      let params = {
        id: this.dealerId
      }
      let self = this
      ajaxGetselMarketList(params, data => {
        if (data && data.pageData) {
            self.marketList = data.pageData
        }
      })
    },
    // 基础信息
    getBasisInfo() {
      let params = {
        id: this.dealerId
      }
      ajaxGetBasisInfo(params, data => {
        if (data && data.qrbasisVO) {
          this.basicInfoData = data.qrbasisVO
        }
      })
    },
    // 核心人员
    getUserInfo() {
      let params = {
        id: this.dealerId
      }
      ajaxGetSelUserInfo(params, data => {
        if (data && data.qrUserPO) {
          this.corePersonData = data.qrUserPO
        }
      })
    },
    // 开票信息
    getSelNoteInfo() {
      let params = {
        id: this.dealerId
      }
      let self = this
      ajaxGetSelNoteInfo(params, data => {
        if (data && data.qrbasisVO) {
            self.invoiceData = data.qrbasisVO
        }
      })
    },
    // 开票信息售前售后
    invoiceSaleChangeFun(index) {
      this.invoiceSaleIndex = index
    },
    // 资金状况
    getAllFundingStatus() {
      let params = { dealerId: this.dealerId }
      let self = this
      ajaxGetAllFundingStatus(params, data => {
        if (data) {
            self.statusData = data
            self.statusData.financialRealCredit = data.financialRealCredit.toString()
            self.statusData.threeWayRealCredit = data.threeWayRealCredit.toString()
        }
      })
    },
    // 资金余额
    getAllFundBalance() {
      let params = { dealerId: this.dealerId }
      let self = this
      ajaxGetAllFundBalance(params, data => {
        if (data) {
          self.balanceData = data
        }
      })
    },
    // 打开股东变更弹框
    openShareholder() {
      this.pop.isShareholderShow = true
      this.getShareholderbg()
    },
    // 关闭股东变更弹框
    closeShareholder() {
      this.pop.isShareholderShow = false
    },
    // chooseRegion(optionName, val) {
    //   this.selectRegion = {
    //     idx: val,
    //     val: val,
    //     name: optionName
    //   }
    //   this.getYearPXList()
    // },
    // 获取股东股本信息
    getShareholder() {
      let params = {
        id: this.dealerId
      }
      ajaxGetShareHolder(params, data => {
        if (data.shareHolderPoList && data.shareHolderPoList.length > 0) {
            this.shareholderList = data.shareHolderPoList
            this.modifyTime = data.shareHolderPoList[0].updateTime.substr(0,10)
            this.updateUser = data.shareHolderPoList[0].updateUser

            // let temp = 0
            // data.shareHolderPoList.map(item => {
            //     temp+=parseInt(item.money)
            // })
            // this.gdgbTotal=temp
        }
        if(data.totleMoney){
            this.gdgbTotal=data.totleMoney
        }
      })
    },
    // 获取股东信息变更数据
    getShareholderbg() {
      let params = {
        id: this.dealerId
      }
      ajaxGetShareHolderLog(params, data => {
        this.shareholderInfoData = data.shareHolderLogList
      })
    },
    // 培训类型切换
    postChange() {
      // this.idx = eq
      // let typeName = eq === '1' ? '关键岗位' : '业务岗位'
      // this.postParam.typeName = typeName
      ajaxTrainingPage(this.postParam, data => {
          if(data && data.pageData) {
              this.postPXList = data.pageData
          } else {
              this.postPXList = []
          }
      })
    },
    // 获取年度培训参数
    getYearPXList() {
      // if (!this.selectRegion) {
      //   this.selectRegion.name = ''
      // }
      // let year = new Date().getFullYear()
      // this.selectRegion.name = this.selectRegion.name
      //   ? this.selectRegion.name
      //   : year

      let params = {
        dealerId: this.dealerId,
        year: this.trainYearVal
      }
      ajaxTrainingStatistics(params, data => {
          if(data) {
              this.yearPXList = data
              if(data.updateTime) {
                  this.yearPXList.updateTime = data.updateTime.substr(0,10)
              }
          } else {
            this.yearPXList = []
            this.yearPXList.updateTime = ''
          }
      })
    }
  },
  components: {
    qwuiSelect,
    shareholderChangePop,
    preSaleAfterSale,
    basicInfo,
    corePerson,afterServiceInfo,
    beforeInvoiceInfo,afterInvoiceInfo,carLiftFundTotalTable,annualTrainTable,
    serviceInfo,oneFilvePostTable,incumbentsTable,personalChangeTable,vehicleCapitalBalanceTable,capitalBalanceTable,carLiftFundTable,
    netpinInfo,shareholderTable,jobTrainTable,directShopTable,dashboard,keyPositionTable,businessPositionTable,certificationPostTable
  }
}
</script>
