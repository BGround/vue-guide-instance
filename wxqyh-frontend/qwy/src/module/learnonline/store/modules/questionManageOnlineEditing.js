import { createEventBus } from '../../utils/index';
const questionManageOnlineEditing = {
  namespaced: true,
  state: {
    hasContent: false, // 是否有文本
    questionsLength: 0, // 题目数量
    firstErrIndex: -1, // 第一个错误信息下标，-1无错误
    isOverMaxLine: false, // 是否超过最大行数 
    errorInfoArr: [],  // 错误信息数组
    example: { // 示例展览
      show: false,
      index: 0 // 更改当前选中项
    },
    Bus: createEventBus()
  },
  getters: {
    hasContent: state => state.hasContent,
    questionsLength: state => state.questionsLength,
    firstErrIndex: state => state.firstErrIndex,
    isOverMaxLine: state => state.isOverMaxLine,
    errorInfoArr: state => state.errorInfoArr,
    example: state => state.example,
    Bus: state => state.Bus,
  },
  mutations: {
    SET_HASCONTENT: (state, data) => {
      state.hasContent = data;
    },
    SET_EXAMPLE: (state, data) => {
      Object.assign(state.example, data);
    },
    SET_QUESTIONSLENGTH: (state, data) => {
      state.questionsLength = data;
    },
    SET_FIRSTERRINDEX: (state, index) => {
      state.firstErrIndex = index;
    },
    SET_ISOVERMAXLINE: (state, data) => {
      state.isOverMaxLine = data;
    },
    UPDATE_ERRORINFOARR: (state, arr) => {
      let errorInfoArr = state.errorInfoArr;
      while(errorInfoArr.length) {
        errorInfoArr.pop();
      };
      arr.length && errorInfoArr.push.apply(errorInfoArr, arr);
    }
  },
  actions: {
  },
}

export default questionManageOnlineEditing;
