<template lang="html">
  <div class="wrap">
    <div class="head">
      <div class="head_icon">
        <span class="icon_logo"></span>
        <span class="icon_split">|</span>
        <span class="icon_text">培训学习</span>
      </div>
      <div class="liveCover_wrap">
        <div class="cover_wrap">
          <img
            v-picfix
            v-if="liveInfoData.liveCover"
            :src="getCoverUrl(liveInfoData.liveCover)"
          />
        </div>
      </div>
      <div class="head_title ellipsis">{{ liveInfoData.liveName }}</div>
      <div class="head_date">开始时间&nbsp;&nbsp;{{ liveInfoData.startTime }}</div>
    </div>
    <div class="grey_split"></div>
    <div class="main">
      <div class="main_type">直播方式</div>
      <div class="type_pc">
        <div class="pc_title pc_icon">电脑直播</div>
        <div class="main_wrap">
          <div class="dash_line"></div>
          <div class="white_lineTop"></div>
          <div class="white_lineBottom linePc"></div>
          <div class="pc_li mt12">长按复制下方直播链接，在PC端浏览器输入</div>
          <div class="grey ml26">{{ liveInfoData.liveUrl }}</div>
          <div class="pc_li mt21">输入直播口令：{{ liveInfoData.token }}</div>
          <div class="pc_li mt21">验证通过后进入直播间，根据直播教程进行直播</div>
        </div>
      </div>
      <div class="type_pc" v-if="isVipGold">
        <div class="pc_title wechat_icon">微信小程序直播 </div>
        <div class="main_wrap">
          <div class="dash_line"></div>
          <div class="white_lineTop"></div>
          <div class="white_lineBottom"></div>
          <div class="pc_li mt21">复制直播口令：{{ liveInfoData.token }}</div>
          <div class="pc_li mt21">保存下方小程序二维码，到微信中打开</div>
          <!--<qrcode class="qrCode" :value="qrCodeUrl" type="img" :size="120"></qrcode>-->
          <img class="qrCode" :src="getCoverUrl(qrCodeUrl)" alt="">
          <div class="pc_li mt21">输入直播口令，即可进行直播</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getLiveInfoData } from  '../../api/getData'
import { isVipGold } from '@/assets/js/vip-portal.js'

export default {
  name: 'LiveInfo',
  data() {
    return {
      liveInfoData: {},
      qrCodeUrl: '',
      isVipGold: false,
    }
  },
  created() {
    //直播详情
    getLiveInfoData({id: this.$route.params.id, needNew: 1}, data => {
      this.liveInfoData = {...data.live};
      this.qrCodeUrl = data.openPO.url;
      this.isVipGold = data.isVip;
    });
    // //vip接口请求完之后的回调
    // window.wxqyhConfig.ready(() => {
    //   this.isVipGold = isVipGold(interfaceCode.INTERFACE_CODE_LEARN);
    // });
  },
  methods: {
    // 得到正确的封面图URL
    getCoverUrl(url) {
      return url ? _.compressURL + url : url;
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';
$black: #0A1735;
$grey: #B2B9C8;
.wrap {
  min-height: 100vh;
  font-size: 15px;
  color: $black;
  line-height: 1;
  background-color: #fff;
  .head {
    padding: 0 14px;
    min-height: 285px;
    overflow: hidden;
    .head_icon {
      height: 41px;
      line-height: 41px;
      text-align: center;
      .icon_logo {
        display: inline-block;
        width: 80px;
        height: 100%;
        vertical-align: bottom;
        background: url(~assets/images/qwLogo.png) center/contain no-repeat;
        background-size: 80px 21px;
      }
      .icon_split {
        color: #E3E4E8;
      }
      .icon_text {
        color: #666666;
        font-size: 16px;
      }
    }
    .liveCover_wrap {
      @include cover-wrap('../../../../assets/images/ic-bg.png');
    }
    .head_title {
      margin-top: 12px;
      font-size: 18px;
    }
    .head_date {
      margin: 8px 0 8px 0;
      color: $grey;
    }
  }
  .grey_split {
    width: 100%;
    height: 8px;
    background-color: #F5F5F5;
  }
  .main {
    padding: 12px 14px 30px;
    .main_type {
      color: #7A7C80;
    }
    .main_wrap {
      position: relative;
    }
    .white_lineTop {
      height: 10px;
      width: 5px;
      background-color: #fff;
      position: absolute;
      top: 0;
      left: 6px;
    }
    .white_lineBottom {
      height: 15px;
      width: 5px;
      background-color: #fff;
      position: absolute;
      bottom: 0;
      left: 6px;
      &.linePc {
         height: 20px;
       }
    }
    .dash_line {
      height: 100%;
      border-left: 1px dashed #E9EBEF;
      position: absolute;
      left: 8px;
    }
    .type_pc {
      box-sizing: border-box;
      padding-right: 12px;
      margin-top: 12px;
      padding-bottom: 16px;
      .pc_title {
        height: 47px;
        line-height: 47px;
        font-size: 16px;
        @include border-b-1px(#F7F8FA);
        &::before {
            content: '';
            float: left;
            margin-right: 10px;
            display: block;
            width: 16px;
            height: 100%;
            background-size: 16px 16px;
         }
       &.pc_icon::before {
          background: url(~assets/images/livePc.png) center/contain no-repeat;
        }
       &.wechat_icon::before {
          background: url(~assets/images/liveWechat.png) center/contain no-repeat;
        }
      }
      .pc_li {
        position: relative;
        margin-left: 26px;
        line-height: 21px;
        &::before {
          content: '';
          position: absolute;
          top: 7px;
          left: -20px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #6A98FF;
         }
        &.mt12 {
          margin-top: 12px;
        }
        &.mt21 {
          margin-top: 21px;
        }
      }
      .grey {
        color: $grey;
        line-height: 21px;
        word-wrap: break-word;
        cursor: pointer;
        &.ml26 {
           margin-top: 8px;
           margin-left: 26px;
         }
      }
      .qrCode {
        display: inline-block;
        width: 120px;
        height: 120px;
        margin-top: 8px;
        margin-left: 26px;
        cursor: pointer;
        -webkit-tap-highlight-color:rgba(0,0,0,0);
      }
    }
  }
}
</style>
