const goal = {
    namespaced: true,
    state: {
        cacheArray: [],  // 缓存的组件名数组
    },
    mutations: {
        // 设置要缓存的组件
        SET_CACHEARRAY:(state, data) => {
            // 是否情况缓存数组
            if(data.isClear){
                state.cacheArray = [];
            }
            else{
                state.cacheArray.push(data.name);
                state.cacheArray = [...new Set([...state.cacheArray])];  // 数组去重
            }
        },
        // 删除不要缓存的组件
        DEL_CACHEARRAY:(state, data) => {
            state.cacheArray.map((item,idx) => {
                if(item === data){
                    state.cacheArray.splice(idx, 1);
                }
            });
        }
    },
    actions: {
        setCacheArray:({state,commit}, data) => {
            commit('SET_CACHEARRAY', data);
        },
        delCacheArray:({state,commit}, data) => {
            commit('DEL_CACHEARRAY', data);
        }
    },
    getters: {
        cacheArray: state => state.cacheArray,
    }
}

export default goal;