import '../../assets/js/common.js'
import Vue from 'vue'
import App from './App'
import dataBase from'./dataBase';
import newRouterFun from './router';
import i18nFun from "@/lang"
import 'babel-polyfill';

window.dataBase = dataBase;
import { DatetimePlugin } from 'vux';
import InfiniteLoading from "vue-infinite-loading";
Vue.use(DatetimePlugin)

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
    i18n,
    template: '<App/>',
    components: { App }
  });
})
