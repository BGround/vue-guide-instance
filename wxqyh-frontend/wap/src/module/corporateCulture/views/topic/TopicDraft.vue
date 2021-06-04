<template>
  <div class="qwui-topic_draft" v-qw-water-mark="qwWaterMarkCofig">
    <div class="searchFixed" >
      <search-box :searchinput="searchBar"
        @listenToSearchBox="showMsgFromSearchBox">
      </search-box>
    </div>
    <div class="fixedHeight"></div>
    <div
      ref="scroll_wrap"
      v-windowscroll="scrollList">
      <topicListItem :topicObj="topicObj"
        :isDraft=true
        @moreOperation="moreOperation"
        @gotoDetail="gotoEdit">
      </topicListItem>
    </div>
    <dialog-group title="确认删除草稿"
      :show="dialogShow"
      @cancel="cancelDialog"
      @confirm="confirmDialog"
      cancelText="取消"
      confirmText="确定">
      <slot>
        <div class="returnTip">
          <p>删除后该草稿将无法恢复</p>
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
  </div>
</template>
<script>
import searchBox from '@/components/base/search_box';
import topicListItem from '../components/topicListItem';
import dialogGroup from '@/components/base/dialog/dialog-group';
import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue';
import loadMore from '@/components/list/load_more'; // 加载更多组件
import qwWaterMark from '@/directive/qwWaterMark';
import {getTopic,deleteTopic,batchCheck} from '../../api/getData';
export default {
  name:'topic-draft',
  data(){
    return {
      searchBar:{
        show:true,
      },
      url:'/topic/topicAction!searchMyPublishTopic.action',//请求链接
      reqData:{
        size:10,
        page:1,
        typeId:'',
        status:1,
        keyword:'',
      },
      topicPageData:{
        hasMore: false,
        loading: true, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
        type:'commentList',
        scrollTop:0,//滚动的高度
      },
      dialogShow:false,
      dialogBottomConfig:{
        show: false, //控制弹窗显示与否
        btnConfig:[ //自定义弹框操作,可以设置回调函数
          {title:" 删除", callBack: this.delete},
          {title:" 取消", primary:true}
        ]
      },
      nowItem:{},
      nowItemIndex:0,
      topicObj:{
        topTopic:[],
        normalTopic:[],
        noContentTips:false,
        noContentText:"社区话题招募楼主，快来抢沙发～",
      },
      pc:false,
      agentCode:'topic',
      qwWaterMarkCofig : {
         agentCode: 'topic' // 所在应用的code值
      }
    }
  },
  computed:{
    hasMoreBottom(){
      return this.topicObj.topTopic.length||this.topicObj.normalTopic.length;
    }
  },
  directives: { qwWaterMark },
  components:{
    searchBox,
    topicListItem,
    dialogGroup,
    dialog_mask_bottom,
    loadMore
  },
  created(){
    this.pc=this.isPC();
    this.getTopicDraft();
    this.agentCode=_.getUrlParam('agentCode')||'topic';
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
    //获取话题
    getTopicDraft(){
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
        }
      });
    },
    //搜索框回调
    showMsgFromSearchBox(keyWord, val, isOption){
      this.topicObj.topTopic=[];
      this.topicObj.normalTopic=[];
      this.reqData.keyword=keyWord;
      this.reqData.page=1;
      this.getTopicDraft();
    },
    //更多操作
    moreOperation(itemObj){
      this.dialogBottomConfig.show=true;
      this.nowItem=itemObj.item;
      this.nowItemIndex=itemObj.index;
    },
    //跳转编辑界面
    gotoEdit(itemObj){
      if(this.pc){
        this.$router.push({
          path:'/topicEditAndCopy',
          query:{
            id:itemObj.item.topicId,
            agentCode:this.agentCode,
            isDraft:true
          }
        })
      }else{
        if(itemObj.item.isUeditor=='1'){
          _.alert('提示', "话题内容由富文本编辑器生成，请使用企业微信PC版编辑");
        }else{
          this.$router.push({
            path:'/topicEditAndCopy',
            query:{
              id:itemObj.item.topicId,
              agentCode:this.agentCode,
              isDraft:true
            }
          })
        }
      }
    },
    //取消弹框
    cancelDialog(){
      this.dialogShow=false;
    },
    confirmDialog(){
      batchCheck(this.nowItem.topicId,()=>{
        deleteTopic(this.nowItem.topicId,()=>{
            this.topicObj.normalTopic.splice(this.nowItemIndex,1);
        })
      })
      this.dialogShow=false;
    },
    // 滚动加载更多事件
    scrollList(event){
      // 将当前滚动高度存储
      let topicPageData = this.topicPageData;
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      this.topicPageData.scrollTop=scrollTop;
      // 如果有请求事件则锁定, 不再请求
      if (topicPageData.scrollLock||scrollTop==0) return;
      if (scrollTop + window.innerHeight >= document.body.scrollHeight) {
        topicPageData.scrollLock = true; // 防止滚动多次请求
        if (topicPageData.hasMore) {
          this.reqData.page++;
          this.topicPageData.scrollLock=true;
          this.getTopicDraft();
        }
      }
    },
    //删除草稿
    delete(){
      this.dialogShow=true;
      this.dialogBottomConfig.show=false;
    },
  }
}
</script>
<style lang="scss" scoped>
  .qwui-topic_draft{
    .searchFixed{
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 10;
    }
    .fixedHeight{
      height: 43px;
    }
  }
  .returnTip{
    font-size: 15px;
    text-align: center;
    padding: 1px 30px 28px 31px;
  }
  @media screen and (min-width: 1024px) {
    .qwui-topic_draft,.searchFixed{
      width:740px!important;
    }
  }
</style>


