<template>
  <div
    v-infinite-scroll="loadMore"
    infinite-scroll-disabled="busy"
    infinite-scroll-distance="10"
    infinite-scroll-immediate-check="false">
    <div class="qwui-nav_box_fixed">
      <search-box
        :searchinput="searchBar"
        placeholder="搜索"
        @listenToSearchBox="showMsgFromSearchBar"></search-box>
    </div>
    <car-use-list :list="list"></car-use-list>
    <load-more
      :busy="busy"
      :loading="loading"
      :showrecord="showrecord"
      :recordTitle="'暂无相关处理'"
      :recordIcon="'qwui-no_page_record'"
      @childevent="loadMore"
      :listCount="list.length"></load-more>
  </div>
</template>

<script>
  import carUseList from '../carUseList/carUseList'
  import { initTodo, initCount } from '../../api/getData'
  import { mixinTab } from '../../js/mixin'

  export default {
    name: 'audit',
    mixins:[mixinTab],
    components:{
      carUseList
    },
    data(){
      return {
        list: [],
      }
    },
    mounted() {
      this.searchBar.rightSpan.show = false
      this.initList()
      this.initCount()
    },
    methods:{
      initList(isLoadMore){
        var _this = this,
          setting = JSON.parse(JSON.stringify(this.setting)),
          searchValue = this.isSearch ? this.searchValue : setting
        if(this.isSearch) {
          searchValue = Object.assign(searchValue, setting)
        }
        if(!isLoadMore) {
          _.showLoading()
        }
        initTodo(searchValue).then((res) => {
          _this.setList(res, isLoadMore)
        })
      },
      initCount() {  //待办数量
        initCount().then((res) => {
          if (res.code == "0") {
            dataBase.car.footerList.nav[1].num = res.data.waitingTaskNum || 0
          } else {
            _.alert('提示', res.desc)
          }
        })
      },
      showMsgFromSearchBar(keyWord){
        this.busy = true
        this.list = []
        this.setting.page = 1
        this.setting.keyWord = keyWord
        this.isSearch = false
        this.cacheSearchValue = {}
        this.initList()
      }
    }
  }
</script>

<style scoped>
  .qwui-no_record_box{
    margin-top: 160px;
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
