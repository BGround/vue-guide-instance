import Vue from 'vue'
import Router from 'vue-router'
const home = r => require.ensure([], () => r(require('./views/home')),'home');

Vue.use(Router);
function newRouterFun() {
  const newRouter = new Router({
    routes: [
      {
        path: '/',
        redirect: '/home'
      },
      {
        path: '/home',
        name: 'home',
        meta: {
          title: "岗位管理",
          keepAlive: true
        },
        component: home
      },
    ]
  });
  newRouter.beforeEach((route, redirect, next) => {
    if (route.meta.title || document.title) {
      document.title = route.meta.title || document.title;
    }
    next();
  });
  newRouter.afterEach(function (to, from, next) {
    try {
      _.initializedData();//初始化配置数据
    } catch (e) {

    }
  });
  return newRouter
}
export default newRouterFun
