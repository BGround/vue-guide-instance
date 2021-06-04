<template>
  <div class="wrap" v-show="hasContent">
    <div>
      <!--详情标题头部-->
      <detail-title class="qwui-detail_content" :titledata="diaryDetail.detail" @showThisPersonUtil="getCreatorDetail" @clickEditOrCopy="clickEditOrCopy"></detail-title>

      <!--操作按钮-->
      <div class="qwui-background_white">
      <flow-button :buttondata="buttonConfig" v-if="diaryDetail.detail.isScore"></flow-button>
      </div>
      <!--负责人内容-->
      <user_selected_group
        v-if="userSelect.toPersonList&&userSelect.toPersonList.num"
        :title="userSelect.toPersonList.title"
        :isEdit="false">
        <user_selected_item
          :title="userSelect.toPersonList.title"
          :userTotal="userSelect.toPersonList.num"
          :List="userSelect.toPersonList.userSelected"
          :isEdit="false"
          @atThisPersonUtil="atThisPersonUtil"
          @showPersonList="showPersonList"
          slot="user_selected_item">
        </user_selected_item>
      </user_selected_group>
      <!--相关人内容-->
      <user_selected_group
        v-if="userSelect.ccPersonList&&userSelect.ccPersonList.num"
        :title="userSelect.ccPersonList.title"
        :isEdit="false">
        <user_selected_item
          :title="userSelect.ccPersonList.title"
          :userTotal="userSelect.ccPersonList.num"
          :List="userSelect.ccPersonList.userSelected"
          :isEdit="false"
          @atThisPersonUtil="atThisPersonUtil"
          @showPersonList="showPersonList"
          slot="user_selected_item">
        </user_selected_item>
      </user_selected_group>

      <!--上一篇 下一篇-->
      <div class="qwui-pageNumber">
        <div class="prev" @click="nextDiary('pre')">上一篇日志</div>
        <div class="next" @click="nextDiary('next')">下一篇日志</div>
      </div>

      <div class="qwui-comment_input">
        <div class="qwui-input_div">
          <div class="qwui-input">
            <input type="text"
                   placeholder="评论一句吧"
                   readonly="readonly"
                   ref="commentContent"
                   @focus="showCommentInput">
          </div>
        </div>
      </div>

      <!--评论列表-->
      <list-comment :commentList="listComment"
                    :totalRow="totalRow"
                    @atThisPersonUtil="atThisPersonUtil"
                    @onlyComment="onlyComment"
                    @delete="deleteComment"></list-comment>
      <load-more :loading="loading"
                 :hasMore="hasMore"
                 :type="'commentList'"
                 @loadMoreClick="loadMoreComment">
        <p class="qwui-comment_tip">无更多内容了</p>
      </load-more>
  </div>

    <!--评论输入框组件-->
    <chat-comment :show.sync="showChatTool"
                  :agent="'diary'"
                  :autofocus.sync="autofocus"
                  :dataBase="dataBase"
                  @dealccPerson="backUserSelect"
                  @updateContent="updateContent"></chat-comment>

    <!--选择人组件-->
    <user_select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show"></user_select>

    <!--负责人、相关人详细列表-->
    <user_show :title="userselectTitle" :userSelect="userSelectList" :limitPreview="limitPreview" :show.sync="showPerson"></user_show>

    <!--个人信息-->
    <user_info ref="loadPersonalMsg"></user_info>

    <!--预览图片组件-->
    <previewImages></previewImages>
  </div>
