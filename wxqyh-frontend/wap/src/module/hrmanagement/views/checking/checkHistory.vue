<template>
  <div id="checkHistory" class="wrap">
    <!-- 搜索框 -->
    <div class="searchFixed mt10">
      <search-box
        :searchinput="searchBar"
        :placeholder="placeholder"
        @listenToSearchBox="showMsgFromSearchBox"
        @listenToClearInput="clearInputSearch"
      ></search-box>
    </div>
    <div class="fixedHeight"></div>
    <!-- 历史列表 -->
    <div class="qwui-history_list">
      <ul class="qwui-list_box">
        <li
          class="qwui-list_item"
          v-for="(item, i) in historyList"
          :key="i"
          @click="goTargetList(item.id,item.status)"
        >
          <p class="qwui-mark_title">{{item.name}}</p>
          <p
            class="qwui-date"
          >{{item.startTime.substring(5, 16)}} 至 {{item.endTime.substring(5, 16)}}</p>
          <p class="qwui-description" v-if="params['searchValue.status'] == 1">
            <span class="qwui-mark_type status_green" v-if="item.status == '1'">进行中</span>
            <span class="qwui-mark_type status_gray" v-if="item.status == '2'">已结束</span>
            已评分：
            <span class="qwui-wattingNum">{{item.count}}人</span>
          </p>
          <p v-else class="qwui-description red">待评分：{{item.count}}人</p>
        </li>
      </ul>
    </div>
    <!--无数据-->
    <no-record v-if="!hasData" :hasrecord="hasrecord"></no-record>
    <!--更多数据-->
    <load-more v-bind="loadMoreMes"></load-more>
  </div>
</template>
<script>
import { findMarkList } from "../../api/getData";
import searchBox from "@/components/base/search_box";
import NoRecord from "@/components/base/no_record";
import loadMore from "@/components/list/load_more";
export default {
  name: "checkHistory",
  components: {
    searchBox,
    NoRecord,
    loadMore
  },
  data() {
    return {
      searchBar: {
        show: true //显示搜索框
      },
      placeholder: "搜索名称",
      historyList: [],
      params: {
        page: 1,
        pageSize: 20,
        "searchValue.name": "",
        "searchValue.status": "1"
      },
      getMoreData: {}, //加载数据请求配置
      loadMoreMes: {
        // 加载更多配置
        loading: false,
        hasMore: false,
        type: "commentList",
        loadMoreDesc:'向上滑动加载更多'
      },
      lock_roll: true,
      hasrecord: {
        //无数据配置
        show: true,
        setTop: true,
        text: "暂无数据"
      },
      hasData: true
    };
  },
  created() {
    this.params["searchValue.status"] = this.$route.query.status;
    this.getHistoryList();
    window.addEventListener("scroll",this.scrollList);
  },
  methods: {
    showMsgFromSearchBox(inputKey) {
      this.params["searchValue.name"] = inputKey;
      this.params.page = 1;
      this.historyList = [];
      this.getHistoryList();
    },
    clearInputSearch() {
      this.showMsgFromSearchBox("");
    },
    getHistoryList() {
      findMarkList(this.params, data => {
        if (data.pageData) {
          this.hasData = true;
           //是否还有更多数据
          if(data.currPage < data.maxPage) {
            this.loadMoreMes.hasMore = true
          }else {
            this.loadMoreMes.hasMore = true
            this.loadMoreMes.loadMoreDesc = '已没有更多'
          }
          this.getMoreData.currPage = data.currPage; //当前页面数
          this.getMoreData.maxPage = data.maxPage; // 最大页面数
          this.historyList = this.historyList.concat(data.pageData);
          this.lock_roll = true
        } else {
            this.loadMoreMes.hasMore = false
          this.hasData = false;
        }
      });
    },
    goTargetList(id, markStatus) {
      let status;
      if (this.$route.query.status == "1") {
        status = "1";
      } else {
        status = "0";
      }
      this.$router.push({
        path: "checkMarkList",
        query: { markId: id, markStatus: markStatus, status: status }
      });
      // window.location.href = _.baseURL + '/jsp/wap/hrmanagement/xent/mark/mark_target_list.jsp?status='+ status + '&markStatus=' + markStatus + '&markId=' + id
    },
    //加载更多
    scrollList() {
      let scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      if (
        scrollTop + document.documentElement.clientHeight >=
        document.body.scrollHeight
      ) {
        if (
          this.lock_roll &&
          this.getMoreData.currPage < this.getMoreData.maxPage
        ) {
          this.loadMoreMes.loading = true;
          this.lock_roll = false;
          this.params.page = this.getMoreData.currPage + 1;
          this.getHistoryList(); // 请求列表数据
        }
      } else {
        this.loadMoreMes.loading = false;
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollList);
  }
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1024px) {
  #checkHistory {
    .searchFixed {
      width: 740px !important;
    }
  }
}
#checkHistory {
  .searchFixed {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  }
  .fixedHeight {
    height: 43px;
  }
  .qwui-list_box {
    font-size: 16px;
  }
  .qwui-list_item {
    line-height: 2.2;
    padding: 10px 15px;
    border-bottom: 1px solid #dfdfdd;
    p {
      line-height: 1.4;
    }
  }
  .qwui-date {
    font-size: 13px;
    color: #999;
  }
  .qwui-description {
    font-size: 14px;
    color: #999;
    .qwui-mark_type {
      display: inline-block;
      line-height: 1;
      padding: 2px;
      margin-right: 10px;
      font-size: 12px;
      vertical-align: middle;
      text-align: center;
      border-radius: 2px;
    }
    .status_green {
      border: 1px solid #1aad19;
      color: #1aad19;
    }
    .status_gray {
      border: 1px solid #666;
      color: #333333;
    }
  }
  .red {
    color: red;
  }
}
</style>