<template>
  <div class="completion-status">
    <div class="header">
      备件&精品完成情况
    </div>

    <div class="title">备件情况</div>

    <div class="grid">
      <div class="grid__row"
        v-for="(item, index) in getSparePartsList"
        :key="index">
        <div class="grid__col">
          <div class="status status--left">
            <div class="status__title">
              {{ item.year }}年{{ item.quarter }}季度
            </div>
            <div class="status__field">
              <span class="status__label">目标</span>
              <span class="status__value">{{ item.goal }}</span>
            </div>
            <div class="status__field">
              <span class="status__label">实际</span>
              <span class="status__value">{{ item.reality }}</span>
            </div>
            <div class="status__field">
              <span class="status__label">完成率</span>
              <span class="status__value">{{ item.finishingRate }}%</span>
            </div>
          </div>
        </div>
        <div class="grid__col">
          <div class="status status--right">
            <div class="status__field">
              <span class="status__label">{{ item.year - 1 }}年{{ item.quarter }}季度实际</span>
              <span class="status__value">{{ item.realityLastYear }}</span>
            </div>
            <div class="status__field">
              <span class="status__label">订购同比</span>
              <span class="status__value">{{ item.synchronizationBuy | correctPercentSymbol }}</span>
            </div>
            <div class="status__field">
              <span class="status__label">{{ item.quarter > 1 ? item.year : item.year-1 }}年{{ item.quarter > 1 ? item.quarter-1 : 4 }}季度实际</span>
              <span class="status__value">{{ item.realityQuarterPre }}</span>
            </div>
            <div class="status__field">
              <span class="status__label">订购环比</span>
              <span class="status__value">{{ item.orderRatio | correctPercentSymbol}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="title">精品情况</div>
    <div class="grid">
      <div class="grid__row"
        v-for="(item, index) in getBoutiqueList"
        :key="index">
        <div class="grid__col">
          <div class="status status--left">
            <div class="status__title">
              {{ item.year }}年{{ item.quarter }}季度
            </div>
            <div class="status__field">
              <span class="status__label">目标</span>
              <span class="status__value">{{ item.goal }}</span>
            </div>
            <div class="status__field">
              <span class="status__label">实际</span>
              <span class="status__value">{{ item.reality }}</span>
            </div>
            <div class="status__field">
              <span class="status__label">完成率</span>
              <span class="status__value">{{ item.finishingRate }}%</span>
            </div>
          </div>
        </div>
        <div class="grid__col">
          <div class="status status--right">
            <div class="status__field">
              <span class="status__label">{{ item.year - 1 }}年{{ item.quarter }}季度实际</span>
              <span class="status__value">{{ item.realityLastYear }}</span>
            </div>
            <div class="status__field">
              <span class="status__label">订购同比</span>
              <span class="status__value">{{ item.synchronizationBuy | correctPercentSymbol }}</span>
            </div>
            <div class="status__field">
              <span class="status__label">{{ item.quarter > 1 ? item.year : item.year-1 }}年{{ item.quarter > 1 ? item.quarter-1 : 4 }}季度实际</span>
              <span class="status__value">{{ item.realityQuarterPre }}</span>
            </div>
            <div class="status__field">
              <span class="status__label">订购环比</span>
              <span class="status__value">{{ item.orderRatio | correctPercentSymbol}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
        },

        correctPercentSymbol(value){
            if(String(value).includes('%')){
                return value;
            }else{
                return `${value}%`;
            }
        }
    },
  props: {
    data: {
      type: Array,
      required: true,
      default() {
        return []
      }
    }
  },
  computed: {
    getSparePartsList() {
      return this.data.filter(item => item.serviceType === '备件')
    },
    // 精品
    getBoutiqueList() {
      return this.data.filter(item => item.serviceType !== '备件')
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.completion-status {
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
  .title {
    padding: 9px 27px;
  }

  .status {
    padding-left: 20px;
    padding-right: 14px;
  }

  .status--left {
    padding: 14px;
  }
  .status--right {
    padding: 14px;
  }

  .status__title {
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(0, 0, 0, 1);
    padding-bottom: 11px;
  }

  .status__field {
    font-size: 13px;
    margin-bottom: 8px;
    font-weight: 400;
    line-height: 16px;
    color: rgba(153, 153, 153, 1);
    display: flex;
    justify-content: space-between;
    padding:2px 0;
  }
  .status__value {
    font-size: 13px;
    font-weight: 400;
    line-height: 16px;
    color: rgba(0, 0, 0, 1);
  }
}
</style>
