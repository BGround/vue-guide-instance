import {
  SET_CACHE_PAGE_LIST,
  COMPETITOR_DETAIL
} from '../mutation-types'

const state = {
  cachePageList: [],
  competitorDetial: {} 
}

const getters = {
  cachePageList: state => state.cachePageList,
  competitorDetial: state => state.competitorDetial
}

const actions = {
  addCachePage({
    commit
  }, value) {
    commit("SET_CACHE_PAGE_LIST", {
      type: "add",
      value: value
    })
  },
  removeCachePage({
    commit
  }, value) {
    commit("SET_CACHE_PAGE_LIST", {
      type: "remove",
      value: value
    })
  }
}

const mutations = {
  [SET_CACHE_PAGE_LIST](state, payload) {
    if (payload.type === 'remove') {
      state.cachePageList.remove(payload.value)
    } else {
      if (!state.cachePageList.includes(payload.value)) {
        state.cachePageList.push(payload.value)
      }
    }
  },
  [COMPETITOR_DETAIL](state, payload) {
    state.competitorDetial = JSON.parse(JSON.stringify(payload.value))
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
