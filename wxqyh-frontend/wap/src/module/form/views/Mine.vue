<template>
  <div class="mine-app">
    <div class="qwui-nav_box_fixed">
        <search-bar
          :searchinput="searchBar"
          :keyWord="searchBar.keyWord"
          placeholder="搜索"
          :tips="searchTips"
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
    >
      <!-- 内容 -->
      <div class="swiper-wrapper">
        <div class="swiper-slide"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <bone-list v-show="isLoading || currentTab == 1" :top="0" :fixed="false"></bone-list>
          <avater-list
            :showPersonName="showPersonName"
            :list="currentTab == 0 ? list : []"
            :showStatusInfo="true"
            :showOption="showOption"
            @initOption="initOption"
          ></avater-list>
          <load-more
            v-show="!isLoading"
            :busy="busy"
            :loading="loading"
            :showrecord="showRecord"
            @childevent="loadMore"
          >
          </load-more>
        </div>
        <div class="swiper-slide"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <bone-list v-show="isLoading || currentTab == 0" :top="0" :fixed="false"></bone-list>
          <avater-list
            :showPersonName="showPersonName"
            :list="currentTab == 1 ? list : []"
            :showStatusInfo="true"
            :showOption="showOption"
            @initOption="initOption"
          ></avater-list>
          <load-more
            v-show="!isLoading"
            :busy="busy"
            :loading="loading"
            :showrecord="showRecord"
            @childevent="loadMore"
          >
          </load-more>
        </div>
      </div>
    </swiper-page>

    <advanced-search
        v-if="showSearch"
        :setting="searchSetting"
        :cache-search-value="cacheSearchValue"
        @close="searchClose"
        @search="search"
        @reset="searchReset">
    </advanced-search>
    <form-search v-if="formSearchShow"
      :cacheCheckedList="checkedList"
      :paramSearchType="paramSearchType"
      @close="closeFormSearch"
      @confirm="confirmFormSearch"></form-search>
    <dialog-group
        :btnConfig="btnConfig"
        :show="showDialogGroup"
        @delItem="delItem"
        @cancel="cancel">
        <p class="confirm-msg">确认删除该表单？</p>
    </dialog-group>
  </div>
</template>

<script>
import SwiperPage from '../components/base/newBase/SwiperPage'
import SelectCard from "../components/base/MenuTab"
import AvaterList from "../components/list/AvatarList"
import DialogGroup from "../components/base/newBase/DialogGroup"
import BoneList from "../components/base/bone/BoneList"
import {
  submitDel,
  submitCheck,
  initListByType
} from "../api/list";
import {
  setLeaveCache,
  enterCacheOption,
  updatePageInfo,
  resetPageCache
} from '../assets/js/keepAlive'

import { mixinTab } from "../components/list/tab"
import { mixinCommonSearch } from '../components/list/advancedSearch'
import { mixinSearchSetting } from '../components/list/searchSetting'

