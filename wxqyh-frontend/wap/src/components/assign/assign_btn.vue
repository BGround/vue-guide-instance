<template>
  <div>
    <div :class="['qwui-assign_btn',{'qwui-assign_btn_disable':isUsePresetSign}]" @click="showAssignBox">
      <i class="qwui-assign_icon"></i>
      签名
    </div>
  </div>
</template>

<script>
  export default {
    name: "assign_btn",
    components: {},
    data() {
      return {}
    },
    props: {
      isUsePresetSign: {      // 是否勾选存档签名
        type: Boolean,
        default: false
      },
    },
    methods: {
      showAssignBox() {
        this.$emit('showAssignBox', true)
      },
    },
  }
</script>

<style scoped>
  .qwui-assign_btn {
    float: right;
    width: 84px;
    height: 36px;
    color: #7A7D80;
    font-size: 16px;
    line-height: 34px;
    background-color: #fff;
    cursor: pointer;
    border-radius: 4px;
    border: 1px #E3E4E8 dashed;
    box-sizing: border-box;
  }

  .qwui-assign_icon {
    display: inline-block;
    vertical-align: middle;
    margin: -3px 0 0 12px;
    width: 20px;
    height: 20px;
    background: url(~assets/images/assign_icon_edit_default.png) no-repeat center;
    background-size: cover;
  }

  .qwui-assign_btn_disable {
    color: #D2D5DB;
    background-color: #F7F8F9;
    border: 1px #F7F8F9 solid;
  }

  .qwui-assign_btn_disable .qwui-assign_icon {
    background: url(~assets/images/assign_icon_edit_disable.png) no-repeat center;
    background-size: cover;
  }
</style>
