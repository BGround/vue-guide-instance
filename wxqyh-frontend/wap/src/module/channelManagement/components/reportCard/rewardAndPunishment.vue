<template>
  <div class="reward-and-punishment">
    <h3 class="header">
      <span class="header__name">奖惩信息</span>
      <span class="header__info">数据：{{calculatePrevMonth(1).year}}年{{calculatePrevMonth(1).month}}月已执行考核明细</span>
    </h3>

    <div class="data">
      <div class="data__left">
          <div class="data__title">当年奖惩</div>
          <div class="data__filed">
            <div class="data__filed__label">奖励次数：</div>
            <div class="data__filed__value">{{yearSize | formatNumber}}</div>
          </div>
          <div class="data__filed">
            <div class="data__filed__label">惩罚次数：</div>
            <div class="data__filed__value">{{yearPunishSize | formatNumber}}</div>
          </div>
          <div class="data__filed">
            <div class="data__filed__label">累计次数：</div>
            <div class="data__filed__value">{{formatRewardSize(yearSize,yearPunishSize)}}</div>
          </div>
          <div class="data__title">当月奖惩</div>
          <div class="data__filed">
            <div class="data__filed__label">累计次数：</div>
            <div class="data__filed__value">{{monthSize | formatNumber}}</div>
          </div>
      </div>

      <div class="data__right">
        <div class="data__title" style="visibility:hidden;">当年奖惩</div>
        <div class="data__filed">
          <div class="data__filed__label">奖励金额：</div>
          <div class="data__filed__value">{{yearAmount | formatNumber}}</div>
        </div>
        <div class="data__filed">
          <div class="data__filed__label">惩罚金额：</div>
          <div class="data__filed__value">{{yearPunishAmount | formatNumber}}</div>
        </div>
        <div class="data__filed">
          <div class="data__filed__label">累计金额：</div>
          <div class="data__filed__value">{{formatRewardAmount(yearAmount,yearPunishAmount)}}</div>
        </div>
        <div class="data__title" style="visibility:hidden;">当月奖惩</div>
        <div class="data__filed">
          <div class="data__filed__label">累计金额：</div>
          <div class="data__filed__value">{{monthAmount | formatNumber}}</div>
        </div>
      </div>
    </div>


    <div v-for="(item, index) in rewardsList" :key="index">
      <h4 class="title">类型 | {{item.rewardsType}}</h4>
      <div class="content">
        <div class="content__left">
          <p class="amount">{{item.rewardsAmount}}</p>
          <p class="desc">金额 （元）</p>
        </div>
        <div class="content__right">
          <template>
            <p class="filed"><strong>通报事由</strong> | {{item.checkThing || '-'}}</p>
            <p class="filed">
              <strong>文件名称</strong> | {{item.report || '-'}}
            </p>
            <p class="filed">
              <strong>文件编号</strong> | {{item.reportNo || '-'}}
            </p>
            <p class="filed"><strong>联系人</strong> | {{item.linkman || '-'}}</p>
            <p class="filed">
              <strong>联系电话</strong> | {{item.linkmanPhone || '-'}}
            </p>
          </template>
        </div>
      </div>
    </div>



  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    reward:{
        type: Object,
        default() {
            return {};
        }
    },
    salesReport:{
        type: Object,
        default(){
            return {}
        }
    }
  },
    filters:{
        percentage(value){
            const fixedValue = Number(value).toFixed(2)
            if(fixedValue === 'NaN'){
                return '-';
            }else{
                return `${fixedValue}%`
            }
        },
        formatNumber(value){
            return value === 0 || !value? '-': value;
        },
    },
  computed: {
    getList() {
      return this.data || [];
    },
    getTitle() {
      return this.title || "";
    },
    rewardTotal() {
      const total = this.getList
        .map(item => item.rewardsAmount)
        .reduce((previous, current) => {
          const value = parseFloat(current) || 0;
          return previous + value;
        }, 0);
      return total.toFixed(2);
    },
  },
  data() {
    return {
        rewardsList: [],
        monthSize: '',
        monthAmount: '',
        yearAmount: '',
        yearSize: '',
        yearPunishSize: '',
        yearPunishAmount: '',
        updateUser: '',
        updateTime: '',
        reportMonth: '',
    };
  },

    methods:{
        setReward(data){
            if(data){
                console.log(data, 'reward')
                this.rewardsList = data.rewardsList || [];
                this.monthSize = data.monthSize? data.monthSize : '';
                this.monthAmount = data.monthAmount? data.monthAmount : '';
                this.yearAmount = data.yearAmount? data.yearAmount : '';
                this.yearSize = data.yearSize? data.yearSize : '';
                this.yearPunishAmount = data.yearPunishAmount? data.yearPunishAmount : '';
                this.yearPunishSize = data.yearPunishSize? data.yearPunishSize : '';
                this.updateTime = data.updateTime? dayjs(new Date(data.updateTime.replace(/-/g, "/"))).format('YYYY年MM月'): '';
                this.updateUser = data.updateUser? data.updateUser: '暂无';

            }
        },

        /**
         * 计算前N个月
         * @param n
         * @return {{month: string, year: string}|{month: number, year: number}}
         */
        calculatePrevMonth(n){
            if(!this.reportMonth){
                return {
                    year: '',
                    month: ''
                };
            };
            const d = dayjs(this.reportMonth).subtract(n, 'month');
            console.log(d.format('YYYY'), n)
            return {
                year: d.format('YYYY'),
                month: d.format('MM')
            }
        },

        initReportMonth(salesReport={}){
            const {month, year} = salesReport;
            if(month && year){
                this.reportMonth = new Date(`${year}/${month}/01`)
                console.log(this.reportMonth.toDateString(),'----')
            }
        },
        formatRewardSize(size1,size2) {
          if (size1 && size2) {
            return size1 + size2
          } else if (size1) {
            return size1
          } else if (size2) {
            return size2
          } else {
            return '-'
          }
        },

        formatRewardAmount(reward,punish) {
          if (reward && punish) {
            return reward + punish
          } else if (reward) {
            return reward
          } else if (punish) {
            return punish
          } else {
            return '-'
          }
        }
    },
    watch:{
        salesReport:{
            deep: true,
            handler(salesReport){
                this.initReportMonth(salesReport);
            }
        },
        reward(reward){
            this.setReward(reward)
        }
    },
    created() {
      this.setReward(this.reward)
      this.initReportMonth(this.salesReport)
    }
};
</script>

