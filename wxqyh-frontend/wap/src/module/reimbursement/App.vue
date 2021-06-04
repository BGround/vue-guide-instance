<template>
  <div id="app" class="adapt_iphonex">
    <router-view v-if="dataBase.config" v-show="dataBase.isShow"></router-view>
    <!--页面必须引入-加载过渡效果以及弹窗 start-->
    <loading v-if="dataBase.config"
             :show="dataBase.loading.show"
             :icon="dataBase.loading.icon"
             :text="dataBase.loading.text">
    </loading>
    <dialog_mask v-if="dataBase.config"></dialog_mask>
    <!--页面必须引入-加载过渡效果以及弹窗 end-->

    <!-- 底部弹出层 -->
    <dialog-mask-bottom :dialogConfig="dataBase.dialogBottomConfig"></dialog-mask-bottom>
  </div>
</template>
<script>
  //弹窗组件
  import dialog_mask from '@/components/base/dialog_mask';
  //加载中、操作成功提示组件（删除成功、提交成功）
  import loading from '@/components/base/loading';
  import DialogMaskBottom from '@/components/base/dialog_mask_bottom';
  import { isBlackCorpId } from './api/common';
  import wx from 'weixin-js-sdk';
  import { mapGetters } from 'vuex';

  export default {
    name: 'app',
    data() {
      return {
        dataBase: dataBase,
      };
    },
    computed: {
      ...mapGetters([
        'isScrollLock',
      ]),
    },
    watch: {
      isScrollLock(flag) {
        if (flag) {
          document.body.style.overflow = 'hidden';
          document.body.style.height = '100%';
        } else {
          document.body.style.overflow = '';
          document.body.style.height = '';
        }
      }
    },
    created(){
      this.init();
    },
    beforeDestroy () { // 组件销毁前刪除高级搜索条件
      sessionStorage.removeItem('newReimbursement');
      sessionStorage.removeItem('newRelated');
      sessionStorage.removeItem('debitList');
    },
    mounted: function () {
      var self = this;
      window.addEventListener("popstate", function (e) {
        if (self.$route.path == "/") {
          if (_.isWeChatApp() || _.isQiyeweixinApp()) {
            wx.closeWindow();
          } else {
            self.$router.replace({
              path: '/'
            });
          }
        }
        if (self.$route.path == "/draft") {
          self.$router.push({
            path: '/'
          });
        }
        e.preventDefault();
      }, false);
    },
    components: {
      dialog_mask,
      DialogMaskBottom,
      loading,
    },
    methods: {
      init() {
        wxqyhConfig.ready(function() {
          let corpId = wxqyhConfig.orgConfigInfo.corpId;

          isBlackCorpId({
            agentCode: 'reimbursement',
            agentFunction: 'black_vue',
            corpId,
          }).then(res => {
            if (res.data.isBlackCorpId) {
              window.location.href =  `${_.baseURL}/jsp/wap/reimbursement/reimbursement_index.jsp?type=1&status=1&agentCode=reimbursement&abc=1`;
            }
          });
        })
      }
    }
  };

</script>

<style lang="scss" scoped>
@import '~assets/css/style.css';
@import './styles/reimbursement.css';

</style>
