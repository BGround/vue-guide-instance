<!--包含任务评论、底部操作按钮-->
<template>
  <div class="qwui-comment"  v-windowscroll="scrollList" ref="comment">
    <div class="commentTitle">
      <div class="operating" :style="{'display': 'flex','justify-content': showPutBtn?'space-around':'center','align-items': 'center'}">
				<!-- ({{ listTotalRows }}) :class="{ 'active':isComment }" -->
        <span class="commentIcon" @click="changeComment" style="color: #333;font-size: 12px;"><i></i>评论</span>
        <span v-if="showPutBtn" class="commentIcon" @click="handlePostTask" style="color: #333;font-size: 12px;"><i></i>提交</span>
        <!-- <span class="operatIcon" :class="{ 'active':!isComment || isSubtaskPage }" @click="changeOperate">操作 <i></i></span> -->
        <!-- <div v-if="commentPermission" class="onlyComment" v-show="isComment">
          <span>只看评论</span>
          <div class="qwui-onOff_choose qwui-onOff" :class="{'qwui-onOff_on': onlyComment, 'qwui-onOff': !onlyComment}" @click="onlySeeComment">
            <span class="qwui-onOff_off" :class="{'active': onlyComment}"></span>
          </div>
        </div> -->
      </div>
      <div v-if="!isComment || isSubtaskPage" class="createInfo">
        {{ personName | personNameHandle }} · 创建于 {{ creatorTime | timeHandle }}
      </div>
    </div>
    <comment-list class="qwui-comment_list"
                  :commentList="needCommentList"
                  :totalRow="listTotalRows"
                  @delete="deleteThisComment"
                  @onlyComment="onlySeeComment"
                  @atThisPersonUtil="atThisPersonUtil">
    </comment-list>
    <load-more :loading="loading" :hasMore="hasMoreComment" :type="'commentList'" @loadMoreClick="clickLoadMoreList"></load-more>
    <div class="bottomLine" v-show="!hasMoreComment && needCommentList.length != 0">我是有底线的</div>
    <div class="bottomLine" v-show="needCommentList.length == 0 && !loading">{{ noContentTip }}</div>
    <div class="bottomBtn" :style="{'z-index':zIndex}">
      <!-- <div v-show="commentPermission && !inputShow" class="comment"
           @click="showChatInput"><i></i><span>评论</span></div> -->
      <!-- <input class="comment-chat_input" type="text" readonly="readonly"
             v-show="commentPermission && inputShow"
             :placeholder="chatPlaceholder"
             @click="showChatInput"> -->
      <div v-if="updateRatePermission && !taskOver" class="updateRate qwjs-bottom" @click="showUpdateRate">
        <i></i><span>更新进度</span>
      </div>
      <div v-if="scorePermission && taskOver && taskCloseType == '1'" class="taskScore qwjs-bottom" @click="showScorePop"><i></i><span>评分</span></div>
      <div v-if="!taskOver && closeRestartPermission" class="endRestart qwjs-bottom" @click="closeTask"><i></i><span>结束</span></div>
      <div v-if="taskOver && closeRestartPermission" class="restartTask qwjs-bottom" @click="restartTask"><i></i><span>重启</span></div>
     <!-- <div v-if="commentPermission" class="moreOperate" @click="changeCopyBoxShow">
        <i></i>
        <div v-show="copyBoxShow" class="copyTaskBox">
          <span @click.stop="copyTask">复制任务</span>
          <div class="qwui-separate_bar"></div>
          <span @click.stop="changeCopyBoxShow">取消</span>
        </div>
      </div> -->
    </div>
    <!--@人相关人组件-->
    <user_select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_select>
    <!--个人信息-->
    <user_info></user_info>
    <!--预览图片组件-->
    <div class="qwui-mask" v-show="copyBoxShow" @click.stop="changeCopyBoxShow"></div>
  </div>
</template>

