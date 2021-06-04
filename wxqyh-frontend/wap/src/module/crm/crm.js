import '../../assets/js/common.js';
import Vue from 'vue';
import App from './App';
import dataBase from'./database';
import store from'./store'
import newRouterFun from './router';
import i18nFun from "@/lang";
import 'babel-polyfill';
import { AlertPlugin,LoadingPlugin } from 'vux'
// import Vconsole from 'vconsole';
// const vConsole = new Vconsole();
// export default vConsole;

Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)

window.dataBase = dataBase;
var vm;
getLoginMessagePromise().then(function(data){
  var i18n = i18nFun(_.lang)
  var router = newRouterFun()
  vm = new Vue({
    el: '#app',
    router,
    i18n,
    store,
    template: '<App/>',
    components: { App }
  });
});


// 缓存input和textarea数据
Vue.directive('storage', {
  bind (el, binding) {
    let storageName = binding.value;
    let storageValue = '', obj = {};

    if(!storageName) return;

    // 有name才绑定事件
    if(el.getAttribute('name')){
      // 赋上缓存的值
      if(obj[el.getAttribute('name')]){
        el.value = obj[el.getAttribute('name')];
      }

      // 失去焦点时缓存数据
      el.handleInput = function(){
        obj[el.getAttribute('name')] = el.value;
        localStorage.setItem(storageName, JSON.stringify(obj));
      }

      // 获得焦点时获取缓存数据
      el.handleFocus = function(){
        storageValue = localStorage.getItem(storageName);
        obj = storageValue? JSON.parse(storageValue) : {};
      }

      el.addEventListener('focus',el.handleFocus);
      el.addEventListener('input',el.handleInput);
    }
  },
  unbind (el) {
    el.removeEventListener('focus',el.handleFocus);
    el.removeEventListener('input',el.handleInput);
  }
});

// 计算多行文本高度
Vue.directive('computedTextarea', {
  componentUpdated (el) {
    el.style.height = `${el.scrollHeight}px`;
  }
});


// 金钱万元和元的变换(超过100w才处理)
Vue.filter('dealmoney', function (money) {
  if(money > 0){
      if (money > 999999.99) {
          let dealMoney = String(money / 10000);
          let integerMoney = dealMoney.split('.')[0];
          let decimalMoney = dealMoney.split('.')[1];
          if(decimalMoney){
              decimalMoney = decimalMoney.slice(0, 2);
              return `${integerMoney}.${decimalMoney}`
          }
          return `${dealMoney}`
      } else {
          return money;
      }
  }
  else if(money == 0){
    return 0;
  }
  return '';
})

// 转换金钱格式
Vue.filter('formatMoney', function (money = 0) {
    // 返回处理后的值
    var v, j, sj, rv = "";
    money = money.toString();
    v = money.replace(/,/g, "").split(".");
    j = v[0].length % 3;
    sj = v[0].substr(j).toString();
    for (var i = 0; i < sj.length; i++) {
        rv = (i % 3 == 0) ? rv + "," + sj.substr(i, 1) : rv + sj.substr(i, 1);
    }
    var rvalue = (v[1] == undefined) ? v[0].substr(0, j) + rv : v[0].substr(0, j) + rv + "." + v[1];
    if (rvalue.charCodeAt(0) == 44) {
        rvalue = rvalue.substr(1);
    }
    return rvalue;
})


