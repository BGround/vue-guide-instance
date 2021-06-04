import Vue from 'vue'
import Router from 'vue-router'

//企微云文化主页
let cultureIndex = r => require.ensure([],()=>r(require('./views/cultureIndex')),'culture_index');
let appManagment = r => require.ensure([],()=>r(require('./views/AppManagement')),'app_management');

//同事社区列表页
const TopicList = r =>require.ensure([],()=>r(require('./views/topic/TopicList')),'topic_list');
//同事社区草稿页
const TopicDraft = r =>require.ensure([],()=>r(require('./views/topic/TopicDraft')),'topic_draft');
//同事社区新建、编辑、复制界面
let topicEditAndCopy = r => require.ensure([],()=>r(require('./views/topic/TopicEditAndCopy')),'topicEditAndCopy');
//同事社区话题审核页面
let topicExamine = r => require.ensure([],()=>r(require('./views/topic/TopicExamine')),'topicExamine');
//同事社区评论审核页面
let commentExamine = r => require.ensure([],()=>r(require('./views/topic/CommentExamine')),'commentExamine');
//同事社区话题详情页面
let topicDetail = r => require.ensure([],()=>r(require('./views/topic/TopicDetail')),'topicDetail');
//点赞用户列表页面
let userList = r => require.ensure([],()=>r(require('./views/topic/UserList')),'userList');
//活动列表
const activityList = r =>require.ensure([],()=>r(require('./views/activity/ActivityList')),'activity_list');
//活动列表
const activityDraft = r =>require.ensure([],()=>r(require('./views/activity/ActivityDraft')),'activity_draft');
//问卷投票列表页
const SurveyList = r =>require.ensure([],()=>r(require('./views/survey/SurveyList')),'survey_list');
//问卷投票草稿页
const SurveyDraft = r =>require.ensure([],()=>r(require('./views/survey/SurveyDraft')),'survey_draft');

const surveyDetail = r =>require.ensure([],()=>r(require('./views/survey/detail')),'survey_detail');


/*必配 start*/
Vue.use(Router)
function newRouterFun() {
  let newRouter = new Router({
    routes:[
      {
        path:'/',
        name:'cultureIndex',
        meta:{
          title:'',
        },
        component:cultureIndex,
      },
      {
        path:'/appManagement',
        name:'appManagement',
        meta:{
          title:'应用管理',
        },
        component:appManagment,
      },
      {
        path:'/topicEditAndCopy',
        name:'topicEditAndCopy',
        meta:{
          title:'发表话题'
        },
        component:topicEditAndCopy,
      },
      {
        path:'/topicList',//同事社区列表页
        name:'TopicList',
        meta:{
          title:'',
          keepAlive:true
        },
        component:TopicList,
      },
      {
        path:'/topicDraft',//同事社区草稿页
        name:'TopicDraft',
        meta:{
          title:'草稿',
        },
        component:TopicDraft,
      },
      {
        path:'/topicExamine',//同事社区话题审核页面
        name:'topicExamine',
        meta:{
          title:'话题审核'
        },
        component:topicExamine,
      },
      {
        path:'/commentExamine',//同事社区评论审核页面
        name:'commentExamine',
        meta:{
          title:'评论审核'
        },
        component:commentExamine,
      },
      {
        path:'/topicDetail',//同事社区话题详情页面
        name:'topicDetail',
        meta:{
          title:'话题详情'
        },
        component:topicDetail,
      },
      {
        path:'/userList',//点赞用户列表
        name:'userList',
        meta:{
          title:'点赞用户列表'
        },
        component:userList,
      },
      {
        path: '/open/detail',
        name: 'open_detail',
        meta: {
          title: '详情页'
        },
        component: topicDetail,//外部分享详情
      },
      {
        path:'/activityList',
        name:'activityList',
        meta:{
          title:'',
        },
        component:activityList,
      },
      {
        path:'/activityDraft',
        name:'activityDraft',
        meta:{
          title:'草稿页',
        },
        component:activityDraft,
      },
      {
        path:'/surveyList',//问卷投票列表页
        name:'SurveyList',
        meta:{
          title:''
        },
        component:SurveyList,
      },
      {
        path:'/surveyDraft',//同事社区草稿页
        name:'SurveyDraft',
        meta:{
          title:'草稿',
        },
        component:SurveyDraft,
      },
      {
        path:'/surveyDetail',//审核详情
        name:'surveyDetail',
        meta:{
            title:'草稿',
        },
        component: surveyDetail,
      },


    ]
  })
  newRouter.beforeEach((route, redirect, next) => {
    document.title = route.meta.title || document.title;
    if(route.name == 'add'){
      document.title = route.query.diaryId ? "编辑日志":"新增日志"
    }
    if (route.path !== '/') {
      setTimeout(() => {
        window.location = window.location;
      }, 500);
    }
    if(route.name=='cultureIndex'){
      dataBase.wxqyh_uploadfile.agent='activity';
      let titleJsonObj = JSON.parse(localStorage.getItem('titleCache'+ _.userId));
      titleJsonObj ? document.title = titleJsonObj['activity'] : ''
    }
    if(route.name=='topicDetail'||route.name=='topicEditAndCopy'){
      dataBase.wxqyh_uploadfile.agent=route.query.agentCode||_.getUrlParam('agentCode')||'topic';
    }
    if(route.name=='activityList'){
      let agentCode=route.query.agentCode||_.getUrlParam('agentCode')||'activity';
      document.title=agentCode=='partyconstruction'?'党员活动':'活动报名';
    }
    next();
  });
  newRouter.afterEach(function (to, from, next) {
    try{
      _.initializedData();//初始化配置数据
    }catch(e){

    }
  });
  return newRouter
}
export default newRouterFun
/*必配 end*/
