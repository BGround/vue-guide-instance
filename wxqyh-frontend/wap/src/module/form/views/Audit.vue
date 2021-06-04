<template>
	<div class="audit-app">
    <bone-list v-show="isLoading"></bone-list>
    <div class="qwui-nav_box_fixed">
      <search-bar
        :searchinput="searchBar"
        :keyWord="searchBar.keyWord"
        placeholder="搜索"
        tips="搜索标题、提单人"
        @listenToSearchBox="showMsgFromSearchBar"
      >
        <div
          class="advance-search-icon"
          slot="rightSpan"
          v-if="searchBar.rightSpan &&  searchBar.rightSpan.show"
          @click="searchBar.rightSpan.callback"
          :class="{'high-light': hasAdvance}"
        >
        </div>
      </search-bar>
    </div>
    <advanced-search
      v-show="showSearch"
      :setting="searchSetting"
      :cache-search-value="cacheSearchValue"
      @close="searchClose"
      @search="search"
      @reset="searchReset"
    >
    </advanced-search>
    <div
      class="list-container"
      :class="{'no-record': showRecord}"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="false"
    >
      <audit-list :list="list" :showStatusInfo="true"></audit-list>
      <load-more
        v-show="!isLoading"
        :busy="busy"
        :loading="loading"
        :showrecord="showRecord"
        @childevent="loadMore"
      ></load-more>
    </div>
    <form-search v-if="formSearchShow"
      :cacheCheckedList="checkedList"
      paramSearchType="3"
      @close="closeFormSearch"
      @confirm="confirmFormSearch"></form-search>
	</div>
</template>

<script>
import AuditList from "../components/list/AvatarList";
import LoadMore from "../components/base/load_more";
import { initTodo, todoSearch, initHead, initListByType } from "../api/list";
import { mixinTab } from "../components/list/tab";
import { mixinCommonSearch } from "../components/list/advancedSearch";
import { mixinSearchSetting } from "../components/list/searchSetting";
import BoneList from "../components/base/bone/BoneList";
import {
  setLeaveCache,
  enterCacheOption,
  updatePageInfo
} from "../assets/js/keepAlive";

export default {
  mixins: [mixinTab, mixinCommonSearch],
  components: {
    AuditList,
    LoadMore,
    BoneList
  },
  data() {
    return {
      list: [],
      isLoading: true,
      searchSetting: []
    };
  },
  created() {
    this.setSearchSetting()
    this.cache("auditSearchValue", "auditCacheSearchValue")
    this.cacheFormSearch()
    this.initList()
    this.initCount()
  },
  methods: {
    async initList(isLoadMore) {
      this.busy = true
      this.useAdvance()

      if (!isLoadMore) this.isLoading = true
      var setting = Object.assign(JSON.parse(JSON.stringify(this.setting)), {
          workOrderSearchVOJson: JSON.stringify(this.searchValue),
          paramSearchType: 3
        }),
        res = await initListByType(setting)
      if (this.isLoading) this.isLoading = false
      this.setList(res, isLoadMore)
      //重置翻页数据
      !isLoadMore && this.setPageData(setting, res.totalRows, 3)
    },
    initCount() {
      // 初始化草稿，收藏，代办数量
      var sendData = {
        queryOutRelevantNum: 0, //是否查询相关外单数
        queryOutNum: 0, //是否查询外部单数
        queryDraftNum: 1, //是否查询草稿数
        queryCollectionNum: 0, //是否查询收藏数
        queryTodoNum: 1 //是否查询代办数
      };
      initHead(sendData).then(res => {
        if (res.code != "0") {
          return _.alert("提示", res.desc);
        }
        if (res.data.draftNum || res.data.draftNum > -1) {
          //草稿单
          dataBase.home.newHeadData.nav[1].num = res.data.draftNum;
        }
        if (res.data.collectionNum || res.data.collectionNum > -1) {
          //收藏单
          dataBase.home.newHeadData.nav[2].num = res.data.collectionNum;
        }
        if (res.data.todoNum || res.data.todoNum > -1) {
          //待办
          dataBase.home.newHomeFooterList.nav[1].num = res.data.todoNum;
        }
      });
    },
    setSearchSetting() {
      let searchSetting = [],
        settingMap = [0, 1, 2, 3, 6, 8],
        setting = JSON.parse(JSON.stringify(mixinSearchSetting))
      settingMap.forEach(item => searchSetting.push(setting[item]))
      searchSetting[1].callBack = this.showFormSearch
      searchSetting[4].selectConfig = dataBase.selectConfig
      this.searchSetting = searchSetting
    }
  },
  beforeDestroy() {
    // 组件销毁前缓存高级搜索条件
    this.isLoading = true;
		this.setStore('auditSearchValue', this.searchValue);
		this.setStore('auditCacheSearchValue', this.cacheSearchValue);
  },
  activated() {
    let _this = this;
    updatePageInfo('audit', (cache) => {
      if(cache.update) {
        _this.setting.page = 1;
        _this.isLoading = true;
        _this.initList();
      }
      document.querySelector('.list-container').scrollTop = cache.scroll;
    });
  },
  beforeRouteEnter(to, from, next) {
    enterCacheOption(from, 'audit');
    next();
  },
  beforeRouteLeave(to, from, next) {
    let flag = (to.name == 'detail'),
        el = document.querySelector('.list-container');

    setLeaveCache(flag, el, 'audit');
    next();
  }
}
</script>

<style lang="scss" scoped>
	.qwui-nav_box_fixed{
		position: fixed;
		z-index: 9;
		width: 100%;
    .advance-search-icon {
      width: 24px;
      height: 24px;
      margin: 6px 0 0 17px;
      padding: 0;
      background-image: url(../assets/images/icon_a-shearchbar_filter@2x.png);
      background-position: 0 -24px;
      background-repeat: no-repeat;
      background-size: 48px 36px;
      background-position: center;
      cursor: pointer;
      &.high-light {
        background: url(../assets/images/icon_a-search_filteer_pes.png);
      }
    }
	}
  .audit-app {
    flex: auto;
    .list-container {
      position: fixed;
      top: 52px;
      bottom: 49px;
      left: 0;
      right: 0;
      overflow-y: auto;
      &.no-record {
        background: #fff;
      }
      @media screen and (min-width: 1024px) {
        width: 740px;
        margin: auto;
      }
      @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
        bottom: 84px;
      }
      @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 896px) and (device-width: 414px) {
        bottom: 84px;
      }
    }
  }
</style>
