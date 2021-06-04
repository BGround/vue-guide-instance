<!-- 销售运营-->
<template>
  <div class="sales-operation">

    <div class="selectbar">
      <div class="selectbar__item selectbar__item--year"
        @click="handleClickDatePicker">
        <span class="selectbar__value">{{currentyear}}</span>
        <i class="section__icon"></i>
      </div>
      <div class="selectbar__item selectbar__item--year"
           @click="handleClickDatePicker">
        <span class="selectbar__value">{{currentQuarter}}</span>
        <i class="section__icon"></i>
      </div>
      <div class="selectbar__item selectbar__item--month"
        @click="handleClickDatePicker">
        <span class="selectbar__value">{{currentMonth}}</span>
        <i class="section__icon"></i>
      </div>
    </div>

    <template >
      <div class="gutter"></div>
      <div class="section" v-if="isNonEmptyObject(info)">
        <div class="section__header">
          <p class="section__title">销售线索</p>
        </div>
        <div class="section__content">
          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__label">线索量</p>
                <p class="cell__value">{{info.xsl||'-'}}</p>
              </div>
            </div>

            <div class="section__col">
              <div class="cell">
                <p class="cell__label">跟进率</p>
                <p class="cell__value">
                  <span>{{info.gjl||'-'}}</span>
                  <span class="cell__symbol">%</span>
                </p>
              </div>
            </div>

            <div class="section__col">
              <div class="cell">
                <p class="cell__label">到店率</p>
                <p class="cell__value">
                  <span>{{info.ddl||'-'}}</span>
                  <span class="cell__symbol">%</span>
                </p>
              </div>
            </div>

          </div>

          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__label">试驾率</p>
                <p class="cell__value">
                  <span>{{info.sjl||'-'}}</span>
                  <span class="cell__symbol">%</span>
                </p>
              </div>
            </div>

            <div class="section__col">
              <div class="cell">
                <p class="cell__label">成交率</p>
                <p class="cell__value">
                  <span>{{info.cjl||'-'}}</span>
                  <span class="cell__symbol">%</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

     <div class="section" v-if="isNonEmptyObject(operationInfo)">
      <div class="section__header">
        <p class="section__title">销售运营</p>
      </div>
      <div class="section__content">
        <div class="section__row">
          <div class="section__col">
            <div class="cell">
              <p class="cell__label">飞行检查</p>
              <p class="cell__value">{{operationInfo.flightInspection || '-'}}</p>
            </div>
          </div>

          <div class="section__col">
            <div class="cell">
              <p class="cell__label">销售满意度</p>
               <p class="cell__value">
                 <span>{{operationInfo.salesSatisfaction || '-'}}</span>
               </p>
            </div>
          </div>

          <div class="section__col">
            <div class="cell">
              <p class="cell__label">综合得分</p>
               <p class="cell__value">
                 <span>{{operationInfo.salesOperationScore || '-'}}</span>
               </p>
            </div>
          </div>

        </div>
        <div class="section__row">
          <div class="section__col">
            <div class="cell">
              <p class="cell__label">战区排名</p>
              <p class="cell__value">{{operationInfo.ranking || '-'}}</p>
            </div>
          </div>

          <div class="section__col">
            <div class="cell">
              <p class="cell__label">销售运营分级</p>
              <p class="cell__value">
                <span>{{operationInfo.salesOperationClassification || '-'}}</span>
              </p>
            </div>
          </div>

          <div class="section__col">
            <div class="cell">
              <p class="cell__label">奖励额度</p>
              <p class="cell__value">
                <span>{{operationInfo.rewardQuota || '-'}}</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>

    </template>

    <noData style="paddingTop: 20vh"
      :visible="!isLoading && !isNonEmptyObject(info) && !isNonEmptyObject(operationInfo)"></noData>

    <qw-cascade-picker
            v-model="isVisibleDatePicke"
            :data="dateOptions"
            :selected-index="selectedIndex"
            @select="handleSelectDate"
    >
    </qw-cascade-picker>

  </div>
</template>

<script>
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import {
  getSalesOperationByDealerId,
  searchSalesOperationByErpAndYear
} from '@/module/channelManagement/api/operation'
import noData from '@/module/channelManagement/components/noData'




function assemblyMonthOptions(quarter) {
    const monthMap = {
        '1': [{value:1, text:'一月'},{ value:2, text:'二月'},{value:4, text:'三月'}],
        '2': [{value:4, text:'四月'},{ value:5, text:'五月'},{value:6, text:'六月'}],
        '3': [{value:7, text:'七月'},{ value:8, text:'八月'},{value:9, text:'九月'}],
        '4': [{value:10, text:'十月'},{ value:11, text:'十一月'},{value:12, text:'十二月'}],
    }
    return monthMap[quarter]
}

function assemblyQuarterOptions() {
    const quarterMap = {'1':'一季度','2':'二季度','3':'三季度','4':'四季度'}
    return [1,2,3,4].map(item=>{
        return {
            value: item,
            text: quarterMap[item],
            children: assemblyMonthOptions(item)
        }
    })

}

function assemblyDateOptions() {
    const now = new Date();
    const endYear = now.getFullYear();
    const beginYear = now.getFullYear() - 9;
    const options = [];
    for (let year = beginYear; year <= endYear; year++){
        const yearItem = {
            value: year,
            text: `${year}年`,
            children: assemblyQuarterOptions()
        }
        options.push(yearItem)
    }
    return options
}


