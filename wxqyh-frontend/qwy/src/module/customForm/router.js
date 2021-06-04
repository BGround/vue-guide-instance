import Vue from 'vue'
import Router from 'vue-router'

const PrintView = r => require.ensure([], () => r(require('./components/print_view/print_view')), 'PrintView')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/print',
      name: 'print_view',
      component: PrintView
    }
  ]
})

