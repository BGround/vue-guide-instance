<template>
  <div class="qwui-function_wrap">
    <div class="qwui-function_flex">
      <span class="qwui-function_text">{{text}}</span>
      <slot v-if="showTips">
        <span class="qwui-function_tip" @mouseenter="showTipWrap" @mouseleave="hideTipWrap">
          <div class="qwui-tip_wrap" v-show="showTip">
            <slot name="tipContent"></slot>
          </div>
        </span>
      </slot>
    </div>
    <slot name="switch"></slot>
  </div>
</template>

<script>
  export default {
    props:{
      text:{
        type:String,
        default:'',
      },
      showTips:{
        type:Boolean,
        default:false,
      },
    },
    data(){
      return{
        showTip:false,
      }
    },
    methods:{
      showTipWrap(){
        this.showTip = true;
      },
      hideTipWrap(){
        this.showTip = false;
      },
    },
  }
</script>

<style lang="scss" scoped>
  .qwui-function_wrap{
    display: flex;
    width: 100%;
    background: #f6f6f6;
    padding-left: 5px;
    line-height: 30px;
    justify-content: space-between;
    align-items:center;
    margin-bottom: 20px;
    .qwui-function_flex{
      display: flex;
      align-items: center;
      .qwui-function_tip{
        position: relative;
        display: inline-block;
        margin-left: 5px;
        width: 16px;
        height: 16px;
        background: url(~assets/images/icon_tip.png) no-repeat top left;
        cursor: pointer;
        .qwui-tip_wrap{
          background: white;
          border: 1px solid #ccc;
          border-radius: 5px;
          height: auto;
          left: 23px;
          padding: 10px;
          position: absolute;
          top: -10px;
          max-width: 278px;
          min-width: 278px;
          min-height: 20px;
          box-shadow: 0 0 7px rgba(0, 0, 0, 0.2);
          color: #666;
          z-index: 1223;
          text-align: left;
          cursor: text;
          &::before{
            border-color: transparent #ccc transparent transparent;
            border-style: solid;
            border-width: 8px;
            content: "";
            font-size: 20px;
            left: -16px;
            position: absolute;
            top: 9px;
          }
          &::after{
            background: white;
            content: "";
            height: 8px;
            left: -5px;
            position: absolute;
            top: 13px;
            transform: rotate(-45deg);
            width: 10px;
          }
        }
      }
    }
  }
</style>
