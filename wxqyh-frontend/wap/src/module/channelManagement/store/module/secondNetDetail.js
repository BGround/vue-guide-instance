export default {

  namespaced: true,

  state:{
    detail: null,
  },

  getters:{
    getNetDetail(state){
      return state.detail;
    },
  },

  mutations:{
    setNetDetail(state, detail){
      return state.detail = detail;
    },
  },

  actions:{

  }

}
