/*@zengjiaying 20180820*/
import FieldDataMap from '../../data/FieldDataMap'

const state = {
  currentIndex: 0,      // 当前选中的 “位置
  currentType: '',      // 当前字段的 “类型
  currentFieldData: null, // 当前选中的 “字段数据
  FieldData: [],        // 字段数据
}

const mutations = {
  // 点击左边选择字段类型
  publishCurrentType(state,payload) {
    state.currentType = payload
    state.FieldData.splice(state.currentIndex+1, 0, FieldDataMap[payload])
    state.currentIndex +=1
  },
  // 点击中间查看字段设置
  publishCurrentField(state, {FieldItem,index} = {}) {
    state.currentIndex=index
    state.currentType=FieldItem._type
    state.currentFieldData=FieldItem
  }
}

export default {
  state,
  mutations,
}
