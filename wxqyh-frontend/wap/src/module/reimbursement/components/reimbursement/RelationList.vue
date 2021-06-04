<template>
  <div class="qwui-relation_list_container" v-if="config.isShow">
    <header class="qwui-search_fixed">
      <search-box
        :searchinput="searchinput"
        @listenToSearchBox="showMsgFromSearchBox"
      ></search-box>
    </header>

    <div class="qwui-relation_main">
      <div class="qwui-relation_scroll_view" :style="{height: ListHeight}" v-scroll="loadMoreScrollFun">
        <qw-relation-list-item
          v-for="item in relationList"
          v-model="checked"
          :name="item.id"
          :key="item.id"
          :relation-data="getRelationData(item)"
          @click="showDetail(item)"
        ></qw-relation-list-item>

        <!--加载状态-->
        <load-more
          v-show="loadMore.totalRows > 0"
          :loading="loadMore.loading"
          :currPage="loadMore.currPage"
          :maxPage="loadMore.maxPage"
          :hasMore="hasMore"
          @loadMoreClick="loadMoreData">
          <span v-if="!isShowRecord">{{totalText}}</span>
        </load-more>

        <!--无记录-->
        <no-record v-show="isShowRecord" :setTop="true" :hasRecord="recordData"></no-record>
      </div>

      <flow-button class="qwui-bottom_btn" :buttondata="buttonConfig"></flow-button>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/base/search_box';
import LoadMore from  '@/components/list/load_more';
import NoRecord from '@/components/base/noRecord';
import FlowButton from '@/components/button/flow_button';
import QwRelationListItem from './RelationListItem';
import api from '../../api';
import { VEH_URL, ASKINFO_URL, LOANLIST_URL, getVehDetail, getLoanDetail } from '../../api/editor';
import { mapMutations, mapGetters, mapActions } from 'vuex';

