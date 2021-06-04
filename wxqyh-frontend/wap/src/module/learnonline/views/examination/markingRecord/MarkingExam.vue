<template>
  <div class="wrap exam_marking_exam">
    <!-- 搜索框 -->
    <search-box
      class="qwui-tips fixed_set_top"
      :searchinput="searchBar"
      @listenToSearchBox="listenToSearchBox"
    ></search-box>

    <!-- 阅卷列表数据 -->
    <div class="person_content">
      <marking-person
        class="marking_person"
        v-for="(item, index) in pageData"
        :key="index"
        v-bind="item"
        @clickItem="listenMarkingPerson"
      ></marking-person>
    </div>

    <!-- 加载更多组件 -->
    <load-more
      :loading="nowContentData.loading"
      :maxPage="nowContentData.maxPage"
      :currPage="nowContentData.currPage"
      :borderTop=false
      colorType="transparent"
      @loadMoreClick="loadMoreList"
    >
      <span v-show="loadMoreShow">{{$t('i18n.nomore')}}</span>
    </load-more>

    <!-- 无数据提示 -->
    <no-record
      v-show="nowHasRecord.show"
      :hasRecord="nowHasRecord"
    ></no-record>
  </div>
</template>


<script>
import SearchBox from '@/components/base/search_box'; // 搜索公共组件
import NoRecord from '@/components/base/noRecord';    // 暂无数据公共组件
import LoadMore from '@/components/list/load_more';   // 加载更多公共组件
import MarkingPerson from './components/MarkingPerson';   // 阅卷项
import { getManualDetailList } from "../../../api/getData"; // 请求接口
export default {
  name: 'MarkingExam',
  components: {
    SearchBox,
    NoRecord,
    LoadMore,
    MarkingPerson,
  },
  filters: {
  },
  data(){
    return {
      /* 公共组件配置项 */
      hasRecord: {
        common: { // 无数据配置
          setTop: true,
          icon: 'icon_noData',
          title: this.$t('i18n.noRecord'),
          text: '',
        },
        search: {
          icon: 'icon_noData_search',
          title: this.$t('i18n.noSearchResult'),
          text: ''
        }
      },
      searchBar: {
        keyWord: '',
        sessionKeyWord: ''
      },

      /* 数据项 */
      manualPageData: { // 阅卷人列表数据
        pageData: [],
        currPage: 0,
        maxPage: 1,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
        scrollTop: 0, // 滚动高度
      },
      manualId: '', // 阅卷id

    };
  },
  computed: {
    // 当前使用的数据，统一方式，便于理解和维护多个文件
    nowContentData() {
      return this.manualPageData;
    },
    pageData() {
      return this.nowContentData.pageData;
    },
    // 无数据配置
    nowHasRecord() {
      let nowContentData = this.nowContentData;
      let hasRecord = this.hasRecord;
      let hasRecordAssi = Object.assign({}, hasRecord.common, {
        // 请求后为第一页。 可以避免初始化时渲染无数据页
        show: !nowContentData.pageData.length && nowContentData.currPage
      });

      // 有搜索关键字的话，需要更换无数据图标文字
      this.searchBar.keyWord && Object.assign(hasRecordAssi, hasRecord.search)
      return hasRecordAssi;
    },
    loadMoreShow() {
      return !this.nowHasRecord.show && this.pageData.length;
    }

  },
  created() {
    this.manualId = this.$route.params.id;

    // 添加滚动事件
    window.addEventListener('scroll', this.scrollList);
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 缓存数据获取
      let sessData = sessionStorage.getItem('markingExam');

      // 从阅卷情况页返回，则读取缓存数据
      if (from.name == 'marking_detail' && sessData) {
        let sessJson = JSON.parse(sessData);
        // 返回触发的初次搜索后干掉sessionKeyWord
        Object.assign(vm.searchBar, {
          keyWord: sessJson.keyWord,
          sessionKeyWord: sessJson.keyWord
        });
        // 赋值完后将keyword干掉再赋值到列表数据，避免多余数据产生
        delete sessJson.keyWord

        vm.manualPageData = Object.assign({}, sessJson);
      } else {
        // 初始获取数据
        // 因为项高度比较小，10个都无法换页，所以初始超10帮触发
        vm.getInitData();
      }

      // 清掉缓存
      sessionStorage.removeItem('markingExam');
    });
  },
  mounted() {
    // 渲染完，有滚动高度的，滚动到指定位置，
    this.$nextTick(() => {
      let scrollTop = this.nowContentData.scrollTop;
      if (!scrollTop) { return;}

      // 需要延迟触发，否则无法滚动
      setTimeout(() => {window.scrollTo(0, scrollTop)}, 10);
    });
  },
  beforeDestroy() {
    // 移除滚动事件，避免其他页面触发
    window.removeEventListener('scroll', this.scrollList);
  },
  methods:{
    // 初始获取数据
    getInitData() {
      this._getManualDetailList().then(() => {
        // 判断是否有第二页数据
        if (this.nowContentData.maxPage < 2) {return ;}

        // 触发下滚动事件(忽略顶部设置，可以强制在顶部触发)
        this.scrollList({}, true); // 参数1为e滚动事件

      });
    },

    // 获取试卷列表数据
    _getManualDetailList(init=false) {
      return new Promise((resolve, reject) => {
        getManualDetailList({
          page: this.nowContentData.currPage + 1,// 不用++i 因为原数据不需要变动
          manualId: this.manualId,
          personName: this.searchBar.keyWord
        }, data => {
          let pageData = this.pageData;

          while(init && pageData.length){ // 初始化，用于搜索
            pageData.pop();
          }

          pageData.push.apply(pageData, data.pageData); // 数组添加
          delete data.pageData;

          Object.assign(this.nowContentData, data, {loading: false, scrollLock: false});
          resolve(data);
        });
      });
    },

    // 阅卷项点击监听
    listenMarkingPerson(item) {
      // 先缓存到sessionStorage再跳转，
      // beforeRouteEnter钩子内读/删缓存
      sessionStorage.setItem('markingExam', JSON.stringify(
        Object.assign({}, this.nowContentData, this.searchBar)
      ));
      this.$router.push({name: 'marking_detail', params: {
        id: item.id
      }});
    },

    // 搜索框试卷监听
    listenToSearchBox(keyWord) {
      let searchBar = this.searchBar;
      if (searchBar.sessionKeyWord && searchBar.sessionKeyWord == searchBar.keyWord) {
        searchBar.sessionKeyWord = ''; // 这里是由于有搜索关键词，在路由时间钩子更改组件配置导致触发搜索
        // 所以只要跟缓存一样的keyword，就取消搜索，并初始化
        return;
      }
      // 滚动到顶部，避免触发加载更多
      window.scrollTo(0, 0);
      this.initData(); // 初始化数据
      this.searchBar.keyWord = keyWord;
      this._getManualDetailList(true);
    },

    // 初始化数据
    initData() {
      let initObj = {
        pageData: [],
        currPage: 0,
        maxPage: 1,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
        scrollTop: 0, // 滚动高度
      };

      this.manualPageData = Object.assign({}, initObj);
    },

    // 加载更多监听事件
    loadMoreList() {

      this._getManualDetailList();
    },

    // 滚动事件
    scrollList(e, ignoreTop=false) {
      let nowContentData = this.nowContentData;
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

      nowContentData.scrollTop = scrollTop; // 滚动高度赋值
      if (nowContentData.scrollLock || (!scrollTop && !ignoreTop)) return; // 锁定/在顶处/阅卷不用触发滚动

      if (scrollTop + window.innerHeight >= document.body.scrollHeight - 44) { // 44是loadmore高度
        nowContentData.scrollLock = true; // 防止滚动多次请求
        if (!nowContentData.loading && nowContentData.currPage < nowContentData.maxPage) {
          this.loadMoreList();
        }
      }
    },
  },

};

</script>

<style lang="scss" scoped>
@import '../../../static/css/mixin.scss';
.exam_marking_exam {

  /deep/ .qwui-search_wrap {
    position: fixed;
  }
  .person_content {
    padding-top: 43px; 

    .marking_person:not(:last-of-type) {
      @include border-b-1px(#E6E6E6);
    }
  }
  
  /deep/ {
    .icon_noData {
      display: inline-block;
      width: 130px;
      height: 130px;
      background: url('~assets/images/icon_noData.png') center no-repeat;
      background-size: cover;
    }

    .icon_noData_search {
      display: inline-block;
      width: 130px;
      height: 130px;
      background: url('~assets/images/img_comment_emptypage1@3x.png') center no-repeat;
      background-size: cover;
    }
  }

}

</style>
