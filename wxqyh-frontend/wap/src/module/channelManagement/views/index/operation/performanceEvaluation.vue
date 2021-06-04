<template>
  <div class="performance-evaluation">

    <qw-tab-bar :data="tabs"
                @change="handleChangeTab"
                v-model="selectedTapIndex">
    </qw-tab-bar>

    <div class="gutter"></div>

    <div class="selectbar">
      <div @click="handleClickDatePicker"
           class="selectbar__item selectbar__item--year">
        <span class="selectbar__value">{{currentYear}}</span>
        <i class="section__icon"></i>
      </div>

      <div v-if="isShowQuarter" @click="handleClickDatePicker"
           class="selectbar__item selectbar__item--month">
        <span class="selectbar__value">{{currentQuarter}}</span>
        <i class="section__icon"></i>
      </div>

      <div v-else @click="handleClickDatePicker"
           class="selectbar__item selectbar__item--month">
        <span class="selectbar__value">{{currentMonth}}</span>
        <i class="section__icon"></i>
      </div>
    </div>
    <!-- begin: 销售成绩单   -->
    <div v-if="selectedTapIndex === 'sale' && !isVisibleDefaultTips">
      <div class="gutter"></div>
      <citySharePerformance :salesReport="salesreport" :performance="marketPerformance"></citySharePerformance>
      <div class="gutter"></div>
      <productCompare :brandList="salesreportMarketBrandList" :marketPerformance="marketPerformance"></productCompare>
      <div class="gutter"></div>

      <salesPerformance :sales="salePerformance" :salesReport="salesreport" />
      <div class="gutter"></div>
    </div>
    <!-- end: 销售成绩单   -->

    <!-- begin: 服务成绩单   -->
    <div v-if="selectedTapIndex === 'service' && !isVisibleDefaultTips">
      <div class="gutter"></div>
      <performanceReward :data="serviceInfo"></performanceReward>
      <div class="gutter"></div>
      <completionStatus :data="sparePart"></completionStatus>
      <div class="gutter"></div>
      <evaluationResult :data="indicatorInfo"></evaluationResult>
      <div class="gutter"></div>
      <statisticsSuggestion :data="indicatorInfo" />
      <div class="gutter"></div>
      <div class="description">
        <span>成绩单说明</span>
        <span @click="handleClickCheckBtn">查看</span>
      </div>
      <div class="gutter"></div>
    </div>
    <!-- end: 服务成绩单   -->

    <no-data style="margin-top: 10vh" :visible="isVisibleDefaultTips" message="此月份成绩单未生成!"></no-data>



    <qw-cascade-picker
      :data="dateOptions"
      :selected-index="selectedIndex"
      @select="handleSelectDate"
      v-model="isVisibleDatePicker"
    ></qw-cascade-picker>


    <qw-popup v-model="visible.center" position="center">
      <div class="demo-popup demo-popup-center">
        <div class="content" v-html="content"></div>
      </div>
    </qw-popup>

  </div>
</template>

