<template>
  <div class="qwui-share">
    <img src="~assets/images/icon_share.png" class="qwui-share_icon">
    <h1>正跳转至外部分享页</h1>
    <p>点击该页面右上角分享</p>
    <p class="clock">{{ clock }}</p>
  </div>
</template>

<script>
export default {
  name: 'QwShare',
  props: {
    // 等待时间（秒）
    period: {
        type: Number,
        required: true
    },
    // 分享跳转的路径
    url: {
        type: String,
        required: true
    }
  },
  data () {
    return {
      clock: this.period
    }
  },
  created () {
    var self = this;
    let timer = setInterval(() => {
      if (--this.clock === 0) {
        clearInterval(timer);
        window.location.href= self.url;      
      }
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
@media screen and (min-width: 1024px) {
    .qwui-share{
      width:740px!important;
      margin: 0 auto;
    }
  }
.qwui-share {
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  padding-top: 165px;
  text-align: center;
  background-color: #f5f5f5;
  h1 {
    color: #333;
    font-size: 20px;
    font-weight: normal;
    margin: 10px 0 4px;
  }
  p {
    color: #666;
    font-size: 14px;
  }
  .qwui-share_icon {
    width: 55px;

  }
  .clock {
    display: block;
    position: absolute;
    top: 13px;
    right: 13px;
    width: 30px;
    height: 30px;
    color: #fff;
    line-height: 30px;
    border-radius: 50%;
    background-color: #bdbdbd;
  }
}
</style>
