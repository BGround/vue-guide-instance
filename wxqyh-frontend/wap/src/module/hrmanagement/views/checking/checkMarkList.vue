<template>
  <div id="checkMarkList" v-windowscroll="scrollList" class="wrap">
    <!-- 搜索框 -->
    <div class="searchFixed mt10">
      <div class="qwui-search_box" :class="{'w100':showSortTabStatus == '0'}">
        <search-box
          :searchinput="searchBar"
          :placeholder="placeholder"
          @listenToSearchBox="showMsgFromSearchBox"
          @listenToClearInput="clearInputSearch"
        ></search-box>
      </div>
      <!-- 分数排序 -->
      <div class="qwui-search_sort" @click="getSortList" v-show="showSortTabStatus == '1'"></div>
      <!-- 排序列表 -->
      <div class="qwui-sort_type" v-show="sortShow">
        <ul class="qwui-sort_type_list">
          <li @click="sortClick('asc')">
            分数
            <i class="arrow_up"></i>
          </li>
          <li @click="sortClick('desc')">
            分数
            <i class="arrow_down"></i>
          </li>
        </ul>
      </div>
    </div>
    <div class="fixedHeight"></div>
    <!-- tab栏 -->
    <nav-tabs
      v-if="showTabs"
      :tabs="tabs"
      :activeIndex="indexControl"
      @listenNavTabs="listenNavTabsBack"
      :numShow="true"
      :numHeight="'num'"
    >
      <div slot="height" style="height:10px;"></div>
    </nav-tabs>
    <!-- 流程 -->
    <div class="flow" v-if="showFlow">
      <div class="title_desc">评分流程</div>
      <div class="content">
        <step :currentNodes="currentNode" :flowList="flowList"></step>
      </div>
    </div>
    <!-- 评分列表 -->
    <div class="qwui-checkMark_list">
      <ul class="qwui-list_box">
        <li
          class="qwui-list_item"
          v-for="(item, i) in markList"
          :key="i"
          @click="goCheckMark(item.status,item.id,item.refId,item.flownodeId)"
        >
          <img v-if="item.headPic!='0'&& item.headPic!=''" :src="item.headPic" class="headPic">
          <img v-else src="~assets/images/icon_person.png" alt>
          <div class="qwui-content">
            <p class="qwui-name">{{item.personName}}</p>
            <p class="qwui-dept">{{item.departmentName}} &nbsp;{{item.position}}</p>
            <p
              class="qwui-score"
              v-if="item.totalScore != '' && (item.status == '1' || item.status == '2')"
            >考核总分：{{item.totalScore}}分</p>
          </div>
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
import {
  pageFindMarkTarget,
  checkIsMark,
  findFlowByMarkId
} from "../../api/getData";
import searchBox from "@/components/base/search_box";
import NoRecord from "@/components/base/no_record";
import loadMore from "@/components/list/load_more";
import navTabs from "@/components/base/nav_tabs";
import step from "./step";
export default {
  name: "checkMarkList",
  components: {
    searchBox,
    NoRecord,
    loadMore,
    navTabs,
    step
  },
  data() {
    return {
      searchBar: {
        show: true //显示搜索框
      },
      placeholder: "搜索姓名",
      showTabs: false,
      indexControl: 0, //tab默认选中项
      markList: [],
      params: {
        page: 1,
        pageSize: 20,
        markId: "",
        flownodeId: "",
        "searchValue.personName": "",
        "searchValue.status": "1",
        "searchValue.sort": "total_score",
        "searchValue.sortType": "desc"
      },
      getMoreData: {}, //加载数据请求配置
      loadMoreMes: {
        // 加载更多配置
        loading: false,
        hasMore: false,
        type: "commentList"
      },
      lock_roll: true, //列表加载请求是否结束
      hasrecord: {
        //无数据配置
        show: true,
        setTop: true,
        text: "暂无数据"
      },
      hasData: true,
      sortShow: false,
      markNum: 0,
      noMarkNum: 0,
      showSortTabStatus: "1",
      showFlow: false,
      currentNode: "",
      flowList: [],
      flowId: ""
    };
  },
  created() {
    this.params.markId = this.$route.query.markId;
    this.params["searchValue.status"] = this.$route.query.status;
    if (this.$route.query.markStatus == "2") {
      this.showTabs = true;
      this.getMarkNum();
      this.getMarkList();
    } else if (this.$route.query.markStatus == "1" && this.$route.query.status == "1") {
      this.showTabs = false;
      this.getMarkList();
    }else if(this.$route.query.markStatus == "1" && this.$route.query.status == "0") {
      this.flow();
    }
    //显示排序
    if (this.$route.query.status == "0") {
      this.showSortTabStatus = "0";
    } else if (this.$route.query.status == "1") {
      this.showSortTabStatus = "1";
    }
  },
  computed: {
    tabs() {
      let numArr = [
        //tab栏
        { text: `已评分 ${this.markNum}` },
        { text: `未评分 ${this.noMarkNum}` }
      ];
      return numArr;
    }
  },
  methods: {
    //考评流程
    flow() {
      findFlowByMarkId({ markId: this.$route.query.markId }, data => {
        if (data.isOrder == 1) {
          this.showFlow = true;
          this.currentNode = data.currentNode.flowOrder;
          this.flowList = data.flownodes;
          this.params.flownodeId = data.currentNode.id;
          this.getMarkList();
        } else {
          this.showFlow = false;
          this.params.flownodeId = "";
          this.getMarkList();
        }
      });
    },
    showMsgFromSearchBox(inputKey) {
      this.params["searchValue.personName"] = inputKey;
      this.params.page = 1;
      this.markList = [];
      this.getMarkList();
      this.getMarkNum(inputKey);
    },
    clearInputSearch() {
      this.showMsgFromSearchBox("");
    },
    sortClick(type) {
      this.params["searchValue.sortType"] = type;
      this.markList = [];
      this.getMarkList();
      this.sortShow = false;
    },
    getSortList() {
      this.sortShow = !this.sortShow;
    },
    getMarkList() {
      pageFindMarkTarget(this.params, data => {
        this.params["searchValue.status"] == 1
          ? (this.markNum = data.totalRows)
          : (this.noMarkNum = data.totalRows);
        if (data.pageData) {
          this.hasData = true;
          //是否还有更多数据
          if (data.currPage < data.maxPage) {
            this.loadMoreMes.hasMore = true;
          } else {
            this.loadMoreMes.hasMore = true;
            this.loadMoreMes.loadMoreDesc = "已没有更多";
          }
          this.getMoreData.currPage = data.currPage; //当前页面数
          this.getMoreData.maxPage = data.maxPage; // 最大页面数
          // 格式化花名册头像
          //格式化头像
          for (var i = 0; i < data.pageData.length; i++) {
            if (
              data.pageData[i].headPic.length > 0 &&
              data.pageData[i].headPic != "0"
            ) {
              if (data.pageData[i].headPic.indexOf("http") < 0) {
                data.pageData[i].headPic =
                  _.compressURL + data.pageData[i].headPic;
              }
            }
          }
          this.markList = this.markList.concat(data.pageData);
          this.lock_roll = true;
        } else {
          this.loadMoreMes.hasMore = false;
          this.hasData = false;
        }
      });
    },
    // 加载评分人数
    getMarkNum(inputKey) {
      if (inputKey == undefined) {
        inputKey = "";
      }
      let params = {
        page: 1,
        pageSize: 20,
        markId: this.$route.query.markId,
        flownodeId: "",
        "searchValue.personName": inputKey,
        "searchValue.status": "0",
        "searchValue.sort": "total_score",
        "searchValue.sortType": "desc"
      };
      pageFindMarkTarget(params, data => {
        this.noMarkNum = data.totalRows;
      });
    },
    listenNavTabsBack(index) {
      this.markList = [];
      this.params.page = 1;
      if (index == 0) {
        this.params["searchValue.status"] = "1";
        this.showSortTabStatus = "1";
      } else {
        this.params["searchValue.status"] = "0";
        this.showSortTabStatus = "0";
      }
      this.getMarkList();
    },
    //跳转评分页
    goCheckMark(status, id, refId, flownodeId) {
      switch (status) {
        case "0":
          this.$router.push({
            path: "doCheckMark",
            query: {
              targetId: id,
              markStatus: this.$route.query.markStatus,
              status: this.$route.query.status,
              flownodeId: flownodeId,
              refId: refId
            }
          });
          break;
        case "1":
          this.$router.push({ path: "checkMark", query: { targetId: id,refId: refId } });
          break;
        case "2":
          checkIsMark(id, data => {
            if (result.data.isMark) {
              this.$router.push({ path: "checkMark", query: { targetId: id,refId: refId } });
            } else {
              this.$router.push({
                path: "doCheckMark",
                query: {
                  targetId: id,
                  markStatus: this.$route.query.markStatus,
                  status: this.$route.query.status,
                  flownodeId: flownodeId,
                  refId: refId
                }
              });
            }
          });
          break;
      }
      let url;
      switch (status) {
        case "0":
          url =
            _.baseURL +
            "/jsp/wap/hrmanagement/xent/mark/do_mark.jsp?targetId=" +
            id +
            "&markStatus=" +
            this.$route.query.markStatus +
            "&status=" +
            this.$route.query.status;
          break;
        case "1":
          url =
            _.baseURL +
            "/jsp/wap/hrmanagement/xent/mark/mark_detail.jsp?targetId=" +
            id;
          break;
        case "2":
          checkIsMark(id, data => {
            if (result.data.isMark) {
              url =
                _.baseURL +
                "/jsp/wap/hrmanagement/xent/mark/mark_detail.jsp?targetId=" +
                id;
            } else {
              url =
                _.baseURL +
                "/jsp/wap/hrmanagement/xent/mark/do_mark.jsp?targetId=" +
                id +
                "&markStatus=" +
                this.$route.query.markStatus +
                "&status=" +
                this.$route.query.status;
            }
          });
          break;
      }
      // window.location.href = url;
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
          this.getMarkList(); // 请求列表数据
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
  #checkMarkList {
    .searchFixed {
      width: 740px !important;
    }
  }
}
#checkMarkList {
  .searchFixed {
    display: flex;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
    background: #fff;
    .qwui-search_box {
      flex: 1;
    }
    .w100 {
      width: 100%;
    }
    .qwui-search_sort {
      float: right;
      width: 24px;
      height: 40px;
      margin-right: 10px;
      background: url(~assets/images/ic_sort.png) center no-repeat;
      background-size: 20px;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .qwui-sort_type {
      position: absolute;
      right: 5px;
      top: 42px;
      z-index: 2;
      .qwui-sort_type_list {
        width: 93px;
        border: 1px solid #ddd;
        border-radius: 3px;
        background: #fff;
        li {
          height: 39px;
          line-height: 40px;
          border-bottom: 1px solid #ddd;
          color: #666;
          text-align: center;
          i {
            display: inline-block;
            width: 12px;
            height: 12px;
            margin-left: 5px;
          }
          .arrow_up {
            background: url(~assets/images/arrow_up.png) no-repeat;
            background-size: 11px;
          }
          .arrow_down {
            background: url(~assets/images/arrow_down.png) no-repeat;
            background-size: 11px;
          }
        }
      }
    }
  }
  .fixedHeight {
    height: 43px;
  }
  .qwui-list_item {
    padding: 10px 15px;
    border-bottom: 1px solid #dfdfdd;
    img {
      float: left;
      width: 38px;
      height: 38px;
      margin-right: 10px;
    }
    .qwui-content {
      overflow: hidden;
      line-height: 1.4;
      .qwui-name {
        margin-bottom: 6px;
        line-height: 1;
        font-size: 16px;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        word-wrap: normal;
        text-overflow: ellipsis;
      }
      .qwui-dept {
        font-size: 13px;
        color: #999;
        margin-bottom: 2px;
        white-space: nowrap;
        word-wrap: normal;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .qwui-score {
        font-size: 13px;
        color: #999999;
        margin-bottom: 3px;
      }
    }
  }
  .flow {
    .title_desc {
      position: relative;
      height: 30px;
      line-height: 30px;
      padding: 10px 0px 10px 27px;
      font-size: 14px;
      color: #0a1735;
      &::after {
        position: absolute;
        content: "";
        top: 50%;
        left: 15px;
        transform: translateY(-50%);
        width: 3px;
        height: 14px;
        background-color: #5684f0;
        border-radius: 2px;
      }
    }
  }
}
</style>