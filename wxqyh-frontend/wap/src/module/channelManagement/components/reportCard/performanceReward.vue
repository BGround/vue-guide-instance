<template>
  <div class="performance-reward">
    <div class="header">
      服务综合业绩奖励
    </div>

    <div class="grid">
      <div class="grid__row">
        <div class="grid__col">
          <div class="reward">
            <div class="reward__title">
              <p>服务综合业绩奖</p>
              <p>奖励金额</p>
            </div>
            <p class="reward__amount">{{getPerformanceAward | round}}</p>
          </div>
        </div>
        <div class="grid__col">
          <div class="reward">
            <div class="reward__title">
              <p>运营系数1.0</p>
              <p>奖励金额</p>
            </div>
            <div class="reward__amount">
              {{getOperationAward | round}}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="tips">* {{getEvaluateAward}}</div>
  </div>
</template>

<script>
export default {
    filters:{
        round(value) {
            const number = parseFloat(value)
            if(!Number.isNaN(number)){
                const precision = 2;
                const roundNumber = Math.round(+number + 'e' + precision) / Math.pow(10, precision)
                return Number(roundNumber).toFixed(2);
            }else{
                return value;
            }
        }
    },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    getPerformanceAward() {
      return this.data.operatingAward
    },
    getOperationAward() {
      return this.data.awardMoney
    },
    getEvaluateAward() {
      return this.data.evaluateAward
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.performance-reward {
  background: #fff;
  .header {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(20, 30, 40, 1);
    padding-bottom: 11px;
    padding-left: 26px;
    padding-top: 16px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      display: block;
      height: 16px;
      border-radius: 2px;
      width: 4px;
      top: 50%;
      background-color: #c6001f;
      top: 21px;
      left: 18px;
    }
  }
  .grid {
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      transform: scaleY(0.5);
      background: #dbdbdb;
    }
  }
  .grid__row {
    display: flex;
  }
  .grid__col {
    position: relative;
    width: 50%;
    &:last-child::before {
      display: none;
    }
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      top: 0;
      right: 0;
      width: 1px;
      transform: scaleX(0.5);
      background: #dbdbdb;
    }
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      transform: scaleY(0.5);
      background: #dbdbdb;
    }
  }

  .reward {
    height: 100px;
    text-align: center;
  }

  .reward__title {
    margin-top: 10px;
    height: 51px;
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(0, 0, 0, 1);
  }

  .reward__amount {
    margin-top: 12px;
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(39, 129, 219, 1);
  }

  .tips {
    padding: 7px 26px 10px;
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(153, 153, 153, 1);
  }
}
</style>
