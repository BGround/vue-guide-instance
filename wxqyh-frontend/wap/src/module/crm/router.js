import Vue from 'vue'
import Router from 'vue-router';
import i18nFun from "@/lang";

//主页
const home = r => require.ensure([], () => r(require('./views/index')), 'home');

//客户查重
const checkList = r => require.ensure([], () => r(require('./views/check/checkList')),'checkList');
// 公海
const poolOperate = r => require.ensure([], () => r(require('./views/pool/PoolOperate/PoolOperate')),'poolOperates');
// 拜访
const visitOperate = r => require.ensure([], () => r(require('./views/visit/VisitOperate/VisitOperate')),'visitOperates');
// 商机
const businessOperate = r => require.ensure([], () => r(require('./views/business/BusinessOperate/BusinessOperate')),'businessOperates');
// 合同回款统计
const dataStatistics = r => require.ensure([], () => r(require('./views/dataStatistics/dataStatistics')), 'dataStatistics');
//合同汇款详情
const dataStatisticsDetails = r => require.ensure([], () => r(require('./views/dataStatistics/dataStatisticsDetails')), 'dataStatisticsDetails');

// 我的小程序
const smallProgram = r => require.ensure([], () => r(require('./views/marketingProgram/smallProgram/smallProgram')), 'smallProgram');
// 我的名片
const callingCard = r => require.ensure([], () => r(require('./views/marketingProgram/callingCard/callingCard')), 'callingCard');
// 编辑名片
const editCard = r => require.ensure([], () => r(require('./views/marketingProgram/callingCard/editCard')), 'editCard');
// 联系管理员开通权限
const openAuthority = r => require.ensure([], () => r(require('./views/marketingProgram/smallProgram/openAuthority')), 'openAuthority');
// 动态
const marketingDynamic = r => require.ensure([], () => r(require('./views/marketingProgram/smallProgram/marketingDynamic')), 'marketingDynamic');
//编辑用户信息
const editUser = r => require.ensure([], () => r(require('./views/marketingProgram/smallProgram/editUser')), 'editUser');
// 消息
const message = r => require.ensure([], () => r(require('./views/marketingProgram/message/message')), 'message')
// 聊天室
const chat = r => require.ensure([], () => r(require('./views/marketingProgram/message/chat')), 'chat')
// 外部页面
const externalPage = r => require.ensure([], () => r(require('./views/marketingProgram/smallProgram/externalPage')), 'externalPage');
// 会话管理页面
const words = r => require.ensure([], () => r(require('./views/marketingProgram/words/words')), 'words');
// 用户详情
const userInfo = r => require.ensure([], () => r(require('./views/marketingProgram/userInfo/userInfo')), 'userInfo');

//销售行为分析
const saleAnalysis = r => require.ensure([], () => r(require('./views/dataBoard/saleAnalysis/saleAnalysis')), 'saleAnalysis')
// 客户详情
const clientDetails = r => require.ensure([], () => r(require('./views/client/clientDetails/ClientDetails.vue')),'clientDetails');
// 客户详情内容
const clientContent = r => require.ensure([], () => r(require('./views/client/clientDetails/detailsContent/ClientContent.vue')),'clientContent');

// 联系人详情
const contactDetails = r => require.ensure([], () => r(require('./views/contact/contactDetails/ContactDetails.vue')),'contactDetails');
// 联系人详情列表
const contactList = r => require.ensure([], () => r(require('./views/contact/contactDetails/detailsList/ContactList.vue')),'contactList');
// 联系人详情内容
const contactContent = r => require.ensure([], () => r(require('./views/contact/contactDetails/detailsContent/ContactContent.vue')),'contactContent');

