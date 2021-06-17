import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './moutations'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex);

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});

export default store;

