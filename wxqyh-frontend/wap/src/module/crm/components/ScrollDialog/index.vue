<template>
  <div class="qwui-dialog_container">
    <div :class="['qwui-dialog_mask',visible ? 'qwui-dialog_mask_show': '']"
         @click.stop.prevent="handleClickMask"></div>
    <div :class="['qwui-dialog', visible ? 'qwui-dialog_show': '']">
      <div class="qwui-dialog_header" 
           @touchstart.stop="touchStart"
           @touchmove.stop="touchMove"
           @touchend.stop="touchEnd">{{title}}</div>
      <img class="qwui-dialog_close"
           src="~assets/images/crm/icon_dialog_close.png"
           @click="handleClose" />
      <div class="qwui-dialog_section">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScrollDialogComponent',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      required: true
    }
  },
  data(){
    return {
      slideObj:{}
    }
  },
  methods: {
    handleClickMask() {
      if (!this.maskClosable) return
      this.handleClose()
    },
    handleClose() {
      this.$emit('close')
      document.querySelector('.qwui-dialog').style.transform = 'translate3d(0, 100%, 0)';
      document.querySelector('.qwui-dialog').style = '';
     
    },
    touchStart(event){
      event.preventDefault();
      this.slideObj.dis = 0;
      this.slideObj.startY = event.touches[0].clientY;
      document.querySelector('.qwui-dialog').style.transition = 'none';
    },
    touchMove(event){
      event.preventDefault();
      this.slideObj.dis = event.touches[0].clientY - this.slideObj.startY;
      if(this.slideObj.dis <= 0) {
        return;
      }
      document.querySelector('.qwui-dialog').style.transform = 'translate3d(0, '+this.slideObj.dis+'px, 0)';
    },
    touchEnd(event){
      event.preventDefault();
      document.querySelector('.qwui-dialog').style.transition = 'all 0.2s linear';
      if(this.slideObj.dis > 100){
        this.handleClose();
      }else{
        document.querySelector('.qwui-dialog').style.transform = 'translate3d(0,0,0)';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-dialog_container {
  .qwui-dialog_mask {
    max-width: 740px;
    margin: 0 auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    transition: all 0.2s ease-in-out;
    opacity: 0;
    visibility: hidden;
  }
  .qwui-dialog_mask_show {
    opacity: 1;
    visibility: visible;
  }
  .qwui-dialog {
    max-width: 740px;
    margin: 0 auto;
    position: fixed;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 550px;
    background-color: #fff;
    border-radius: 13px 13px 0 0;
    z-index: 1200;
    transform: translate3d(0, 100%, 0);
    transform-origin: center;
    transition: all 0.2s linear;
    visibility: hidden;
    .qwui-dialog_header {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 50px;
      color: #3f4a64;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .qwui-dialog_close {
      position: absolute;
      width: 22px;
      height: 22px;
      right: 15px;
      top: 13px;
    }
    .qwui-dialog_section {
      width: 100%;
      height: 500px;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
  .qwui-dialog_show {
    transform: translate3d(0, 0, 0);
    visibility: visible;
  }
}
//苹果X样式适配
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .qwui-dialog_container .qwui-dialog {
    bottom: 34px;
  }
}
</style>
