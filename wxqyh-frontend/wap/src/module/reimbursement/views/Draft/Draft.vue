<template lang="html">
  <div class="qwui-draft" v-windowscroll="loadMoreDraft">
    <qw-reim-list
      class="qwui-reim_list"
      :reim-list="reimList"
      :is-show-menu="true"
      @showOperate="showOperate"
      @selectItem="gotoEdit"
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
</template>

<script>
import { reimListMixin, deleteReimMixin } from '../../mixins/reimListMixin';

export default {
  name: 'QwDraft',
  mixins: [reimListMixin, deleteReimMixin],
  methods: {
    loadMoreDraft() {
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      if(scrollTop + window.innerHeight >= document.body.scrollHeight ) {
        if (!this._isScrollLock && this.loadMore.currPage < this.loadMore.maxPage) {
          this._isScrollLock = true;
          this.loadMoreData();
        }
      }
    },

    gotoEdit(reimData) {
      this.$router.push({name: 'edit', query: { reimId: reimData.reimId }});
      //window.location.href = `${_.baseURL}/jsp/wap/reimbursement/edit.jsp?reimId=${reimData.reimId}&status=0&source=list`;
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/common.scss';

  .qwui-draft {
    .qwui-reim_list {
      margin-top: -10px;
    }
  }
</style>

