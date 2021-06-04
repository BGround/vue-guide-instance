<template>
  <div class="qwui-email_view">
    <div class="qwui-email">
      <span class="qwui-email_text">{{option.detail[0].title||"邮箱"}}</span>
      <img class="qwui-email_pic"
           :src="imgUrl"
           alt="">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: require('assets/images/icon_web_email.png')
    }
  },
  props: {
    option: {
      default: {},
      type: Object
    }
  },
  created() {
    if (!this.option.detail.length) {
      this.option.detail = [{}]
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-email_view {
  .qwui-email {
    display: flex;
    padding: 5px 10px;
    justify-content: space-between;
    align-items: center;
    .qwui-email_text {
      margin-right: 12px;
      flex: 1;
      word-break: break-all;
      word-wrap: break-word;
    }
    .qwui-email_pic {
      width: 36px;
      height: 36px;
    }
  }
}
</style>


