import Vue from 'vue'
import Router from 'vue-router'
import distributorRouter from './distributorArchives/router'
import store from "module/distributorArchives/store";

Vue.use(Router)
const changePsw = r =>
  require.ensure([], () => r(require('@/components/list/changePsw')))
// 路由配置
const constantRouterMap = [
  {
    path: '/',
    redirect: '/archivesList/index'
  },
  {
    path: '/changePsw',
    component: changePsw
  },
  /* 经销商档案 */
  distributorRouter.distributorRouter
]

export default new Router({
  routes: constantRouterMap
})
