import advancedSearch from '@/components/base/AdvancedSearch/index'
import FormSearch from '../base/form/formSearch'

export const mixinCommonSearch = {
    data() {
        return {
            searchValue: {},
            cacheSearchValue: {},
            showSearch: false,
            formSearchShow: false,
            checkedList: {
                appList: {},
                tagList: {},
                formList: {}
            }
        }
    },
    components: {
        advancedSearch,
        FormSearch
    },
    methods: {
        search(searchValue) {
            this.setting.page = 1
            this.searchValue = this.filterFormSearch(this.filterDeptAndUser(searchValue))
            this.cacheSearchValue = searchValue
            this.searchBar.keyWord = this.searchValue.formTitle || ''
            this.initList()
        },
        searchClose() {
            this.showSearch = false
        },
        searchShow() {
            this.showSearch = true            
        },
        searchReset() {
            delete this.searchSetting[1].isShowPlaceholder
            delete this.searchSetting[1].selectValue
            this.$set(this.searchSetting[1], 'isShowPlaceholder', false)
            this.$set(this.searchSetting[1], 'selectValue', '')
            this.checkedList = { appList: {}, tagList: {}, formList: {} }
        },
        filterDeptAndUser(searchValue) {
            let newSearchValue = JSON.parse(JSON.stringify(searchValue)),
                reg = /,$/gi
            if(searchValue.creatorId) {
                let userList = searchValue.creatorId.users || []
                newSearchValue['creatorId'] = userList.reduce((ids, user) => ids + user.id + ',', '').replace(reg, '')
            }
            if(searchValue.departId) {
                let deptList = searchValue.departId.depts || []
                newSearchValue['departId'] = deptList.reduce((ids, dept) => ids + dept.id + ',', '').replace(reg, '')
            }
            return newSearchValue
        },
        showFormSearch() {
            this.formSearchShow = true
        },
        closeFormSearch() {
            this.formSearchShow = false
        },
        confirmFormSearch({ checkedList, nameStr}) {
            delete this.searchSetting[1].isShowPlaceholder
            delete this.searchSetting[1].selectValue
            this.$set(this.searchSetting[1], 'isShowPlaceholder', nameStr ? true : false)
            this.$set(this.searchSetting[1], 'selectValue', nameStr)
            this.cacheSearchValue['formQueryTypeAndTempVO'] = { checkedList, nameStr }
            this.checkedList = checkedList
            this.formSearchShow = false
        },
        filterFormSearch(searchValue) {
            let newSearchValue = JSON.parse(JSON.stringify(searchValue))
            if(newSearchValue['formQueryTypeAndTempVO']) {
                let checkedList = newSearchValue['formQueryTypeAndTempVO'].checkedList,
                    typeIds = [],
                    formIds = [],
                    { entries, keys } = Object
                for(let [key, value] of entries(checkedList)) {
                    for(let id of keys(value)) {
                        switch(key) {
                            case 'appList': 
                            case 'tagList': typeIds.push(id); break;
                            case 'formList': formIds.push(id); break;
                        }
                    }
                }
                newSearchValue['formQueryTypeAndTempVO'] = { typeIds, formIds }
            }
            return newSearchValue
        },
        cacheFormSearch() {
            if(this.cacheSearchValue.formQueryTypeAndTempVO) {
                let formSearch = this.cacheSearchValue.formQueryTypeAndTempVO
                this.searchSetting[1].isShowPlaceholder = formSearch.nameStr ? true : false
                this.searchSetting[1].selectValue = formSearch.nameStr
                this.checkedList = formSearch.checkedList
            } else {
                this.checkedList = { appList: {}, tagList: {}, formList: {} }
            }
        },
        cache(key, cacheKey) { // 保存高级搜索条件到sessionStorage，实现条件缓存
            this.searchValue = this.getStore(key) || {}
            this.cacheSearchValue = this.getStore(cacheKey) || {}
            this.$set(this.searchBar, 'keyWord', this.searchValue.formTitle || '')
        },
        setStore(key, value) {
            sessionStorage.setItem(key, JSON.stringify(value))
        },
        getStore(key) {
            return JSON.parse(sessionStorage.getItem(key))
        }
    }
}