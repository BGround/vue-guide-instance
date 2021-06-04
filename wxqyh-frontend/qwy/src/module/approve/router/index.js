import Vue from 'vue';
import Router from 'vue-router';
import reimRouter from './reimbursement/router';

const changePsw = r => require.ensure([], () => r(require('@/components/list/changePsw')));
const approveMenu = r => require.ensure([], () => r(require('../views/approveMenu.vue')));

Vue.use(Router);

// 路由配置
const constantRouterMap = [
  {
    path: '/changePsw',
    component:changePsw,
  },
  {
    path:'/',
    name: 'approveMenu',
    component:approveMenu,
    // redirect: '/reimbursement',
    children: [
      /* 移动报销 */
      reimRouter.reimRouter,
    ],
  },
];

export default new Router({
  routes:constantRouterMap
})
