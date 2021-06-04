<template>
  <div class="schoolReportDesWrap">
    <!-- 基础信息  -->
    <template>
      <title-wrap class="titWrap" :title="'基础信息'"></title-wrap>
      <school-report-info :columns="dataSource.salesreport"></school-report-info>
    </template>

    <!-- 市场表现  -->


    <template>
      <title-wrap class="titWrap" :title="'市场表现'" :description="( getPrevMonth ? ('数据：'+ getPrevMonth +'自主市占率') : '')"></title-wrap>
      <div class="marketInfo">
        <city-rate :salesreportMarket="marketData.marketPO"></city-rate>
        <self-rate :salesreportMarket="marketData.marketPO" :salesreport="marketData"></self-rate>
        <compare-rate :compareData="marketData.brandList" :marketData="marketData"></compare-rate>
      </div>
    </template>

    <!-- 销量表现  -->
    <template>
      <title-wrap class="titWrap" :title="'销量表现'" :description="'注：提车数据采用公司单点报表数据，未考虑集团统算，具体政策核算结果以财务公示为准'"></title-wrap>
      <div class="competeInfo">
        <div class="tableWrap">
          <div class="subTit">
            <p class="strongTit"> · 提车（{{getCurrentMonth}}）</p>
          </div>
          <pickCarTable>
            <tr class="white">
              <td class="borderR">{{dataSource.salesreportSales.carTarget | defaultValue}}</td>
              <td class="borderR">{{dataSource.salesreportSales.carComplete | defaultValue}}</td>
              <td class="borderR">{{dataSource.salesreportSales.carPercent | filterNum}}%</td>
              <td class="borderR">{{dataSource.salesreportSales.carYearOnYear | filterNum}}%</td>
              <td class="borderR">{{dataSource.salesreportSales.carMonthOnMonth | filterNum}}%</td>
              <td class="borderR">{{dataSource.salesreportSales.carCountrySort | defaultValue}}</td>
              <td class="borderR">{{dataSource.salesreportSales.carAreaSort | defaultValue}}</td>
              <td class="borderR">{{dataSource.salesreportSales.carProvinceSort | defaultValue}}</td>
              <td class="borderR">{{dataSource.salesreportSales.carCitySort | defaultValue}}</td>
              <td>{{dataSource.salesreportSales.carDealerNum | defaultValue}}</td>
            </tr>
          </pickCarTable>

          <div class="subTit">
            <p class="strongTit"> · 实销（{{getCurrentMonth}}）</p>
          </div>
          <salesTable>
            <tr class="white">
              <td class="borderR">{{dataSource.salesreportSales.salesTarget | defaultValue}}</td>
              <td class="borderR">{{dataSource.salesreportSales.salesComplete | defaultValue}}</td>
              <td class="borderR">{{dataSource.salesreportSales.salesPercent | filterNum}}%</td>
              <td class="borderR">{{dataSource.salesreportSales.salesYearOnYear | filterNum}}%</td>
              <td class="borderR">{{dataSource.salesreportSales.salesMonthOnMonth | filterNum}}%</td>
              <td class="borderR">{{dataSource.salesreportSales.salesCountrySort | defaultValue}}</td>
              <td class="borderR">{{dataSource.salesreportSales.salesAreaSort | defaultValue}}</td>
              <td class="borderR">{{dataSource.salesreportSales.salesProvinceSort | defaultValue}}</td>
              <td class="borderR">{{dataSource.salesreportSales.salesCitySort | defaultValue}}</td>
              <td>{{dataSource.salesreportSales.salesDealerNum | defaultValue}}</td>
            </tr>
          </salesTable>

          <div class="subTit">
            <p class="strongTit">· 库存（{{getCurrentMonth}}）</p>
          </div>
          <table class="firstTable">
            <tr>
              <th colspan="2" class="table-head">月度库存情况</th>
            </tr>
            <tr class="graybg">
              <th class=" borderR">库存数</th>
              <th>存销比</th>
            </tr>
            <tr class="white">
              <td class="borderR">{{dataSource.salesreportSales.stock || '-'}}</td>
              <td>{{dataSource.salesreportSales.stockPercent | filterNum}}</td>
            </tr>
          </table>
        </div>
      </div>
    </template>

    <!-- 奖惩信息  -->
    <template>
      <title-wrap class="titWrap" :title="'奖惩信息'" :description="( getPrevMonth ? ( '数据：' + getPrevMonth + '已执行考核明细' ) : '')"></title-wrap>
      <div style="padding: 10px;">
        <h4>当年奖惩</h4>
        <div class="info-overview">
          <p>奖励次数：<span class="red-data">{{rewardsData.yearSize || '-'}}</span></p>
          <p>奖励金额：<span class="red-data">{{rewardsData.yearAmount || '-'}}</span></p>
        </div>
        <div class="info-overview">
          <p>处罚次数：<span class="red-data">{{rewardsData.yearPunishSize || '-'}}</span></p>
          <p>处罚金额：<span class="red-data">{{rewardsData.yearPunishAmount || '-'}}</span></p>
        </div>
        <div class="info-overview">
          <p>累计次数：<span class="red-data">{{formatRewardSize(rewardsData.yearSize,rewardsData.yearPunishSize)}}</span></p>
          <p>累计金额：<span class="red-data">{{formatRewardAmount(rewardsData.yearAmount,rewardsData.yearPunishAmount)}}</span></p>
        </div>
        <h4 style="margin-top:16px">当月奖惩</h4>
        <div class="info-overview">
          <p>累计次数：<span class="red-data">{{rewardsData.monthSize || '-'}}</span></p>
          <p>累计金额：<span class="red-data">{{rewardsData.monthAmount || '-'}}</span></p>
        </div>
      </div>
      <rewards-table :columns="rewardsData.rewardsList"></rewards-table>
    </template>

    <!-- 经销商反馈  -->
    <template>
      <title-wrap class="titWrap" :title="'经销商反馈'"></title-wrap>
      <feedbacks-table :columns="dataSource.dealerFeedProjectVOList" :sendBackcolumns="rtnList" :feedbackUser="dataSource.salesreport.feedbackUser"
        :imgs="dataSource.imgs"></feedbacks-table>
      <!-- 退回 -->
      <div class="send_back_btn" v-if="dataSource.salesreport.readStatusDesc && dataSource.salesreport.readStatusDesc=='已反馈'">
        <qwuiButton type="primary" @click="handleShowSendBack">&nbsp;退回&nbsp;</qwuiButton>
      </div>
      <div class="send_back_mask" v-show="isShowSendBack">
        <div class="send_back_box">
          <div class="close_icon" @click="handleHideSendBack"><img :src="closeIcon"></div>
          <div class="send_back_title">退回原因</div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 12}"
            placeholder="请填写退回原因（500字以内）"
            :maxlength='1000'
            v-model="sendBackReason">
          </el-input>
          <div class="send_back_wrap">
            <div class="send_back_info">
              <div class="send_back_label">退回人</div>
              <el-input type="text" autocomplete="off" v-model="rtnUser" :disabled="true"></el-input>
            </div>
            <div class="send_back_info">
              <div class="send_back_label">退回时间</div>
              <el-input type="text" autocomplete="off" v-model="sendBackTime" :disabled="true"></el-input>
            </div>
          </div>
          <div class="send_back_submit">
            <qwuiButton type="primary" @click="handleSubmitSendBack">&nbsp;退回&nbsp;</qwuiButton>
          </div>
        </div>
      </div>
    </template>
    <!-- <div class="distrInfo">
      <div class="subTit">
        <p>培训照片</p>
      </div>

      <div class="trainInfo">
        <div class="trainL">
          <ul>
            <li>
              <img src="./images/icon_pxzp.png">
              <p class="tname">培训照片</p>
              <p><a href="javascript:;"
                  @click="isPhotoShow=true">查看</a></p>
            </li>
            <li>
              <img src="./images/icon_zgfj.png">
              <p class="tname">整改附件</p>
              <p class="fileWrap"
                v-for="(item,index) in dataSource.files"
                :key="index"><a :href="item.url"
                  :download="item.fileName">{{item.fileName}}</a></p>
              <p v-if="dataSource.files && dataSource.files.length===0"
                style="color:#999;">暂无数据</p>
            </li>
          </ul>
        </div>
        <div class="trainR">
          <div class="trainTit"><img src="./images/icon_tzryj.png"> 投资人意见</div>
          <textarea readonly
            class="remark"
            placeholder="投资人反馈意见">{{dataSource.salesreport.feedback}}</textarea>
        </div>
      </div>
      <div class="autograph">
        <span class="nameLabel">反馈人姓名</span>
        <span class="nameWrap">{{dataSource.salesreport.feedbackUser}}</span>
        {{dataSource.salesreport.feedbackTime}}
      </div>
    </div> -->
    <!-- 经销商反馈 end -->
  </div>
