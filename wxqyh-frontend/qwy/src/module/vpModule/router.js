import Vue from 'vue'
import Router from 'vue-router'
import i18nFun from "./lang"
//表单
const add = r => require.ensure([], () => r(require('./components/form/add/add')), 'add') //this.$route.params.id
const preview = r => require.ensure([], () => r(require('./components/form/add/addPreview')), 'preview') //this.$route.params.id
const detail = r => require.ensure([], () => r(require('./components/form/detail/detail')), 'detail')

Vue.use(Router)

function newRouterFun() {
	const i18n = i18nFun(_.lang)
	const locale = i18n.locale;

	const title = i18n.messages[locale].i18n;

	const newRouter = new Router({
		routes: [
			{
				path: '/form/add',
				name: 'add',
				meta: {title: '填写表单'},
				component: add
			},{
				path: '/form/preview',
				name: 'preview',
				meta: {title: '表单详情'},
				component: preview
			},{
                path: '/form/detail',
                name: 'detail',
                meta: {title: '表单详情'},
                component: detail
              }
		]
	})
	/*必配 start*/
	newRouter.afterEach(function (to, from, next) {
		try {
			_.initializedData();//初始化配置数据
		} catch (e) {

		}
	});

	return newRouter;
}

export default newRouterFun
/*必配 end*/





