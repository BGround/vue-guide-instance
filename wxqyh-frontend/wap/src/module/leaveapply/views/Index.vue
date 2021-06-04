<template>
  <div class="wrap leave-wrap">
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <!-- <guide v-if="showGuide" @gotIt="gotIt"></guide> -->
    <footer class="qwui-nav_box_fixed">
      <footer-nav :footernavdata="homeFooterList"></footer-nav>
      <div class="float-btn">
        <add-btn :nav="nav"></add-btn>
      </div>
    </footer>
    <dialog-mask-bottom :dialogConfig="dialogBottomConfig"></dialog-mask-bottom>
  </div>
</template>

<script>
import FooterNav from "@/components/home/footer_nav";
import DialogMaskBottom from "@/components/base/dialog_mask_bottom.vue";
import AddBtn from "../components/AddBtn";
import Guide from "../components/Guide";
import { initHead, initGuide, changeGuideStatus } from "../api/getData";
import { mixinPage } from "../mixin.js";
export default {
  mixins: [mixinPage],
  data() {
    return {
      nav: dataBase.home.nav,
      homeFooterList: dataBase.home.homeFooterList,
      dialogBottomConfig: dataBase.dialogBottomConfig,
      showGuide: false
    };
  },
  components: {
    FooterNav,
    DialogMaskBottom,
    AddBtn,
    Guide
  },
  mounted() {
    initGuide().then(res => {
      if(res.code == 0) {
        if(!res.data.noviceType.includes('1')) this.showGuide = true;
        else this.showGuide = false;
      }else {
        _.alert('提示:', res.desc)
      }
    })
    //初始化tab函数
    var _this = this;
    dataBase.home.homeFooterList.nav[0].callBack = function(){
      _this.$router.push({'name':'apply'});
    }
    dataBase.home.homeFooterList.nav[1].callBack = function(){
      _this.$router.push({'name':'review'})
    }
    dataBase.home.homeFooterList.nav[2].callBack = function(){
      _this.$router.push({'name':'related'})
    }
    initHead();
  },
  methods: {
    gotIt() {
      //关闭向导页
      changeGuideStatus('1').then(res => {
        if(res.code == 0) {
          this.showGuide = false;
        }else {
          _.alert('提示：', res.desc);
        }
      })
    },
    // 获取高度
    // getHeight () {
    //   let windowHeight = document.documentElement.clientHeight;
    //   document.querySelector(".leave-wrap").style.height = windowHeight+'px';
    // },
  },
  // beforeDestroy () {
  //   window.removeEventListener('resize', this.getHeight);
  // },
};
</script>
<style lang="scss" scoped>
.leave-wrap /deep/ .qwui-badge {
  background-color: #FF586D;
}
.wrap {
  height: 100%;
  margin-bottom: 50px;
  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin: 0 auto;
    z-index: 10;
    .float-btn {
      position: absolute;
      width: 56px;
      right: 15px;
      bottom: 79px;
      z-index: 10;
    }
  }
}
.leave-wrap /deep/ .qwui-tabbar-label {
  line-height: 10px;
  margin-top: 4px;
}
.leave-wrap /deep/ .qwui-tabbar-item {
  padding: 7px 0 6px 0;
}
.leave-wrap /deep/ .qwui-ic_reimindex {
  width: 21px;
  height: 22px;
}
.leave-wrap /deep/ .qwui-tabbar-item .icon_tabar1{
  background: url(../asset/img/icon_tabar1.png) center no-repeat;
  background-size: 100%;
}
.leave-wrap /deep/ .qwui-tabbar-item .icon_tabar2 {
  background: url(../asset/img/icon_tabar2.png) center no-repeat;
  background-size: 100%;
}
.leave-wrap /deep/ .qwui-tabbar-item .icon_tabar3 {
  background: url(../asset/img/icon_tabar3.png) center no-repeat;
  background-size: 100%;
}
.leave-wrap /deep/ .qwui-bar-item_on .icon_tabar1 {
  background: url(../asset/img/icon_tabar1_active.png) center no-repeat;
  background-size: 100%;
}
.leave-wrap /deep/ .qwui-bar-item_on .icon_tabar2 {
  background: url(../asset/img/icon_tabar2_active.png) center no-repeat;
  background-size: 100%;
}
.leave-wrap /deep/ .qwui-bar-item_on .icon_tabar3 {
  background: url(../asset/img/icon_tabar3_active.png) center no-repeat;
  background-size: 100%;
}
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .wrap footer .float-btn{
    bottom: 123px
  }
}
</style>
