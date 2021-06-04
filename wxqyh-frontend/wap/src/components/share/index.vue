<template>
  <transition name="fade" v-if="show">
    <div class="share-dialog">
      <div class="maskLayer" @click="cancel"></div>
      <div class="share-box">
        <p class="share-box-title">{{mainTitle}}</p>
        <div class="share-box-content">
          <div class="share-box-item">
            <div class="share-box-img" @click="wxShare"><span class="ic-wx"></span></div>
            <div class="share-box-text">微信</div>
          </div>
          <div class="share-box-item">
            <div class="share-box-img" @click="qywxShare"><span class="ic-qywx"></span></div>
            <div class="share-box-text">企业微信</div>
          </div>
          <div class="share-box-item">
            <div class="share-box-img url-copy" :data-clipboard-text="shareUrl"><span class="ic-fzlj"></span></div>
            <div class="share-box-text">复制链接</div>
          </div>
          <slot name="share-box-item"></slot>
        </div>
        <div class="share-box-cancel" @click="cancel">取消</div>
      </div>
    </div>
  </transition>

</template>

<script>
  import wx from 'weixin-js-sdk'
  import ClipboardJS from 'clipboard'

  // 复制链接
  let clipboard = new ClipboardJS('.url-copy');
  clipboard.on('success', function(e) {
    _.tooltips_succeed('复制成功',true,'');
    e.clearSelection();
  });

  export default {
    name: "QwShare",
    props: {
      // 显示
      show: {
        type: Boolean,
        default: false
      },
      // 标题
      mainTitle: {
        type: String,
        default: ''
      },
      // 分享链接
      shareUrl: {
        type: String,
        default:'',
      },
      // 分享配置
      shareConfig: {
        type: Object,
        default() {
          return {
            title: '', // 分享标题
            desc: '', // 分享描述
            link: '', // 分享链接
            imgUrl: '', // 分享图标
          }
        }
      }
    },
    data() {
      return {

      }
    },
    methods: {
      cancel() {
        this.$emit('update:show',false)
      },
      // 企业微信会话分享
      qywxShare() {
        wx.ready(()=>{
          wx.invoke(
            "shareAppMessage", this.shareConfig, function(res) {
              console.log(res)
              if (res.err_msg == "shareAppMessage:ok") {
              }else {
              }
            }
          );
        })
      },
      // 微信会话分享
      wxShare() {
        wx.ready(()=>{
          wx.invoke(
            "shareWechatMessage", this.shareConfig, function(res) {
              console.log(res)
              if (res.err_msg == "shareWechatMessage:ok") {
              }else {
              }
            }
          );
        })
      },
    }
  }
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .maskLayer {
    height: 100%;
    background-color: rgba(0,0,0,0.4);
    transition: all .25s ease;
  }
  .share-dialog {
    position: fixed;
    top: 0;
    z-index: 10;
    height: 100%;
    width: 100%;
  }
  .share-box {
    position: absolute;
    bottom: 0;
    width: 100%;
    background:rgba(247,248,250,1);
    border-radius:4px 4px 0 0;
  }
  .share-box-title {
    font-size: 13px;
    text-align: center;
    padding-top: 24px;
    color: #7A7D80;
  }
  .share-box-cancel {
    font-size: 16px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #0A1736;
    background-color: #fff;
    cursor: pointer;
  }
  .share-box-content {
    display: flex;
    margin-top: 28px;
    margin-bottom: 24px;
  }
  .share-box-item {
    flex: 1;
    text-align: center;
  }

  .share-box-img {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 12px;
    cursor: pointer;
  }
  .share-box-text {
    font-size: 14px;
    margin-top: 8px;
    color: #0A1736;
  }
  .ic-qywx,.ic-wx,.ic-fzlj{
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-top: 14px;
    background-repeat: no-repeat;
    background-size: contain;
  }
  .ic-qywx {
    background-image: url("~assets/images/ic_a-share_qywx@2x.png");
  }
  .ic-wx {
    background-image: url("~assets/images/ic_a-share_wx@2x.png");
  }
  .ic-fzlj {
    background-image: url("~assets/images/ic_a-share_fzlj@2x.png");
  }
  @media screen and (min-width: 1024px) {
    .share-dialog,.maskLayer {
      width: 740px;
      margin: 0 auto;
    }
  }
</style>
