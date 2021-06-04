import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

// 根级别的state
const state = {
  mallListData: {},         // 发现页数据
  mallDetailData: {         // 商城的课程详情页数据
    subject: {},
    teacherRefPOList: {},
  },
  liveListData: {},         // 直播列表数据
  liveDetailData: {         // 直播详情数据
    teacherPO: {},
  },
  livePlayData: {},         // 直播间数据
  replayData: {},           // 回放页数据
  searchVal: { // 搜索的关键字和类型
    keyWord: '',
    searchType: 0
  },
  examination: { // 继续考试当前时间更新(用于继续考试)
    handle: 0, // 循环句柄
    nowTimeStamp: 0 // 当前时间戳
  },
  diyMenu:'', //自定义菜单数据
}

export default new Vuex.Store({
   state,
   actions,
   mutations
})
