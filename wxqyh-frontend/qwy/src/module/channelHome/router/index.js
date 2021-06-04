import Vue from 'vue'
import Router from 'vue-router'
import channelRouter from './channelHome/router'

Vue.use(Router)
const changePsw = r =>
  require.ensure([], () => r(require('@/components/list/changePsw')))
// 路由配置
const constantRouterMap = [
  {
    path: '/',
    redirect: '/channelHome'
  },
  {
    path: '/changePsw',
    component: changePsw
  },
  /* 渠道首页 */
  channelRouter.channelRouter,
]

export default new Router({
  routes: constantRouterMap
})
