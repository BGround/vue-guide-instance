<template>
    <div
      class="qwui-action-button-item"
      :class="customClass"
      @click="actionButtonClick"
    >
      <i :class="['icon',icon]"></i>
      <span class="text">{{text}}</span>
    </div>
</template>

<script>
  export default {
    name: "flow_action_btn",
    props: {
      text: String,
      icon: String,
      customClass: String,    // 自定义类名
    },
    data() {
      return {}
    },
    methods: {
      actionButtonClick(e) {
        this.$emit('actionButtonClick',e)
      }
    }
  }
</script>

<style scoped>
  .qwui-action-button-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: #333;
    font-size: 16px;
    cursor: pointer;
  }

  .icon{
    width: 16px;
    height: 16px;
    vertical-align: middle;
    background-repeat: no-repeat;
    background-size: cover;
    margin-right: 5px;
  }
  .text {
    line-height: 1;
  }
</style>
