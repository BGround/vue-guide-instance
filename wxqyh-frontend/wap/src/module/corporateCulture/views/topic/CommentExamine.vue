<template>
  <div class="qwui-commentExamine">
    <!-- tab栏 -->
    <nav-tabs
      :tabs="tabs"
      position="top"
      :activeIndex="indexControl"
      @listenNavTabs="listenNavTabsBack">
      <div slot="height" style="height:10px;"></div>
    </nav-tabs> 
    <div class="qwui-nav_height"></div>
    <!-- 审核列表 -->
    <div class="qwui-comment_list" v-for="(item,index) in commentsList" :key="index">
      <div class="qwui-checkbox" v-if="ableSelect">
        <!-- 多选框 -->
        <input type="checkbox"
                class="icon_check"
                :key="item.commentId"
                :value="item.commentId"
                :id="item.commentId"
                @change="checkboxClick(item.commentId)"
                > 
      </div>
      <div class="qwui-comment" @click="gotoDetail(item)">
        <div v-if="item.type=='1'" class="qwui-content">{{item.content}}</div>
        <div v-else><img class="qwui-comment_img" :src=item.content alt=""></div>
        <div class="qwui-title">{{item.topicTitle}}</div>
        <div class="qwui-personAndTime">
          <span>{{item.personName}}</span>
          <span>  评论</span>
          <span class="qwui-time">{{item.createTime}}</span>
        </div>
      </div>
    </div>
    <!-- 加载更多 -->
    <load-more
        :class="{'qwui-examine_list':reqData.status==0}"
        :loading="loadMore.loading"
        :currPage="loadMore.currPage"
        :maxPage="loadMore.maxPage"
        @loadMoreClick="loadMoreList"
      >
      <span v-show="hasMore">已经到底了</span>
    </load-more>
    <!-- 弹出框 -->
    <dialog-group
      :title="dialog.title"
      :show="dialog.show"
      @cancel="cancelDialog"
      @confirm="confirmDialog"
      cancelText="取消"
      confirmText="确定">
      <p v-if="isPass" class="qwui-dialogText">审批通过后，用户将会看到该内容</p>
      <p v-if="!isPass" class="qwui-dialogText">删除后该评论将无法恢复</p>
    </dialog-group>
    <!-- 审核按钮 -->
    <audit-btn 
      v-if="btnShow"
      class="qwui-bottom_btn qwui-btn_box"
      :ableClick="ableClick"
      :btnText="btnText"
      @cannotPass="cannotPass"
      @pass="pass">
    </audit-btn>
  </div>
