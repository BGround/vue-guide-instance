<template>
  <div class="search-app full-screen">
    <div class="search-box">
      <div class="search-high"></div>
      <div class="search-item qwui-nav_box_fixed">
        <div class="search-input-wrap">
          <div class="s-tosearch" @click="search()"></div>
          <form action="javascript:return true" class="search_input_form">  
            <input 
              v-model="keyWord" 
              type="search" 
              class="search-input" 
              autofocus
              @keyup.enter="search()"
              placeholder="搜索"
              ref="input"
            >
          </form>
          <div class="s-clear" @click="clearText" v-show="keyWord != ''"></div>
        </div>
        <span class="s-cancel" @click="$router.go(-1)">取消</span>
      </div>
    </div>
    <p class="search-tips" v-show="!isSearching">{{searchTips}}</p>
    <!-- tab -->
    <div class="search-tab" v-show="isSearching && showTab">
      <slide-tab 
        :selectdata="navList" 
        :userStyle="styleData"
        @listenTabChange="changeTab"
      >
      </slide-tab>
    </div>
    <div 
      class="content-box" 
      v-show="isSearching" 
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="false"
    >
      <p v-show="noData && searchEnd">找不到相关数据</p>
      <!-- 搜索表单 -->
      <ul class="list-box list-wrap" v-show="list.length > 0" v-if="type == 'form' || searchRange == 'appdetail'">
        <li v-for="(listItem, index) in list" :key="index">
          <form-item :listItem="listItem"></form-item>
        </li>
      </ul>
      <!-- 搜索分组 -->
      <ul class="group-box list-wrap" v-show="group.length > 0" v-else>
        <router-link 
          tag="li" 
          v-for="(groupItem, index) in group" 
          :key="index"
          :to="{name: 'appdetail', query: {id: groupItem.id}}"
        >
          <group-item :listItem="groupItem"></group-item>
        </router-link>
      </ul>
      <load-more
        :busy="busy"
        :loading="loading"
        @childevent="loadMore"
        v-show="!noData"
      ></load-more>
    </div>
  </div>
</template>

<script>
import FormItem from '../components/list/FormItem'
import GroupItem from '../components/list/GroupItem'
import SlideTab from '../components/base/MenuTab'
import LoadMore from '../components/base/load_more'
import {initForm, initGroup, initGroupForm} from '../api/list.js'

let DEFAULT_DATA = {
        page: 1,
        pageSize: 20,
        keyWord: '',
        type: '',
        status: '' 
      };

export default {
  name: 'search',
  components: {FormItem, GroupItem, SlideTab, LoadMore},
  data () {
    return {
      searchTips: '',
      searchEnd: true,
      navList: {
        index: 0,
        nav: [
          {content: '表单', type: 'form'},
          {content: '应用', type: 'group'}
        ]
      },
      appDetailList: [],
      searchRange: '',
      tabChanged: false,
      styleData: {
        height: 44,
        top: 52,
        fixed: true
      },
      busy: true,
      loading: false,
      currIndex: 0,
      keyWord: '',
      prevKeyWord: null,
      list: [],
      group: [],
      postData: {
        page: 1,
        pageSize: 20,
        keyWord: '',
        type: '',
        status: '' 
      },
      isSearching: false
    };
  },
  computed: {
    noData() {
      let list = this.navList.nav[this.currIndex].type == 'form' ? this.list : this.group;
      this.list = list || [];
      return ( this.list.length == 0 && this.isSearching) ? true : false; 
    },
    showTab() {
      return this.searchRange == 'all' ? true : false;
    },
    type() {
      return this.navList.nav[this.currIndex].type;
    },
    searchFn() {
      if(this.searchRange == 'all') {
        return this.type == 'form' ? initForm : initGroup;
      }else if(this.searchRange == 'appdetail') { //分组内搜索
        let _this = this;
        return 
      }
    }
  },
  created() {
    this.searchRange = this.$route.query.range;
    this.searchTips = this.$route.query.tips;
  },
  mounted() {
    this.$refs['input'].focus();
  },
  methods: {
    clearText() {
      this.keyWord = '';
      this.postData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      this.$refs['input'].focus();
    },
    search(isLoadMore) {
      this.$refs['input'].blur();
      if(this.keyWord === this.prevKeyWord && !isLoadMore && !this.tabChanged) return; //相同关键字不执行
      if(this.keyWord !== this.prevKeyWord && !isLoadMore) {  //重新搜索
        this.postData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        this.postData.keyWord = this.keyWord;
        this.prevKeyWord = this.keyWord;
      } 
      this.searchEnd = false;
      this.tabChanged = false;
      this.isSearching = true;

      if(this.searchRange == 'appdetail') { //搜索分组内表单
          let _this = this;
          if(this.appDetailList.length <= 0) {
            initGroupForm(_this.$route.query.id).then(res => {  //先请求到分组内所有表单
              if(res.code != 0) return _.alert('提示：', res.desc);
              _this.appDetailList = res.data.formData; 
              _this.list = _this.appDetailList.filter(item => item.formName.indexOf(_this.keyWord) != -1);
              this.searchEnd = true;
            }) 
          }else {
            _this.list = _this.appDetailList.filter(item => item.formName.indexOf(_this.keyWord) != -1);
            this.searchEnd = true;
          }
          return;
      }
      
      this.postData.keyWord = this.keyWord;
      _.showLoading();
      this.searchFn(this.postData).then(res => {
        _.hideLoading();
        if(res.code != 0) return _.alert('提示：', res.desc);

        this.loading = false;
        this.busy = res.data.maxPage == 0 || this.postData.page == res.data.maxPage;

        if(this.type === 'form') {
          this.list = isLoadMore && this.list.length > 0 ? 
                        this.list.concat(res.data.pageData) :
                        res.data.pageData;
        }else if(this.type === 'group') {
          this.group = isLoadMore && this.group.length > 0 ? 
                        this.group.concat(res.data.pageData) :
                        res.data.pageData;
        }
        this.searchEnd = true;
      })
    },
    changeTab(item, index) {
      this.tabChanged = true; //tab状态变化
      this.currIndex = index;
      this.loading = false;
      this.busy = true;
      this.postData = JSON.parse(JSON.stringify(DEFAULT_DATA));
      this.search();
    },
    loadMore(){  // 加载更多
      if(this.searchRange == 'appdetail') return;
			this.postData.page++;
			this.loading = true;
      this.busy = true;
			this.search(true);
		},
  }
}

