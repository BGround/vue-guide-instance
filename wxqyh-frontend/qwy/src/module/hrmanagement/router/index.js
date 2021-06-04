import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const changePsw = r => require.ensure([], () => r(require('@/components/list/changePsw')));
const hr = r => require.ensure([], () => r(require('../views/hr')));
const addMark = r => require.ensure([], () => r(require('../views/markList/addMark/addMark.vue')));
const personalReport = r => require.ensure([], () => r(require('../views/personalReport/personalReport.vue')));

// 路由配置，现在默认路由暂定为目标
const constantRouterMap = [

  {
    path: '/changePsw',
    component: changePsw
  },
  {
    path: '/',
    name: 'hr',
    component: hr,
    redirect: '/addMark',
    children: [{
        path: 'addMark',
        component: addMark,
        meta: {
          role: ''
        }
      },
      {
        path: 'personalReport',
        component: personalReport,
        meta: {
          role: ''
        }
      }
    ],
  },
]

export default new Router({
  routes: constantRouterMap
})
