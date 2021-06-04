<template>
  <div class="textarea-view">
    <div class="textarea-view-content"
         v-html="option.detail[0].content||'富文本'"></div>
  </div>
</template>

<script>
export default {
  props: {
    option: {
      type: Object
    }
  },
  created() {
    if (this.option.detail.length === 0) {
      this.option.detail = [{}]
    }
  }
}
</script>
<style lang="scss" scoped>
.textarea-view {
  padding: 7px 14px;
}
</style>
<style lang="scss">
.textarea-view {
  &-content {
    font-size: 16px;
    word-wrap: break-word;
    img {
      max-width: 100%;
    }
    em {
      font-style: italic;
    }
    per {
      overflow-x: auto;
    }
    .list-paddingleft-2 {
      padding-left: 30px;
    }
  }
}
</style>
