<template>
  <div class="feedback-wrap">
    <!-- 搜索 -->
    <div class="fd-search-box qwui-nav_box_fixed">
      <form action="javascript:;" class="fd-search-form" :class="{unfocus: once}">  
        <i class="fd-search-icon" @click="goSearch"></i>
        <input 
          ref="fd_search_input"
          class="fd-search-input" 
          type="search" 
          placeholder="搜索" 
          v-model="searchMsg"
          @focus="searchFocus"
          @keydown.enter="searchFeedback"
        >
        <i class="fd-delete-icon" v-show="searchMsg.length > 0" @click="clearInput"></i>
      </form>
    </div>
    <div class="fd-search-mask" v-show="isFocus" @click="isFocus = false"></div>
    <ul class="fb-list">
      <li class="fb-list-item" v-for="(item, index) in filterList" :key="index">
        <a :href="detailUrl + item.id">
          <div class="fb-list-icon">
            <i class="fb-dot" v-if="false"></i>
          </div>
          <div class="fb-item-info">
            <h3 class="fb-item-title">{{item.instanceTitle}}</h3>
            <p class="fb-item-other">
              <span class="fb-item-time">{{feedbackTime(item.createaTime)}}</span><span>{{item.commentNum || 0}}回复</span>
            </p>
          </div>
        </a>
      </li>
    </ul>
    <load-more 
      v-show="!isLoading"
      :busy="true"
      :loading="false"
      :showrecord="showrecord"
      :loadingText="loadText"
    >
    </load-more>
    <div class="fb-button">
      <a :href="href" class="fb-btn-inner">
        我要反馈
      </a>
    </div>
  </div>
</template>

<script>
import LoadMore from "../components/base/load_more"
import SearchBox from "../components/base/newBase/SearchBox"
import {feedbackList, isAdministrator} from "../api/list.js"
export default {
  data () {
    return {

      isLoading: true,
      searchMsg: '',
      isFocus: false,
      once: true,
      feedbackUrl: `${location.href.slice(0, location.href.indexOf('/vp'))}/vp/module/form.html?agentCode=form&corp_id=${wxqyhConfig.orgConfigInfo.corpId}#/open/add?id=`, 
      detailUrl: `${location.href.slice(0, location.href.indexOf('/vp'))}/vp/module/form.html?agentCode=form&corp_id=${wxqyhConfig.orgConfigInfo.corpId}#/open/detail?id=`, 
      href: '',
      list: [],
      filterList: [],
    };
  },
  computed: {
    showrecord() {
      this.filterList = this.filterList || [];
      return this.filterList.length == 0 ? true : false;
    },
    loadText() {
      return `共${this.filterList.length}条数据`
    }
  },
  components: {LoadMore, SearchBox},
  created() {
    this.initList();
  },
  methods: {
    initList() {
      let chargeName = this.$route.query.charge || '林卓帆';
      let appName = this.$route.query.app || '表单流程';
      var _this = this;
      _.showLoading();
      feedbackList().then(res => {
        _.hideLoading();
        this.isLoading = false;
        if(res.code != '0') return _.alert('提示：' + res.desc);
        this.feedbackUrl += res.data.feedBackVersionId;
        if(_.isAdministrator) {
          this.href = `${this.feedbackUrl}&field=${wxqyhConfig.orgConfigInfo.corpId}&field1=${_.userId}&field2=${chargeName}&field3=${_.isAdministrator == 1 ? '管理员' : '普通员工'}&field4=${_.is_vip ? '付费用户' : '普通用户'}&field5=${appName}`;
        }else {
          isAdministrator().then(res => {
            if (res.code != 0) return;
            _.isAdministrator = res.data.isManager;
            this.href = `${this.feedbackUrl}&field=${wxqyhConfig.orgConfigInfo.corpId}&field1=${_.userId}&field2=${chargeName}&field3=${_.isAdministrator == 1 ? '管理员' : '普通员工'}&field4=${_.is_vip ? '付费用户' : '普通用户'}&field5=${appName}`;
          });
        }
        this.list = this.filterList = res.data.tbFormWorkOrderPOList;
      })
    },
    searchFocus() {
      this.isFocus = true;
      this.once = false;
    },
    goSearch() {
      if(!this.once) this.searchFeedback();
      else this.$refs['fd_search_input'].focus();
    },
    searchFeedback() {
      this.isFocus = false;
      this.filterList = this.list.filter(item => item.instanceTitle.indexOf(this.searchMsg) != -1);
    },
    clearInput() {
      this.searchMsg = '';
      this.searchFeedback();
    },
    feedbackTime(stamp) {
      return stamp.slice(0,10);
    }
  }
}

