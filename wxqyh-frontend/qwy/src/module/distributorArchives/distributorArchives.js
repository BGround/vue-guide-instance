import 'assets/js/common.js'
import 'assets/css/style.css'
import 'assets/css/fonts/iconfont.css'
import 'assets/fonts/iconfont.css'
import '../../../static/UE/editor_api.js'
import Vue from 'vue'
import router from './router'
import dataBase from './dataBase'
import store from './store'
import getPermission from '@/assets/js/permission/permission'
import App from './App'
import timeSelect from 'components/DateTime/index.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

window.dataBase = dataBase
Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  // 验证托管权限
  let obj = { store, to, from, next }
  getPermission(obj)
})

// 处理成绩单权限
router.beforeEach((to, from, next) => {
    const permission = store.state.header.permission
    const hasSalesMenu = permission['reportCardIndexMenu']
    const hasAfterSales = permission['saleReportCardIndexMenu']
    console.log(hasSalesMenu, hasAfterSales, 'hasAfterSales')
    if(to.name === 'schoolReport'){
       if(!hasSalesMenu && hasAfterSales){
           next({name: 'afterSchoolReport'})
       }
       if(!hasSalesMenu && !hasAfterSales){
           next(false);
       }
    }
    next();
})

getLoginMessagePromise().then(function() {
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })

  Vue.use(timeSelect)
})

// 自定义指令 v-perm，用于验证权限
Vue.directive('perm', {
  componentUpdated: function(el, binding, vNode) {
    window.dataBase.showSidebar = true
    const permData = store.state.header.permission
    if (binding.value != undefined && !permData[binding.value]) {
      el.style.display = 'none'
    }
  }
})
