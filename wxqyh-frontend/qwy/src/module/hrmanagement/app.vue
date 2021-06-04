<template>
  <div id="app" class="qw-app">
    <div v-if="dataBase.config" class="qw-app-main">
      <qwy-header :pswPath="pswPath" tabName="hr"></qwy-header>
      <router-view></router-view>
      <show-box v-if="showQRCode" @closeBox="closeBox">
        <qr-code></qr-code>
      </show-box>
      <consult v-if="showQw"></consult>
    </div>
    <msg-boxs></msg-boxs>
    <top-alert></top-alert>
  </div>
</template>

<script>
import qwyHeader from "@/components/list/qwyHeader";
import msgBoxs from "@/components/base/msgBoxs";
import showbox from "@/components/list/showbox";
import qrCode from "@/components/list/qrCode";
import consult from "@/components/list/consult";
import topAlert from "@/components/base/topAlert";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "app",
  created: function() {
    let { config } = this.dataBase;

    //如果是非渠道，显示咨询悬浮
    if (config.is_qiweiyun && this.showQw()) {
      this.showQw = true;
    }
  },
  components: {
    "msg-boxs": msgBoxs,
    "qwy-header": qwyHeader,
    "show-box": showbox,
    "qr-code": qrCode,
    topAlert,
    consult
  },
  data() {
    return {
      dataBase: dataBase,
      pswPath: "/changePsw",
      isShowqw: false,
      assistantImg: require("assets/images/assistant.png")
    };
  },
  computed: {
    ...mapGetters("header", ["showQRCode"])
  },
  methods: {
    ...mapActions("header", ["setShowQRCode"]),
    // 关闭二维码弹窗
    closeBox() {
      this.setShowQRCode(false);
      document.body.style.overflow = ""; // 解除黑幕状态下不能滚动的状态
    },

    closeAssistant() {
      this.setshowAssistant(false);
      document.body.style.overflow = ""; // 解除黑幕状态下不能滚动的状态
    },

    // 关闭目标盒子
    closeGoalBox() {
      this.setshowGoalBox(false);
      document.body.style.overflow = ""; // 解除黑幕状态下不能滚动的状态
    },

    // 是否渠道
    isQuDao() {
      let { config } = this.dataBase;
      if (
        config.orgConfigInfo &&
        config.orgConfigInfo.isCooperation &&
        config.orgConfigInfo.type == "1"
      ) {
        return true;
      }
      return false;
    },

    // 是否显示企微信息
    showQw() {
      let { config } = this.dataBase;
      if (!this.isQuDao()) {
        return true;
      }
      if (config.orgConfigInfo.isShowQw == "0") {
        return false;
      }
      return true;
    }
  }
};
</script>

<style>
@import "../../assets/css/style.css";
@import "../../assets/fonts/iconfont.css";
.showBox_wrap {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3);
}
.box_container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.icon_close {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
<style lang="scss">
@import "./style/base.scss";
html,
body,
.qw-app {
  width: 100%;
  height: 100%;
  .qw-app-main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
