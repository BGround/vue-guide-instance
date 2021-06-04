<template>
  <div class="wrap qwui-wrap"
       @click.stop="closeShareTip"
       :style="{'height':isFixed? '100vh':'auto'}">
    <div class="img-content">
      <div class="qwui-capture"
           id="capture">
        <card :cardList='cardList'></card>
        <img class="qwui-dashed"
             src="~assets/images/crm/crm_line.png"
             alt="">
        <div class="barcode-content">
          <img class="barcode"
               :src='wxappQrcodePath'
               width="120"
               height="120"
               @touchstart="stopMagnifier">
          <div class="tip">微信扫码或长按识别小程序码</div>
        </div>
      </div>
    </div>
    <!-- 截图图片存放 -->
    <transition name="slide-fade">
      <div class="mask-img"
           v-show='showCardImg'>
        <div class="mask-main">
          <img :src='baseULR'
               alt=""
               width=""
               height=""
               id="imgcapture">
        </div>
        <div class="tips">
          <span class="icon-top"></span>
          长按图片保存名片到相册，分享到微信或朋友圈
        </div>
        <span class="mask-close"
              @click="cardImg">
          <i></i>
        </span>
      </div>
    </transition>
    <!-- 形象标签 -->
    <image-tag @editSwitch="resetHeight" :dataList="tagList" @handleTag="handleTag" @reLoadTag="reLoadTag"></image-tag>
    <!-- 卡片信息不完整提示 -->
    <div class="qwui-incomplete_wrap" v-if="cardCompleteFlag">
      <div class="qwui-card_incomplete">
        <img class="qwui-err_pic"
             src="~assets/images/crm/icon_btn_error.png"
             alt="">
        <p class="qwui-err_text">完整的企业产品和官网信息，有助于获得更多的客户和商机，联系管理员在后台完善</p>
      </div>
    </div>
    <!-- 分享按钮 -->
    <div class="share" :style="{'margin-top':cardCompleteFlag?'0':'40px'}">
      <div class="share-item"
           @click="saveImg">
        <div class="icon share-wechat">
          <div class="qwui-wxshare_tip"
               v-if="shareWxTip">
            <p class="qwui-wxshare_tip_text">分享名片到微信，触达海量客户</p>
          </div>
        </div>
        <div class="text">递名片</div>
      </div>
      <div class="share-item"
           @click="editCardLink">
        <div class="icon share-card"></div>
        <div class="text">编辑名片</div>
      </div>
    </div>
    <!-- 查看名片引导 -->
    <div class="qwui-card_tip">
      <img class="qwui-card_tip_pic"
           src="~assets/images/crm/icon_btn_cardtips.png"
           alt="">
      <span class="qwui-card_tip_text"
            @click="switchLeadCard">关于名片</span>
    </div>
    <!-- 名片首次使用引导 -->
    <div class="qwui-lead_mask"
         v-if="useCardFlag">
      <div class="qwui-mask_bg"></div>
      <div class="qwui-lead_wrap">
        <swiper :options="swiperOption"
                style="height:95%">
          <swiper-slide v-for="(item,ind) in guideTips"
                        :key="ind"
                        style="position: relative">
            <div class="qwui-lead_step">
              <img class="qwui-step_img"
                   :src="item.pic"
                   alt="">
              <div class="qwui-step_fixed">
                <p class="qwui-step_name">{{item.title}}</p>
                <p class="qwui-step_content">{{item.content}}</p>
              </div>
              <button v-if="(ind+1) === guideTips.length"
                      class="qwui-lead_btn"
                      @click.stop="switchLeadCard">立即使用</button>
            </div>
          </swiper-slide>
          <div class="swiper-pagination qwui-dots"
               slot="pagination"></div>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { images_upload } from '@/utils/uploadImages.js';
import html2canvas from 'html2canvas';
import card from './components/card';
import { getCard } from '../../../api/smallProgram/getBata.js';
import wx from 'weixin-js-sdk';
import { setTimeout } from 'timers';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import ImageTag from './components/ImageTag';

//存储用户是否首次进入我的名片
const useCardRecord = 'useCardRecord';

