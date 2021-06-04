export default {
  state: {
    active:'评分考核'
  },
  mutations: {
    ['leftSide/active'](state, res) {
      state.active = res
    }
  }
}