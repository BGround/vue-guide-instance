<template>
  <div class="qwui-adress_view">
    <div class="qwui-adress">
      <span class="qwui-adress_text">{{option.detail[0].title||"地址"}}</span>
      <img class="qwui-adress_pic"
           :src="imgUrl"
           alt="">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: require('assets/images/icon_web_address.png')
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
      this.option.detail = [{ title: '' }]
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-adress_view {
  .qwui-adress {
    display: flex;
    padding: 5px 10px;
    justify-content: space-between;
    align-items: center;
    .qwui-adress_text {
      margin-right: 12px;
      flex: 1;
      word-break: break-all;
      word-wrap: break-word;
    }
    .qwui-adress_pic {
      width: 36px;
      height: 36px;
    }
  }
}
</style>


