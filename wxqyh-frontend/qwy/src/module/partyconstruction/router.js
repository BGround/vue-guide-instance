import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 登录页
const login = r => require.ensure([], () => {
  return r(require('./views/user/login'))
}, 'login');

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
      alias: '/'
    }
  ]
});

export default router;
