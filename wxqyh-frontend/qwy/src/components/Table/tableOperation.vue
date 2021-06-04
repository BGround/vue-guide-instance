<template>
  <div
    class="operation-btn"
    ref="operationBtn"
    @mouseover="operationOption=true"
    @mouseout="operationOption=false">
    <div
      class="operation-icon"
      :class="{'active': operationOption }"></div>
    <div
      class="operation-option"
      v-show="operationOption">
      <div
        v-perm="item.perm"
        class="option"
        :class="{'forbidden':item.forbidden}"
        v-show="!item.isHide"
        v-for="(item,index) in operationList"
        :key="index"
        @click="operationClick(item.operationFunc,item.forbidden)">
        {{item.text}}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      operationList:{
        type:Array,
      }
    },
    data(){
      return{
        operationOption: false, // true：显示操作下拉框，false：隐藏
      }
    },
    methods:{
      operationClick(callback,forbidden){
        if(forbidden){
          return;
        }
        this.operationOption = false;
        callback ? callback() : '';
      }
    }
  }
</script>

<style scoped lang="scss">
  .operation-btn{
    position: relative;
    width: 30px;
    height: 50px;
    font-size: 13px;
    color: #444;
    margin: 0 auto;
    .operation-icon{
      position: absolute;
      width: 30px;
      height: 50px;
      line-height: 50px;
      background: url(~assets/svg/ic_b-common_table_more.svg) no-repeat center center;
      &.active{
        background: url(~assets/svg/ic_b-common_table_more_hover.svg) no-repeat center center;
      }
    }
    .operation-option{
      position: absolute;
      z-index: 1000;
      line-height: 30px;
      border: 1px solid #ccc;
      background-color: #fff;
      box-shadow: 0 0 10px #ccc;
      right:90%;
      top: 10px;
      .option{
        box-sizing: content-box;
        padding: 0 20px 0 20px;
        cursor: pointer;
        white-space: nowrap;
        &:hover {
          background-color: #f5f5f5;
        }
        &.forbidden{
          color:#999;
          cursor: not-allowed;
        }
      }
    }
  }
</style>
