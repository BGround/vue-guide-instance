import SearchBar from '../base/newBase/SearchBox.vue'
import LoadMore from '../base/load_more.vue'

export const mixinTab = {
    components: { SearchBar, LoadMore },
    data() {
        return {
            searchBar: { show: true, keyWord: '', rightSpan: { show: true, callback: this.searchShow } },
            setting: { page: 1, pageSize: 20 },
            busy: true,
            loading: false,
            hasAdvance: false,
        }
    },
    computed: {
        showRecord() {
            return this.list.length ? false : true;
        }
    },
    methods: {
        loadMore() {  // 加载更多
            this.setting.page++
            this.loading = true
            this.initList(true)
        },
        setList(res, isLoadMore) { // 设置列表数据
            this.loading = false
            this.busy = this.setting.page == res.maxPage
            this.list = isLoadMore ? this.list.concat(res.pageData) : (res.pageData || [])
        },
        showMsgFromSearchBar(keyWord) {
            if (keyWord == this.searchValue.formTitle) {
                return
            }
			this.busy = true
            this.list = []
            this.setting.page = 1
            this.$set(this.searchValue, 'formTitle', keyWord)
            this.$set(this.cacheSearchValue, 'formTitle', keyWord)
            this.initList();
        },
        //设置翻页的请求数据
        setPageData(searchValue, paramPageCount, paramSearchType) {
            this.$store.commit('resetPageData');
            var pageData = this.$store.state.formBase.pageData
            pageData.paramSearchType = paramSearchType
            pageData.paramPageCount = paramPageCount
            pageData.workOrderSearchVOJson = searchValue.workOrderSearchVOJson
            sessionStorage.setItem('pageData', JSON.stringify(pageData))
        },
        useAdvance() {  //是否有高级函数设置
            this.hasAdvance = Object.values(this.cacheSearchValue).some(val => val != '')
        }
    }
}