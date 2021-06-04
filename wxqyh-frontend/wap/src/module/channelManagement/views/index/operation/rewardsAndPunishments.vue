<!-- 日常奖惩-->
<template>
  <div class="rewards-and-punishments">

    <div class="card" v-for="(item, index) in list" :key="index">
      <div class="card__header " 
        :class="{ 'card__header--adjustment': mapType(item.rewardsType) ==='adjustment', 'card__header--reward':mapType(item.rewardsType) ==='reward', 'card__header--punishment': mapType(item.rewardsType) ==='punishment'}">
        <span class="card__type">{{item.rewardsType}}</span>
        <span class="card__title">{{item.year}}年{{item.month}}月{{item.rewardsDept}}</span>
        <span class="card__subtitle">{{item.rewardsAmount}}</span>
      </div>
      <div class="card__body">
        <div class="field">
          <div class="field__item">
            <div class="field__label">考核依据</div>
            <div class="field__value">{{item.checkGist}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">考核事由</div>
            <div class="field__value">{{item.checkThing}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">报告/通报名称</div>
            <div class="field__value">{{item.report}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">生效时间</div>
            <div class="field__value">{{item.effectTime}}</div>
          </div>

          <div class="field__item">
            <div class="field__label">执行时间</div>
            <div class="field__value">{{item.executeTime}}</div>
          </div>
        </div>
      </div>
    </div>

    <noData style="paddingTop: 20vh" :visible="!isLoading && !list.length"></noData>

  </div>
</template>

<script>
import reloadApp from '@/module/channelManagement/mixins/reloadApp';
import {getRewardsInfoVOList} from '@/module/channelManagement/api/operation'
import noData from '@/module/channelManagement/components/noData'

export default {
  mixins: [reloadApp],
  name: 'RewardsAndPunishments',
  components: {noData},
  data() {
    return {
      form:{
        dealerId: '',
        rewardsType :'',// (奖惩类别)
        startYear:'', //(开始年)，
        endYear:'', //（结束年）
        
      },
      list: [],
      isLoading: false,
    }
  },
  created(){
    const dealerId = this.$route.query.dealerId
     if(!dealerId){ 
      this.reloadApp();  
      return
    }
    this.isLoading = true;
    getRewardsInfoVOList({dealerId}).then((data)=>{
      if(data && Array.isArray(data.rewardsInfoVOList)){
        this.list = data.rewardsInfoVOList.map((item)=>{
          return Object.assign(item, {isOpen: true})
        })
      }
    }).then(()=>{
      this.isLoading = false;
    })
  },
  methods:{
    isReward(type){
      return type === '奖励';
    },
    mapType(key){
      const typeMap = {
        '奖励': 'reward',
        '惩罚': 'punishment',
        '调整': 'adjustment',
      };
      return typeMap[key] || 'adjustment'
    }
  },
}
</script>

<style lang="scss" scoped>
.rewards-and-punishments {
  padding-bottom: 50px;
  .card {
    background: #ffffff;
    &::after{
      display: block;
      content:'';
      width:100%;
      height:8px;
      background:rgba(245,245,245,1);
    }
  }

  .card__header {
    padding: 18px 15px;
    display: flex;
    align-items: center;
    position: relative;
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

  .card__body{
    padding: 15px;
  }

  .card__type {
    padding: 0 5px;
    height: 18px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 18px;
    color: rgba(255, 255, 255, 1);
    border-radius: 2px;
  }

  .card__title {
    height: 24px;
    font-size: 17px;
    font-weight: 400;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    margin-left: 10px;
  }

  .card__header--punishment {
    .card__type {
      background: #f5b739;
    }
    .card__subtitle {
      color: #f5b739;
    }
  }

  .card__header--reward {
    .card__type {
      background: #f1405c;
    }
    .card__subtitle {
      color: #f1405c;
    }
  }

  .card__header--adjustment{
    .card__type {
      background: #999999;
    }
    .card__subtitle {
      color: #999999;
    }
  }

  .card__subtitle {
    height: 28px;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: 28px;
    margin-left: auto;
  }

  .field__item {
    display: flex;
    justify-content: space-between;
    align-items: top;
  }

  .field__label {
    font-size: 15px;
    font-weight: 400;
    line-height: 15px;
    padding-top:5px;
    padding-bottom:5px;
    color: rgba(153, 153, 153, 1);
    white-space: nowrap;
    margin-right: 10px;
  }
  .field__value {
    font-size: 15px;
    padding-top:5px;
    padding-bottom:5px;
    font-weight: 400;
    line-height: 15px;
    color: rgba(51, 51, 51, 1);
    margin-left: auto;
    text-align: right;
  }
}
</style>