export default {

  namespaced: true,

  state:{
    detail: null,
  },

  getters:{
    getInvestorDetail(state){
      return  state.detail;
    },
  },

  mutations:{
    setInvestorDetail(state, detail){
      return  state.detail = detail;
    },
  },

  actions:{
    
  }

}