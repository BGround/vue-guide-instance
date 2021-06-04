<template>
  <div class="qwui-topic_list" v-qw-water-mark="qwWaterMarkCofig">
    <div class="searchFixed">
      <search-box :searchinput="searchBar"
                  @listenToSearchBox="showMsgFromSearchBox">
      </search-box>
    </div>
    <!-- tabs -->
    <div class="tabFixed">
      <vue-group-tab :selected="tabSelected" @click="tabClick" ref="tabGroup">
        <vue-tab :text="item.typeName"
                  :value="item.id"
                  :classification="item.classification"
                  v-for="(item,index) in typeList"
                  :key="index"
                  :point="index==0?hasPoint:false"
                  >
        </vue-tab>
      </vue-group-tab>
    </div>

    <div :class="unReadShow&&allOrUnRead?'fixedHeight':'searchAndTabs'"></div>
    <!-- 未阅话题 -->
    <div v-if="unReadShow" class="unReadFixed">
      <div class="qwui-unread" v-if="unRead.isShow&&allOrUnRead" @click="gotoUnRead">
        <span class="unread_text">{{unRead.text}}</span>
        <img src="../../../../assets/images/icon_a-newtask-list_arrow-task.png" @click.stop="checkReadAll" class="unread_hide" alt="">
      </div>
      <div class="qwui-unread" v-if="!unRead.isShow&&allOrUnRead" @click="checkReadAll">
        <span class="unread_text">{{unRead.text}}</span>
      </div>
    </div>
    <!-- 审核 -->
    <div class="examineDiv" v-if="examineShow&&isAll">
      <div class="examinePadding">
        <div class="examine"  v-for="(item,index) in examine" :key="index" :class="{examineMargin:index!='commentExamine'}" @click="gotoExamine(item.type)">
          <div class="leftItem">
            <div class="examineTitle">{{item.titleText}}</div>
            <div class="examineNum" :class="[item.yellowFont?yellowFont:darkFont]">{{item.numText}}</div>
          </div>
          <div class="rightItem">
            <img :src="item.imgSrc" alt="">
          </div>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div
      ref="scroll_wrap">
      <topicListItem :topicObj="topicObj"
                     @moreOperation="moreOperation"
                     @gotoDetail="gotoDetail">
      </topicListItem>
    </div>
    <!-- 一键已阅弹出框 -->
    <dialog-group :title="dialogTitle"
                  :show="dialogShow"
                  @cancel="cancelDialog"
                  @confirm="confirmDialog"
                  cancelText="取消"
                  confirmText="确定">
      <slot>
        <div class="returnTip">
          <p>{{dialogText}}</p>
        </div>
      </slot>
    </dialog-group>
    <!-- 更多操作 -->
    <dialog_mask_bottom :dialogConfig="dialogBottomConfig"> </dialog_mask_bottom>
    <!-- 加载更多 -->
    <load-more
        :loading="topicPageData.hasMore"
        :hasMore="topicPageData.hasMore"
        :type="topicPageData.type"
      >
      <span v-show="hasMoreBottom">已经到底了</span>
    </load-more>
    <!-- 加号 -->
    <cultureAddPopup :popupList="popupList" :jumpURL="jumpURL" ref="popUp"></cultureAddPopup>
  </div>

</template>

<script>
import searchBox from '@/components/base/search_box';
import topicListItem from '../components/topicListItem';
import vueTab from '@/components/base/qwuiTab/tab.vue';
import vueGroupTab from '@/components/base/qwuiTab/tab_group';
import dialogGroup from '@/components/base/dialog/dialog-group';
import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue';
import loadMore from '@/components/list/load_more'; // 加载更多组件
import cultureAddPopup from '../components/cultureAddPopup';
import qwWaterMark from '@/directive/qwWaterMark';
import {getTopic,getTopicType,getUnreadTopic,checkAllRead,oneKeyRead,deleteTopic,batchCheck,myPublish,countTopicAuditNumber,countCommentAuditNumber,checkPermission,getDraftNum,getAgentName} from '../../api/getData';

