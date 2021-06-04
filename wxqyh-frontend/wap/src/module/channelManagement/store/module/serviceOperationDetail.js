export default {

    namespaced: true,
  
    state:{
      detail: {},
    },
  
    getters:{
      getServiceOperationDetail(state){
        return state.detail || {};
      }
    },
  
    mutations:{
      setServiceOperationDetail(state, detail){
        state.detail = detail;
      }
    },
  
    actions:{
      
    }
  
  }