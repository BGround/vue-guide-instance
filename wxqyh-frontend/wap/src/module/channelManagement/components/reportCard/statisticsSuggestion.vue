<template>
  <div class="statistics-suggestion">
    <div class="grid">
      <div class="grid__row">
        <div class="grid__col">
          <div class="cell">
            <div class="cell_title">
              指标统计
            </div>
            <div class="cell__field">
              <span class="cell__field__label">优秀</span>
              <span class="cell__field__value">{{getStatistic.excellentCount}}</span>
            </div>
            <div class="cell__field">
              <span class="cell__field__label">良好</span>
              <span class="cell__field__value">{{getStatistic.wellCount}}</span>
            </div>
            <div class="cell__field">
              <span class="cell__field__label">待改善</span>
              <span class="cell__field__value">{{getStatistic.unimproveCount}}</span>
            </div>
            <div class="cell__field">
              <span class="cell__field__label">后进</span>
              <span class="cell__field__value">{{getStatistic.fallCount}}</span>
            </div>
            <div class="cell__field">
              <span class="cell__field__label">总计</span>
              <span class="cell__field__value">{{getStatistic.count}}</span>
            </div>
          </div>
        </div>
        <div class="grid__col">
          <div class="cell">
            <div class="cell_title">
<!--              大区建议-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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

      getStatistic(){
          return this.data && this.data[0] && this.data[0].countVO ? this.data[0].countVO : {}
      },

  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.statistics-suggestion {
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
  .cell_title {
    height: 22px;
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(0, 0, 0, 1);
    padding-bottom: 20px;
  }
  .cell {
    padding: 15px 20px 10px 20px;
  }

  .cell__field {
    display: flex;
    justify-content: space-between;
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(153, 153, 153, 1);
    padding-bottom: 8px;
  }

  .cell__field__value {
    color: #000000;
  }
}
</style>