</script>
<style lang='scss' scoped>
.feedback-wrap {
  padding-bottom: 60px;
  padding-top: 52px;
  @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
    padding-bottom: 26px;
  }
  @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 896px) and (device-width: 414px) {
    padding-bottom: 26px;
  }
  .fd-search-box {
    position: fixed;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 52px;
    background: #fff;
    .fd-search-form {
      display: block;
      margin: 8px 14px;
      padding: 5px 30px;
      background: #F4F6F8;
      border-radius: 4px;
      position: relative;
      &.unfocus {
        .fd-search-icon {
          left: 50%;
          margin-left: -44px;
          cursor: text;
        }
        .fd-search-input {
          text-align: center;
        }
      }
      .fd-search-icon {
        position: absolute;
        width: 25px;
        height: 26px;
        margin-left: -30px;
        background: url(../assets/images/ic_search.png) no-repeat;
        background-size: 14px;
        background-position: 8px center;
        cursor: pointer;
      }
      .fd-delete-icon {
        position: absolute;
        top: 5px;
        right: 4px;
        width: 26px;
        height: 26px;
        background: url(../assets/images/ic_del.png) no-repeat;
        background-size: 16px;
        background-position: left center;
      }
      .fd-search-input {
        display: block;
        width: 100%;
        height: 26px;
        background: #F4F6F8;
        text-align: left;
        color: #B2B9C8;
        font-size: 14px;
        &::-webkit-search-cancel-button{
          -webkit-appearance: none;/*此处去掉默认的小×*/
        }
      }
    }
  }
  .fd-search-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 1;
    @media screen and (min-width: 1024px) {
      width: 740px;
      margin: auto;
    }
  }
  .fb-list {
    padding: 0 14px;
    background: #fff;
    .fb-list-item {
      padding: 14px 0;
      border-bottom: 1px solid #F7F8FA;
      > a {
        display: block;
      }
      .fb-list-icon {
        float: left;
        position: relative;
        width: 24px;
        height: 24px;
        background: url(../assets/images/icon_feedback@2x.png) center no-repeat;
        background-size: 24px;
        .fb-dot {
          width: 6px;
          height: 6px;
          background: #FF586D;
          border: 2px solid #fff;
          border-radius: 50%;
          position: absolute;
          right: -2px;
          top: -2px;
        }
      }
      .fb-item-info {
        margin-left: 40px;
        .fb-item-title {
          display: -webkit-box;
          font-size:16px;
          font-weight:400;
          color:rgba(10,23,53,1);
          line-height:22px;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          max-height: 72px;
          word-break: break-all;
          margin-bottom: 4px;
        }
        .fb-item-other {
          font-size:13px;
          font-weight:400;
          color:rgba(178,185,200,1);
          line-height:18px;
          .fb-item-time {
            margin-right: 12px;
          }
        }
      }
    }
  }
  .fb-button {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    background: #fff;
    cursor: pointer;
    @media screen and (min-width: 1024px) {
      width: 740px;
      margin: 0 auto;
    }
    .fb-btn-inner {
      display: block;
      line-height:44px;
      background:rgba(85,133,240,1);
      border-radius:4px;
      margin: 8px 14px;
      font-size: 15px;
      color: #fff;
      text-align: center;
    }
  }
}
</style>