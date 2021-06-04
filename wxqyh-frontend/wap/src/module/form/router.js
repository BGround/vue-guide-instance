import Vue from 'vue'
import Router from 'vue-router'
import i18nFun from "@/lang"
//主页
const home = r => require.ensure([], () => r(require('./views/Index')), 'form_index')
const appdetail = r => require.ensure([], () => r(require('./views/AppDetail')), 'form_appdetail')
const more = r => require.ensure([], () => r(require('./views/More')), 'form_more')
const formtype = r => require.ensure([], () => r(require('./views/FormType')), 'form_type')
const add = r => require.ensure([], () => r(require('./components/add/add')), 'form_add') //this.$route.params.id
const mainPage = r => require.ensure([], () => r(require('./views/Home.vue')), 'form_mainPage')
const audit = r => require.ensure([], () => r(require('./views/Audit')), 'form_audit')
const mine = r => require.ensure([], () => r(require('./views/Mine')), 'form_mine')
const detail = r => require.ensure([], () => r(require('./components/detail/detail')), 'form_detail')
const open = r => require.ensure([], () => r(require('./views/open')), 'form_open')
const dataManager = r => require.ensure([], () => r(require('./components/dataManager/dataManager')), 'form_dataManager');
const detailData = r => require.ensure([], () => r(require('./components/dataManager/detailData/detailData')), 'form_detailData') // 明细数据页
const dataReport = r => require.ensure([], () => r(require('./components/dataManager/dataReport/dataReport')), 'form_dataReport') // 统计报表页
const flowBoard = r => require.ensure([], () => r(require('./components/dataManager/detailData/flowBoard/flowBoard')), 'form_flowBoard') // 流程看板
const draft = r => require.ensure([], () => r(require('./views/Draft')), 'form_draft')
const collection = r => require.ensure([], () => r(require('./views/CollectionForm')), 'form_collection')
const openDetail = r => require.ensure([], () => r(require('./components/detail/openDetail')), 'form_openDetail')
const Search = r => require.ensure([], () => r(require('./views/Search.vue')), 'form_openDetail')
const entrust = r => require.ensure([], () => r(require('./components/list/entrust')), 'form_entrust')
const entrustAdd = r => require.ensure([], () => r(require('./components/add/entrustAdd')), 'form_entrustAdd')
const formDesign = r => require.ensure([], () => r(require('./components/formDesignMain')), 'form_design')
const formDesignAdd = r => require.ensure([], () => r(require('./components/designer/formDesignAdd')), 'form_design_add')
const designerView = r => require.ensure([], () => r(require('./components/designer/fieldViewBox')), 'form_design_view')
const designerSubmit = r => require.ensure([], () => r(require('./components/designer/formDesignerSubmit')), 'form_design_submit')
const designerSetting = r => require.ensure([], () => r(require('./components/designer/fieldSettingBox')), 'form_design_set')
const designerType = r => require.ensure([], () => r(require('./components/designer/fieldTypeBox')), 'form_design_type')
const customPrint = r => require.ensure([], () => r(require('./views/print/customPrint')), 'form_print')
const feedBackList = r => require.ensure([], () => r(require('./views/FeedBackList')), 'form_feedback_list')
const login = r => require.ensure([], () => r(require('./views/Login')), 'form_feedback_list')


