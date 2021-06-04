<template>
  <p class="marquee-tips" v-html="content"></p>
</template>

<script>
  const {insertKeyFrame, deleteKeyFrame, getWidthHeight, getTextWidth} = require('./Utils')
  export default{
    name: 'MarqueeTips',
    props: {
      content: String,
      font: {
        type: String,
        default: '16px sans-serif'
      },
      speed: {
        type: Number,
        default: 0
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.init()
      })
    },
    methods: {
      init () {
        let _this = this.$el
        let animationName = 'marquee' + Math.random().toString(36).substring(3, 8)
        deleteKeyFrame(animationName)
          const start = (_this.parentNode ? _this.parentNode.innerWidth || _this.parentNode.clientWidth : getWidthHeight().width) + 10;
          const end = -getTextWidth(this.content, this.font);
          const offset  = start - end;
          const durationTime = this.speed ? this.speed : offset/100;
        insertKeyFrame(`@keyframes ${animationName} {
          0% {
            margin-left: ${(_this.parentNode ? _this.parentNode.innerWidth || _this.parentNode.clientWidth : getWidthHeight().width) + 10}px
          }
          100% {
            margin-left: ${-getTextWidth(this.content, this.font)}px
          }
        }`)
        insertKeyFrame(`@-webkit-keyframes ${animationName} {
          0% {
            text-indent: ${(_this.parentNode ? _this.parentNode.innerWidth || _this.parentNode.clientWidth : getWidthHeight().width) + 10}px
          }
          100% {
            text-indent: ${-getTextWidth(this.content, this.font)}px
          }
        }`)
        insertKeyFrame(`@-moz-keyframes ${animationName} {
          0% {
            text-indent: ${(_this.parentNode ? _this.parentNode.innerWidth || _this.parentNode.clientWidth : getWidthHeight().width) + 10}px
          }
          100% {
            text-indent: ${-getTextWidth(this.content, this.font)}px
          }
        }`)
        insertKeyFrame(`@-o-keyframes ${animationName} {
          0% {
            text-indent: ${(_this.parentNode ? _this.parentNode.innerWidth || _this.parentNode.clientWidth : getWidthHeight().width) + 10}px
          }
          100% {
            text-indent: ${-getTextWidth(this.content, this.font)}px
          }
        }`)
        _this.style.animation = animationName + ' ' + durationTime + 's' + ' linear infinite'
        _this.style.webkitAnimation = animationName + ' ' + durationTime + 's' + ' linear infinite'
        _this.style.mozAnimation = animationName + ' ' + durationTime + 's' + ' linear infinite'
        _this.style.oAnimation = animationName + ' ' + durationTime + 's' + ' linear infinite'
      }
    },
    watch: {
      content: 'init',
      speed: 'init'
    }
  }
</script>

<style>
  .marquee-tips {
    text-align: left;
    width: 100%;
    margin: 0 auto;
    /*overflow: hidden;*/
    /*white-space: nowrap;*/
    box-sizing: border-box;
  }
</style>
