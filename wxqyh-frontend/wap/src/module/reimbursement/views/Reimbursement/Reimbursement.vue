<template lang="html">
  <div class="qwui-reimbursement">

    <div class="qwui-fixed_head">
      <!-- 头部导航 -->
      <home-head-nav
        :headrdata="headSetting"
        :footerIndex="footerIndex"
      >
        <search-box
          class="qwui-search_box"
          slot="search"
          v-if="isSearchShow"
          :searchinput="searchSetting"
          :keyWord="params.keyWord"
          ref="searchBox"
          @searchChange="searchChange"
          @listenToSearchBox="getSearchRequest"
        ></search-box>
      </home-head-nav>
    </div>

    <div class="qwui-scroll_view" :style="{height: scrollViewHeight}" v-scroll="scrollHandle">
      <!-- 报销列表 -->
      <qw-reim-list
        :class="{'nosearch-wrap': !isSearchShow}"
        :reim-list="reimList"
        :is-show-menu="true"
        @showOperate="showOperate"
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

    <!-- 高级搜索 -->
    <qw-advancedSearch
      class="qwui-advance_search_container"
      @search="advancedSearch"
      @close="hideAdvancedSearch"
      :setting="advancedSetting"
      :cache-search-value="cacheSearchValue"
      v-show="isShowAdvanced"
    ></qw-advancedSearch>
  </div>
</template>

<script>
  import HomeHeadNav from '@/components/home/home_head_nav';
  import { reimListMixin, advancedSearchMixin, deleteReimMixin } from '../../mixins/reimListMixin';
  import { pageMixin } from '../../mixins/pageMixin';
  import { NAV_HEIGHT, SEARCH_HEIGHT, TABBAR_HEIGHT } from '../../js/variable';
  import { mapGetters } from 'vuex';

  export default {
    name: 'QwReimbursement',
    components: {
      HomeHeadNav,
    },
    mixins: [pageMixin, reimListMixin, advancedSearchMixin, deleteReimMixin],
    data() {
      return {
        headSetting: {
          show: true,
          nav:[
            {class:'ic_add', text:'i18n.reim.pages.add', url: 'add'},
            {class:'ic_draft', text:'i18n.reim.pages.draft', url:'draft', num: '0' },
          ],
          searchBar: {
            show: false,
            ridMask: false,
            setTopMask: true,
            closeLabel: true,
            rightSpan: {
              show: true,
              callback: this.showAdvancedSearch,
            }
          }
        },
        footerIndex: 0,
        lastScrollTop: 0,
        isFirstLoad: true,
        isSearchShow: false,
      };
    },
    computed: {
      scrollViewHeight() {
        const winHeight = window.innerHeight;
        const scrollHeight = winHeight - TABBAR_HEIGHT;

        if (this.isSearchShow) {
          return `${this.headSetting.show ? scrollHeight - NAV_HEIGHT - SEARCH_HEIGHT : scrollHeight - SEARCH_HEIGHT}px`;
        } else {
          return `${this.headSetting.show ? scrollHeight - NAV_HEIGHT : scrollHeight}px`;
        }
      },
      ...mapGetters([
        'draftNum',
      ]),
    },
    watch: {
      isSearchShow(isShow) {
        this.headSetting.searchBar.show = isShow;
      },
      draftNum(num) {
        this.headSetting.nav[1].num = num || '0' ;
      }
    },
    created () {
      this.headSetting.nav[1].num = this.draftNum || '0' ;
    },
    methods: {
      // 页面滚动时头部导航的显示和隐藏
      scrollHandle(e){
        const scrollTop = e.scrollTop;

        if((scrollTop - this.lastScrollTop)>200){
          //隐藏头部菜单
          this.headSetting.show = false;
          this.footerIndex = -1;
          this.lastScrollTop = scrollTop
        }

        if(this.lastScrollTop-scrollTop>10){
          //显示头部菜单
          this.headSetting.show = true;
          this.footerIndex = 0;
          this.lastScrollTop = scrollTop
        }

        this.loadMoreScrollFun(e);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~../../styles/common.scss';

  .nosearch-wrap {
    margin-top: -10px;
  }
</style>
