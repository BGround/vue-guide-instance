<template>
  <div class="wrap" v-windowscroll="scrollFun">
    <router-view></router-view>
    <!--底部菜单-->
    <footer>
      <footer-nav :footernavdata="homeFooterList"></footer-nav>
    </footer>
    <dialog_mask_bottom :dialogConfig="dialogBottomConfig"></dialog_mask_bottom>
  </div>
</template>

<script>
import footer_nav from '@/components/home/footer_nav';
import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue'
import { initHead } from '../api/list'

export default {
  name: 'oldIndex',
  data(){
    return {
      headData:dataBase.home.headData,
      homeFooterList:dataBase.home.homeFooterList,
      dialogBottomConfig:dataBase.dialogBottomConfig,
      lock_roll:false,
      lastScrollTop:0

    }
  },
  components:{
    "footer-nav":footer_nav,
    'dialog_mask_bottom':dialog_mask_bottom,
  },
  mounted(){
    //初始化tab函数
    var _this = this;
    dataBase.home.homeFooterList.nav[0].callBack = function(){
      _this.$router.push({'name':'submited'});
    }
    dataBase.home.homeFooterList.nav[1].callBack = function(){
      _this.$router.push({'name':'audit'})
    }
    dataBase.home.homeFooterList.nav[2].callBack = function(){
      _this.$router.push({'name':'relate'})
    }
    dataBase.home.homeFooterList.nav[3].callBack = function(){
      _this.$router.push({'name':'open'})
    }
    this.initCount();
  },
  methods:{
    initCount() { // 初始化草稿，收藏，代办数量
      var sendData={
        queryOutRelevantNum:1, //是否查询相关外单数
        queryOutNum:1,         //是否查询外部单数
        queryDraftNum:1,       //是否查询草稿数
        queryCollectionNum:1,  //是否查询收藏数
        queryTodoNum:1,        //是否查询代办数
      }
      initHead(sendData).then((res) => {
        if (res.code != "0") {
          return _.alert('提示', res.desc)
        }
        if (res.data.draftNum || res.data.draftNum>-1) {//草稿单
          dataBase.home.headData.nav[1].num = res.data.draftNum;
        }
        if (res.data.collectionNum || res.data.collectionNum>-1) {//收藏单
          dataBase.home.headData.nav[2].num = res.data.collectionNum;
        }
        if (res.data.todoNum || res.data.todoNum>-1) {//待办
          dataBase.home.homeFooterList.nav[1].num = res.data.todoNum;
        }
        if(this.$route.path == '/'){
          if(res.data.todoNum && res.data.todoNum>0){
            this.goTOList(1,'audit');//有代办数据,跳转到待办列表
          }else {
            this.goTOList(0,'submited');//没有代办数据,默认跳转到提交列表
          }
        }
      });
    },
    goTOList(nav,listName){
      this.$router.push({'name':listName});
      dataBase.home.homeFooterList.nav_on = nav;
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
  }
}

</script>

<style>
  .wrap {
    height: 100%;
  }

</style>
