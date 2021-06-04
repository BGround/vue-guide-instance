import '@/assets/js/common.js'
import Vue from 'vue'
import App from './App'
import store from './store'
import dataBase from './dataBase'
import newRouterFun from './router'
import 'babel-polyfill'
import i18nFun from "@/lang"
import infiniteScroll from 'vue-infinite-scroll'

Vue.use(infiniteScroll)

window.dataBase = dataBase;
window.lockScroll = function() {
  document.getElementsByTagName("body")[0].style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.getElementsByTagName("html")[0].style.overflow = "hidden";
}
window.unLockScroll = function() {
  document.getElementsByTagName("body")[0].style.overflow = "visible";
  document.body.style.overflow = "visible";
  document.getElementsByTagName("html")[0].style.overflow = "visible";
}
var vm;
getLoginMessagePromise().then(function (data) {
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
