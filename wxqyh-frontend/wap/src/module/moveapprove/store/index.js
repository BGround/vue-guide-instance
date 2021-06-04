import Vue from 'vue'
import Vuex from 'vuex'
import detail from './modules/detail'
import selectNode from '@/components/flow/getNodeInfo'
import flowUserSelected from '@/components/flow/flowUserSelected'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    selectNode,
    detail,
    flowUserSelected,
  },
})
