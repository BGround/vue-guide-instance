<template lang="html">
  <div class="qwui-related">
    <search-box
      class="qwui-search_box"
      :searchinput="searchSetting"
      ref="searchBox"
      @listenToSearchBox="getSearchRequest"
    ></search-box>

    <div class="qwui-scroll_view" :style="{height: scrollViewHeight}" v-scroll="loadMoreScrollFun">
      <qw-reim-list
      :reim-list="reimList"
      :is-show-user="true"
      @selectItem="gotoDetail"
      ></qw-reim-list>

      <!--加载状态-->
      <load-more
        v-show="loadMore.totalRows > 0"
        :loading="loadMore.loading"
        :currPage="loadMore.currPage"
        :maxPage="loadMore.maxPage"
        :hasMore="hasMore"
        @loadMoreClick="loadMoreData"
      >
        <span class="qwui-total_rows" v-if="!isShowRecord">{{$t('i18n.total') + reimList.length + ' ' + $t('i18n.reim.info.total')}}</span>
      </load-more>

      <!--无记录-->
      <no-record v-show="isShowRecord" :setTop="true" :hasRecord="recordData"></no-record>
    </div>

    <qw-advanced-search
      class="qwui-advance_search_container"
      @search="advancedSearch"
      @close="hideAdvancedSearch"
      :setting="advancedSetting"
      :cache-search-value="cacheSearchValue"
      v-show="isShowAdvanced"
    ></qw-advanced-search>
  </div>
</template>

<script>
  import { reimListMixin, advancedSearchMixin } from '../../mixins/reimListMixin';
  import { pageMixin } from '../../mixins/pageMixin';
  import { NAV_HEIGHT, SEARCH_HEIGHT, TABBAR_HEIGHT } from '../../js/variable';

  export default {
    name: 'QwRelated',
    mixins: [pageMixin, reimListMixin, advancedSearchMixin],
    computed: {
      scrollViewHeight() {
        return `${window.innerHeight - SEARCH_HEIGHT - TABBAR_HEIGHT}px`;
      }
    },
  };
</script>

<style lang="scss" scoped>
  @import '~../../styles/common.scss';
</style>
