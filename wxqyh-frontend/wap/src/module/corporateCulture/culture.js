import '../../assets/js/common.js'
import Vue from 'vue'
import App from './app'
import dataBase from'./database';
import newRouterFun from './router';
import i18nFun from "@/lang"
import store from './store'
import 'babel-polyfill';
window.dataBase = dataBase;

import InfiniteLoading from "vue-infinite-loading";
Vue.use(InfiniteLoading, {
    slots: {
        noMore: '已经到底了', // you can pass a string value
    }
})

var vm;
getLoginMessagePromise().then(function(data){
  var i18n = i18nFun(_.lang)
  var router = newRouterFun()
  vm = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    components: { App }
  });
})
