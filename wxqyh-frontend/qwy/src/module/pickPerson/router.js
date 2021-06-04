import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('./views/pickExam.vue')),'index')

Vue.use(Router)

const newRouter = new Router({
  routes: [
    {
      path:'/',
      component: index,
      name: 'index',
      meta: {
        title: '后台选人',
        keepAlive: true
      }
    }
  ]
})

newRouter.beforeEach((route, redirect, next) => {
  document.title = route.meta.title || document.title;
  next();
});

/*必配 start*/
newRouter.afterEach(function (to, from, next) {
  try{
    _.initializedData();//初始化配置数据
  }catch(e){

  }
});
export default newRouter
/*必配 end*/
