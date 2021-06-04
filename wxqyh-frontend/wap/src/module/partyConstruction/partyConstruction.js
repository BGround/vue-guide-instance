import '../../assets/js/common.js'
import Vue from 'vue';
import App from './App';
import dataBase from'./dataBase'
import newRouterFun from './router';
import i18nFun from "@/lang"

window.dataBase = dataBase;
 var vm;
getLoginMessagePromise().then(function(data){
  var i18n = i18nFun(_.lang)
  var router = newRouterFun()
  vm = new Vue({
    el: '#app',
    router,
    i18n,
    template: '<App/>',
    components: { App },
    watch: {
      // 避免相同路径不刷新的问题
      '$route' (to, from) {
        if (to.name === from.name) {
          this.$router.go(0);
        }
      }
    }
  });
})
