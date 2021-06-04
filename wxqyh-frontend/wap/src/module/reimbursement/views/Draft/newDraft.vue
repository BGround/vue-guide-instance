<template lang="html">
  <div class="draft" v-windowscroll="loadMoreDraft">
    <!--<search-box
      class="search-box"
      :searchinput="searchSetting"
      @listenToSearchBox="getReimList"
    ></search-box>-->
    <qw-debit-list
      :reimList="reimList"
      :isShowMenu="true"
      @showOperate="showOperate"
      @selectItem="gotoDraft"
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
</template>

<script>
  import { debitListMixin, deleteDebitMixin } from '../../mixins/debitListMixin';
  import SearchBox from '@/components/base/search_box';

  export default {
    name: 'QwnewDraft',
    mixins: [debitListMixin, deleteDebitMixin],
    components: {
      SearchBox,
    },
    created(){
      this.searchSetting.rightSpan.show = false;
    },
    methods: {
      gotoDraft(reimData) {
        let edit = reimData.type?'debitAdd':'edit';
        reimData.type?this.$router.push({name: edit , query: { id: reimData.id, type:'draft' }}):this.$router.push({name: edit , query: { reimId: reimData.id}});
      },
      loadMoreDraft() {
        let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        if(scrollTop + window.innerHeight >= document.body.scrollHeight ) {
          if (!this._isScrollLock && this.loadMore.currPage < this.loadMore.maxPage) {
            this._isScrollLock = true;
            this.loadMoreData();
          }
        }
      },
      /*// 页面滚动时头部导航的显示和隐藏
      scrollHandle(e){
        this.loadMoreScrollFun(e);
      },*/
    },
  }
</script>

<style lang="scss" scoped>
  /* 覆盖搜索框样式 */
  .search-box /deep/ {
  .qwui-search_bar {
    background: #fff;

  &::after {
     border: none;
   }
  }

  .qwui-search_inner, .qwui-search_text {
    background: #F3F4F7;
  }

  .qwui-full_width {
    background: #F7F7F7;
  }
  }
</style>