// 商机详情
const businessDetails = r => require.ensure([], () => r(require('./views/business/businessDetails/BusinessDetails.vue')),'businessDetails');
// 商机详情列表
const businessList = r => require.ensure([], () => r(require('./views/business/businessDetails/detailsList/BusinessList.vue')),'businessList');
// 商机详情内容
const businessContent = r => require.ensure([], () => r(require('./views/business/businessDetails/detailsContent/BusinessContent.vue')),'businessContent');

// 拜访详情
const visitDetails = r => require.ensure([], () => r(require('./views/visit/visitDetails/VisitDetails.vue')),'visitDetails');
// 拜访详情列表
const visitList = r => require.ensure([], () => r(require('./views/visit/visitDetails/detailsList/VisitList.vue')),'visitList');
// 拜访详情内容
const visitContent = r => require.ensure([], () => r(require('./views/visit/visitDetails/detailsContent/VisitContent.vue')),'visitContent');


// 合同详情内容
const contractContent = r => require.ensure([], () => r(require('./views/contract/contractDetails/detailsContent/ContractContent.vue')),'contractContent');
// 合同详情列表
const contractList = r => require.ensure([], () => r(require('./views/contract/contractDetails/detailsList/ContractList.vue')),'contractList');
// 计划回款
const reimbursePlan = r => require.ensure([], () => r(require('./components/ReimbursePlan/ReimbursePlan.vue')),'reimbursePlan');
// 实际回款
const reimburseReceive = r => require.ensure([], () => r(require('./components/ReimburseReceive/ReimburseReceive.vue')),'reimburseReceive');
// 开票回款
const reimburseInvoice = r => require.ensure([], () => r(require('./components/ReimburseInvoice/ReimburseInvoice.vue')),'reimburseInvoice');


// 公海详情
const poolDetails = r => require.ensure([], () => r(require('./views/pool/poolDetails/PoolDetails.vue')),'poolDetails');
// 公海详情内容
const poolContent = r => require.ensure([], () => r(require('./views/pool/poolDetails/detailsContent/PoolContent.vue')),'poolContent');

// 公海回收站 goRecycleBin
const poolRecycleBin = r => require.ensure([], () => r(require('./views/pool/poolRecycleBin/poolRecycleBin.vue')),'poolRecycleBin');

// 联系人详情列表
const poolContactList = r => require.ensure([], () => r(require('./views/pool/poolContactDetails/poolDetailsList/ContactList.vue')),'contactList');
// 联系人详情内容
const poolContactContent = r => require.ensure([], () => r(require('./views/pool/poolContactDetails/poolDetailsContent/ContactContent.vue')),'contactContent');

// 商机详情列表
const poolBusinessList = r => require.ensure([], () => r(require('./views/pool/poolBusinessDetails/poolDetailsList/BusinessList.vue')),'businessList');
// 商机详情内容
const poolBusinessContent = r => require.ensure([], () => r(require('./views/pool/poolBusinessDetails/poolDetailsContent/BusinessContent.vue')),'businessContent');

// 拜访详情列表
const poolVisitList = r => require.ensure([], () => r(require('./views/pool/poolVisitDetails/poolDetailsList/VisitList.vue')),'visitList');
// 拜访详情内容
const poolVisitContent = r => require.ensure([], () => r(require('./views/pool/poolVisitDetails/poolDetailsContent/VisitContent.vue')),'visitContent');

//转到其他公海
const poolTransferList = r => require.ensure([], () => r(require('./components/PoolTransferList/PoolTransferList.vue')),'poolTransferList');

//首页待办
const waitDeal = r => require.ensure([], () => r(require('./views/waitDeal/waitDealIndex')),'waitDealIndex');

Vue.use(Router)

