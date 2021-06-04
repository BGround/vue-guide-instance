import Vue from 'vue'
import Vuex from 'vuex'
import fieldData from './modules/fieldData'
import detail from './modules/detail'
import selectNode from '@/components/flow/getNodeInfo'
import flowUserSelected from '@/components/flow/flowUserSelected'
import mapStatus from './modules/mapStatus'
Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		fieldData,
    flowUserSelected,
    selectNode,
    detail,
    mapStatus,
	},
})
