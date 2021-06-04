<template>
  <div class="qwui-bottom_button_wrap">
    <div class="btn_box_fill" v-show="isNeededFill"></div>
    <div class="qwui-bottom_operation_button qwui-btn_box qwui-user_btn">
      <div class="qwui-flexbox button_box">
        <!-- 上一题按钮 -->
        <div 
          class="qwui-flexItem previous_button" 
          :class="banButtonClass"
          @click="clickPrevious"
        >{{$t('i18n.previousQuestion')}}</div>

        <!-- 中间功能按钮 -->
        <div 
          class="qwui-flexItem function_button" 
          @click="clickFunction"
        >{{functionText||$t('i18n.answerCard')}}</div>

        <!-- 下一题/完成按钮 -->
        <div 
          class="qwui-flexItem next_button" 
          @click="clickNext"
        >{{nextButtonText}}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'QwBottomOperationButton',
  props: {
    nowIndex: { // 当前下标
      type: Number,
      required: true
    },
    maxIndex: { // 最大下标
      type: Number,
      required: true
    },
    functionText: { // 中间功能按钮文本
      type: String,
      default: '' // this.$t('i18n.answerCard') 没法用国际化
    },
    finishText: { // 最后一道题按钮文本
      type: String,
      default: '' // this.$t('i18n.close') 没法用国际化
    },
    isNeededFill: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      /* 数据项 */

    };
  },
  computed: {
    // 当前是否第一题
    isFirstQuestion() {
      return this.nowIndex == 0;
    },
    // 当前是否最后一题
    isLastQuestion() {
      return this.nowIndex == this.maxIndex - 1;
    },
    // 下一题/完成按钮文本
    nextButtonText() {
      return this.isLastQuestion? this.finishText || this.$t('i18n.close'): this.$t('i18n.nextQuestion');
    },
    // 禁止按钮类（第一题）
    banButtonClass() {
      return {ban_button: this.isFirstQuestion}
    },

  },
  methods:{
    /* 触发事件
      @bottomButton
        0: 上一题  
        1: 下一题  
        2: 功能按钮  
        3: 完成按钮（最后一题）
    */

    // 点击上一题按钮
    clickPrevious() {
      !this.isFirstQuestion && this.$emit('bottomButton', 0);
    },

    // 点击功能按钮
    clickFunction() {
      this.$emit('bottomButton', 2);
    },

    // 点击下一题/完成按钮
    clickNext() {
      this.isLastQuestion? this.$emit('bottomButton', 3): this.$emit('bottomButton', 1);
    },
  },
  created() {

  }
};

</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';

.qwui-bottom_button_wrap {
  .btn_box_fill {
      height: 50px;
  }

  .qwui-bottom_operation_button {
    position: fixed;
    bottom: 0;
    width: 100%;

    .button_box {
      height: 50px;
      line-height: 50px;
      font-size: 17px;
      color: #333;
      text-align: center;
      background: #fff;
      cursor: pointer;
      user-select: none;
      @include border-t-1px(#DDD);

      .qwui-flexItem:not(:last-of-type) {
        @include border-r-1px(#DDD);
      }
      .qwui-flexItem:last-of-type {
        color: #fff;
        background: #45A8F5;
      }
      /* 禁止按钮 */
      .ban_button {
        color: #CCC;
      }
    }
  }
}
</style>
