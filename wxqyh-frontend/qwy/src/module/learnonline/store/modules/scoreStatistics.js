const scoreStatistics = {
  namespaced: true,
  state: {
    currentNode:'',
    scrollTop:0
  },
  mutations: {
    SET_CURRENTNODE: (state, data) => {
      state.currentNode = data;
    },
    SET_SCROLLTOP: (state, data) => {
      state.scrollTop = data;
    }
  },
  getters: {
    get_currentNode: state => state.currentNode,
    get_scrollTop: state => state.scrollTop
  }
}

export default scoreStatistics;
