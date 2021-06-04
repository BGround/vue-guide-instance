import Vue from 'vue'
import Vuex from 'vuex'
// import tree from '@/components/tree/data'
import home from './module/home.js';
import dealer from './module/dealer.js';
import buildingRebateDetail from './module/buildingRebateDetail.js'
import storeInfoDetail from './module/storeInfoDetail.js'
import businessDistrictDetail from './module/businessDistrictDetail.js'
import investorDetail from './module/investorDetail.js'
import serviceOperationDetail from './module/serviceOperationDetail.js'
import evaluationDetail from './module/evaluationDetail.js'
import secondNetDetail from './module/secondNetDetail.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    home,
    dealer,
    businessDistrictDetail,
    buildingRebateDetail,
    storeInfoDetail,
    investorDetail,
    serviceOperationDetail,
    evaluationDetail,
    secondNetDetail
  },
})
