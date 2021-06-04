import Vue from 'vue'
import Router from 'vue-router';
//主页
const add = r => require.ensure([], () => r(require('./views/add.vue')), 'flowDemo_add')
const detail = r => require.ensure([], () => r(require('./views/detail.vue')), 'flowDemo_detail')
const flowButton = r => require.ensure([], () => r(require('./demo/flowApproveButtonDemo')), 'flowDemo_button')
Vue.use(Router)

function newRouterFun() {
  const newRouter = new Router({
    routes: [
    {
      path: '/add',
      name: 'flowDemoAdd',
      meta: {title: '测试流程新建'},
      component: add
    },
      {
        path: '/detail',
        name: 'flowDemoDetail',
        meta: {title: '测试流程详情'},
        component: detail
      },
      {
        path: '/flowButton',
        name: 'flowButton',
        meta: {title: '测试流程按钮示例'},
        component: flowButton
      }
    ]
  });
  newRouter.beforeEach((route, redirect, next) => {
    if (route.meta.title) {
      document.title = route.meta.title;
    }
    next();
  });
  newRouter.afterEach(function (to, from, next) {
    try {
      _.initializedData(); //初始化配置数据
    } catch (e) {

    }
  });
  return newRouter
}
export default newRouterFun
/*必配 end*/