function calculateYearIndex(dateOptions){
    const now = new Date();
    const currentYearItem = dateOptions.find(item=>item.value === now.getFullYear())
    return currentYearItem?  dateOptions.indexOf(currentYearItem): 0;
}

function calculateQuarterIndex() {
    const month = new Date().getMonth();
    return parseInt(month / 3) || 0;
}

function calculateMonthIndex() {
    const month = new Date().getMonth();
    return parseInt(month % 3) || 0;
}

/**
 * 计算索引值
 */
function calculateIndex(dateOptions) {
    return [calculateYearIndex(dateOptions), calculateQuarterIndex(), calculateMonthIndex()]
}

function currentQuarterName() {
    const month = new Date().getMonth();
    const quarterNameMap = ['一季度','二季度','三季度','四季度']
    const quarter = parseInt(month/3);
    return quarterNameMap[quarter]
}

const dateOptions = assemblyDateOptions()
const selectedIndex= calculateIndex(dateOptions)
const currentQuarter = currentQuarterName();

export default {
  mixins: [reloadApp],
  components: { noData },
  data() {
    const date = new Date()
    return {
      isVisibleDatePicke: false,
      min: [2010, 0, 1],
      max: [2020, 8, 22],
      format: {
        year: 'YYYY年',
        month: 'MM月',
        date: 'D日'
      },
      dateOptions,
      selectedIndex,
      current: date,
      currentMonth: `${date.getMonth() + 1}月`,
      currentQuarter,
      currentyear: `${date.getFullYear()}年`,
      currentMonthValue: date.getMonth() + 1,
      currentYearValue: date.getFullYear(),
      currentQuarterValue: parseInt(date.getMonth()/3) +1,
      info: {},
      operationInfo: {},
      erp: '',
      dealerId:'',
      isLoading: false
    }
  },
  methods: {
    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      return isObject && !!Object.keys(target).length
    },

    handleClickDatePicker() {
      this.isVisibleDatePicke = true
    },

    handleClickCompanyPicker() {
      this.isVisibleCompanyPicker = true
    },

    handleSelectDate(
      [currentYearValue, currentQuarterValue, currentMonthValue],
      _,
      [yearName,quarterName, monthName]
    ) {
        this.currentyear = yearName
        this.currentQuarter = quarterName
        this.currentMonth = monthName
        this.currentMonthValue =
        currentMonthValue >= 10
          ? `${currentMonthValue}`
          : `0${currentMonthValue}`
      this.currentYearValue = currentYearValue
        this.currentQuarterValue = currentQuarterValue;
        console.log(this)
      this.fetchSalesOperation()
      this.fetchSalesOperationByDealerId()
    },

    handleSelectCompany(value, index, [companyName]) {
      this.companyName = companyName
    },

    fetchSalesOperation() {
      const calmonth = `${this.currentYearValue}${this.currentMonthValue}`
      const params = { erp: this.erp, calmonth }
      return searchSalesOperationByErpAndYear(params).then(data => {
          if(data && data.bdXsyy){
              const {cjl,sjl, ddl, gjl, xsl} = data.bdXsyy
              const info = {}
              cjl && Object.assign(info, {cjl})
              sjl && Object.assign(info, {sjl})
              ddl && Object.assign(info, {ddl})
              gjl && Object.assign(info, {gjl})
              xsl && Object.assign(info, {xsl})
              this.info = info;
          }else{
              this.info = {}
          }
      })
    },

    fetchSalesOperationByDealerId(){
        const params = {
            dealerId:this.dealerId,
            year: this.currentYearValue,
            quarter: this.currentQuarterValue,
        }
        return getSalesOperationByDealerId(params).then((data)=>{
              if(data && data.salesOperationImportVO){
                  this.operationInfo = data.salesOperationImportVO
              }else{
                  this.operationInfo = {}
              }

          })
      },




  },
  created() {
    const erpCarNo = this.$route.query.erpCarNo || ''
    this.erp = `00000${erpCarNo}`
    this.dealerId = this.$route.query.dealerId || ''
    const p1 = this.fetchSalesOperation()
    const p2 =this.fetchSalesOperationByDealerId()
    this.isLoading = true
    Promise.all([p1,p2]).finally(() => {
        this.isLoading = false
    })
  },
    mounted() {
        console.log(this)
    }
}
</script>

<style lang="scss" scoped>

  /**
    默认(设计稿)750px === 100vw
   */
  @function pxToVw($pixle) {
    @return $pixle * (100vw / 750);
  }

.sales-operation {
  /*min-height: calc(100vh - 100px);*/
  padding-bottom: 60px;
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
  .section {
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
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 36%;
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

  .section {
    padding: 15px 15px 0px;
  }
  .section__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .section__date {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: rgba(153, 153, 153, 1);
  }
  .section__content {
    padding-top: 15px;
  }
  .section__title {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
  }

  .section__row {
    display: flex;
    padding-bottom: 10px;
  }

  .section__col {
    margin-right: pxToVw(30);
    // width: 100%;
    width: calc(33.3% - 10px);
    &:last-child {
      margin-right: 0;
    }
  }

  .cell {
    background: rgba(247, 248, 250, 1);
    padding: pxToVw(30) pxToVw(20) pxToVw(30) pxToVw(20);
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

  .cell__label {
    height: 19px;
    font-size: pxToVw(24);
    font-weight: 400;
    line-height: 19px;
    color: rgba(102, 102, 102, 1);
  }
}
</style>