Vue.use(Router)
/**新版 */
export function newRouterFun() {
	const i18n = i18nFun(_.lang)
	const locale = i18n.locale;

	const title = i18n.messages[locale].i18n;
	const newRouter = new Router({
		routes: [
			{
				path: '/open/add',
				name: 'openForm',
				meta: {title: ""},
				component: add,
			},
			{
				path: '/open/detail',
				name: 'openDetail',
				meta: {title: ""},
				component: openDetail,
      },
      {
        path: '/customPrint',
        name: 'customPrint',
        meta: {title: "自定义打印"},
        component: customPrint,
      },
      {
        path: '/open/customPrint',
        name: 'openCustomPrint',
        meta: {title: "自定义打印分享"},
        component: customPrint,
      },
      {
        path: '/',
        redirect: '/main'
      },
      {
        path: '/formdesign',
        name: 'formDesign',
        meta: {title: '选择表单类型'},
        component: formDesign,
        children: [
          {
            path: 'add',
            name: 'formDesignAdd',
            meta: {title: "创建表单"},
            component: formDesignAdd
          },
          {
            path: 'view',
            name: 'designerView',
            meta: {title: "设计表单"},
            component: designerView
          },
          {
            path: 'submit',
            name: 'designerSubmit',
            meta: {title: '选择发布对象'},
            component: designerSubmit
          },
          {
            path: 'setting',
            name: 'designerSetting',
            component: designerSetting
          },
          {
            path: 'selectType',
            name: 'designerType',
            meta: {title: '选择字段'},
            component: designerType
          }
        ]
      },
			{
				path: '/',
				name: 'home',
				meta: {title: ""},
				component: home,
				children: [
					{
						path: '/main',
						name: 'mainPage',
						meta: {title: ""},
						component: mainPage
					},
					{
						path: '/audit',
						name: 'audit',
						meta: {title: "待办"},
						component: audit
					},
					{
						path: '/mine',
						name: 'mine',
						meta: {title: "我的"},
						component: mine
					},
					{
						path: '/more',
						name: 'more',
						meta: {title: "更多"},
						component: more
          }
				]
      },
      {
        path: '/open',
        name: 'open',
        meta: {title: "我的外部单"},
        component: open
      },
      {
        path: '/feedback-list',
        name: 'feedbacklist',
        meta: {title: "在线反馈"},
        component: feedBackList
      },
			{
				path: '/formtype',
				name: 'formtype',
				meta: {title: '快速发起'},
				component: formtype
      },
      {
        path: '/appdetail',
        name: 'appdetail',
        component: appdetail
      },
			{
				path: '/draft',
				name: 'draft',
				meta: {title: '草稿'},
				component: draft
      },
      {
				path: '/login',
				name: 'login',
				meta: {title: 'login'},
				component: login
			},
			{
				path: '/collection',
				name: 'collection',
				meta: {title: '常用表单'},
				component: collection
			},
            {
              path: '/entrust',
              name: 'entrust',
              meta: {title: '委托'},
              component: entrust
            },
            {
              path: '/entrustAdd',
              name: 'entrustAdd',
              meta: {title: '新建委托'},
              component: entrustAdd
            },
			{
				path: '/add',
				name: 'add',
				meta: {title: '填写表单'},
				component: add
			},
			{
				path: '/detail',
				name: 'detail',
				meta: {title: '表单详情'},
				component: detail
      },
      {
        path: '/search',
        name: 'search',
        metha: {title: '搜索'},
        component: Search
      },
			{
				path: '/dataManager',
				name: 'dataManager',
				meta: {title: '数据管理'},
				component: dataManager,
				children: [
					{
						path: '/',
						redirect: 'detailData'
					},
					{
						path: 'detailData',
						name: 'detailData',
						meta: {title: '明细数据'},
						component: detailData
					},
					{
						path: 'dataReport',
						name: 'dataReport',
						meta: {title: '统计报表'},
						component: dataReport,
					}
				]
			},
			{
				path: '/flowBoard',
				name: 'flowBoard',
				meta: {title: '流程看板'},
				component: flowBoard
			}
		]
	})

	newRouter.beforeEach((route, redirect, next) => {
    document.title = route.meta.title || document.title;
    if(route.name == 'appdetail') { //应用详情显示应用名
      document.title = route.query.title;
    }
    if(route.name == 'mainPage'){
      let titleJsonObj = JSON.parse(localStorage.getItem('titleCache'+ _.userId));
      titleJsonObj ? document.title = titleJsonObj['form'] : ''
    }
		next();
	});

	/*必配 start*/
	newRouter.afterEach(function (to, from, next) {
		try {
			_.initializedData();//初始化配置数据
		} catch (e) {

		}
	});

	return newRouter;
}




