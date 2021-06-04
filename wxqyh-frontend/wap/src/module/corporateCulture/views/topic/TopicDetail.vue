<template>
  <div class="qwui-topic-detail" v-qw-water-mark="qwWaterMarkCofig">
    <div v-show="!showSpecificList">
    <!-- 详情 -->
    <detail-title
      class="qwui-detail"
      :titledata="detailTitleData"
      @clickEditOrCopy="clickEditOrCopy"
      @showThisPersonUtil="atThisPersonUtil">
    </detail-title>
    <!-- 类型和修改时间 -->
    <div class="qwui-typeAndTime">
      <div class="qwui-edit_time" v-if="timeAndType.isUpdate">
        <p>本话题最后由 {{timeAndType.editorName}} 于 {{timeAndType.lastEditTime}} 编辑</p>
      </div>
      <div class="qwui-topic_type">
        <div></div>
        <span>{{timeAndType.typeName}} | <span :class="{'qwui-blue_font':timeAndType.rangeName=='特定对象'}" @click="showSpecific(timeAndType.rangeName)">{{timeAndType.rangeName}}</span> 已阅{{timeAndType.viewCount}}</span>
      </div>
    </div>
    <!-- 点赞 -->
    <div class="qwui-praise" v-if="!isOpen">
      <div class="qwui-praise_operation">
        <div class="qwui-operation_border" :class="{'qwui-yellow_background':hasPraise,'show-animate':isShowAnimate}" @click="praise">
          <div class="qwui-operation qwui-thumb" :class="{'qwui-has_paaise':hasPraise}"></div>
        </div>
        <div class="qwui-operation_border" v-if="isShare=='1'&&isWeChatApp&&examineStatus=='0'"  @click="share">
          <div class="qwui-operation qwui-share"></div>
        </div>
      </div>
      <div class="qwui-praise_list" v-if="praiseNum">
        <div class="qwui-praise_num">
          <i class="qwui-thumb_up"></i>{{praiseNum}}赞
        </div>
        <div class="qwui-praise_name">{{praiseListStr}}<span class="qwui-showMore" v-if="praiseNum>50" @click="gotoPersonList"> 显示全部</span></div>
      </div>
    </div>
    <!-- 上一篇，下一篇 -->
    <div class="qwui-page_operation" v-if="locationInfo.page!=-1&&!isOpen">
      <div class="qwui-pre" @click="jumpPage('pre')">上一篇</div>
      <div class="qwui-next" @click="jumpPage('next')">下一篇</div>
    </div>
    <!-- 审核按钮 -->
    <div class="qwui-examine_btn" v-if="examineShow&&!isOpen">
      <div class="qwui-examine_text">话题审核</div>
      <audit-btn
        v-if="examineStatus=='2'"
        :ableClick="ableClick"
        @cannotPass="cannotPass"
        @pass="pass">
      </audit-btn>
      <div class="qwui-has_examine"  v-if="examineStatus=='0'">{{examinePerson}}已审核通过</div>
      <div class="qwui-has_examine"  v-if="examineStatus=='-1'">{{examinePerson}}审核不通过</div>
    </div>
    <!-- 评论列表 -->
    <comment-list
      v-if="(!isOpen||(isOpen&&isShareComment))&&isComment"
      :commentList="commentList"
      :totalRow="listTotalRows"
      :hiddenSwitch=true
      :dealListDelete="dealListDelete"
      :dealListIcon="dealListIcon"
      :dealListContent="dealListContent"
      :dealListPass="dealListPass"
      @atThisPersonUtil="atCommentPerson"
      @delete="deleteThisComment"
      @pass="passThisComment">
    </comment-list>
    <!-- 评论加载更多 -->
    <load-more
        v-if="(!isOpen||(isOpen&&isShareComment))&&isComment"
        :loading="loadMore.hasMore"
        :hasMore="loadMore.hasMore"
        :type="'commentList'"
        @loadMoreClick="loadMoreList"
      >
      <p class="qwui-comment_tip" v-show="!listTotalRows">还没有任何评论</p>
      <p class="qwui-comment_tip" v-show="!loadMore.hasMore&&listTotalRows">没有更多评论啦</p>
    </load-more>
    <!-- 评论输入框 -->
    <div class="qwui-separate" v-if="!isOpen&&isComment"></div>
    <div class="qwui-comment_height" v-if="!isOpen&&isComment"></div>
    <div class="qwui-comment_input" v-if="examineStatus=='0'&&!isOpen&&isComment">
      <div class="qwui-input_div">
        <div class="qwui-input">
          <input type="text"
           placeholder="评论一句吧"
           ref="commentContent"
           @focus="showCommnetInput">
        </div>
      </div>
      <div class="qwui-publish_btn" @click="publish">发表</div>
    </div>
    <!--评论输入框组件-->
    <chat-input
      :show.sync="showChatTool"
      :autofocus.sync="autofocus"
      :dataBase="dataBase"
      :agent="agent"
      :showAnony="showAnony"
      ref="commentInput"
      @updateContent="updateContent"
      @closeChat="closeChatMask"
      @setAnony="setAnony">
    </chat-input>
    <!-- 选人 -->
    <user-select
      :selectconfig="dataBase.selectConfig"
      v-if="dataBase.selectConfig.show">
    </user-select>
    <!-- 个人信息 -->
    <user-info></user-info>
    <!-- 弹出框 -->
    <dialog-group
      :title="dialog.title"
      :show="dialog.show"
      @cancel="cancelDialog"
      @confirm="confirmDialog"
      cancelText="取消"
      confirmText="确定">
      <p v-if="isPass&&!showPassTip" class="qwui-dialogText">审批通过后，用户将会看到该内容</p>
      <p v-if="!isPass&&!showPassTip" class="qwui-dialogText">不通过该话题，用户将无法看到该话题内容</p>
      <p v-if="showPassTip" class="qwui-dialogText">评论通过后，用户可看到该内容</p>
    </dialog-group>
    <!-- 外部分享 -->
    <share
      :period="3"
      v-if="isShowShare"
    ></share>
    <!--外部单底部logo-->
    <div class="openFooterContent" v-if="isOpen">
      <a href="http://wbg.do1.com.cn/" target="_blank">
        <img src="~assets/images/newsmallLogo.svg" alt="">
        道一云|企微，让工作更简单
      </a>
    </div>
    </div>
    <!-- 特定对象列表 -->
    <specific-list
      v-show="showSpecificList"
      :deptList="specificObj.deptList"
      :tagList="specificObj.tagList"
      :userList="specificObj.userList"
      @hide="hideSpecific">
    </specific-list>
    <!--预览图片组件-->
    <previewImages></previewImages>
  </div>
