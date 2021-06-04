import Vue from 'vue'
import Router from 'vue-router';
import i18nFun from "@/lang";
//首页
const checkwork = r => require.ensure([], () => r(require('./views/index')),'checkwork');
//新增申诉
const add = r => require.ensure([], () => r(require('./views/add/rep_add')),'rep_add');
//申诉详情
const detail = r => require.ensure([], () => r(require('./views/detail/rep_detail')),'rep_detail');

//今日考勤
const todayCheck = r => require.ensure([], () => r(require('./views/add')),'checkwork_add');
//考勤日历
const checkCalendar = r => require.ensure([], () => r(require('./views/calendar')),'checkwork_calendar');
//考勤统计
const checkStatistics = r => require.ensure([], () => r(require('./views/statistics')),'checkwork_statistics');
//我的申诉
const myRep = r => require.ensure([], () => r(require('./views/representations/my_rep')),'my_rep');
//统计搜索
const statisticsSearch = r => require.ensure([],()=> r(require('./views/statisticsSearch')),'statistics_search');
//考勤详情
const checkDetail = r => require.ensure([],()=> r(require('./views/detail/check_detail')),'check_detail');
//规则详情
const ruleDetail = r => require.ensure([],()=> r(require('./views/detail/rule_detail')),'rule_detail');
//相关考勤
const relateCheckWork = r => require.ensure([],()=> r(require('./views/representations/relation_checkwork')),'relation_checkwork');
//相关申诉
const repRelation = r => require.ensure([],()=> r(require('./views/representations/relate_rep')),'relate_rep');
//申诉审批
const repApprove = r => require.ensure([],()=> r(require('./views/representations/approve_rep')),'approve_rep');
//排行榜
const ranking = r => require.ensure([],()=> r(require('./views/ranking/ranking')),'ranking');

//无权限页
const noPermission = r => require.ensure([],()=> r(require('./views/noPermission')),'noPermission');



Vue.use(Router);

function newRouterFun() {
  const i18n = i18nFun(_.lang)
  const locale = i18n.locale;
  const title = i18n.messages[locale].i18n;
  const newRouter = new Router({
    routes: [
      {
        path: '/',
        name: 'checkwork',
        component: checkwork,
        children:[
          {
            path: '/myRep',
            name: 'myRep',
            meta: {title: "我的申诉"},
            component: myRep
          },
          {
            path: '/relateCheckWork',
            name: 'relateCheckWork',
            meta: {title: "相关考勤"},
            component: relateCheckWork
          },
          {
            path: '/repRelation',
            name: 'repRelation',
            meta: {title: "相关申诉"},
            component: repRelation
          },
          {
            path: '/repApprove',
            name: 'repApprove',
            meta: {title: "申诉审批"},
            component: repApprove
          },
        ]
      },
      {
        path: '/todayCheck',
        name: 'todayCheck',
        meta: {title: "今日考勤"},
        component: todayCheck
      },
      {
        path: '/statistics',
        name: 'statistics',
        meta: {title: "考勤统计"},
        component: checkStatistics
      },
      {
        path: '/checkCalendar',
        name: 'checkCalendar',
        meta: {title: "考勤日历"},
        component: checkCalendar
      },
      {
        path: '/add',
        name: 'addCheckWork',
        meta: {title: title.addCheckWork},
        component: add
      },
      {
        path: '/detail',
        name: 'repDetail',
        meta: {title: title.repDetail},
        component: detail
      },
      {
        path: '/statistics/search',
        name: 'statisticsSearch',
        meta: {title: "统计搜索"},
        component: statisticsSearch
      },
      {
        path: '/checkDetail',
        name: 'checkDetail',
        meta: {title: "考勤详情"},
        component: checkDetail
      },
      {
        path: '/ruleDetail',
        name: 'ruleDetail',
        meta: {title: "规则详情"},
        component: ruleDetail
      },
      {
        path: '/ranking',
        name: 'ranking',
        meta: {title: "排行榜"},
        component: ranking
      },
      {
        path: '/noPermission',
        name: 'noPermission',
        meta: {title: "没有权限"},
        component: noPermission
      },
    ]
  });

  newRouter.beforeEach((route, redirect, next) => {
    if (route.meta.title || document.title) {
      document.title = route.meta.title || document.title;
    }
    next();
  });


  /*必配 start*/
  newRouter.afterEach(function (route, redirect, next) {
    try {
      _.initializedData();//初始化配置数据
    } catch (e) {

    }
  });
  return newRouter;
}
export default newRouterFun
/*必配 end*/
