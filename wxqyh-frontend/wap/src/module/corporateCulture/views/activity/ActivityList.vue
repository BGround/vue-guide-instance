<template>
  <div class="qwui-activity_list" :class="{'qwui-activity_background':!activityListObj.noContentTips}">
    <!-- 搜索框 -->
    <div class="qwui-search_fixed">
      <search-box
        :searchinput="searchBar"
        @listenToSearchBox="showMsgFromSearchBox">
      </search-box>
    </div>
    <!-- tab栏 -->
    <div class="qwui-tab_fixed">
      <vue-group-tab :selected="tabSelected" @click="tabClick">
        <vue-tab
          v-for="(item,index) in typeList"
          :text="item.typeName"
          :value="item.id"
          :classification="item.classification"
          :key="index"
          >
        </vue-tab>
      </vue-group-tab>
    </div>
    <!-- 列表项 -->
    <div class="qwui-activity_item">
      <activityListItem
        :activityListObj="activityListObj"
        @moreOperation="moreOperation"
        @gotoDetail="gotoDetail"
      >
      </activityListItem>
    </div>
    <!-- 弹出框 -->
    <dialog-group
      :title="dialog.title"
      :show="dialog.show"
      @cancel="cancelDialog"
      @confirm="confirmDialog"
      cancelText="取消"
      confirmText="确定">
      <slot>
        <div class="qwui-return_tip">
          <p>{{dialog.text}}</p>
        </div>
      </slot>
    </dialog-group>
    <!-- 更多操作 -->
    <dialog_mask_bottom :dialogConfig="dialogBottomConfig"> </dialog_mask_bottom>
    <!-- 加载更多 -->
    <load-more
        :loading="loadMore.loading"
        :currPage="loadMore.currPage"
        :maxPage="loadMore.maxPage"
      >
      <span v-show="hasMoreBottom">已经到底了</span>
    </load-more>
    <!-- 加号 -->
    <cultureAddPopup :popupList="popupList" :jumpURL="jumpURL"></cultureAddPopup>
  </div>
</template>
<script>
import searchBox from '@/components/base/search_box';
import vueTab from '@/components/base/qwuiTab/tab.vue';
import vueGroupTab from '@/components/base/qwuiTab/tab_group';
import activityListItem from '../components/activityListItem';
import dialogGroup from '@/components/base/dialog/dialog-group';
import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue';
import loadMore from '@/components/list/load_more';
import cultureAddPopup from '../components/cultureAddPopup';
import {ajaxActivityNum,ajaxGetactivity,ajaxBatchCheck,ajaxBatchDelete} from '../../api/getData';