</template>
<script>
import navTabs from '@/components/base/nav_tabs';
import auditBtn from '../components/auditBtn';
import loadMore from '@/components/list/load_more';
import dialogGroup from '@/components/base/dialog/dialog-group';
import {countCommentAuditNumber,getPagerCommentInfo,examineComment} from '../../api/getData';
export default {
 name:'comment-examine',
 data(){
   return {
    tabs:[//tab栏
      {text:'待审核'},
      {text:'已通过'},
    ],
    indexControl:0,//tab默认选中项
    reqData:{//评论请求的参数
      status:0,
      page:1
    },
    ableClick:false,//按钮是否能点击
    btnShow:true,//按钮是否显示
    dialog:{//弹出框
      title:'',
      show:false,
    },
    isPass:true,//点击的是否是通过按钮
    ableSelect:true,//显示多选框
    loadMore:{//下拉加载更多配置
      loading:false,
      currPage:1,
      maxPage:1,
    },
    scrollLock: false, // 滚动锁，防止下拉多次请求
    isAjax:false,//是否正在请求数据
    selectList:[],//多选框选中的项
    commentsList:[],//评论列表
    btnText:{
      leftBtn:'删除',
      rightBtn:'通过'
    }
   }
 },
 computed:{
    hasMore(){
      return this.commentsList.length&&!this.loadMore.loading;
    }
 },
 created(){
    this.getCommentAuditNum();
    this.getAuditComment();
    window.addEventListener('scroll',this.scrollList);
 },
 beforeDestroy(){
    window.removeEventListener('scroll',this.scrollList);
 },
 methods:{
    //获取审核评论数量
    getCommentAuditNum(){
      countCommentAuditNumber((data)=>{
        this.tabs[0].text='待审核('+data.waitAudit+')';
        this.tabs[1].text='已通过('+data.auditPass+')';
      })
    },
    //获取评论
    getAuditComment(){
      if(this.isAjax){
        return ;
      }
      this.isAjax=true;
      getPagerCommentInfo(this.reqData,(data)=>{
        this.loadMore.currPage=data.currPage;
        this.loadMore.maxPage=data.maxPage;
        this.loadMore.loading=data.currPage<data.maxPage?true:false;
        this.scrollLock=false;
        this.isAjax=false;
        if(data.currPage<=data.maxPage){
          for(let i=0;i<data.pageData.length;i++){
            if(data.pageData[i].type=='2'){
              data.pageData[i].content=_.compressURL+data.pageData[i].content;
            }
          }
          this.commentsList=this.commentsList.concat(data.pageData);
        }
      })
    },
    //tabs切换
    listenNavTabsBack(index){
      this.commentsList=[];
      this.reqData.page=1;
      if(index==0){
        this.reqData.status=0;
        this.btnShow=true;
        this.ableSelect=true;
      }else{
        this.reqData.status=1;
        this.btnShow=false;
        this.ableSelect=false;
      }
      this.getAuditComment();
    },
    //不通过评论
    cannotPass(){
      this.isPass=false;
      this.dialog.title='确认删除评论？';
      this.dialog.show=true;
    },
    //通过评论
    pass(){
      this.isPass=true;
      this.dialog.title='确定通过审批？';
      this.dialog.show=true;
    },
    //点击加载更多
    loadMoreList(){
      this.reqData.page++;
      this.getAuditComment();
    },
    //下拉加载更多
    scrollList(){
      let scrollTop = document.documentElement.scrollTop|| document.body.scrollTop || window.pageYOffset ;
      if(this.scrollLock||scrollTop==0){
        return ;
      }
      if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
        if(this.loadMore.currPage<this.loadMore.maxPage){
          this.scrollLock=true;
          this.reqData.page++;
          this.getAuditComment();
        }
      }
    },
    //跳转详情页
    gotoDetail(item){
      this.$router.push({
        path:'/topicDetail',
        query:{
          id:item.topicId
        }
      })
    },
    //多选框点击事件
    checkboxClick(id){
      let hasSelect=-1;
      if(this.selectList.length){
        for(let i=0;i<this.selectList.length;i++){
          if(this.selectList[i]==id){
            hasSelect=i;
            break;
          }
        }
      }
      hasSelect!=-1?this.selectList.splice(hasSelect,1):this.selectList.push(id);
      this.ableClick=this.selectList.length?true:false;
    },
    cancelDialog(){
      this.dialog.show=false;
    },
    confirmDialog(){
      this.dialog.show=false;
      let status=this.isPass?1:-1;
      let commentIds='';
      for(let i=0;i<this.selectList.length;i++){
        commentIds+=this.selectList[i]+',';
      }
      let data={
        commentIds,
        status
      }
      examineComment(data,()=>{
        for(let i=0;i<this.selectList.length;i++){
          let index=this.findIndexById(this.selectList[i]);
          this.commentsList.splice(index,1);
        }
        this.getCommentAuditNum();
        this.selectList=[];
        this.ableClick=false;
      })
    },
    findIndexById(commontId){
      let index=-1;
      for(let i=0;i<this.commentsList.length;i++){
        if(this.commentsList[i].commentId==commontId){
          index=i;
          break;
        }
      }
      return index;
    }
 },
 components:{
    navTabs,
    auditBtn,
    loadMore,
    dialogGroup,
 }
}
</script>
<style lang="scss" scoped>
  .qwui-commentExamine{
    .qwui-nav_height{
      height:40px;
    }
    .qwui-comment_list{
      display: flex;
      justify-content: space-between;
      padding: 12px 14px;
      cursor: pointer;
      background: #fff;
      .qwui-checkbox{
        flex:1;
        margin-top: 2px;
      }
      .qwui-comment{
        flex: 22;
        .qwui-content{
          color: #0A1735;
          font-size: 15px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
        .qwui-comment_img{
          max-width: 80px;
          max-height: 80px;
        }
        .qwui-title{
          color: #5585F0;
          font-size: 14px;
          margin: 6px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
        .qwui-personAndTime{
          color: #B2B9C8;
          font-size: 12px;
          .qwui-time{
            float: right;
          }
        }
      }
    }
    .qwui-examine_list{
      margin-bottom: 43px;
    }
    .qwui-bottom_btn{
      width: 100%;
      position: fixed;
      bottom: 0;
    }
    .qwui-dialogText{
      display: inline-block;
      color: #999;
      font-size: 14px;
      margin: 1px 30px 28px 31px;
    }
  }
</style>


