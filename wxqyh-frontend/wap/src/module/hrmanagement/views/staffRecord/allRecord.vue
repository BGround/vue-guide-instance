<template>
  <div id="allRecord" v-windowscroll="scrollList" class="wrap">
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
    <!-- 档案列表 -->
    <div class="qwui-record_list">
      <ul class="qwui-list_box">
        <li
          class="qwui-list_item"
          v-for="(item, i) in recordList"
          :key="i"
          @click="goTargetList(item.id,item.templateId)"
        >
          <p class="qwui-mark_title">{{item.name}}</p>
          <p
            class="qwui-date"
          >{{item.startTime.substring(5, 16)}} 至 {{item.endTime.substring(5, 16)}}</p>
          <p class="qwui-description red">已完成评分：{{item.count}}人</p>
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
import { findResultMarkList } from "../../api/getData";
import searchBox from "@/components/base/search_box";
import NoRecord from "@/components/base/no_record";
import loadMore from "@/components/list/load_more";
export default {
  name: "allRecord",
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
      recordList: [],
      params: {
        page: 1,
        pageSize: 20,
        "searchValue.name": ""
      },
      getMoreData: {}, //加载数据请求配置
      loadMoreMes: {
        // 加载更多配置
        loading: false,
        hasMore: false,
        type: "commentList"
      },
      lock_roll: true,
      hasrecord: {
        //无数据配置
        show: true,
        setTop: true
      },
      hasData: true
    };
  },
  created() {
    this.getRecordList();
  },
  methods: {
    showMsgFromSearchBox(inputKey) {
      this.params["searchValue.name"] = inputKey;
      this.params.page = 1;
      this.recordList = [];
      this.getRecordList();
    },
    clearInputSearch() {
      this.showMsgFromSearchBox("");
    },
    getRecordList() {
      findResultMarkList(this.params, data => {
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
          this.recordList = this.recordList.concat(data.pageData);
          this.lock_roll = true;
        } else {
            this.loadMoreMes.hasMore = false
          this.hasData = false;
        }
      });
    },
    goTargetList(id, templateId) {
      this.$router.push({
        path: "checkResult",
        query: { markId: id, tempId: templateId }
      });
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
          this.getRecordList(); // 请求列表数据
        }
      } else {
        this.loadMoreMes.loading = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1024px) {
  #allRecord {
    .searchFixed {
      width: 740px !important;
    }
  }
}
#allRecord {
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
  .qwui-mark_title {
    margin-bottom: 6px;
  }
  .qwui-date {
    font-size: 13px;
    color: #999;
    margin-bottom: 2px;
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
  }
}
</style>