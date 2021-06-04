import * as types from './mutations-types';

const mutations =  {
  [types.SET_DRAFT_NUM](state, num) {
    state.draftNum = num;
  },
  [types.SET_WAITING_NUM](state, num) {
    state.waitingNum = num;
  },
  [types.SET_SCROLL_LOCK](state, isLock) {
    state.isScrollLock = isLock;
  },
};

export default mutations;
