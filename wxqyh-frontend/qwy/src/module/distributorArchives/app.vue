<template>
  <div id="app"
    class="qw-app">
    <div v-if="dataBase.config"
      class="qw-app-main">
      <qwy-header :pswPath="pswPath"
        tabName="archives"></qwy-header>
      <div class="main_wrap">
        <div class="container">
          <!-- <qwSidebar :sidebarList="sidebarList"
            @goDetail="goDetail"></qwSidebar> -->
          <!-- <div class="right_side"> -->
          <qw-vip-dialog></qw-vip-dialog>
          <router-view></router-view>
          <!-- </div> -->
        </div>
      </div>
      <show-box v-if="showQRCode"
        @closeBox="closeBox">
        <qr-code></qr-code>
      </show-box>
      <consult v-if="showQw"></consult>
      <div class="bged pt25">
        <qwFooter></qwFooter>
      </div>
    </div>
    <msg-boxs></msg-boxs>
    <top-alert></top-alert>
  </div>
</template>

<script>
import qwyHeader from '@/components/list/qwyHeader'
import msgBoxs from '@/components/base/msgBoxs'
import showbox from '@/components/list/showbox'
import qrCode from '@/components/list/qrCode'
import consult from '@/components/list/consult'
import topAlert from '@/components/base/topAlert'
import qwFooter from '@/components/base/footer'
import qwSidebar from '@/components/Sidebar/QwSidebar'
import qwVipDialog from '@/components/vip-dialog'
import { mapActions, mapGetters } from 'vuex'
// import { ajaxSearchMenuList } from './api/getData'
import axios from 'axios'

export default {
  name: 'app',
  created: function() {
    let { config } = this.dataBase
    //如果是非渠道，显示咨询悬浮
    if (config.is_qiweiyun && this.showQw()) {
      this.showQw = true
    }

    this.dataBase.vipHref =
      _.baseURL +
      '/qiweipublicity/companysrv/vip/vip_gold_index.jsp?utm_source=pc&utm_medium=nav'
  },
  data() {
    return {
      dataBase: dataBase,
      pswPath: '/changePsw',
      sidebarList: [],
      agentCodeObj: {
        dynamic: 'newsMain',
        task: 'taskList',
        diary: 'diary',
        meetingassistant: 'meet',
        productinfo: 'product',
        express: 'express',
        topic: 'topic'
      }
    }
  },
  watch: {
    $route(to, from) {
      let fullPath = to.fullPath
      this.sidebarList.forEach((item, index) => {
        item.isActive = false
        if (fullPath.includes(this.agentCodeObj[item.agentCode])) {
          item.isActive = true
          dataBase.agentCode = item.agentCode
        }
      })
    }
  },
  mounted() {
    let self = this
    let fullPath = document.location.href
    //获取协同菜单列表
    let coopSsoCount = 0
  },
  computed: {
    ...mapGetters('header', ['showQRCode', 'trustApp'])
  },
  methods: {
    ...mapActions('header', ['setShowQRCode']),

    // 关闭二维码弹窗
    closeBox() {
      this.setShowQRCode(false)
      document.body.style.overflow = '' // 解除黑幕状态下不能滚动的状态
    },

    // 是否渠道
    isQuDao() {
      let { config } = this.dataBase
      if (
        config.orgConfigInfo &&
        config.orgConfigInfo.isCooperation &&
        config.orgConfigInfo.type == '1'
      ) {
        return true
      }
      return false
    },

    // 是否显示企微信息
    showQw() {
      let { config } = this.dataBase
      if (!this.isQuDao()) {
        return true
      }
      if (config.orgConfigInfo.isShowQw == '0') {
        return false
      }
      return true
    },

    // 跳转页面
    goDetail(item) {
      let self = this
      let baseURL = _.baseURL
      if (item.menuType == '3') {
        //单点登录
        this.goCoopSSOLogin(item.id)
        return
      }
      dataBase.agentCode = item.agentCode
      let pathObj = {
        task: '/vm/module/channelHome.html#/channelHome'
      }
      let url = pathObj[item.agentCode] || item.menuUrl
      if (!(url === item.menuUrl)) {
        window.location.href = `${baseURL}` + url
        return
      }
      window.sessionStorage.setItem('agentCode', dataBase.agentCode)
      let isEdu = window.localStorage.getItem('isEdu')
      if (isEdu == '1') {
        //是教育版
        window.localStorage.removeItem('isEdu')
        window.location.href = `${baseURL}` + '/manager/veredu/main.jsp'
      } else {
        window.location.href = `${baseURL}` + '/manager/main.jsp'
      }
    },
    //跳转到单点页面
    goCoopSSOLogin(id) {
      let new_window = window.open()
      axios
        .post(
          _.baseURL + '/qwsecurity/qwsecurityMgrAction!qiweiCoopSSO.action',
          {
            id: id
          }
        )
        .then(function(result) {
          dataBase.loading = false
          if (result.code == '0') {
            new_window.location.href = result.data.loginUrl
          } else {
            _.alert('提示', result.desc)
          }
        })
    }
  },
  components: {
    'msg-boxs': msgBoxs,
    'qwy-header': qwyHeader,
    'show-box': showbox,
    'qr-code': qrCode,
    topAlert,
    consult,
    qwFooter,
    qwSidebar,
    qwVipDialog
  }
}
</script>

<style lang="scss" scoped>
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
    .main_wrap {
      padding-top: 25px;
      width: 100%;
      background: #f8f8f8;
      box-sizing: border-box;
      .container {
        // display: flex;
        margin: 0 auto;
        max-width: 1200px;
        min-height: 430px;
        // border: 1px solid #d9dadc;
        // background: #fbfbfb;
        .right_side {
          position: relative;
          padding: 10px 30px 0;
          width: 80%;
        }
      }
    }
    .bged {
      background: #ededed;
    }
    .pt25 {
      padding-top: 25px;
    }
  }
}
</style>
