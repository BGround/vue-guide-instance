import Vue from 'vue'
import Router from 'vue-router'
import enterpriseInfo from '@/module/businessDashboard/router/enterpriseInfo/router'

Vue.use(Router)
const changePsw = r =>
  require.ensure([], () => r(require('@/components/list/changePsw')))


const container = r =>
  require.ensure([], () => r(require('@/module/businessDashboard/views/container')))


// 路由配置
const constantRouterMap = [
  {
    path: '/',
    redirect: '/enterpriseInfo'
  },
  {
    path: '/changePsw',
    component: changePsw
  },
  {
    name: 'enterpriseInfo',
    path: '/enterpriseInfo',
    component: resolve => require(['../views/enterpriseInfo/index'], resolve)

  },
  {
    name: 'networkSale',
    path: '/networkSale',
    component: resolve => require(['@/module/businessDashboard/views/networkSale/index'], resolve)
  },
  {
    name: 'marketDiscipline',
    path: '/marketDiscipline',
    component: resolve => require(['@/module/businessDashboard/views/marketDiscipline/index'], resolve)
  },
  {
    name: 'exitingNetwork',
    path: '/exitingNetwork',
    component: resolve => require(['@/module/businessDashboard/views/exitingNetwork/index'], resolve)
  },
	{
    name: 'starRating',
    path: '/starRating',
    component: resolve => require(['@/module/businessDashboard/views/starRating/index'], resolve)
  },
	{
    name: 'alertManagement',
    path: '/alertManagement',
    component: resolve => require(['@/module/businessDashboard/views/alertManagement/index'], resolve)
  },
	{
    name: 'personnelInfo',
    path: '/personnelInfo',
    component: resolve => require(['@/module/businessDashboard/views/personnelInfo/index'], resolve)
  },
    {
        name: 'oneNetworkSize',
        path: '/oneNetworkSize',
        component: resolve => require(['../views/oneNetworkSize/index'], resolve)
    },
    {
        name: 'completionSituation',
        path: '/completionSituation',
        component: resolve => require(['../views/completionSituation/index'], resolve)
    },
    {
        name: 'planningProgress',
        path: '/planningProgress',
        component: resolve => require(['../views/planningProgress/index'], resolve)
    },
    {
        name: 'networkStatus',
        path: '/networkStatus',
        component: resolve => require(['../views/networkStatus/index'], resolve)
    }

]

export default new Router({
  routes: constantRouterMap
})
