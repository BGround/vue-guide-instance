import Vue from 'vue'
import Router from 'vue-router'
import i18nFun from "@/lang";

const home = r => require.ensure([], () => r(require('@/module/channelManagement/views/home')), 'home')
const cityDetail = r => require.ensure([], () => r(require('@/module/channelManagement/views/cityDetail')), 'cityDetail')

//无权限页
const noPermission = r =>
  require.ensure([], () => r(require('@/module/channelManagement/views/noPermission')), 'noPermission')


import reportCardRoute from './reportCard';
import archiveRoutes from './archive';
import wx from "weixin-js-sdk";

Vue.use(Router)

function newRouterFun(hasHomePermission) {
  const i18n = i18nFun(_.lang)
  const locale = i18n.locale;
  const title = i18n.messages[locale].i18n;
  const newRouter = new Router({
    routes: [
      {
        path: '/',
        name: 'channelManagement',
        redirect: '/home'
      },
      {
        path: '/home',
        name: 'home',
        meta: { title: '渠道管理平台' },
        component: home
      },
        {
            path: '/cityDetail',
            name: 'cityDetail',
            meta: { title: '渠道管理平台' },
            component: cityDetail
        },



      ...archiveRoutes,
      ...reportCardRoute,

      {
        path: '/noPermission',
        name: 'noPermission',
        meta: { title: '没有权限' },
        component: noPermission
      }
    ]
  })

  newRouter.beforeEach((to, form, next) => {
    window.scroll(0,0)
      const isReportCardModule = to.matched && to.matched[0] && to.matched[0].name === 'reportCard'
      if(!isReportCardModule && !hasHomePermission){
          _.alert('提示','您无权限查看', {
              primaryBtn:{
                  name:"i18n.confirm",
                  callBack: ()=>{
                      wx.closeWindow();
                  }},
              defaultBtn:{
                  name:"i18n.cancel",
                  callBack:null
              },
          })
          next(false);
      }else{
          if (to.meta.title || document.title) {
              document.title = to.meta.title || document.title
          }
          next()
      }

  })

  /*必配 start*/
  newRouter.afterEach(function(to, from) {
    try {
      _.initializedData() //初始化配置数据
    } catch (e) {}
  })
  return newRouter
}
export default newRouterFun
/*必配 end*/
