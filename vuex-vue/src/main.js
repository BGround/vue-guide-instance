import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

Vue.config.productionTip = true

Vue.use(Vuex)
const store = new Vuex.Store({
	state:{
		count: 0
	},
	mutations:{
		countIncrease(state){
			state.count++
		}
	}
})
new Vue({
	store,
	render: h => h(App),
}).$mount('#app')