export default {
  name:'topic-list',
  data(){
    return {
      searchBar:{
        show:true,
        ridMask:true,
      },
      topicObj:{
        topTopic:[],
        normalTopic:[],
        noContentTips:false,
        noContentText:"社区话题招募楼主，快来抢沙发～",
      },
      url:'/topic/topicAction!searchAllTopic.action',//请求链接
      reqData:{
        size:10,
        page:1,
        typeId:'',
        status:'',
        keyword:'',
      },
      topicPageData:{
        hasMore: false,
        loading: true, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
        type:'commentList',
        scrollTop:0,//滚动的高度
      },
      typeList:[
      ],
      unRead:{
        num:0,
        isShow:false,
        text:""
      },
      dialogTitle:'',
      dialogShow:false,
      dialogText:'',
      dialogBottomConfig:{
        show: false, //控制弹窗显示与否
        btnConfig:[ //自定义弹框操作,可以设置回调函数
          {title:" 编辑", callBack: this.gotoEdit},
          {title:" 复制", callBack: this.gotoCopy},
          {title:" 删除", callBack: this.delete},
          {title:" 取消", primary:true}
        ]
      },
      pc:false,
      nowItem:{},
      nowItemIndex:0,
      myChannel:[//我的频道分类
        {typeName:'未阅话题',id:'unRead',classification:'我的频道'},
        {typeName:'待审核',id:'unExamine',classification:'我的频道'},
        {typeName:'我参与的',id:'myJoin',classification:'我的频道'},
        {typeName:'我发布的',id:'myPubclish',classification:'我的频道'},
      ],
      unReadShow:false,//一键已阅是否显示
      tabSelected:0,//tab的默认选中
      hasGoDetail:0,//是否从未阅话题，待审核页面进入过详情页面
      confirmType:0,//弹出框类型，0为删除话题,1为一键已阅,2为审核
      temporarySel:0,//临时记录tab项
      tabText:'',//tab项的text
      allOrUnRead:true,//当前选中的是否的我的或未阅
      UnReadOrExam:false,//当前选中的是否是未阅或审核
      examine:{//审核
        topicExamine:{
          titleText:'话题审核',
          numText:'',
            imgSrc:require('../../../../assets/images/img_a-homepage_entrance1.png'),
          yellowFont:false,
          type:'topic',
        },
        commentExamine:{
          titleText:'评论审核',
          numText:'',
          imgSrc:require('../../../../assets/images/img_a-homepage_entrance2.png'),
          yellowFont:false,
          type:'comment',
        },
      },
      examineShow:false,//审核是否显示
      examPermission:{//审核权限
        isCommentReviewer:false,
        isTopicReviewer:false
      },
      popupList:[
        {},
        {
          name:'发表话题',
          url:_.baseURL+'/jsp/wap/topic/publish_topic.jsp?agentCode=topic&abc=1',
          type:'topic',
          isShow:true,
        },
        {
          name:'草稿',
          url:_.baseURL+'/vp/module/culture.html#/topicDraft',
          type:'draft',
          isShow:true,
        },
      ],
      jumpURL:'',
      yellowFont:'yellowFont',
      darkFont:'darkFont',
      isAll:true,
      agentCode:'topic', 
      recordHeight:0,
      firstEntry:true,
      qwWaterMarkCofig : {
         agentCode: 'topic' // 所在应用的code值
      }
    }
  },
  computed:{
    hasMoreBottom(){
      return this.topicObj.topTopic.length||this.topicObj.normalTopic.length;
    },
    hasPoint(){
      return this.examine.topicExamine.yellowFont||this.examine.commentExamine.yellowFont;
    }
  },
  watch:{
    '$route'(to,from){
      if((from.path=='/topicEditAndCopy'&&to.path=='/topicList')||(from.path=='/topicExamine'&&to.path=='/topicList')){
        this.reInitPage();
      }
    }
  },
  directives: { qwWaterMark },
  components: {
    searchBox,
    topicListItem,
    vueTab,
    vueGroupTab,
    dialogGroup,
    dialog_mask_bottom,
    loadMore,
    cultureAddPopup,
  },
  created(){
    this.agentCode=this.$route.query.agentCode||this.searchAgent('agentCode')||'topic';
    this.getType();
    this.pc=this.isPC();
  },
  beforeDestroy(){
    window.removeEventListener('scroll',this.scrollList)
  },
  activated:function(){
    // 从路由获取agentName，赋值给document.title
    getAgentName('topic',(result) => {
      let titleNameArr = result.data.list;
      document.title = this.agentCode === 'partyconstruction'? '党员社区':titleNameArr[0].agentName;
    })
    window.addEventListener('scroll',this.scrollList);
    this.getExamineNum();//重新获取审核数量
    this.getDraftInfo();
    if(this.hasGoDetail){
      this.$nextTick(() => {
        document.documentElement.scrollTop=this.recordHeight;
        document.body.scrollTop=this.recordHeight;
        window.pageYOffset=this.recordHeight;
      })
    }
    if(!this.firstEntry){
      this.tabClick(this.reqData.typeId,this.tabText,this.tabSelected);
    }
    this.firstEntry=false;
  },
  deactivated(){
    this.$refs.popUp.hideAddPopup();
    window.removeEventListener('scroll',this.scrollList)
  },
  methods:{
    //判断是否是PC端
    isPC(){
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
    //搜索框回调
    showMsgFromSearchBox(keyWord, val, isOption){
      this.topicObj.topTopic=[];
      this.topicObj.normalTopic=[];
      this.reqData.keyword=keyWord;
      this.reqData.page=1;
      this.getTopicByKeyWord();
    },
    //获取话题
    getTopicByKeyWord(){
      this.topicPageData.scrollLock=true;
      getTopic(this.reqData,this.url,(result)=>{
        let val=result;
        this.topicPageData.scrollLock=false;
        this.topicPageData.hasMore=val.hasMore;
        if(val.comments.length){
          this.topicObj.noContentTips=false;
          for(let i=0;i<val.comments.length;i++){
            if(val.comments[i].isTop!='0'){
              this.topicObj.topTopic.push(val.comments[i]);
            }else{
              if(val.comments[i].coverImage){
                val.comments[i].coverImage=_.compressURL+val.comments[i].coverImage
              }else{
                val.comments[i].coverImage=require('../../../../assets/svg/img_a-list_default.svg');
              }
              this.topicObj.normalTopic.push(val.comments[i]);
            }
          }
        }else{
          this.topicObj.noContentTips=true;
        }
      });
    },
    //点击话题类型
    tabClick(val,text,index){
      if(this.topicPageData.scrollLock){
        return ;
      }
      this.tabSelected=index;
      this.temporarySel=index;
      this.tabText=text;
      this.getUnReadNum(()=>{//每点击一次，就要从新获取未阅话题数量
        if(text=='未阅话题'){
          this.unRead.text=this.unRead.num+'条全部标记为已阅';
          this.unRead.isShow=false;
        }else{
          this.unRead.isShow=true;
          this.unRead.text=this.unRead.num+'条未阅话题';
        }
      });
      if(this.hasGoDetail){
        this.hasGoDetail=0;
        return ;
      }
      if(this.typeList.length==0){
        return ;
      }
      this.topicObj.topTopic=[];
      this.topicObj.normalTopic=[];
      this.topicObj.noContentText='';
      this.topicObj.noContentTips=false;
      this.reqData.typeId='';
      this.reqData.page=1;
      this.reqData.status='';
      this.unRead.isShow=true;
      this.allOrUnRead=false;
      this.examineShow=false;
      this.UnReadOrExam=false;
      this.isAll=false;
      switch(text){
        case "我发布的":
          this.topicObj.noContentText="你还没发布话题噢，快来分享你的动态～";
          this.url='/topic/topicAction!searchMyPublishTopic.action';
          this.reqData.status=0;
        break;
        case "我参与的":
          this.topicObj.noContentText="你还没参与过话题讨论呢";
          this.url='/topic/topicAction!searchMyJoinTopic.action';
          this.reqData.status=0;
        break;
        case "待审核":
          this.UnReadOrExam=true;
          this.topicObj.noContentText="没有审核的内容";
          this.reqData.status=2;
          this.url='/topic/topicAction!searchMyPublishTopic.action';
        break;
        case "未阅话题":
          this.allOrUnRead=true;
          this.UnReadOrExam=true;
          this.unRead.isShow=false;
          this.topicObj.noContentText="没有未阅话题了";
          this.url='/topic/topicAction!searchUnReadTopic.action';
        break;
        case "全部":
          this.allOrUnRead=true;
          this.url='/topic/topicAction!searchAllTopic.action';
          this.reqData.typeId=val;
          this.topicObj.noContentText="社区话题招募楼主，快来抢沙发～";
          this.isAll=true;
          this.getExamineNum();
        break;
        default:
          this.url='/topic/topicAction!searchAllTopic.action';
          this.reqData.typeId=val;
          this.topicObj.noContentText="社区话题招募楼主，快来抢沙发～";
        break;
      }
      this.getTopicByKeyWord();
    },
    //跳转未阅话题
    gotoUnRead(){
      this.unRead.text=this.unRead.num+'条全部标记为已阅';
      this.unRead.isShow=false;
      this.tabSelected=this.typeList.length-4;
    },
    //是否开启一键已阅
    checkReadAll(){
      checkAllRead(()=>{
        this.confirmType=1;
        this.dialogTitle='标记为已阅';
        this.dialogText='确认将所有未阅标记为已阅？';
        this.dialogShow=true;
      });
    },
    //取消弹框
    cancelDialog(){
      this.dialogShow=false;
    },
    //弹出框确定事件
    confirmDialog(){
      switch (this.confirmType){
        case 0:
          batchCheck(this.nowItem.topicId,()=>{
            deleteTopic(this.nowItem.topicId,()=>{
              this.topicObj.normalTopic.splice(this.nowItemIndex,1);
            })
          })
        break;
        case 1:
          oneKeyRead(()=>{
            this.dialogShow=false;
            this.unReadShow=false;
            if(this.unRead.text.indexOf('条全部标记为已阅')==1){//当前类型为未阅话题，清空数据
              this.topicObj.topTopic=[];
              this.topicObj.normalTopic=[];
              this.topicObj.noContentTips=true;
            }
          });
        break;
        case 2:
          this.dialogShow=false;
        break;
      }
      this.dialogShow=false;
    },
    //显示更多操作
    moreOperation(itemObj){
      this.dialogBottomConfig.show=true;
      this.nowItem=itemObj.item;
      this.nowItemIndex=itemObj.index;
    },
    gotoEdit(){
      if(this.pc){
        this.$router.push({
          path:'/topicEditAndCopy',
          query:{
            id:this.nowItem.topicId,
            status:0,
            agentCode:this.agentCode
          }
        })
      }else{
        if(this.nowItem.isUeditor){
          _.alert('提示', "话题内容由富文本编辑器生成，请使用企业微信PC版编辑");
        }else{
          this.$router.push({
            path:'/topicEditAndCopy',
            query:{
              id:this.nowItem.topicId,
              status:0,
              agentCode:this.agentCode
            }
          })
        }
      }
      this.dialogBottomConfig.show=false;
    },
    gotoCopy(){
      if(this.pc){
        this.$router.push({
          path:'/topicEditAndCopy',
          query:{
            id:this.nowItem.topicId,
            agentCode:this.agentCode
          }
        })
      }else{
        if(this.nowItem.isUeditor){
          _.alert('提示', "话题内容由富文本编辑器生成，请使用企业微信PC版复制");
        }else{
          this.$router.push({
            path:'/topicEditAndCopy',
            query:{
              id:this.nowItem.topicId,
              agentCode:this.agentCode
            }
          })
        }
      }
      this.dialogBottomConfig.show=false;
    },
    delete(){
      this.dialogShow=true;
      this.confirmType=0;
      this.dialogTitle='确认删除内容';
      this.dialogText='删除后该内容将无法恢复';
      this.dialogBottomConfig.show=false;
    },
    //加载更多
    showMsgFromLoadMore(val){
      if(val.comments.length){
        this.topicObj.noContentTips=false;
        for(let i=0;i<val.comments.length;i++){
          if(val.comments[i].isTop!='0'){
            this.topicObj.topTopic.push(val.comments[i]);
          }else{
            if(val.comments[i].coverImage){
              val.comments[i].coverImage=_.compressURL+val.comments[i].coverImage
            }else{
              val.comments[i].coverImage=require('../../../../assets/svg/img_a-list_default.svg');
            }
            this.topicObj.normalTopic.push(val.comments[i]);
          }
        }
      }else{
        this.topicObj.noContentTips=true;
      }
    },
    // 滚动加载更多事件
    scrollList(event){
      // 将当前滚动高度存储
      let topicPageData = this.topicPageData;
      var scrollTop = document.documentElement.scrollTop|| document.body.scrollTop || window.pageYOffset ;
      this.topicPageData.scrollTop=scrollTop;
      // 如果有请求事件则锁定, 不再请求
      if (topicPageData.scrollLock||scrollTop==0) return;
      if (scrollTop + window.innerHeight >= document.body.scrollHeight) {
        if (topicPageData.hasMore) {
          this.reqData.page++;
          this.getTopicByKeyWord();
        }
      }
    },
    //跳转详情页
    gotoDetail(itemObj){
      var scrollTop = document.documentElement.scrollTop|| document.body.scrollTop || window.pageYOffset ;
      this.recordHeight = scrollTop;
      this.topicPageData.scrollTop=scrollTop;
      let status=0;
      let typeId='';
      if(this.UnReadOrExam){//当前是否处于未阅话题或待审核
        this.hasGoDetail=0;
        this.reqData.page=1;
      }else{
        this.hasGoDetail=1;
      }
      switch(this.tabText){
        case '未阅话题':
          status=0
        break;
        case '我发布的':
          status=1
        break;
        case '我参与的':
          status=2
        break;
        default:
          status=5
        break;
      }
      if(this.reqData.typeId){
        typeId=this.reqData.typeId;
      }
      let agentCode = this.$route.query.agentCode||_.getUrlParam('agentCode')||'topic';
      //document.location.href=_.baseURL+'/jsp/wap/topic/topic_detail.jsp?id='+itemObj.item.topicId+'&typeId='+typeId+'&keyword='+this.reqData.keyword+'&status='+status+'&page='+(itemObj.topicIndex+1)+'&agentCode='+agentCode;
      this.$router.push({
        path:'/topicDetail',
        query:{
          id:itemObj.item.topicId,
          typeId:typeId,
          keyword:this.reqData.keyword,
          status:status,
          page:itemObj.topicIndex+1,
          agentCode:agentCode
        }
      })
    },
    //获取未阅话题数量
    getUnReadNum(callBack){
      getUnreadTopic((result)=>{
        if(result.data.unReadCount){
          this.unRead.num=result.data.unReadCount;
          this.unReadShow=true;
          callBack();
        }else{
          this.unReadShow=false;
        }
      });
    },
    //获取待审批的话题和评论数量
    getExamineNum(){
      checkPermission((result)=>{
        this.examPermission=result;
        if(result.isCommentReviewer||result.isTopicReviewer){
          this.examineShow=true;
            if(result.isTopicReviewer){
            countTopicAuditNumber((result)=>{
              if(result.waitAudit){
                this.examine.topicExamine.numText=result.waitAudit+'条待处理';
                this.examine.topicExamine.yellowFont=true;
              }else{
                this.examine.topicExamine.numText='暂无新话题';
                this.examine.topicExamine.yellowFont=false;
              }
            });
          }else{
            this.examine.topicExamine.numText='无需审核话题';
            this.examine.topicExamine.yellowFont=false;
          }
          if(result.isCommentReviewer){
            countCommentAuditNumber((result)=>{
              if(result.waitAudit){
                this.examine.commentExamine.numText=result.waitAudit+'条待处理';
                this.examine.commentExamine.yellowFont=true;
              }else{
                this.examine.commentExamine.numText='暂无新评论';
                this.examine.commentExamine.yellowFont=false;
              }
            });
          }else{
              this.examine.commentExamine.numText='无需审核评论';
              this.examine.commentExamine.yellowFont=false;
          }
        }
      })
    },
    //跳转审批界面
    gotoExamine(type){
      this.confirmType=3;
      if(type=='topic'){
        if(this.examPermission.isTopicReviewer){
          //document.location.href = _.baseURL+'/jsp/wap/topic/topic_verification.jsp';
          this.$router.push('/topicExamine');
        }else{
          this.dialogTitle='无审核权限 ';
          this.dialogText='请联系管理员确认';
          this.dialogShow=true;
        }
      }else{
        if(this.examPermission.isCommentReviewer){
          //document.location.href = _.baseURL+'/jsp/wap/topic/comment_verification.jsp';
          this.$router.push('/commentExamine')
        }else{
          this.dialogTitle='无审核权限 ';
          this.dialogText='请联系管理员确认';
          this.dialogShow=true;
        }
      }
    },
    //查找agentCode
    searchAgent(key,link=location.href){
      let reg = new RegExp('^[^\\?#]*\\?[^#]*?(|&)' + key + '=([^&#]*)'),
        match = link.match(reg);
      return match && match[2];
    },
    //获取话题类型
    getType(){
      getTopicType((result)=>{
        this.typeList=result.data.typeList;
        for(let i=0;i<this.typeList.length;i++){
          this.typeList[i].classification='话题分类';
        }
        this.typeList=this.typeList.concat(this.myChannel);
        this.typeList.unshift({typeName:'全部',value:'',classification:'话题分类',point:this.hasPoint});
      });
    },
    //获取草稿数量
    getDraftInfo(){
      getDraftNum((data)=>{
        this.popupList=[];
        var draftName='草稿('+data.userDraftopicNumber+')';
        let corpId=_.getUrlParam('corp_id')||'';
        let agentCode=this.agentCode;
        if(data.userDraftopicNumber!=0){
          this.jumpURL = '';
          this.popupList=[
            {
              name:'发表话题',
              url:_.baseURL+'/jsp/wap/topic/publish_topic.jsp?agentCode=topic&abc=1',
              type:'topic',
              isShow:false,
            },
            {
              name:'发表话题',
              url:_.baseURL+'/vp/module/culture.html?agentCode='+agentCode+'#/topicEditAndCopy',
              type:'topic',
              isShow:true,
            },
            {
              name:draftName,
              url:_.baseURL+'/vp/module/culture.html?agentCode='+agentCode+'#/topicDraft',
              type:'draft',
              isShow:true,
            }
          ]
          if(corpId){
            this.popupList[1].url=_.baseURL+'/vp/module/culture.html?corp_id='+corpId+'&agentCode='+agentCode+'#/topicEditAndCopy';
            this.popupList[2].url=_.baseURL+'/vp/module/culture.html?corp_id='+corpId+'&agentCode='+agentCode+'#/topicDraft';
          }
        }else{
          this.jumpURL=_.baseURL+'/vp/module/culture.html?corp_id='+corpId+'&agentCode='+agentCode+'#/topicEditAndCopy';
        }
      });
    },
    //重新请求数据
    reInitPage(){
      this.getExamineNum();//重新获取审核数量
      this.getDraftInfo();
      this.reqData={
        size:10,
        page:1,
        typeId:'',
        status:'',
        keyword:'',
      }
      this.tabText='全部';
      this.temporarySel=0;
      this.allOrUnRead=true;
      this.isAll=true;
      this.tabClick(this.reqData.typeId,this.tabText,this.temporarySel);
    }
  }
}
</script>

<style lang="scss" scoped>
  .qwui-topic_list{
    .searchFixed{
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 10;
    }
    .tabFixed{
      position: fixed;
      top: 43px;
      width: 100%;
      z-index: 10;
    }
    .searchAndTabs{
      height:84px;
    }
    .unReadFixed{
      position: fixed;
      top: 84px;
      width: 100%;
      z-index:5;
    }
    .examineDiv{
      background: #fff;
      .examinePadding{
        display: flex;
        padding:14px 14px 8px;
        justify-content:space-between;
        .examine{
          display: flex;
          height: 64px;
          flex:1;
          background: #F7F8FA;
          border-radius: 4px;
          justify-content:space-between;
          .leftItem{
            padding: 10px 0 11px 10px;
            .examineTitle{
              color: #0A1735;
              font-size: 16px;
              line-height: 16px;
              margin-bottom: 8px;
              padding-top: 2px;
              font-weight: 600;
            }
            .examineNum{
              font-size: 12px;
              line-height: 12px;
            }
          }
          .rightItem{
            margin: 10px 16px 0 0;
            img{
              width: 42px;
              height: 44px;
            }
          }
          .examineSep{
            width: 15px;
          }
        }
      }

    }
    .qwui-unread{
      position: relative;
      height:28px;
      line-height: 28px;
      text-align: center;
      background:#ECF3FF;
      cursor: pointer;
      .unread_text{
        color:#5585F0;
        font-size: 13px;
      }
    }
    .unread_hide{
      position: absolute;
      right: 11px;
      top:9px;
      cursor: pointer;
    }
  }
  .returnTip{
    font-size: 15px;
    text-align: center;
    padding: 1px 30px 28px 31px;
  }
  .examineMargin{
    margin-right: 15px;
  }
  @media screen and (min-width: 1024px) {
    .qwui-topic_list,.tabFixed,.searchFixed,.unReadFixed{
      width:740px!important;
    }
  }
  .fixedHeight{
    height: 112px;
  }
  .yellowFont{
    color:#F39344;
  }
  .darkFont{
    color:#B2B9C8;
  }

</style>


