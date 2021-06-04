<!-- 得分详情-->
<template>
  <div class="evaluate-detail">

    <div class="header">
      <p class="header__name">{{detail.year}}年第{{detail.quarter}}季度星级评估</p>
    </div>

    <div class="section">
      <div class="field">
        <div class="field__item">
          <div class="field__label">经销商</div>
          <div class="field__value">{{detail.dealerName||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">得分</div>
          <div class="field__value">{{detail.score||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">星级</div>
          <div class="field__value">{{detail.starLevel||'-'}}</div>
        </div>

         <div class="field__item">
          <div class="field__label">环比</div>
          <div class="field__value">{{detail.chain||'-'}}</div>
        </div>

        

        <div class="field__item">
          <div class="field__label">排名</div>
          <div class="field__value">{{detail.rankNo||'-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">否决项</div>
          <div class="field__value">{{detail.veto || '-'}}</div>
        </div>

        <div class="field__item">
          <div class="field__label">奖励额度</div>
          <div class="field__value">{{detail.awardAmount || '-'}}</div>
        </div>


      </div>
    </div>

    <div class="gutter"></div>

    <div class="section">
      <div class="title">
        <p class="title__name">得分详情</p>
        <i class="title__icon"
          @click="handleClickDetailIcon(status)"
          :class="{'is-open': isOpen(status)}"><img :src="iconArrowDown"
            alt=""></i>
      </div>
      <div class="field field--detail"
        v-show="isOpen(status)">
        <div class="field__item" v-for="(item, index) in fields" :key="index">
          <div class="field__label">{{item.key}}</div>
          <div class="field__value">{{item.value}}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import iconArrowDown from '@/module/channelManagement/static/images/icon_arrow_down.png'
import reloadApp from '@/module/channelManagement/mixins/reloadApp';
import {mapGetters} from "vuex";

export default {
  mixins: [reloadApp],
  data() {
    return {
      iconArrowDown,
      status: true,
      detail: {},
      fields:[]
    }
  },
  computed:{
    ...mapGetters('evaluationDetail',['getEvaluationDetail'])
  },
  methods: {
    isOpen(status) {
      return this.status
    },
    handleClickDetailIcon(status) {
      this.status = !this.status
    }
  },
  created(){
    this.detail = this.getEvaluationDetail || {}
    // const fields = this.detail.functional;
    if(this.detail.functional){
      this.fields = this.detail.functional.split(/[,，]/).map((item)=>{
        const [key='', value=''] = item.split(/[：:]/)
        return {
          key, value
        }
      })
    }
  },

}
</script>

<style lang="scss" scoped>
.evaluate-detail {
  padding-bottom: 50px;
  .gutter {
    height: 8px;
    background: rgba(245, 245, 245, 1);
  }

  .section{
    padding: 15px;
    background: #ffffff;
  }

  .title {
    justify-content: space-between;
    display: flex;
    align-items: center;
    // margin-bottom: 10px;
  }

  .field.field--detail{
    padding-top: 10px;
  }

  .title__name {
    height: 24px;
    font-size: 15px;
    font-weight: bold;
    line-height: 24px;
    width: calc(100% - 30px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .title__icon {
    width: 11px;
    height: 7px;
    display: block;
    transition: transform 0.4s ease;
    & > img {
      width: 100%;
      vertical-align: top;
    }
  }

  .title__icon.is-open {
    transform: rotateZ(180deg);
  }

  .header {
    position: relative;
    padding: 20px 15px 16px;
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    background: #ffffff;
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