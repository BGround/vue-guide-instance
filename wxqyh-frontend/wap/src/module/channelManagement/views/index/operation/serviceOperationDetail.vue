<!-- 服务运营详情 -->
<template>
  <div class="service-detail">

    <div class="header">
      <p class="header__name">{{detail.year}}年第{{detail.quarter}}季度服务运营</p>
    </div>

    <div class="field">
      <div class="field__item">
        <div class="field__label">经销商</div>
        <div class="field__value">{{detail.dealerName ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">服务运营得分</div>
        <div class="field__value">{{detail.score ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">服务运营分级</div>
        <div class="field__value">{{detail.operateLevel ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">月均台次</div>
        <div class="field__value">{{detail.monthQty ||'-'}}</div>
      </div>
      <!-- 
      <div class="field__item">
        <div class="field__label">月均备件订购额</div>
        <div class="field__value">xx10万</div>
      </div> -->

      <div class="field__item">
        <div class="field__label">服务满意度</div>
        <div class="field__value">{{detail.satisfaction ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">一次修复率</div>
        <div class="field__value">{{detail.repairRate ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">抱怨率</div>
        <div class="field__value">{{detail.grumbleRate ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">客户保持率</div>
        <div class="field__value">{{detail.customerHoldRate ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">客单价</div>
        <div class="field__value">{{detail.customerPrice ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">奖励额度</div>
        <div class="field__value">{{detail.awardAmount ||'-'}}</div>
      </div>

      

    </div>
  </div>
</template>

<script>
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import { mapGetters } from 'vuex'
export default {
  mixins: [reloadApp],
  data() {
    return {
      detail: {}
    }
  },
  computed: {
    ...mapGetters('serviceOperationDetail', ['getServiceOperationDetail'])
  },
  created() {
    this.detail = this.getServiceOperationDetail
  }
}
</script>

<style lang="scss" scoped>
.service-detail {
  background: #ffffff;
  // padding-bottom: 50px;
  .header {
    position: relative;
    padding: 20px 15px 20px;
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      left: 15px;
      right: 15px;
      height: 1px;
      background: #e6e6e6;
    }
  }

  .header__icon {
    display: block;
    width: 76px;
    height: 50px;
    position: absolute;
    right: 13px;
    top: 10px;
    background-size: 100%;
  }

  .field {
    padding: 15px;
  }

  .field__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .field__label {
    font-size: 15px;
    font-weight: 400;
    line-height: 34px;
    color: rgba(153, 153, 153, 1);
    white-space: nowrap;
    margin-right: 10px;
  }
  .field__value {
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 34px;
    color: rgba(51, 51, 51, 1);
    margin-left: auto;
  }
}
</style>