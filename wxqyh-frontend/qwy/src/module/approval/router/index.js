import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
// _import 自动添加路径前缀
// 示例： 引入表单首页
// _import('form/index/index)
const _import = file => r =>
  require.ensure([], () =>
    r(require('@/module/approval/views/' + file + '.vue'))
  )

Vue.use(Router)

// constantRouterMao 静态路由
// 目前项目的主入口就是form，后期项目添加了主页以后，入口为包含菜单和边栏的主页。
export const constantRouterMap = [
  {
    path: '/',
    redirect: '/form/listView'
  }
]

export default new Router({
  routes: constantRouterMap
})

// 异步路由
export const asyncRouterMap = [
  {
    path: '/form',
    component: _import('form/index/index'),
    children: [
      {
        path: 'listView',
        component: _import('form/index/listView'),
        name: '列表视图'
      },
      {
        path: 'tileView',
        component: _import('form/index/tileView'),
        name: '平铺视图'
      },
      {
        path: 'setting',
        component: _import('form/index/groupSetting'),
        name: '分组设置'
      }
    ],
    meta: { resource: 'formMenu' }
  }
]
