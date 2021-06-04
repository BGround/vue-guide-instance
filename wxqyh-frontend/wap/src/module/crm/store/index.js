import Vue from 'vue'
import Vuex from 'vuex'
import tree from '@/components/tree/data'
import list from './list'
import miniprogram from './modules/miniprogram'
import competitor from './modules/competitor'
import details from './modules/details'
import flowDetail from './modules/flowDetail'
import selectNode from '@/components/flow/getNodeInfo'
import flowUserSelected from '@/components/flow/flowUserSelected'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tree,
    list,
    miniprogram,
    competitor,
    details,
    flowDetail,
    selectNode,
    flowUserSelected
  },
})
