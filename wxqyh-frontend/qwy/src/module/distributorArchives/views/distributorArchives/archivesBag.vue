<template>
  <div class="archivesBagWrap">
    <!-- 公司信息 -->
    <div class="componeyWrap">
      <div class="imgWrap">
        <img class="companyImg"
          :src="companyInfoData.storeImg?companyInfoData.storeImg:defaultUrl">
        <div class="pItem">
          <img :src="companyInfoData.chairmanHeadUrl?companyInfoData.chairmanHeadUrl:defaultUrl">
          <p>董事长：{{companyInfoData.chairmanName | filterEmpty}}</p>
        </div>
        <div class="pItem">
          <img :src="companyInfoData.generalManagerHeadUrl?companyInfoData.generalManagerHeadUrl:defaultUrl">
          <p>总经理：{{companyInfoData.generalManagerName | filterEmpty}}</p>
        </div>
      </div>
      <div class="companyInfo">
        <h3>{{dealerName}}</h3>
<!--        <h3>{{dataSource.belongGroup}}</h3>-->
        <div class="companyParams">
          <ul>
            <li>
              <span class="cLabel">整车ERP：</span>
              <span class="cvalue">{{companyInfoData.erpCarNo | filterEmpty}}</span>
            </li>
            <li>
              <span class="cLabel">董事长：</span>
              <span class="cvalue">{{companyInfoData.chairmanName | filterEmpty}}</span>
            </li>
            <li>
              <span class="cLabel">总经理：</span>
              <span class="cvalue">{{companyInfoData.generalManagerName | filterEmpty}}</span>
            </li>
            <li>
              <span class="cLabel">服务ERP：</span>
              <span class="cvalue">{{companyInfoData.erpSerNo | filterEmpty}}</span>
            </li>
            <li>
              <span class="cLabel">开通时间：</span>
              <span class="cvalue">{{companyInfoData.openingTime | filterEmpty}}</span>
            </li>
            <li>
              <span class="cLabel">店面级别：</span>
              <span class="cvalue">{{companyInfoData.storeLevel | filterEmpty}}</span>
            </li>
          </ul>
          <ul class="cRight">
            <li>
              <span class="cLabel">运营状态：</span>
              <span class="cvalue">{{companyInfoData.operatingState | filterEmpty}}</span>
            </li>
            <li>
              <span class="cLabel">公司地点：</span>
              <span class="cvalue">{{companyInfoData.provinceName}}{{companyInfoData.cityName}}{{companyInfoData.companyAddress | filterEmpty}}</span>
            </li>
            <li>
              <span class="cLabel">服务站简称：</span>
              <span class="cvalue">{{companyInfoData.serviceStationName | filterEmpty}}</span>
            </li>
            <!-- <li>
              <span class="cLabel">经营车型：</span>
              <span class="cvalue">{{companyInfoData.businessModels | filterEmpty}}</span>
            </li>
            <li>
              <span class="cLabel">销售责任区域：</span>
              <span class="cvalue">{{companyInfoData.salesRegionName | filterEmpty}}</span>
            </li> -->
            <li>
              <span class="cLabel">店面性质：</span>
              <span class="cvalue">{{companyInfoData.storeProperties | filterEmpty}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- tab切换 start -->
    <div class="seizeSeat">
      <div id="tabWrap"
        class="tabWrap"
        :class="{fixed:tab.isTabTop}">
        <ul class="tabInfo">
          <li :class="{current:tab.index===0}"
            @click="tab.index=0">规划开发信息</li>
          <li :class="{current:tab.index===1}"
            @click="tab.index=1">入网信息</li>
          <li :class="{current:tab.index===2}"
            @click="tab.index=2">建设信息</li>
          <li :class="{current:tab.index===3}"
            @click="tab.index=3">基础信息</li>
          <li :class="{current:tab.index===4}"
            @click="tab.index=4">运营信息</li>
          <li :class="{current:tab.index===5}"
            @click="tab.index=5">预警信息</li>
        </ul>
      </div>
    </div>
    <!-- tab切换 end -->

    <!-- tab内容 start -->
    <div class="tabConWrap">
      <planDevelop v-if="tab.index===0" :dealerId="dealerId"></planDevelop>
      <accessInformation v-if="tab.index===1" :dealerId="dealerId"></accessInformation>
      <imgBuild v-if="tab.index===2" :dealerId="dealerId"></imgBuild>
      <basicData v-if="tab.index===3" :dealerId="dealerId"></basicData>
      <operateManage v-if="tab.index===4" :dealerId="dealerId"></operateManage>
      <retireNet v-if="tab.index===5" :dealerId="dealerId"></retireNet>
    </div>
    <!-- tab内容 end -->
  </div>
</template>

<script>
import planDevelop from './components/planDevelop'
import accessInformation from './components/accessInformation'
import imgBuild from './components/imgBuild'
import basicData from './components/basicData'
import operateManage from './components/operateManage'
import retireNet from './components/retireNet'
import {
  ajaxGetBasisInfo, ajaxGetselCompanyInfo
} from '../../api/getData'
export default {
  data() {
    return {
      defaultUrl:require('@/assets/images/default/default.png'),
      dealerId: 1,
      dealerName:'',
      erpId:'',
      dataSource: {belongGroup:''},
      tab: {
        index: 0,
        isTabTop: false
      },
      companyInfoData: {} //头部整车信息
    }
  },
  created() {
    this.init()
  },
  mounted() {
    window.addEventListener('scroll', this.isTopFun)
  },
  methods: {
    init(){
        this.dealerId = this.$route.query.dealerId || 1
        this.dealerName = this.$route.query.dealerName
        this.getBasisInfo()
        this.getCompanyInfo()
    },
    getBasisInfo() {
      let params = {
        id: this.dealerId
      }
      ajaxGetBasisInfo(params, data => {
        if (data && data.qrbasisVO) {
          this.dataSource = data.qrbasisVO
        }
      })
    },
    // 公司基本信息
    getCompanyInfo() {
        let params = {
            id: this.dealerId
        }
        ajaxGetselCompanyInfo(params, data => {
            if(data && data.companyInfoVO){
                let arry = ['', '正常运营', '经营异常', '退网经销商']
                data.companyInfoVO.operatingState = data.companyInfoVO.operatingState
                    ? data.companyInfoVO.operatingState
                    : '1'
                data.companyInfoVO.operatingState =
                    arry[data.companyInfoVO.operatingState]
                this.companyInfoData = data.companyInfoVO
                if(data.companyInfoVO.chairmanHeadUrl) {
                    this.companyInfoData.chairmanHeadUrl =  _.compressURL+data.companyInfoVO.chairmanHeadUrl
                }
                if(data.companyInfoVO.generalManagerHeadUrl) {
                    this.companyInfoData.generalManagerHeadUrl =  _.compressURL+data.companyInfoVO.generalManagerHeadUrl
                }
                if(data.companyInfoVO.storeImg) {
                    this.companyInfoData.storeImg =  _.compressURL+data.companyInfoVO.storeImg
                }
            }
        })
    },
    isTopFun() {
      let top = document.getElementById('tabWrap').offsetTop + 100
      if (
        !!document.documentElement.scrollTop &&
        document.documentElement.scrollTop > top
      ) {
        this.tab.isTabTop = true
      } else {
        this.tab.isTabTop = false
      }
    },
  },
  components: {
    planDevelop,
    accessInformation,
    imgBuild,
    basicData,
    operateManage,
    retireNet
  },
  filters:{
    filterEmpty(val){
        let txt = '-'
        if(val) {
            txt = val
        }
        return txt
    }
  }
}
</script>

<style lang="less">
@import url('./css/archivesBag.less');
</style>
