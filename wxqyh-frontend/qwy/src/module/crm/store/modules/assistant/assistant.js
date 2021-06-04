const assistant = {
    namespaced: true,
    state: {
        showAssistant: false,  //是否显示营销小助手示例
        isVip:false,//是否是金卡用户
        uploadCos:{},//腾讯视频上传需要共享的数据
        uploadTaskId:{}//腾讯视频上传需要共享的数据
    },
    mutations: {
        SET_SHOWASSISTANT:(state, data) => {
            state.showAssistant = data;
        },
        setVipFlag(state, data){
            state.isVip = data;
        },
        setUploadCos(state,data){
            state.uploadCos[data.name] = data.res;
        },
        setUploadTaskId(state,data){
            state.uploadTaskId[data.name] = data.res;
        },
    },
    actions: {
        setshowAssistant:({state,commit}, data) => {
            commit('SET_SHOWASSISTANT', data);
        },
    },
    getters: {
        showAssistant: state => state.showAssistant,
        isVip:state => state.isVip,
        uploadCos:state => state.uploadCos,
        uploadTaskId:state => state.uploadTaskId
    }
}

export default assistant;