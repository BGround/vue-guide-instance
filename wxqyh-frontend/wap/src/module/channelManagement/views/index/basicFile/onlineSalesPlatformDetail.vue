<!--  直营店详情  -->
<template>
  <div class="online-sales-platform-detail">

    <div class="header">
      <span class="header__name">{{detail.platformName ||'-'}}</span>
      <span class="header__date"></span>
    </div>


    <div class="field">
      <div class="field__item">
        <div class="field__label">年份</div>
        <div class="field__value">{{detail.platformYaer||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">月份</div>
        <div class="field__value">{{detail.platformMonth||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">总费用</div>
        <div class="field__value">{{detail.totalMoney||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">支持额度</div>
        <div class="field__value">{{detail.keepMoney||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">平台维护得分（均值）</div>
        <div class="field__value">{{detail.platformMaintenanceScore ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">CRM首次24h跟进率</div>
        <div class="field__value">{{detail.crmFollowUpRate ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">网销成交率</div>
        <div class="field__value">{{detail.netSalesTurnoverRate ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">一季度兑现</div>
        <div class="field__value">{{detail.quarterFirst||'-'}}</div>
      </div>


      <div class="field__item">
        <div class="field__label">二季度兑现</div>
        <div class="field__value">{{detail.quarterSecond ||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">三季度兑现</div>
        <div class="field__value">{{detail.quarterThird||'-'}}</div>
      </div>

      <div class="field__item">
        <div class="field__label">四季度兑现</div>
        <div class="field__value">{{detail.quarterFourth||'-'}}</div>
      </div>

    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      store: {

      }
    }
  },
  computed:{
    ...mapGetters('storeInfoDetail', ['getStoreDetail'])
  },
  methods:{
    formatDate(openTime){
      if(openTime){
          const [y, m, d] = new Date(openTime.replace(/-/g, '/')).toISOString().substring(0,10).split('-')
          return `${y}年${m}月${d}日`;
      }else{
        return '';
      }
    },
  },
  created() {
    
    this.detail = this.$route.params;
    
  }
}
</script>

<style lang="scss" scoped>
.online-sales-platform-detail{
  // 
  padding-bottom: 50px;
  .header{
    position: relative;
    padding: 20px 15px 5px;
    font-size:17px;
    font-weight:600;
    line-height:24px;
    color:rgba(0,0,0,1);
    background: #ffffff;
    display: flex;
    justify-content: space-between;
  }

  .header__date{
    flex-shrink: 0;
    text-align: right;
    margin-left:10px;
  }

  .header__date{
    flex-grow:1;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }



  .field {
    padding: 15px;
    background: #ffffff;
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