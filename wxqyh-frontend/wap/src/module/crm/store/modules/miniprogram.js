
const state = {
  showFlag: false,
  tagList: []//形象标签
}
const mutations = {
  changeShowFlag(state, payload){
    state.showFlag = payload;
  },
  changeTagList(state,payload){
    state.tagList = payload;
  }
}
const getters = {
  getTagList(state){
    return state.tagList;
  }
}

export default {
  state, mutations,getters
}