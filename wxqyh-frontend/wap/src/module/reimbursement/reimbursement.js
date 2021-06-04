import '../../assets/js/common.js';
import Vue from 'vue';
import App from './App';
import dataBase from './dataBase';
import newRouterFun from './router';
import 'babel-polyfill';
import i18nFun from "@/lang";
import store from './store';

window.dataBase = dataBase;

var vm;
getLoginMessagePromise().then((data) => {
  let i18n = i18nFun(_.lang);
  let router = newRouterFun();
  vm = new Vue({
    el: '#app',
    store,
    router,
    i18n,
    template: '<App/>',
    components: { App }
  });
});
