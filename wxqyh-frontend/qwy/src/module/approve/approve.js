import 'assets/js/common.js';
import "assets/css/style.css";
import "assets/css/fonts/iconfont.css";
import "assets/fonts/iconfont.css";
import Vue from 'vue'
import router from './router'
import dataBase from'./dataBase'
import store from './store'
import getPermission from '@/assets/js/permission/permission'
import App from './App'

window.dataBase = dataBase;

router.beforeEach((to, from, next) => {
  // 验证托管权限
  let obj = {store, to, from, next};
  getPermission(obj);
});

getLoginMessagePromise().then(function() {
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
  });
});

// 自定义指令 v-perm，用于验证权限
Vue.directive('perm', {
  componentUpdated: function (el, binding, vNode) {
    window.dataBase.showSidebar = true;
    const permData = store.state.header.permission;
    if(binding.expression && (binding.expression.indexOf('||')>-1 || binding.expression.indexOf('&&')>-1)){
      let or = binding.expression.split('||'),
          both = binding.expression.split('&&');
      let exist = false;
      if(binding.expression.indexOf('&&')>-1 &&  binding.expression.indexOf('||')>-1){
        return
      }
      if(binding.expression.indexOf('||')>-1){
        for(let i = 0;i<or.length;i++){
          or[i] = or[i].trim().substring(1).substring(0, or[i].length - 3);
          if(permData[or[i]]){
            exist = true;
            break;
          }
        }
      }
      if(binding.expression.indexOf('&&')>-1){
        for(let j = 0;j<both.length;j++){
          both[j] = both[j].trim().substring(1).substring(0, both[j].length - 3);
          if(!permData[both[j]]){
            exist = false;
            break;
          }else {
            exist = true;
          }
        }
      }
      if(exist) {
        return
      } else {
        return el.style.display = 'none';
      }
    }else {
      if(binding.value!=undefined&&!permData[binding.value]){
        el.style.display = 'none';
      }
    }
  }
});


