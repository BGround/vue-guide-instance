import '../../assets/js/common.js'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import dataBase from'./dataBase'
import infiniteScroll from 'vue-infinite-scroll'
import '@/permission'

window.dataBase = dataBase;
Vue.use(infiniteScroll);

getLoginMessagePromise().then(function() {
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
  })
});

// 自定义指令 v-perm，用于验证权限
Vue.directive('perm', {
    inserted: function (el, binding, vNode) {
        const roles = store.getters.roles
        let or = binding.expression.split('||'),
            both = binding.expression.split('&&');
        if(both.length != 1) {
            let value = both,
                exist = true;
            value.forEach((item) => {
                item = item.substring(1).substring(0, item.length - 2);
                if(!roles[item]) {
                    exist = false;
                }
            })
            if(exist) {
                return
            } else {
                return el.parentNode.removeChild(el);
            }
        } else if(or.length != 1)  {
            let value = or,
                exist = false;
            value.forEach((item) => {
                item = item.substring(1).substring(0, item.length - 2);
                if(roles[item]) {
                    exist = true;
                }
            })
            if(exist) {
                return
            } else {
                return el.parentNode.removeChild(el);
            }
        } else {
            let value = binding.expression.substring(1).substring(0, binding.expression.length - 2)
            if(!roles[value]){
                el.parentNode.removeChild(el);
            } 
        }
    }
});

