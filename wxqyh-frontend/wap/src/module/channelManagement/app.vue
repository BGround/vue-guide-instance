<template>
  <div id="app">
      <!-- v-if="dataBase.config" -->
    <router-view></router-view>
    <!--页面必须引入-加载过渡效果以及弹窗 start-->
    <loading v-if="dataBase.config"
             :show="dataBase.loading.show"
             :icon="dataBase.loading.icon"
             :text="dataBase.loading.text">
    </loading>
    <dialogMask v-if="dataBase.config"></dialogMask>
    <!--页面必须引入-加载过渡效果以及弹窗 end-->
  </div>
</template>
<script>

  import dialog_mask from '@/components/base/dialog_mask';//弹窗组件
  import loading from '@/components/base/loading';//加载中、操作成功提示组件（删除成功、提交成功）
  import wx from 'weixin-js-sdk';

  export default {
    name: 'app',
    data(){
      return {
        dataBase:dataBase,
      }
    },
    components:{
      dialogMask: dialog_mask,
      loading,
    },
    created(){
      this.$i18n.locale = "zh-CN";
    },
    mounted: function () {
      var self=this;
      window.addEventListener("popstate", function(e) {
          if(self.$route.path=="/"){
            if(_.isWeChatApp()||_.isQiyeweixinApp()){
              wx.closeWindow();
            }else{
              self.$router.replace({path:'/'});
            }
          }
          e.preventDefault();
        },false);
    },
    watch:{
    }
  }

</script>

<style>
  @import '../../assets/fonts/iconfont.css';
  @import './static/css/channelManagement.scss';
  @import '../../assets/css/style.css';
  html,body, #app{
    height: 100%;
  }
</style>
