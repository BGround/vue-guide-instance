<template>
  <div class="qwui-chat_system">{{message.content}}</div>
</template>

<script>
export default {
  name: 'SystemMessageComponent',
  props: {
    message: {
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-chat_system {
  height: 24px;
  text-align: center;
  font-size: 12px;
  line-height: 24px;
  color: #a2a4a7;
  margin: 10px 0;
}
</style>
