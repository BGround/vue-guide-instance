<!-- 退网清算 -->
<template>
  <div class="exit-liquidation">
    <!-- 风险评估 -->
    <template v-if="isNonEmptyObject(info)">
      <div class="panel">
        <content-title :name="'风险评估'" padding="0"
                       :content="[
                      '更新日期：'+ (toFormatTime(info.updateTime, 'yyyy-MM-dd') ? toFormatTime(info.updateTime, 'yyyy-MM-dd'): '暂无'),
                      '更新人：'+ (info.updateUser? info.updateUser: '暂无')
                     ]"
        ></content-title>
        <div class="panel__content">
          <div class="total__account">账户合计</div>
          <div class="total">
            <p class="total__value">
              {{handelMoney(info.caiwuTotal)  | formatData}}
              <b class="total__unit">万元</b>
            </p>
            <div class="total__date">截止时间：{{handleTime | formatData}}</div>
          </div>
        </div>
      </div>
      <div class="gutter"></div>
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
                  <span>{{handelMoney(info.caiwuLoansUser) | formatData}}</span>
                  <span class="cell__symbol">万元</span>
                </p>
              </div>
            </div>

            <div class="section__col">
              <div class="cell">
                <p class="cell__label">保证金账户</p>
                <p class="cell__value">
                  <span>{{handelMoney(info.caiwuCashUser) | formatData}}</span>
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
                  <span>{{handelMoney(info.caiwuRebateUser) | formatData}}</span>
                  <span class="cell__symbol">万元</span>
                </p>
              </div>
            </div>

            <div class="section__col">
              <div class="cell">
                <p class="cell__label">备件账户</p>
                <p class="cell__value">
                  <span>{{handelMoney(info.caiwuPartUser) | formatData}}</span>
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
                <p class="cell__value">
                  <span>{{handelMoney(info.caiwuDeduction) | formatData}}</span>
                  <span class="cell__symbol">万元</span>
                </p>
              </div>
            </div>

            <div class="section__col">
              <div class="cell">
                <p class="cell__label">清算余额</p>
                <p class="cell__value">
                  <span>{{handelMoney(info.caiwuDeductionAfter) | formatData}}</span>
                  <span class="cell__symbol">万元</span>
                </p>
              </div>
            </div>
          </div>
          <div class="section__row">
            <div class="section__col">
              <div class="cell">
                <p class="cell__label">清算扣款（含金融）</p>
                <p class="cell__value">
                  <span>{{handelMoney(info.caiwuBalanceAfter) | formatData}}</span>
                  <span class="cell__symbol">万元</span>
                </p>
              </div>
            </div>

            <div class="section__col">
              <div class="cell">
                <p class="cell__label">清算后余额（含金融）</p>
                <p class="cell__value">
                  <span>{{handelMoney(info.caiwuBalance) | formatData}}</span>
                  <span class="cell__symbol">万元</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="gutter"></div>
    </template>
    <!-- 退网信息 -->
    <template  v-if="isNonEmptyObject(info)">
      <div class="panel">
        <div class="panel__title">
          <span class="bold-line"></span>
          <p class="panel__name">退网信息</p>
        </div>
        <div class="field">
          <div class="field__item">
            <div class="field__label">· 网络委员会时间</div>
            <div class="field__value">{{info.committee||'-'}}</div>
          </div>
          <div class="field__item">
            <div class="field__label">· 网络委员会决议</div>
            <div class="field__value">{{info.conferenceResolution  ||'-'}}</div>
          </div>
          <div class="field__item">
            <div class="field__label">· 退网时间</div>
            <div class="field__value">{{info.retreatTime ||'-'}}</div>
          </div>
          <div class="field__item">
            <div class="field__label">· 清算完成时间</div>
            <div class="field__value">{{info.clearTime ||'-'}}</div>
          </div>
          <div class="field__item">
            <div class="field__label">· 退网原因</div>
            <div class="field__value">{{info.retreatReason ||'-'}}</div>
          </div>
          <div class="field__item">
            <div class="field__label">· 退网办理进度</div>
            <div class="field__value">{{info.exitNetProgress || '-'}}</div>
          </div>
        </div>
      </div>
    </template>
    <noData style="paddingTop: 20vh" :visible="!hasData" />
  </div>
