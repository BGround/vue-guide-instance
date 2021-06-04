
import { mapState } from 'vuex'
import searchBox from '../components/base/search_box'
import loadMore from '../components/base/load_more'

export const mixinTab = { // 各个Tab中公用的方法
  components: {
    searchBox,
    loadMore
  },
  data() {
    return {
      searchBar:{ //头部搜索框
        show: true,
        keyWord: '',
        rightSpan:{
          show: true,
          callback: null
        }
      },
      setting: {
        page: 1,
        keyWord: '',
        pageSize: 20
      },
      busy: true,
      loading: false,
      advancedSearchShow: false,
      isSearch: false,
      searchValue: {},
      cacheSearchValue: {},
      recordText: '',
      recordTitle: '',
      showrecord: false,
    }
  },
  methods: {
    cache(key, cacheKey) { // 保存高级搜索条件到sessionStorage，实现条件缓存
      if(this.getStore(key) && this.getStore(cacheKey)) { //  根据缓存获取到高级搜索的搜索条件
        this.isSearch = true
        this.searchValue = this.getStore(key)
        this.cacheSearchValue = this.getStore(cacheKey)
      } else {
        this.searchValue = {}
        this.cacheSearchValue = {}
      }
    },
    loadMore(){  // 加载更多
      this.setting.page++
      this.loading = true
      this.busy = true
      this.initList(true)
    },
    setList(res, isLoadMore) { // 设置列表数据
      this.loading = false
      _.hideLoading()
      if(res.code != "0") {
        return _.alert('提示', res.desc)
      }
      this.busy = res.data.maxPage == 0 || this.setting.page == res.data.maxPage
      this.list = isLoadMore && this.list.length > 0 ? this.list.concat(res.data.pageData?res.data.pageData:[]) : res.data.pageData?res.data.pageData:[];
      this.list.length == 0 ? this.showrecord = true : this.showrecord = false;
    },
    advancedSearchClose() {
      this.advancedSearchShow = false
    },
    setStore(key, value) {
      value = JSON.stringify(value)
      sessionStorage.setItem(key, value)
    },
    getStore(key) {
      return JSON.parse(sessionStorage.getItem(key))
    }
  },
  watch: {
    advancedSearchShow(newVal) {
      if(newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  }
}

export const mixinCarEndFields = {
  data() {
    return {
      carEndList: [
        {
          id: 'start-mile',
          itemId: 'start',
          optionName: '开始里程数',
          placeholder: '填写开始里程',
          type: '3',
          status: '1',
          isMust: '1',
          value: ''
        },
        {
          id: 'end-mile',
          itemId: 'end',
          optionName: '结束里程数',
          placeholder: '填写最终里程',
          type: '3',
          status: '1',
          isMust: '1',
          value: ''
        },
        {
          id: 'car-cost',
          itemId: 'luqiao',
          optionName: '用车费用',
          placeholder: '填写用车费用',
          type: '3',
          status: '1',
          isMust: '1',
          value: ''
        },
        {
          id: 'car-condition',
          itemId: 'carDesc',
          optionName: '车辆状况',
          placeholder: '请输入修改原因',
          type: '2',
          status: '1',
          isMust: '1',
          value: '车辆状况完好，已归还。',
          maxLength: 100
        }
      ],
      mileError: false
    }
  },
  computed: {
    ...mapState({
      detailData: state => state.detail.detailData
    }),
    detail() {
      return this.detailData && this.detailData.detail
    },
    config() {
      return this.detailData && this.detailData.config
    }
  },
  methods: {
    //校验结束里程
    checkMile(startMile, endMile){
      if(startMile && endMile) {
        if(endMile*1 < startMile*1){
          this.mileError = true
          return false
        }else{
          this.params.referenceMile = endMile - startMile
          this.mileError = false
          return true
        }
      } else return true
    }
  }
}
