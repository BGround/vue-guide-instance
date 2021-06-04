import Vue from 'vue'
import Router from 'vue-router'

// 主页
const index = r => require.ensure([], () => r(require('./views/index.vue')),'cloudOffice_index')

// 草稿
const draft = r => require.ensure([], () => r(require('./views/draft.vue')),'draft_index')

// 应用管理
const applyMana = r => require.ensure([],()=>r(require('./views/applyMana.vue'),'applyMana'));


Vue.use(Router);

function newRouterFun() {
    const newRouter = new Router({
      routes:[
        {
          path: '/',
          name: 'index',
          meta: {
            title: '',
          },
          component: index,
        },
        {
          path: '/draft',
          name: 'draft',
          meta: {
            title:'草稿页',
          },
          component: draft,
        },
        {
          path: '/applyMana',
          name: 'applyMana',
          meta: {
            title:'应用管理',
          },
          component: applyMana,
        },
      ],
    });
    newRouter.beforeEach((route, redirect, next) => {
      document.title = route.meta.title || document.title;
      // if(route.name == 'add'){
      //   document.title = route.query.taskId ? (route.query.isDraft ? "编辑任务" : "复制任务") :"新建任务"
      // }
      if(route.name == 'index'){
        let titleJsonObj = JSON.parse(localStorage.getItem('titleCache'+ _.userId));
        titleJsonObj ? document.title = titleJsonObj['meetingassistant'] : ''
      }
      next();
    });
    newRouter.afterEach(function (to, from, next) {
      try {
        _.initializedData();//初始化配置数据
      } catch (e) {

      }
    });
    return newRouter;
}

export default newRouterFun;
