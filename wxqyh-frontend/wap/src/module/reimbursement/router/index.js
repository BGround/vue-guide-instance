import Vue from 'vue';
import Router from 'vue-router';
import i18nFun from "@/lang";
import { isWhiteCorpId } from '../api/debit';

const QwMain = r => require.ensure([], () => r(require('../views/Main')), 'Main');
// QwNewMain
const QwNewMain = r => require.ensure([], () => r(require('../views/newMain')), 'newMain');
const QwReimbursement = r => require.ensure([], () => r(require('../views/reimbursement/Reimbursement')), 'Reimbursement');
// newReimbursement
const QwnewReimbursement = r => require.ensure([], () => r(require('../views/reimbursement/newReimbursement')), 'newReimbursement');
const QwRelated = r => require.ensure([], () => r(require('../views/related/Related')), 'Related');
// newRelated
const QwNewRelated = r => require.ensure([], () => r(require('../views/related/newRelated')), 'newRelated');
const QwApproved = r => require.ensure([], () => r(require('../views/approved/Approved')), 'Approved');
const QwBudget = r => require.ensure([], () => r(require('../views/budget/Budget')), 'Budget');
const QwDetail = r => require.ensure([], () => r(require('../views/reimbursement/ReimbursementDetail')), 'ReimbursementDetail');
const QwEditor = r => require.ensure([], () => r(require('../views/editor/Editor')), 'Editor');
const QwMoreView = r => require.ensure([], () => r(require('../views/moreView/moreView')), 'MoreView');
const FeedBackList = r => require.ensure([], () => r(require('../components/FeedBackList')), 'FeedBackList');
// const QwDraft = r => require.ensure([], () => r(require('../views/Draft/Draft')), 'Draft');
const QwDraft = () => import('../views/draft/Draft');
//newDraft
const QwnewDraft = r => require.ensure([], () => r(require('../views/draft/newDraft')), 'newDraft');
// const QwnewDraft = () => import('../views/draft/newDraft');
const QwBudgetDetail = r => require.ensure([], () => r(require('../views/budget/BudgetDetail')), 'BudgetDetail');
const QwDebitAdd = r => require.ensure([], () => r(require('../views/debit/add/Add')), 'QwDebitAdd');
const QwDebitDebitList = r => require.ensure([], () => r(require('../views/debit/debitlist/DebitList')), 'QwDebitDebitList');
const QwDebitDetail = r => require.ensure([], () => r(require('../views/debit/detail/Detail')), 'QwDebitDetail');
Vue.use(Router);

function isWhiteCorpIds(to, from, next, path){
  isWhiteCorpId({agentCode: 'reimbursement', agentFunction: 'loan'}).then((res) => {
    if (res.code == '0') {
      if (res.data.isWhiteCorpId) {
        return next({path: path});
      } else {
        return next();
      }
    } else {
      return next();
    }
  }).catch(err => {
    return next();
  })
};

function newRouterFun() {
  const i18n = i18nFun(_.lang);
  const locale = i18n.locale;
  const title = i18n.messages[locale].i18n;

  const newRouter = new Router({
    routes: [{
        path: '/',
        component: QwMain,

        children: [{
            path: '',
            name: 'reimbursement',
            component: QwReimbursement,
            meta: { status: 1, type: 1 },
            beforeEnter: (to, from, next) => {
              isWhiteCorpIds(to, from, next,'/newMain');
            }
          },
          {
            path: 'reimbursement',
            redirect: '/',
          },
          {
            path: 'approved',
            name: 'approved',
            component: QwApproved,
            meta: { status: 0, type: 2 }
          },
          {
            path: 'related',
            name: 'related',
            component: QwRelated,
            meta: { status: 1, type: 2 },
            beforeEnter: (to, from, next) => {
              isWhiteCorpIds(to, from, next,'/newRelated');
            }
          },
          {
            path: 'draft',
            name: 'draft',
            component: QwDraft,
            meta: { status: 0, type: 1 },
            beforeEnter: (to, from, next) => {
              isWhiteCorpIds(to, from, next,'/newDraft');
            }
          },
          {
            path: 'more',
            name: 'more',
            component: QwMoreView,
            beforeEnter: (to, from, next) => {
              isWhiteCorpIds(to, from, next,'/newMore');
            }
          },
        ]
      },
      {
        path: '/budget',
        name: 'budget',
        component: QwBudget,
      },

      {
        path: '/newMain',
        component: QwNewMain,

        children: [
          {
            path: '',
            name: 'newReimbursement',
            component: QwnewReimbursement,
            meta: { listType: 0 }
          },
          {
            path: '/newReimbursement',
            redirect: '/newMain',
          },
          {
            path: '/newRelated',
            name: 'newRelated',
            component: QwNewRelated,
            meta: { listType: 2 ,queryType:2}
          },
          {
            path: '/newMore',
            name: 'newMore',
            component: QwMoreView,
          },
          {path: '/debitList',name: 'debitList',component: QwDebitDebitList,meta: { listType: 1 }},
        ]
      },

      //  草稿
      {
        path: '/newDraft',
        name: 'newDraft',
        component: QwnewDraft,
        meta: { listType: 2 ,queryType:4 }
      },
      {
        path: '/detail',
        name: 'detail',
        component: QwDetail,
      },
      // 新建报销
      {
        path: '/add',
        name: 'add',
        component: QwEditor,
      },
      // 编辑报销
      {
        path: '/edit',
        name: 'edit',
        component: QwEditor,
      },
      // 审批编辑
      {
        path: '/approveredit',
        name: 'approveredit',
        component: QwEditor,
      },
      // 复制报销
      {
        path: '/copy',
        name: 'copy',
        component: QwEditor,
      },
      {
        path: '/budgetDetail',
        name: 'budgetDetail',
        component: QwBudgetDetail,
      },
      {
        path: '/feedback-list',
        name: 'FeedBackList',
        component: FeedBackList,
      },
      // 新建借支
      {
        path: '/debitAdd',
        name: 'debitAdd',
        component: QwDebitAdd,
      },
      //复制借款
      {
        path: '/debitCopy',
        name: 'debitCopy',
        component: QwDebitAdd,
      },
      //提单人编辑借款
      {
        path: '/debitEdit',
        name: 'debitEdit',
        component: QwDebitAdd,
      },
      //审批人编辑借款
      {
        path: '/debitApproveredit',
        name: 'debitApproveredit',
        component: QwDebitAdd,
      },
      // 借支详情
      {
        path: '/debitDetail',
        name: 'debitDetail',
        component: QwDebitDetail,
      },
    ]
  });

  newRouter.beforeEach((route, redirect, next) => {
    const title = i18n.messages[i18n.locale].i18n.reim.pages;
    if(route.name == 'reimbursement' || route.path == '/newMain'){
      let titleJsonObj = JSON.parse(localStorage.getItem('titleCache'+ _.userId));
      titleJsonObj ? document.title = titleJsonObj['reimbursement'] : ''
    } else if(title[route.name]){
      document.title = title[route.name];
    }
    next();
  });

  /*必配 start*/
  newRouter.afterEach(function(route, redirect, next) {
    try {
      _.initializedData(); //初始化配置数据
    } catch (e) {

    }
  });
  return newRouter;
}
export default newRouterFun
/*必配 end*/
