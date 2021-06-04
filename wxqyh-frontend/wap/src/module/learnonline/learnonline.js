import '../../assets/js/common.js';
import './js/directive';
import './api/getData.js';
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import dataBase from'./dataBase';
import newRouterFun from './router';
import i18nFun from "@/lang";
import store from './store/index';
import VueDND from 'awe-dnd';
Vue.use(VueDND);
window.dataBase = dataBase;

let vm;
getLoginMessagePromise().then(function(data){
  let i18n = i18nFun(_.lang)
  const router = newRouterFun()
  vm = new Vue({
    el: '#app',
    store,
    router,
    i18n,
    template: '<App/>',
    components: { App }
  });
})
