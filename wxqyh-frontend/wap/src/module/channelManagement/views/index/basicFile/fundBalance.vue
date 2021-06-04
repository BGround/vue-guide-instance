<!--  资金余额 -->
<template>
  <div class="fund-balance">
    <template v-if="isNonEmptyObject(balance)">
      <div class="section section--first">
        <div class="section__header">
          <p class="section__title">整车余额</p>
          <p class="section__date">截止时间：{{balance.updateTime}}</p>
        </div>
        <div class="section__content">
          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{balance.carFinancialCurAvailability | formatFunds}}</strong> 万元</p>
                <p class="cell__label">金融当前可用</p>
              </div>
            </div>
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{balance.carThreeWaySilver | formatFunds}}</strong> 万元</p>
                <p class="cell__label">三方银票资金</p>
              </div>
            </div>
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{balance.carMarginBalance | formatFunds}}</strong> 万元</p>
                <p class="cell__label">保证金</p>
              </div>
            </div>
          </div>

          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{balance.carRebatePoolBalance | formatFunds}}</strong> 万元</p>
                <p class="cell__label">返利池余额</p>
              </div>
            </div>
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{balance.carOwnFunds | formatFunds}}</strong> 万元</p>
                <p class="cell__label">自有资金</p>
              </div>
            </div>
            <div class="section__col"></div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section__header">
          <p class="section__title">备件余额</p>
          <p class="section__date">截止时间：{{balance.updateTime}}</p>
        </div>
        <div class="section__content">
          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{balance.spareBalance | formatFunds}}</strong> 万元</p>
                <p class="cell__label">备件余额</p>
              </div>
            </div>
            <div class="section__col">

            </div>
            <div class="section__col">

            </div>
            <!-- <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{balance.spareMarginBalance | formatFunds}}</strong> 万元</p>
                <p class="cell__label">保证金</p>
              </div>
            </div>
          </div>
          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{balance.spareRebatePoolBalance | formatFunds}}</strong> 万元</p>
                <p class="cell__label">返利池</p>
              </div>
            </div>
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{balance.spareOwnFunds | formatFunds}}</strong> 万元</p>
                <p class="cell__label">自有资金</p>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </template>
    <noData style="paddingTop: 20vh"
      :visible="!isLoading && !isNonEmptyObject(balance)"></noData>
      </div>
      </template>

<script>
import { getAllFundBalance } from '@/module/channelManagement/api/basic'
import noData from '@/module/channelManagement/components/noData'
export default {
  components: {
    noData
  },
  data() {
    return {
      // carFinancialCurAvailability: '', //整车金融当前可用额度
      // carThreeWaySilver: '', //整车三方银票资金余额
      // carMarginBalance: '', //整车保证金余额
      // carRebatePoolBalance: '', //整车返利池余额
      // carOwnFunds: '', //整车自有资金（往来账户余额）
      // spareCreditCurAvailable: '', //备件授信当前可用额度
      // spareThreeWaySilver: '', //备件三方银票资金余额
      // spareMarginBalance: '', //备件保证金余额
      // spareRebatePoolBalance: '', //备件返利池余额
      // spareOwnFunds: '', //备件自有资金（往来账户余额）
      // dealerInfoId: '', //EPR
      // year: '', //年
      // month: '', //月
      balance: {},
      isLoading: false
    }
  },
  methods: {
    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      return isObject && !!Object.keys(target).length
    }
  },
  created() {
    const dealerId = this.$route.query.dealerId || ''
    this.isLoading = true
    getAllFundBalance({ dealerId })
      .then(data => {
        if (data) {
          this.balance = data
        }
      })
      .finally(() => {
        this.isLoading = false
      })
  },
  filters:{
    formatFunds(value){
      if(value){
        return value;
      }else{
        return typeof value === 'number'? value : '-'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fund-balance {
  padding-bottom: 50px;
  .section.section--first {
    padding-top: 17px;
  }
  .section {
    padding: 15px;
    background: #ffffff;
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
    margin-bottom: 15px;
  }

  .section__col {
    margin-right: 15px;
    width: 100%;
    &:last-child {
      margin-right: 0;
    }
  }

  .cell {
    background: rgba(247, 248, 250, 1);
    padding: 12px 2px 12px 12px;
  }

  .cell__value {
    height: 21px;
    font-size: 13px;
    font-weight: 600;
    line-height: 21px;
    color: rgba(178, 185, 200, 1);
    & > strong {
      font-size: 15px;
      color: rgba(10, 23, 53, 1);
    }
  }

  .cell__label {
    margin-top: 2px;
    height: 19px;
    font-size: 13px;
    font-weight: 500;
    line-height: 24px;
    color: rgba(178, 185, 200, 1);
  }

  .remarks {
    padding: 0 15px;
    height: 20px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 24px;
    color: rgba(153, 153, 153, 1);
  }
}
</style>