import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import * as getters from './getters';
import state from './state';
import mutations from './mutations';
import tree from '@/components/tree/data';
import editor from './modules/editor';
import budget from './modules/budget';
import debit from './modules/debit'

// 流程
import detail from './modules/detail';
import selectNode from '@/components/flow/getNodeInfo';
import flowUserSelected from '@/components/flow/flowUserSelected';


Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';


export default new Vuex.Store({
  getters,
  state,
  mutations,
  modules: {
    tree,
    budget,
    editor,
    debit,
    selectNode,    //流程
    detail,
    flowUserSelected
  },
  // strict: debug,
  plugins: debug ? [createLogger()] : [],
});
