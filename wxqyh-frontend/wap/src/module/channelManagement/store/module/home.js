export default {
  namespaced:true,
  state:{
    regionName: '',
    departmentIds: [],
  },
  getters: {
    getRegionName(state){
      return state.regionName || '全国'
    },
    getDepartmentIds(state){
      return state.departmentIds;
    }
  },
  mutations: {
    setDepartmentIds(state, departmentIds){
      state.departmentIds = departmentIds||[];
    },

    setRegionName(state, regionName){
      state.regionName = regionName;
    }
  },
  actions:{

  }
}