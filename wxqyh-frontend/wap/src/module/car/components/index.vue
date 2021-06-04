<template>
  <div class="wrap">
    <router-view></router-view>
    <!--底部菜单-->
    <footer>
      <footer_nav :footernavdata="footerList"></footer_nav>
    </footer>
  </div>
</template>

<script>
  import footer_nav from '@/components/home/footer_nav';
  import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue'
  import { initCount } from '../api/getData'

  export default {
    name: 'index',
    data(){
      return {
        headData: dataBase.car.headData,
        footerList: dataBase.car.footerList
      }
    },
    components: {
      footer_nav
    },
    mounted(){
      //初始化tab函数
      var _this = this;
      dataBase.car.footerList.nav[0].callBack = function(){
        _this.$router.push({'name':'travel'});
      }
      dataBase.car.footerList.nav[1].callBack = function(){
        _this.$router.push({'name':'audit'})
      }
      dataBase.car.footerList.nav[2].callBack = function(){
        _this.$router.push({'name':'status'})
      }
      dataBase.car.footerList.nav[3].callBack = function(){
        _this.$router.push({'name':'relate'})
      }
      this.initCount()
    },
    methods:{
      initCount() {  //待办数量
        initCount().then((res) => {
          if (res.code == "0") {
            dataBase.car.footerList.nav[1].num = res.data.waitingTaskNum || 0
          } else {
            _.alert('提示', res.desc)
          }
        })
      }
    }
  }

</script>

<style>
  .wrap {
    height: 100%;
  }
  .qwui-tabbar-span  .qwui-ic_reimindex {
    background: url(~assets/images/car/car_tab_logo.png) center no-repeat;
    background-size: 108px 162px;
  }
  .qwui-tabbar-item .qwui-tabbar-span .ic_tabar1{
    background-position: 0 -108px;
  }
  .qwui-tabbar-item .qwui-tabbar-span .ic_tabar2{
    background-position: -27px -108px;
  }
  .qwui-tabbar-item .qwui-tabbar-span .ic_tabar3{
    background-position: -54px -108px;
  }
  .qwui-tabbar-item .qwui-tabbar-span .ic_tabar4{
    background-position: -81px -108px;
  }
  .qwui-bar-item_on .qwui-tabbar-span .ic_tabar1{
    background-position: 0 -135px;
  }
  .qwui-bar-item_on .qwui-tabbar-span .ic_tabar2{
    background-position: -27px -135px;
  }
  .qwui-bar-item_on .qwui-tabbar-span .ic_tabar3{
    background-position: -54px -135px;
  }
  .qwui-bar-item_on .qwui-tabbar-span .ic_tabar4{
    background-position: -81px -135px;
  }
</style>
