<template lang="html">
  <div class="qwui-progress" :class="{'progress-text-inside': isTextInside}">
    <div class="qwui-progress_bar">
      <div class="qwui-progress_bar_outer" :style="progressBarStyle">
        <div class="qwui-progress_bar_inner" :style="strokeStyle">
          <span class="qwui-process_bar_inner_text" v-if="isTextInside">{{roundDecimal}}%</span>
        </div>
      </div>
    </div>
    <span class="qwui-progress_bar_text" :style="{color}" v-if="showText && !textInside">{{roundDecimal}}%</span>
  </div>
</template>

<script>
// 文字在进度条内,进度条的最小高度
const TEXT_INSIDE_PROCESS_HEIGHT = 18;

// 进度条的默认最小高度
const DEFALUT_PROCESS_HEIGHT = 6;

// 百分比保留的小数位
const DECIMAL = 2;

export default {
  name: 'QwProgress',
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 6,
    },
    showText: {
      type: Boolean,
      default: true,
    },
    textInside: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#458BE9',
    },
  },
  computed: {
    isTextInside() {
      return this.showText && this.textInside;
    },
    processMinHeight() {
      const { width } = this;
      return this.isTextInside ? Math.max(width, TEXT_INSIDE_PROCESS_HEIGHT) : Math.max(width, DEFALUT_PROCESS_HEIGHT);
    },
    progressBarStyle() {
      return `height: ${this.processMinHeight}px`;
    },
    strokeStyle() {
      const { percentage, color } = this;
      return `width: ${percentage}%; background-color: ${color}`;
    },
    roundDecimal() {
      return Number(this.percentage).toFixed(DECIMAL);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';

  .qwui-progress {
    display: flex;
    align-items: center;
    position: relative;
    line-height: 1;

    .qwui-progress_bar {
      flex: 1;
      vertical-align: middle;
      box-sizing: border-box;
      line-height: 1;

      .qwui-progress_bar_outer {
        position: relative;
        border-radius: 100px;
        background: $border-color;
        overflow: hidden;
        vertical-align: middle;

        .qwui-progress_bar_inner {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          text-align: right;
          border-radius: 100px;

          .qwui-process_bar_inner_text {
            margin: 0 5px;
            font-size: 12px;
            color: $color-background;
            vertical-align: middle;
            line-height: 1;
          }
        }
      }
    }

    .qwui-progress_bar_text{
      margin-left: 10px;
      line-height: 1;
      font-size: 14px;
      vertical-align: middle;
    }
  }
</style>