<script>
  import reloadApp from '@/module/channelManagement/mixins/reloadApp'
  import noData from '@/module/channelManagement/components/noData'
  import contentTitle from '@/module/channelManagement/components/contentTitle';
  import * as getData from "@/module/channelManagement/api/operation";

  import planningInfo from '@/module/channelManagement/components/reportCard/planningInfo'
  import salesPerformance from '@/module/channelManagement/components/reportCard/salesPerformance'
  import citySharePerformance from "@/module/channelManagement/components/reportCard/citySharePerformance";
  import productCompare from "@/module/channelManagement/components/reportCard/productCompare";

  import performanceReward from "@/module/channelManagement/components/reportCard/performanceReward";
  import completionStatus from "@/module/channelManagement/components/reportCard/completionStatus";
  import evaluationResult from "@/module/channelManagement/components/reportCard/evaluationResult";
  import statisticsSuggestion from "@/module/channelManagement/components/reportCard/statisticsSuggestion";
  import {getSalesReportExplain} from "@/module/channelManagement/api/reportCard";

  import dayjs from "dayjs";


  const date = dayjs(new Date()).subtract(1, 'month').toDate();

  function assemblyMonthOptions() {
    const monthMap = [
      {value: 1, text: '一月'}, {value: 2, text: '二月'}, {value: 3, text: '三月'},
      {value: 4, text: '四月'}, {value: 5, text: '五月'}, {value: 6, text: '六月'},
      {value: 7, text: '七月'}, {value: 8, text: '八月'}, {value: 9, text: '九月'},
      {value: 10, text: '十月'}, {value: 11, text: '十一月'}, {value: 12, text: '十二月'}
    ]
    return monthMap
  }

  // 装配季度选项
  function assemblyQuarterOptions() {
      const quarterMap = {'1': '一季度', '2': '二季度', '3': '三季度', '4': '四季度'}
      return [1, 2, 3, 4].map(item => {
          return {
              value: item,
              text: quarterMap[item],
          }
      })
  }

  function assemblyDateOptions(isShowQuarter) {
      console.log(isShowQuarter,'xx');
    const now = date;
    const endYear = now.getFullYear();
    const beginYear = now.getFullYear() - 9;
    const options = [];
    for (let year = beginYear; year <= endYear; year++) {
      const yearItem = {
        value: year,
        text: `${year}年`,
        children: isShowQuarter ? assemblyQuarterOptions(): assemblyMonthOptions()
      }
      options.push(yearItem)
    }
    return options
  }

  function calculateYearIndex(dateOptions) {
    const now = date;
    const currentYearItem = dateOptions.find(item => item.value === now.getFullYear())
    return currentYearItem ? dateOptions.indexOf(currentYearItem) : 0;
  }

  // dodo
  function calculateMonthIndex() {
    const month = date.getMonth();
    return parseInt(month) || 0;
  }

  function calculateQuarterIndex() {
      const month = date.getMonth();
      return parseInt(month / 3) || 0;
  }

  /**
   * 计算索引值
   */
  function calculateIndex(dateOptions, isShowQuarter) {
      if(isShowQuarter){
          return [calculateYearIndex(dateOptions), calculateQuarterIndex()]
      }
    return [calculateYearIndex(dateOptions), calculateMonthIndex()]
  }

  function currentQuarterName() {
      const month = date.getMonth();
      const quarterNameMap = ['一季度', '二季度', '三季度', '四季度']
      const quarter = parseInt(month / 3);
      return quarterNameMap[quarter]
  }

  export default {
    mixins: [reloadApp],
    components: {
        noData,
        contentTitle,
        planningInfo,
        salesPerformance,
        citySharePerformance,
        productCompare,
        performanceReward,
        completionStatus,
        evaluationResult,
        statisticsSuggestion,
    },
    data() {
      return {
        selectedTapIndex: 'sale',
        tabs: [
          {
            value: 'sale',
            label: '销售成绩单'
          },
          {
            value: 'service',
            label: '服务成绩单'
          }
        ],
        isVisibleDatePicker: false,
        dateOptions: [],
        selectedIndex: [],
        current: date,
        currentYear: `${date.getFullYear()}年`,
        currentMonth: `${date.getMonth() + 1}月`,
        currentYearValue: date.getFullYear(),
        currentMonthValue: date.getMonth() + 1,
        isLoading: false,
        salesreport: {},
        salesreportMarketBrandList: [],
        marketPerformance:{},
        salePerformance:{},
        isVisibleDefaultTips:false,

        serviceInfo: {},
        indicatorInfo: [],
        stimulateInfo: [],
        sparePart: [],
        content: "",
        visible: false,

        currentQuarter: '',
        currentQuarterValue: ''
      }
    },
    computed:{

          isShowQuarter(){
              return this.selectedTapIndex === 'service';
          },

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
    watch: {},
    methods: {

        handleClickCheckBtn() {
            this.$set(this.visible, "center", true);
        },

      handleChangeTab(tap) {
            this.$nextTick(()=>{
               this.initDateOptions();
                this.fetchData(tap)
            })
      },

      isNonEmptyObject(target) {
        const isObject = Object.prototype.toString.call(target) === '[object Object]'
        return isObject && !!Object.keys(target).length
      },

      handleClickDatePicker() {
        this.isVisibleDatePicker = true
      },

      handleSelectDate([firstColumnValue, secondColumnValue], _, [firstColumnLabel, secondColumnLabel]) {
        this.currentYear = firstColumnLabel
        this.currentYearValue = firstColumnValue
          if(this.isShowQuarter){
              this.currentQuarterValue = secondColumnValue
              this.currentQuarter = secondColumnLabel
          }else{
              this.currentMonthValue = secondColumnValue
              this.currentMonth = secondColumnLabel
          }

        this.fetchData(this.selectedTapIndex)
      },


        getEvaluationDetail(){
            const params = {
                dealerId: this.dealerId,
                year: this.currentYearValue,
                month: this.currentMonthValue,
            }

            getData.getEvaluationDetail(params).then((data)=>{
                if(this.isNonEmptyObject(data)){
                    this.isVisibleDefaultTips = false;
                    this.salePerformance = data.salesreportDetail.salesreportSalesPO || {}; //销量表现
                    this.marketPerformance = data.salesreportDetail.marketReportInfo || {}; // 市场表现
                    this.salesreportRewards = data.salesreportDetail.salesreportRewards || {};
                    this.salesreport = data.salesreportDetail.salesreport || {};
                    this.salesreportMarketBrandList = this.marketPerformance.brandList ? this.marketPerformance.brandList: [];
                }else{
                    this.isVisibleDefaultTips = true;
                }
            })
        },

        getAfterEvaluationDetail(){

            const params = {
                dealerId: this.dealerId,
                year: this.currentYearValue,
                quarter: this.currentQuarterValue,
            }

            getData.getAfterEvaluationDetail(params).then((data)=>{
                if(this.isNonEmptyObject(data)){
                    this.isVisibleDefaultTips = false;
                    this.serviceInfo = data.serviceInfo || {};
                    this.indicatorInfo = data.indicatorInfo || [];
                    this.stimulateInfo = data.stimulateInfo || {};
                    this.sparePart = data.sparePart || [];
                    this.files = data.serviceInfo.reportFiles || [];
                    this.imgs = data.serviceInfo.reportImgs || [];

                }else{
                    this.isVisibleDefaultTips = true;
                }
            })
        },

        fetchData(tap){
            if(tap === 'sale'){
                this.getEvaluationDetail()
            }
            if(tap === 'service'){
                this.getAfterEvaluationDetail()
            }
      },

        initDateOptions(){
            this.dateOptions = assemblyDateOptions(this.isShowQuarter)
            this.selectedIndex = calculateIndex(this.dateOptions, this.isShowQuarter)
            this.currentQuarter = currentQuarterName()
            this.currentQuarterValue = this.isShowQuarter ? parseInt(date.getMonth() / 3) + 1 : ''
        }
    },
    beforeCreate() {
    },
    created() {
        this.dealerId = this.$route.query.dealerId;
        this.fetchData(this.selectedTapIndex)
        getSalesReportExplain().then(data => {
            if (data.explain) {
                this.content = data.explain.content;
            }
        });
        this.initDateOptions();
    },
    beforeMount() {
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
  .performance-evaluation {
    .gutter {
      height: 10px;
      background: rgba(247, 247, 247, 1);
    }
    margin-bottom: 50px;

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

      .selectbar__item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        width: 36%;

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

        &--year {
          .selectbar__value {
            width: 55px;
            text-align: right;
          }
        }

        &--month {
          .selectbar__value {
            width: 45px;
            text-align: right;
          }
        }

        &--company {
          .selectbar__value {
            width: 150px;
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
      }
    }

    .self-performance {
      padding: 0 18px;
      background-color: #fff;

      .self-subtitle {
        position: relative;
        padding: 8px 6px;
        font-size: 13px;
        color: rgba(102, 102, 102, 1);

        &:after {
          position: absolute;
          content: "";
          bottom: 0;
          right: 0;
          width: 60px;
          height: 60px;
          background-image: url("~@/module/channelManagement/static/images/icon_self_performance.png");
          background-repeat: no-repeat;
          background-size: 100%;
        }
      }

      .self-maintitle {
        font-weight: bold;
        font-size: 17px;
        color: rgba(0, 0, 0, 1);
        padding: 6px 0 5px;
      }

      .section-grey {
        .section-grey-item {
          margin-bottom: 10px;
          padding: 10px 15px 5px;
          background-color: rgba(250, 250, 250, 1);
          box-sizing: border-box;
        }
      }
    }

    .product-contrast {
      padding: 0 7px;
      background-color: #fff;

      .section-white {
        .section-white-item {
          margin-bottom: 15px;
          padding: 10px 15px 5px;
          background-color: rgba(255, 255, 255, 1);
          box-shadow: 0 0 5px rgba(0, 0, 0, .1);
          box-sizing: border-box;
        }
      }

      .car-logo {
        align-items: center;
        line-height: 37px;
      }
    }

    .delivery, .actual-sales {
      background-color: #fff;

      .delivery-item, .actual-sales-item {
        padding: 18px 23px 2px 19px;
        line-height: 24px;
      }
    }

    .store {
      background-color: #fff;

      .store-item {
        padding: 16px 23px 16px 19px;
      }
    }

    .section-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      box-sizing: border-box;

      .section-item {
        &--100 {
          flex: 100%;
          box-sizing: border-box;
        }

        &--50 {
          flex: calc((100% - 10px) / 2);
          box-sizing: border-box;

          &:nth-child(2n+1) {
            margin-right: 5px;
            box-sizing: border-box;
          }

          &:nth-child(2n) {
            margin-left: 5px;
            box-sizing: border-box;
          }
        }

        &--30 {
          flex: calc((100% - 20px) / 3);
          box-sizing: border-box;

          &:nth-child(3n+2) {
            margin: 0 10px 10px 10px;
            box-sizing: border-box;
          }
        }
      }
    }

    .self-text-grey {
      font-size: 13px;
      color: rgba(102, 102, 102, 1);
    }

    .self-text-grey--mini {
      font-size: 12px;
      color: rgba(153, 153, 153, 1);
    }

    .self-text-red {
      font-size: 20px;
      font-weight: bold;
      color: rgba(204, 49, 73, 1);
      padding-top: 5px;
    }

    .self-text-red-mini {
      font-size: 12px;
      color: rgba(198, 0, 31, 1);
    }

    .text-blue {
      font-size: 16px;
      font-weight: bold;
      color: rgba(39, 129, 219, 1)
    }

    .text-blue--mini {
      font-size: 13px;
      font-weight: bold;
      color: rgba(39, 129, 219, 1)
    }

    .text-grey {
      font-size: 13px;
      color: rgba(153, 153, 153, 1);
    }

    .text-black {
      font-size: 16px;
      color: rgba(0, 0, 0, 1);
    }

    .text-black--mini {
      font-size: 13px;
      color: rgba(0, 0, 0, 1);
    }

    .mt-10 {
      margin-top: 10px;
    }

    .mt-8 {
      margin-top: 8px;
    }

    .border-top {
      border-top: 1px solid rgba(219, 219, 219, 1);
    }

    .border-left {
      border-left: 1px solid rgba(219, 219, 219, 1);
    }

    /deep/ .qw-water-mark__list{
      pointer-events: none;
    }

  }
</style>

