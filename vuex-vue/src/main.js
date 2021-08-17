import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import store from './store'
import router from './router'

Vue.config.productionTip = true

Vue.use(Vuex)          // Vuex运行依赖Vue内部数据的双向绑定机制

router.beforeEach((to, from, next) => {
	if(store.state.userInfo || to.path === "/login") {
		next();
	} else {
		next({
			path: '/login'
		})
	}
})

new Vue({              // new一个Vue实例，来响应式变化
	store,
	router,
	render: h => h(App),
}).$mount('#app')
