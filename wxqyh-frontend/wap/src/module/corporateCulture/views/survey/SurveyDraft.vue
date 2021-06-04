<template>
  <div class="qwui-survey_list">
    <div class="searchFixed">
      <search-box :searchinput="searchBar"
                  @listenToSearchBox="showMsgFromSearchBox">
      </search-box>
    </div>
    <!-- 列表 -->
    <div
      ref="scroll_wrap">
      <surveyListItem :surveyObj="surveyObj"
                     @moreOperation="moreOperation"
                     @gotoDetail="gotoDetail">
      </surveyListItem>
    </div>
     <!-- 删除弹出框 -->
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
        :loading="surveyPageData.hasMore"
        :hasMore="surveyPageData.hasMore"
        :type="surveyPageData.type"
      >
      <span v-show="hasMoreBottom">已经到底了</span>
    </load-more>

  </div>
</template>

<script>
import searchBox from '@/components/base/search_box';
import surveyListItem from '../components/surveyListItem';
import dialogGroup from '@/components/base/dialog/dialog-group';
import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue';
import loadMore from '@/components/list/load_more'; // 加载更多组件
import {getSurvey,deleteSurvey,getSurveyDraftNum,getAgentName} from '../../api/getData';

export default {
  name:'topic-list',
  data(){
    return {
      searchBar:{
        show:true,
        ridMask:true,
      },
      url:'/portal/questionnairCtl/searchQuestionnairList.do',//请求链接
      reqData:{
        size:10,
        page:1,
        type:'',    //问卷情况当为空时，表示查询全部type=1时，进行中的问卷 type=2时，已关闭的问卷 type=3时，已结束的问卷
        status:'0',  //问卷状态
        title:'',   //关键词搜索，搜的是title
      },
      surveyObj:{
        survey: [],
        noContentTips:false,
      },

      firstEntry:true, //首次进入首页
      dialogTitle:'',
      dialogShow:false,
      dialogText:'',
      nowItem:{},
      nowItemIndex:0,
      dialogBottomConfig:{
        show: false, //控制弹窗显示与否
        btnConfig:[ //自定义弹框操作,可以设置回调函数
          {title:" 删除", callBack: this.delete},
          {title:" 取消", primary:true}
        ]
      },
      confirmType:0,//弹出框类型，0为删除话题,1为一键已阅,2为审核
      surveyPageData:{
        hasMore: false,
        loading: true, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
        type:'commentList',
        scrollTop:0,//滚动的高度
      }
    }
  },
  computed:{
    hasMoreBottom(){
      return this.surveyObj.survey.length;
    }
  },
  watch:{
  },
  components: {
    searchBox,
    surveyListItem,
    dialogGroup,
    dialog_mask_bottom,
    loadMore,
  },
  created(){
      this.showMsgFromSearchBox();
      window.addEventListener('scroll',this.scrollList);
  },
  beforeDestroy(){
    window.removeEventListener('scroll',this.scrollList)
  },
  methods:{
    //搜索框回调
    showMsgFromSearchBox(title, val, isOption){
      this.surveyObj.survey=[];
      this.reqData.title=title;
      this.reqData.page=1;
      this.getSurveyByKeyWord();
    },
    //获取问卷
    getSurveyByKeyWord(){
      this.surveyPageData.scrollLock=true;
      getSurveyDraftNum(this.reqData,this.url,(result)=>{
        let val=result;
        this.surveyPageData.scrollLock=false;
        this.surveyPageData.hasMore=val.hasMore;
        if(val.questionnaireList.length){
          this.surveyObj.noContentTips=false;
          for(let i=0;i<val.questionnaireList.length;i++){
            if(val.questionnaireList[i].headPic){
                val.questionnaireList[i].headPic=val.questionnaireList[i].headPic
              }else{
                val.questionnaireList[i].headPic=require('assets/images/touxiang02.png');
              }
            this.surveyObj.survey.push(val.questionnaireList[i]);
          }
        }else{
          this.surveyObj.noContentTips=true;
        }
      });
    },
   //跳转详情页
    gotoDetail(itemObj){
      let agentCode = this.$route.query.agentCode||_.getUrlParam('agentCode')||'survey';
      document.location.href=_.baseURL+'/jsp/wap/question/add.jsp?id='+itemObj.item.id+'&agentCode='+agentCode;
    },
    //显示更多操作
    moreOperation(itemObj){
      this.dialogBottomConfig.show=true;
      this.nowItem=itemObj.item;
      this.nowItemIndex=itemObj.index;
    },
    //弹出框确定事件
    confirmDialog(){
        deleteSurvey(this.nowItem.id,()=>{
          this.surveyObj.survey=[];
          this.getSurveyByKeyWord();
        })
      this.dialogShow=false;
    },
    //取消弹框
    cancelDialog(){
      this.dialogShow=false;
    },
    //关闭提示
    delete(){
      this.dialogShow=true;
      this.confirmType=0;
      this.dialogTitle='确认删除草稿';
      this.dialogText='删除后该草稿将无法恢复';
      this.dialogBottomConfig.show=false;
    },
    // 滚动加载更多事件
    scrollList(event){
      // 将当前滚动高度存储
      let surveyPageData = this.surveyPageData;
      var scrollTop = document.documentElement.scrollTop|| document.body.scrollTop || window.pageYOffset ;
      this.surveyPageData.scrollTop=scrollTop;
      // 如果有请求事件则锁定, 不再请求
      if (surveyPageData.scrollLock||scrollTop==0) return;
      if (scrollTop + window.innerHeight >= document.body.scrollHeight) {
        if (surveyPageData.hasMore) {
          this.reqData.page++;
          this.getSurveyByKeyWord();
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>

  .qwui-survey_list{
      margin-top: -32px;
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
    .qwui-survey_list,.tabFixed,.searchFixed,.unReadFixed{
      width:740px!important;
    }
  }
  .fixedHeight{
    height: 88px;
  }
  .yellowFont{
    color:#F39344;
  }
  .darkFont{
    color:#B2B9C8;
  }

</style>


