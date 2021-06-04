export default {

  namespaced: true,

  state:{
    detail: null,
  },

  getters:{
    getEmploymentDetail(state){
      return  state.detail;
    },
  },

  mutations:{
    setEmploymentDetail(state, detail){
      return  state.detail = detail;
    },
  },

  actions:{
    fetchEmploymentDetailAction(){
      
    }
  }

}