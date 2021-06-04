<!-- 退网信息 -->
<template>
  <div class="exit-info">

    <template v-if="isNonEmptyObject(info)">
      <div class="panel">
        <div class="panel__title">
          <span class="panel__name">财务合计</span>
          <span class="panel__unit">单位：<b>万元</b></span>
        </div>

        <div class="panel__content">
          <div class="total">
            <p class="total__value">{{info.total}}</p>
            <div class="total__date">截止时间:{{info.deadline}}</div>
          </div>
        </div>

      </div>

      <div class="gutter">

      </div>

      <div class="section">
        <div class="section__header">
          <p class="section__title">财务明细</p>
        </div>
        <div class="section__content">
          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__label">贷款账户</p>
                <p class="cell__value">
                  <span>{{info.loanAccount}}</span>
                  <span class="cell__symbol">万元</span>
                </p>
              </div>
            </div>

            <div class="section__col">
              <div class="cell">
                <p class="cell__label">保证金</p>
                <p class="cell__value">
                  <span>{{info.bondAccount}}</span>
                  <span class="cell__symbol">万元</span>
                </p>
              </div>
            </div>

          </div>

          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__label">返利账户</p>
                <p class="cell__value">
                  <span>{{info.rebateAccount}}</span>
                  <span class="cell__symbol">万元</span>
                </p>
              </div>
            </div>

            <div class="section__col">
              <div class="cell">
                <p class="cell__label">备件账户</p>
                <p class="cell__value">
                  <span>{{info.spareAccount}}</span>
                  <span class="cell__symbol">万元</span>
                </p>
              </div>
            </div>

          </div>
        </div>

        <div class="section__header">
          <p class="section__title">清算明细</p>
        </div>
        <div class="section__content">
          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__label">清算扣款</p>
                <p class="cell__value">{{info.liquidation}}</p>
              </div>
            </div>

            <div class="section__col">
              <div class="cell">
                <p class="cell__label">清算后余额</p>
                <p class="cell__value">
                  <span>{{info.balance}}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__label">清算扣款（含扣款）</p>
                <p class="cell__value">
                  <span>{{info.liquidationDeduction}}</span>
                </p>
              </div>
            </div>

            <div class="section__col">
              <div class="cell">
                <p class="cell__label">清算后余额（含金融）</p>
                <p class="cell__value">
                  <span>{{info.balanceFinance}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <noData style="paddingTop: 20vh"
      :visible="!isLoading && !isNonEmptyObject(info)"></noData>

  </div>
</template>

<script>
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import { getRiskAssessment } from '@/module/channelManagement/api/warning'
import noData from '@/module/channelManagement/components/noData'
export default {
  mixins: [reloadApp],
  components: { noData },
  data() {
    return {
      info: {},
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
    getRiskAssessment({ dealerInfoId: dealerId }).then(data => {
      if (data && data.tbEntRiskAssessmentVo) {
        this.info = data.tbEntRiskAssessmentVo
      }
    }).finally(()=>{
      this.isLoading = false;
    })
  }
}
</script>

<style lang="scss" scoped>
.exit-info {
  padding-bottom: 50px;
  .panel {
    padding: 15px 15px 20px 15px;
    background: #ffffff;
  }

  .panel__title {
    display: flex;
    align-items: center;
    height: 24px;
    justify-content: space-between;
  }

  .panel__name {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    color: rgba(20, 30, 40, 1);
  }

  .panel__unit {
    height: 24px;
    font-size: 15px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
    & > b {
      font-weight: normal;
      color: #333333;
    }
  }

  .total {
    padding-top: 20px;
    text-align: center;
  }

  .total__value {
    height: 42px;
    font-size: 30px;
    font-weight: 600;
    line-height: 42px;
    color: rgba(198, 0, 31, 1);
    padding-bottom: 5px;
  }

  .total__date {
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 19px;
    color: rgba(153, 153, 153, 1);
  }

  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .section {
    padding: 15px 15px 0px;
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
    padding-bottom: 20px;
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
    padding: 15px 10px 15px 15px;
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
    font-size: 13px;
    font-weight: 400;
    line-height: 19px;
    color: rgba(102, 102, 102, 1);
  }
}
</style>