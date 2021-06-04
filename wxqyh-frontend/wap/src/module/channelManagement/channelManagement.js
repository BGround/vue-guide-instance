import 'babel-polyfill'
import '../../assets/js/common.js'
import Vue from 'vue'
import App from './App'
import dataBase from './dataBase'
import newRouterFun from './router/index'
import store from './store'
import InfiniteLoading from 'vue-infinite-loading'
import imgFallback from './directives/imgFallback'
import  defaultAvatar from '@/module/channelManagement/static/images/logo.jpg'
import {hasHomePermission} from '@/module/channelManagement/api/getData'
// import 'amfe-flexible' // @see https://www.npmjs.com/package/amfe-flexible
// @import '~@/assets/style/global/global.less';
import i18nFun from "@/lang"
import qs from 'qs';
import QUICKWORK from 'quickwork-ui'
Vue.use(QUICKWORK)
Vue.use(imgFallback,{
  fallbackImageSrc: defaultAvatar,
})
Vue.use(InfiniteLoading, {
  slots: {
    noMore: '没有更多', // you can pass a string value
  }
})

window.dataBase = dataBase
var vm
const query = location.search.replace('?','');
const queryObject = qs.parse(query)
const isOpen = queryObject.openh5 === '1';

function initVm(hasPermission){
    var i18n = i18nFun(_.lang)
    var router = newRouterFun(hasPermission)
    return new Vue({
        el: '#app',
        router,
        i18n,
        store,
        render: h => h(App)
    })
}

getLoginMessagePromise().then(() => {
    return isOpen? Promise.resolve(true): hasHomePermission()
}).then((hasPermission)=>{
    vm = initVm(hasPermission);
})

