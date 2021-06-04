import '../../assets/js/common.js'
import Vue from 'vue'
import App from './App'
import router from './router'
import dataBase from'./dataBase'


window.dataBase = dataBase;

router.beforeEach((route, redirect, next) => {
    document.title = route.meta.title || document.title;
    next();
});

router.afterEach(() => {
    window.scrollTo(0, 0);
});

getLoginMessagePromise().then(function() {
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  });
})




