<template>
  <div id="app" class="adapt_iphonex">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive&&dataBase.config"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive&&dataBase.config"></router-view>
    <!--页面必须引入-加载过渡效果以及弹窗 start-->
    <loading v-if="dataBase.config"
             :show="dataBase.loading.show"
             :icon="dataBase.loading.icon"
             :text="dataBase.loading.text">
    </loading>
    <dialog_mask v-if="dataBase.config"></dialog_mask>
    <!--页面必须引入-加载过渡效果以及弹窗 end-->
  </div>
</template>
<script>
  import dialog_mask from '@/components/base/dialog_mask';//弹窗组件
  import loading from '@/components/base/loading';//加载中、操作成功提示组件（删除成功、提交成功）
  export default {
    name: 'app',
    data(){
      return {
        dataBase:dataBase,
      }
    },
    created(){
      this.$i18n.locale = "zh-CN";
    },
    mounted: function () {
      var self=this;
      window.addEventListener("popstate", function(e) {
        if(self.$route.path=="/"){
          if(_.isWeChatApp()||_.isQiyeweixinApp()){
            self.$router.push({path:'/'});
            wx.closeWindow();
          }else{
            self.$router.push({path:'/'});
          }
        }
        e.preventDefault();
      },false);
    },
    components:{
      dialog_mask,
      loading,
    }
  }

</script>

<style>
  @import '../../assets/css/style.css';
  .qwui-watermark {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    pointer-events: none;
  }
</style>
