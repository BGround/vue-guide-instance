<template>
  <div class="qwui-show_title">
    <h2 class="qwui-text"
        :style="{'text-align':textAlign}">{{option.detail[0].title||'标题'}}</h2>
  </div>
</template>

<script>
export default {
  props: {
    option: {
      default: {},
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {
    textAlign() {
      let _textAlign = 'left'
      switch (parseInt(this.option.display)) {
        case 0:
          _textAlign = 'left'
          break
        case 1:
          _textAlign = 'center'
          break
        case 2:
          _textAlign = 'right'
          break
      }
      return _textAlign
    }
  },
  created() {
    if (!this.option.detail || this.option.detail.length === 0) {
      this.option.detail = [{ title: '' }]
    }
  }
}
</script>

<style lang="scss">
.qwui-show_title {
  min-height: 28px;
  // padding: 20px 10px 8px;
  padding: 10px;
  .qwui-text {
    font-size: 20px;
    font-weight: bold;
    color: #343434;
    word-break: break-all;
  }
}
</style>


