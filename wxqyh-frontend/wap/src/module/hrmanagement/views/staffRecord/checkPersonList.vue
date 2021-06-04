<template>
  <div id="checkPersonList" class="wrap" v-windowscroll="scrollList">
    <!-- 搜索框 -->
    <div class="searchFixed mt10">
      <div class="qwui-search_box">
        <search-box
          :searchinput="searchBar"
          :placeholder="placeholder"
          @listenToSearchBox="showMsgFromSearchBox"
          @listenToClearInput="clearInputSearch"
        ></search-box>
      </div>
      <!-- 分数排序 -->
      <div class="qwui-search_sort" @click="getSortList"></div>
      <!-- 高级搜索 -->
      <div class="qwui-advance_search" @click="showAdvanceSearch"></div>
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
    <!-- 评分列表 -->
    <div class="qwui-checkMark_list">
      <ul class="qwui-list_box">
        <li
          class="qwui-list_item"
          v-for="(item, i) in markList"
          :key="i"
          @click="goUserList(item.userId)"
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
    <!-- 高级搜索窗口 -->
    <div class="qwui-side_wrap" :class="{'qwui-show_wrap':showSearchWrap}">
      <div class="qwui-form_box">
        <div class="qwui-title_desc">
          高级搜索
          <img
            class="qwui-close_button"
            src="~assets/images/icon_cross_1.png"
            @click="closeSearchBox"
          >
        </div>
        <div class="qwui-content_box">
          <div class="qwui_form_item">
            <p class="c999">部门</p>
            <div class="qwui_form_input">
              <input
                class="qwui-inp"
                type="text"
                v-model="params['searchValue.dept']"
                placeholder="请输入"
              >
            </div>
          </div>
          <div class="qwui_form_item">
            <p class="c999">职位</p>
            <div class="qwui_form_input">
              <input
                class="qwui-inp"
                type="text"
                v-model="params['searchValue.post']"
                placeholder="请输入"
              >
            </div>
          </div>
          <div class="qwui_form_item">
            <p class="c999">考核分数</p>
            <div class="qwui_form_input">
              <input type="text" class="qwui-sorce_input" v-model="params['searchValue.minScore']">
              <span class="qwui-text">至</span>
              <input type="text" class="qwui-sorce_input" v-model="params['searchValue.maxScore']">
            </div>
          </div>
        </div>
        <div class="qwui-footer">
          <div class="qwui-form_button">
            <span class="qwui-reset" @click="resetFormBox">重置</span>
            <span class="qwui-confirm" @click="confirmFormBox">确定</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getTargetPersonList } from "../../api/getData";
