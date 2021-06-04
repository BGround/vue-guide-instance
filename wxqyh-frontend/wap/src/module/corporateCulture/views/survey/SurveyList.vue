<template>
  <div class="qwui-survey_list">
    <div class="searchFixed">
      <search-box :searchinput="searchBar"
                  @listenToSearchBox="showMsgFromSearchBox">
      </search-box>
    </div>
    <!-- tabs -->
    <div class="tabFixed">
      <vue-group-tab :selected="tabSelected" @click="tabClick">
        <vue-tab :text="item.typeName"
                  :value="item.id"
                  v-for="(item,index) in surveyList"
                  :key="index">
        </vue-tab>
      </vue-group-tab>
    </div>
    <div v-if="isApprovalTab" class="approval-container">
      <approvalList></approvalList>
    </div>
    <template v-else>
        <!-- 列表 -->
        <div>
          <surveyListItem :surveyObj="surveyObj"
                         @moreOperation="moreOperation"
                         @gotoDetail="gotoDetail">
          </surveyListItem>
        </div>
         <!-- 关闭or删除弹出框 -->
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

          <!-- 加号 -->
        <cultureAddPopup :popupList="popupList" :jumpURL="jumpURL" ref="popUp"></cultureAddPopup>

    </template>
  </div>
</template>

<script>
import searchBox from '@/components/base/search_box';
import surveyListItem from '../components/surveyListItem';
import vueTab from '@/components/base/qwuiTab/tab.vue';
import vueGroupTab from '@/components/base/qwuiTab/tab_group';
import dialogGroup from '@/components/base/dialog/dialog-group';
import dialog_mask_bottom from '@/components/base/dialog_mask_bottom.vue';
import loadMore from '@/components/list/load_more'; // 加载更多组件
import cultureAddPopup from '../components/cultureAddPopup';
import {getSurvey,closeSurvey,getSurveyDraftNum,getAgentName} from '../../api/getData';
import approvalList from '../components/approval/list'

