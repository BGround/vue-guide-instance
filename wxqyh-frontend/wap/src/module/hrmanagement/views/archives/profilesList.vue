<template>
  <div id="profilesList" class="wrap">
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
      <!-- 字母排序 -->
      <div class="qwui-letter_list" @click="showLetterList"></div>
      <!-- 字母列表 -->
      <div class="qwui-letter_box" v-show="showLetterBox">
        <ul>
          <li
            class="qwui-letter_item"
            v-for="(item,i) in letterArry"
            :key="i"
            @click="letterSearch(item)"
          >{{item}}</li>
        </ul>
      </div>
    </div>
    <div class="fixedHeight"></div>
    <!-- 返回 -->
    <div class="goBack">
      <span>返回上一级</span>
    </div>
    <!-- 部门列表 -->
    <div class="qwui-dept_list">
      <ul>
        <li class="qwui-dept_listItem" v-for="(item, i) in childDeptList" :key="i">
          <span class="name">{{item.departmentName}}</span>
          <span class="count">{{item.totalUser}}</span>
        </li>
      </ul>
    </div>
    <!-- 无部门成员列表 -->
    <div class="qwui-empty_user">
      <ul>
        <li class="qwui-user_listItem" v-for="(item, i) in emptyUserList" :key="i">
          <img v-if="item.headPic!='0'&& item.headPic!=''" :src="item.headPic" class="headPic">
          <img class="headPic" v-else src="~assets/images/icon_person.png" alt>
          <div class="qwui-user_desc">
            <p class="qwui-name">
              {{item.personName}}
              <i
                class="sex_icon"
                :class="{'male':item.sex == '1','female':item == '2'}"
              ></i>
            </p>
            <p class="qwui-dept_name">
              {{item.deptName}}
              <i v-if="item.positionName != ''">/{{item.positionName}}</i>
            </p>
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
import { listEmployeeUnderDept, getChildDeptList } from "../../api/getData";
import searchBox from "@/components/base/search_box";
import NoRecord from "@/components/base/no_record";
import loadMore from "@/components/list/load_more";
export default {
  name: "profilesList",
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
      showLetterBox: false,
      letterArry: [
        // 字母表
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "*"
      ],
      // 子部门请求数据
      params: {
        deptId: ""
      },
      // 五部门请求数据
      emptyUserParams: {
        rootDept: "",
        page: 1,
        nmp: ""
      },
      childDeptList: [],
      emptyUserList: [],
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
      hasData: true
    };
  },
  created() {
    this.params.deptId = this.$route.query.deptId;
    this.emptyUserParams.rootDept = this.$route.query.deptId;
    this._getChildDeptList();
    this._listEmployeeUnderDept();
  },
  methods: {
    showMsgFromSearchBox(inputKey) {
      this.emptyUserParams["nmp"] = inputKey;
      this.emptyUserParams.page = 1;
      this.childDeptList = [];
      this.emptyUserList = [];
      if (inputKey == "") {
        this._getChildDeptList();
      }
      this._listEmployeeUnderDept();
    },
    clearInputSearch() {
      this.showMsgFromSearchBox("");
    },
    // 按字母搜索
    letterSearch(letter) {
      // this.emptyUserParams["nmp"] = letter === "*" ? "" : letter;
      this.showMsgFromSearchBox(letter);
      this.showLetterBox = false;
    },
    showLetterList() {
      this.showLetterBox = !this.showLetterBox;
    },
    _getChildDeptList() {
      getChildDeptList(this.params, data => {
        if (data.deptlist) {
          //格式化头像
          let headPic = "";
          if (
            data.deptlist.bigHeadPic != "" &&
            data.deptlist.bigHeadPic != "0"
          ) {
            headPic = data.deptlist.bigHeadPic;
          } else {
            headPic = data.deptlist.headPic.trim();
          }
          if (
            headPic &&
            headPic != "null" &&
            headPic.length > 0 &&
            headPic != "0"
          ) {
            if (headPic.indexOf("http") < 0) {
              data.deptlist.headPic = _.compressURL + headPic;
            }
          }
          this.childDeptList = data.deptlist;
        }
      });
    },
    // 获取无部门成员
    _listEmployeeUnderDept() {
      listEmployeeUnderDept(this.emptyUserParams, data => {
        this.hasData = true;
        data.currPage < data.maxPage
          ? (this.loadMoreMes.hasMore = true)
          : (this.loadMoreMes.hasMore = false); //是否还有更多数据
        this.getMoreData.currPage = data.currPage; //当前页面数
        this.getMoreData.maxPage = data.maxPage; // 最大页面数
        if (data.empList) {
          this.emptyUserList = this.emptyUserList.concat(data.empList);
        this.lock_roll = true;
        }else {
          this.hasData = false
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1024px) {
  #profilesList {
    .searchFixed {
      width: 740px !important;
    }
  }
}
#profilesList {
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
    .qwui-letter_list {
      width: 24px;
      height: 40px;
      margin-right: 10px;
      background: url("~assets/images/icon_letterList.png") center no-repeat;
      background-size: 20px;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .qwui-letter_box {
      display: flex;
      flex-wrap: wrap;
      position: absolute;
      left: 0;
      top: 50px;
      z-index: 2;
      width: 100%;
      background: rgba(100, 100, 100, 0.8);
      ul {
        width: 100%;
      }
      .qwui-letter_item {
        display: inline-block;
        width: 20%;
        color: #fff;
        height: 45px;
        line-height: 45px;
        font-size: 16px;
        font-weight: 700;
        text-align: center;
      }
    }
  }
  .fixedHeight {
    height: 43px;
  }
  .qwui-dept_list {
    .qwui-dept_listItem {
      display: flex;
      font-size: 16px;
      line-height: 2;
      clear: both;
      background-color: white;
      padding: 10px 15px;
      border-bottom: 1px solid #dfdfdd;
      .name {
        flex: 1;
      }
      .count {
        position: relative;
        padding-right: 20px;
        &::after {
          position: absolute;
          top: 49%;
          right: 0;
          content: "";
          border-style: solid;
          border-color: #999;
          border-width: 2px 2px 0 0;
          transform: rotate(45deg) translateY(-50%);
          width: 6px;
          height: 6px;
        }
      }
    }
  }
  .goBack {
    font-size: 16px;
    line-height: 2;
    border-bottom: 1px solid #dfdfdd;
    padding: 5px 15px 6px;
    span {
      position: relative;
      padding-left: 20px;
      &::after {
        position: absolute;
        top: 50%;
        left: 0;
        content: "";
        border-style: solid;
        border-color: #ccc;
        border-width: 0 0 2px 2px;
        transform: rotate(45deg) translateY(-50%);
        width: 6px;
        height: 6px;
      }
    }
  }
  .qwui-empty_user {
    .qwui-user_listItem {
      display: flex;
      padding: 10px 15px;
      border-bottom: 1px solid #dfdfdd;
      .headPic {
        width: 40px;
        height: 40px;
        min-width: 38px;
        margin-right: 10px;
        border-radius: 5px;
      }
      .qwui-user_desc {
        flex: 1;
        p {
          overflow: hidden;
          white-space: nowrap;
          word-wrap: normal;
          text-overflow: ellipsis;
          max-width: 320px;
        }
        .qwui-name {
          line-height: 1;
          font-size: 16px;
          color: #333;
          .sex_icon {
            display: inline-block;
            width: 30px;
            height: 15px;
            margin-top: -3px;
            margin-left: 5px;
            vertical-align: middle;
          }
          .male {
            background: url(~assets/images/ic_male.png) no-repeat;
            background-size: 15px 15px;
          }
          .female {
            background: url(~assets/images/ic_female.png) no-repeat;
            background-size: 15px 15px;
          }
        }
        .qwui-dept_name {
          font-size: 13px;
          color: #999999;
          margin-top: 6px;
        }
      }
    }
  }
}
</style>
