export default {

  namespaced: true,

  state:{
    detail: null,
  },

  getters:{
    getBusinessDistrictDetail(state){
      return  state.detail;
    },
  },

  mutations:{
    setBusinessDistrictDetail(state, detail){
      return  state.detail = detail;
    },
  },

  actions:{
  }

}