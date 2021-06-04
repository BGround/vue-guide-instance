import Vue from 'vue'
import Router from 'vue-router'
import i18nFun from "@/lang";
/*必配 start */
Vue.use(Router)

// 主页
const hrmanagement = r => require.ensure([], () => r(require('./views/index')),'hrmanagement_index');

//工作台
const workBench = r => require.ensure([], () =>r(require('./views/home/workBench')),'work_bench');

//绩效考核
const performanceAppraisal = r => require.ensure([],() => r(require('./views/performanceAppraisal')),'performance_appraisal');

//完善生日信息
const completeBirthdayMes = r => require.ensure([], () =>r(require('./components/birthMessage')),'complete_birthday_mes');

//待办事项
const unfinishedMatter = r => require.ensure([], () => r(require('./components/unfinishedMatter')),'unfinished_matter');

// 人事档案
const archives =  r => require.ensure([], () => r(require('./views/Archives')),'archives');

// 我的
const myRelavent =  r => require.ensure([], () => r(require('./views/myRelavent')),'myRelavent');

// 工资条查看设置
const payrollSetting =  r => require.ensure([], () => r(require('./views/myRelevance/payrollSetting')),'payrollSetting');

//员工关怀列表
const employeesCareList =  r => require.ensure([], () => r(require('./components/employeesCareList')),'employeesCareList');

//我的考核结果
const myCheck=  r => require.ensure([], () => r(require('./views/myRelevance/myCheck')),'myCheck');
// 功能指引页
const functionGuideDetails = r => require.ensure([], () => r(require("./views/functionGuideDetails/functionGuideDetails")),"functionGuideDetails");

//个税专项扣减
const taxDetail=  r => require.ensure([], () => r(require('./views/tax/taxDetail')),'taxDetail');

//我的考核历史
const checkHistory=  r => require.ensure([], () => r(require('./views/checking/checkHistory')),'checkHistory');
//需评分人员
const checkMarkList=  r => require.ensure([], () => r(require('./views/checking/checkMarkList')),'checkMarkList');
//全部员工档案
const allRecord=  r => require.ensure([], () => r(require('./views/staffRecord/allRecord')),'allRecord');
//考核结果
const checkResult=  r => require.ensure([], () => r(require('./views/staffRecord/checkResult')),'checkResult');
//完成评分人员列表
const checkPersonList=  r => require.ensure([], () => r(require('./views/staffRecord/checkPersonList')),'checkPersonList');
// 个人资料
const personalData=  r => require.ensure([], () => r(require('./views/personalData')),'personalData');
//评分页
const checkMark=  r => require.ensure([], () => r(require('./views/checking/checkMark')),'checkMark');
//未完成评分页
const doCheckMark=  r => require.ensure([], () => r(require('./views/checking/doCheckMark')),'doCheckMark');
// 问题反馈列表页
const FeedBackList=  r => require.ensure([], () => r(require('./views/myRelevance/FeedBackList')),'FeedBackList');

