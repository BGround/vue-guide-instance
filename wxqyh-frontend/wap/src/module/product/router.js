import Vue from 'vue'
import Router from 'vue-router'
const productList = r => require.ensure([], () => r(require('./views/list/product_list')),'productList');
const typeList = r => require.ensure([], () => r(require('./views/list/type_list')),'typeList')
const productDetail = r => require.ensure([], () => r(require('./views/detail/product_detail')),'productDetail');
const readList = r => require.ensure([], () => r(require('./views/list/read_list')),'readList');
const praiseList = r => require.ensure([], () => r(require('./views/list/praise_list')),'praiseList');
const caseList = r => require.ensure([], () => r(require('./views/list/case_list')),'caseList');
const caseDetail = r => require.ensure([], () => r(require('./views/detail/case_detail')),'caseDetail');
const approvalList = r => require.ensure([], () => r(require('./views/approval/list')),'approvalList');

Vue.use(Router);
function newRouterFun() {
  const newRouter = new Router({
    routes: [
      {
        path: '/',
        name: 'home',
        meta: {
          title: "",
          keepAlive: true
        },
        component: productList
      },
      {
        path: '/typeList',
        name: 'typeList',
        meta: {title: "分类搜索"},
        component: typeList
      },
      {
        path: '/productDetail',
        name: 'productDetail',
        meta: {title: ""},
        component: productDetail
      },
      {
        path: '/open/detail',
        name: 'openDetail',
        meta: {
          title: ''
        },
        component: productDetail,
        props: {
          isOpen: true
        }
      },
      {
        path: '/readList',
        name: 'readList',
        meta: {title: "阅读人员列表"},
        component: readList
      },
      {
        path: '/praiseList',
        name: 'praseList',
        meta: {title: "点赞人员列表"},
        component: praiseList
      },
      {
        path: '/caseList',
        name: 'caseList',
        meta: {title: "案例列表"},
        component: caseList
      },
      {
        path: '/open/caseList',
        name: 'openCaseList',
        meta: {title: "案例列表"},
        component: caseList,
        props: {
          isOpen: true
        }
      },
      {
        path: '/caseDetail',
        name: 'caseDetail',
        meta: {title: "案例详情"},
        component: caseDetail
      },
      {
        path: '/open/caseDetail',
        name: 'openCaseDetail',
        meta: {title: "案例详情"},
        component: caseDetail,
        props: {
          isOpen: true
        }
      },
        {
            path: '/approvalList',
            name: 'approvalList',
            meta: {
                title: "动态审核",
                keepAlive: true
            },
            component: approvalList
        },

    ]
  });
  newRouter.beforeEach((route, redirect, next) => {
    if (route.meta.title || document.title) {
      document.title = route.meta.title || document.title;
    }
    if(route.name == 'home'){
      let titleJsonObj = JSON.parse(localStorage.getItem('titleCache'+ _.userId));
      titleJsonObj ? document.title = titleJsonObj['productinfo'] : ''
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
