import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import store from './store'
import router from './router'

Vue.config.productionTip = true

Vue.use(Vuex)

router.beforeEach((to, from, next) => {
	if(store.state.userInfo || to.path === "/login") {
		next();
	} else {
		next({
			path: '/login'
		})
	}
})

new Vue({
	store,
	router,
	render: h => h(App),
}).$mount('#app')