<script>
  import commentList from '@/components/list/comment_list';
  import loadMore from '@/components/list/load_more';
  import chatInput from '@/components/detail/chatInput';
  import EventBus from '@/utils/eventBus';
  import user_select from '@/components/base/user_or_dept_select';
  import user_info from '@/components/detail/user_info_card';
  import * as timeUtil from '../../../../assets/js/time-util';
  import { liveUpdateTask,loadMoreComment,addCommentList,deleteCommentList } from '../../api/getData';

  export default {
    props:{
      commentList:{
        type:Array,
        default(){
          return [];
        }
      },
      subOperationRecord:{
        type:Array,
        default(){
          return [];
        }
      },
      subHasMore:{
        type:Boolean,
        default:false
      },
      commentCount:{
        type:[String,Number],
        default:0
      },
      onlyCommentCount:{
        type:[String,Number],
        default:0
      },
      creatorTime:{
        type:String,
        default:''
      },
      closeSwitch:{
        type:[String,Number],
        default:0
      },
      type:{
        type: String,
        default:''
      },
      taskCloseType:{
        type:String,
        default:'0'
      },
			showPutBtn: {
				type: Boolean,
				default: false
			}
    },
    data(){
      return {
        dataBase: dataBase,
        loading:false,
        showChatTool:false,// 显示评论框
        autofocus:false,
        isComment:true,// 是否选择评论
        onlyComment:false,// 只看评论
        commentStatus:1,
        lock_roll:false,
        currentPage:0,
        deleteListIndex:"",
        detailPicList:[],
        operationRecord:[],// 操作记录
        firstClick:true,// 第一次点击操作按钮
        copyBoxShow:false,// 复制任务框
        zIndex:0,
        chatPlaceholder:'评论一句吧',
      }
    },
    created(){
      this.lock_roll = false;
    },
    computed:{
      // 更新进度的权限
      updateRatePermission(){
        if (this.$store.getters.subTaskPage && this.$store.getters.isIncharge ){
          return true;
        }
        return this.$store.getters.isIncharge;
      },
      // 评论权限
      commentPermission(){
        return !this.$store.getters.subTaskPage;
      },
      taskOver(){
        return this.$store.getters.taskOver;
      },
      // 任务操作权限
      hasPermission(){
        if (!this.$store.getters.isDetailPage || ((this.$store.getters.taskLevel == 'a1' || (this.$store.getters.subTaskPage && this.$store.getters.urgentPermission)) && !this.$store.getters.taskOver)){
          return true
        }
        return false;
      },
      // 评分权限
      scorePermission(){
        if (this.$store.getters.subTaskPage){
          return false;// 子任务页面暂时不开评分入口
          if (this.$store.getters.subScore){
            return false;
          }
          return this.$store.getters.urgentPermission;
        }else {
          if (this.$store.getters.mainScore){
            return false;
          }
        }
        return this.$store.getters.taskLevel == 'a1';
      },
      // 结束重启任务的权限
      closeRestartPermission(){
        return (this.closeSwitch && this.$store.getters.isIncharge) || this.$store.getters.taskLevel == 'a1' || this.$store.getters.urgentPermission;
      },
      // 需要展示的评论或操作记录
      needCommentList(){
        if (this.type == 'subTask' && this.$store.getters.subTaskPage){
          if (this.$store.getters.operationRecord.length > 0){
            this.subOperationRecord.unshift(...this.$store.getters.operationRecord);
            this.$store.commit('operationRecordUpdate',[]);
          }
          return this.subOperationRecord;
        }else {
          if (this.type == 'mainTask' && !this.isSubtaskPage){
            if (this.isComment){
              if (this.$store.getters.liveCommentList.length > 0){
                this.commentList.unshift(...this.$store.getters.liveCommentList);
                this.$store.commit('liveCommentListUpdate',[]);
              }
              return this.commentList;
            }else {
              if (this.$store.getters.operationRecord.length > 0){
                this.operationRecord.unshift(...this.$store.getters.operationRecord);
                this.$store.commit('operationRecordUpdate',[]);
              }
              return this.operationRecord;
            }
          }
          return this.commentList;
        }
      },
      // 无评论或操作记录的文字显示
      noContentTip(){
        if (this.$store.getters.subTaskPage || !this.isComment){
          return '暂无操作'
        }
        return '暂无评论';
      },
      inputShow(){
        // 评论框显示条件：无其他权限或者有更新权限但任务已结束
        if (!this.closeRestartPermission && !this.scorePermission && (!this.updateRatePermission || (this.updateRatePermission && this.taskOver))){
          return true;
        }
        return false;
      },
      listTotalRows(){
        if (this.onlyComment){
          return this.onlyCommentCount;
        }else {
          return this.commentCount;
        }
      },
      isSubtaskPage() {
        return this.$store.getters.subTaskPage;
      },
      hasMoreComment(){
        if (this.type == 'subTask' && this.$store.getters.subTaskPage){
          return this.subHasMore
        }else {
          if (this.isComment && !this.isSubtaskPage){
            return this.dataBase.hasMore;
          }else {
            return this.dataBase.hasMoreOperation;
          }
        }
      },
      personName(){
        return this.$store.getters.personName;
      }
    },
    watch:{

    },
    methods:{
			handlePostTask(){
				this.$emit('postTask')
			},
      // 切换评论模块
      changeComment(){
        this.commentStatus = '1';
        this.currentPage=1;
        this.isComment = true;
				this.showChatInput()
      },
      // 切换操作记录模块
      changeOperate(){
        if (this.$store.getters.subTaskPage){
          return;
        }
        this.$store.commit('operationRecordUpdate',[]);
        this.commentStatus = '10';
        this.isComment = false;
        if (this.firstClick){
          this.currentPage=1;
          this.loadMoreList();
        }
        this.firstClick = false;
      },
      // 展示评论输入框
      showChatInput(){
        this.$emit('listenToShowInput');
      },
      // 删除评论
      deleteThisComment(data,index){                                 // 删除评论
        if(data){
          this.deleteListIndex=index;
          var self=this;
          deleteCommentList({commentId:data.commentId},function (result) {  // 删除成功
            self.$emit('listenToDeleteComment',self.deleteListIndex);
            self.$emit('listenToCommentCount',false);
          });
        }
      },
      // 只看评论
      onlySeeComment(){
        this.lock_roll=true;
        this.onlyComment = !this.onlyComment;
        this.currentPage=1;
        this.commentStatus=this.onlyComment? "0":"1";
        if(!this.loading){
          this.loadMoreList();
        }
      },
      // 滚动更多列表
      scrollList(){
        if ((this.$route.path != '/detail' && this.$route.path != '/subtaskDetail') || this.$store.getters.addSubTaskPage){
          return;
        }
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight) {
          if(!this.lock_roll && this.hasMoreComment){
            this.lock_roll=true;
//            this.dataBase.lockLoading = true;
            if (this.$store.getters.subTaskPage){
              this.dataBase.subCurrentPage ++;
            }else {
              this.currentPage++;
            }
            this.loadMoreList();
          }
        }
      },
      clickLoadMoreList(){
        this.lock_roll=true;
        if (this.$store.getters.subTaskPage){
          this.dataBase.subCurrentPage ++;
        }else {
          this.currentPage++;
        }
        this.loadMoreList();
      },
      // 加载更多列表
      loadMoreList(){
        let id;
        if (this.$store.getters.subTaskPage){// 子任务页面
          id = this.$store.getters.subtaskId;// 子任务id
          this.commentStatus = 10;
        }else {
          id = this.$store.getters.taskId;// 主任务id
          this.commentStatus = this.isComment ? (this.onlyComment ? 0 : 1) : 10;
        }

        let data={
          id: id,
          size: 10,
          commentStatus: this.commentStatus,
        };
        this.loading=true;
        let page;
        if (this.$store.getters.subTaskPage){
          page = this.dataBase.subCurrentPage;
        }else {
          page = this.currentPage;
        }
        data.page = page;
        loadMoreComment(data,this.dealCommentList);
      },
      // 处理评论数据
      dealCommentList(data){
        this.loading=false;
        this.showCommentList(data,data.hasMore);
      },
      // 处理返回的评论
      showCommentList(data,hasMore){
        if (this.$store.getters.subTaskPage){
          this.$emit('listenTosubHasMore',hasMore)
        }else {
          if (this.isComment){
            this.dataBase.hasMore = hasMore;
          }else {
            this.dataBase.hasMoreOperation = hasMore;
          }
        }
        this.lock_roll=false;
        let comments = data.comments || [];
        if(comments && comments.length>0){
          if (this.$store.getters.subTaskPage){// 子任务页面
            if (this.currentPage == 1){// 当前页为1
              this.$emit('listenToOperation',comments);
            }else {
              let oldSubOperationRecord = [];
              oldSubOperationRecord.push(...comments);
              this.subOperationRecord.forEach((item,i)=>{
                comments.forEach((items)=>{
                  if (item.commentId == items.commentId){
                    oldSubOperationRecord.splice(i,1,'');
                  }
                })
              })
              let newSubOperationRecord = [];
              oldSubOperationRecord.forEach((item)=>{
                if (item != ''){
                  newSubOperationRecord.push(item)
                }
              });
              this.subOperationRecord.push(...newSubOperationRecord)

            }
          }else {
            if (this.isComment){// 评论模块
              if (this.currentPage == 1){
                this.$emit('listenToComment',comments,data.commentCount,data.onlyCommentCount);
              }else {
                this.commentList.push(...comments);
              }
            }else {// 操作记录
              this.operationRecord.push(...comments);
            }
          }
//
        }else{
          this.needCommentList.splice(0,this.needCommentList.length);
        }
      },
      // 查看个人头像信息
      atThisPersonUtil(user){
        if(user){
          EventBus.$emit("atThisPersonUtil",user);
        }
      },
      // 展示更新进度框
      showUpdateRate(){
        this.$store.commit('changeUpdateRateShow',true);
      },
      // 任务评分
      showScorePop(){
        this.$emit('listenToScore')
      },
      // 结束任务
      closeTask(){
        this.$emit('listenToTaskClose');
      },
      // 重启任务
      restartTask(){
        this.$emit('listenToTaskRestart');
      },
      changeCopyBoxShow(){
        this.copyBoxShow = !this.copyBoxShow;
        this.zIndex = this.copyBoxShow ? 11 : 0;
      },
      // 复制任务
      copyTask(){
        //路由传参
        this.$router.push({
          path:'/add',
          name:'add',
          query: {
            taskId:this.$store.getters.taskId
          }
        });
      },
    },
    filters:{
      timeHandle(val){
        return timeUtil.changeFormat(new Date(Date.parse(val.replace(/-/g,'/'))),'yyyy年MM月dd日 hh:mm');
      },
      personNameHandle(val){
        if (val.length > 5){
          return val.substring(0,4) + '...';
        }
        return val;
      }
    },
    components:{
      commentList,
      loadMore,
      chatInput,
      user_select,
      user_info
    }
  }
</script>

<style>
  .qwui-comment_list .qwui-user_select_revert, .qwui-comment_list .qwui-commentList_marginTop {
    display: none !important;
  }
  .qwui-comment_list .qwui-content_word {
    font-size: 14px !important;
    color: #0A1735 !important;
  }

</style>