export default {
  name: 'QwRelationList',
  components: {
    SearchBox,
    LoadMore,
    NoRecord,
    FlowButton,
    QwRelationListItem,
  },
  props: {
    config: Object,
  },
  data() {
    return {
      checked: this.config.selected,
      relationList: [],
      _isScrollLock: false,
      isShowDetail: false,
      loadMore: {
        keyWord: '',
        page: 1,
        // 是否正在加载
        loading: false,
        currPage: '',
        maxPage: '',
        totalRows: '',
      },
      searchinput: {
        show: true,
        ridMask: true,
        setTopMask: false,
        keyWord: '',
      },
      buttonConfig: {
        //操作按钮
        primaryList:[
          {type:"primary",name:'i18n.confirm', callBack: this.confirm },
        ],
        defaultList:[
          {type:"default",name:'i18n.cancel', callBack: this.config.callBack.close },
        ],
        //按钮是否置底部 active :底部、"":相对定位
        class: ''
      },
    };
  },
  computed: {
    ListHeight() {
      const winHeight = window.innerHeight || window.clientHeight;
      // 减去搜索框和底部按钮的高度
      return `${winHeight - 50 - 60 }px`;
    },
    isShowRecord() {
      return this.loadMore.totalRows !== '' &&  this.relationList.length == 0;
    },
    hasMore() {
      return this.loadMore.totalRows !== '' ? this.loadMore.currPage < this.loadMore.maxPage : true;
    },
    totalText() {
      let typeText = this.$t('i18n.reim.' + this.config.type);
      return this.$t('i18n.total') + this.relationList.length + this.$t('i18n.defaultDescribe') + ' ' + typeText;
    },
    url() {
      const type = this.config.type;
      if (type === 'veh') {
        return VEH_URL;
      } else if (type === 'ask') {
        return ASKINFO_URL;
      } else if (type === 'loan') {
        return LOANLIST_URL;
      }
    },
    recordData() {
      const type = this.config.type;
      let title = '';
      if (type === 'veh') {
        title = this.$t('i18n.reim.info.noVehRecord');
      } else if (type === 'ask') {
        title = this.$t('i18n.reim.info.noAskRecord');
      } else if (type === 'loan') {
        title = this.$t('i18n.reim.info.noLoanRecord');
      }
      return {
        title,
        icon: 'qwui-icon_search',
        text: this.$t('i18n.reim.editor.relationNoResult'),
      };
    }
  },
  created() {
    this.loadData();
  },
  beforeDestroy () {
    this._isScrollLock = true;
    this.config.callBack.close();
  },
  methods: {
    // 请求列表
    loadData() {
      _.showLoading();
      const { page, keyWord } = this.loadMore;
      let params = {
        page,
        keyWord,
      };

      api.post(this.url, params).then((res) => {
        const { totalRows, maxPage, currPage } = res.data;
        const type =  this.config.type;
        let pageData;

        if (type === 'veh') {
          pageData = res.data.vehList;
        } else if (type === 'ask') {
          pageData = res.data.askList;
        } else if (type === 'loan') {
          pageData = res.data.pageData || [];
        }

        if (this.loadMore.page == 1 || !this.relationList.length) {
            this.relationList = pageData || [];
        } else {
          this.relationList.push(...pageData);
        }

        this.loadMore.maxPage = maxPage;
        this.loadMore.currPage = currPage;
        this.loadMore.totalRows = totalRows;

        this._isScrollLock = false;
        _.hideLoading();
      }).catch((err) => {
        _.hideLoading();
        this._isScrollLock = false;
        if (err.desc) {
          _.alert('i18n.notice',err.desc);
        } else {
          _.alert('i18n.notice', 'i18n.reim.info.resultError');
        }
      });
    },
    // 加载更多
    loadMoreData() {
      this.loadMore.page ++;
      this.loadData();
    },
    // 下滑加载更多
    loadMoreScrollFun(el) {
      const scrollTop = el.scrollTop;
      const offsetHeight = el.offsetHeight;
      const scrollHeight = el.scrollHeight;

      if (scrollTop + offsetHeight == scrollHeight) {
        if (!this._isScrollLock && this.loadMore.currPage < this.loadMore.maxPage) {
          this._isScrollLock = true;
          this.loadMoreData();
        }
      }
    },
    // 搜索
    showMsgFromSearchBox(keyWord) {
      this.loadMore.keyWord = keyWord;
      this.loadMore.page = 1;
      this.loadData();
    },
    confirm() {
      let data;
      if (this.config.type === 'loan') {
        data = this.relationList.find(item => item.loanId == this.checked);
      } else {
        data = this.relationList.find(v => v.askId == this.checked);
      }
      this.config.callBack.confirm(data);
    },
    // 格式化用车单，请假单、借款单的列表数据
    getRelationData(data) {
      if (!data) { return; }
      const type = this.config.type;

      if (type === 'veh') {
        return {
          title: data.title,
          id: data.askId,
          content1: this.$t('i18n.reim.editor.expense') + '：' + data.luqiaoFee,
          content2: this.$t('i18n.reim.editor.carTake') + '：' + data.takeTime,
        };
      } else if (type === 'ask') {
        return {
          title: data.title,
          id: data.askId,
          content1: this.$t('i18n.reim.editor.duration') + '：' + data.sumAskDays + this.$t('i18n.day'),
          content2: data.startTime,
        };
      } else if (type === 'loan') {
        return {
          title: data.title,
          id: data.loanId,
          content1: `${this.$t('i18n.reim.surplusMoney')}：¥${data.surplusMoney.toFixed(2)}`,
          content2: `${this.$t('i18n.reim.repayDate')}：${data.repayDate}`,
        };
      }
    },
    getVehDetail(askId) {
      _.showLoading();
      getVehDetail({ askId, size: 10 }).then((res) => {
        this.updateVehDetail({isShow: true, data: res.data.detail});
        _.hideLoading();
      })
    },
    // 获取借款单详情
    getLoanDetail(loanId) {
      _.showLoading();
      getLoanDetail({loanId}).then(res => {
        this.updateLoanDetail({isShow: true, data: res.data.data});
        _.hideLoading();
      }).catch(err => {
        if (err.desc) {
          _.alert('i18n.notice',err.desc);
        } else {
          _.alert('i18n.notice', 'i18n.reim.info.resultError');
        }
      })
    },
    showDetail(data) {
      const type = this.config.type;
      if (type === 'veh') {
        this.getVehDetail(data.askId);
      } else if (type === 'ask') {
        this.updateAskDetail({isShow: true, data});
      } else if (type === 'loan') {
        this.getLoanDetail(data.loanId);
      }
    },
    ...mapMutations([
      'setAskList',
      'setVehList',
      'updateAskDetail',
      'updateVehDetail',
      'updateLoanDetail',
    ]),
  }
}
</script>

<style lang="scss" scoped>
  .qwui-relation_list_container {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 5;
    background-color: #F6F6F6;

    .qwui-search_fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }

    .qwui-search_fixed /deep/ {
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

    .qwui-relation_main {
      margin-top: 45px;

      .qwui-relation_scroll_view {
        overflow-x: hidden;
        overflow-y: scroll;
      }

      .qwui-bottom_btn {
        position: absolute;
        bottom: 0;
        background-color: #fff;
      }
    }
  }

  @media screen and (min-width: 1024px){
    .qwui-relation_list_container {
      .qwui-search_fixed {
        width: 740px;
        left: 50%;
        transform: translateX(-50%);
      }

      .qwui-relation_main {
        width: 740px;
        margin: 45px auto 0;
      }
    }
  }
</style>


