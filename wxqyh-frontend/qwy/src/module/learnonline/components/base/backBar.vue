<template>
  <div class="backBar">
    <div class="backBar_wrap">
      <div class="backBar_icon" @click="goBack"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script>

export default {
  name: 'backBar',

  data() {
    return {}
  },

  methods: {
    goBack() {
      this.$emit('click')
    }
  },

}
</script>

<style lang="scss" scoped>
  @import "../../style/config.scss";
  .backBar {
    position: relative;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    text-align: center;
    background-color: $whiteBackground;
    .backBar_wrap {
      width: 1200px;
      margin: 0 auto;
      .backBar_icon {
        position: absolute;
        width: 28px;
        height: 28px;
        top: 11px;
        background: url(~assets/images/ic_back.png) no-repeat center/28px 28px;
        cursor: pointer;
      }
    }
  }
</style>
