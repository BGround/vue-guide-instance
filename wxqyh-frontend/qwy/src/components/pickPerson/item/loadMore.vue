<template>
  <div v-show="loadFinished">
    <div class="qwui-showMoreList" v-if="tips!='' && isShowTips">
      <p @click="loadMoreClick"><i class="qwui-icon_loadingMore" v-show="tips=='加载中'"></i>{{tips}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'loadMore',
    props:{
      loadmore:{
        type:Object
      },
      isShowTips:{
        type:Boolean,
        default:true
      }
    },
    data(){
      return{
        tips:"",//描述
        hasMore:false,
        lock_roll:true,
        loadFinished:false,
      }
    },
    watch:{
      'loadmore.pageConfig.totalRows':function(val){
        if(val != null && val != undefined && val != '') {
          this.loadRequestDes();
        }
      }
    },
    beforeDestroy:function () { //路由跳转后，限制滚动
      this.lock_roll=true;
    },
    methods:{
      //清空数据，第一次或重新请求数据
      clearLoadFun(){
        //初始化第一页
        if(this.loadmore.pageIndexName){
          this.loadmore.data[this.loadmore.pageIndexName]=1;
        }else{
          this.loadmore.data.page=1;
        }
        //初始化返回数据
        this.loadmore.pageConfig={
          currPage:"",
          pageData:[],  //返回的列表数据
          totalRows:"",//数据总条数
        };
        //开始第一次请求
        this.requestData();
      },
      //点击加载
      loadMoreClick:function () {
        if(this.hasMore){
          this.tips='加载中';
          this.loadmore.data[this.loadmore.pageIndexName]+=1;
          this.requestData();//加载请求
        }
      },
      //下拉加载
      scrollLoadMore:function (e) {
        if(!this.lock_roll && this.hasMore){
          this.lock_roll=true;
          this.loadMoreClick();
        }
      },
      //请求接口数据
      requestData(){
        if(JSON.stringify(this.loadmore)=='{}'){
          console.log('加载失败')
          return;
        }else if(this.loadmore.pageConfig.totalRows==""||this.loadmore.pageConfig.pageData.length==0){
          this.tips="";
        }
        var self=this;
        _.ajax({
          url: _.baseURL+self.loadmore.url,
          type: 'POST',
          data:self.loadmore.data,
          success: function (result) {
            self.lock_roll=false;
            if(result.code=="0"){
              let temp = result.data.pager?result.data.pager:result.data;
              if(temp.pageData&&temp.pageData.length>0) {
                self.loadmore.pageConfig.pageData = self.loadmore.pageConfig.pageData.concat(
                  temp.pageData
                );
              } else {
                self.loadmore.pageConfig.pageData = []
              }
              self.loadmore.pageConfig.totalRows = temp.totalRows;
              self.hasMore = ((temp.currentPage!=undefined?temp.currentPage:temp.currPage) <
              (temp.totalPages!=undefined?temp.totalPages:temp.maxPage)) ? true: false;
              self.loadRequestDes();
              self.$emit("showMsgFromLoadMore",temp);
            }else{
              console.log(result)
            }
            self.loadFinished = true;
            self.$emit('loadFinished')
          }
        });
      },
      //判断列表状态
      loadRequestDes(){
        if(this.hasMore){
          return this.tips='向上滑或点击加载更多';
        }else if(this.loadmore.pageConfig.totalRows==0){
          return this.tips='暂无数据';
        }else if(this.loadmore.pageConfig.totalRows>0 && !this.hasMore){
          return this.tips='共'+this.loadmore.pageConfig.totalRows;
        }else{
          return this.tips="";
        }
      }
    },
  }
</script>
<style>
  .qwui-showMoreList{
    font-size: 14px;
    color: #999;
    line-height: 44px;
    text-align: center;
  }
</style>
