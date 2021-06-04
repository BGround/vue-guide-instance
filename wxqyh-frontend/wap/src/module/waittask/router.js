import Vue from 'vue'
import Router from 'vue-router'
const waittask = r => require.ensure([], () => r(require('./views/waittask')),'waittask');

Vue.use(Router)

const newRouter = new Router({
  routes:[
    {
      path:'/',
      component: waittask,
      name: 'waittask',
      meta: {
        title: '待办事项'
      }
    }
  ]
})

newRouter.beforeEach((route, redirect, next) => {
  document.title = route.meta.title || document.title;
  // if(route.name == 'waittask'){
  //   let titleJsonObj = JSON.parse(localStorage.getItem('titleCache'+ _.userId));
  //   titleJsonObj ? document.title = titleJsonObj['todo'] : ''
  // }
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
