const newsBulletinMain = r => require.ensure([],()=>r(require('../../views/newsBulletin/main')));
const newsBulletinList = r => require.ensure([],()=>r(require('../../views/newsBulletin/list')));
const newsBulletinMulti = r => require.ensure([],()=>r(require('../../views/newsBulletin/multiGraph')));
const newsBulletinSet = r => require.ensure([],()=>r(require('../../views/newsBulletin/set')));
const newsBulletinMenu = r => require.ensure([],()=>r(require('@/components/Menu/QwMenuSet')));
const newsBulletinAudit = r => require.ensure([],()=>r(require('../../views/newsBulletin/typeAndAudit')));
const newsBulletinAuthority = r => require.ensure([],()=>r(require('../../views/newsBulletin/authority')));
const newsBulletinAdd = r => require.ensure([],()=>r(require('../../views/newsBulletin/add')));
const newsBulletinAddMulti = r => require.ensure([],()=>r(require('../../views/newsBulletin/addMulti')));
const newsBulletinSee = r => require.ensure([],()=>r(require('../../views/newsBulletin/see')));
const newsBulletinRead = r => require.ensure([],()=>r(require('../../views/newsBulletin/read')));
const newsBulletinUnread = r => require.ensure([],()=>r(require('../../views/newsBulletin/unread')));
// 新增经销商
const newsBulletinDealerIndex = r => require.ensure([],()=>r(require('../../views/newsBulletin/dealer/index')));
const newsBulletinDealerRead = r => require.ensure([],()=>r(require('../../views/newsBulletin/dealer/read')));
const newsBulletinDealerUnread = r => require.ensure([],()=>r(require('../../views/newsBulletin/dealer/unread')));


export default {
  newsRouter: {
    name:'newsBulletinMain',
    path:'/newsMain',
    redirect:'/newsMain/list',
    component:newsBulletinMain,
    children:[
      {
        name:'newsBulletinList',
        path:'list',
        component:newsBulletinList,
      },
      {
        name:'newsBulletinMulti',
        path:'multi',
        component:newsBulletinMulti,
      },
      {
        name:'newsBulletinSet',
        path:'set',
        component:newsBulletinSet,
      },
      {
        name:'newsBulletinMenu',
        path:'menu',
        component:newsBulletinMenu,
      },
      {
        name:'newsBulletinAudit',
        path:'audit',
        component:newsBulletinAudit,
      },
      {
        name:'newsBulletinAuthority',
        path:'authority',
        component:newsBulletinAuthority,
      },
      {
        name:'newsBulletinAdd',
        path:'add',
        component:newsBulletinAdd,
      },
      {
        name:'newsBulletinAddMulti',
        path:'addMulti',
        component:newsBulletinAddMulti,
      },
      {
        name:'newsBulletinSee',
        path:'see',
        component:newsBulletinSee,
        children:[
          {
            name:'newsBulletinRead',
            path:'read',
            component:newsBulletinRead,
          },
          {
            name:'newsBulletinUnread',
            path:'unread',
            component:newsBulletinUnread,
          }
        ],
      },
        {
            name:'newsBulletinDealer',
            path:'dealer',
            component:newsBulletinDealerIndex,
            children:[
                {
                    name:'newsBulletinDealerRead',
                    path:'dealerRead',
                    component:newsBulletinDealerRead,
                },
                {
                    name:'newsBulletinDealerUnread',
                    path:'dealerUnread',
                    component:newsBulletinDealerUnread,
                }
            ],
        }
    ],
  },
}