</template>
<script>
import detailTitle from '@/components/detail/detail_title';
import commentList from '@/components/list/comment_list';
import loadMore from '@/components/list/load_more';
import chatInput from '@/components/detail/chatInput';
import userSelect from '@/components/base/user_or_dept_select';
import userInfo from '@/components/detail/user_info_card';
import EventBus from '@/utils/eventBus';
import auditBtn from '../components/auditBtn';
import dialogGroup from '@/components/base/dialog/dialog-group';
import share from '../components/share';
import specificList from '../components/specificList';
import previewImages from "@/components/base/previewImages";
import qwWaterMark from '@/directive/qwWaterMark';
import {ajaxView,listMoreComment,addTopicComment,topicPraise,topicJump,examineTopic,deleteComment,examineComment} from '../../api/getData';
export default {
  name:'topic-detail',
  data(){
    return {
      dataBase: dataBase,
      agent:'topic',
      detailTitleData:{
        title:'',
        status:{},
        creator:{},
        personName:'',
        createTime:'',
        configEdit:{},
        configCopy:{},
        content:'',
        picList:[],
        mediaList:[],
      },
      commentList:[],//评论列表
      listTotalRows:0,//评论总数
      loadMore:{//下拉加载更多配置
        loading:false,
        hasMore:false,
      },
      commentReqData:{
        id:'',
        size:10,
        page:1
      },
      scrollLock:false,//滚动锁
      showChatTool:false,//评论输入框组件是否显示
      autofocus:false,//评论输入框组件自动聚焦
      isPC:false,//是否是PC端
      isUeditor:0,//是否被PC端编辑过
      isShare:'0',//是否允许外部分享
      isWeChatApp:false,//是否是微信/企业微信app
      hasPraise:false,//是否已点赞
      isShowAnimate:false,//点赞动画
      praiseListStr:'',//点赞人列表字符串
      praiseNum:0,//点赞人数
      examineShow:true,//审核按钮是否显示
      commentExamineShow:false,//评论审核按钮是否显示
      examinePerson:'',//话题审核人
      examineStatus:5,//审核状态
      ableClick:true,
      dialog:{//弹出框
        title:'',
        show:false,
      },
      isPass:true,
      locationInfo:{
        corpId:'',
        agentCode:'',
        id:'',
        typeId:'',
        keyword:'',
        page:-1,
        status:0
      },
      isShowShare:false,//是否显示外部分享组件
      isOpen:false,//是否是外部分享页
      timeAndType:{
        isUpdate:false,
        editorName:'',
        lastEditTime:'',
        typeName:'',
        rangeName:'',
        viewCount:0
      },
      specificObj:{
        deptList:[],
        tagList:[],
        userList:[],
      },
      showSpecificList:false,
      showPassTip:false,//显示评论通过提示
      selectCommentObj:{},//选择通过或删除的的评论
      showAnony:false,//是否显示匿名评论
      isCommentAnony:false,//是否匿名评论
      isShareComment:false,//是否开启外部分享显示评论
      isComment:true,//是否允许评论
      source:0,//话题来源 1后台  0微信端'
      qwWaterMarkCofig : {
         agentCode: 'topic' // 所在应用的code值
      }
    }
  },
  created(){
    this.commentReqData.id=this.$route.query.id||_.getUrlParam('id');
    this.isOpen=this.$route.query.isOpen||false;
    this.agent=this.$route.query.agentCode||_.getUrlParam('agentCode')||'topic';
    Object.assign(this.locationInfo,{
      corpId:this.$route.query.corpId||_.getUrlParam('corpId'),
      agentCode:this.$route.query.agentCode||_.getUrlParam('agentCode')||'topic',
      id:this.$route.query.id||_.getUrlParam('id'),
      typeId:this.$route.query.typeId||_.getUrlParam('typeId')||'',
      keyword:this.$route.query.keyword||_.getUrlParam('keyword')||'',
      page:this.$route.query.page||_.getUrlParam('page')||'-1',
      status:this.$route.query.status||_.getUrlParam('status')||0
    })
    window.addEventListener('scroll',this.loadMoreList);
    this.getTopicDetail(this.commentReqData.id);
    this.isPC=this.checkIsPC();
    this.isWeChatApp=_.isWeChatApp();
  },
  beforeDestroy(){
    window.removeEventListener('scroll',this.loadMoreList)
  },
  directives: { qwWaterMark },
  computed:{

  },
  watch:{
    //避免相同路径不刷新
    '$route'(to,from){
      if(to.path==from.path||to.query.isOpen!=from.query.isOpen){
        location.reload();
      }
    }
  },
  methods:{
    //分享链接，配文字图片
    shareLink:function (title,img,summary,shareUrl) {
      _.checkApi.setDataForWeixinValue(title,img,summary,shareUrl);
    },
    //跳转编辑或复制界面
    clickEditOrCopy(obj){
      if(obj.text=='编辑'){
        if(this.isPC){
            this.$router.push({
            path:'/topicEditAndCopy',
            query:{
                id:this.commentReqData.id,
                status:0,
                agentCode:this.agent
            }
            })
        }else{
            if(this.isUeditor){
            _.alert('提示', "话题内容由富文本编辑器生成，请使用企业微信PC版编辑");
            }else{
            this.$router.push({
                path:'/topicEditAndCopy',
                query:{
                    id:this.commentReqData.id,
                    status:0,
                    agentCode:this.agent
                }
            })
            }
        }
      }else{
        if(this.isPC){
            this.$router.push({
            path:'/topicEditAndCopy',
            query:{
                id:this.commentReqData.id,
                agentCode:this.agent
            }
            })
        }else{
            if(this.isUeditor){
            _.alert('提示', "话题内容由富文本编辑器生成，请使用企业微信PC版复制");
            }else{
            this.$router.push({
                path:'/topicEditAndCopy',
                query:{
                id:this.commentReqData.id,
                agentCode:this.agent
                }
            })
            }
        }
      }
    },
    //获取话题详情
    getTopicDetail(id){
      let url=this.isOpen?'/open/topic/topicAction!ajaxView.action':'/topic/topicAction!ajaxView.action';
      ajaxView(url,id,(data)=>{
        Object.assign(this.detailTitleData,{
          title:data.tbXyhTopicPO.title,
          personName:data.tbXyhTopicPO.personName,
          createTime:data.tbXyhTopicPO.createTime
        })
        document.title=data.tbXyhTopicPO.title;
        this.examinePerson=data.tbXyhTopicPO.auditPerson||data.personName;
        this.examineShow=data.isTopicReviewer;
        this.commentExamineShow=data.isCommentReviewer;
        this.examineStatus=data.tbXyhTopicPO.status;
        Object.assign(this.timeAndType,{
          editorName:data.tbXyhTopicPO.editorName?data.tbXyhTopicPO.editorName:data.tbXyhTopicPO.userName,
          lastEditTime:data.tbXyhTopicPO.lastEditTime,
          typeName:data.tbXyhTopicPO.typeName,
          isUpdate:data.isUpdate
        })
        Object.assign(this.specificObj,{
          deptList:data.deptList?data.deptList:[],
          tagList:data.tagList?data.tagList:[],
          userList:data.userList?data.userList:[]
        })
        this.showAnony=data.tbXyhTopicPO.anonyComment=='1'&&data.isComment?true:false;
        this.isComment=data.tbXyhTopicPO.isComment=='0'?true:false;
        this.isShareComment=data.tbXyhTopicPO.shareComment=='1'?true:false;
        if(data.tbXyhTopicPO.targetRange=='1'){
          this.timeAndType.rangeName='所有人';
        }else if(data.tbXyhTopicPO.targetRange=='2'){
          this.timeAndType.rangeName='本部门';
        }else{
          this.timeAndType.rangeName='特定对象';
        }
        this.timeAndType.viewCount='('+data.tbXyhTopicPO.viewCount+')';
        let contentStr=data.tbXyhTopicPO.isUeditor=='1'?data.tbXyhTopicPO.content:data.tbXyhTopicPO.content.replace(/\u3000/g, '&emsp;').replace(/\u0020/g, '&nbsp;')
        this.detailTitleData.content=this.formatContent(contentStr);
        if(data.tbXyhTopicPO.coverImage){
          this.detailTitleData.content='<img src="'+_.compressURL+data.tbXyhTopicPO.coverImage+'"  width="100%">'+this.detailTitleData.content;
        }
        if(data.isTopicReviewer){
          if(data.tbXyhTopicPO.status=='2'){
            this.detailTitleData.status={name:'待审核',class:'status_green'}
          }else if(data.tbXyhTopicPO.status=='0'){
            this.detailTitleData.status={name:'已通过',class:'status_green'}
          }else{
            this.detailTitleData.status={name:'未通过',class:'status_red'}
          }
        }
        if(data.imagesList.length){
          for(let i=0;i<data.imagesList.length;i++){
            this.detailTitleData.content+='<img src="'+_.compressURL+data.imagesList[i].path+'" width="100%">'
          }
        }
        this.detailTitleData.mediaList=data.mediaList;
        this.listTotalRows=data.tbXyhTopicPO.commentCount;
        this.isShare=data.tbXyhTopicPO.isShare;
        this.hasPraise=data.hasPraise;
        if(data.comments&&data.comments.length){
          for(let i=0;i<data.comments.length;i++){
            data.comments[i].time=data.comments[i].createTime;
            if(this.commentExamineShow||data.comments[i].userId===_.userId||data.comments[i].auditStatus!='0'){
              this.commentList.push(data.comments[i]);
            }
          }
        }
        this.loadMore.hasMore=data.hasMore;
        this.isUeditor=data.tbXyhTopicPO.isUeditor;
        this.detailTitleData.isUeditor=this.isUeditor;
        if(_.userId==data.tbXyhTopicPO.creator){
          this.detailTitleData.configEdit={text:'编辑'};
          this.detailTitleData.configCopy={text:'复制'};
        }
        this.detailTitleData.creator={
          creator:data.tbXyhTopicPO.creator,
          personName:data.tbXyhTopicPO.personName
        }
        this.praiseNum=data.praisePager?data.praisePager.totalRows:0;
        this.source=data.tbXyhTopicPO.source;
        if(data.praisePager&&data.praisePager.pageData.length){
          for(let i=0;i<data.praisePager.pageData.length;i++){
            this.praiseListStr+=data.praisePager.pageData[i].personName+'，';
          }
          this.praiseListStr=this.praiseListStr.substr(0,this.praiseListStr.length-1);
          if(data.praisePager.currentPage<data.praisePager.totalPages){
            this.praiseListStr+='...';
          }
        }
        if(_.isAndroid()||_.isIOS()) {//手机端的分享链接
          let imgUrl=data.tbXyhTopicPO.coverImage?_.compressURL+data.tbXyhTopicPO.coverImage:'';
          this.shareLink(
            data.tbXyhTopicPO.title,
            imgUrl,
            data.tbXyhTopicPO.summary,
            window.location.href);
        }
      })
    },
    //修改富文本中的网址和图片地址
	formatContent(str){
      return str.replace(/@fileweb@\/compress/g,_.compressURL);
    },
    //处理删除按钮显示方法
    dealListDelete(item){
      let status=item.commentStatus;
      if(item.userId==_.userId&&status!='2'&&status!='1'&&
      (item.createTime=='刚刚'||(item.createTime.indexOf('分钟前')!=-1&&parseInt(item.createTime.split("分钟前")[0])<30))||item.auditStatus=='0'){
        return true;
      }else{
        return false;
      }
    },
    //获取更多评论
    getMoreComment(){
      listMoreComment(this.commentReqData,(data)=>{
        this.scrollLock=false;
        for(let i=0;i<data.comments.length;i++){
         data.comments[i].time=data.comments[i].createTime;
        }
        this.commentList=this.commentList.concat(data.comments);
        this.loadMore.hasMore=data.hasMore;
      })
    },
    loadMoreList(){
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      if(this.scrollLock||scrollTop==0){
        return ;
      }
      if(scrollTop + window.innerHeight >= document.body.scrollHeight) {
        if(this.loadMore.hasMore){
          this.scrollLock=true;
          this.commentReqData.page++;
          this.getMoreComment();
        }
      }
    },
    //显示输入框组件
    showCommnetInput(){
      this.showChatTool=true;
      this.autofocus=true;
    },
    //输入框发送事件
    updateContent(data){
      let topicId=this.$route.query.id||_.getUrlParam('id');
      let reqData={
        userId:_.userId,
        userIds:data.userIds||'',
        userIdsTmp:'',
        'tbXyhTopicCommentPO.topicId':topicId,
        'tbXyhTopicCommentPO.content':data.content,
        'tbXyhTopicCommentPO.type':data.type,
        'tbXyhTopicCommentPO.isAnony':this.isCommentAnony?1:0,
      }
      var self=this;
      addTopicComment(reqData,(result)=>{
        if(result.commentId){
          let commentInfo={
            userId:_.userId,
            commentId:result.commentId,
            headPic:this.isCommentAnony?'':_.headPic,
            personName:this.isCommentAnony?'匿名':_.personName,
            creator:_.userId,
            type:data.type,
            content:data.content,
            createTime:"刚刚",
            commentStatus:result.tbXyhTopicPO.status,
          }
          self.commentList.splice(0,0,commentInfo)
        }
        self.listTotalRows++;
      })
    },
    //关闭输入框
    closeChatMask(value){
      this.$refs.commentContent.value=value;
    },
    publish(){
      this.$refs.commentInput.buttonClick();
    },
    //判断是否是PC端
    checkIsPC(){
      var userAgentInfo = navigator.userAgent;
      var Agents = ["Android", "iPhone",
          "SymbianOS", "Windows Phone",
          "iPad", "iPod"];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
              flag = false;
              break;
          }
      }
      return flag;
    },
    // 查看个人头像信息
    atThisPersonUtil(user){
      if(this.detailTitleData.personName=='匿名'||this.source=='1'){
        return ;
      }
        if(user){
          EventBus.$emit("atThisPersonUtil",user);
        }
    },
    //点赞
    praise(){
      if(this.examineStatus!=0){
        return ;
      }
      topicPraise(this.locationInfo.id,(data)=>{
        this.praiseListStr='';
        this.hasPraise=data.hasPraise;
        this.isShowAnimate=data.hasPraise;
        this.praiseNum=data.praisePager.totalRows;
        if(data.praisePager.pageData.length){
          for(let i=0;i<data.praisePager.pageData.length;i++){
            this.praiseListStr+=data.praisePager.pageData[i].personName+'，';
          }
          this.praiseListStr=this.praiseListStr.substr(0,this.praiseListStr.length-1);
          if(data.praisePager.currentPage<data.praisePager.totalPages){
            this.praiseListStr+='...';
          }
        }
      })
    },
    //跳转用户列表界面
    gotoPersonList(){
      this.$router.push({
        path:'/userList',
        query:{
          id:this.locationInfo.id
        }
      })
    },
    //跳转页
    jumpPage(direction){
      let page=this.locationInfo.page;
      let status=this.locationInfo.status;
      this.isJump=true;
      if(page==''&&status==''){
        page=1;
        status=1;
      }
      if(direction=='pre'){
        page--;
        if(page==0){
          _.alert('提示','已经是第一篇了');
          return;
        }
      }else{
        page++;
      }
      let reqData={
        id:this.locationInfo.id,
        typeId:this.locationInfo.typeId,
        status,
        page,
        keyword:this.locationInfo.keyword
      }
      topicJump(reqData,(data)=>{
        reqData.id=data.topicId;
        this.$router.push({
          path:'/topicDetail',
          query:reqData
        })
      })
    },
    //审核通过
    pass(){
      this.dialog.title='确认通过审批？';
      this.dialog.show=true;
      this.isPass=true;
    },
    //审核不通过
    cannotPass(){
      this.dialog.title='确认不通过审批？';
      this.dialog.show=true;
      this.isPass=false;
    },
    cancelDialog(){
      this.dialog.show=false;
    },
    confirmDialog(){
      this.dialog.show=false;
      if(!this.showPassTip){
        let status=this.isPass?0:-1;
        let topicIds=this.locationInfo.id;
        let data={
          status,
          topicIds
        }
        examineTopic(data,(data)=>{
          this.examineStatus=status;
          this.detailTitleData.status=status==0?{name:'已通过',class:'status_green'}:{name:'未通过',class:'status_red'}
        })
      }else{
        this.showPassTip=false;
        let data={
          status:1,
          commentIds:this.selectCommentObj.data.commentId
        }
        examineComment(data,()=>{
          this.commentList[this.selectCommentObj.index].auditStatus='1';
          this.listTotalRows++;
        })
      }
    },
    //分享到外部
    share(){
      this.isShowShare=true;
    },
    //评论图片处理函数
    dealListIcon(){
      return ;
    },
    //显示评论文本内容
    dealListContent(item){
      const status = item.commentStatus;
      return status!="1"? true:false;
    },
    //显示通过按钮
    dealListPass(item){
      if(this.commentExamineShow){
        return item.auditStatus&&item.auditStatus!='1'?true:false;
      }else{
        return false
      }
    },
    //删除评论
    deleteThisComment(data,index){                                 // 删除评论
      if(data){
        this.deleteListIndex=index;
        var self=this;
        deleteComment(data.commentId,function (result) {  // 删除成功
          self.commentList.splice(self.deleteListIndex,1);
          self.listTotalRows--;
        });
      }
    },
    //通过评论
    passThisComment(data,index){
      this.showPassTip=true;
      this.dialog.title='确定通过审批？';
      this.dialog.show=true;
      this.selectCommentObj.data=data;
      this.selectCommentObj.index=index;
    },
    //展示特定对象
    showSpecific(rangeName){
      if(rangeName=='所有人'||rangeName=='本部门'){
        return ;
      }
      this.showSpecificList=true;
    },
    //隐藏特定对象列表
    hideSpecific(){
      this.showSpecificList=false;
    },
    //设置是否匿名评论
    setAnony(isAnony){
      this.isCommentAnony=isAnony;
    },
    //查看评论用户信息
    atCommentPerson(user){
      if(user){
        EventBus.$emit("atThisPersonUtil",user);
      }
    },
  },
  components:{
    detailTitle,
    commentList,
    loadMore,
    chatInput,
    userSelect,
    userInfo,
    auditBtn,
    dialogGroup,
    share,
    specificList,
    previewImages
  }

}
</script>
<style lang="scss" scoped>
@mixin arrow-icon ($transform: 0deg) {
  content: "";
  display: inline-block;
  width: 10px;
  height: 15px;
  vertical-align: -2px;
  background: url(~assets/images/CSSSprites.png);
  background-size: 101px 101px;
  -webkit-transform: rotate($transform);
  transform: rotate($transform);
}
  @media screen and (min-width: 1024px) {
    .qwui-topic-detail,.qwui-comment_input{
      width:740px!important;
    }
  }
