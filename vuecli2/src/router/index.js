import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import A from '@/components/A'
import A1 from '@/components/A1'
import B from '@/components/B'

Vue.use(Router)

export default new Router({
  // 去除#号显示IP地址
  mode: 'history',
  routes: [
    {
      path: '/',
      component: HelloWorld
    },
    {
      path: '/a',
      component: A,
      children: [
        {
          path: '/a1',
          component: A1
        }
      ]
    },
    {
      path: '/b',
      component: B
    }
  ]
})
