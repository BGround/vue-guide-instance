<template>
  <div class="qwui-message_container">
    <img 
         class="qwui-avatar_pic"
         :src="message.headPic"
         width="42"
         height="42"
         alt="">
    <div class="qwui-message_content">我的手机号是{{message.content}}，请来电联系我</div>
  </div>
</template>

<script>
export default {
  name: 'ReceiveMessageComponent',
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-message_container {
  width: 100%;
  display: flex;
  margin: 20px 14px;
  .qwui-avatar_pic {
    border-radius: 50%;
  }
  .qwui-message_content {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 285px;
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
    word-break: break-all;
  }
}
</style>
