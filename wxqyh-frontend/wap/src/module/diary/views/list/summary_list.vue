<template>
  <div class="wrap" v-windowscroll="scrollFun">

    <!--主体-->
    <section class="main">

      <!--搜索框垫高块-->
      <div class="qwui-search_box_height"></div>

      <!--搜索框-->
      <div class="qwui-menu_tab_fixed active">
        <search_bar :searchinput="headData.searchBar" v-on:listenToSearchBox="showMsgFromSearchBar" ></search_bar>
      </div>

      <!--列表-->
      <diary-list :listdata="homeContentList" :loadmore="loadMore" :footernav="homePage" :useCheck="true" :ueditorCheck="ueditorCheck" @listenToDiaryList="chosenDiarys"></diary-list>

      <!--加载组件-->
      <load-more v-windowscroll="scrollLoadMore"
                 v-show="loadMore.padeConfig.totalRows>0"
                 :hasMore="loadMore.padeConfig.hasMore"
                 :loading="loading"
                 type="commentList"
                 @loadMoreClick="loadMoreClick">
        <span>{{$t('i18n.total')}}{{loadMore.padeConfig.totalRows}}{{$t('i18n.diaryTotal')}}</span>
      </load-more>

      <!--无记录-->
      <no-record v-show="showRecord" :setTop="true" :hasRecord="loadMore.hasRecord"></no-record>
    </section>

    <!--底部按钮垫高块-->
    <div class="qwui-footer_height" v-show="buttonShow"></div>

    <!--底部按钮-->
    <flow_button :buttondata="buttonConfig" v-show="buttonShow"></flow_button>

  </div>
</template>

<script>
  import search_bar from '@/components/base/search_box.vue';
  import diary_list from './diary_list';
  import loadMore from '@/components/list/load_more';
  import noRecord from '@/components/base/noRecord';
  import homePage from '../../js/homePage';
  import flow_button from '@/components/button/flow_button';
  import * as timeUtil from '@/assets/js/time-util';
  import {getMyDiaryList} from '../../api/getData.js';

  export default {
    name: 'index',
    data(){
      return {
        headData:homePage.home.headData,//头部和搜索框
        homeContentList:homePage.home.homeContentList,//数据列表
        loadMore:homePage.home.loadMore,//加载列表组件数据
        summaryData:dataBase.home.summaryData,//汇总数据
        lastScrollTop:0,
        lock_roll:false,//默认滚动
        buttonShow:false,//控制底部按钮是否显示
        buttonConfig:{ //操作按钮
          primaryList:[{type:"primary",name:'生成汇总',callBack:null}],
          defaultList:[{type:"default",name:'取消', callBack:null}],
          class:"active"//按钮是否置底部 active :底部、"":相对定位
        },
        ueditorCheck:!this.$route.query.isUeditor,
        homePage:0,
        loading:  false,  // 加载中
        list_lockRoll:false, // 列表滚动
      }
    },
    computed:{
      showRecord(){
        return this.loadMore.padeConfig.totalRows!=="" && this.loadMore.padeConfig.totalRows==0;
      },
    },
    created:function(){
      if(this.$route.query.status == 1){ //我提交的 列表
        this.homePage=0;
        this.loadMore.data ={
          status:1,
          typeId:'',
          type:1,
          keyWord:'',
          page:1,
          historyYear:'',
          pageSize:20,
        }
      }else{ //我负责的 列表
        this.homePage=1;
        this.loadMore.data ={
          status:3,
          typeId:'',
          type:2,
          keyWord:'',
          page:1,
          historyYear:'',
          pageSize:20,
        }
      }
      this.buttonConfig.primaryList[0].callBack = this.initSummary;
      this.buttonConfig.defaultList[0].callBack = this.backToAdd;
      //重置搜索框选项
      this.headData.searchBar.moreFunction.option = this.headData.searchOption;
      this.headData.searchBar.moreFunction.option[1].callback = this.showTimeInput;
      // 第一次请求列表数据
      this.clearLoadFun();
    },
    //路由跳转后，限制滚动
    beforeDestroy:function () {
      this.headData.show=true;
      this.lock_roll=true;
      this.list_lockRoll = true;
    },
    methods:{
      // 第一次请求列表清除初始化返回数据
      clearLoadFun(){
        // 当前页设为1
        this.loadMore.data.page=1;
        // 初始化返回数据
        this.loadMore.padeConfig = {
          hasMore: false,
          pageData: [],
          totalRows: ""
        }
        this.getList();
      },
      // 请求列表
      getList(){
        var self = this;
        self.loading = true;
        self.list_lockRoll = true;
        getMyDiaryList(self.loadMore.data,(data)=>{
          let list = self.loadMore.padeConfig.pageData;
          self.loadMore.padeConfig.hasMore = data.hasMore;
          self.loadMore.padeConfig.pageData = list.concat(data.diaryList);
          self.loadMore.padeConfig.totalRows = self.loadMore.padeConfig.pageData.length; // 总条数
          self.loading = false;
          self.list_lockRoll= false;
        })
      },
      // 点击加载更多
      loadMoreClick(){
        if(this.loadMore.padeConfig.hasMore&&!this.loading) {
          this.loadMore.data.page++;
          this.getList();
        }
      },
      //下拉加载
      scrollLoadMore:function (e) {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
          if(!this.list_lockRoll && this.loadMore.padeConfig.hasMore){
            this.loadMoreClick();
          }
        }
      },
      //获取选择的日志id，变成string类型以便形成汇总
      chosenDiarys:function (val) {
        var str = '';
        if(val.length > 0){
          this.buttonShow = true;
          for (var i = 0; i < val.length; i++) {
            str = str + val[i] + ","
          }
        }  else {
          this.buttonShow = false;
        }
        this.summaryData.ids = str.substring(0,str.length-1);
      },
      backToAdd:function () { //取消
        this.$router.push({
          path: '/add',
          query: { fromSummary: true}
        })
      },
      initSummary:function () { //点击生成汇总
        var buttonConfig = {
          primaryBtn:{name:"确定", callBack:this.doInitSummary},
          defaultBtn:{name:"取消", callBack:null},
        };
        _.alert('提示',"确定生成汇总报告？",buttonConfig)
      },
      //跳转到新增界面，并将选择的id传过去
      doInitSummary:function(){
        this.$router.push({
          path: '/add',
          query: { summaryIds: this.summaryData.ids, ueditorStatus:this.$route.query.isUeditor}
        })
      },
      // 搜索关键字后重新请求
      showMsgFromSearchBar:function (keyWord, val) {
        this.loadMore.data.keyWord=keyWord;
        this.loadMore.data.typeId=val;
        this.clearLoadFun();
      },
      //搜索框的输入特殊功能，弹出时间插件
      showTimeInput:function () {
        var self = this;
        self.headData.searchBar.inputFocus = false;
        self.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: self.headData.searchBar.keyWord ? self.headData.searchBar.keyWord : timeUtil.changeFormat(new Date(), 'yyyy-MM-dd'),
          onConfirm (val) {
            self.headData.searchBar.keyWord = val
          }
        })
      },
      scrollFun:function(e){ //head滚动
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

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
    components:{
      "diary-list":diary_list,
      loadMore,
      search_bar,
      flow_button,
      noRecord
    }
  }

</script>
<style>
.qwui-search_box_height{
    height: 43px;
  }
.qwui-footer_height{
  height:55px
}
</style>
