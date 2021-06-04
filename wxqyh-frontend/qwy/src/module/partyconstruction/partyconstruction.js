import Vue from 'vue';
import App from './app';
import router from './router';

var vm = new Vue({
  el: '#app',
  router,
  template: '<app />',
  components: {
    App
  }
});
