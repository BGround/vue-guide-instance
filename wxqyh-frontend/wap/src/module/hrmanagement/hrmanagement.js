import '../../assets/js/common.js';
import Vue from 'vue';
import App from './App';
import dataBase from'./dataBase';
import i18nFun from "@/lang";
import 'babel-polyfill';
import newRouterFun from './router';

let vm;
window.dataBase = dataBase;

getLoginMessagePromise().then(function(data){
	let i18n = i18nFun(_.lang);
	const router = newRouterFun()
	vm = new Vue({
	  el: '#app',
	  router,
	  i18n,
	  template: '<App/>',
	  components: { App }
	});
})