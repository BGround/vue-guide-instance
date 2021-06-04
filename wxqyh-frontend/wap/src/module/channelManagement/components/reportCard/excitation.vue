<template>
  <div class="reward-and-punishment">
    <h3 class="header">日常激励汇总</h3>
    <div v-for="(item,index) in getList" :key="index">
      <h4 class="title">类型 | {{item.type}}</h4>
      <div class="content">
        <div class="content__left">
          <p class="amount">{{item.money}}</p>
          <p class="desc">金额 （元）</p>
        </div>
        <div class="content__right">
          <p class="filed">
            <strong>通报名称</strong> |
            {{item.reportName}}
          </p>
          <p class="filed">
            <strong>通报编号</strong> | {{item.reportNo}}
          </p>
          <p class="filed"><strong>生效时间</strong> | {{item.effectiveDate.year}}</p>
          <p class="filed"><strong>联系人</strong> | {{item.reportPerson}}</p>
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
      default() {
        return [];
      }
    },
  },
    computed:{
        getList(){
            return this.data || [];
        },
        getTitle(){
            return this.title || ''
        }
    },
  data() {
    return {};
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
    &::before {
      content: "";
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
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    color: rgba(198, 0, 31, 1);
    padding-top: 18px;
    padding-bottom: 12px;
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
  }
}
</style>
