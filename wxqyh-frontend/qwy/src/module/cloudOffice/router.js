import Vue from 'vue'
import Router from 'vue-router'
const index = r => require.ensure([], () => r(require('./views/index')),'index')
const loadOffice = r => require.ensure([], () => r(require('./components/loadOffice')),'loadOffice')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/loadOffice',
      name: 'loadOffice',
      component: loadOffice
    },
  ]
})