export default {
  name:'activity-list',
  data(){
    return{
      searchBar:{//搜索框配置
        show:true,
        ridMask:true,
      },
      tabSelected:0,//tab栏默认选中的项
      typeList:[//tab项
        {typeName:'全部',id:'all',classification:'活动分类'},
        {typeName:'进行中',id:'conduct',classification:'活动分类'},
        {typeName:'已结束',id:'end',classification:'活动分类'},
        {typeName:'我发布的',id:'myPublish',classification:'活动分类'},
        {typeName:'我参与的',id:'myJoin',classification:'活动分类'},
      ],
      dialog:{//弹出框
        title:'提示',
        show:false,
        text:'是否删除该活动？'
      },
      dialogBottomConfig:{
        show: false, //控制弹窗显示与否
        btnConfig:[ //自定义弹框操作,可以设置回调函数
          {title:" 编辑", callBack: this.gotoEdit},
          {title:" 复制", callBack: this.gotoCopy},
          {title:" 删除", callBack: this.delete},
          {title:" 取消", primary:true}
        ]
      },
      loadMore:{
        loading:false,
        currPage:0,
        maxPage:0
      },
      popupList:[
        {},
        {
          name:'新建活动',
          url:_.baseURL+'/jsp/wap/topic/publish_topic.jsp?agentCode=topic&abc=1',
          type:'activity',
          isShow:true,
        },
        {
          name:'草稿',
          url:_.baseURL+'/vp/module/culture.html#/activityDraft',
          type:'draft',
          isShow:true,
        },
      ],
      jumpURL:'',
      reqData:{//获取列表数据参数
        status:5,
        keyWord:'',
        page:1
      },
      activityListObj:{
        activityList:[],
        noContentTips:false,
        noContentTextOne:"活动还在筹备中...",
        noContentTextTwo:"赶紧创建活动邀请同事一起参加吧！",
      },//活动列表项
      isAjax:false,//是否正在请求数据
      nowSelected:0,//当前选中的tab项
      activityItemIndex:0,//活动列表选中的项
      activityItem:{},
    }
  },
  computed:{
    hasMoreBottom(){
      return this.loadMore.currPage<this.loadMore.maxPage||this.activityListObj.noContentTips?false:true;
    },
  },
  created(){
    let status=_.getUrlParam('status')||5;
    if(status==3){
      this.reqData.status=3;
      this.tabSelected=1;
      this.nowSelected=1;
    }
    this.getDraftNum();
    this.getActivity();
    window.addEventListener('scroll',this.scrollList);
  },
  beforeDestroy(){
    window.removeEventListener('scroll',this.scrollList);
  },
  methods:{
    //获取草稿数量
    getDraftNum(){
      let agentCode=this.$route.query.agentCode||_.getUrlParam('agentCode')||'activity';
      ajaxActivityNum((data)=>{
        if(data.draftNum){
          let draftName='草稿('+data.draftNum+')';
          this.popupList=[
            {},
            {
              name:'新建活动',
              url:_.baseURL+'/jsp/wap/activity/add.jsp?agentCode='+agentCode,
              type:'activity',
              isShow:true,
            },
            {
              name:draftName,
              url:_.baseURL+'/vp/module/culture.html?agentCode='+agentCode+'&corp_id='+wxqyhConfig.orgConfigInfo.corpId+'#/activityDraft',
              type:'draft',
              isShow:true,
            },
          ]
        }else{
          this.jumpURL=_.baseURL+'/jsp/wap/activity/add.jsp?agentCode='+agentCode;
        }
      })
    },
    //获取话题列表
    getActivity(){
      this.isAjax=true;
      ajaxGetactivity(this.reqData,(data)=>{
        this.isAjax=false;
        this.loadMore.currPage=data.currPage;
        this.loadMore.maxPage=data.maxPage;
        this.loadMore.loading=data.currPage<data.maxPage?true:false;
        this.activityListObj.noContentTips=false;
        data.pageData.length?this.activityListObj.activityList=this.activityListObj.activityList.concat(data.pageData):this.activityListObj.noContentTips=true;
      })
    },
    //搜索框回调
    showMsgFromSearchBox(keyWord, val, isOption){
      this.activityListObj.activityList=[];
      this.reqData.keyWord=keyWord;
      this.reqData.page=1;
      this.getActivity();
    },
    //tab栏点击事件
    tabClick(val,text,index){
      if(this.isAjax||this.nowSelected===index){
        return ;
      }
      this.activityListObj.noContentTextOne='活动还在筹备中...';
      this.activityListObj.noContentTextTwo='赶紧创建活动邀请同事一起参加吧！';
      this.nowSelected=index;
      this.activityListObj.activityList=[];
      this.activityListObj.noContentTips=false;
      this.loadMore.currPage=0;
      this.loadMore.maxPage=0;
      switch(val){
        case 'all':
          this.reqData.status=5;
        break;
        case 'conduct':
          this.reqData.status=3;
        break;
        case 'end':
          this.reqData.status=4;
        break;
        case 'myPublish':
          this.reqData.status=1;
        break;
        case 'myJoin':
          this.reqData.status=2;
          this.activityListObj.noContentTextOne='What！你还没有参与活动？';
          this.activityListObj.noContentTextTwo='快来加入我们的活动吧！';
        break;
        default:
        break;
      }
      this.reqData.page=1;
      this.getActivity();
    },
    //更多操作
    moreOperation(activityObj){
      this.dialogBottomConfig.btnConfig=[ //自定义弹框操作,可以设置回调函数
        {title:" 编辑", callBack: this.gotoEdit},
        {title:" 复制", callBack: this.gotoCopy},
        {title:" 删除", callBack: this.delete},
        {title:" 取消", primary:true}
      ];
      let nowTime=new Date();
      let startTime=new Date(activityObj.item.activityStart.replace(/-/gi,"/"));
      this.activityItem=activityObj.item;
      this.activityItemIndex=activityObj.index;
      if(startTime<nowTime){//活动开始前可以编辑活动
        this.dialogBottomConfig.btnConfig.splice(0,1);
      }
      this.dialogBottomConfig.show=true;
    },
    gotoDetail(activityObj){
      document.location.href=_.baseURL+'/jsp/wap/activity/activity_detail.jsp?id='+activityObj.activityId+'&corp_id='+wxqyhConfig.orgConfigInfo.corpId+'&agentCode=activity';
    },
    //弹出框取消
    cancelDialog(){
      this.dialog.show=false;
    },
    //弹出框确定
    confirmDialog(){
      this.dialog.show=false;
      ajaxBatchCheck(this.activityItem.activityId,(data)=>{
        if(data.haveRegis){
          _.alert('提示','标题为【'+this.activityItem.title+'】已经有人报名,不可以删除');
          return ;
        }
        if(data.haveComment){
          _.alert('提示','标题为【'+this.activityItem.title+'】已被评论，不可以删除');
          return ;
        }
        ajaxBatchDelete(this.activityItem.activityId,(data)=>{
          this.activityListObj.activityList.splice(this.activityItemIndex,1);
          if(!this.activityListObj.activityList.length){
            this.loadMore.currPage=0;
            this.loadMore.maxPage=0;
            this.activityListObj.noContentTips=true;
          }
        })
      })
    },
    gotoEdit(){
      this.dialogBottomConfig.show=false;
      document.location.href=_.baseURL+'/jsp/wap/activity/edit.jsp?id='+this.activityItem.activityId+'&agentCode=activity'
    },
    gotoCopy(){
      this.dialogBottomConfig.show=false;
      document.location.href=_.baseURL+'/jsp/wap/activity/copy.jsp?id='+this.activityItem.activityId+'&status=1&agentCode=activity';
    },
    delete(){
      this.dialogBottomConfig.show=false;
      this.dialog.show=true;
    },
    scrollList(){
      var scrollTop=document.documentElement.scrollTop||document.body.scrollTop||window.pageYOffset;
      if(this.isAjax||scrollTop===0) return ;
      if(scrollTop+window.innerHeight>=document.body.scrollHeight){
        if(this.loadMore.maxPage>this.loadMore.currPage){
          this.reqData.page++;
          this.getActivity();
        }
      }
    }
  },
  components:{
    searchBox,
    vueTab,
    vueGroupTab,
    dialogGroup,
    activityListItem,
    dialog_mask_bottom,
    loadMore,
    cultureAddPopup
  }
}
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1024px) {
  .qwui-search_fixed,.qwui-tab_fixed,.qwui-activity_item{
    width:740px!important;
  }
}
  .qwui-activity_background{
      background: #fff;
    }
  .qwui-activity_list{
    .qwui-search_fixed{
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 10;
    }
    .qwui-tab_fixed{
      position: fixed;
      top: 43px;
      width: 100%;
      z-index: 10;
    }
    .qwui-activity_item{
      padding-top: 84px;
    }
    .qwui-return_tip{
      font-size: 15px;
      text-align: center;
      padding: 1px 30px 28px 31px;
    }
  }
</style>

