<template>
  <div class="main-page"
    v-infinite-scroll="loadMore"
		infinite-scroll-disabled="busy"
		infinite-scroll-distance="10"
		infinite-scroll-immediate-check="false"
    ref="scroll_container"
  >
    <bone-home v-show="!loadComplete"></bone-home>
    <simple-search
      @cancelSearch="cancelSearch"
      v-if="isShowSearch"
      :fullScreen="true"
      :navList="navList"
    >
    </simple-search>
    <header-nav @collectionComplete="collectionCompleteEvent" @beginSearch="isShowSearch = true"></header-nav>
    <div class="form-app" v-show="loadComplete">
      <h2 class="form-app-title">表单应用</h2>
      <div class="form-app-list">
        <div class="form-app-container" v-for="item in groupList" :key="item.id">
          <router-link
            tag="div"
            class="form-app-item"
            :to="{ name: 'appdetail', query: { id: item.id, title: item.typeName}}"
          >
            <i class="form-app-icon"
              :style="[item.picPath ? {background: JSON.parse(item.picPath).color} : {background: '#5f9ff3'}]"
              :class="[item.picPath ? 'bd-b-' + JSON.parse(item.picPath).icon : 'bd-b-chucha']">
            </i>
            <p class="app-desc-title">{{item.typeName}}</p>
            <p class="app-data">共{{item.count}}张表单</p>
          </router-link>
        </div>
      </div>
    </div>
    <guide v-if="needGuide == '1'" @closeGuide="closeGuide"></guide>
    <load-more
      v-show="loadComplete"
      :showrecord="showrecord"
			:busy="busy"
			:loading="loading"
			@childevent="loadMore"
      :loadingText="loadText"
      :recordIcon="true"
      recordTitle="当前没有可访问应用"
      recordText="请联系企业管理员，将你加入表单的填单范围内"
    >
    </load-more>
  </div>
</template>

<script>
import SimpleSearch from '../components/base/newBase/SimpleSearch'
import HeaderNav from '../components/base/newBase/HeaderNav'
import Guide from '../components/base/newBase/Guide'
import LoadMore from '../components/base/load_more'
import BoneHome from '../components/base/bone/BoneHome'
import {initGroup, initForm, getGuideInfo, setGuideInfo} from '../api/list.js'
import { setTimeout, setInterval, clearInterval } from 'timers';
import {setLeaveCache, updatePageInfo} from '../assets/js/keepAlive.js'

