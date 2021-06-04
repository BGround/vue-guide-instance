const state = {
  curSelectTree: '',
  isReduceAllTree: false,
  centerCostData: {},
};

const getters = {
  centerCostData: state => state.centerCostData,
  curSelectTree: state => state.curSelectTree,
  isReduceAllTree: state => state.isReduceAllTree,
}

const mutations = {
  updateCenterCostData(state, data) {
    state.centerCostData = data;
  },
  updateCurSelectTree(state, id) {
    state.curSelectTree = id;
  },
  updateReduceAllTree(state, flag) {
    state.isReduceAllTree = flag;
  },
};

export default {
  state,
  getters,
  mutations
};
