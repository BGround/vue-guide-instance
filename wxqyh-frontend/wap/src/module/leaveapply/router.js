
import Vue from 'vue'
import Router from 'vue-router'

const Home = r => require.ensure([], () => r(require('./views/Index')), 'leave_home')
const MyApply = r => require.ensure([], () => r(require('./views/Apply/Apply')), 'leave_apply')
const Review = r => require.ensure([], () => r(require('./views/Review/Review')), 'leave_review')
const Related = r => require.ensure([], () => r(require('./views/Related/Related')), 'leave_related')
const Add = r => require.ensure([], () => r(require('./views/Add/NewApply')), 'leave_add')
const Detail = r => require.ensure([], () => r(require('./views/Detail/Detail')), 'leave_detail')
const Draft = r => require.ensure([], () => r(require('./views/Draft/Draft')), 'leave_draft')

Vue.use(Router)

function newRouterFun() {

  const newRouter = new Router({
    routes: [
      {
        path: '/',
        redirect: '/apply'
      },
      {
        path: '/add',
        name: 'add',
        meta: { title: '新建申请' },
        component: Add
      },
      {
        path: '/detail',
        name: 'detail',
        meta: { title: '详情页' },
        component: Detail
      },
      {
        path: '/',
        name: 'home',
        meta: { title: "请假申请" },
        component: Home,
        children: [
          {
            path: '/apply',
            name: 'apply',
            meta: { title: "请假申请" },
            component: MyApply
          },
          {
            path: '/review',
            name: 'review',
            meta: { title: "待我审批" },
            component: Review
          },
          {
            path: '/draft',
            name: 'draft',
            meta: { title: '草稿' },
            component: Draft
          },
          {
            path: '/related',
            name: 'related',
            meta: { title: "我相关的" },
            component: Related
          }
        ]
      }
    ],
    scrollBehavior (to, from, savedPosition) {
      if((to.name === 'apply' || to.name === 'draft') && savedPosition) {
        return savedPosition;
      }
      return { x: 0, y: 0 }
    }
  });
  newRouter.beforeEach((route, redirect, next) => {
    document.title = route.meta.title || document.title;
    if (route.name == 'apply') {
			dataBase.home.homeFooterList.nav_on = 0;
		} else if (route.name == 'review') {
			dataBase.home.homeFooterList.nav_on = 1;
		} else if (route.name == 'related') {
			dataBase.home.homeFooterList.nav_on = 2;
		} else if(route.name == 'draft') {
      dataBase.home.homeFooterList.nav_on = 3;
    }
    next();
  });
  /*必配 start*/
  newRouter.afterEach(function (to, from, next) {
    try {
      _.initializedData();//初始化配置数据
    } catch (e) {

    }
  });
  return newRouter;
}
export default newRouterFun
