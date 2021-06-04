<template>
  <div class="crm-form-group" :style="{paddingTop:typeof gutter === 'number' ? (gutter + 'px') : gutter}">
    <div class="crm-form-group__title" v-if="title">{{title}}</div>
    <slot name="title"></slot>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "CrmForm",
  props: {
    gutter: {
      default: 8,
      type: [String, Number]
    },
    title: String
  },
  data() {
    return {};
  }
};
</script>
<style lang="scss" scoped>
.crm-form-group {
}
</style>
<style lang="scss">
.crm-form-group {
  .crm-form-item {
    padding: 6px 14px 16px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .item-label {
      font-size: 14px;
      color: #7e818b;
      &-required {
        color: #ff5a72;
      }
    }
    &:not(:first-child) {
      position: relative;
      &::before {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #f6f7fb;
        color: #f6f7fb;
        transform-origin: 0 0;
        transform: scaleY(0.5);
        left: 15px;
      }
    }
  }
}
</style>

