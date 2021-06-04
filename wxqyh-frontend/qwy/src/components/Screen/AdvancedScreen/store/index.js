import Vue from 'vue';
import Vuex from 'vuex';
import advancedScreen from './modules/advancedScreen';

Vue.use(Vuex);

export default new Vuex.Store({
  modules:{
    advancedScreen
  }
});
