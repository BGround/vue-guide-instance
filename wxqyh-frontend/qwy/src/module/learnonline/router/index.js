import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const changePsw = r => require.ensure([], () => r(require('@/components/list/changePsw')));
const learnonline = r => require.ensure([], () => r(require('../views/index')));
// const courseManage = r => require.ensure([], () => r(require('learn/views/courseManage/courseList')));
// const openCourse = r => require.ensure([], () => r(require('learn/views/courseManage/openCourse')));
const addExam = r => require.ensure([], () => r(require('../views/examManage/addExam/addExam')));
const onlineEditingQuestions = r => require.ensure([], () => r(require('../views/questionManage/addQuestion/onlineEditingQuestions')));
const scoreStatistics = r => require.ensure([], () => r(require('../views/dataStatistics/scoreStatistics.vue')));
const learnStatistics = r => require.ensure([], () => r(require('../views/dataStatistics/learnStatistics.vue')));
const scoreDetial = r => require.ensure([], () => r(require('../views/dataStatistics/scoreDetial.vue')));
const learnDetial = r => require.ensure([], () => r(require('../views/dataStatistics/learnDetial.vue')));
const examSetting = r => require.ensure([], () => r(require('../views/examsetting/examSetting')));
const menuSetting = r => require.ensure([], () => r(require('../views/examsetting/menuSetting/menuSetting')));
const availSetting = r => require.ensure([], () => r(require('../views/examsetting/availSetting/availSetting')))



// 路由配置，现在默认路由暂定为目标
const constantRouterMap = [
    {
        path: '/changePsw',
        component:changePsw
    },
    {
        path:'/',
        name: 'learnonline',
        component: learnonline,
        children: [
          //开课管理
          // {
          //   path: 'courseManage',
          //   name: 'courseManage',
          //   component: courseManage,
          // },
          {
            path: 'scoreStatistics',
            name: 'scoreStatistics',
            component: scoreStatistics,
            meta: {
              keepAlive: true // 需要被缓存
            }
          },{
              path: 'learnStatistics',
              name: 'learnStatistics',
              component: learnStatistics,
              meta: {
                keepAlive: true // 需要被缓存
              }
          },
          {
            path: 'examSetting',
            name: 'examSetting',
            component: examSetting
          },
          {
            path: 'examSetting/menuSetting',
            name: 'menuSetting',
            component: menuSetting
          },
          {
            path: 'examSetting/availSetting',
            name: 'availSetting',
            component: availSetting
          }
        ],
    },
    //开课管理下的路由
    // {
    //   path: '/openCourse',
    //   name: 'openCourse',
    //   component: openCourse,
    // },
    //新建内部考试
    {
      path: '/addExam',
      name: 'addExam',
      component: addExam,
    },
    {
      path: '/onlineEditingQuestions/:id',
      name: 'onlineEditingQuestions',
      component: onlineEditingQuestions,
    },
    {
      path: '/scoreDetial/:Id',
      name: 'scoreDetial',
      component: scoreDetial,
    },
    {
      path: '/learnDetial/:userId',
      name: 'learnDetial',
      component: learnDetial,
    }
]

export default new Router({
    routes:constantRouterMap
})
