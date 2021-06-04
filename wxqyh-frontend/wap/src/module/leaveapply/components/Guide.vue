<template>
  <div @touchmove="move">
    <div class="guide-mask qwui-nav_box_fixed add-guide" v-show="step == 0">
      <div class="msg-box entry-msg">
        <p><img src="../asset/img/info.png"></p>
      </div>
      <img class="line-img" src="../asset/img/line.png">
      <div class="guide-btn" @click="goNext"><img  src="../asset/img/btn_next.png"></div>
      <div class="line-wrapper">
        <div class="line horizon"></div>
        <div class="line vertical"></div>
      </div>
    </div>
    <div class="guide-mask qwui-nav_box_fixed bg-detail" v-show="step == 1">
      <img class="img-detail" src="../asset/img/bg_detail_ipx.png"  @click="gotIt" v-if="isIPX">
      <img class="img-detail" src="../asset/img/bg_detail.png"  @click="gotIt" v-else>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      step: 0,
      isIPX: false
    };
  },
  mounted() {
    document.getElementsByTagName("body")[0].style.cssText = "overflow-y: hidden;";
    document.body.style.cssText = "overflow-y: hidden;";
    let screenHeight = document.body.clientHeight;  // 屏幕尺寸
    let screenWidth = document.body.clientWidth;
    this.isIPX = screenHeight == 812  && screenWidth == 375 ?  true : false;
  },
  destroyed() {
    document.getElementsByTagName("body")[0].style.cssText = "";
    document.body.style.cssText = "";
  },
  methods: {
    move(e) {
      e.preventDefault();
    },
    gotIt() {
      this.$emit('gotIt');
      document.getElementsByTagName("body")[0].style.cssText = "";
      document.body.style.cssText = "";
      this.step = 2;
    },
    goNext() {
      this.step = 1;
    }
  }
}

</script>
<style lang='scss' scoped>
.guide-mask {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 0 auto;
  z-index: 12;
  background: rgba(0,0,0,.75);
}

.guide-btn {
  display: block;
  height: 41px;
  line-height: 40px;
  text-align: center;
  font-size: 17px;
  color: #fff;
  position: absolute;
  cursor: pointer;
}

.bg-detail {
  img {
    position: absolute;
    width: 6px;
  }
  .img-detail {
    width: 100%;
    height: 100%;
    position: relative;
  }
}

.msg-box {
  height: 22px;
  font-size: 16px;
  font-family: "PingFangSC-Regular", "Microsoft YaHei", "宋体", "Tahoma", "Arial", "sans-serif";;
  font-weight: 400;
  color: white;
  position: absolute;
}
.add-guide {
  .entry-msg {
    right: 24px;
    bottom: 224px;
    @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px){
      bottom: 282px;
    }
    line-height: 36px;
    img {
      width: 224px;
    }
  }
  .line-img {
    position: absolute;
    width: 6px;
    bottom: 139px;
    @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px){
      bottom: 193px;
    }
    right: 39px;
    height: 67px;
  }
  .guide-btn {
    bottom: 155px;
    @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px){
      bottom: 203px;
    }
    right: 109px;
    img {
      width: 130px;
    }
  }
  .line-wrapper {
    width: 54px;
    height: 54px;
    position: absolute;
    bottom: 72px;
    right: 8px;
    border-radius: 50%;
    background: #5585F0;
    border: 8px solid rgba(255, 255, 255, 0.8);
    .line {
      background: #fff;
      position: absolute;
      &.horizon {
        height: 2px;
        width: 16px;
        top: 26px;
        left: 19px;
      }
      &.vertical {
        height: 16px;
        width: 2px;
        left: 26px;
        top: 19px;
      }
    }
  }
}

@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .guide-mask .line-wrapper{
    bottom: 123px
  }
}
@media screen and(min-width: 768px){
  .add-guide {
    .entry-msg {
      bottom: 260px;
      img {
        width: 321px;
      }
    }
    .guide-btn {
      bottom: 180px;
      img {
        width: 180px;
      }
    }
  }
}
</style>
