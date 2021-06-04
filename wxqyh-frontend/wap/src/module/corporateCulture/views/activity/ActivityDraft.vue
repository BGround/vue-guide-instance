<template>
  <div class="qwui-activity_draft" :class="{'qwui-activity_background':!activityListObj.noContentTips}">
    <!-- 搜索框 -->
    <div class="qwui-search_fixed">
      <search-box 
        :searchinput="searchBar"
        @listenToSearchBox="showMsgFromSearchBox">
      </search-box>
    </div>
    <!-- 列表项 -->
    <div class="qwui-activity_item">
      <activityListItem
        :activityListObj="activityListObj"
        :isDraft=true
        @moreOperation="moreOperation"
        @gotoDetail="gotoEdit"
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
  </div>
</template>
<script>
import searchBox from '@/components/base/search_box';
import activityListItem from '../components/activityListItem';
import dialogGroup from '@/components/base/dialog/dialog-group';
import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue';
import loadMore from '@/components/list/load_more';
import {ajaxActivityNum,ajaxGetactivity,ajaxBatchCheck,ajaxBatchDelete} from '../../api/getData';

export default {
  name:'activity-list',
  data(){
    return{
      searchBar:{//搜索框配置
        show:true,
        ridMask:true,
      },
      dialog:{//弹出框
        title:'提示',
        show:false,
        text:'是否删除该活动？'
      },
      dialogBottomConfig:{
        show: false, //控制弹窗显示与否
        btnConfig:[ //自定义弹框操作,可以设置回调函数
          {title:" 删除", callBack: this.delete},
          {title:" 取消", primary:true}
        ]
      },
      reqData:{//获取列表数据参数
        status:0,
        keyWord:'',
        page:1
      },
      loadMore:{
        loading:false,
        currPage:0,
        maxPage:0
      },
      activityListObj:{
        activityList:[],
        noContentTips:false,
        noContentTextOne:"活动还在筹备中...",
        noContentTextTwo:"赶紧创建活动邀请同事一起参加吧！",
      },//活动列表项
      isAjax:false,//是否正在请求数据
      activityItemIndex:0,//活动列表选中的项
      activityItem:{},
    }
  },
  computed:{
    hasMoreBottom(){
      return this.loadMore.currPage<this.loadMore.maxPage?false:true;
    }
  },
  created(){
    this.getActivity();
    window.addEventListener('scroll',this.scrollList);
  },
  beforeDestroy(){
    window.removeEventListener('scroll',this.scrollList);
  },
  methods:{
    //获取话题列表
    getActivity(){
      this.isAjax=true;
      ajaxGetactivity(this.reqData,(data)=>{
        this.isAjax=false;
        this.loadMore.currPage=data.currPage;
        this.loadMore.maxPage=data.maxPage;
        this.loadMore.loading=data.currPage<data.maxPage?true:false;
        this.activityListObj.noContentTips=false;
        data.pageData.length?
          this.activityListObj.activityList=
            this.activityListObj.activityList.concat(data.pageData):this.activityListObj.noContentTips=true;
      })
    },
    //搜索框回调
    showMsgFromSearchBox(keyWord, val, isOption){
      this.activityListObj.activityList=[];
      this.reqData.keyWord=keyWord;
      this.reqData.page=1;
      this.getActivity();
    },
    //更多操作
    moreOperation(activityObj){
      this.dialogBottomConfig.btnConfig=[ //自定义弹框操作,可以设置回调函数
        {title:" 删除", callBack: this.delete},
        {title:" 取消", primary:true}
      ];
      this.dialogBottomConfig.show=true;
      this.activityItem=activityObj.item;
      this.activityItemIndex=activityObj.index;
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
    gotoEdit(item){
      document.location.href=_.baseURL+'/jsp/wap/activity/edit.jsp?id='+item.activityId+'&status=0&source=list&agentCode=activity'
    },
    delete(){
      this.dialogBottomConfig.show=false;
      this.dialog.show=true;
    },
    compareTime(startTime,endTime){
      let startDate=new Date(Date.parse(startTime.replace(/-/g,   "/"))).getTime();
      let endDate=new Date(Date.parse(endTime.replace(/-/g,   "/"))).getTime();
      let diff=Math.abs((startDate - endDate))/(1000*60*60*24);
      return diff;
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
    dialogGroup,
    activityListItem,
    dialog_mask_bottom,
    loadMore,
  }
}
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1024px) {
  .qwui-search_fixed{
    width:740px!important;
  }
}
.qwui-activity_background{
    background: #fff;
  }
  .qwui-activity_draft{
    .qwui-search_fixed{
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 10;
    }
    .qwui-activity_item{
      padding-top: 46px;
    }
    .qwui-return_tip{
      font-size: 15px;
      text-align: center;
      padding: 1px 30px 28px 31px;
    }
  }
</style>

