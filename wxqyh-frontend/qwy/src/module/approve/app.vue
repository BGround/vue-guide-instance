<template>
  <div id="app" class="qw-app">
    <div v-if="dataBase.config" class="qw-app-main">
      <qwy-header :pswPath="pswPath" tabName="form_flow"></qwy-header>
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
</style>
