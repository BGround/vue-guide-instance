<template>
  <div id="app">
    <keep-alive :include="cacheArray">
      <router-view v-if="dataBase.config"></router-view>
    </keep-alive>

    <!--页面必须引入-加载过渡效果以及弹窗 start-->
    <loading
      v-if="dataBase.config"
      :show="dataBase.loading.show"
      :icon="dataBase.loading.icon"
      :text="dataBase.loading.text"
    ></loading>
    <dialog_mask v-if="dataBase.config"></dialog_mask>
    <!--页面必须引入-加载过渡效果以及弹窗 end-->
  </div>
</template>
<script>
  import dialog_mask from '@/components/base/dialog_mask';//弹窗组件
  import loading from '@/components/base/loading';//加载中、操作成功提示组件（删除成功、提交成功）
  import { mapGetters } from 'vuex';

  export default {
    name: 'app',
    data(){
      return {
        dataBase:dataBase,
      }
    },
    computed: {
      ...mapGetters('list',[
        'cacheArray'
      ])
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
        if(self.$route.path=="/draft"){
          self.$router.push({path:'/'});
        }
        e.preventDefault();
      },false);

      //解决IOS12并且微信版本6.7.4页面,键盘弹出bug
      if(_.isIOS()){
        window.addEventListener('focusout', function () {
  　　    //软键盘收起的事件处理
          setTimeout(()=>{
            window.scrollTo(0 ,document.documentElement.scrollTop || document.body.scrollTop); 
          })
        });
      }
    },
    components:{
      dialog_mask,
      loading,
    }
  }

</script>

<style lang="scss">
  @import '../../assets/fonts/iconfont.css';
  @import '../../assets/css/style.css';
  @import './style/common.scss';
  @import '~assets/fonts/crm/iconfont.css';
  @import './style/variable.scss';

  html,body,#app{
    width: 100%;
    height: 100%;
  }
  #app{
    max-width: $pageMaxWidth;
    margin: 0 auto;
    position: relative;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  @media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3){
    .has-bottombar{
      background: #fff;
    }
  }
  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3){
    .has-bottombar{
      background: #fff;
    }
  }
</style>
