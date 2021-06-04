import '../../../static/js/jquery-1.7.2.min.js';
import '../../../static/js/jquery.jcryption.3.1.0.js';
import '../../assets/js/common.js';
import Vue from 'vue';
import App from './App';
import router from './router';
import dataBase from './dataBase';

window.dataBase = dataBase;
getLoginMessagePromise().then(function(){
    new Vue({
        el: '#app',
        router,
        template: '<App/>',
        components: { App }
    });
})