import Vue from 'vue'
import Router from 'vue-router'
import i18nFun from "@/lang"

//首页
const home = r => require.ensure([], () => r(require('./components/index')), 'index')
//我的行程
const travel = r => require.ensure([], () => r(require('./components/travel/travel')), 'travel')
//待我处理
const audit = r => require.ensure([], () => r(require('./components/audit/audit')), 'audit')
//车辆状态
const status = r => require.ensure([], () => r(require('./components/status/status')), 'status')
//相关申请
const relate = r => require.ensure([], () => r(require('./components/relate/relate')), 'relate')
//单位派车
const add = r => require.ensure([], () => r(require('./components/add/add')), 'add')
//企业叫车
const didiAdd = r => require.ensure([], () => r(require('./components/add/didiAdd')), 'didiAdd')
//详情页
const detail = r => require.ensure([], () => r(require('./components/detail/detail')), 'detail')
//地图
const mapSearch = r => require.ensure([], () => r(require('./components/mapSearch/mapSearch')), 'map')

Vue.use(Router)

function newRouterFun() {
	const i18n = i18nFun(_.lang)
	const locale = i18n.locale

	const title = i18n.messages[locale].i18n

	const newRouter = new Router({
		routes: [
			{
				path: '/',
				redirect: '/travel'
			},
      {
        path: '/',
        name: 'home',
        meta: {title: "车辆管理"},
        component: home,
        children: [
          {
            path: '/travel',
            name: 'travel',
            meta: {title: "企业用车"},
            component: travel
          },
          {
            path: '/audit',
            name: 'audit',
            meta: {title: '待我处理'},
            component: audit
          },
          {
            path: '/status',
            name: 'status',
            meta: {title: '车辆状态'},
            component: status
          },
          {
            path: '/relate',
            name: 'relate',
            meta: {title: '相关申请'},
            component: relate
          }
        ]
      },
      {
        path: '/add',
        name: 'add',
        meta: {title: '单位派车'},
        component: add
      },
      {
        path: '/didiAdd',
        name: 'didiAdd',
        meta: {title: '企业叫车'},
        component: didiAdd
      },
      {
        path: '/detail',
        name: 'detail',
        meta: {title: '用车详情'},
        component: detail
      },
      {
        path: '/detail/map',
        name: 'map',
        meta: {title: '单位派车'},
        component: mapSearch
      }
		]
	})

	newRouter.beforeEach((route, redirect, next) => {
		document.title = route.meta.title || document.title;
		if (route.name == 'travel') {
			dataBase.car.footerList.nav_on = 0;
		} else if (route.name == 'audit') {
			dataBase.car.footerList.nav_on = 1;
		} else if (route.name == 'status') {
			dataBase.car.footerList.nav_on = 2;
		} else if (route.name == 'relate') {
			dataBase.car.footerList.nav_on = 3;
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

export default newRouterFun
/*必配 end*/





