export default {

  namespaced: true,

  state:{
    detail: null,
  },

  getters:{
    getStoreDetail(state){
      return  state.detail;
    },
  },

  mutations:{
    setStoreDetail(state, detail){
      return  state.detail = detail;
    },
  },

  actions:{
    
  }

}