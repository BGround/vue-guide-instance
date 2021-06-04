import Vue from 'vue'
import Router from 'vue-router'
import meetingRouter from './meeting/router'
import diaryRouter from './diary/router'
import taskRouter from './task/router'
import expressRouter from './express/router'
import topicRouter from './topic/router'
import newsRouter from './news/router'
import productRouter from './product/router'
import channelRoutes from './channel/router'

Vue.use(Router)

const changePsw = r =>
  require.ensure([], () => r(require('@/components/list/changePsw')))

// 路由配置
const constantRouterMap = [
  {
    path: '/',
    redirect: '/newsMain/list'
  },
  {
    path: '/changePsw',
    component: changePsw
  },
  /* 任务分派 */
  taskRouter.taskRouter,
  /* 工作日志 */
  diaryRouter.diaryRouter,
  /* 会议助手 */
  meetingRouter.meetingRouter,
  /* 快递 */
  expressRouter.expressRouter,
  /* 知识百科 */
  productRouter,
  expressRouter.expressRouter,
  /*新闻公告*/
  newsRouter.newsRouter,
  /*同事社区 */
  topicRouter.topicRouter,

  channelRoutes
]

export default new Router({
  routes: constantRouterMap
})
