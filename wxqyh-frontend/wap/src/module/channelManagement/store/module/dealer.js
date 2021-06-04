export default {

  namespaced: true,

  state:{
    detail: {},
  },

  getters:{
    getDealerDetail(state){
      return  state.detail || {};
    }
  },

  mutations:{
    setDealerDetail(state, detail){
      return  state.detail = detail;
    }
  },

  actions:{
    
  }

}