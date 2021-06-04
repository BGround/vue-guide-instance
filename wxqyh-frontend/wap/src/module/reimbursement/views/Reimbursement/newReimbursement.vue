<template lang="html">
  <div class="reimbursement">
    <div class="qwui-mask z-index_top" v-if="selectShow"></div>
    <!-- 高级搜索按钮 -->
    <qw-advance-search-box
      ref="searchBox"
      class="status_select_content"
      :searchinput="searchSetting"
      :keyWord="searchSetting.keyWord"
      @listenToSearchBox="getReimList"
      @showAdvancedSearch="showAdvancedSearch">
    </qw-advance-search-box>

    <!--下拉选择-->
    <div class="status_select_content">
      <div class="status_select border-bottom-1px">
        <span class="form-select" @click="selectShow=!selectShow">{{statusText}} <i class="icon_down" :class="selectShow?'click_icon_open':'click_icon_close'"></i> </span>
      </div>
      <div class="form-select_list" v-show="selectShow">
        <p  @click="selectStatus('我发起的','0')"
            class="form-select_option border-bottom-1px">
          <span :class="{'active':queryType == '0'}">我发起的</span>
        </p>
        <p  @click="selectStatus('我相关的','1')"
            class="form-select_option border-bottom-1px">
          <span :class="{'active':queryType == '1'}">我相关的</span>
        </p>
      </div>
    </div>

    <div class="qwui-scroll_view" :style="{height: scrollViewHeight}" v-scroll="scrollHandle">
      <!-- 报销列表 -->
      <qw-debit-list
        :reimList="reimList"
        :isShowMenu="queryType == 0"
        @showOperate="showOperate"
        @selectItem="gotoDetail">
      </qw-debit-list>
      <!--加载状态-->
      <load-more
        v-show="loadMore.totalRows > 0"
        :loading="loadMore.loading"
        :currPage="loadMore.currPage"
        :maxPage="loadMore.maxPage"
        :hasMore="hasMore"
        @loadMoreClick="loadMoreData">
        <span v-if="!isShowRecord">共 {{reimList.length}} 条单据</span>
      </load-more>

      <!--无记录-->
      <no-record v-show="isShowRecord" :setTop="true" :hasRecord="recordData"></no-record>
    </div>
    <!-- 高级搜索 -->
    <advancedSearch
      class="advance-search-container"
      @search="advancedSearch"
      @close="hideAdvancedSearch"
      :setting="advancedSetting"
      :cache-search-value="cacheSearchValue"
      v-show="isShowAdvanced">
    </advancedSearch>
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
  import {debitListMixin, debitSearchMixin, deleteDebitMixin} from '../../mixins/debitListMixin';
  import {mapState} from 'vuex';

  export default {
    name: 'QwReimbursement',
    mixins: [debitListMixin, debitSearchMixin, deleteDebitMixin],
    data() {
      return {
        lastScrollTop: 0,
      };
    },
    computed: {

    },
    watch: {

    },
    created() {
      if(this.getStore('newReimbursement')){
        this.statusText = this.getStore('newReimbursement').statusText;
        this.queryType = this.getStore('newReimbursement').queryType;
        this.cacheSearchValue = this.getStore('newReimbursement').cacheSearchValue;
      }else {
        this.statusText = '我发起的';
        this.queryType = '0';
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
      this.setStore('newReimbursement', searchObj);
    },
    methods: {
      // 页面滚动时头部导航的显示和隐藏
      scrollHandle(e) {
        this.lastScrollTop = e.scrollTop;
        this.loadMoreScrollFun(e);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~../../styles/common.scss';
  .qwui-scroll_view::-webkit-scrollbar {
    display: none;
  }
  .qwui-mask{
    position: fixed;
    z-index: 8;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.2);
  }
  .status_select_content{
    position: relative;
    z-index: 9;
  }
  .status_select{
    position: relative;
    height: 40px;
    background-color: #fff;
    text-align: center;
    border-top:1px solid #f7f7f7;
  }
  .form-select{
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    color: #9196A1;
  }
  .form-select_list{
    position: relative;
    background-color: #fff;
    text-align: center;
    font-size: 13px;
    color: #9196A1;
  }
  .form-select_option{
    height: 40px;
    line-height: 40px;
    /*border-top: 1px solid #f7f7f7;*/
  }
  .active{
    position: relative;
    color: #5585F0;
  &::after{
     content: '';
     display: block;
     position: absolute;
     right: -26px;
     bottom: 2px;
     width: 25px;
     height: 17px;
     background: url(~assets/images/reim/loan/ic_chosen.svg) no-repeat;
   }
  }
  .icon_down{
    display: inline-block;
    position: absolute;
    top: 12px;
    margin-left: 5px;
    width: 16px;
    height: 16px;
    background: url("~assets/images/icon_down_gray.png") no-repeat center;
    background-size: 14px 8px;
  }
  .click_icon_open{
    transform: rotate(180deg);
  }
  .click_icon_close{
    transform: rotate(0deg);
  }
</style>
