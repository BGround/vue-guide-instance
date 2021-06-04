import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
const resumeDetail = r => require.ensure([], () => r(require('./view/resume/resumeDetail')),'resume_detail')
const resumeNewBuild = r => require.ensure([], () => r(require('./view/resume/resumeNewBuild')),'resume_new_build')
const resumeManager = r => require.ensure([], () => r(require('./view/resume/resumeManager')),'resume_manager')
export default new Router({
  routes: [
    {
      path: '/',
      name: 'resumeManager',
      redirect:"/resume_manager",
      component: resumeManager,
    },
    {
      path: '/resume_detail',
      name: 'resumeDetail',
      component: resumeDetail
  },
    {
      path: '/resume_new_build',
      name: 'resumeNewBuild',
      component: resumeNewBuild
    },
    {
      path: '/resume_manager',
      name: 'resumeManager',
      component: resumeManager
    }
    
  ]
})
