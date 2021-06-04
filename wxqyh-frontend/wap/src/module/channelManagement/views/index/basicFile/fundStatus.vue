<!-- 资金状况  -->
<template>
  <div class="fund-status">

    <template v-if="isNonEmptyObject(status)">
      <div class="section section--first">
        <div class="section__header">
          <p class="section__title">金融授信额度(万元)</p>
          <p class="section__date">截止时间：{{status.updateTime}}</p>
        </div>
        <div class="section__content">
          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{status.financialRealCredit||'-'}}</strong>万元</p>
                <p class="cell__label">金融额度</p>
              </div>
            </div>
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{status.threeWayRealCredit||'-'}}</strong>万元</p>
                <p class="cell__label">三方额度</p>
              </div>
            </div>
            <div class="section__col">

            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section__header">
          <p class="section__title">当月提车资金构成(万元)</p>
          <p class="section__date">截止时间：{{status.updateTime}}</p>
        </div>
        <div class="section__content">
          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{status.financialLoans}}</strong>万元</p>
                <p class="cell__label">金融贷款</p>
              </div>
            </div>
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{status.threeWaySilverTicket}}</strong>万元</p>
                <p class="cell__label">三方银票</p>
              </div>
            </div>
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{status.ownFunds}}</strong>万元</p>
                <p class="cell__label">自有资金</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section__header">
          <p class="section__title">当年累计(万元)</p>
          <p class="section__date">截止时间：{{status.updateTime}}</p>
        </div>
        <div class="section__content">
          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{status.cumFinancialLoans}}</strong>万元</p>
                <p class="cell__label">金融贷款</p>
              </div>
            </div>
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{status.cumThreeWaySilverTicket}}</strong>万元</p>
                <p class="cell__label">三方银票</p>
              </div>
            </div>
            <div class="section__col">
              <div class="cell">
                <p class="cell__value"><strong>{{status.cumOwnFunds}}</strong>万元</p>
                <p class="cell__label">自有资金</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p class="remarks">备注：{{status.mark||'暂无'}}</p>
    </template>

    <noData style="paddingTop: 20vh"
      :visible="!isLoading && !isNonEmptyObject(status)" />

  </div>
</template>

<script>
import { getAllFundingStatus } from '@/module/channelManagement/api/basic/index'
import noData from '@/module/channelManagement/components/noData';

export default {
  components: {
    noData
  },
  data() {
    return {
      status: {
        // financialRealCredit: '', //金融实时额度,
        // threeWayRealCredit: '', //三方实时额度,
        // financialLoans: '', //金融贷款,
        // threeWaySilverTicket: '', //三方银票,
        // ownFunds: '', //自有资金（现汇三方银票）',
        // cumFinancialLoans: '', //累计金融贷款,
        // cumThreeWaySilverTicket: '', //累计三方银票,
        // cumOwnFunds: '', //累计自有资金（现汇三方银票）',
        // mark:'',
        // year: '',
        // month: ''
      },
      isLoading: false
    }
  },
  methods: {
    isNonEmptyObject(target) {
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      return isObject && !!Object.keys(target).length
    },

    formatDate(timestamp) {
      if (timestamp) {
        const dete = new Date(timestamp.replace(/-/g, '/'))
        const [y, m, d] = dete
          .toISOString(dete)
          .substring(0, 10)
          .split('-')
        return `${y}年${m}月${d}日`
      } else {
        return '-'
      }
    }
  },
  created() {
    const dealerId = this.$route.query.dealerId || ''
    this.isLoading = true
    getAllFundingStatus({ dealerId })
      .then(data => {
        if (data) {
          this.status = data
        }
      })
      .finally(() => {
        this.isLoading = false
      })
  }
}
</script>

<style lang="scss" scoped>
.fund-status {
  padding-bottom: 50px;

  .section.section--first {
    padding-top: 17px;
  }

  .section {
    background: #ffffff;
    padding: 15px;
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
    white-space: nowrap;
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