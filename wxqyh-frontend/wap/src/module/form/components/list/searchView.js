import { addFormView, deleteFormView, updateFormView, findFormViews } from '../../api/list'
import searchView from '../base/searchView/SearchView.vue'

const prefix = 'formQueryViewVO.';
export const mixinCommonView = {
    data() {
        return {
            customConfig: { isSearching: false, param: {}},
            currView: {}
        }
    },
    components: {
        searchView
    },
    methods: {
        setView(currView) {
            this.currView = currView;
            this.setting.page = 1
            this.searchValue = this.filterDeptAndUserVOs(this.filterDeptAndUser(currView.param))
            this.cacheSearchValue = currView.param;
            this.initList()
        },
        async addView({ name, param }) {
            param = this.filterDeptAndUserVOs(param);
            let res = await addFormView({
                [prefix + 'name']: name,
                [prefix + 'param']: JSON.stringify(this.filterDeptAndUser(param)),
                [prefix + 'versionId']: this.versionId,
                [prefix + 'type']: this.viewType
            })
            this.currView = Object.assign(res.resultVO, { param: param})
            this.customView.unshift(this.currView)
            _.tooltips_succeed("添加视图成功")
        },
        async deleteView({ id, index, isCurrView, _this }) {
            let res = await deleteFormView({
                id: id
            })
            this.customView.splice(index, 1);
            isCurrView && _this.setView(this.defaultView[0])
            _.tooltips_succeed("删除视图成功")
        },
        async updateView({ id, name, param, index, isCurrView }) {
            param = this.filterDeptAndUserVOs(param);
            let res = await updateFormView({
                [prefix + 'id']: id,
                [prefix + 'param']: JSON.stringify(this.filterDeptAndUser(param)),
                [prefix + 'type']: this.viewType,
                [prefix + 'versionId']: this.versionId
            })
            this.customView[index].param = param;
            isCurrView && this.setView(this.customView[index])
            _.tooltips_succeed("更新视图成功")
        },
        setCustomConfig(isSearching, param) {
            this.customConfig = {
                isSearching: !!isSearching,
                param: param || {}
            }
        },
        cache(viewKey, customConfigKey) {
            let view = { param: {}};
            if(!this.getStore('needCache')) {
                view = this.defaultView[this.viewId]
                this.currView = view
            } else {
                this.customConfig = this.getStore(customConfigKey) || this.customConfig
                if(this.customConfig.isSearching) { // 筛选结果
                    view.param = this.customConfig.param
                } else { // 选中某个视图
                    view = this.getStore(viewKey) || this.defaultView[this.viewId]
                    this.currView = view
                }
            }
            view.param = this.filterDeptAndUserVOs(view.param)
            this.searchValue = this.filterDeptAndUser(view.param)
            this.cacheSearchValue = view.param
        },
        filterDeptAndUserVOs(param) {
            param['deptVOs'] && delete param['deptVOs']
            param['createUserVOs'] && delete param['createUserVOs']
            return param
        }
    },
    beforeRouteEnter(to, from, next) {
        let value = true;
        if(from.name == 'mainPage' || from.name == 'appdetail' || from.name == 'search' || from.name == "open" || from.name == 'collection') {
            value = false; // true代表展示缓存 false表示不缓存
        }
        sessionStorage.setItem('needCache', JSON.stringify(value))
        next()
    }
}
