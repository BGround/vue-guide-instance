<template>
  <div class="wrap exam_marking_record">

    <!-- 阅卷列表数据 -->
    <div class="exam_content">
      <marking-item
        class="exam_item"
        v-for="(item, index) in pageData"
        :key="index"
        v-bind="item"
        @clickItem="listenMarkingItem"
      ></marking-item>
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
      v-show="hasRecord.show"
      :hasRecord="hasRecord"
    ></no-record>
  </div>
</template>


<script>
import NoRecord from '@/components/base/noRecord';    // 暂无数据公共组件
import LoadMore from '@/components/list/load_more';   // 加载更多公共组件
import MarkingItem from './components/MarkingItem';   // 阅卷项
import { getManualList } from "../../../api/getData"; // 请求接口
export default {
  name: 'MarkingRecord',
  components: {
    NoRecord,
    LoadMore,
    MarkingItem,
  },
  filters: {
  },
  data(){
    return {
      /* 公共组件配置项 */
      hasRecordCommon: { // 无数据配置
        setTop: true,
        icon: 'icon_noData',
        title: this.$t('i18n.noRecord'),
        text: '',
      },

      /* 数据项 */
      manualPageData: { // 阅卷列表数据
        pageData: [],
        currPage: 0,
        maxPage: 1,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
        scrollTop: 0, // 滚动高度
      },

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
    hasRecord() {
      return Object.assign({}, this.hasRecordCommon, {
        // 请求后为第一页。 可以避免初始化时渲染无数据页
        show: !this.pageData.length && this.nowContentData.currPage
      })
    },
    loadMoreShow() {
      return !this.hasRecord.show && this.pageData.length
    }

  },
  created() {
    // 添加滚动事件
    window.addEventListener('scroll', this.scrollList);
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 缓存数据获取
      let sessData = JSON.parse(sessionStorage.getItem('markingRecord'));

      // 从阅卷试卷页返回，则读取缓存数据
      if (from.name == 'marking_exam' && sessData) {
        // 读取缓存
        vm.manualPageData = Object.assign({}, sessData);
      } else {
        // 请求阅卷列表数据
        vm._getManualList();
      }

      // 清掉缓存
      sessionStorage.removeItem('markingRecord');
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
    // 获取阅卷列表数据
    _getManualList() {
      return new Promise((resolve, reject) => {
        getManualList({
          page: this.nowContentData.currPage + 1 // 不用++i 因为原数据不需要变动
        }, data => {
          let pageData = this.pageData;
          pageData.push.apply(pageData, data.pageData); // 数组添加
          delete data.pageData;

          Object.assign(this.nowContentData, data, {loading: false, scrollLock: false});
          resolve(data);
        });
      });
    },

    // 阅卷项点击监听
    listenMarkingItem(item) {
      // 有阅卷份数才需要跳转
      if (!item.manualCount) {return;}

      // 先缓存到sessionStorage再跳转，
      // beforeRouteEnter钩子内读/删缓存
      sessionStorage.setItem('markingRecord', JSON.stringify(this.nowContentData));
      this.$router.push({name: 'marking_exam', params: {
        id: item.id
      }});
        
    },



    // 加载更多监听事件
    loadMoreList() {
      this._getManualList();
    },

    // 滚动事件
    scrollList() {
      let nowContentData = this.nowContentData;
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;

      nowContentData.scrollTop = scrollTop; // 滚动高度赋值
      if (nowContentData.scrollLock || !scrollTop) return; // 锁定/在顶处/阅卷不用触发滚动

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
.exam_marking_record {

  .exam_content {

    .exam_item:not(:last-of-type) {
      @include border-b-1px(#E6E6E6);
    }
  }

  /deep/ .icon_noData {
    display: inline-block;
    width: 130px;
    height: 130px;
    background: url('~assets/images/icon_noData.png') center no-repeat;
    background-size: cover;
  }
}

</style>
