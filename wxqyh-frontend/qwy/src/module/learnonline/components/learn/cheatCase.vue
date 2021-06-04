<template>
  <div class="learn_cheatCase" v-show="show">
    <div class="cheatCase-phone">
      <div class="phone-head">
        <i></i><i></i>
      </div>
      <div class="phone-sound">
        <i></i><i></i>
      </div>
      <div class="phone-content"></div>
      <div class="phone-foot"></div>
      <div class="phone-close" @click="handleClick"></div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'cheatCase',

  props: {
    show: { // 组件展示
      type: Boolean,
      required: true
    },
  },

  data() {
    return {}
  },

  methods: {
    ...mapMutations('app', ['SET_HIDDENSCROLL']),
    handleClick() {
      this.SET_HIDDENSCROLL(false);
      this.$emit('update:show', false);
    },
  },

}
</script>

<style lang="scss" scoped>
/* @import '../style/qwInput' */
  .learn_cheatCase {
    position: fixed;
    height: 100%;
    width: 100%;
    z-index: 1000;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.6);
    .cheatCase-phone {
      position: relative;
      width: 304px;
      height: 646px;
      border-radius: 40px;
      background-color: #FFF;
      .phone-head {
        width: 64px;
        height: 9px;
        margin: 33px auto 0;
        i:nth-child(1) {
          float: left;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #EAEAEA;
        }
        i:nth-child(2) {
          float: right;
          width: 45px;
          height: 5px;
          margin-top: 2px;
          border-radius: 3px;
          background: #EAEAEA;
        }
      }
      .phone-sound {
        position: absolute;
        left: -1px;
        top: 72px;
        width: 2px;
        height: 157px;
        border-radius: 1px;
        background: #fff;
        i {
          display: block;
          width: 100%;
          height: 28px;
          border-radius: 1px;
          margin-top: 32px;
          background: rgba(0, 0, 0, 0.6);
        }
      }
      .phone-content {
        width: 274px;
        height: 488px;
        margin: 24px auto 0;
        background: url(~assets/images/cheat_preview.png) no-repeat;
      }
      .phone-foot {
        width: 44px;
        height: 44px;
        margin: 26px auto 0;
        border: 2px solid rgba(209,209,210,1);
        border-radius: 50%;
      }
      .phone-close {
        position: absolute;
        width: 34px;
        height: 34px;
        right: -48px;
        top: -30px;
        background: url(~assets/images/btn_close.png) no-repeat center/auto;
        cursor: pointer;
      }
    }
  }
</style>
