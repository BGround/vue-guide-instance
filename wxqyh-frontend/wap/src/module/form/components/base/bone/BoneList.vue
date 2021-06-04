<template>
  <div class="list-bone" :style="{position: fixed ? 'fixed' : 'absolute',top: top + 'px', 'z-index': zIndex}">
    <div class="animation-line"></div>
    <div class="virtual-item" v-for="n in 11" :key="n">
      <div class="v-item-img"></div>
      <div class="v-item-desc">
        <div class="v-item-line"></div>
        <div class="v-item-line short"></div>
        <div class="v-item-line middle"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    top: {
      type: Number,
      default: 52
    },
    zIndex: {
      type: Number,
      default: 5
    },
    fixed: {
      type: Boolean,
      default: true
    }
  }
}

</script>
<style lang='scss' scoped>
$baseColor: #F7F8FA;

.list-bone {
  bottom: 0;
  left: 0;
  right: 0;
  @media screen and (min-width: 1024px){
    width: 740px;
    box-sizing: border-box;
    margin: auto;
  }
  padding-left: 14px;
  background: #fff;
  overflow: hidden;
  .animation-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,.5);
    animation: slide cubic-bezier(0.25, 0.1, 0.25, 1) 3s infinite;
  }
  .virtual-item {
    display: flex;
    align-items: flex-start;
    padding: 15px 45px 15px 0;
    .v-item-img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 10px;
      background: $baseColor;
    }
    .v-item-desc {
      flex: 1;
      .v-item-line {
        height: 14px;
        border-radius: 4px;
        margin-bottom: 10px;
        background: $baseColor;
        background-clip: content-box;
        &.middle {
          padding-right: 142px;
        }
        &.short {
          padding-right: 88px;
        }
      }
    }
  }
}
@keyframes slide {
  from {
    transform: translate3d(0,0,0);
  }
  to {
    transform: translate3d(0,100%,0);
  }
}
</style>