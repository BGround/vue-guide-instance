<template>
  <div class="lottery-result" :class="{sumitedByPc : isPC}">
    <div class="header">
      <p class="result-tip">提交成功，感谢您的参与</p>
      <div class="awards-show">
        <div class="show-title" :class="{'no-bg': !win}">{{showTitle}}</div>
        <p class="gift-name">{{giftTip}}</p>
        <div class="gift-box" :class="[giftImg]"></div>
        <!-- <p class="send-tip" v-if="win">请点击下方按钮填写收件地址，我们将会在1-5个工作日内寄出奖品</p>
        <div class="add-address" v-if="win" @click="addAddress">
          点击填写收件地址
        </div> -->
      </div>
    </div>
    <!--外部单底部logo-->
    <div class="openFooterContent">
      <a href="http://wbg.do1.com.cn/" target="_blank">
        <img src="../../../../assets/images/newsmallLogo.svg" alt="">
        道一云|企微，让工作更简单
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    giftInfo: [Object],
    isPC: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      showTitle: '',
      giftTip: '',
      giftImg: '',
      giftName: this.giftInfo.giftName,
      win: false
    };
  },
  created() {
    this.showTitle = this.win ? '恭喜你！' : '哎呀！';
    this.giftTip = this.win ?  '获得 ' + this.giftName : '就差那么一点点';
    if(this.giftName == '小米手环') {
      this.giftImg = 'shouhuan';
    }else if(this.giftName == '小米音响') {
      this.giftImg = 'yinxiang';
    }else {
      this.giftImg = 'no-gift'
    }
  },
  methods: {
    addAddress() {
      let href = window.location.href;
      if(href.indexOf('tqy') != -1) { //dev、release
        window.location.href = `https://tqy.do1.net.cn/qwy/vp/module/form.html?agentCode=form&corp_id=ww76540ea8781f31c5#/open/add?id=formeb7d4234531c420f82fb8773494178c1&field=${this.giftInfo.corpId}&field1=${this.giftInfo.userId}&field2=${this.giftName}`;
      }else {
        window.location.href = `https://qy.do1.com.cn/open/vp/module/form.html?agentCode=form&corp_id=ww393e4dbf1eef102e#/open/add?id=form6472caff91d04caa82e023f96e8e94ee&agentCode=form&field=${this.giftInfo.corpId}&field1=${this.giftInfo.userId}&field2=${this.giftName}`;
      }
      this.$emit('updateSurver', false);
    }
  }
}

</script>
<style lang='scss' scoped>
.lottery-result {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  z-index: 4;
  &.sumitedByPc {
    width: 400px;
    margin: 28px auto;
    border-radius: 4px;
    box-shadow: 0px 14px 32px 0px rgba(201,205,214,0.8);
  }
  .header {
    height: 128px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url(~@/assets/images/img_a-resultpage_bg@2x.png) no-repeat;
    background-size: 100% 128px;
    .result-tip {
      text-align: center;
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(241,243,248,1);
      line-height:22px;
      margin-top: 14px;
    }
    .awards-show {
      position: absolute;
      top: 81px;
      left: 0;
      right: 0;
      margin: auto;
      width: 303px;
      height: 458px;
      background: url(~@/assets/images/img_a-resutlpage_bg2@2x.png) no-repeat;
      background-color: rgba(0,0,0,0.08);
      background-size: 303px 458px;
      box-shadow:0px 8px 20px 0px rgba(0,0,0,0.08);
      .show-title {
        height: 36px;
        line-height: 55px;
        width: 226px;
        text-align: center;
        font-size:18px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(242,111,79,1);
        margin: 15px auto 0;
        background: url(~@/assets/images/img_a-resultpage_bg3@2x.png) no-repeat;
        background-size: 226px 36px;
        &.no-bg {
          background: none;
          color: #0A1735;
        }
      }
      .gift-name {
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(10,23,53,1);
        line-height:21px;
        text-align: center;
        margin-top: 11px;
      }
      .gift-box {
        width: 180px;
        height: 180px;
        background-size: 180px;
        background-repeat: no-repeat;
        margin: 24px auto 0;
        &.shouhuan {
          background-image: url(~@/assets/images/xiaomishouhuan.png);
        }
        &.yinxiang {
          background-image: url(~@/assets/images/xiaomiyinxiang.png);
        }
        &.no-gift {
          background-image: url(~@/assets/images/img_a-emptypage_lost@2x.png);
        }
      }
      .send-tip {
        width:197px;
        height:34px;
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(178,185,200,1);
        line-height:17px;
        text-align: center;
        margin: 16px auto 0;
      }
      .add-address {
        width: 264px;
        line-height: 40px;
        background:rgba(85,133,240,1);
        border-radius:4px;
        font-size:15px;
        text-align: center;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(255,255,255,1);
        margin: 36px auto 0;
        cursor: pointer;
      }
    }
  }
  .openFooterContent {
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
		line-height: 16px;
		padding: 10px 20px;
		text-align: center;
    a {
      position: relative;
      font-size: 12px;
      color: #B2B9C8;
    }
    img {
      width: 15px;
      height: 15px;
      vertical-align: text-top;
    }
	}
}
</style>