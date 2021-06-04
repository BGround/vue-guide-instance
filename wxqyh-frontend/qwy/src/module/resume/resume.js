import '../../assets/js/common.js'
import Vue from 'vue'
import App from './App'
import router from './router'
import dataBase from'./dataBase'
import store from './store'
window.dataBase = dataBase;

getLoginMessagePromise().then(function() {
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
  componentUpdated: function (el, binding, vNode) {
    window.dataBase.showSidebar = true;
    const permData = store.state.header.permission;
    if(binding.value!=undefined&&!permData[binding.value]){
      el.style.display = 'none';
    }
  }
});