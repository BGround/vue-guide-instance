import Vue from 'vue'
import Router from 'vue-router'
//import list from './components/list/courseMallList'
const list = r => require.ensure([], () => r(require('./components/list/courseMallList')),'courseMallList')
//import detail from './components/detail/courseMallDetail'
const detail = r => require.ensure([], () => r(require('./components/detail/courseMallDetail')),'courseMallDetail')
const demo = r => require.ensure([], () => r(require('./components/demo')),'demo')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: list
    },
    {
      path: '/list',
      name: 'list',
      component: list
    },
    {
      path: '/detail',
      name: 'detail',
      component: detail
    },
    {
      path: '/demo',
      name: 'demo',
      component: demo
    }
  ]
})
