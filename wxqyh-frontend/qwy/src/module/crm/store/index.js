import Vue from 'vue';
import Vuex from 'vuex';
import header from '@/store/modules/header';
import goal from './modules/goal/goal';
import assistant from './modules/assistant/assistant'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        header,
        goal,
        assistant
    }
})

export default store;