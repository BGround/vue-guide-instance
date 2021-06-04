import Vue from 'vue'
import Router from 'vue-router'

// 规划开发信息
import panningDevInfo  from './planningDevInfoRoute'



Vue.use(Router)
const changePsw = r =>
  require.ensure([], () => r(require('@/components/list/changePsw')))
// 路由配置
const constantRouterMap = [
  {
    path: '/',
    redirect: '/planningInfo/serviceNetwork'
  },
  {
    path: '/changePsw',
    component: changePsw
  },
  /* 渠道首页 */
  // channelRouter.channelRouter,

  panningDevInfo
]

export default new Router({
  routes: constantRouterMap
})
