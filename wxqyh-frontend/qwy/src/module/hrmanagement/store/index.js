import Vue from 'vue';
import Vuex from 'vuex';
import header from '@/store/modules/header';
import leftSide from './leftSide'
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        header,
        leftSide
    }
})

export default store;