export default {
  mixins: [
    mixinTab,
    mixinCommonSearch
  ],
  components: {
    AvaterList,
    SelectCard,
    DialogGroup,
    BoneList,
    SwiperPage
  },
  data() {
    return {
      navs: ['我提交的', '我相关的'],

      isLoading: true,
      list: [],
      showPersonName: true,
      currentTab: 0,
      showOption: true,
      cacheKeyWord: '',
      current: { item: null, index: "" },
      searchSetting: [],
      btnConfig: [
        {
          text: "删除",
          callbackName: "delItem",
          isPrimary: true
        },
        {
          text: "取消",
          callbackName: "cancel",
          isPrimary: false
        }
      ],
      showDialogGroup: false,
      paramSearchType: 2
    };
  },
  computed: {
    cacheKey() {
      // 用于缓存的key值
      switch (this.currentTab) {
        case 0:
          return {
            newKey: "submitSearchValue",
            oldKey: "relateSearchValue",
            newCacheKey: "submitCacheSearchValue",
            oldCacheKey: "relateCacheSearchValue"
          };
        case 1:
          return {
            newKey: "relateSearchValue",
            oldKey: "submitSearchValue",
            newCacheKey: "relateCacheSearchValue",
            oldCacheKey: "submitCacheSearchValue"
          };
      }
    },
    searchTips() {
      return this.currentTab == 0 ? "搜索标题" : "搜索标题、提单人";
    }
  },
  created() {
    var _this = this;
    this.currentTab = parseInt(this.$route.query.index) || 0;
    this.cache(this.cacheKey.newKey, this.cacheKey.newCacheKey);
    this.initList();
    this.initPageData();
    this.setSearchSetting()
    this.searchBar.rightSpan.callback = function() {
      _this.cacheFormSearch()
      _this.showSearch = true
    };
  },
  methods: {
    slideChange(index) {
      //重置缓存数据
      resetPageCache('mine');

      this.currentTab = index;
      this.isLoading = true;
      this.paramSearchType = index == '0' ? 2 : 4
      //切换tab
      this.initPageInfo();
    },
    async initList(isLoadMore) {
      this.busy = true
      this.useAdvance();
      if(!isLoadMore) this.isLoading = true;
      let _this = this,
        setting = Object.assign(
          JSON.parse(JSON.stringify(this.setting)),
          { workOrderSearchVOJson: JSON.stringify(this.searchValue),
            paramSearchType: this.paramSearchType }
        ),
        res = await initListByType(setting)

      if (this.isLoading) this.isLoading = false
      this.setList(res, isLoadMore)
      !isLoadMore && this.setPageData(setting, res.totalRows, this.paramSearchType)
    },
    initPageInfo() {
      //切换页面初始化页面数据
      this.initPageData();
      this.showOption = this.currentTab == 0 ? true : false;
      this.list = [];
      this.setting.page = 1;
      this.cacheKeyWord = this.setting.keyWord;
      this.setStore(this.cacheKey.oldKey, this.searchValue);
      this.setStore(this.cacheKey.oldCacheKey, this.cacheSearchValue);
      this.cache(this.cacheKey.newKey, this.cacheKey.newCacheKey);
      this.setSearchSetting()
      this.cacheFormSearch()
      this.busy = true;
      this.initList();
    },
    // 设置高级搜索配置
    setSearchSetting() {
      let searchSetting = [],
          settingMap = [[0, 1, 2, 4, 5, 8, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
          setting = JSON.parse(JSON.stringify(mixinSearchSetting))
      switch (this.currentTab) {
        case 0:
          settingMap[0].forEach(item => searchSetting.push(setting[item]))
          searchSetting[2].value[2].relativeLabel = [4]
          searchSetting[2].value[3].relativeLabel = [5, 7]
          break
        case 1:
          settingMap[1].forEach(item => searchSetting.push(setting[item]))
          searchSetting[2].value[2].relativeLabel = [5]
          searchSetting[2].value[3].relativeLabel = [6, 10]
          searchSetting[6].selectConfig = dataBase.selectConfig
          searchSetting[7].selectConfig = dataBase.selectConfig
          break
      }
      searchSetting[1].callBack = this.showFormSearch
      this.searchSetting = searchSetting
    },
    // 设置表单详情页面翻页数据
    initPageData() {
      switch (this.currentTab) {
        case 0:
          this.$store.state.formBase.pageData.paramSearchType = 2;
          sessionStorage.setItem(
            "pageData",
            JSON.stringify(this.$store.state.formBase.pageData)
          );
        case 1:
          this.$store.state.formBase.pageData.paramSearchType = 4;
          break;
      }
    },

    initOption(item, index) {
      this.current.id = item.id;
      this.current.index = index;
      this.showDialogGroup = true;
    },
    delItem() {
      let _this = this;
      this.showDialogGroup = false;
      _.showLoading("正在删除...");
      submitCheck(this.current.id).then(res => {
        if (res.code != "0") {
          _.hideLoading();
          return _.alert("提示", res.desc);
        }
        submitDel(this.current.id).then(res => {
          _.hideLoading();
          if (res.code != "0") {
            return _.alert("提示", res.desc);
          }
          //删除列表的li
          _this.list.splice(this.current.index, 1);
          _.tooltips_succeed(res.desc);
        });
      });
    },
    cancel() {
      this.showDialogGroup = false;
    }
  },
  // 组件销毁前缓存高级搜索条件
  beforeDestroy() {
    this.isLoading = true;
    this.setStore(this.cacheKey.newKey, this.searchValue);
    this.setStore(this.cacheKey.newCacheKey, this.cacheSearchValue);
  },
  activated() {
    updatePageInfo('mine', (cache) => {
      if(cache.update) {
        this.setting.page = 1;
        this.isLoading = true;
        this.initList();
      }
      document.querySelectorAll('.swiper-slide')[this.currentTab].scrollTop = cache.scroll;
    });

  },
  beforeRouteEnter(to, from, next) {
    enterCacheOption(from, 'mine');

    next();
  },
  beforeRouteLeave(to, from, next) {
    let flag = (to.name == 'detail'),
        el = document.querySelectorAll('.swiper-slide')[this.currentTab];

    setLeaveCache(flag, el, 'mine');
    next();
  }
};
</script>

<style lang="scss" scoped>
.mine-app {
  .qwui-cardList {
    padding-top: 0;
  }
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
.confirm-msg {
  margin-top: 5px;
  height: 110px;
  line-height: 110px;
  text-align: center;
  font-size: 16px;
  font-family: "Microsoft YaHei", "宋体", Tahoma, Arial, sans-serif;
  font-weight: 400;
  color: rgba(27, 35, 58, 1);
}

</style>
