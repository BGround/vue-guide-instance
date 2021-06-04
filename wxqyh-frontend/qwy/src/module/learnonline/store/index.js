import Vue from 'vue';
import Vuex from 'vuex';
import header from '@/store/modules/header';
import app from './app/app';
import questionManageOnlineEditing from './modules/questionManageOnlineEditing';
import scoreStatistics from './modules/scoreStatistics';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        header,
        app,
        questionManageOnlineEditing,
        scoreStatistics,
    }
})

export default store;
