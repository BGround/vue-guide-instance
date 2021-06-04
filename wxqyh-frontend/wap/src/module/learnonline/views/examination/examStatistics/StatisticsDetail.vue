<template>
  <div class="wrap exam_statistics_detail">
    <!-- 顶部 -->
    <header class="qwui-tips fixed_set_top">
      <!-- 搜索框 -->
      <search-box
        :searchinput="searchBar"
        @listenToSearchBox="listenToSearchBox"
        @listenToClearInput="listenToSearchBox('')"
      ></search-box>
    
      <!-- tab栏 -->
      <menu-tab-two
          :selectdata="selectData"
          @listenTabChange="listenToTab"
      ></menu-tab-two>
    </header>

    <!-- 统计列表数据 -->
    <div class="statistics_content">
      <statistics-person
        class="statistics_person"
        v-for="(item, index) in pageData"
        :key="index"
        :item="item"
      ></statistics-person>
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
      <span v-show="loadMoreShow">{{loadMoreStr}}</span>
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
import MenuTabTwo from '@/components/button/menu_tab_two'; // tab选项菜单公共组件
import NoRecord from '@/components/base/noRecord';    // 暂无数据公共组件
import LoadMore from '@/components/list/load_more';   // 加载更多公共组件
import StatisticsPerson from './components/StatisticsPerson';   // 阅卷项
import { getStatisticsAnswer, getStatisticsUnAnswer } from "../../../api/getData"; // 请求接口
export default {
  name: 'StatisticsDetail',
  components: {
    SearchBox,
    MenuTabTwo,
    NoRecord,
    LoadMore,
    StatisticsPerson,
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
      searchBar: { // 搜索栏配置
        keyWord: '',
      },
      selectData: { // tab栏配置
        index: 0,
        scroll: false,//是否开启滚动置顶功能
        nav: [
          {content: this.$t('i18n.all')},
          {content: this.$t('i18n.notPass')},
        ]
      },

      /* 数据项 */
      notPassPageData: { // 已考/未通过列表数据
        pageData: [],
        currPage: 0,
        maxPage: 1,
        totalRows: 0,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
      },
      unAnswerPageData: { // 未考列表数据
        pageData: [],
        currPage: 0,
        maxPage: 1,
        totalRows: 0,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
      },
      allPageData: { // 全部列表数据
        pageData: [],
        currPage: 0,
        maxPage: 1,
        totalRows: 0,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
      },
     
      examId: '', // 考试id
      isOpen: 0, // 是否外部考试

    };
  },
  computed: {
    // 当前下标，用来tab切换显示
    nowTabIndex() {
      return this.selectData.index;
    },
    // 当前使用的数据，统一方式，便于理解和维护多个文件
    nowContentData() {
      let nowTabIndex = this.nowTabIndex;
      if (nowTabIndex) {return nowTabIndex == 1? this.notPassPageData: this.unAnswerPageData;}

      // 全部
      let notPass = this.notPassPageData;
      let unAnswer = this.unAnswerPageData;

      let allPageData = { // 全部考试数据
        pageData: notPass.pageData.concat(unAnswer.pageData),
        currPage: notPass.currPage + unAnswer.currPage,
        maxPage: notPass.maxPage + unAnswer.maxPage,
        totalRows: notPass.totalRows + unAnswer.totalRows,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
      };
      this.allPageData = Object.assign({}, this.allPageData, allPageData); // 直接继承更改data内数据    
      return this.allPageData;
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
    },
    loadMoreStr() { // 加载更多底部提示
      return  `${this.$t('i18n.total')}${this.nowContentData.totalRows} ${this.$t('i18n.test')}`;
    },

  },
  created() {
    this.examId = this.$route.params.id;
    this.isOpen = parseInt(this.$route.params.isOpen);
    // 内部的，tab栏需要未考试项
    this.isOpen || this.selectData.nav.push({content: this.$t('i18n.notExam')})

    // 添加滚动事件
    window.addEventListener('scroll', this.scrollList);

    this.getData();
  },
  mounted() {
  },
  beforeDestroy() {
    // 移除滚动事件，避免其他页面触发
    window.removeEventListener('scroll', this.scrollList);
  },
  methods:{
    // 获取数据, 根据条件自动请求对应数据
    getData() {
      let nowTabIndex = this.nowTabIndex;
      let notPassPageData = this.notPassPageData; // 在tab0 全部中充当已考数据 
      let currPage = notPassPageData.currPage;
      let maxPage = notPassPageData.maxPage

      // tab为0即全部 且 已考数据未加载完，则加载已考的
      if (!nowTabIndex && !notPassPageData.currPage) {
        return this._getStatisticsAnswer().then((data) => {
          // 在首次加载全部数据，如果已考的数据小于10项，则需要继续加载未考的
          // 这时判断是否已考已经加载完 且 加载完小于10项则继续请求未考的
          if (data.totalRows < 10) {this.getData();}
        });
      }

      return  nowTabIndex == 1? this._getStatisticsAnswer(0): // tab为1加载未通过的
                                this._getStatisticsUnAnswer(); // 其他情况都是加载未考的
    },

    // 获取已考数据 isPass
    _getStatisticsAnswer(isPass=undefined) {
      return new Promise((resolve, reject) => {
        getStatisticsAnswer({
          examId: this.examId,
          page: this.notPassPageData.currPage + 1,// 不用++i 因为原数据不需要变动
          'searchValue.keyword': this.searchBar.keyWord,
          'searchValue.isPass': isPass
        }, data => {
          let pageData = this.notPassPageData.pageData;

          pageData.push.apply(pageData, data.pageData); // 数组添加
          delete data.pageData;

          Object.assign(this.notPassPageData, data, {loading: false, scrollLock: false});
          resolve(data);
        });
      });
    },
    // 获取未考数据
    _getStatisticsUnAnswer() {
      return new Promise((resolve, reject) => {
        getStatisticsUnAnswer({
          examId: this.examId,
          page: this.unAnswerPageData.currPage + 1,// 不用++i 因为原数据不需要变动
          'searchValue.keyword': this.searchBar.keyWord
        }, data => {
          let pageData = this.unAnswerPageData.pageData;

          pageData.push.apply(pageData, data.pageData); // 数组添加
          delete data.pageData;

          Object.assign(this.unAnswerPageData, data, {loading: false, scrollLock: false});
          resolve(data);
        });
      });
    },

    // 初始化数据(主要用于切换列表旧数据不要显示)
    initData() {
      let nowTabIndex = this.nowTabIndex;
      let initObj = {
        pageData: [],
        currPage: 0,
        maxPage: 1,
        totalRows: 0,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
      };

      if (nowTabIndex != 1) { // tab非未通过都得初始化未考试（全部、未考试都有此数据）
        this.unAnswerPageData = Object.assign({}, initObj);
      }
      if (nowTabIndex != 2) { // tab非未考试都得初始化未考试（全部、未通过都有此数据）
        this.notPassPageData = Object.assign({}, JSON.parse(JSON.stringify(initObj))); // 副本
      }
    },

    // 监听搜索框
    listenToSearchBox(keyWord) {
      if (!keyWord && !this.searchBar.keyWord) {return;} // 都为空则无需搜索
      // 滚动到顶部，避免触发加载更多
      window.scrollTo(0, 0);
      this.initData(); // 初始化数据
      this.searchBar.keyWord = keyWord;
      this.getData();
    },

    // 监听tab栏切换
    listenToTab() {
      // 滚动到顶部，避免触发加载更多
      window.scrollTo(0, 0);
      this.initData(); // 初始化数据
      this.getData();
    },

    // 加载更多监听事件
    loadMoreList() {
      this.getData();
    },

    // 滚动事件
    scrollList(e, ignoreTop=false) {
      let nowContentData = this.nowContentData;
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

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
.exam_statistics_detail {
  background: #fff;

  .statistics_content {
    padding: 87px 10px 0;
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
