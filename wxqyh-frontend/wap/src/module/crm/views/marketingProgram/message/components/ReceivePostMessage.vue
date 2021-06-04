<template>
  <div class="qwui-message_container">
    <img :src="message.headPic"
         class="qwui-message_avatar"
         width="42"
         height="42"
         alt="">
    <div class="qwui-message_content">
      <img class="qwui-message_post"
           :src="message.content.cover" />
      <div class="qwui-message_info">
        <span class="qwui-message_title">{{message.content.productName}}</span>
        <span class="qwui-message_price"
              v-if="message.content.productPrice">￥{{message.content.productPrice}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReceivePostMessageComponent',
  props: {
    message: {
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-message_container {
  width: 100%;
  display: flex;
  margin: 20px 14px;
  .qwui-message_avatar {
    border-radius: 50%;
  }
  .qwui-message_content {
    max-width: 285px;
    max-height: 66px;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #343434;
    box-sizing: border-box;
    background-color: #fff;
    margin-left: 12px;
    padding: 10px 18px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    border-top-right-radius: 20px;
    box-shadow: 0px 2px 6px 0px rgba(227, 228, 232, 0.3);
    .qwui-message_post {
      width: 76px;
      height: 38px;
    }
    .qwui-message_info {
      max-width: 165px;
      margin-left: 9px;
      display: flex;
      flex-direction: column;
      .qwui-message_title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .qwui-message_price {
        font-size: 12px;
      }
    }
  }
}
</style>
