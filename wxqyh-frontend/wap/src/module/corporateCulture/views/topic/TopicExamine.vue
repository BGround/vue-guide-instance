<template>
  <div class="qwui-topic_examine">
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
    <topicListItem 
      ref="topicList"
      :topicObj="topicObj"
      :ableSelect="ableSelect"
      @gotoDetail="gotoDetail"
      @checkboxClick="checkboxClick">
    </topicListItem>
    <!-- 审核按钮 -->
    <audit-btn 
      v-if="btnShow"
      class="qwui-bottom_btn qwui-btn_box"
      :ableClick="ableClick"
      @cannotPass="cannotPass"
      @pass="pass">
    </audit-btn>
    <!-- 弹出框 -->
    <dialog-group
      :title="dialog.title"
      :show="dialog.show"
      @cancel="cancelDialog"
      @confirm="confirmDialog"
      cancelText="取消"
      confirmText="确定">
      <p v-if="isPass" class="qwui-dialogText">审批通过后，用户将会看到该内容</p>
      <p v-if="!isPass" class="qwui-dialogText">不通过该话题，用户将无法看到该话题内容</p>
    </dialog-group>
    <!-- 加载更多 -->
    <load-more
        :class="{'qwui-examine_list':reqData.status==2}"
        :loading="loadMore.loading"
        :currPage="loadMore.currPage"
        :maxPage="loadMore.maxPage"
        @loadMoreClick="loadMoreList"
      >
      <span v-show="hasMore">已经到底了</span>
    </load-more>
  </div>
</template>
<script>
import navTabs from '@/components/base/nav_tabs';
import auditBtn from '../components/auditBtn';
import dialogGroup from '@/components/base/dialog/dialog-group';
import topicListItem from '../components/topicListItem';
import loadMore from '@/components/list/load_more';
import {countTopicAuditNumber,getPagerTopicInfo,examineTopic} from '../../api/getData';
export default {
  name:'topic-examine',
  data(){
    return {
      tabs:[//tab栏
        {text:'待审核'},
        {text:'已通过'},
        {text:'未通过'}
      ],
      indexControl:0,//tab默认选中项
      topicObj:{//话题
        topTopic:[],
        normalTopic:[],
        noContentTips:false,
        noContentText:"社区话题招募楼主，快来抢沙发～",
      },
      ableClick:false,//按钮是否能点击
      btnShow:true,//按钮是否显示
      dialog:{//弹出框
        title:'',
        show:false,
      },
      isPass:true,//点击的是否是通过按钮
      ableSelect:true,//显示多选框
      reqData:{//请求的参数
        status:2,
        page:1
      },
      loadMore:{//下拉加载更多配置
        loading:false,
        currPage:1,
        maxPage:1,
      },
      scrollLock: false, // 滚动锁，防止下拉多次请求
      selectList:[],//多选框选中的项
      isAjax:false,//是否正在请求数据
    }
  },
  computed:{
    hasMore(){
      return this.topicObj.normalTopic.length&&!this.loadMore.loading;
    }
  },
  created(){
    this.getTopicAuditNum();
    this.getAuditTopic();
    window.addEventListener('scroll',this.scrollList);
  },
  beforeDestory(){
    window.removeEventListener('scroll',this.scrollList);
  },
  methods:{
    //tab切换回调
    listenNavTabsBack(index){
      if(this.scrollLock){
        return ;
      }
      this.topicObj.normalTopic=[];
      this.reqData.page=1;
      switch(index){
        case 0:
          this.reqData.status=2;
          this.btnShow=true;
          this.ableSelect=true;
        break;
        case 1:
          this.reqData.status=0;
          this.btnShow=false;
          this.ableSelect=false;
        break;
        case 2:
          this.reqData.status=-1;
          this.btnShow=false;
          this.ableSelect=false;
        break;
      }
      this.getAuditTopic();
    },
    //获取审核话题数量
    getTopicAuditNum(){
      countTopicAuditNumber((data)=>{
        this.tabs[0].text='待审核('+data.waitAudit+')';
        this.tabs[1].text='已通过('+data.auditPass+')';
        this.tabs[2].text='未通过('+data.noAuditPass+')';
      })
    },
    //不通过话题
    cannotPass(){
      this.isPass=false;
      this.dialog.title='确认不通过审批？';
      this.dialog.show=true;
    },
    //通过话题
    pass(){
      this.isPass=true;
      this.dialog.title='确认通过审批？';
      this.dialog.show=true;
    },
    //弹出框取消事件
    cancelDialog(){
      this.dialog.show=false;
    },
    //弹出框确定事件
    confirmDialog(){
      this.dialog.show=false;
      let status=this.isPass?0:-1;
      let topicIds='';
      for(let i=0;i<this.selectList.length;i++){
        topicIds+=this.selectList[i]+',';
      }
      let data={
        status,
        topicIds
      }
      examineTopic(data,(data)=>{
        for(let i=0;i<this.selectList.length;i++){
          let index=this.findIndexById(this.selectList[i]);
          this.topicObj.normalTopic.splice(index,1);
        }
        this.getTopicAuditNum();
        this.selectList=[];
        this.$refs.topicList.selectList=[];
        this.ableClick=false;
      })
    },
    //跳转详情页
    gotoDetail(obj){
      this.$router.push({
        path:'/topicDetail',
        query:{
          id:obj.item.topicId
        }
      })
    },
    //获取待审核的话题
    getAuditTopic(){
      if(this.isAjax){
        return ;
      }
      this.isAjax=true;
      getPagerTopicInfo(this.reqData,(data)=>{
        this.loadMore.currPage=data.currPage;
        this.loadMore.maxPage=data.maxPage;
        this.scrollLock=false;
        this.isAjax=false;
        this.loadMore.loading=data.currPage<data.maxPage?true:false;
        if(data.currPage<=data.maxPage){
          for(let i=0;i<data.pageData.length;i++){
            data.pageData[i].coverImage=data.pageData[i].coverImage?_.compressURL+data.pageData[i].coverImage:require('../../../../assets/svg/img_a-list_default.svg');
            this.topicObj.normalTopic.push(data.pageData[i]);
          }
        }
      })
    },
    //点击加载更多
    loadMoreList(){
      this.reqData.page++;
      this.getAuditTopic();
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
          this.getAuditTopic();
        }
      }
    },
    //多选框回调
    checkboxClick(selectList){
      this.ableClick=selectList.length?true:false;
      this.selectList=selectList;
    },
    findIndexById(topicId){
      let index=-1;
      for(let i=0;i<this.topicObj.normalTopic.length;i++){
        if(this.topicObj.normalTopic[i].topicId==topicId){
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
    dialogGroup,
    topicListItem,
    loadMore,
  }
}
</script>
<style lang="scss" scoped>
.qwui-topic_examine{
  .qwui-nav_height{
    height:40px;
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


