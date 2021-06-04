const app = {
  namespaced: true,
  state: {
    hiddenScroll: false,
    appScrollHeight: '',
    leftMenuData: [] //左侧边栏的数据
  },
  mutations: {
    SET_HIDDENSCROLL: (state, data) => {
      if(data) {
        state.appScrollHeight = document.documentElement.scrollTop;
      }
      state.hiddenScroll = data;
    },
    SET_LEFTMENUDATA: (state, data) => {
      state.leftMenuData = data;
    },
  },
  getters: {
    hiddenScroll: state => state.hiddenScroll,
    appScrollHeight: state => state.appScrollHeight,
    leftMenuData: state => state.leftMenuData,
  },
}

export default app;