</template>

<script>
import closeIcon from '@/assets/images/btn_close.png'
import titleWrap from './components/detail/titleWrap'

import schoolReportInfo from './components/detail/basicInfo/schoolReportInfo.vue'

import cityRate from './components/detail/marketPerf/cityRate.vue'
import selfRate from './components/detail/marketPerf/selfRate.vue'
import compareRate from './components/detail/marketPerf/compareRate.vue'

import salesTable from './components/detail/salesPerf/salesTable.vue'
import pickCarTable from './components/detail/salesPerf/pickCarTable'

import competeTable from './components/detail/competeTable'
import marketShareTrend from './components/detail/marketShareTrend'
import competTrend from './components/detail/competTrend'
import saleVolumeTrend from './components/detail/saleVolumeTrend'

import rewardsTable from './components/detail/rewardsInfo/rewardsTable.vue'
import feedbacksTable from './components/detail/feedbacksTable'
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import {formatDate} from '@/assets/js/time-util.js'

import {
  getSalesreportSales, //销量表现
  getMarketReportInfo, //市场表现
  getSalesreportRewards, //奖惩信息
  // ajaxGetSalesreportDetail,
  getSalesreportDetail, //经销商反馈
  searchSalesreportRtnList, //退回纪录列表
  addRtnSalesreport, //提交退回
  // queryRtnUser, //退回人查询
  } from '@/module/distributorArchives/api/getData'
