import '../../assets/js/common.js'
import Vue from 'vue'
import App from './App'
import router from './router'
import dataBase from'./dataBase'
import store from './store'
import getPermission from '@/assets/js/permission/permission'
import api from './api/index'

window.dataBase = dataBase;
Vue.prototype.$api = api;

router.beforeEach((to, from, next) => {
  // 验证托管权限
  let obj = {store, to, from, next};
  getPermission(obj);
});

getLoginMessagePromise().then(function(){
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  });
});


// 自定义指令 v-perm，用于验证权限
Vue.directive('perm', {
  inserted: function (el, binding, vNode) {
    if(!binding.value)  return;
    const permData = store.state.header.permission;
    if(!permData[binding.value]){
      el.parentNode.removeChild(el);
    }
  }
});


