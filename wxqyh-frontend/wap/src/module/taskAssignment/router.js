import Vue from 'vue'
import Router from 'vue-router'

//主页
const home = r => require.ensure([], () => r(require('./views/index.vue')),'taskAssignment_index')

//新增页面
const add = r => require.ensure([],()=>r(require('./views/add/TaskAdd.vue'),'TaskAdd'));

//详情页面
const detail = r => require.ensure([],()=>r(require('./views/detail/TaskDetail.vue'),'TaskDetail'));

//草稿页面
const draft = r => require.ensure([],()=>r(require('./views/draft/draft.vue'),'draft'));

//子任务详情页面
const subtask = r => require.ensure([],()=>r(require('./views/subTask/subTaskDetail.vue'),'subtask'));

Vue.use(Router);

function newRouterFun() {
    const newRouter = new Router({
      routes:[
        {
          path: '/',
          name: 'home',
          meta: {
            title:'',
            keepAlive: true
          },
          component: home,
        },
        // {
        //   path: '/add',
        //   name: 'add',
        //   meta: {
        //     title:'新建任务',
        //     keepAlive: false
        //   },
        //   component: add,
        //   children:[
        //     {
        //       path:'subtask',
        //       name:'subtask',
        //       meta:{
        //         title:'新建子任务'
        //       },
        //       component: subtask,
        //     }
        //   ]
        // },
        {
          path:'/detail',
          name:'detail',
          meta:{
            title:'任务详情',
            keepAlive: false
          },
          component: detail,
        },
        {
          path:'/subtaskDetail',
          name:'subtaskDetail',
          meta:{
            title:'子任务详情'
          },
          component: subtask,
        },
        {
          path:'/draft',
          name:'draft',
          meta:{
            title:'草稿',
            keepAlive: false
          },
          component: draft,
        }
      ],
    });
    newRouter.beforeEach((route, redirect, next) => {
      document.title = route.meta.title || document.title;
      // if(route.name == 'add'){
      //   document.title = route.query.taskId ? (route.query.isDraft ? "编辑任务" : "复制任务") :"新建任务"
      // }
      if(route.name == 'subtaskDetail'){
        document.title = route.query.subtaskId ? '子任务详情' : '新建子任务';
      }
      if(route.name == 'home'){
        let titleJsonObj = JSON.parse(localStorage.getItem('titleCache'+ _.userId));
        titleJsonObj ? document.title = titleJsonObj['task'] : ''
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