</template>

<script>
import iconArrowDown from '@/module/channelManagement/static/images/icon_arrow_down.png' //向下按钮
import reloadApp from '@/module/channelManagement/mixins/reloadApp'
import noData from '@/module/channelManagement/components/noData'
import contentTitle from '@/module/channelManagement/components/contentTitle'
import { getBackNetwork } from '@/module/channelManagement/api/warning'
export default {
  mixins: [reloadApp],
  components: {noData,contentTitle},
  data() {
    return {
      iconArrowDown,
      status: true,
      info: {},
      departments: [],
    }
  },

  computed: {
    hasData() {//判断是否有数据：
      return this.isNonEmptyObject(this.info)
    },
    handleTime(){//更改时间格式：如2020-02-02 改为2020年02月02日
      if(this.info && this.info.caiwuStopTime){
        return this.info.caiwuStopTime.replace(/(\d{4})-(\d{2})-(\d{2})/g,'$1年$2月$3日')
      }else{
        return '-'
      }
    }
  },
  methods: {
    handelMoney(amount){ //金额保留两位小数
      if (isNaN(amount)) {
        return amount
      }
      if(amount){
        return parseFloat(amount).toFixed(2)
      }else{
        return '-'
      }
    },
    isNonEmptyObject(target) {//判断是否 不是空对象   true:不是空对象 false:是空对象
      const isObject =
        Object.prototype.toString.call(target) === '[object Object]'
      // console.log(Object.keys(target))
      return isObject && !!Object.keys(target).length
    },

      toFormatTime(value, fmt) {
          if(!value) return
          return value.substring(0,10)
      },
  },
  filters:{
    formatData(value){
      if(value){
        return value;
      }else{
        return typeof value === 'number'? value : '-'
      }
    }
  },
  created() {
    const dealerId = this.$route.query.dealerId || ''
    const erpCarNo = this.$route.query.erpCarNo || ''
    // 获取风险评估数据
    getBackNetwork(erpCarNo).then(data => {
      if (data) {
        this.info = data
          // console.log(isNonEmptyObject(info), 'xx')
      }
    }).finally(()=>{
    })
  }
}
</script>

<style lang="scss" scoped>

.exit-liquidation {
  padding-bottom: 50px;
  .bold-line {
      width: 3px;
      height: 11px;
      background-color: rgba(198,0,31,1);
      margin-right: 8px;
    }
  // 风险评估
  .panel {
    padding: 15px 15px 20px 15px;
    background: #ffffff;
  }

  .panel__title {
    display: flex;
    align-items: center;
    height: 24px;
  }

  .panel__name {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    color: rgba(20, 30, 40, 1);
  }
  .total__account{
    padding-top: 15px;
    height:24px;
    font-size:17px;
    font-weight:600;
    line-height:24px;
    color:rgba(20,30,40,1);
    text-align: center;
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
    position: relative;
  }
  .total__unit {
    position: absolute;
    margin-left: 23px;
    bottom: 9px;
    height: 24px;
    font-size: 15px;
    font-weight: 400;
    line-height: 24px;
    color:rgba(153,153,153,1);
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
    justify-content: flex-start;
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
    margin-left: 11px;
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
  // 退网信息

  .section__content {
    font-size: 15px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
    padding-bottom: 25px;
  }

  .field{
    padding-top: 15px;
    .field__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .field__label {
      font-size:15px;
      font-family: PingFang SC;
      font-weight:bold;
      line-height:34px;
      color:rgba(39,129,219,1);
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

    .field__value--warning {
      color: #c6001f;
    }
  }
}
</style>
