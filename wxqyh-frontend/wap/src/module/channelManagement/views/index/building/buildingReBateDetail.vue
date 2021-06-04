<!-- 股东股本 -->
<template>
  <div class="building-rebate">
    <div v-if="type==='aNet'" class="panel">
      <div class="panel__title">一网建店返利</div>
      <div class="panel__content">
        <div class="field">
          <div class="field__item">
            <div class="field__label">建店级别</div>
            <div class="field__value">{{detail.storeBuildingLevel ||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">奖励标准</div>
            <div class="field__value">{{detail.rewardCriteria || '-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">开始时间</div>
            <div class="field__value">{{detail.startTime ||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">应关闭时间</div>
            <div class="field__value">{{detail.shouldEndTime ||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">实际关闭时间</div>
            <div class="field__value">{{detail.actualEndTime ||'-'}}</div>
          </div>

           <div class="field__item">
            <div class="field__label">应兑现（万）</div>
            <div class="field__value">{{detail.shouldCash ||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">已兑现（万）</div>
            <div class="field__value">{{detail.actualCash||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">首兑金额</div>
            <div class="field__value">{{detail.firstExchangeAmount||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">提车折让金额</div>
            <div class="field__value">{{detail.carCollectionAllowance||'-'}}</div>
          </div>


          <div class="field__item">
            <div class="field__label">余额（万）</div>
            <div class="field__value">{{detail.balance||'-'}}</div>
          </div>


          
          <div class="field__item">
            <div class="field__label">转正时间</div>
            <div class="field__value">{{detail.positiveTime||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">店面性质</div>
            <div class="field__value">{{detail.shopNature||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">核算方式</div>
            <div class="field__value">{{detail.accountWay||'-'}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">备注</div>
            <div class="field__value">{{detail.mark||'-'}}</div>
          </div>

        </div>
      </div>
    </div>

    <div v-if="type==='bNet'" class="panel">

      <div class="panel__title">二网返利</div>
      <div class="panel__content">
         <div class="field__item">
          <div class="field__label">运营状态</div>
          <div class="field__value">{{ detail.shopStatus || '-' }}</div>
        </div>

         <div class="field__item">
          <div class="field__label">直营店店长</div>
          <div class="field__value">{{ detail.shopManager || '-' }}</div>
        </div>

        <div class="field__item">
          <div class="field__label">手机</div>
          <div class="field__value">{{ detail.shopPhone || '-' }}</div>
        </div>

        <div class="field__item">
          <div class="field__label">战区人员</div>
          <div class="field__value">{{ detail.warUser || '-' }}</div>
        </div>

        <div class="field__item">
          <div class="field__label">服务分厂号</div>
          <div class="field__value">{{ detail.serviceFactorySemicolon || '-' }}</div>
        </div>

        <div class="field__item">
          <div class="field__label">服务专员</div>
          <div class="field__value">{{ detail.nameOfServiceOfficer || '-' }}</div>
        </div>


        <div class="field__item">
          <div class="field__label">服务专员手机号</div>
          <div class="field__value">{{ detail.phoneNumber || '-' }}</div>
        </div>

        <div class="field__item">
          <div class="field__label">兑现金额</div>
          <div class="field__value">{{ detail.cashAmount || '-' }}</div>
        </div>

        <div class="field__item">
          <div class="field__label">兑现时间</div>
          <div class="field__value">{{ detail.cashTime || '-' }}</div>
        </div>

         <div class="field__item">
          <div class="field__label">到期时间</div>
          <div class="field__value">{{ detail.dueTime || '-' }}</div>
        </div>

         <div class="field__item">
          <div class="field__label">变更说明</div>
          <div class="field__value">{{ detail.changeDesc || '-' }}</div>
        </div>

         <div class="field__item">
          <div class="field__label">备注</div>
          <div class="field__value">{{ detail.mark || '-' }}</div>
        </div>
      </div>  
    </div>
  </div>
</template>

<script>
import { getSecondNetShopByErpNo } from '@/module/channelManagement/api/building'
import { mapGetters } from 'vuex'
import reloadApp from '@/module/channelManagement/mixins/reloadApp.js'
export default {
  mixins: [reloadApp],
  data() {
    return {
      anet: {},
      detail: {},
      type: ''
    }
  },
  computed: {
    ...mapGetters('buildingRebateDetail', [
      'getRebateDetail',
      'getRebateDetailType'
    ])
  },
  methods: {},
  created() {
    this.detail = this.getRebateDetail
    this.type = this.getRebateDetailType
  },
  filters:{
    formatPercent(value){
      if(typeof value === 'string' || typeof value === 'number'){
        return `${value}%`
      }else{
        return '-'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.building-rebate {
  background: #ffffff;
  .header {
    padding: 22px 15px 15px;
    border-bottom: 3px solid rgba(38, 34, 34, 1);
  }

  .header__title {
    height: 28px;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: 24px;
    color: rgba(38, 34, 34, 1);
  }

  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .panel {
    padding: 15px;
  }
  .panel__title {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    padding-bottom: 15px;
  }

  .panel__text {
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
  }

  .field__item {
    display: flex;
    justify-content: space-between;
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
  }

  .field__item--lang {
    white-space: normal;
    & > .field__value {
      line-height: 24px;
    }
  }
}
</style>
