import '../../assets/js/common.js'
import Vue from 'vue'
import App from './App'
import router from './router'
import dataBase from'./dataBase'
import store from './store'
import getPermission from '@/assets/js/permission/permission'
import { extendVue } from './utils/index'
import codemirror from 'vue-codemirror' // 引入codemirror文本编辑器
import 'codemirror/lib/codemirror.css' // 引入默认样式

Vue.use(codemirror)

window.dataBase = dataBase;

router.beforeEach((to, from, next) => {
  // 验证托管权限
  let obj = {store, to, from, next};
  getPermission(obj);
});

getLoginMessagePromise().then(() => {
  //扩展vue原型
  extendVue();
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  });
})

// 自定义指令 v-perm，用于验证权限
Vue.directive('perm', {
  componentUpdated: function (el, binding, vNode) {
    window.dataBase.showSidebar = true;
    const permData = store.state.header.permission;
    if(binding.value!=undefined&&!permData[binding.value]){
      el.style.display = 'none';
    }
  }
});

