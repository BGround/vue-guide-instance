export default {

  namespaced: true,

  state:{
    detail: {},
    type: '',
  },

  getters:{
    getRebateDetail(state){
      return  state.detail;
    },
    getRebateDetailType(state){
      return state.type;
    }
  },

  mutations:{
    setRebateDetail(state, detail){
      return  state.detail = detail;
    },

    setRebateDetailType(state, type){
      return state.type = type;
    }
  },

  actions:{
    
  }

}