<style lang="scss" scoped>
.reward-and-punishment {
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
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding-right: 10px;
    &::before {
      content: "";
      position: absolute;
      display: block;
      height: 16px;
      border-radius: 2px;
      width: 4px;
      background-color: #c6001f;
      top: 21px;
      left: 18px;
    }
  }
  .title {
    position: relative;
    padding: 10px 0;
    height: 24px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    padding-left: 20px;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      transform: scaleY(0.5);
      background: #dbdbdb;
    }
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      transform: scaleY(0.5);
      background: #dbdbdb;
    }
  }
  .content {
    display: flex;
    padding-top: 8px;
    padding-bottom: 10px;
    justify-content: center;
  }
  .content__left {
    width: 100px;
    text-align: center;
    margin-right: 36px;
  }
  .amount {
    height: 23px;
    font-weight: 400;
    padding-bottom: 12px;
    font-size:16px;
    line-height:28px;
    color:rgba(198,0,31,1);
    margin-top: 18px;
  }
  .desc {
    height: 19px;
    font-size: 13px;
    font-weight: 400;
    line-height: 23px;
    color: rgba(153, 153, 153, 1);
  }
  .content__right {
    flex-grow: 0;
    width: 210px;
    font-size: 10px;
    font-weight: 400;
    line-height: 23px;
    color: rgba(153, 153, 153, 1);
    min-height: 92px;
  }
  .marker {
    padding: 0 26px 5px;
    color: #999;
  }

  .header__name{
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 23px;
    color: #141e28;
  }
  .header__info{
    height:9px;
    font-size:9px;
    font-weight:300;
    line-height:9px;
    color:rgba(20,30,40,1);
  }
  .data__title {
    font-size: 16px;
    height: 30px;
    padding-bottom: 8px;
    font-weight: bold;
    line-height: 30px;
    color: #2781db;
  }
  .data{
    display: flex;
    justify-content: space-between;
    padding-left: 18px;
    padding-right: 13px;
    padding-top: 2px;

    .data__filed{
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .data__filed__label{
      margin-right: 10px;
      height:17px;
      font-size:14px;
      font-weight:400;
      line-height:17px;
      color:rgba(20,30,40,1);
    }
    .data__filed__value{
      height:17px;
      font-size:17px;
      font-weight:400;
      line-height:17px;
      color:rgba(198,0,31,1);
    }
  }
}
</style>
