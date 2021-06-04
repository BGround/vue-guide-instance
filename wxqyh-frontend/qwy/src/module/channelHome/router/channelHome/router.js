// const newsBulletinUnread = r =>
//   require.ensure([], () => r(require('../../views/newsBulletin/unread')))

export default {
  channelRouter: {
    name: 'channelHome',
    path: '/channelHome',
    // redirect: '/newsMain/list',
    component: resolve => require(['../../views/channelHome/index'], resolve)
    // children: [
    //   {
    //     name: 'newsBulletinList',
    //     path: 'list',
    //     component: newsBulletinList
    //   }

    // ]
  }
}
