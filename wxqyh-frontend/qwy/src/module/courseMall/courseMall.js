import '../../assets/js/common.js'
import Vue from 'vue'
import App from './App'
import router from './router'
import dataBase from'./dataBase'

window.dataBase = dataBase;
getLoginMessagePromise().then(function() {
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
  })
});
