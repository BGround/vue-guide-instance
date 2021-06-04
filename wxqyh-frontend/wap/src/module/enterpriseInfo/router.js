import Vue from 'vue'
import Router from 'vue-router'
const enterpriseSearch = r => require.ensure([], () => r(require('./views/enterpriseSearch')),'enterpriseSearch')
const enterpriseList = r => require.ensure([], () => r(require('./views/enterpriseList')),'enterpriseList')
const enterpriseDetail = r => require.ensure([], () => r(require('./views/enterpriseDetail')),'enterpriseDetail')
const enterpriseQrCode = r => require.ensure([], () => r(require('./views/enterpriseQrCode')),'enterpriseQrCode')

Vue.use(Router)

const newRouter = new Router({
  routes: [
    {
      path:'/',
      component: enterpriseSearch,
      name: 'enterpriseSearch',
      meta: {
        title: '企业信息查询'
      }
    },
    {
      path:'/list',
      component: enterpriseList,
      name: 'enterpriseList',
      meta: {
        title: '企业信息查询'
      }
    },
    {
      path:'/detail/:corpId',
      component: enterpriseDetail,
      name: 'enterpriseDetail',
      meta: {
        title: '企业信息'
      }
    },
    {
      path:'/qrcode',
      component: enterpriseQrCode,
      name: 'enterpriseQrCode',
      meta: {
        title: '专属推广二维码'
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
