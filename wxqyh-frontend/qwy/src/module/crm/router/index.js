import Vue from 'vue';
import Router from 'vue-router';
import territorialSea from './territorialSea';
import crmSetting from './setting';
import visit from './visit';
import client from './client';

Vue.use(Router);

// 路由 meta - role 属性说明：
// 已经托管的路由才进入，没有的就返回
// 沒有设置权限直接进入

// 路由配置，现在默认路由暂定为目标
const constantRouterMap = [
  {
    path: "/changePsw",
    component: () => import("@/components/list/changePsw")
  },
  {
    path: "/",
    component: () => import("crm/views"),
    redirect: "/crm",
    children: [
      //移动crm
      {
        path: "crm",
        name: "crm",
        redirect: '/crm/territorialSea',
        component: () => import("crm/views/crm"),
        meta: {
          role: "crm"
        },
        children: [
          //联系人
          {
            path: "contact",
            name: 'crmContact',
            redirect: 'contact/list',
            component: () => import("crm/views/crm/contact"),
            children: [{
              path: "list",
              name: "crmContactList",
              component: () => import("crm/views/crm/contact/list")
            }, {
              path: "add",
              name: "crmContactAdd",
              component: () => import("crm/views/crm/contact/add")
          }]
          },
          // 目标
          {
            path: "goal",
            name: "goal",
            redirect: "goal/list",
            component: () => import("crm/views/crm/goal"),
            children: [
              {
                path: "list",
                name: "goalList",
                component: () => import("crm/views/crm/goal/goalList"),
                meta: {
                  role: "crm"
                }
              },
              {
                path: "detail",
                name: "goalDetail",
                component: () => import("crm/views/crm/goal/goalDetail"),
                meta: {
                  role: "crm"
                }
              }
            ]
          },
          // 竞争对手
          {
            path: "competitorList",
            name: "competitorList",
            component: () => import("crm/views/crm/competitor/competitorList"),
            meta: {
              role: "crm",
              module: "competitor"
            }
          },
          // 设置
          crmSetting,
          // 公海
          territorialSea,
          //拜访
          visit,
          // 客户
          client
        ],
      },
      // 企微云小站
      {
        path: "assistant",
        name: "assistant",
        component: () => import("crm/views/assistant"),
        redirect: "/assistant/assistantGuide",
        children: [
          {
            path: "assistantGuide",
            name: "assistantGuide",
            component: () =>
              import("crm/views/assistant/assistantGuide/assistantGuide")
          },
          {
            path: "productList",
            name: "productList",
            component: () =>
              import("crm/views/assistant/productList/productList")
          },
          {
            path: "addOrEditProduct",
            name: "addOrEditProduct",
            component: () =>
              import("crm/views/assistant/addOrEditProduct/addOrEditProduct")
          },
          {
            path: "setting",
            name: "assistantSetting",
            component: () => import("crm/views/assistant/setting/setting")
          }
        ]
      }
    ]
  },
  // 小站建站
  {
    path: "/officialWebsite",
    name: "officialWebsite",
    component: () => import("crm/views/assistant/officialWebsite")
  },
  // 小站设置
  {
    path: "/smallProgramMenuSet", //小程序菜单设置
    name: "smallProgramMenuSet",
    component: () =>
      import("crm/views/assistant/smallProgramMenuSet/smallProgramMenuSet")
  },
  {
    path: "*",
    redirect: "/"
  }
];

export default new Router({
  routes: constantRouterMap
});