export default {
  data() {
    return {
      sendBackReason: '',
      sendBackTime: '',
      closeIcon,
      id: '',
      dataSource: {
        files: [],
        imgs: [],
        dealerFeedProjectVOList:[],
        salesreport: {
          dealerShortName: '',
          province: '',
          year: '',
          month: '',
          city: '',
          erp: '',
          dealerGroup: '',
          dealerTime: ''
        },
        salesreportMarket: {},
        salesreportMarketBrandList: [],
        salesreportSales: {},
        rewardsList: []
      },
      rewardsData:{ //奖惩信息
        monthAmount: '',
        monthSize: '',
        yearAmount: '',
        yearSize: '',
        rewardsList: []
      },
      marketData:{ //市场信息
        brandList:[],
        marketPO:{},
        cityPercent:'',
        citySort:'',
        month1: '',
        month2: '',
        month3:''
      },
      marketShareData: [], // 市占率折线图
      monthData: [],
      sxData: [],
      tcData: [],
      cxbData: [],
      isShowSendBack: false,
      rtnList: [], // 退回记录列表
      rtnUser: '', // 退回人
    }
  },
  created() {
      this.id = this.$route.query.id
      let params = {id: this.id}
      getSalesreportDetail(params).then(data => {
        if(data && data.salesreportDetail){
          this.dataSource = data.salesreportDetail
          // 以防返回null,导致报错
          this.dataSource.salesreportSales = data.salesreportDetail.salesreportSales || {}
          this.dataSource.salesreportMarket = data.salesreportDetail.salesreportMarket || {}
          this.dataSource.salesreport = data.salesreportDetail.salesreport || {}
        }
      })

      getSalesreportRewards(params).then(data => {
        if(data){
          this.rewardsData = data
        }
      })

      getMarketReportInfo(params).then(data => {
        if(data){
          this.marketData = data
        }
      })

      searchSalesreportRtnList(params).then(data => {
        if (data) {
          console.log(data)
          this.rtnList = data.voList
        }
      })
  },
  methods: {
    // searchRtnUser() {
    //   console.log(_.userName,_.personName)
    //   let params = {id: this.id}
    //   queryRtnUser(params).then(res=>{
    //     if (res) {
    //       console.log('rtnUser res ',res)
    //       this.rtnUser = res
    //       if (this.rtnUser) {
    //         this.sendBackTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
    //         this.isShowSendBack = true   
    //       }
          
    //     }
    //   })
    // },
    handleShowSendBack() {
      // if (!this.rtnUser) {
      //   this.searchRtnUser()
      // }
      this.rtnUser = _.personName
      this.sendBackTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
      this.isShowSendBack = true
    },
    handleHideSendBack() {
      this.isShowSendBack = false
    },
    handleSubmitSendBack() {
      let self = this
      // console.log('退回')
      let params = {
        'tbEntQrSalesreportRtnPO.mainId': this.id,
        'tbEntQrSalesreportRtnPO.rtnReason': this.sendBackReason,
        'tbEntQrSalesreportRtnPO.rtnPerson': this.rtnUser,
      }
      addRtnSalesreport(params).then(res=>{
        // console.log('addrtn res',res)
        if (res) {
          _.alert('提示', '退回成功', ()=>{
            self.$router.go(0)
          })
          this.isShowSendBack = false
        }
      })
    },
    calculateStoreRatio(saleCount, stockCount){
      const sale = parseFloat(saleCount);
      const stock = parseFloat(stockCount);
      if(!sale || !stock){
          return '0.00'
      }else{
          return  (Math.round(stock*100 / sale)/100).toFixed(2)
      }
    },

    init() {
    },

    formatChartValue(value){
      if(value === 0) {
        return 0
      }
      if(value){
        return parseFloat(value) || 0;
      }else{
        return ''
      }
    },

    formatRewardSize(size1,size2) {
      if (size1 && size2) {
        return size1 + size2
      } else if (size1) {
        return size1
      } else if (size2) {
        return size2
      } else {
        return '-'
      }
    },

    formatRewardAmount(reward,punish) {
      if (reward && punish) {
        return reward + punish
      } else if (reward) {
        return reward
      } else if (punish) {
        return punish
      } else {
        return '-'
      }
    }

    // getSalesreportDetail() {
      // ajaxGetSalesreportDetail(params, data => {
      //   if (data && data.salesreportDetail) {
      //     // 处理文件
      //     let tempUrl = _.compressURL.replace('//compress', '')
      //     data.salesreportDetail.files.map(item => {
      //       item.url = tempUrl + item.url
      //     })
      //     this.dataSource = data.salesreportDetail
      //     if (data.salesreportDetail.salesreportMarket) {
      //       let arr = data.salesreportDetail.salesreportMarket
      //       this.marketShareData.push(
      //         this.formatChartValue(arr.january),
      //         this.formatChartValue(arr.february),
      //         this.formatChartValue(arr.march),
      //         this.formatChartValue(arr.april),
      //         this.formatChartValue(arr.may),
      //         this.formatChartValue(arr.june),
      //         this.formatChartValue(arr.july),
      //         this.formatChartValue(arr.august),
      //         this.formatChartValue(arr.september),
      //         this.formatChartValue(arr.october),
      //         this.formatChartValue(arr.november),
      //         this.formatChartValue(arr.december)
      //       )
      //     }

      //     let [monthData, sxData, tcData, cxbData] = [[], [], [], []]
      //     // 分月实销完成率
      //     data.salesreportDetail.salesreportSalesSalesList.map(item => {
      //       monthData.push(item.month + '月')
      //       sxData.push(parseFloat(item.percent))
      //     })
      //     // 分月提车完成率
      //     data.salesreportDetail.salesreportSalesCarList.map(item => {
      //       tcData.push(parseFloat(item.percent))
      //     })
      //     // 分月存销比
      //     data.salesreportDetail.salesreportSalesKuCunList.map(item => {
      //       cxbData.push(parseFloat(item.percent))
      //     })
      //     this.monthData = monthData
      //     this.sxData = sxData
      //     this.tcData = tcData
      //     this.cxbData = cxbData
      //   }
      // })
    // },
  },
  components: {
    titleWrap,
    schoolReportInfo,
    cityRate,
    selfRate,
    compareRate,
    salesTable,
    rewardsTable,
    competeTable,
    marketShareTrend,
    competTrend,
    saleVolumeTrend,
    feedbacksTable,
    pickCarTable,
    qwuiButton
  },
  filters: {
    filterNum(val) {
      let txt = 0.0
      if (val) {
        txt = parseFloat(val).toFixed(2)
      }
      return txt
    },
    defaultValue(value){
        return value === 0 || !!value ? value: '-'
    }
  },
  computed:{
     getPrevMonth(){
        const year = this.dataSource.salesreport.year
        const month = this.dataSource.salesreport.month
        if(year && month){
          const d = new Date(year, month -2);
          return `${d.getFullYear()}年${d.getMonth()+1}月`
        }else{
          return ''
        }
      },
      getCurrentMonth(){
        const year = this.dataSource.salesreport.year
        const month = this.dataSource.salesreport.month
        if(year && month){
          return `${year}年${month}月`
        }else{
          return ''
        }
      }
  }
}
</script>

