export default {

    namespaced: true,
  
    state:{
      detail: {},
    },
  
    getters:{
      getEvaluationDetail(state){
        return  state.detail || {};
      }
    },
  
    mutations:{
      setEvaluationDetail(state, detail){
        return  state.detail = detail;
      }
    },
  
    actions:{
      
    }
  
  }