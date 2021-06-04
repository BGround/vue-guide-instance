<template>
  <div class="qwui-phone_view">
    <div class="qwui-phone">
      <span class="qwui-phone_text">{{option.detail[0].title||'电话'}}</span>
      <img class="qwui-phone_pic"
           :src="imgUrl"
           alt="">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: require('assets/images/icon_web_phone.png')
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
.qwui-phone_view {
  .qwui-phone {
    display: flex;
    padding: 5px 10px;
    justify-content: space-between;
    align-items: center;
    .qwui-phone_text {
      margin-right: 12px;
      flex: 1;
      word-break: break-all;
      word-wrap: break-word;
    }
    .qwui-phone_pic {
      width: 36px;
      height: 36px;
    }
  }
}
</style>


