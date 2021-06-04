<!-- 防作弊弹框 -->
<template>
  <div v-if="showTipAndroid && showTip"
       class="qwui-learn_cheat"
       :class=" isDocument ? 'docAdapt' : ''"
  >
    <div class="pop">
      <div class="pop_main">
          {{$t('i18n.cheatTipOne')}}{{cheatTime/60}}{{$t('i18n.cheatTipTwo')}}<br>{{$t('i18n.cheatTipThree')}}
      </div>
      <div class="pop_btn" @click.capture="restoreTimer">
        {{$t('i18n.here')}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QWCheatTip',
  props: {
    //true时弹框组件的显示
    showTip: {
      type: Boolean,
      required: true
    },
    //兼容安卓全屏状态下不显示该组件
    showTipAndroid :{
      type: Boolean,
      required: true
    },
    // 后台设置的防作弊时间
    cheatTime: {
      type: Number,
      required: true
    },
    isDocument: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data(){
    return {

    }
  },
  methods: {
    restoreTimer() {
      this.$emit('restoreTimer');
    }
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1024px) {
  .qwui-learn_cheat {
    left: 0;
  }
}
@media screen and (min-width: 1024px) {
  .qwui-learn_cheat {
    max-width: 740px;
    left: 50%;
    -webkit-transform: translate(-50%, 0);
    transform: translate(-50%, 0);
    /*文档类型不需要适配*/
    &.docAdapt {
      max-width: 100%;
      left: 0;
      -webkit-transform: translate(0, 0);
      transform: translate(0, 0);
    }
  }
}
.qwui-learn_cheat {
  position: fixed;
  height: 100%;
  width: 100%;
  /* 兼容图片预览时弹框被挡住的情况 */
  z-index: 1600;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  .pop {
    max-width: 321px;
    width: 86%;
    border-radius: 10px;
    background: #fff;
    overflow: hidden;
    .pop_main {
      min-width: 175px;
      width: 100%;
      margin-top: 39px;
      font-size: 16px;
      color: #333;
      text-align: center;
    }
    .pop_btn {
      max-width: 217px;
      width: 67%;
      height: 42px;
      text-align: center;
      margin: 38px auto 20px;
      background:rgba(69,168,245,1);
      border-radius:20px;
      font-size: 16px;
      color: #fff;
      line-height: 42px;
    }
  }
}
</style>
