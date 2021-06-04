import Vue from 'vue'
import Router from 'vue-router'

// 星途车型经营权限管理
import operatingAuthority from '../views/operatingAuthority/index'
// 服务车型管理
import serviceModel from '../views/serviceModel/index'
// 网点通讯录
import contactRouter from './netContact/router'
// 服务网点运作表
import serviceOperationTable from '../views/serviceOperationTable/index'
// 编辑星途车型经营权限
import operatingAuthorityEdit from "../views/operatingAuthority/operatingAuthorityEdit";
// 编辑服务车型
import serviceModelEdit from "../views/serviceModel/serviceModelEdit";
// 星途车型管理
import operatingAuthorityModelManagement from '../views/operatingAuthority/operatingAuthorityModelManagement'

Vue.use(Router)

const changePsw = r =>
    require.ensure([], () => r(require('@/components/list/changePsw')))

// 路由配置
const constantRouterMap = [
    {
        path: '/',
        redirect: '/contact/contactSale'
    },
    {
        path: '/changePsw',
        component: changePsw
    },

    {
        path: '/operatingAuthority',
        name: 'operatingAuthority',
        component: operatingAuthority
    },
    {
        path: '/serviceModel',
        name: 'serviceModel',
        component: serviceModel
    },
    {
        path: '/serviceOperationTable',
        name: 'serviceOperationTable',
        component: serviceOperationTable
    },
    {
        path: '/operatingAuthorityEdit',
        name: 'operatingAuthorityEdit',
        component: operatingAuthorityEdit
    },
    {
        path: '/serviceModelEdit',
        name: 'serviceModelEdit',
        component: serviceModelEdit
    },

    {
        path: '/operatingAuthorityModelManagement',
        name: 'operatingAuthorityModelManagement',
        component: operatingAuthorityModelManagement
    },

    /* 网点通讯录 */
    contactRouter.contactRouter
]

export default new Router({
    routes: constantRouterMap
})
