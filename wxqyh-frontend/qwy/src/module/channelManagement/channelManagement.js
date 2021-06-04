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

/**
 * 修正iframe 高度
 * @see /wxqyh/js/do1/common/common.js 
 */
$(window).on('load click', function(e) {
  var _browser_Version = navigator.appVersion.split(";")[1].replace(/[ ]/g, "")
  var _heightSeted = !1;
  function _resetFrameHeight() {
    var a = this.frameElement;
    if ($(a).hasClass("not_resetFrameHeight")) {
        return;
    }
    a && (a.height = a.contentDocument ? a.contentDocument.documentElement.scrollHeight : "MSIE9.0" == _browser_Version ? a.document.documentElement.scrollHeight : a.contentWindow.document.body.scrollHeight + 0,
    _heightSeted = !0,
    a.setAttribute('scrolling', 'no'))
    if (window != window.top)
        window.parent._resetFrameHeight();
  }

  setTimeout(function() {
      _resetFrameHeight.call(window);
  }, 1000)
  setTimeout(function() {
    _resetFrameHeight.call(window);
  }, 4000)

})
