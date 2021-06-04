import Vue from 'vue';
import Vuex from 'vuex'
import App from './app';
import router from './router';
import store from './store'
debugger
getLoginMessagePromise().then(function() {
  var vm = new Vue({
    el: '#app',
    router,
    store,
    template: '<app />',
    components: {
      App
    }
  });
});
