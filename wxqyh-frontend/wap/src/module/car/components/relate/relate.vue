<template>
  <div
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
    infinite-scroll-immediate-check="false">
    <div class="qwui-nav_box_fixed">
      <search-box :searchinput="searchBar"
                  :placeholder="searchBar.placeholder"
                  @listenToSearchBox="showMsgFromSearchBar">
      </search-box>
    </div>
    <car-use-list :list="list"></car-use-list>
    <advanced-search ref="advancedSearch"
                     v-if="advancedSearchShow"
                     :setting="searchSetting"
                     :cache-search-value="cacheSearchValue"
                     @close="advancedSearchClose"
                     @search="advancedSearch"
                     @reset="resetSearch">
    </advanced-search>
    <load-more
      :busy="busy"
      :loading="loading"
      :showrecord="showrecord"
      :recordIcon="'qwui-no_treat_record'"
      :record-title="'找不到相关记录'"
      :record-text="recordText"
      @childevent="loadMore"
      :listCount="list.length">
    </load-more>
  </div>
</template>

<script>
import advancedSearch from '@/components/base/AdvancedSearch/index'
import carUseList from '../carUseList/carUseList'
import { initRelate } from '../../api/getData'
import { mixinTab } from '../../js/mixin'

export default {
  name: 'relate',
  mixins:[mixinTab],
  components: {
    advancedSearch,
    carUseList
  },
  data(){
    return {
      searchBar:{ //头部搜索框
        show: true,
        keyWord: '',
        rightSpan:{
          show: true,
          callback: null
        },
        placeholder: '搜索',
        //isover  -1:已取消;0:退审;1审批通过;2草稿
        //status	0:草稿;1:审批中;2:审批通过;3:已派车;4:已结束
        //askType  1:公司派车;2:企业叫车
        moreFunction: {
          show: true,
          option: [
            {
              name: '全部',
              value: 'All',
              placeholder: '搜索'
            },
            {
              name: '审批中',
              value: '1'
            },
            {
              name: '已审批',
              value: '2'
            },
            {
              name: '退审',
              value: '0'
            },
            {
              name: '已派车',
              value: '3'
            },
            {
              name: '已关闭',
              value: '-1'
            },
            {
              name: '已结束',
              value: '4'
            }
          ],
          defaultChoose: '全部'
        },
        sort:{
          show:true,
          option:[
            {
              name:'申请时间',
              arrowup: true,
              arrowdown: false,
              value: '10'
            },
            {
              name:'申请时间',
              arrowup: false,
              arrowdown: true,
              value: '11'
            },
            {
              name:'用车时间',
              arrowup: true,
              arrowdown: false,
              value: '20'
            },
            {
              name:'用车时间',
              arrowup: false,
              arrowdown: true,
              value: '21'
            }
          ]
        },
      },
      list: [],
      searchSetting: [
        {
          label: '申请人',
          key: 'creator',
          type: 'selectUserOrDepart',
          selectConfig: dataBase.selectConfig,
          selectType: 'users',
					userRestriction: '1'
        },
        {
          label: '用车状态',
          key: 'askStatus',
          type: 'radio',
          value: [{ text: '全部', value: 'All'}, { text: '审批中', value: '1'}, { text: '已审批', value: '2'},
            {text: '退审', value: '0'}, { text: '已派车', value: '3'}, { text: '已关闭', value: '-1'},
            { text: '已结束', value: '4'}]
        },
        {
          label: '用车时间',
          key: ['takeStartTime', 'takeEndTime'],
          type: 'date',
          placeholder: {
            from: '选择开始时间',
            to: '选择结束时间'
          }
        },
      ]
    }
  },
  created() {
    let _this = this
    _this.setting = {
      orderBy: 1,
      title: '',
      type: 1,
      page: 1
    }
    this.cache('relateSearchValue', 'relateCacheSearchValue');
    _this.initList()
    _this.searchBar.rightSpan.callback = function () {
      _this.advancedSearchShow = true
    }
  },
  beforeDestroy () { // 组件销毁前缓存高级搜索条件
    this.setStore('relateSearchValue', this.searchValue)
    this.setStore('relateCacheSearchValue', this.cacheSearchValue)
  },
  methods:{
    initList(isLoadMore) {
      var _this = this,
        setting = JSON.parse(JSON.stringify(this.setting)),
        searchValue = this.isSearch ? this.searchValue : setting

      if(this.isSearch) {
        searchValue = Object.assign(searchValue, setting)
      }
      if(!isLoadMore) {
        _.showLoading()
      }
      initRelate(searchValue).then((res) => {
        _this.setList(res, isLoadMore)
      })
    },
    showMsgFromSearchBar(keyWord, value){ //搜索框设置
      this.setStatusValue(this.setting, value)
      this.busy = true
      this.list = []
      this.setting.page = 1
      this.setting.title = keyWord
      this.isSearch = false
      this.cacheSearchValue = {}
      this.initList()
    },
    advancedSearch(searchValue) { //高级搜索
      let newSearchValue = JSON.parse(JSON.stringify(searchValue)),
        userStr = ''
      if (newSearchValue.creator) {
        let users = newSearchValue.creator.users
        users && users.forEach(function (item, index) {
          if (index == users.length - 1) {
            userStr += item.userId
          } else {
            userStr += item.userId + ','
          }
        })
        newSearchValue.creator = userStr
      }
      this.setting.page = 1
      this.setting.title = ''
      this.searchBar.keyWord = ''
      this.searchValue = newSearchValue
      this.cacheSearchValue = searchValue
      this.isSearch = true
      if(JSON.stringify(newSearchValue) === '{}') { //当高级搜索内容没有时
        this.searchValue.askStatus = 'All'
      }
      this.setStatusValue(this.setting, this.searchValue.askStatus)
      this.searchBar.moreFunction.defaultChoose = this.updateStatus(this.searchSetting[1].value, this.searchValue.askStatus)
      this.busy = true
      this.initList()
    },
    setStatusValue(setting, value) { //转换状态值
      switch (value) {
        case 'All':
          setting.askStatus = ''
          setting.isover = ''
          break
        case '-1':
          setting.askStatus = ''
          setting.isover = '-1'
          break
        case '0':
          setting.askStatus = '0'
          setting.isover = '0'
          break
        case '1':
          setting.askStatus = '1'
          setting.isover = '2'
          break
        case '2':
          setting.askStatus = '2'
          setting.isover = '1'
          break
        case '3':
          setting.askStatus = '3'
          setting.isover = '1'
          break
        case '4':
          setting.askStatus = '4'
          setting.isover = ''
          break
        case '10':
          setting.orderBy = '1'
          setting.asc = '0'
          break;
        case '11':
          setting.orderBy = '1'
          setting.asc = ''
          break;
        case '20':
          setting.orderBy = '2'
          setting.asc = '0'
          break;
        case '21':
          setting.orderBy = '2'
          setting.asc = ''
          break;
      }
    },
    updateStatus(arr, value) { //更新搜索框左边的内容
      let newValue = ''
      arr.forEach(item => {
        if(item.value == value) {
          newValue = item.text
        }
      })
      return newValue || '全部'
    },
    resetSearch() {
      this.setting = {
        orderBy: 1,
        title: '',
        type: 1,
        page: 1
      }
    }
  },
  watch: {
    'setting.keyWord': {
      handler(val) {
        this.recordTitle = '暂无记录'
        this.recordText = ''
        if(val == '') {
          this.recordText = ''
          this.recordTitle = ''
        }
      },
      deep: true
    },
  }
}
</script>


<style scoped>
  .qwui-search_title .qwui-search_pop li{
    color: #0A1735;
  }
  .qwui-nav_box_fixed {
    position: fixed;
    z-index: 9;
    width: 100%;
  }
  .qwui-cardList {
    padding-top: 44px;
  }
</style>