</script>
<style lang='scss' scoped>
.search-app {
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: #fff;
  @media screen and (min-width: 1024px) { 
      width: 740px;
      margin: 0 auto; 
  }
  display: flex;
  flex-direction: column;
  background: #fff;
  .search-box {
    background: #fff;
    .search-high {
      height: 52px;
    }
    .s-tosearch {
      width: 16px;
      height: 16px;
      display: block;
      background: url(~assets/images/ic_search.png) no-repeat;
      background-size: 14px;
      background-position: center;
      margin-right: 4px;
    }
    .search-mask {
      z-index: 10;
      height: 52px;
      .dark {
        height: 100%;
        width: 100%;
        border-radius: 4px;
        background: #f4f6f8;
        display: flex;
        align-items: center;
        justify-content: center;
        > p {
          font-size: 14px;
          font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
          color: #CCCCCC;
          line-height: 36px;
        }
      }
    }
    .search-item {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 8px 16px;
      .search-input-wrap {
        display: flex;
        align-items: center;
        flex: 1;
        height: 36px;
        line-height: 36px;
        padding: 0 12px;
        border-radius: 4px;
        background: #f4f6f8;
        .search_input_form {
          flex: 1;
          background: transparent;
          height: 100%;
          .search-input {
            display: block;
            background: transparent;
            width: 100%;
            font-size: 14px;
            line-height: 36px;
          }
        }
        .s-clear {
          width: 16px;
          height: 16px;
          background: url(~assets/images/ic_del.png) no-repeat;
          background-size: cover;
          margin-left: 10px;
        }
      }
      .s-cancel {
        font-size:14px;
        font-weight:400;
        color:rgba(122,124,128,1);
        margin-left: 18px;
      }
    }
  }
  .search-tips {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #B2B9C8;
    margin-top: 16px;
    text-align: center;
  }
  .search-tab {
    border-top: 1px solid #F4F6F8;
    border-bottom: 1px solid #F4F6F8;
  }
  .content-box {
    overflow-y: scroll;
    flex: 1;
    @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 812px) and (device-width: 375px) {
      padding-bottom: 34px;
    }
    @media only screen and (-webkit-device-pixel-ratio: 3) and (device-height: 896px) and (device-width: 414px) {
      padding-bottom: 34px;
    }
    > p {
      height:14px;
      font-size:14px;
      font-family: 'Microsoft YaHei','宋体', Tahoma, Arial, sans-serif;
      font-weight:400;
      color:rgba(178,185,200,1);
      line-height:14px;
      text-align: center;
      margin-top: 24px;
    }
  }
}
input[type=search]::-webkit-search-cancel-button{
  -webkit-appearance: none;/*此处去掉默认的小×*/
}
</style>