import Vue from 'vue'
import Router from 'vue-router';
import i18nFun from "@/lang";
//登录页
const login = r => require.ensure([], () => r(require('./views/login/loadMore')),'login')
//主页
const home = r => require.ensure([], () => r(require('./views/index')),'index')
//actionList
const actionList = r => require.ensure([], () => r(require('./views/actionList/actionIndex')),'actionList')
// 详情页
const partyDetail = r => require.ensure([], () => r(require('./views/PartyDetail/PartyDetail')), 'partyDetail')
// 阅读人员列表
const viewList = r => require.ensure([], () => r(require('./views/viewList')), 'viewList')
// 发布页面
const publish = r => require.ensure([], () => r(require('./views/publish/dynamic_publish')), 'publish');
// 点赞列表
const praiseList = r => require.ensure([], () => r(require('./views/praiseList')), 'praiseList');
// 员工祝福列表
const blessList = r => require.ensure([], () => r(require('./views/list/blessList')), 'blessList');
Vue.use(Router)

function newRouterFun() {
  const i18n = i18nFun(_.lang)

  const newRouter = new Router({
    routes: [
      {
        path: '/index',
        name: 'home',
        meta: {
          title: '',
          keepAlive: true
        },
        component: home
      },
      {
        path: '/',
        name: 'index',
        meta: {title: ''},
        component: home
      },
      {
        path: '/actionList',
        name: 'actionList',
        meta: {title: ''},
        component: actionList
      },
      {
        path: '/partyDetail',
        name: 'partyDetail',
        meta: {title: '详情页'},
        component: partyDetail
      },
      {
        path: '/viewList',
        name: 'view-list',
        meta: {title: '阅读人员列表'},
        component: viewList
      },
      {
        path: '/open/detail',
        name: 'open_detail',
        meta: {
          title: '详情页'
        },
        component: partyDetail,
        props: {
          isOpen: true
        }
      },
      {
        path: '/publish',
        name: 'publish',
        meta: {
          title: '发布'
        },
        component: publish
      },
      {
        path: '/praiseList',
        name: 'praiseList',
        meta: {
          title: '点赞人员列表'
        },
        component: praiseList
      },
      {
        path: '/blessList',
        name: 'blessList',
        meta: {
          title: '员工祝福'
        },
        component: blessList
      }
    ]
  })

  newRouter.beforeEach((route, redirect, next) => {
    document.title = route.meta.title || document.title;
    if(route.name == 'home'){
      let titleJsonObj = JSON.parse(localStorage.getItem('titleCache'+ _.userId));
      titleJsonObj ? document.title = titleJsonObj['dynamic'] : ''
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