</template>
<script>
  import Vue from 'vue'
  import detailTitle from '@/components/detail/detail_title';
  import flowButton from '@/components/button/flow_button';
  import listComment from '@/components/list/comment_list';
  import chatComment from '@/components/detail/chatInput';
  import loadMore from '@/components/list/load_more';
  import user_select from '@/components/base/user_or_dept_select';
  import user_info from '@/components/detail/user_info_card';//个人信息
  import previewImages from "@/components/base/previewImages";
  import user_selected_item from '@/components/base/userOrDeptSelect/user_selected';       //相关人组件
  import user_selected_group from '@/components/base/userOrDeptSelect/user_selected_group';  //相关人组件
  import user_show from '@/components/detail/user_show'; // 所有相关人列表
  import detail from '../../js/detail';
  import EventBus from '@/utils/eventBus';

  import {
    publishDiaryComment,
    loadDiaryComment,
    onlySeeDiaryComment,
    deleteDiaryComment } from '../../api/getData';

  export default {
    name: 'detail',
    data(){
      return{
        dataBase:dataBase,
        diaryDetail:detail.detailData.diaryDetail,
        isSubmitLoading:false,//正在提交

        isScore:"0",//默认使用评分功能
        recIsClose:1,//负责人是否可结束作业
        hasContent:false, //请求成功

        showPerson:false,
        userselectTitle:'',       //人员详细列表标题
        userSelectList:[],        //人员详细列表
        limitPreview:false,        //限制弹个人信息弹窗

        // 评论组件数据
        showChatTool:false,
        autofocus:false,
        loading:false,
        lock_roll:false,
      }
    },
    created:function(){
      _.showLoading("",false);
      this.diaryDetail.data.diaryId=this.$route.query.diaryId;
      this.diaryDetail.listComment.get.data.id=this.$route.query.diaryId;
      this.diaryDetail.data.status=this.$route.query.status;
      this.detailShow();
      window.onscroll = this.scrollList;
    },
    computed:{
      buttonConfig:function(){ //详情操作按钮
        return this.diaryDetail.detail.scoreButtonConfig;
      },
      userSelect:function(){  //负责人、相关人
        return this.diaryDetail.detail.userListConfig;
      },
      listComment:function () { //评论列表
        return this.diaryDetail.listComment.comments;
      },
      // 评论总条数
      totalRow(){
        return this.diaryDetail.listComment.totalPages;
      },
      // 是否有更多评论
      hasMore(){
        return this.diaryDetail.listComment.get.hasMore;
      },
    },
    methods:{
      //跳转到上一篇/下一篇
      nextDiary:function(type){
        _.showLoading('加载中')
        var self = this;
        var tempStatus = self.$route.query.status;
        if(tempStatus==''||tempStatus==null||tempStatus==undefined){
          tempStatus='2';
        }
        _.ajax({
          url: _.baseURL+detail.nextUrl,
          type: 'POST',
          data:{
            'id':self.$route.query.diaryId,
            'status':tempStatus,
            'type':type,
            'typeId':'',
            'keyWord':self.$route.query.keyWord,
            "historyYear":''
          },
          success: function (result) {
            if(result.code=="0"){
              self.$router.push({
                path: '/detail',
                query: {diaryId: result.data.diaryId, status: tempStatus, keyWord: self.$route.query.keyWord}
              })
              location.reload();
            }else{
              _.hideLoading()
              _.alert("i18n.notice",result.desc);
            }
          }
        });
      },
      //点击编辑复制
      clickEditOrCopy:function (val) {
        if(val.isCheckUEditor){
          _.alert('提示','内容由富文本编辑器生成，请在PC端修改')
        } else {
          this.$router.push({
            path: val.name,
            query: val.params
          })
        }
      },
      detailShow:function(){ //详情加载
        var self=this;
        self.diaryDetail.data.userId=_.userId;
        _.ajax({
            url: _.baseURL+self.diaryDetail.url,
            type: 'POST',
            data:self.diaryDetail.data,
            success: function (result) {
              if(result.code=="0"){
                var detailDataConfig=result.data;
                detailDataConfig.detail.title? document.title = detailDataConfig.detail.title:"";
                var scoreSetting=detailDataConfig.isScore;//是否开启评分
                if(scoreSetting){
                  self.isScore= scoreSetting.isScore=="1"? "1":"0";
                  if(!(JSON.stringify(scoreSetting)!="{}" && scoreSetting.isScore=="0" && detailDataConfig.detail.scoreInfo)){
                    detailDataConfig.detail.scoreInfo={};
                    detailDataConfig.detail.scoreInfo.score="";
                  }
                }
                //判断负责人ID 是否和当前登录人的ID相等，如果相等当前登录人就是负责人；
                var curUserIdIsChargePerson = false;
                var toPersons = detailDataConfig.detail.toPersons;
                if(toPersons&&toPersons.length>0) {
                  for (var i = 0; i < toPersons.length; i++) {
                    if (toPersons[i].userId == _.userId)
                      curUserIdIsChargePerson = true;
                  }
                }
                var configCopy={};//复制图标
                var configEdit={};//编辑图标
                //是否使用富文本编辑器判断
                let isCheckUEditor = detailDataConfig.detail.isUEditor == '1' && !(_.isWeChat() && !_.isWeChatApp());
                if(detailDataConfig.detail.creator==_.userId){ //如果是本人，显示编辑复制按钮
                  configCopy={isCheckUEditor:isCheckUEditor, name:"/add", params:{"diaryId":self.$route.query.diaryId, isCopy:true, status:1}};
                  configEdit={isCheckUEditor:isCheckUEditor, name:"/add", params:{"diaryId":self.$route.query.diaryId, status:1}};
                } else if(curUserIdIsChargePerson && detailDataConfig.isEditor){ //如果是负责人，根据是否后台设置，显示编辑按钮
                  configEdit={isCheckUEditor:isCheckUEditor, name:"/add", params:{"diaryId":self.$route.query.diaryId, status:1}};
                }
                var isScore = false;
                if(curUserIdIsChargePerson && detailDataConfig.isScore){ //如果是负责人，并且设置可以评分
                  isScore =true;
                }
                self.diaryDetail.detail={
                  openPrint:false,
                  creator:{
                    userId:detailDataConfig.detail.creator,
                    personName:detailDataConfig.detail.personName,
                    headPic:detailDataConfig.detail.headPic,
                    createPerson:detailDataConfig.detail.creator,
                  },
                  title:detailDataConfig.detail.title,
                  personName:detailDataConfig.detail.personName,
                  createTime:detailDataConfig.detail.createTime,
                  content:detailDataConfig.detail.content,
                  configEdit:configEdit,
                  configCopy:configCopy,
                  picList:detailDataConfig.detail.picList,//上传的图片列表
                  tips:detailDataConfig.detail.typeName,
                  mediaList:detailDataConfig.mediaList,//上传的附件列表
                  isScore:isScore,//是否可评分
                  scoreButtonConfig:{ //评分操作按钮
                    primaryList:[{type:"primary",name:'评分',callBack:self.scoreThis}],
                    defaultList:[],
                    class:""//按钮是否置底部 active :底部、"":相对定位
                  },
                  scoreList:detailDataConfig.detail.scoreList,//评分列表
                  userListConfig:{
                    toPersonList:{
                      title:"负责人",
                      show:false,
                      num:detailDataConfig.detail.toPersons.length,
                      userSelected:detailDataConfig.detail.toPersons,
                    },
                    ccPersonList:{
                      title:"相关人",
                      show:false,
                      num:detailDataConfig.detail.ccPersons.length,
                      userSelected:detailDataConfig.detail.ccPersons,
                    }
                  },
                };
                self.diaryDetail.listComment.get.hasMore=detailDataConfig.hasMore; //更多
                self.diaryDetail.listComment.totalPages=detailDataConfig.detail.commentCount;
                self.diaryDetail.listComment.send.contentObject="tbQyDiaryCommentPO.content";
                self.diaryDetail.listComment.send.data={
                  "id":detailDataConfig.detail.diaryId,
                  "type":"1",
                  "userId":_.userId,
                  "tbQyDiaryCommentPO.content":"",
                  "tbQyDiaryCommentPO.diaryId":detailDataConfig.detail.diaryId,
                }
                if(detailDataConfig.comments){
                  self.diaryDetail.listComment.comments=detailDataConfig.comments;//评论列表数据
                }else{
                  self.diaryDetail.listComment.comments=[];//评论列表数据
                }
                self.hasContent=true;
                _.hideLoading();
              }else{
                _.hideLoading();
                _.alert("i18n.notice",result.desc);
              }
            }
        });
      },

      //获取创建人详情
      getCreatorDetail:function (creator) {
        if(creator){
          this.$refs.loadPersonalMsg.showUserMessage(creator);
        }
      },

      backUserSelect(obj){ //@人后把人添加为相关人
        if(this.diaryDetail.detail.userListConfig.ccPersonList.userSelected){
          var newRelativePerson=_.appendRelativePerson(this.diaryDetail.detail.userListConfig.ccPersonList,obj);
          this.diaryDetail.detail.userListConfig.ccPersonList.num=newRelativePerson.length;
          this.diaryDetail.detail.userListConfig.ccPersonList.userSelected=newRelativePerson;
        }
      },
      //评分
      scoreThis:function () {
        var content = [
          {type:"scoreType",scoreType:{title:"给该日志评分",name:"score",num:"10",score:"1"}},
          {type:"comment",comment:{maxLength:100,placeholder:"理由",value:"很好"}}
        ];
        var buttonConfig = {
          primaryBtn:{name:"i18n.confirm", callBack:this.doScore},
          defaultBtn:{name:"i18n.cancel", callBack:null},
        };
        _.showMsg("", content, buttonConfig);
      },
      doScore:function (msg) {
        var self = this;
        if(!msg[1].value){
          _.alertError("i18n.cannotEmpty",1);
          return;
        }
        _.ajax({
          url: _.baseURL + detail.scoreUrl,
          type: "post",
          data: {
            'diaryId':self.$route.query.diaryId,
            'score': msg[0].value,
            'reason': msg[1].value
          },
          success: function (result) {
            if (result.code == "0") {
              self.hasContent = false;
              _.showLoading("",false);
              self.detailShow();
            } else {
              _.alert("i18n.notice", result.desc);
            }
          }
        })
      },
      // 查看个人头像
      atThisPersonUtil(user) {
        if(user){
          EventBus.$emit("atThisPersonUtil",user);
        }
      },
      showPersonList(title,list){
        this.userselectTitle = title;
        this.userSelectList = list;
        this.showPerson = true;
      },
      // 显示评论输入框
      showCommentInput(){
        this.showChatTool = true;
        this.autofocus = true;
      },
      // 发表评论
      updateContent(data){
        if(data){
          let diaryId = this.$route.query.diaryId;
          let msg = {
            "tbQyDiaryCommentPO.content":data.content,
            "tbQyDiaryCommentPO.diaryId":diaryId,
            "id":this.$store.getters.taskId,
            "type":data.type,
            "userId":_.userId
          };
          data.userIds? msg.userIds=data.userIds:"";
          publishDiaryComment(msg,(result)=>{
            this.diaryDetail.listComment.comments.splice(0,0,{
              commentId:result.commentId,
              headPic:_.headPic,
              personName:_.personName,
              creator:_.userId,
              type:data.type,
              content:data.content,
              time:this.$t('i18n.justNow'),
              commentStatus:data.status,
            });
            this.diaryDetail.listComment.totalPages = (parseInt(this.totalRow)+1).toString();
          })
        }
      },
      // 页面滚动
      scrollList(){
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight) {
          if(!this.lock_roll && this.hasMore){
            this.lock_roll=true;
            this.loadMoreComment();
          }
        }
      },
      // 加载更多评论
      loadMoreComment(){
        this.loading = true;
        this.diaryDetail.listComment.getMore.data.lastCommentId = this.listComment[this.listComment.length -1].commentId;
        loadDiaryComment(this.diaryDetail.listComment.getMore.data,(data)=>{
          this.loading = false;
          this.lock_roll = false;
          this.diaryDetail.listComment.get.hasMore = data.hasMore;
          this.diaryDetail.listComment.comments.push(...data.comments);
        })
      },
      // 切换只看评论按钮
      onlyComment(val){
        this.diaryDetail.listComment.get.data.page = 1;
        this.diaryDetail.listComment.get.data.commentStatus = val ? '2' : '1';
        this.diaryDetail.listComment.getMore.data.commentStatus = val ? '2' : '1';
        onlySeeDiaryComment(this.diaryDetail.listComment.get.data,(data)=>{
          this.diaryDetail.listComment.get.hasMore = data.hasMore;
          this.diaryDetail.listComment.comments = data.comments;
        })
      },
      // 删除评论
      deleteComment(data,index){
        if(data){
          deleteDiaryComment({commentId:data.commentId},()=>{  // 删除成功
            this.diaryDetail.listComment.totalPages = (parseInt(this.totalRow)-1).toString();
            this.diaryDetail.listComment.comments.splice(index,1);
          });
        }
      },
    },
    components:{
      detailTitle,
      flowButton,
      listComment,
      chatComment,
      loadMore,
      user_select,
      user_info,
      previewImages,
      user_selected_item,
      user_selected_group,
      user_show
    },

  }
