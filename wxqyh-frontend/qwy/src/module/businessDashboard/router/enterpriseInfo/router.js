
const enterpriseInfo = [{
  name: 'enterpriseInfo',
  path: '/enterpriseInfo',
  // redirect: '/newsMain/list',
  component: resolve => require(['../../views/enterpriseInfo/index'], resolve)
  // children: [
  //   {
  //     name: 'newsBulletinList',
  //     path: 'list',
  //     component: newsBulletinList
  //   }
  // ]
}]

export default enterpriseInfo