import searchBox from "@/components/base/search_box";
import NoRecord from "@/components/base/no_record";
import loadMore from "@/components/list/load_more";
export default {
  name: "checkPersonList",
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
      placeholder: "搜索人员名称",
      markList: [],
      params: {
        page: 1,
        pageSize: 20,
        markId: "",
        tempId: "",
        degree: "",
        "searchValue.name": "",
        "searchValue.dept": "",
        "searchValue.post": "",
        "searchValue.minScore": "",
        "searchValue.maxScore": "",
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
      lock_roll: true,
      hasrecord: {
        //无数据配置
        show: true,
        setTop: true,
        text: "暂无数据"
      },
      hasData: true,
      sortShow: false,
      showSearchWrap: false
    };
  },
  created() {
    this.params.markId = this.$route.query.markId;
    this.params.tempId = this.$route.query.tempId;
    this.params.degree = this.$route.query.degree;
    this.getPersonList();
  },
  methods: {
    showMsgFromSearchBox(inputKey) {
      this.params["searchValue.name"] = inputKey;
      this.params.page = 1;
      this.markList = [];
      this.getPersonList();
    },
    clearInputSearch() {
      this.showMsgFromSearchBox("");
    },
    sortClick(type) {
      this.params["searchValue.sortType"] = type;
      this.markList = [];
      this.getPersonList();
      this.sortShow = false;
    },
    getPersonList() {
      getTargetPersonList(this.params, data => {
        if (data.emplist) {
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
          // 格式化花名册头像
          //格式化头像
          for (var i = 0; i < data.emplist.length; i++) {
            if (
              data.emplist[i].headPic.length > 0 &&
              data.emplist[i].headPic != "0"
            ) {
              if (data.emplist[i].headPic.indexOf("http") < 0) {
                data.emplist[i].headPic =
                  _.compressURL + data.emplist[i].headPic;
              }
            }
          }
          this.markList = this.markList.concat(data.emplist);
          this.lock_roll = true;
        } else {
            this.loadMoreMes.hasMore = false
          this.hasData = false;
        }
      });
    },
    getSortList() {
      this.sortShow = !this.sortShow;
    },
    showAdvanceSearch() {
      this.showSearchWrap = true;
    },
    closeSearchBox() {
      this.showSearchWrap = false;
    },
    resetFormBox() {
      this.params["searchValue.dept"] = "";
      this.params["searchValue.post"] = "";
      this.params["searchValue.minScore"] = "";
      this.params["searchValue.maxScore"] = "";
      // this.markList = [];
      // this.getPersonList();
      // this.showSearchWrap = false;
    },
    confirmFormBox() {
      this.markList = [];
      this.getPersonList();
      this.showSearchWrap = false;
    },
    goUserList(userId) {
      this.$router.push({ path: "personalData", query: { empId: userId } });
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
          this.getPersonList(); // 请求列表数据
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
  #checkPersonList {
    .searchFixed {
      width: 740px !important;
    }
    .qwui-side_wrap {
      width: 740px !important;
    }
    .qwui-show_wrap {
      left: 50% !important;
      transform: translateX(-50%);
    }
  }
}
#checkPersonList {
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
    .qwui-search_sort {
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
    .qwui-advance_search {
      width: 24px;
      height: 40px;
      margin-right: 10px;
      background: url(~assets/images/ic_hanber.png) center no-repeat;
      background-size: 20px;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
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
  .qwui-side_wrap {
    width: 100%;
    height: 100%;
    background: #efeff4;
    position: fixed;
    top: 0;
    left: 100%;
    z-index: 999;
    transition: all 0.3s linear;
    .qwui-title_desc {
      position: relative;
      height: 45px;
      line-height: 45px;
      font-size: 16px;
      background: #fff;
      padding-left: 15px;
      .qwui-close_button {
        position: absolute;
        width: 18px;
        height: 18px;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
      }
    }
    .qwui-content_box {
      padding: 0 15px;
      .qwui_form_item {
        padding-top: 15px;
        font-size: 13px;
      }
      .qwui_form_input {
        text-align: center;
        margin-top: 5px;
        display: flex;
        input {
          width: 100%;
          height: 36px;
        }
        .qwui-sorce_input {
          width: 48%;
          padding-left: 5px;
          flex: 1;
        }
        .qwui-inp {
          padding-left: 5px;
        }
        .qwui-text {
          width: 4%;
          color: #666;
          line-height: 36px;
          text-align: center;
          margin: 0 10px;
          font-size: 16px;
        }
      }
    }
    .qwui-footer {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 8px 15px;
      background: #fff;
      text-align: center;
      .qwui-form_button {
        display: flex;
      }
      span {
        display: inline-block;
        height: 45px;
        border-radius: 5px;
        line-height: 45px;
        font-size: 16px;
        flex: 1;
      }
      .qwui-reset {
        color: rgba(51, 51, 51, 1);
        border: 1px solid #d6d5d6;
        margin-right: 15px;
        background: rgba(251, 250, 252, 1);
      }
      .qwui-confirm {
        background: #2f7dcd;
        color: #fff;
        border: 1px solid #2f7dcd;
      }
    }
  }
  .qwui-show_wrap {
    left: 0%;
    transition: all 0.3s linear;
  }
  .c999 {
    color: #999;
  }
}
</style>