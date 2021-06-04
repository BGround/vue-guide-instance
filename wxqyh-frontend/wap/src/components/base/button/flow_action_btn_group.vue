<template>
  <div class="qwui-action-button">
    <div class="flexItem">
      <slot></slot>
    </div>
    <div
      v-if="moreButton.show"
      class="moreButton"
      :class="{'border':moreButton.border}"
      @click="moreButtonClick"
    >
      <span class="text">{{moreButton.text}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "flow_action_btn_group",
    props: {
      // 更多按钮是否显示
      moreButton: {
        type: Object,
        default() {
          return {
            show: false,
            text: '更多',
            border: true,   // 加左竖线
          }
        },
      }
    },
    methods: {
      moreButtonClick() {
        this.$emit('moreButtonClick')
      },
    }
  }
</script>

<style scoped>
  .flexItem {
    display: flex;
    flex: 1;
  }
  .qwui-action-button {
    position: fixed;
    z-index: 3;
    bottom: 0;
    width: 100%;
    display: flex;
    line-height: 50px;
    height: 50px;
    vertical-align: middle;
    background-color: #fff;
    box-shadow: 0 -1px 10px 0 rgba(207,213,234,0.4);
  }
  .qwui-action-button:before{
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .moreButton {
    display: inline-block;
    width:64px;
    height: 16px;
    line-height: 16px;
    font-size: 16px;
    vertical-align: middle;
    margin-top: 18px;
    padding-left: 15px;
    box-sizing: border-box;
    color: #b2b9c8;
    cursor: pointer;
  }
  .moreButton.border {
    border-left: 1px solid #ccc;
  }
  @media screen and (min-width: 1024px) {
    .qwui-action-button {
      width: 740px;
      margin: 0 auto;
    }
  }
</style>
