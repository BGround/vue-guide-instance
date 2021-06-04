//同事社区新建和编辑界面
const addOrEditTopic = r =>
  require.ensure([], () => r(require('../../views/topic/edit')))
//同事社区类型新建和编辑界面
const addOrEditType = r =>
  require.ensure([], () => r(require('../../views/topic/typeEdit')))
//同事社区设置界面
const topicSetting = r =>
  require.ensure([], () => r(require('../../views/topic/topicSetting')))
//匿名设置界面
const topicAnonySet = r =>
  require.ensure([], () => r(require('../../views/topic/topicAnonySet')))
//置顶个数设置界面
const topicTopSet = r =>
  require.ensure([], () => r(require('../../views/topic/topicTopSet')))
//发布权限设置界面
const topicPublishAuthor = r =>
  require.ensure([], () => r(require('../../views/topic/topicPublishAuthor')))
//菜单设置界面
const topicMenu = r =>
  require.ensure([], () => r(require('../../views/topic/topicMenu')))
//类型列表界面
const topicTypeList = r =>
  require.ensure([], () => r(require('../../views/topic/topicTypeList')))
//话题列表
const topicList = r =>
  require.ensure([], () => r(require('../../views/topic/topicList')))
//未阅和已阅
const topicSee = r =>
  require.ensure([], () => r(require('../../views/topic/topicSee')))
//未阅和已阅
const topicSeeUnRead = r =>
  require.ensure([], () => r(require('../../views/topic/topicSeeUnRead')))
//未阅和已阅
const topicSeeRead = r =>
  require.ensure([], () => r(require('../../views/topic/topicSeeRead')))
//评论列表
const topicCommentList = r =>
  require.ensure([], () => r(require('../../views/topic/topicCommentList')))
//主页面
const topicMain = r =>
  require.ensure([], () => r(require('../../views/topic/topicMain')))
export default {
  topicRouter: {
    name: 'topicMain',
    path: '/topicMain',
    redirect: '/topicMain/topicList',
    component: topicMain,
    children: [
      {
        name: 'topicList',
        path: 'topicList',
        component: topicList
      },
      {
        name: 'addOrEditTopic',
        path: 'addOrEditTopic',
        component: addOrEditTopic
      },
      // {
      //   name:'addOrEditType',
      //   path:'addOrEditType',
      //   component:addOrEditType,
      // },
      {
        name: 'topicSetting',
        path: 'topicSetting',
        component: topicSetting
      },
      {
        name: 'topicAnonySet',
        path: 'topicAnonySet',
        component: topicAnonySet
      },
      {
        name: 'topicTopSet',
        path: 'topicTopSet',
        component: topicTopSet
      },
      {
        name: 'topicPublishAuthor',
        path: 'topicPublishAuthor',
        component: topicPublishAuthor
      },
      {
        name: 'topicMenu',
        path: 'topicMenu',
        component: topicMenu
      },
      {
        name: 'topicTypeList',
        path: 'topicTypeList',
        component: topicTypeList
      },
      {
        name: 'topicCommentList',
        path: 'topicCommentList',
        component: topicCommentList
      },
      {
        name: 'topicSee',
        path: 'topicSee',
        component: topicSee,
        children: [
          {
            name: 'topicSeeRead',
            path: 'topicSeeRead',
            component: topicSeeRead
          },
          {
            name: 'topicSeeUnRead',
            path: 'topicSeeUnRead',
            component: topicSeeUnRead
          }
        ]
      }
    ]
  }
}
