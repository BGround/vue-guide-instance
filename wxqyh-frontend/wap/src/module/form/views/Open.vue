<template>
	<div class="open-app" ref="open_app">
		<div class="qwui-nav_box_fixed">
			<search-bar
        :searchinput="searchBar"
        :keyWord="setting.keyWord"
        placeholder="搜索标题"
        tips="搜索标题"
        @listenToSearchBox="showMsgFromSearchBar"
        ref="searchBar"
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
    <swiper-page
      :navs="navs"
      :currentTab="currentTab"
      :showrecord="showRecord"
      @slideChange="slideChange"
      :top="52"
      :bottom="0"
    >
      <div class="swiper-wrapper">
        <div class="swiper-slide"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <div class="open-slide-mask" v-show="isLoading || currentTab == 1"></div>
          <open-list :list="currentTab == 0 ? list : []"></open-list>
          <load-more
            v-show="!isLoading"
            :busy="busy"
            :loading="loading"
            :showrecord="showRecord"
            @childevent="loadMore"
            recordTitle="没有外部单"
            recordText="通过外部单可以查看组织外部人员提交的数据, 数据模板请在后台配置"
          ></load-more>
        </div>
        <div class="swiper-slide"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <div class="open-slide-mask" v-show="isLoading || currentTab == 0"></div>
          <relevant-list :list="currentTab == 1 ? list : []"></relevant-list>
          <load-more
            v-show="!isLoading"
            :busy="busy"
            :loading="loading"
            :showrecord="showRecord"
            @childevent="loadMore"
            recordTitle="没有外部单"
            recordText="作为相关人或被@的外部单，显示在这里"
          ></load-more>
        </div>
      </div>
    </swiper-page>

		<advancedSearch
			v-show="showSearch"
			:setting="searchSetting"
			:cacheSearchValue="cacheSearchValue"
			@close="searchClose"
			@search="search"
      @reset="searchReset"></advancedSearch>
    <form-search v-if="formSearchShow"
      :cacheCheckedList="checkedList"
      paramSearchType="0"
      @close="closeFormSearch"
      @confirm="confirmFormSearch"></form-search>
	</div>
</template>

<script>
import SwiperPage from "../components/base/newBase/SwiperPage";
import selectCard from "../components/base/MenuTab";
import openList from "../components/list/openList";
import relevantList from "../components/list/relevantList";
import { initHead, initOpen, initListByType } from "../api/list.js";
import { mixinTab } from "../components/list/tab";
import { mixinCommonSearch } from "../components/list/advancedSearch";
import { mixinSearchSetting } from "../components/list/searchSetting";

export default {
  mixins: [mixinTab, mixinCommonSearch],
  components: {
    selectCard,
    openList,
    relevantList,
    SwiperPage
  },
  data() {
    return {
      navs: ["外部单提醒", "我相关的"],
      currentTab: 0,
      isLoading: true,
      list: [],
      searchSetting: []
    };
  },
  created() {
    var _this = this;
    this.searchBar.rightSpan.show = false;
    if (this.getStore("formOpenCurrentTabIndex"))
      this.currentTab = this.getStore("formOpenCurrentTabIndex");
    this.setSearchSetting();
    this.cache("openSearchValue", "openCacheSearchValue");
    this.cacheFormSearch();
    this.setting.keyWord = this.getStore("openKeyWord") || "";
    this.$set(this.searchBar, "keyWord", this.getStore("openKeyWord") || "");
    initHead({ queryOutRelevantNum: 1 }).then(res => {
      if (res.code != "0") {
        return _.alert("提示", res.desc);
      }
      _this.navs.splice(1, 1, "我相关的(" + res.data.outRelevantNum + ")");
    });
    this.initList();
    this.searchBar.rightSpan.callback = function() {
      _this.showSearch = true;
    };
  },
  methods: {
    slideChange(index) {
      this.currentTab = index;
      this.isLoading = true;
      //切换tab
      this.setStore("formOpenCurrentTabIndex", this.currentTab);
      this.initPageInfo();
    },
    async initList(isLoadMore) {
      this.useAdvance();
      var initFunction = null,
        setting = JSON.parse(JSON.stringify(this.setting));

      switch (this.currentTab) {
        case 0:
          initFunction = initOpen;
          break;
        case 1:
          setting = Object.assign(setting, {
            workOrderSearchVOJson: JSON.stringify(this.searchValue),
            paramSearchType: 0
          });
          initFunction = initListByType;
          break;
      }

      let res = await initFunction(setting);
      if (this.isLoading) this.isLoading = false;
      this.setList(res, isLoadMore);
      if(this.currentTab == 1 && !isLoadMore) {
          this.setPageData(setting, res.totalRows, 0)
      }
    },
    initPageInfo() {
      this.list = [];
      this.setting.page = 1;
      this.busy = true;
      switch (this.currentTab) {
        case 0:
          this.setStore("openSearchValue", this.searchValue);
          this.setStore("openCacheSearchValue", this.cacheSearchValue)
          this.$set(this.setting, "keyWord", this.getStore("openKeyWord") || "")
          this.$set(this.searchBar, "keyWord", this.getStore("openKeyWord") || "")
          this.searchBar.rightSpan.show = false
          this.recordText = "通过外部单可以查看组织外部人员提交的数据,数据模板请在后台配置"
          break;
        case 1:
          this.setStore("openKeyWord", this.setting.keyWord);
          this.$set(this.setting, "keyWord", this.searchValue["formTitle"] || "")
          this.$set(this.searchBar, "keyWord", this.searchValue["formTitle"] || "")
          this.recordText = "作为相关人或被@的外部单，显示在这里";
          this.searchBar.rightSpan.show = true;
          break;
      }
      this.initList();
    },
    showMsgFromSearchBar(keyWord) {
      if (keyWord == this.setting.keyWord) {
        return;
      }
      this.busy = true;
      this.list = [];
      this.setting.page = 1;
      if (this.currentTab == 0) {
        this.setting.keyWord = keyWord
      } else {
        this.$set(this.searchValue, 'formTitle', keyWord)
        this.$set(this.cacheSearchValue, 'formTitle', keyWord)
      }
      this.initList();
    },
    setSearchSetting() {
      let searchSetting = [],
        settingMap = [0, 1, 3, 8],
        setting = JSON.parse(JSON.stringify(mixinSearchSetting))
      settingMap.forEach(item => searchSetting.push(setting[item]));
      searchSetting[1].callBack = this.showFormSearch;
      this.searchSetting = searchSetting;
    }
  },
  beforeDestroy() {
    // 组件销毁前缓存搜索条件
    this.isLoading = true;
		if(this.currentTab == 0) {
			this.setStore('openKeyWord', this.setting.keyWord);
		} else {
			this.setStore('openSearchValue', this.searchValue);
			this.setStore('openCacheSearchValue', this.cacheSearchValue);
    }
    //记录tab位置
    this.setStore('formOpenCurrentTabIndex', this.currentTab);
  }
}

</script>

<style lang="scss" scoped>
.open-app {
  .qwui-cardList {
    padding-top: 0;
  }
}
.open-slide-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
  background: #fff;
}

.qwui-nav_box_fixed {
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
</style>
