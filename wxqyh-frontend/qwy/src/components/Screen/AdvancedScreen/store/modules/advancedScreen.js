let state = {
  advancedScreenData:{},
};

let getters = {
  advancedScreenData:state => state.advancedScreenData,
};

let mutations = {
  updateAdvancedScreenData(state,updateData){
    state.advancedScreenData = updateData;
  },
};

let actions = {
  setUpdateAdvancedScreenData({state,commit},data){
    commit('updateAdvancedScreenData',data);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
