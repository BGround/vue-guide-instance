import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const managerLogin = r => require.ensure([], () => r(require('@/module/login/views/manager/login')),'managerLogin');

// 路由配置
const constantRouterMap = [
  {
    path: '/',
    name: 'managerLogin',
    component: managerLogin
  }
]

export default new Router({
  routes: constantRouterMap
})
