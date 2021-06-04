import { setViewMode, getForm } from '@/module/approval/api/form/index'
import Vue from 'vue'

const index = {
    namespaced: true,
    state: {
        setting: { // 表单设置  {page, pageSize, totalRows, maxPage, currPage}
            page: 1,
            pageSize: 20
        },
        viewMode: "", // 当前视图  "1"：列表视图 "2"：平铺视图 "3"：分组视图
        currGroup: [{ name: '全部分组', id: ''}], // 当前分组 [{id, name}, {id, name}]
        listData: [], // 列表视图数据
        groupData: [], // 分组视图数据
        unGroupData: {},
        checkedList: [], // 列表视图中所选中的选项 [id],
        searchValue: {}, // 用于存放搜索内容
        groupList: [],
        showVipTips: false, // true： 显示非vip提示， false：隐藏非vip提示
        showNoData: false, // true: 显示数据为空的提示，false: 隐藏数据为空的提示
        showFormTips: false, // true: 显示表单操作提示, false: 隐藏表单操作提示
        isSearch: false,
        showResult: false,
        isWhiteCorpId: false,
    },
    mutations: {
        SET_SETTING: (state, setting) => {
            for(var key in setting) {
                Vue.set(state.setting, key, setting[key])
            }
        },
        SET_VIEWMODE: (state, viewMode) => {
            state.viewMode = viewMode
        },
        SET_CURRGROUP: (state, currGroup) => {
            state.currGroup = currGroup
        },
        SET_LISTDATA: (state, listData) => {
            state.listData = listData
        },
        SET_GROUPDATA: (state, groupData) => {
            state.groupData = groupData
       },
        SET_CHECKEDLIST: (state, checkedList) => {
            state.checkedList = checkedList
        },
        SET_SEARCHVALUE: (state, searchValue) => {
            // 判断是否置空搜索内容
            if(JSON.stringify(searchValue) == "{}") {
                state.searchValue = {}
                return
            }
            for(var key in searchValue) {
                Vue.set(state.searchValue, key, searchValue[key])
            }
        },
        SET_GROUPLIST: (state, groupList) => {
            state.groupList = groupList;
        },
        SET_VIPTIPS: (state, boolean) => {
            state.showVipTips = boolean
        },
        SET_NODATA: (state, boolean) => {
            state.showNoData = boolean
        },
        SET_FORMTIPS: (state, boolean) => {
            state.showFormTips = boolean
        },
        SET_ISSEARCH: (state, boolean) => {
            state.isSearch = boolean;
        },
        SET_UNGROUPDATA: (state, unGroupData) => {
            state.unGroupData = unGroupData;
        },
        SET_SHOWRESULT: (state, showResult) => {
            state.showResult = showResult
        },
        SET_ISWHITECORPID: (state, isWhiteCorpId) => {
          state.isWhiteCorpId = isWhiteCorpId
        },
    },
    actions: {
        /* 获取表单数据
        *  isLoadMore: 是否是加载更多
        *  needLoading: 是否需要加载
        *  viewMode: 判断请求的视图
        */
        GetFormData({ state, commit }, {isLoadMore, needLoading , viewMode} = {}) {
            return new Promise((resolve, reject) => {
                let data = {};
                for(var key in state.searchValue) {
                    data[key] = state.searchValue[key];
                }
                data.page =  state.setting.page; // 请求页数
                data.pageSize = state.setting.pageSize; // 请求数量
                data.viewMode = viewMode ? viewMode : state.viewMode;
                if(needLoading) {
                    dataBase.loading = true;
                }
                getForm(data).then(res => {
                    if(needLoading) {
                        dataBase.loading = false;
                    }
                    if(res.code != '0') {
                        _top.alert("提示",res.desc)
                        return
                    }
                    if(!state.isSearch && !state.showResult) {
                        commit('SET_VIEWMODE', res.data.viewMode)
                    }
                    let pageData = res.data.pageData;
                    if(state.viewMode == "2") { // 平铺视图
                        let formTypeData = res.data.formTypeData,
                            stateFormTypeData = state.groupData;
                        if(formTypeData) {
                            if(isLoadMore) {
                                stateFormTypeData = stateFormTypeData.concat(formTypeData);
                            } else {
                                stateFormTypeData = formTypeData;
                            }
                            if(pageData.length != 0) {
                                for(let i = 0; i < formTypeData.length; i++) {
                                    let num = formTypeData[i].formCount > 5 ? 5 : formTypeData[i].formCount;
                                    formTypeData[i].child = [];
                                    formTypeData[i].child.push(...pageData.splice(0, num));
                                }
                            }
                        } else {
                            formTypeData = [];
                            if(isLoadMore) {
                                pageData = state.listData.concat(pageData);
                            }
                        }
                        commit('SET_GROUPDATA', stateFormTypeData)
                    }
                    commit('SET_LISTDATA', pageData)
                    commit('SET_SETTING',{
                        totalRows: res.data.totalRows,
                        maxPage: res.data.maxPage,
                        currPage: res.data.currPage,
                        formTotalRows: res.data.formTotalRows,
                        formTypeTotalRows: res.data.formTypeTotalRows
                    })
                    resolve(res)
                })
            })
        },

        // 设置用户视图
        SetViewMode({ state, commit }, viewMode) {
            return new Promise((resolve, reject) => {
                setViewMode(viewMode).then(res => {
                    if(res.code != '0') {
                        _top.alert("提示",res.desc)
                        return
                    }
                    commit('SET_VIEWMODE',viewMode)
                    commit('SET_LISTDATA', [])
                    commit('SET_GROUPDATA', [])
                    resolve(viewMode)
                }).catch(err => {
                    _top.alert("提示","网络错误")
                    reject(err)
                })
            })
        },

        // 设置分组数据
        SetGroupData({ commit }, groupData) {
            commit('SET_GROUPDATA', groupData)
        },

        SetListData({ commit }, listData) {
            commit('SET_LISTDATA', listData)
        },

        // 设置当前分组
        SetCurrGroup({ commit }, currGroup) {
            commit('SET_CURRGROUP', currGroup)
        },

        // 设置选中列表
        SetCheckedList({ commit }, checkedList) {
            commit('SET_CHECKEDLIST', checkedList)
        },

        // 设置展示设置
        SetSetting({ commit }, setting) {
            commit('SET_SETTING', setting)
        },

        // 设置搜索内容
        SetSearchValue({ commit }, searchValue) {
            commit('SET_SEARCHVALUE', searchValue)
        },

        // 设置非vip提示
        SetVipTips({ commit }, boolean) {
            commit('SET_VIPTIPS', boolean)
        },

        // 设置无内容引导
        SetNoData({ commit }, boolean) {
            commit('SET_NODATA', boolean)
        },

        // 设置表单提示
        SetFormTips({ commit }, boolean) {
            commit('SET_FORMTIPS', boolean)
        },

        SetIsSearch({ commit }, boolean) {
            commit('SET_ISSEARCH', boolean)
        },

        SetGroupList({ commit }, groupList) {
            commit('SET_GROUPLIST', groupList)
        },
        SetShowResult({ commit }, showResult) {
            commit('SET_SHOWRESULT', showResult)
        },
        SetIsWhiteCorpid({ commit }, isWhiteCorpId) {
          commit('SET_ISWHITECORPID', isWhiteCorpId);
        }
    },
    getters: {
        setting: state => state.setting,
        viewMode: state => state.viewMode,
        listData: state => state.listData,
        groupData: state => state.groupData,
        checkedList: state => state.checkedList,
        currGroup: state => state.currGroup,
        searchValue: state => state.searchValue,
        showVipTips: state => state.showVipTips,
        showNoData: state => state.showNoData,
        showFormTips: state => state.showFormTips,
        isSearch: state => state.isSearch,
        groupList: state => state.groupList,
        unGroupData: state => state.unGroupData,
        showResult: state => state.showResult,
        isWhiteCorpId: state => state.isWhiteCorpId,
    }
}

export default index
