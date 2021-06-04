<template>
  <div class="qwui-cell" :class="{'border-bottom-1px': hasBottomBorder}" @click="$emit('click')" :style="cellStyle">
    <div class="qwui-cell-inner">
      <slot name="label">
        <div class="qwui-label" :class="{'is-must': isMust}" v-if="label">{{label}}</div>
      </slot>
      <slot name="title">
        <div class="qwui-title" :class="{'defalut': placeholder}" v-if="title">{{title}}</div>
      </slot>
      <div v-if="hasArrow" class="qwui-arrow-icon"></div>
    </div>
    <slot name="tip">
    </slot>
  </div>
</template>

<script>
export default {
  name: 'QwCell',
  props: {
    label: String,
    title: String,
    isMust: Boolean,
    hasArrow: {
      type: Boolean,
      default: false,
    },
    hasBottomBorder: {
      type: Boolean,
      default: true,
    },
    cellStyle: Object,
  },
  computed: {
    placeholder() {
      return this.title == '' || this.title == this.$t('i18n.pleaseSelect');
    }
  }
}
</script>


<style lang="scss" scoped>
@import '~../../styles/common.scss';

.qwui-cell {
  display: flex;
  flex-direction: column;
  padding: $box-padding;
  padding-left: 0;
  background: #fff;

  .qwui-cell-inner {
    display: flex;
    line-height: 20px;
    .qwui-label {
      font-size: $font-size-medium-x;
      line-height: 20px;
      text-align: left;

      &.is-must::after {
        content: ' *';
        color: $color-text-warn;
      }
    }

    .qwui-title {
      flex: 1;
      font-size: $font-size-medium-x;
      line-height: 20px;
      text-align: right;
      word-break: break-all;

      &.defalut {
        color: $icon-border-color;
      }
    }

    .qwui-arrow-icon {
      @extend .arrow_right;
      margin-left: $box-padding;
      align-self: center;
    }
  }
}
</style>

