<!-- 利润情况 -->
<template>
  <div class="profit-status">
    <qw-tab-bar v-model="selectedTabIndex"
      v-if="profitInfoList.length > 0"
      :data="tabs"
      @change="handleChangeYear"
      scrollable>
    </qw-tab-bar>

    <!-- <div class="selectbar">
      <div class="selectbar__item selectbar__item--year"
        @click="handleClickYearPicker">
        <span class="selectbar__value">{{currentYear}}年</span>
        <i class="section__icon"></i>
      </div>
      <div class="selectbar__item selectbar__item--month"
        @click="handleClickMonthPicker">
        <span class="selectbar__value">{{currentMonth}}月</span>
        <i class="section__icon"></i>
      </div>
    </div> -->

    <template v-if="isNonEmptyObject(detail)">
      <div class="gutter"></div>

      <div class="field">
        <div class="field__item">
          <div class="field__label">整车毛利</div>
          <div class="field__value">{{detail.carGrossMargin||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">整车毛利率</div>
          <div class="field__value">{{detail.carGrossProfitRate? `${detail.carGrossProfitRate}%` : '0%'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">售后毛利</div>
          <div class="field__value">{{detail.afterSaleGrossMargin||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">售后毛利率</div>
          <div class="field__value">{{detail.afterSaleGrossProfitRate ? `${detail.afterSaleGrossProfitRate}%`: '0%'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">增值毛利</div>
          <div class="field__value">{{detail.addValueGrossMargin||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">增值毛利率</div>
          <div class="field__value">{{detail.addValueGrossProfitRate? `${detail.addValueGrossProfitRate}%`: '0%'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">毛利合计</div>
          <div class="field__value">{{detail.totalGrossMargin||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">费用合计</div>
          <div class="field__value">{{detail.totalExpense||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">所得税税前利润总额</div>
          <div class="field__value">{{detail.preTaxTotalGrossMargin||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">人工费用</div>
          <div class="field__value">{{detail.expensesLabour||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">租赁费用</div>
          <div class="field__value">{{detail.rentalExpense||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">其他费用</div>
          <div class="field__value">{{detail.otherExpense||'-'}}</div>
        </div>

          <div class="field__item">
          <div class="field__label">整车收入</div>
          <div class="field__value">{{detail.carIncome||'-'}}</div>
        </div>

          <div class="field__item">
          <div class="field__label">售后收入</div>
          <div class="field__value">{{detail.afterSaleIncome||'-'}}</div>
        </div>

          <div class="field__item">
          <div class="field__label">增值收入</div>
          <div class="field__value">{{detail.appreciationIncome||'-'}}</div>
        </div>



        <!-- <div class="field__item">
        <div class="field__label">税前利润率</div>
        <div class="field__value">xxx</div>
      </div> -->
      </div>
    </template>
    <noData style="paddingTop: 20vh"
      :visible="!isLoading && !isNonEmptyObject(detail)"></noData>

     <qw-date-picker v-model="isVisibleYearPicke"
      :column-count="1"
      :current="current"
      :format="format"
      @select="handleSelectYear"
      title="">
    </qw-date-picker>

    <qw-picker v-model="isVisibleMonthPicker"
      title="选择"
      :data="monthOptions"
      :selected-index="[1]"
      @select="handleSelectMonth">
    </qw-picker>
  </div>
</template>

<script>
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import { getProfitInfoList } from '@/module/channelManagement/api/operation'
import noData from '@/module/channelManagement/components/noData'

export default {
  mixins: [reloadApp],
  components: { noData },
  data() {
    const date = new Date()
    return {
      isVisibleYearPicke: false,
      isVisibleMonthPicker: false,
      format: {
        year: 'YYYY年'
      },
      current: date,
      currentYear: date.getFullYear(),
      currentMonth: date.getMonth() + 1,
      selectedTabIndex: '',
      tabs: [],
      profitInfoList: [],
      monthOptions: [
        [
          { text: '1月', value: '01' },
          { text: '2月', value: '02' },
          { text: '3月', value: '03' },
          { text: '4月', value: '04' },
          { text: '5月', value: '05' },
          { text: '6月', value: '06' },
          { text: '7月', value: '07' },
          { text: '8月', value: '08' },
          { text: '9月', value: '09' },
          { text: '10月', value: '10' },
          { text: '11月', value: '11' },
          { text: '12月', value: '11' }
        ]
      ],
      erp:'',
      isLoading: false,
    }
  },
  computed: {
    detail() {
      const detail = this.profitInfoList.find(
        item => item.year === this.selectedTabIndex
      )
      return detail || {}
    }
  },
  methods: {

    handleChangeYear(year) {
      
    },
    
    handleClickYearPicker() {
      this.isVisibleYearPicke = true
    },

    handleClickMonthPicker() {
      this.isVisibleMonthPicker = true
    },
    /**
     * 处理选择年份
     */
    handleSelectYear(_, [year, month]) {
      this.currentYear = year
      this.getProfitInfoList()
    },
    /**
     * 处理选择月份
     */
    handleSelectMonth([value]) {
      this.currentMonth = value
      this.getProfitInfoList()
    },

    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      return isObject && !!Object.keys(target).length
    },

    fetchProfitInfoList(){
      const params = { erp: this.erp };
      return getProfitInfoList(params).then(data => {
      if (data && Array.isArray(data.profitInfoList)) {
        this.tabs = data.profitInfoList.map(item => {
          return {
            value: item.year,
            label: `${item.year}年`
          }
        })
        if (this.tabs[0]) {
          this.selectedTabIndex = this.tabs[0].value
        }
        this.profitInfoList = data.profitInfoList
      }
    })
    }
  },
  created() {
    this.erp = this.$route.query.erpCarNo || ''
    this.isLoading = true;
    this.fetchProfitInfoList().finally(()=>{
      this.isLoading = false;
    })
  }
}
</script>

<style lang="scss" scoped>
.profit-status {
  padding-bottom: 50px;

  .selectbar {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    justify-content: center;
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
    margin: 0 30px;
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

  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .field {
    padding: 15px;
    background: #ffffff;
  }

  .field__item {
    display: flex;
    align-items: center;
  }

  .field__label {
    font-size: 15px;
    font-weight: 400;
    line-height: 34px;
    color: rgba(153, 153, 153, 1);
    white-space: nowrap;
    margin-right: 10px;
    width: 140px;
  }
  .field__value {
    font-size: 15px;
    font-weight: 400;
    line-height: 34px;
    color: rgba(51, 51, 51, 1);
    // margin-left: auto;
  }
}
</style>