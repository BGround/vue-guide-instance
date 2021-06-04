<template>
  <div class="formDesignerSuccess">
    <div class="success-icon"></div>
    <p class="title">发布成功</p>
    <p class="text">登陆企微云管理后台，可使用子表单、表单关联、 分支流程等高级功能</p>
    <button-group>
      <qwui-button v-if="pcShow" class="url-copy" type="default" text="邀请填单" :data-clipboard-text="shareUrl"></qwui-button>
      <qwui-button v-if="!pcShow"  type="default" text="邀请填单" @buttonClick="share"></qwui-button>
      <qwui-button v-if="addFormShow" type="primary" text="立即填单" @buttonClick="addForm"></qwui-button>
    </button-group>
    <p class="returnHome" @click="returnHome">返回首页</p>
    <qw-share
      mainTitle="分享表单链接，邀请同事和朋友填写表单"
      :shareUrl="shareUrl"
      :shareConfig="shareConfig"
      :show.sync="qwShareShow"
    >
    </qw-share>
  </div>
</template>

<script>
  import ClipboardJS from 'clipboard'
  import { qwui_button, button_group } from "@/components/base/button";
  import QwShare from '@/components/Share'
  import {mapState} from 'vuex'
  import wx from 'weixin-js-sdk'

  export default {
    name: "formDesignerSuccess",
    props: {
      // 是否有填单权限
      addFormShow: {
        type: Boolean,
        default: true
      },
    },
    components: {
      qwuiButton: qwui_button,
      buttonGroup: button_group,
      QwShare,
    },
    data() {
      return {
        qwShareShow: false,
        pcShow: false,
      }
    },
    computed: {
      ...mapState({
        FormAjaxData: state=>state.formDesign.FormAjaxData,
      }),
      // 分享的填单的链接
      shareUrl() {
        return window.location.origin+ _.baseURL +'/vp/module/form.html'+ '?corp_id=' + window.wxqyhConfig.orgConfigInfo.corpId + '&agentCode=form'+'#/add?id=' + this.FormAjaxData.id
      },
      shareConfig() {
        return {
          title: this.FormAjaxData.tbFormDetailsPO.formName, // 分享标题
          desc: '['+_.personName+']分享了一条企业信息，点击查看', // 分享描述
          link: this.shareUrl, // 分享链接
          imgUrl: '', // 分享图标
        }
      }
    },
    methods: {
      returnHome() {
        this.$router.push('/')
      },
      addForm() {
        this.$router.push({ path: '/add', query: { id: this.FormAjaxData.id }})
      },
      share() {
        // 如果是个人网页版或微信段。点击为复制链接
        if(this.pcShow) {
          return
        }
        // 如果是企业微信，则弹出分享组件
        if(_.isQiyeweixin()) {
          this.qwShareShow = true
        }
      },
      // 初始化微信分享配置
      initShareMenu() {
        _.checkApi.setDataForWeixinValue(
          this.FormAjaxData.tbFormDetailsPO.formName,
          '',
          '['+_.personName+']分享了一条企业信息，点击查看',
          this.shareUrl,
          function success() {
            console.log('分享成功')
          }
        );
      }
    },
    created() {
      // 发布成功后，清除缓存
      localStorage.removeItem('formDesign'+_.userId)
      this.initShareMenu()
    },
    mounted() {
      // 如果是个人网页版或微信段。点击为复制链接
      this.$nextTick(()=>{
        if(!( _.isQiyeweixin()|| _.isHefeixin() || _.isWeChat()) || _.isWeChat()) {
          this.pcShow = true
          let clipboard = new ClipboardJS('.url-copy');
          clipboard.on('success', function(e) {
            _.tooltips_succeed('复制成功',true,'');
            e.clearSelection();
          });
        }
      })

    }
  }
</script>

<style lang="scss" scoped>
.formDesignerSuccess /deep/  .qwui-btn_tab {
    padding-right: 30px;
    padding-left: 30px;
  }
.formDesignerSuccess {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  padding: 72px 0 0;
  box-sizing: border-box;
  text-align: center;
  .success-icon {
    display: inline-block;
    width: 161px;
    height: 136px;
    background: url("~assets/svg/img_a-external_success.svg") no-repeat center center;
    background-size: contain;
  }
  .title {
    font-size: 16px;
    color: #0A1736;
    margin-top: 16px;
    margin-bottom: 8px;
  }
  .text {
    font-size: 14px;
    color: #B2B9C8;
    margin: 16px 25px 55px;
  }
  .returnHome {
    font-size: 14px;
    color: #5585F0;
    margin-top: 32px;
    cursor: pointer;
  }
}
@media screen and (min-width: 1024px) {
  .formDesignerSuccess {
    width: 740px;
    margin: 0 auto;
  }

}
</style>
