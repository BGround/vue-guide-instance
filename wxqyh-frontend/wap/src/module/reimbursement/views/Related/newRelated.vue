<template lang="html">
  <!--待我处理页-->
  <div class="related">
    <!--高级搜索框-->
    <qw-advance-search-box
      ref="searchBox"
      :searchinput="searchSetting"
      :keyWord="searchSetting.keyWord"
      @listenToSearchBox="getReimList"
      @showAdvancedSearch="showAdvancedSearch"
    ></qw-advance-search-box>
    <!--tab栏-->
    <div class="tab_wrap">
      <nav_tabs
        v-bind="config"
        @listenNavTabs="listenNavTabsBack">
      </nav_tabs>
    </div>

    <div class="qwui-scroll_view" :style="{height: scrollViewHeight}" v-scroll="scrollHandle">
      <!--报销列表-->
      <qw-debit-list
        :reimList="reimList"
        :isShowUser="true"
        @selectItem="gotoDetail"
      ></qw-debit-list>

      <!--加载状态-->
      <load-more
        v-show="loadMore.totalRows > 0"
        :loading="loadMore.loading"
        :currPage="loadMore.currPage"
        :maxPage="loadMore.maxPage"
        :hasMore="hasMore"
        @loadMoreClick="loadMoreData"
      >
        <span v-if="!isShowRecord">共 {{reimList.length}} 条单据</span>
      </load-more>

      <!--无记录-->
      <no-record v-show="isShowRecord" :setTop="true" :hasRecord="recordData"></no-record>
    </div>

    <advancedSearch
      class="advance-search-container"
      @search="advancedSearch"
      @close="hideAdvancedSearch"
      :setting="advancedSetting"
      :cache-search-value="cacheSearchValue"
      v-show="isShowAdvanced"
    ></advancedSearch>
    <!--高级搜索选择部门组件-->
    <user-choose
      :closeAllTab="true"
      :closeGroup="true"
      :closeUser="true"
      :tabActive="'dept'"
      :selectconfig="database.selectConfig"
      v-if="database.selectConfig.show"></user-choose>
  </div>
</template>

<script>
  import { debitListMixin, debitSearchMixin } from '../../mixins/debitListMixin';
  import nav_tabs from '@/components/base/nav_tabs';

  export default {
    name: 'QwRelated',
    mixins: [debitListMixin, debitSearchMixin],
    components: {
      nav_tabs
    },
    data(){
      return{
        config:{
          activeIndex: 0,
          position: "top",
          tabs: [{text:"待我处理",value:2}, {text:"我经办的",value:3}]
        }
      }
    },
    created() {
      if(this.getStore('newRelated')){
        if(this.getStore('newRelated').queryType == 2){
          this.config.activeIndex = 0;
        }else {
          this.config.activeIndex = 1;
        }
        this.statusText = this.getStore('newRelated').statusText;
        this.queryType = this.getStore('newRelated').queryType;
        this.cacheSearchValue = this.getStore('newRelated').cacheSearchValue;
      }else {
        this.statusText = '待我处理';
        this.queryType = '2';
        this.cacheSearchValue = {};
      }
      this.advancedSearch(this.cacheSearchValue);
    },
    beforeDestroy () { // 组件销毁前缓存高级搜索条件
      let searchObj = {
        statusText: this.statusText,
        queryType: this.queryType,
        cacheSearchValue: this.cacheSearchValue
      }
      this.setStore('newRelated', searchObj);
    },
    methods: {
      // 页面滚动时头部导航的显示和隐藏
      scrollHandle(e){
        this.loadMoreScrollFun(e);
      },
      listenNavTabsBack(val){
        if(val){
          this.selectStatus('我经办的','3');
        }else {
          this.selectStatus('待我处理','2');
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~../../styles/common.scss';
  .qwui-scroll_view::-webkit-scrollbar {
    display: none;
  }
  .tab_wrap{
   /deep/  .qwui-nav_tabs{
     position: relative;
   }
  }
  .status-tab{
    display: flex;
    position: relative;
    height: 40px;
    background-color: #fff;
    text-align: center;
    align-items: center;
    border-top: 1px solid #f7f7f7;
  }
  .tab-item{
    display: flex;
    width: 50%;
    color: #9196A1;
    font-size: 13px;
    height: inherit;
    align-items: center;
    justify-content: center;
  }
  .tab-item:first-child{
    border-right: 1px solid rgba(0,0,0,0.3);
  }
  .tab-focus{
    color: #4072D2;
  }
</style>