export default {
  data() {
    return {
      cardList: {}, //名片数据
      baseULR: '', //截图img的src
      showCardImg: false, //浮层截屏图片隐藏
      canvasFlag: true, //是否首次截屏
      useCardFlag: false, //是否首次进入我的名片
      guideTips: [
        //我的名片首次使用引导数据
        {
          pic: require('assets/images/crm/bg_sy1.png'),
          title: '智能名片',
          content: '集个人名片、企业产品、官网于一体的智能名片'
        },
        {
          pic: require('assets/images/crm/bg_sy2.png'),
          title: '递名片到微信',
          content: '转发名片到微信,　裂变式传播,　触达海量客户'
        },
        {
          pic: require('assets/images/crm/bg_sy3.png'),
          title: '名片雷达',
          content: '智能数据分析实时了解客户互动行为及喜好'
        },
        {
          pic: require('assets/images/crm/bg_sy4.png'),
          title: '在线聊天',
          content: '不用加好友,　也可跟客户一对一沟通,　及时跟进'
        }
      ],
      cardCompleteFlag: false, //名片信息是否完整
      shareWxTip: false,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        }
      },
      isFixed: false,//形象标签编辑添加时,窗口固定开关
      tagList: []//形象标签数组
    };
  },
  components: {
    card,
    swiper,
    swiperSlide,
    ImageTag
  },
  created() {
    this.getCardData();
    this.firstUse();
    this.companyCorpId = wxqyhConfig.orgConfigInfo.corpId;
  },
  computed: {
    //跨域图片转同域
    wxappQrcodePath() {
      if (this.cardList.wxappQrcodePath) {
        const wxappQrcodePath =
          _.baseURL +
          '/portal/errcode/errcodeAction!loadImage.action?imgUrl=' +
          _.filterCompressURL(this.cardList.wxappQrcodePath);
        return wxappQrcodePath;
      }
    }
  },
  methods: {
    //获取我的名片数据
    getCardData() {
      getCard(res => {
        this.cardList = Object.assign({}, this.cardList, res.card);
        //获取形象标签
        this.tagList = this.cardList.labelList;
        //如果名片信息不全,则显示提示语
        if (!res.hasHomeBuild || !res.hasProduct) {
          this.cardCompleteFlag = true;
        }
        let formalAdress = _.baseHttpURL + '/vp/module/crm.html#/open?sellerId=' + this.cardList.sellerId + '&corp_id=' + this.companyCorpId;
          _.checkApi.setDataForWeixinValue(
            '企微云小站',
            _.filterCompressURL(this.cardList.avatarPicPath),
            '你好，我是' + this.cardList.companyName + '的' + this.cardList.personName + '，这是我的名片，请惠存',
            formalAdress
          );
        //分享到微信
        // wx.onMenuShareAppMessage({
        //   title: '企微云小站', // 分享标题
        //   desc:
        //     '你好，我是' +
        //     this.cardList.companyName +
        //     '的' +
        //     this.cardList.personName +
        //     '，这是我的名片，请惠存', // 分享描述
        //   link: formalAdress, // 分享链接
        //   imgUrl: _.filterCompressURL(this.cardList.avatarPicPath), // 分享图标
        //   success: function() {
        //     // 用户确认分享后执行的回调函数
        //   },
        //   cancel: function() {
        //     // 用户取消分享后执行的回调函数
        //   }
        // });
        //分享到朋友圈
        // wx.onMenuShareTimeline({
        //   title: '企微云小站', // 分享标题
        //   link: formalAdress, // 分享链接
        //   imgUrl: _.filterCompressURL(this.cardList.avatarPicPath), // 分享图标
        //   success: function() {
        //     // 用户确认分享后执行的回调函数
        //     if (self.dataForWeixin.successCallback) {
        //       self.dataForWeixin.successCallback();
        //     }
        //   },
        //   cancel: function() {
        //     // 用户取消分享后执行的回调函数
        //     if (self.dataForWeixin.cancelCallback) {
        //       self.dataForWeixin.cancelCallback();
        //     }
        //   }
        // });
        //如果是从无动态营销按钮进入名片页面,则自动点击生成按钮
        if (this.$route.params.buildCard) {
          this.saveImg();
        }
      });
    },
    //点击编辑名片页面
    editCardLink() {
      this.$router.replace({ path: '/editCard' });
    },
    //生成分享朋友圈图片
    saveImg() {
      if (this.canvasFlag) {
        // 第一次生成图片，必须把滚动拉到顶端
        window.scroll(0, 0);
        this.capture('#capture', () => {
          this.canvasFlag = false;
          this.cardImg();
        });
      } else {
        this.cardImg();
      }
    },
    //点击关闭图片截图
    cardImg() {
      this.showCardImg = !this.showCardImg;
    },
    // 根据window.devicePixelRatio获取像素比
    DPR() {
      if (window.devicePixelRatio && window.devicePixelRatio > 1) {
        return window.devicePixelRatio;
      }
      return 1;
    },
    //点击截图
    capture(selector, callBack) {
      _.showLoading('');
      // 获取想要转换的 DOM 节点
      const dom = document.querySelector(selector);
      const domCSS = window.getComputedStyle(dom);
      // DOM 节点计算后宽高
      const width = parseInt(domCSS.width);
      const height = parseInt(domCSS.height);
      // 获取像素比
      const scaleBy = this.DPR();
      const canvas = document.createElement('canvas');
      // 设定 canvas 元素属性宽高为 DOM 节点宽高 * 像素比
      canvas.width = width * scaleBy;
      canvas.height = height * scaleBy;
      // 设定 canvas css宽高为 DOM 节点宽高
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      //改变img图片大小
      const imgcapture = document.querySelector('#imgcapture');
      imgcapture.width = width;
      imgcapture.height = height;
      // 获取画笔
      const context = canvas.getContext('2d');
      //绘制前填充白色背景
      context.fillStyle = "#fff";
      context.fillRect(0,0,canvas.width,canvas.height);
      // 将所有绘制内容放大像素比倍
      context.scale(scaleBy, scaleBy);
      const opts = {
        scale: scaleBy,
        canvas: canvas,
        width: width,
        height: height,
        useCORS: true // 【重要】开启跨域配置
      };
      html2canvas(dom, opts).then(canvas => {
        const context = canvas.getContext('2d');
        // document.body.appendChild(canvas)
        this.baseULR = canvas.toDataURL();
        _.hideLoading('');
        callBack();
      });
    },
    //解决IOS长按图片出现放大镜
    stopMagnifier(e) {
      let eve = e || window.event;
      if (_.isIOS()) {
        eve.preventDefault();
      }
    },
    //关闭生成名片提示语
    closeShareTip() {
      this.shareWxTip = false;
    },
    //控制名片引导显示
    switchLeadCard() {
      this.useCardFlag = !this.useCardFlag;
    },
    //记录用户是否首次使用我的名片
    firstUse() {
      //判断浏览器是否有保存这个key值,如果有则说明不是第一次访问,否则打开提示框
      if (!localStorage.getItem(useCardRecord)) {
        this.useCardFlag = true;
        this.shareWxTip = true;
        localStorage.setItem(useCardRecord, 'visited');
      } else {
        this.useCardFlag = false;
      }
    },
    //切换窗口是否固定
    resetHeight(res){
      this.isFixed = res;
    },
    //删除形象标签
    handleTag(index){
      this.tagList.splice(index,1);
    },
    reLoadTag(){
      getCard((res) => {
        //获取形象标签
        this.tagList = res.card.labelList;
      })
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../../crmBase.scss';
.qwui-wrap {
  background-color: #f7f8fa;
}
.img-content {
  margin: rem(20) rem(14) 0;
  .qwui-capture {
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 rem(2) rem(6) 0 rgba(220, 221, 224, 0.5);
    background-color: #fff;
  }
  .border {
    width: 100%;
    border: 1px dashed #e4e7ed;
  }
  .qwui-dashed {
    width: 100%;
  }
  .barcode-content {
    padding: rem(16) 0 rem(15);
    text-align: center;
    background: rgba(255, 255, 255, 1);
    border-radius: rem(4);
    -webkit-touch-callout: none;
    user-select: none;
    .barcode {
      width: rem(120);
      height: rem(120);
      margin-bottom: rem(14);
      -webkit-touch-callout: none;
      user-select: none;
      margin: 0 auto;
      border: 0;
    }
    .tip {
      @include content-item(20, 20, #7a7c80, 14);
      margin-top: 13px;
    }
  }
}
// 弹窗动画
.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
/* 模糊弹窗 */
.mask-img {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background-color: rgb(51, 51, 51);
  z-index: 10;
  .mask-main {
    position: absolute;
    top: 20px;
    left: rem(15);
    right: rem(15);
    margin: 0 auto;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
  .tips {
    position: absolute;
    bottom: 115px;
    width: 100%;
    @include content-item(20, 20, #fff, 14);
    .icon-top {
      display: inline-block;
      width: 13px;
      height: 13px;
      background: url('../../../../../assets/images/crm/icon-top.png');
      background-size: 100%;
    }
  }
  .mask-close {
    position: absolute;
    bottom: rem(20);
    left: 50%;
    i {
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
.qwui-incomplete_wrap {
  height: 40px;
  margin-bottom: 10px;
  .qwui-card_incomplete {
    display: flex;
    align-items: center;
    padding: 0 14px;
    box-sizing: border-box;
    .qwui-err_pic {
      width: 18px;
      height: 18px;
    }
    .qwui-err_text {
      font-size: 14px;
      color: #ff586d;
      flex: 1;
      margin-left: 14px;
    }
  }
}
.share {
  display: flex;
  margin-bottom: 20px;
  .share-item {
    flex: 1;
    text-align: center;
    color: #7a7c80;
    font-size: rem(13);
    position: relative;
    .icon {
      width: rem(32);
      height: rem(32);
      margin: 0 auto;
      background: url('../../../../../assets/images/crm/crm_share.png') center
        no-repeat;
      background-size: 300%;
      &.share-card {
        background-position: 0 0;
        position: relative;
      }
      &.share-friends {
        background-position: rem(-64) 0;
        position: relative;
      }
      &.share-wechat {
        background-position: rem(-32) 0;
        position: relative;
      }
    }
    .text {
      height: rem(18);
      line-height: rem(18);
      margin-top: rem(12);
    }
  }
  .qwui-wxshare_tip {
    position: absolute;
    width: 142px;
    height: 62px;
    top: -64px;
    left: -8px;
    background: url('../../../../../assets/images/crm/bg_tck.png') no-repeat;
    background-size: contain;
    opacity: 1;
    .qwui-wxshare_tip_text {
      padding: 8px 10px;
      text-align: left;
      color: #fff;
    }
  }
}
.qwui-card_tip {
  display: flex;
  // position: absolute;
  // width: 100%;
  // left: 0;
  // bottom: 0;
  margin: 21px 0 40px 0;
  justify-content: center;
  align-items: center;
  .qwui-card_tip_pic {
    width: 14px;
    height: 14px;
  }
  .qwui-card_tip_text {
    font-size: 14px;
    color: #7a7c80;
    font-weight: 400;
    margin-left: 6px;
  }
}
.qwui-lead_mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 11;
  .qwui-mask_bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 137px;
    background-image: url('../../../../../assets/images/crm/img_a-mainpage_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 137px;
  }
  .qwui-lead_wrap {
    height: 100%;
    box-sizing: border-box;
    padding-top: 50px;
    background-color: #fff;
  }
  .qwui-lead_step {
    text-align: center;
    .qwui-step_img {
      width: 365px;
    }
    .qwui-step_fixed {
      position: absolute;
      width: 100%;
      bottom: 103px;
    }
    .qwui-step_name {
      font-size: 24px;
      color: #0a1735;
    }
    .qwui-step_content {
      font-size: 15px;
      color: #7a7c80;
      margin-top: 6px;
    }
    .qwui-lead_btn {
      position: absolute;
      bottom: 53px;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 164px;
      height: 40px;
      border: none;
      border-radius: 20px;
      background: linear-gradient(
        90deg,
        rgba(142, 187, 249, 1),
        rgba(85, 133, 240, 1)
      );
      font-size: 15px;
      color: #fff;
      line-height: 40px;
    }
  }
  .qwui-dots /deep/ .swiper-pagination-bullet {
    background-color: #eceef0;
    opacity: 1;
  }
  .qwui-dots /deep/ .swiper-pagination-bullet-active {
    background-color: #cbcdd0;
  }
}

//解决名片操作按钮,关于名片,企业信息缺失提示语,名片引导图在小屏幕手机样式兼容
@media screen and (max-height: 610px) {
  .qwui-lead_mask {
    .qwui-lead_step {
      .qwui-step_img {
        width: 320px;
      }
      .qwui-step_fixed {
        bottom: 80px;
        .qwui-step_name {
          font-size: 20px;
        }
        .qwui-step_content {
          font-size: 13px;
        }
      }
      .qwui-lead_btn {
        bottom: 34px;
      }
    }
  }
}
//解决生成分享图提示语,小屏幕手机样式兼容
@media screen and (max-height: 585px) {
  .mask-img .tips {
    bottom: 100px;
  }
}
// //解决引导图超过一定宽度居中问题
@media screen and (min-width: 1024px) {
  .qwui-lead_mask {
    width: 740px;
  }
}
//解决生成分享图提示语,小屏幕手机样式兼容
@media screen and (max-width: 320px) {
  .mask-img .tips {
    font-size: 12px;
  }
  .qwui-lead_mask {
    .qwui-lead_step {
      .qwui-step_img {
        width: 320px;
      }
      .qwui-step_fixed {
        .qwui-step_name {
          font-size: 20px;
        }
        .qwui-step_content {
          font-size: 13px;
        }
      }
    }
  }
}
 //解决名片引导图,大屏幕手机样式兼容
@media screen and (min-height: 680px) {
  .qwui-lead_mask {
    .qwui-lead_step {
      .qwui-step_fixed {
        bottom: 32%;
      }
      .qwui-lead_btn {
        bottom: 20%;
      }
    }
  }
}
</style>
