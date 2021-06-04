<template lang="html">
  <div class="qwui-loading"></div>
</template>

<script>
export default {
  name: 'QwLoading'
}
</script>

<style lang="scss" scoped>
.qwui-loading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: {
    color: rgba(0, 0, 0, 0.1);
    image: url(../../static/img/loading.gif);
    repeat: no-repeat;
    position: center center;
  }
}
</style>
