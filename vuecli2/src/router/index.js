import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home/index.vue'
import A from '@/components/RouterTest/A'
import A1 from '@/components/RouterTest/A1'
import B from '@/components/RouterTest/B'
import Life from '@/components/LifeCycle/Life.vue'
import DataCommunictaion from '@/components/DataCommunication/index.vue'
import PropsTest from '@/components/DataCommunication/props/Parent.vue'
import EmitTest from '@/components/DataCommunication/emit/Emit.vue'

Vue.use(Router)

export default new Router({
  // 去除#号显示IP地址
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
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
    },
    {
      path: '/life',
      // component: '../components/LifeCycle/Life.vue'
      component: Life
    },
    {
      path: '/datacommunication',
      component: DataCommunictaion,
      children: [
        {
          path: '/props',
          component: PropsTest
        },
        {
          path: 'emit',
          component: EmitTest
        }
      ]
    }
  ]
})