@keyframes bigger {
  from {
    top: 15px;
    left: 17px;
    width: 20px;
    height: 20px;
    background: {
      size: 77px 20px;
      position: -19px 0;
    }
  }

  50% {
    top: 10px;
    left: 12px;
    width: 30px;
    height: 30px;
    background: {
      size: 116px 30px;
      position: -29px 0;
    }
  }

  to {
    top: 15px;
    left: 17px;
    width: 20px;
    height: 20px;
    background: {
      size: 77px 20px;
      position: -19px 0;
    }
  }
}
  .qwui-topic-detail{
    background: #fff;
    .qwui-detail{
      overflow: hidden;
      /deep/ img{
        max-width: 100%;
      }
    }
    .qwui-typeAndTime{
      color: #888;
      font-size: 13px;
      padding: 0 10px;
      .qwui-edit_time{
        margin-bottom: 15px;
      }
      .qwui-topic_type{
        padding: 2px 0 18px;
        div{
          display: inline-block;
          position: relative;
          top: 2px;
          width: 14px;
          height: 14px;
          background: url(~assets/images/icon-tips.png) center no-repeat;
          background-size: 14px 14px;
          margin-right: 5px;
        }
      }
    }
    .qwui-praise{
      .qwui-praise_operation{
        display: flex;
        justify-content: center;
        margin-bottom: 5px;
        .qwui-yellow_background{
           background: #fff6ea;
           border: 1px solid #ffe5c0 !important;
        }
        .qwui-operation_border{
          position: relative;
          width: 55px;
          height: 55px;
          border: 1px solid #ddd;
          border-radius: 50%;
          margin: 0 25px;
          cursor: pointer;
          .qwui-operation{
            position: absolute;
            width: 20px;
            height: 20px;
            top: 17px;
            left: 18px;
          }
          .qwui-thumb{
            background: url(~assets/images/ic_dz.png) center no-repeat;
            background-size: 77px 20px;
            background-position: 0;
          }
          .qwui-has_paaise{
            background: url(~assets/images/ic_dz.png) center no-repeat;
            background-size: 77px 20px;
            background-position: -19px;
          }
          .show-animate {
            animation-duration: .5s;
            animation-name: bigger;
          }
          .qwui-share{
            background: url(~assets/images/ic_dz.png) center no-repeat;
            background-size: 77px 20px;
            background-position: -38px;
          }
        }
      }
      .qwui-praise_list{
        margin: 15px 15px 0;
        padding: 10px 7px;
        background: #f6f6f6;
        .qwui-praise_num{
          font-size: 13px;
          color: #666;
          padding-bottom: 5px;
          overflow: hidden;
          .qwui-thumb_up{
            display: inline-block;
            width: 15px;
            height: 15px;
            font-size: 13px;
            color: #666;
            background: url(~assets/images/ic_thumb.png) bottom no-repeat;
            background-size: 15px 15px;
            padding-bottom: 5px;
            margin-right: 5px;
          }
        }
        .qwui-praise_name{
          line-height: 1.4;
          font-size: 14px;
          color: #999;
          overflow: hidden;
          .qwui-showMore{
            color: #73859c;
            cursor: pointer;
          }
        }
      }
    }
    .qwui-page_operation{
      display: flex;
      justify-content: space-between;
      height: 45px;
      line-height: 45px;
      color: #666;
      font-size: 14px;
      padding: 10px 10px 5px;
      .qwui-pre{
        cursor: pointer;
        &::before{
          @include arrow-icon(180deg);
          margin-right: 10px;
        }
      }
      .qwui-next{
        cursor: pointer;
        &::after{
          @include arrow-icon;
          margin-left: 10px;
        }
      }
    }
    .qwui-examine_btn{
      .qwui-examine_text{
        color: #888;
        font-size: 14px;
        padding: 7px 14px;
      }
      .qwui-has_examine{
        height: 44px;
        color: #ccc;
        text-align: center;
        line-height: 44px;
        font-size: 16px;
        border:1px solid rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        margin: 0 14px;
        background: #fdfcfd;
      }
    }
    .qwui-comment_height{
      height: 50px;
      background: #f6f6f6;
    }
    .qwui-separate{
      height: 15px;
      background: #f6f6f6;
    }
    .qwui-comment_tip{
      background: #f5f5f5;
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
      .qwui-publish_btn{
        color: rgb(178, 185, 200);
        font-size: 16px;
        text-align: left;
        margin-right: 10px;
        margin-left: -5px;
        cursor: pointer;
      }
    }
  }
  .qwui-dialogText{
    display: inline-block;
    color: #999;
    font-size: 14px;
    margin: 1px 30px 28px 31px;
  }
  .openFooterContent {
    width: 100%;
    height: 16px;
    line-height: 16px;
    padding: 10px 0;
    text-align: center;
    font-size: 0;
  }
  .openFooterContent a {
    font-size: 12px;
    color: #999;
  }
  .openFooterContent img {
    margin-right: 5px;
    width: 15px;
    height: 15px;
    vertical-align: middle;
  }
  .qwui-blue_font{
    color: #586c94;
  }
</style>