function newRouterFun() {
  const i18n = i18nFun(_.lang)
  const locale = i18n.locale;
  const title = i18n.messages[locale].i18n.hrmanagement.title;
  //let title = title.hrmanagement.title;
	const newRouter = new Router({
	  routes: [
		{
		  path: '/', // 首页
		  name: 'hrmanagement',
		  component: hrmanagement,
		  children:[
			  {
				path:'',  //工作台
				name:'work_bench',
				component: workBench,
				meta:{
					title: '',
					keepAlive: true
				},
			  },
			  {	// 绩效考核
				path:'performance_appraisal',
				name:'performance_appraisal',
				component: performanceAppraisal,
				meta:{
					title: title.performance,
					keepAlive: true
				},
			  },
			  {	// 员工档案
				path:'archives',
				name:'archives',
				component: archives,
				meta:{
					title: title.archives,
					keepAlive: true
				},
			  },
			  {	// 员工档案
				path:'myRelavent',
				name:'myRelavent',
				component: myRelavent,
				meta:{
					title: title.myRelavent,
					keepAlive: true
				},
				},
		  ]
		},
		{
			path: '/complete_birthday_mes', // 完善生日信息
			name: 'complete_birthday_mes',
			meta: {
			  title: title.birthMes,
			},
			component: completeBirthdayMes
		},
		{
			path: '/unfinished_matter',
			name: 'unfinished_matter',
			meta: {
			  title: "",
			},
			component: unfinishedMatter
		},
		{
      path: '/employees_care_list',
      name: 'employees_care_list',
      meta: {
        title: "员工关怀",
		},
			component:employeesCareList,
		},
		{
			path: '/myCheck',
			name: 'myCheck',
			meta: {
			  title: "我的考核结果",
			},
			component: myCheck
		},
		{
			path: '/taxDetail',
			name: 'taxDetail',
			meta: {
			  title: "个税抵扣",
			},
			component: taxDetail
		},
		// 功能指引
		{
			path: '/functionGuideDetails',
			name: 'functionGuideDetails',
			component: functionGuideDetails,
			meta: {
				title: "功能指引"
			},
    },
      {
        path:'/payrollSetting',
        name:'payrollSetting',
        component:payrollSetting,
        meta: {
          title: "工资条查看设置",
        },
      },
    //我的考核
    {
			path: '/checkHistory',
			name: 'checkHistory',
			component: checkHistory,
			meta: {
				title: "我的考核"
			},
    },
    //需评分人员
    {
			path: '/checkMarkList',
			name: 'checkMarkList',
			component: checkMarkList,
			meta: {
				title: "需评分人员"
			},
    },
    {
			path: '/checkMark',
			name: 'checkMark',
			component: checkMark,
			meta: {
				title: "评分页"
			},
    },
    {
			path: '/doCheckMark',
			name: 'doCheckMark',
			component: doCheckMark,
			meta: {
				title: "评分页"
			},
    },
    //员工绩效考核
    {
			path: '/allRecord',
			name: 'allRecord',
			component: allRecord,
			meta: {
				title: "绩效考核"
			},
    },
    //考核结果
    {
			path: '/checkResult',
			name: 'checkResult',
			component: checkResult,
			meta: {
				title: "考核结果"
			},
    },
    //完成评分列表
    {
			path: '/checkPersonList',
			name: 'checkPersonList',
			component: checkPersonList,
			meta: {
				title: "完成评分人员"
			},
    },
    //个人资料
    {
			path: '/personalData',
			name: 'personalData',
			component: personalData,
			meta: {
				title: "个人资料"
			},
    },
      {
        path:'/payrollSetting',
        name:'payrollSetting',
        component:payrollSetting,
        meta: {
          title: "工资条查看设置",
        },
      },
      {
        path:'/FeedBackList',
        name:'FeedBackList',
        component:FeedBackList,
        meta: {
          title: "问题反馈",
        },
      },
	  ]
	});

	newRouter.beforeEach((route, redirect, next) => {
	  let wxqyh = dataBase.wxqyh_uploadfile

	  document.title = route.meta.title;

	  // router刷新链接，防止微信ios 分享链接依然为入口链接
	  if (route.path !== '/') {
		setTimeout(() => {
		  window.location = window.location;
		}, 500);
	  }
    if(route.name == 'work_bench'){
      let titleJsonObj = JSON.parse(localStorage.getItem('titleCache'+ _.userId));
      titleJsonObj ? document.title = titleJsonObj['hrmanagement'] : title.personnel
    }
	  next();
	});

	/*必配 start*/
	newRouter.afterEach(function (route, redirect, next) {
	  try {
		_.initializedData();//初始化配置数据
	  } catch (e) {

	  }
	});
	return newRouter;
  }
export default newRouterFun;
/*必配 end */
