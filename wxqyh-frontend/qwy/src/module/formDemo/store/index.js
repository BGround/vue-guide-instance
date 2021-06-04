import Vue from 'vue'
import Vuex from 'vuex'
import formFieldEdit from './modules/formFieldEdit'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    formFieldEdit
  },
})
