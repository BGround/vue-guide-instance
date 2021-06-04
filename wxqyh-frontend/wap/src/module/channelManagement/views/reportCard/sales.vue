<template>
  <div class="report-card-sales">
    <qw-water-mark :content="getUserName" :font="14" :opacity="0.15">
      <dealerInfo :data="getDealerInfo"></dealerInfo>
      <div class="gutter"></div>

      <citySharePerformance :salesReport="salesreport" :performance="marketPerformance"></citySharePerformance>
      <div class="gutter"></div>
      <productCompare :brandList="salesreportMarketBrandList" :marketPerformance="marketPerformance"></productCompare>
      <div class="gutter"></div>

      <salesPerformance :sales="salePerformance" :salesReport="salesreport" />
      <div class="gutter"></div>
      <rewardAndPunishment :reward="salesreportRewards"  :salesReport="salesreport" ></rewardAndPunishment>
      <div class="gutter"></div>

      <feedback @afterFeedback="handleFeedback" :reportDetail="salesreport" @print="handlePrint" :isAdmin="isAdmin">

      </feedback>

    </qw-water-mark>

  </div>
</template>

<script>
import dealerInfo from '@/module/channelManagement/components/reportCard/dealerInfo'
import planningInfo from '@/module/channelManagement/components/reportCard/planningInfo'
import salesPerformance from '@/module/channelManagement/components/reportCard/salesPerformance'
import rewardAndPunishment from '@/module/channelManagement/components/reportCard/rewardAndPunishment'
import feedback from '@/module/channelManagement/components/reportCard/feedback'
import { saveSalesFeedback, getSalesreportSales, getMarketReportInfo, readSalesreport, getSalesreportDetail, checkRegionAdmin} from '@/module/channelManagement/api/reportCard'
import { Toast } from "quickwork-ui";
import dayjs from 'dayjs'

import productCompare from "@/module/channelManagement/components/reportCard/productCompare";

import citySharePerformance from "@/module/channelManagement/components/reportCard/citySharePerformance";


export default {
  components: {
    dealerInfo,
    planningInfo,
    salesPerformance,
    rewardAndPunishment,
    feedback,
    citySharePerformance,
    productCompare,

  },
  data() {
    return {
      dealer: {},
      salesreport: {},
      salesreportMarket: {},
      salesreportSalesSalesList: [],
      salesreportMarketBrandList: [],
      salesreportSalesCarList: [], // 提车
      salesreportSales: {},
      rewardsList: [],
      files:[],
      imgs: [],
      feedback: '',
      isDisabledFeedback:false,
      reportCardId: '',
      dataBase: dataBase,
        imgsbase64: '',

        dealerId: '',
        salePerformance: {},
        marketPerformance: {},
        salesreportRewards:{},
        isAdmin: false,
    }
  },
  computed:{
    getDealerInfo(){
      return this.convertDealerData(this.salesreport)
    },
    getUserName(){
      return this.dataBase && this.dataBase.config && this.dataBase.config.personName ? this.dataBase.config.personName :''
    },
    getPrevMonth(){
        const year = this.salesreport.year
        const month = this.salesreport.month
        if(year && month){
          const d = new Date(year, month -2);
          return `${d.getFullYear()}年${d.getMonth()+1}月`
        }else{
          return ''
        }
    },
    getcurrentMonth(){
        const year = this.salesreport.year
        const month = this.salesreport.month
        if(year && month){
          return `${year}年${month}月`
        }else{
          return ''
        }
    }
  },
  methods: {

    handleSubmit({fileNames, files, content, imgs}){
          this.isDisabledFeedback = true;
          const params={
              id: this.salesreport.id,
              fileNames: fileNames,
              files: files || [],
              content: content ||'',
              imgs: imgs ||[],
          };
          saveSalesFeedback(params).then((data)=>{
            this.isDisabledFeedback = true;
            Toast({
              type: "success",
              duration: 1500,
              content: '查阅成功'
            });
          }).catch((error)=>{
            this.isDisabledFeedback = false;
            Toast({
              type: "info",
              duration: 1500,
              content: error.message
            });
          })
      },

    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      return isObject && !!Object.keys(target).length
    },
    convertDealerData(salesreport) {
      if (!this.isNonEmptyObject(salesreport)) {
        return {}
      }
      const publishDate =  salesreport.pushTime? salesreport.pushTime.substring(0,10): '暂无';
      return {
        name: `${salesreport.dealerShortName}${salesreport.year}年${salesreport.month}月成绩单`,
        date: `发布日期：${publishDate}`,
        address: `地区：${salesreport.province||''}${salesreport.city||''}`,
        statusText: salesreport.readStatusDesc,
        statusColor: salesreport.readStatus === '2' ? '#06ACFF' : '#C6001F',
        avatar: '',
        extra: [
          {
            label: 'ERP号',
            value: salesreport.erp
          },
          {
            label: '开通日期',
            value: salesreport.dealerTime || '-'
          },
          {
            label: '所属集团',
            value: salesreport.dealerGroup || '-'
          }
        ]
      }
    },

      handleclickTest(){
          html2canvas(document.querySelector(".report-card-sales")).then(canvas => {
              // document.body.appendChild(canvas)
              const xx = canvas.toDataURL();
              // window.open(xx);
              location.href = xx;
          });
      },

      handlePrint(){
          const query = this.salesreport;
          this.$router.push({name:'preview', query: query})
      },

      handleFeedback(){
          this.$set(this.salesreport, 'readStatusDesc', '已反馈');
      },
      setRead() {
        readSalesreport({ id:this.id }).then((data)=>{
          // 如果是readStatus为4，即已反馈的成绩单会返回data:{ NO_PERMISSION:false}
          if(data){
            if(data === 'NO_PERMISSION'){
              this.isDisabledFeedback = true;
            }else if(Object.keys(data).length == 0){ //如果是空对象则可以变状态，否则不能改变成已读状态
              this.$set(this.salesreport, 'readStatus', '3');
              this.$set(this.salesreport, 'readStatusDesc', '已读');
            }
          }
        })
      }
  },
    created() {
        this.id = this.$route.query.id || '';
        this.dealerId = this.$route.query.dealerId || '';

        getSalesreportDetail({id: this.id}).then((data)=>{
            if(data && data.salesreportDetail){
                this.salePerformance = data.salesreportDetail.salesreportSalesPO || {}; //销量表现
                this.marketPerformance = data.salesreportDetail.marketReportInfo || {}; // 市场表现
                this.salesreportRewards = data.salesreportDetail.salesreportRewards || {};
                this.salesreport = data.salesreportDetail.salesreport || {};
                this.salesreportMarketBrandList = this.marketPerformance.brandList ? this.marketPerformance.brandList: [];
                this.setRead() // 设置已读
                checkRegionAdmin().then(res=>{
                  if (res) {
                    this.isAdmin = res.isAdmin? true : false;
                  }
                })
            }
        })




        // // 销量表现
        // getSalesreportSales({id:this.id}).then((data)=>{
        //
        // })
        //
        // //移动端-市场表现
        // getMarketReportInfo({id:this.id}).then((data)=>{
        //     this.cityPerformance = data || {};
        //     this.salesreportMarketBrandList = data ? data.brandList : [];
        // })


  }
}
</script>

<style lang="scss" scoped>
.report-card-sales {
  .gutter {
    height: 10px;
    background: rgba(247, 247, 247, 1);
  }

  /deep/ .qw-water-mark__list{
    pointer-events: none;
  }

}
</style>
