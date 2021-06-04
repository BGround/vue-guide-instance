const state = {
  rang: '',
}

const getters = {
  rang: state => state.rang
}

const mutations = {
  updateRang(state,rang) {
    state.rang = rang
  }
}

export default {
  state,
  getters,
  mutations,
}
