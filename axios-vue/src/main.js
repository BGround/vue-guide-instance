import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Http from './api/Http'
Vue.config.productionTip = false

// createApp(App).use(router).use(Http).mount('#app')

// 把Http挂载到Vue实例上
Vue.prototype.$Http = Http
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
