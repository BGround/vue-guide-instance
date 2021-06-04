<template>
  <div class="wrap qwui-wrap">
    <div class="img-content">
      <div class="qwui-capture" id="capture">
        <card :cardList='cardList'></card>
        <img class="qwui-dashed" src="../../../../../assets/images/crm/crm_line.png" alt="">
        <div class="barcode-content">
          <img class="barcode" :src='wxappQrcodePath' width="120" height="120" @touchstart="stopMagnifier">
          <div class="tip">微信扫码或长按识别小程序码</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import card from '../callingCard/components/card.vue'
import {getExternalPage} from '../../../api/smallProgram/getBata.js'
  export default {
    data() {
      return {
        cardList:{},//名片数据
      }
    },
    components: {
      card,
    },
    created () {
      let userId = this.$route.query.sellerId;
      getExternalPage({sellerId:userId},(res) => {
        this.cardList = res.marketingCard;
        document.querySelector("meta[name='description']").content='你好，我是'+this.cardList.companyName+'的'+this.cardList.personName+'，这是我的名片，请惠存';
        _.checkApi.setDataForWeixinValue(
          '企微云小站',
          _.filterCompressURL(this.cardList.avatarPicPath),
          '你好，我是'+this.cardList.companyName+'的'+this.cardList.personName+'，这是我的名片，请惠存',
          window.location.href
        );
      });
    },
    computed: {
      //跨域图片转同域
      wxappQrcodePath(){
        if(this.cardList.wxappQrcodePath){
          const wxappQrcodePath = _.baseURL+"/portal/errcode/errcodeAction!loadImage.action?imgUrl=" + _.filterCompressURL(this.cardList.wxappQrcodePath)
          return wxappQrcodePath
        }
      }
    },
    methods: {
      stopMagnifier(e){
        let eve = e || window.event;
        if(_.isIOS()){
          eve.preventDefault();
        }
      }
    },
    destroyed(){
      document.querySelector("meta[name='description']").content="";
    }
  }
</script>

<style scoped lang="scss">
@import '../../../crmBase.scss';
.qwui-wrap {
  background-color: #F7F8FA;
  height: 100vh;
}
.img-content{
  margin: 0 rem(14);
  margin-top: 20px;
  .qwui-capture {
    border-radius: 4px;
    overflow: hidden;
    box-shadow:0 rem(2) rem(6) 0 rgba(220,221,224,0.5);
    background-color: #fff;
  }
  .border{
    width: 100%;
    border: 1px dashed #E4E7ED;
  }
  .qwui-dashed {
    width: 100%;
  }
  .barcode-content{
    padding: rem(16) 0 rem(15);
    text-align: center;
    background:rgba(255,255,255,1);
    border-radius:rem(4);
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select: none;
    .barcode{
      width: rem(120);
      height: rem(120);
      margin-bottom: rem(14);
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      -khtml-user-select:none;
      -moz-user-select:none;
      -ms-user-select:none;
      user-select: none;
      margin: 0 auto;
      border: 0;
    }
    .tip{
      @include content-item(20,20,#7A7C80,14);
      margin-top: 13px;
    }
  }
}
// 弹窗动画
.slide-fade-enter-active {
  transition: all .4s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter,.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
/* 模糊弹窗 */
.mask-img{
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: rgb(51, 51, 51);
  z-index: 10;
  .mask-main{
    position: absolute;
    top: 20px;
    left: rem(15);
    right: rem(15);
    margin: 0 auto;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
  .tips{
    position: absolute;
    bottom: 115px;
    width: 100%;
    @include content-item(20,20,#fff,14);
    .icon-top{
      display: inline-block;
      width: 13px;
      height: 13px;
      background: url('../../../../../assets/images/crm/icon-top.png');
      background-size: 100%;
    }
  }
  .mask-close{
    position: absolute;
    bottom: rem(20);
    left: 50%;
    i{
      position: absolute;
      bottom: 30px;
      width: rem(18);
      height: rem(18);
      margin-left: rem(-10);
      background: url('../../../../../assets/images/crm/crm_ico10.png');
      background-size: 100% 100%;
    }
  }
}
.share{
  display: flex;
  margin-top: 80px;
  .share-item{
    flex: 1;
    text-align: center;
    color: #7A7C80;
    font-size: rem(13);
    .icon{
      width: rem(32);
      height: rem(32);
      margin: 0 auto;
      background: url('../../../../../assets/images/crm/crm_share.png') center no-repeat;
      background-size: 300%;
      &.share-card{
        background-position: 0 0;
      }
      &.share-friends{
        background-position: rem(-64) 0;
      }
      &.share-wechat{
        background-position: rem(-32) 0;
      }
    }
    .text{
      height: rem(18);
      line-height: rem(18);
      margin-top: rem(12);
    }
  }
}
@media screen and (max-width: 320px) {
  .mask-img .tips {
    font-size: 12px;
  }
}
@media screen and (max-height: 585px) {
  .mask-img .tips {
    bottom: 100px;
  }
}
@media screen and (max-height: 580px) {
  .share {
    margin-top: 50px;
  }
}
</style>