export default {
  name:'topic-list',
  data(){
    return {
      searchBar:{
        show:true,
        ridMask:true,
      },
      url:'/portal/questionnairCtl/searchQuestionnairListByJoin.do',//请求链接
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
      tabSelected:'',//tab的选中
      tabText:'',//tab项的text
      surveyList:[
        {typeName:'全部',id:'all'},
        {typeName:'进行中',id:'going'},
        {typeName:'已结束',id:'ending'},
        {typeName:'已关闭',id:'close'},
        {typeName:'我发布的',id:'myPubclish'},
        {typeName:'我审核的',id:'myApproval'},
        {typeName:'我参与的',id:'myJoin'},
      ],
      firstEntry:true, //首次进入首页
      dialogTitle:'',
      dialogShow:false,
      dialogText:'',
      nowItem:{},
      nowItemIndex:0,
      dialogBottomConfig:{
        show: false, //控制弹窗显示与否
        btnConfig:[ //自定义弹框操作,可以设置回调函数
          {title:" 关闭", callBack: this.close},
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
      },
      popupList:[
        {},
        {
          name:'新建问卷',
          url:_.baseURL+'/jsp/wap/question/add.jsp?agentCode=&abc=1',
          type:'survey',
          isShow:true,
        },
        {
          name:'草稿',
          url:_.baseURL+'/vp/module/culture.html#/surveyDraft',
          type:'draft',
          isShow:true,
        },
      ],
      jumpURL:'',
      isApprovalTab: false,
    }
  },
  computed:{
    hasMoreBottom(){
      return this.surveyObj.survey.length;
    }
  },
  components: {
    searchBox,
    surveyListItem,
    vueTab,
    vueGroupTab,
    dialogGroup,
    dialog_mask_bottom,
    loadMore,
    cultureAddPopup,
    approvalList
  },
  created(){
    this.agentCode=this.$route.query.agentCode|| _.getUrlParam('agentCode')||'survey';
    // 从路由获取agentName，赋值给document.title
    getAgentName('survey',(result) => {
      let titleNameArr = result.data.list;
      document.title = this.agentCode === 'partyconstruction'? '民意调研':titleNameArr[0].agentName;
    })
    this.getDraftInfo();
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
      getSurvey(this.reqData,this.url,(result)=>{
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
    //点击话题类型
    tabClick(val,text,index){
      if(this.surveyPageData.scrollLock||this.tabSelected === index){
        return ;
      }
      this.isApprovalTab = (val === 'myApproval')
      this.tabSelected=index;
      this.surveyObj.survey=[];
      this.reqData.page=1;
      this.reqData.status='0';
      this.surveyObj.noContentTips=false;
       switch(val){
        case "going":
          this.reqData.type=1;
          this.url = '/portal/questionnairCtl/searchQuestionnairListByJoin.do';
        break;
        case "close":
          this.reqData.type=2;
          this.url = '/portal/questionnairCtl/searchQuestionnairListByJoin.do';
        break;
        case "ending":
          this.reqData.type=3;
          this.url = '/portal/questionnairCtl/searchQuestionnairListByJoin.do';
        break;
        case "all":
          this.reqData.type='';
          this.reqData.status='0';
          this.url = '/portal/questionnairCtl/searchQuestionnairListByJoin.do';
        break;
        case "myPubclish":
          this.reqData.type='';
          this.reqData.status='1';
          this.url = '/portal/questionnairCtl/searchQuestionnairList.do'
        break;
        case "myJoin":
          this.reqData.type='';
          this.reqData.status='1';
          this.url = '/portal/questionnairCtl/searchQuestionnairListByJoin.do';
        break;
        default:
          this.reqData.type='';
          this.url = '/portal/questionnairCtl/searchQuestionnairListByJoin.do';
        break;
      }
      this.getSurveyByKeyWord();
    },
    //显示更多操作
    moreOperation(itemObj){
      this.dialogBottomConfig.show=true;
      this.nowItem=itemObj.item;
      this.nowItemIndex=itemObj.index;
    },
    //弹出框确定事件
    confirmDialog(){
        closeSurvey(this.nowItem.id,()=>{
          this.surveyObj.survey=[];
          this.getSurveyByKeyWord();
          // this.surveyObj.survey.splice(this.nowItemIndex,1);
        })
      this.dialogShow=false;
    },
    //取消弹框
    cancelDialog(){
      this.dialogShow=false;
    },
    //关闭提示
    close(){
      this.dialogShow=true;
      this.confirmType=0;
      this.dialogTitle='提示';
      this.dialogText='问卷关闭后不可答题，确定关闭吗？';
      this.dialogBottomConfig.show=false;
    },
    //跳转详情页
    gotoDetail(itemObj){
      let agentCode = this.$route.query.agentCode||_.getUrlParam('agentCode')||'survey';
      document.location.href=_.baseURL+'/jsp/wap/question/detail.jsp?id='+itemObj.item.id+'&agentCode='+agentCode;
    },
    //获取草稿数量
    getDraftInfo(){
      this.url = '/portal/questionnairCtl/searchQuestionnairList.do';
      let agentCode=this.$route.query.agentCode||_.getUrlParam('agentCode')||'survey';
      getSurveyDraftNum(this.reqData,this.url,(data)=>{
        this.popupList=[];
        var draftName='草稿('+data.questionnaireList.length+')';
        if(data.questionnaireList.length!=0){
          this.popupList=[
            {},
            {
              name:'新建问卷',
              url:_.baseURL+'/jsp/wap/question/add.jsp?agentCode='+agentCode+"&abc=1",
              type:'survey',
              isShow:true,
            },
            {
              name:draftName,
              url:_.baseURL+'/vp/module/culture.html?agentCode='+agentCode+'&corp_id='+wxqyhConfig.orgConfigInfo.corpId+'#/surveyDraft',
              type:'draft',
              isShow:true,
            }
          ]
        }else{
          this.jumpURL=_.baseURL+'/jsp/wap/question/add.jsp?agentCode='+agentCode+"&abc=1";
        }
      });
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

    .approval-container{
      margin-top: 84px;
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


