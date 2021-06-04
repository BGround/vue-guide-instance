import Vue from 'vue'
import Vuex from 'vuex'
import header from '@/store/modules/header'
import advancedScreen from '@/components/Screen/AdvancedScreen/store/modules/advancedScreen'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    header,
    advancedScreen
  }
})

export default store
