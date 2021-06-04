<template>
  <div
    class="travel"
    v-windowscroll="scrollFun"
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
    infinite-scroll-immediate-check="false">
    <header>
      <home-head-nav
        :headrdata="headData"
        :footer-index="footerList.nav_on"></home-head-nav>
    </header>
    <car-use-list :list="list"></car-use-list>
    <load-more
      :busy="busy"
      :loading="loading"
      :showrecord="showrecord"
      @childevent="loadMore"
      :recordTitle="'暂无行程'"
      :recordIcon="'qwui-no_page_record'"
      :listCount="list.length"></load-more>
  </div>
</template>

<script>
  import homeHeadNav from '@/components/home/home_head_nav'
  import carUseList from '../carUseList/carUseList'
  import { initTravel, openDidi } from '../../api/getData'
  import { mixinTab } from '../../js/mixin'
  export default {
    name: 'travel',
    mixins: [mixinTab],
    components:{
      homeHeadNav,
      carUseList
    },
    data(){
      return {
        lock_roll: false,
        headData: dataBase.car.headData,
        footerList: dataBase.car.footerList,
        list:[],
        lastScrollTop: 0
      }
    },
    mounted(){
      this.initList()
      this.openDidi()
    },
    methods: {
      initList(isLoadMore) { // 初始化数据
        var _this = this
        if(!isLoadMore) {
          _.showLoading();
        }
        initTravel(this.setting).then((res) => {
          if(res.code == '0') {
            _this.setList(res, isLoadMore);
          }
        })
      },
      openDidi() {
        openDidi().then(res => {
          if (res.code == "0") {
            if(res.data.isOpen == 0) {
              this.headData.nav.splice(1, 1)
            } else {
              this.headData = dataBase.car.headData
            }
          }
        })
      },
      scrollFun:function(e){ //head滚动
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0 ;
        if(!this.lock_roll){
          if((scrollTop-this.lastScrollTop)>200){
            this.headData.show = false;//隐藏头部菜单
            this.lastScrollTop = scrollTop
          }
          if(this.lastScrollTop-scrollTop>10){
            this.headData.show = true;//显示头部菜单
            this.lastScrollTop = scrollTop
          }
        }
      }
    },
    destroyed() { //页面销毁时重置头部状态
      this.lock_roll = true;
      dataBase.car.headData.show = true;
    }
  }
</script>

<style>
  .qwui-home_head .qwui-nav_box .ic_ask{
    background: url(~assets/images/car/ic_car_ask.png) center no-repeat;
    background-size: 22px 16px;
  }
  .qwui-home_head .qwui-nav_box .ic_call{
    background: url(~assets/images/car/ic_car_call.png) center no-repeat;
    background-size: 22px 22px;
  }
</style>
