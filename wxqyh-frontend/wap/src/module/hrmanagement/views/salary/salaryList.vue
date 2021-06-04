<template>
  <div id="salaryList" class="wrap" v-windowscroll="scrollList">
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
    <!-- 工资条列表 -->
    <div class="qwui-list_box">
      <ul>
        <li class="qwui-list_item" v-for="(item, i) in salaryList" :key="i" @click="goToWageDetail(item.id)">
          <p class="qwui-title">{{item.name}}</p>
          <p class="qwui-time">{{item.sendTime.substring(0,16)}}</p>
          <div class="qwui-details">详情</div>
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
import { getDetailList } from "../../api/getData";
import searchBox from "@/components/base/search_box";
import NoRecord from "@/components/base/no_record";
import loadMore from "@/components/list/load_more";
export default {
  name: "salaryList",
  components: {
    searchBox,
    loadMore,
    NoRecord
  },
  data() {
    return {
      searchBar: {
        show: true //显示搜索框
      },
      placeholder: "搜索",
      salaryList: [],
      params: {
        page: 1,
        size: 10,
        "searchValue.title": ""
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
    this.getSalaryList();
  },
  methods: {
    showMsgFromSearchBox(inputKey) {
      this.params["searchValue.title"] = inputKey;
      this.params.page = 1;
      this.salaryList = [];
      this.getSalaryList();
    },
    clearInputSearch() {
      this.showMsgFromSearchBox("");
    },
    getSalaryList() {
      getDetailList(this.params, data => {
        if (data.pageData) {
          data.currPage < data.maxPage
            ? (this.loadMoreMes.hasMore = true)
            : (this.loadMoreMes.hasMore = false); //是否还有更多数据
          this.getMoreData.currPage = data.currPage; //当前页面数
          this.getMoreData.maxPage = data.maxPage; // 最大页面数
          this.salaryList = this.salaryList.concat(data.pageData);
          this.lock_roll = true;
        } else {
          this.hasData = false;
        }
      });
    },
    goToWageDetail(id) {
      // window.location.href =
      //   _.baseURL +
      //   "/jsp/wap/dynamicinfoManage/private_detail.jsp?id=" +
      //   id +
      //   "&belongAgent=dynamic";
        this.$router.push({path:'salaryDetails',query:{id:id,belongAgent:'hrmanagement'}})
    },
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
          this.getSalaryList(); // 请求列表数据
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
  #salaryList {
    .searchFixed {
      width: 740px !important;
    }
  }
}
#salaryList {
  background: #f5f5f5;
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
    padding: 0 15px 20px;
    .qwui-list_item {
      margin-top: 15px;
      background: white;
      box-shadow: 0 0 1px 1px #e8e8e8;
      color: #000;
      padding: 15px 10px 0;
      &:hover {
        box-shadow: 0 0 0 0 #fff;
      }
      .qwui-title {
        line-height: 1.2;
        font-size: 17px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .qwui-time {
        padding: 10px 0 15px;
        font-size: 13px;
        color: #999;
      }
      .qwui-details {
        position: relative;
        line-height: 1;
        padding: 11px 0;
        border-top: 1px solid #e5e5e5;
        &::after {
          content: " ";
          display: inline-block;
          position: absolute;
          top: 14px;
          right: 0;
          width: 6px;
          height: 6px;
          border-width: 2px 2px 0 0;
          border-color: #c8c8cd;
          border-style: solid;
          transform: rotate(45deg);
        }
      }
    }
  }
}
</style>