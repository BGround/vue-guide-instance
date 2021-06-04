import Vue from 'vue'
import Vuex from 'vuex'
// 引入模块
import form from './modules/form/form'
import common from '@/store/common'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        form,
        common
    }
})

export default store