function newRouterFun() {
  const newRouter = new Router({
    routes: [
      {
        path: '/index',
        name: 'index',
        component: () => import(/* webpackChunkName: "index" */ './views/crmIndex/crmIndex'),
        children: [
          {
            path: '',
            redirect: 'home'
          },
          {
            path: 'home',
            name: 'home',
            meta: {title: ""},
            component: home,
          },
          {
            path: 'dataBoard',
            name: 'dataBoard',
            meta: {title: "数据看板"},
            component: () => import(/* webpackChunkName: "dataBoard" */'./views/dataBoard/index')
          },
          {
            path: 'waitDeal',
            name: 'waitDealIndex',
            meta: {title: "待办"},
            component: waitDeal
          },
          {
            path: 'myHome',
            name: 'myHome',
            meta: {title: "我"},
            component: () => import(/* webpackChunkName: "myHome" */'./views/my/home'),
            redirect: {name: 'my'},
            children: [
              {
                path: 'my',
                name: 'my',
                meta: {title: "我"},
                component: () => import(/* webpackChunkName: "my" */ './views/my/index'),
              },
              {
                path: 'updateNotice',
                name: 'updateNotice',
                meta: {title: "更新公告"},
                component: () => import(/* webpackChunkName: "updateNotice" */ './views/my/updateNotice/updateNotice'),
              },
              {
                path: 'customService',
                name: 'customService',
                component: () => import(/* webpackChunkName: "updateNotice" */ './views/my/customService/customService'),
                meta: { title: '在线帮助' }
              },
            ],
          },
        ]
      },
      {
        path: '/competitor',
        name: 'competitor',
        component: () =>
          import ('./views/competitor'),
        children: [{
          path: 'list',
          name: 'competitorList',
          meta: {
            title: "竞争对手"
          },
          component: () =>
            import ('./views/competitor/list'),
        }, {
          path: 'add',
          name: 'competitorAdd',
          component: () =>
            import ('./views/competitor/add'),
        }, {
          path: 'detail/:id',
          name: 'competitorDetail',
          meta: {
            title: "竞争对手"
          },
          component: () =>
            import ('./views/competitor/detail'),

        }]
      },
      {
        path: '/clientOperate',
        name: 'clientOperate',
        meta: {title: "新建客户"},
        component: () => import(/* webpackChunkName: "clientOperate" */ './views/client/ClientOperate/ClientOperate')
      },
      {
        path: '/poolOperate',
        name: 'poolOperate',
        meta: {title: "新建公海客户"},
        component: poolOperate
      },
      {
        path: '/visitOperate',
        name: 'visitOperate',
        meta: {title: "新建拜访"},
        component: visitOperate
      },
      {
        path: '/businessOperate',
        name: 'businessOperate',
        meta: {title: "新建商机"},
        component: businessOperate
      },
      {
        path: '/contactOperate',
        name: 'contactOperate',
        meta: {title: "新建联系人"},
        component: () => import(/* webpackChunkName: "contactOperate" */ './views/contact/ContactOperate/ContactOperate')
      },
      {
        path: '/checkList',
        name: 'checkList',
        meta: {
          title: "客户查重"
        },
        component: checkList
      },
      {
        path: '/dataStatistics',
        name: 'dataStatistics',
        meta: {
          title: "合同回款统计"
        },
        component: dataStatistics
      },
      //回款明细
      {
          path: '/dataStatisticsDetails',
          name: 'dataStatisticsDetails',
          meta: {title: "合同回款明细"},
          component: dataStatisticsDetails,
      },
      {
        path: '/clientList/:status',
        name: 'clientList',
        meta: {
          title: '客户列表'
        },
        component: () =>
          import ( /* webpackChunkName: "clientList" */ './views/client/ClientList/ClientList')
      },
      {
        path: '/contactList/:status',
        name: 'contactList',
        meta: {
          title: '联系人列表'
        },
        component: () =>
          import ( /* webpackChunkName: "contactList" */ './views/contact/ContactList/ContactList')
      },
      {
        path: '/visitList/:status',
        name: 'visitList',
        meta: {
          title: '拜访列表'
        },
        component: () =>
          import ( /* webpackChunkName: "visitList" */ './views/visit/VisitList/VisitList')
      },
      {
        path: '/businessList/:status',
        name: 'businessList',
        meta: {
          title: '商机列表'
        },
        component: () =>
          import ( /* webpackChunkName: "businessList" */ './views/business/BusinessList/BusinessList')
      },
      {
        path: '/contractList/:status',
        name: 'contractList',
        meta: {
          title: '合同列表'
        },
        component: () =>
          import ( /* webpackChunkName: "contractList" */ './views/contract/ContractList/ContractList')
      },
      {
        path: '/poolList',
        name: 'poolList',
        meta: {
          title: '公海池'
        },
        component: () =>
          import ( /* webpackChunkName: "poolList" */ './views/pool/PoolList/PoolList')
      },
      {
        path: '/clientTypeList',
        name: 'clientTypeList',
        meta: {
          title: '客户列表'
        },
        component: () =>
          import ( /* webpackChunkName: "clientTypeList" */ './views/client/ClientTypeList/ClientTypeList')
      },
      {
        path: '/poolRecycleBin',
        name: 'poolRecycleBin',
        component: poolRecycleBin,
        meta: {title: '公海回收站'}
      },
      {
        path: '/smallProgram',
        name: 'smallProgram',
        meta: {
          title: "我的小程序"
        },
        component: smallProgram
      },
      {
        path: '/callingCard',
        name: 'callingCard',
        meta: {
          title: "我的名片"
        },
        component: callingCard
      },
      {
        path: '/editCard',
        name: 'editCard',
        meta: {
          title: "编辑名片"
        },
        component: editCard
      },
      {
        path: '/openAuthority',
        name: 'openAuthority',
        meta: {
          title: "我的小程序"
        },
        component: openAuthority
      },
      {
        path: '/marketingDynamic',
        name: 'marketingDynamic',
        meta: {
          title: "动态"
        },
        component: marketingDynamic
      },
      {
        path: '/editUser',
        name: 'editUser',
        meta: {
          title: "编辑用户信息"
        },
        component: editUser
      },
      {
        path: '/message',
        name: 'message',
        meta: {
          title: '消息'
        },
        component: message
      },
      {
        path: '/chat',
        name: 'chat',
        component: chat
      },
      {
        path: '/words',
        name: 'words',
        meta: {title: '常用话术管理'},
        component: words
      },
      {
        path: '/userInfo',
        name: 'userInfo',
        meta: {title: '用户详情'},
        component: userInfo
      },
      {
        path: '/contractOperate',
        name: 'contractOperate',
        meta: {
          title: "新建合同"
        },
        component: () =>
          import ( /* webpackChunkName: "contractOperate" */ './views/contract/ContractOperate/ContractOperate')
      },
      {
        path: '/contractIndex',
        name: 'contractIndex',
        meta: { title: "" },
        component: () => import(/* webpackChunkName: "contractIndex" */ './views/contract/ContractIndex/ContractIndex')
      },
      {
        path: '/ClientDetails',
        name: 'clientDetails',
        meta: {title: "客户详情"},
        component: clientDetails,
        children:[
          { path: '/', redirect: 'ClientContent'},
          {
            path: 'ClientContent',
            name: 'clientContent',
            meta: {title: "客户详情"},
            component: clientContent,
          },
          {
            path: 'ContactList',
            name: 'contactList',
            meta: {title:"客户联系人"},
            component: contactList,
          },
          {
            path: 'ContactContent',
            name: 'contactContent',
            meta: {title:"联系人详情"},
            component: contactContent,
          },
          {
            path: 'BusinessList',
            name: 'businessList',
            meta: {title:"客户商机"},
            component: businessList,
          },
          {
            path: 'BusinessContent',
            name: 'businessContent',
            meta: {title:"商机详情"},
            component: businessContent,
          },
          {
            path: 'ContractList',
            name: 'contractList',
            meta: {title:"客户合同"},
            component: contractList,
          },
          {
            path: 'VisitList',
            name: 'visitList',
            meta: {title:"客户拜访"},
            component: visitList,
          },
          {
            path: 'VisitContent',
            name: 'visitContent',
            meta: {title:"拜访详情"},
            component: visitContent,
          }
        ]
      },
      //公海池
      {
        path: '/PoolDetails',
        name: 'poolDetails',
        meta: {title: "公海客户详情"},
        component: poolDetails,
        children:[
          { path: '/', redirect: 'PoolContent'},
          {
            path: 'PoolContent',
            name: 'poolContent',
            meta: {title: "客户详情"},
            component: poolContent,
          },
          {
            path: 'PoolContactList',
            name: 'poolContactList',
            meta: {title:"客户联系人"},
            component: poolContactList,
          },
          {
            path: 'PoolContactContent',
            name: 'poolContactContent',
            meta: {title:"联系人详情"},
            component: poolContactContent,
          },
          {
            path: 'PoolBusinessList',
            name: 'poolBusinessList',
            meta: {title:"客户商机"},
            component: poolBusinessList,
          },
          {
            path: 'PoolBusinessContent',
            name: 'poolBusinessContent',
            meta: {title:"商机详情"},
            component: poolBusinessContent,
          },
          {
            path: 'PoolVisitList',
            name: 'poolVisitList',
            meta: {title:"客户拜访"},
            component: poolVisitList,
          },
          {
            path: 'PoolVisitContent',
            name: 'poolVisitContent',
            meta: {title:"拜访详情"},
            component: poolVisitContent,
          },
        ]
      },
      {
        path: '/VisitDetails',
        name: 'visitDetails',
        meta: {title:"拜访详情"},
        component: visitDetails,
        children:[
          { path: '/', redirect: 'VisitContent'},
          {
            path: 'VisitList',
            name: 'visitList',
            meta: {title:"客户拜访"},
            component: visitList,
          },
          {
            path: 'VisitContent',
            name: 'visitContent',
            meta: {title:"拜访详情"},
            component: visitContent,
          },
          {
            path: 'ClientContent',
            name: 'clientContent',
            meta: {title: "客户详情"},
            component: clientContent,
          },
          {
            path: 'ContactList',
            name: 'contactList',
            meta: {title:"客户联系人"},
            component: contactList,
          },
          {
            path: 'ContactContent',
            name: 'contactContent',
            meta: {title:"联系人详情"},
            component: contactContent,
          },
          {
            path: 'BusinessList',
            name: 'businessList',
            meta: {title:"客户商机"},
            component: businessList,
          },
          {
            path: 'BusinessContent',
            name: 'businessContent',
            meta: {title:"商机详情"},
            component: businessContent,
          },
          {
            path: 'ContractList',
            name: 'contractList',
            meta: {title:"客户合同"},
            component: contractList,
          },
        ]
      },
      {
        path: '/BusinessDetails',
        name: 'businessDetails',
        meta: {title:"商机详情"},
        component: businessDetails,
        children:[
          { path: '/', redirect: 'BusinessContent'},
          {
            path: 'BusinessList',
            name: 'businessList',
            meta: {title:"客户商机"},
            component: businessList,
          },
          {
            path: 'BusinessContent',
            name: 'businessContent',
            meta: {title:"商机详情"},
            component: businessContent,
          },
          {
            path: 'VisitList',
            name: 'visitList',
            meta: {title:"客户拜访"},
            component: visitList,
          },
          {
            path: 'VisitContent',
            name: 'visitContent',
            meta: {title:"拜访详情"},
            component: visitContent,
          },
          {
            path: 'ClientContent',
            name: 'clientContent',
            meta: {title: "客户详情"},
            component: clientContent,
          },
          {
            path: 'ContactList',
            name: 'contactList',
            meta: {title:"客户联系人"},
            component: contactList,
          },
          {
            path: 'ContactContent',
            name: 'contactContent',
            meta: {title:"联系人详情"},
            component: contactContent,
          },
          {
            path: 'ContractList',
            name: 'contractList',
            meta: {title:"客户合同"},
            component: contractList,
          },
        ]
      },
      {
        path: '/ContactDetails',
        name: 'contactDetails',
        meta: {title:"联系人详情"},
        component: contactDetails,
        children:[
          { path: '/', redirect: 'ContactContent'},
          {
            path: 'BusinessList',
            name: 'businessList',
            meta: {title:"客户商机"},
            component: businessList,
          },
          {
            path: 'BusinessContent',
            name: 'businessContent',
            meta: {title:"商机详情"},
            component: businessContent,
          },
          {
            path: 'VisitList',
            name: 'visitList',
            meta: {title:"客户拜访"},
            component: visitList,
          },
          {
            path: 'VisitContent',
            name: 'visitContent',
            meta: {title:"拜访详情"},
            component: visitContent,
          },
          {
            path: 'ClientContent',
            name: 'clientContent',
            meta: {title: "客户详情"},
            component: clientContent,
          },
          {
            path: 'ContactList',
            name: 'contactList',
            meta: {title:"客户联系人"},
            component: contactList,
          },
          {
            path: 'ContactContent',
            name: 'contactContent',
            meta: {title:"联系人详情"},
            component: contactContent,
          },
          {
            path: 'ContractList',
            name: 'contractList',
            meta: {title:"客户合同"},
            component: contractList,
          },
        ]
      },
      {
        path: '/ContractContent',
        name: 'contractContent',
        meta: {title:"合同详情"},
        component: contractContent,
      },
      {
        path: '/ReimbursePlan',
        name: 'ReimbursePlan',
        meta: {title:"新增回款计划"},
        component: reimbursePlan,
      },
      {
        path: '/ReimburseReceive',
        name: 'ReimburseReceive',
        meta: {title:"新增实际回款"},
        component:reimburseReceive,
      },
      {
        path: '/ReimburseInvoice',
        name: 'ReimburseInvoice',
        meta: {title:"新增开票回款"},
        component:reimburseInvoice,
      },
      {
        path: '/PoolTransferList',
        name: 'PoolTransferList',
        component: poolTransferList,
      },
      {
        path: '/externalPage',
        name: 'externalPage',
        meta: { title: "企微云小站" },
        component: externalPage
      },
      {
        path: '/open/',
        name: 'externalPage',
        meta: { title: "企微云小站" },
        component: externalPage
      },
      {
        path: '/clientRemind',
        name: 'clientRemind',
        meta: {title:"提醒设置"},
        component: () => import(/* webpackChunkName: "clientRemind" */ './views/client/ClientRemind/ClientRemind'),
      },
      {
        path: '/saleAnalysis',
          name: 'saleAnalysis',
        meta: {title: "销售行为分析"},
        component: saleAnalysis
      },
      {
        path: '*',
        redirect: '/index'
      },
      {
        path: '/businessGraphic',
        name: 'businessGraphic',
        meta: {title:"商机跟进统计"},
        component: () => import(/* webpackChunkName: "businessGraphic" */ './views/dataBoard/businessGraphic/businessGraphic'),
      },
      {
        path: '/businessViewList',
        name: 'businessViewList',
        meta: {title:"商机"},
        component: () => import(/* webpackChunkName: "businessViewList" */ './views/dataBoard/businessGraphic/businessViewList'),
      },
      {
        path: '/funnelViewList',
        name: 'funnelViewList',
        meta: {title:"商机阶段"},
        component: () => import(/* webpackChunkName: "funnelViewList" */ './views/dataBoard/businessFunnel/funnelViewList'),
      },
      {
        path: '/businessFunnel',
        name: 'businessFunnel',
        meta: {title:"销售漏斗"},
        component: () => import(/* webpackChunkName: "businessFunnel" */ './views/dataBoard/businessFunnel/businessFunnel'),
      },
      {
        path: '/successClient',
        name: 'successClient',
        meta: {title: '已成交客户'},
        component: () => import(/* webpackChunkName: "successClient" */ './views/dataBoard/successClient/successClient')
      },
      {
        path: '/salesTurnoverTrend',
        name: 'salesTurnoverTrend',
        meta: {title:"销售成交趋势"},
        component: () => import(/* webpackChunkName: "salesTurnoverTrend" */ './views/dataBoard/salesTurnoverTrend/salesTurnoverTrend'),
      },
      {
          path: '/goalDetail',
          name: 'goalDetail',
          component: () => import(/* webpackChunkName: "goalDetail" */ './views/dataBoard/goal/goalDetail'),
          meta: { title: '目标详情' }
      },
      {
          path: '/distributionGoal',
          name: 'distributionGoal',
          component: () => import(/* webpackChunkName: "distributionGoal" */ './views/dataBoard/goal/distributionGoal'),
          meta: { title: '分配目标' }
      },
      {
          path: '/searchMember',
          name: 'searchMember',
          component: () => import(/* webpackChunkName: "searchMember" */ './views/dataBoard/goal/searchMember'),
          meta: { title: '分配目标' }
      },
      {
          path: '/memberGoal',
          name: 'memberGoal',
          component: () => import(/* webpackChunkName: "memberGoal" */ './views/dataBoard/goal/memberGoal'),
          meta: { title: '成员目标' }
      },
      {
          path: '/searchMemberGoal',
          name: 'searchMemberGoal',
          component: () => import(/* webpackChunkName: "searchMemberGoal" */ './views/dataBoard/goal/searchMemberGoal'),
          meta: { title: '成员目标' }
      },
      {
          path: '/clientRecycle',
          name: 'clientRecycle',
          component: () => import(/* webpackChunkName: "clientRecycle" */ './views/dataBoard/clientRecycle/clientRecycle'),
          meta: { title: '即将回收的客户' }
      },
      {
          path: '/externalContact',
          name: 'externalContact',
          component: () => import(/* webpackChunkName: "externalContact" */ './views/contact/externalContact/externalContact'),
          meta: { title: '添加为客户和联系人' }
      }
    ]
  })

  newRouter.beforeEach((route, redirect, next) => {
    document.title = route.meta.title || document.title;
    if(route.name == 'clientOperate'){
      document.title = route.query.clientId ? "编辑客户":"新建客户"
    }else if(route.name == 'contactOperate'){
      document.title = route.query.contactId ? "编辑联系人":"新建联系人"
    }else if(route.name == 'visitOperate'){
      document.title = route.query.visitId ? "编辑客户拜访":"新建客户拜访"
    }else if(route.name == 'poolOperate'){
      document.title = route.query.poolId ? "编辑公海客户":"新建公海客户"
    }else if(route.name == 'businessOperate'){
      document.title = route.query.businessId ? "修改商机":"新建商机"
    }else if(route.name == 'contractOperate'){
      document.title = route.query.contractId ? "编辑合同":"新建合同"
    }else if(route.name =="competitorAdd"){
      document.title = route.query.id ? "编辑竞争对手":"新建竞争对手"
    }
    if(route.name == 'home'){
      let titleJsonObj = JSON.parse(localStorage.getItem('titleCache'+ _.userId));
      titleJsonObj ? document.title = titleJsonObj['crm'] : ''
    }
    if(route.name == 'contractIndex'){
      let titleJsonObj = JSON.parse(localStorage.getItem('titleCache'+ _.userId));
      titleJsonObj ? document.title = titleJsonObj['contract'] : ''
    }
    next();
  });
  newRouter.afterEach(function (to, from, next) {
    try{
      _.initializedData();//初始化配置数据
      window.scrollTo(0,0);
    }catch(e){

    }
  });
  return newRouter
}
export default newRouterFun
/*必配 end*/