export default {
  name: 'home',
  data () {
    return {
      styleElem: null,
      needGuide: '0', //是否需要向导页0：不需要
      collectionLoading: true,
      isLoading: true,
      groupList: [],
      navList: {
        index: 0,
        nav: [
          {content: '表单', type: 'form', callback: initForm},
          {content: '分组', type: 'group', callback: initGroup}
        ]
      },
      isShowSearch: false,
      postData: {
        page: 1,
        pageSize: 20,
        keyWord: '',
        type: '',
        status: ''
      },
      busy: true,
      loading: false
    };
  },
  components: {
    HeaderNav,
    LoadMore,
    SimpleSearch,
    Guide,
    BoneHome
  },
  created() {
    this.initGroupList();
    let str = 'form_new_page_get_guide_info' + _.userId;
    if(localStorage.getItem(str)) {
      this.needGuide = localStorage.getItem(str);
    }else {
      getGuideInfo().then(res => {
        if(res.code != 0) return _.alert('提示：', res.desc);
        this.needGuide = res.data.value;
        localStorage.setItem(str, res.data.value);
      })
    }
  },
  mounted() {
    this.createStyle();
  },
  computed: {
    showrecord() {
      this.groupList = this.groupList || [];
      return this.groupList.length == 0 ? true : false;
    },
    loadText() {
      return '共 ' + this.groupList.length + ' 个应用';
    },
    loadComplete() {
      return !this.isLoading && !this.collectionLoading;
    }
  },
  methods: {
    initGroupList(isLoadMore) {
      initGroup(this.postData).then(res => {
        this.setGroupList(res, isLoadMore);
      })
    },
    collectionCompleteEvent(flag) {
      this.collectionLoading = flag
    },
    setGroupList(res, isLoadMore) { // 设置列表数据
			// _.hideLoading();
			this.loading = false;
			if(res.code != "0") {
				return _.alert('提示', res.desc);
			}
			this.busy = res.data.maxPage == 0 || res.data.currPage == res.data.maxPage;
			this.postData.page = res.data.currPage;
      this.groupList = isLoadMore ? this.groupList.concat(res.data.pageData) : res.data.pageData;
      if(this.isLoading) this.isLoading = false;
    },
    loadMore(){
			this.postData.page++;
			this.loading = true;
      this.busy = true;
			this.initGroupList(true);
    },
    cancelSearch() {
      this.isShowSearch = false;
    },
    closeGuide() {
      this.needGuide = '0';
      let str = 'form_new_page_get_guide_info' + _.userId;
      localStorage.setItem(str, '0');
      setGuideInfo('0').then(res => {
        if(res.code != 0) return _.alert('提示：', res.desc);
      })
    },
    createStyle() {
      let cssString = 'html,body {background: #fff;}'
      this.styleElem = document.createElement("style");
      this.styleElem.setAttribute("type", "text/css");

      if(this.styleElem.styleSheet){// IE
        this.styleElem.styleSheet.cssText = cssString;
      } else {// w3c
        var cssText = document.createTextNode(cssString);
        this.styleElem.appendChild(cssText);
      }

      var heads = document.getElementsByTagName("head");
      if(heads.length)
        heads[0].appendChild(this.styleElem);
      else
        document.documentElement.appendChild(this.styleElem);
    }
  },
  destroyed() {
    this.isLoading = true;
    if(this.styleElem) {
      this.styleElem.remove();
      this.styleElem = null;
    }
  },
  activated() {
    let _this = this;
    if(!this.styleElem) this.createStyle();
    updatePageInfo('mainPage', (cache) => {
      if(cache.update) {
        _this.collectionLoading = true;
        Events.$emit('updateHeaderCollection');
      }
      _this.$refs['scroll_container'].scrollTop = cache.scroll;
      document.documentElement.scrollTop = cache.scroll;
    })
  },
  beforeRouteLeave (to, from, next) {
    if(this.styleElem) {  //防止影响详情
      this.styleElem.remove();
      this.styleElem = null;
    }
    let flag = !['audit', 'mine', 'open'].includes(to.name),
        el = document.documentElement;

    setLeaveCache(flag, el, 'mainPage', vl => {vl.mainPage.scroll = 0;});
    next();
  }
}

</script>
<style lang='scss' scoped>
$baseURL: '../assets/images/';
.main-page {
  flex: 1;
  background: #fff;
  .form-app {
    width: 100%;
    position: relative;
    .form-app-title {
      height: 44px;
      line-height: 44px;
      font-size: 14px;
      font-weight: 600;
      color: #0A1735;
      padding: 0 14px;
      box-sizing: border-box;
    }
    .form-app-list {
      display: flex;
      padding: 4px 14px 0;
      flex-flow: row wrap;
      position: relative;
      .form-app-container {
        height: 64px;
        flex: 50%;
        max-width: 50%;
        min-width: 50%;
        margin-bottom: 16px;
        background: #fff;
        box-sizing: border-box;
        @media screen and (max-width: 740px) {
          padding: 0 11px 0 0;
          &:nth-of-type(2n) {
            padding: 0 0 0 11px;
          }
        }
        @media screen and (min-width: 740px) {
          flex: 33.3%;
          max-width: 33.3%;
          min-width: 33.3%;
          &:nth-of-type(3n-2) {
            padding: 0 11px 0 0;
          }
          &:nth-of-type(3n-1) {
            padding: 0 11px;
          }
          &:nth-of-type(3n) {
            padding: 0 0 0 11px;
          }
        }
        .form-app-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          background: #fff;
          padding: 0 12px 0 61px;
          box-shadow:0px 2px 13px 0px rgba(0,0,0,0.04);
          border-radius:8px;
          position: relative;
          cursor: pointer;
          &:active {
            background: #F7F8FA;
          }
          .form-app-icon {
            position: absolute;
            left: 12px;
            top: 15px;
            display: block;
            width: 34px;
            height: 34px;
            line-height: 34px;
            font-size: 20px;
            font-family: homeicon!important;
            font-style: normal;
            color: #fff;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-align: center;
            border-radius: 6px;
          }
          p {
            font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            &.app-desc-title {
              height: 18px;
              font-size: 13px;
              font-weight: 600;
              color:rgba(10,23,53,1);
              line-height:18px;
            }
            &.app-data {
              height: 14px;
              line-height: 14px;
              font-size:10px;
              font-weight:400;
              color:rgba(176,179,186,1);
              margin-top: 2px;
            }
          }
        }
      }

    }
  }
}
</style>
