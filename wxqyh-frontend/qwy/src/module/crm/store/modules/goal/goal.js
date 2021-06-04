const goal = {
    namespaced: true,
    state: {
        showGoalBox: false,  //是否显示目标盒子
        goalBoxTitle: '新增目标',  //目标盒子的名称
        goalBoxType: 'add',  //判断是新增还是编辑
        goalBoxOperate: '',  // 对目标盒子的操作
        goalDetail: {}  // 目标详情数据
    },
    mutations: {
        SET_SHOWGOALBOX:(state, data) => {
            state.showGoalBox = data;
        },
        SET_GOALBOXTITLE:(state, data) => {
            state.goalBoxTitle = data;
        },
        SET_GOALBOXTYPE:(state, data) => {
            state.goalBoxType = data;
        },
        SET_GOALBOXOPERATE:(state, data) => {
            state.goalBoxOperate = data;
        },
        SET_GOALDETAIL:(state, data) => {
            state.goalDetail = data;
        }
    },
    actions: {
        setshowGoalBox:({state,commit}, data) => {
            commit('SET_SHOWGOALBOX', data);
        },
        setGoalBoxTitel:({state,commit},data) => {
            commit('SET_GOALBOXTITLE', data);
        },
        setGoalBoxType:({state,commit},data) => {
            commit('SET_GOALBOXTYPE', data);
        },
        setGoalBoxOperate:({state,commit},data) => {
            commit('SET_GOALBOXOPERATE', data);
        },
        setGoalDetail:({state,commit},data) => {
            commit('SET_GOALDETAIL', data);
        }
    },
    getters: {
        showGoalBox: state => state.showGoalBox,
        goalBoxTitle: state => state.goalBoxTitle,
        goalBoxType: state => state.goalBoxType,
        goalBoxOperate: state => state.goalBoxOperate,
        goalDetail: state => state.goalDetail
    }
}

export default goal;