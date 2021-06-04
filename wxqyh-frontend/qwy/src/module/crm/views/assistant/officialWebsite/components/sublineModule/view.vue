<template>
  <div class="qwui-line_view">
    <div class="qwui-line"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    option: {
      default: {},
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-line_view {
  padding: 8px 10px;
  .qwui-line {
    height: 1px;
    border-radius: 4px;
    background-color: #f6f6f8;
  }
}
</style>


