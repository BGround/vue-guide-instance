import Vue from 'vue'
import Router from 'vue-router'
const demo = r => require.ensure([], () => r(require('./components/demo')),'demo_index')
const treeItem = r => require.ensure([], () => r(require('./tree/treeItem')),'treeItem')
const treeList = r => require.ensure([], () => r(require('./tree/treeList')),'treeList')
const treeList2 = r => require.ensure([], () => r(require('./tree/treeList2')),'treeList2')
const advancedSearch = r => require.ensure([], () => r(require('./advancedSearch/index')),'advancedSearch')
const tencentMap = r => require.ensure([], () => r(require('./tencentMap/index')),'tencentMap')
const qwui = r => require.ensure([], () => r(require('./example/qwui-demo.vue')),'qwui')
const picker = r => require.ensure([], () => r(require('./example/time_picker.vue')),'picker')

Vue.use(Router)

function newRouterFun() {
  const newRouter = new Router({
  routes: [
    {
      path: '/',
      name: 'demo',
      component: demo
    },
    {
      path: '/qwui',
      name: 'qwui',
      component: qwui
    },
    {
      path: '/open/',
      name: 'demo',
      component: demo
    },
    {
      path: '/treeItem',
      name: 'treeItem',
      component: treeItem
    },
    {
      path: '/treeList',
      name: 'treeList',
      component: treeList
    },
    {
      path: '/treeList2',
      name: 'treeList2',
      component: treeList2
    },
    {
      path: '/advancedSearch',
      name: 'advancedSearch',
      component: advancedSearch
    },{
      path: '/tencentMap',
      name: 'tencentMap',
      component: tencentMap
    },
    {
      path: '/picker',
      name: 'picker',
      component: picker
    }
  ]
})
  return newRouter;
}
export default newRouterFun