<style lang="less">
@import url('./css/detail.less');
.info-overview{
  display:flex;
  p{
    width:200px;
    height:24px;
    font-size:14px;
    line-height:24px;
    color:rgba(20,30,40,1);
    span{
      color:rgba(198,0,31,1);
    }
  }
}
.table-head {
  height:16px;
  font-size:12px;
  font-weight:bold;
  line-height:16px;
  color:rgba(0,0,0,1);
  border-bottom:1px solid #D5D5D5;
}
.city-rank {
  width: 62px;
  padding-left: 8px;
  padding-right: 8px;
}
.send_back_btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.send_back_mask {
  background-color: rgba(0,0,0,0.3);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;

  .send_back_box {
    border-radius: 12px;
    position: absolute;
    z-index: 11;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 20px;
    width: 500px;
    height: 600px;
    overflow-y: auto;
    background: rgba(255,255,255,1);

    .close_icon {
      position: absolute;
      right: 16px;
      top: 16px;
      width: 18px;
      z-index: inherit;
      cursor: pointer;
      img {
        width: 100%;
      }
    }

    .send_back_title {
      position: relative;
      padding: 15px 0;
      font-weight: 600;
      font-size: 16px;
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
    }

    /deep/ .el-textarea__inner {
      max-height: 300px;
    }

    .send_back_wrap {
      padding-top: 30px;
      width: 100%;
      
      .send_back_info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20px;
        .send_back_label {
          width: 80px;
          color: #999;
          font-size: 14px;
        }
      }
    }

    .send_back_submit {
      width: 100%;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

</style>