</script>
<style lang="scss" scoped>
  .wrap {
    padding-bottom: 50px;
  }
  .qwui-background_white{
    position: relative;
    background-color: white;
  }
  .qwui-background_white:after, .qwui-pageNumber:after{
    content: '';
    position: absolute;
    left:0;
    bottom: 0;
    width: 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-pageNumber::before{
    content: '';
    position: absolute;
    left:0;
    top: 0;
    width: 100%;
    border-top: 1px solid #e5e5e5;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .qwui-pageNumber{
    position: relative;
    height: 45px;
    background-color: white;
    line-height: 45px;
    color: #666;
    font-size: 14px;
  }
  .qwui-pageNumber .prev{
    float: left;
    padding-left: 10px;
    cursor: pointer;
  }
  .qwui-pageNumber .prev:before{
    content: '';
    background: url('../../../../assets/images/CSSSprites.png');
    width: 10px;
    height: 15px;
    display: inline-block;
    background-size: 101px 101px;
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    margin-right: 10px;
    vertical-align: -2px;
  }
  .qwui-pageNumber .next{
    float: right;
    padding-right: 10px;
    cursor: pointer;
  }
  .qwui-pageNumber .next:after{
    content: '';
    background: url('../../../../assets/images/CSSSprites.png');
    width: 10px;
    height: 15px;
    display: inline-block;
    background-size: 101px 101px;
    margin-left: 10px;
    vertical-align: -2px;
  }
  /*相关人人员列表内容层级*/
  .qwui-user_show_box {
    z-index: 9 !important;
  }
  /*评论列表头部标题样式*/
  .qwui-comment_cell_box >>> .qwui-comment_cell_header{
    margin-top: 10px;
    background-color: #fff;
  }
  .qwui-comment_cell_box >>> .qwui-comment_cell_title {
    color: #333;
  }
  .qwui-comment_cell_box >>> .qwui-comment_cell_header:after {
    border-bottom: none;
  }
  /*详情内容*/
  .qwui-detail_content {
    /deep/ .qwui-detail_instruct_word {
      img {
        width: 100%;
        margin: 5px 0;
        object-fit:cover;
      }
      /*表格样式*/
      table{
        margin: 5px 0;
        max-width:100%;
        width: 100%;
        border-collapse: collapse;
      }
      /*表格边宽*/
      td{
        border:1px solid #ddd;
      }
    }

  }

  @media screen and (min-width: 1024px) {
    .qwui-comment_input{
      width:740px!important;
    }
  }
  .qwui-comment_input{
    display: flex;
    position: fixed;
    line-height: 50px;
    width: 100%;
    height: 50px;
    justify-content: space-between;
    bottom: 0;
    background: #fff;
    box-shadow: 0 -1px 10px 0 #e3e4e8;
    z-index: 1;
  .qwui-input_div{
    flex: 1;
  .qwui-input{
    display: flex;
    height: 38px;
    align-items: center;
    flex: 1;
    margin: 6px 15px;
    padding-left: 10px;
    border-radius: 5px;
    font-size: 15px;
    color: #b2b9c8;
    text-align: left;
    background: #f6f6fa;
    cursor: pointer;
  input{
    font-size: 14px;
    background: none;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  }
  }
  }
</style>
