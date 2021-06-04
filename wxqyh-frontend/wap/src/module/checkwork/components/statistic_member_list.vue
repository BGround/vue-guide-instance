<template>
  <div>
    <div class="wrap allPage" v-windowscroll="scrollFun">
      <div class="fixed">
        <!-- 头部整体状态 -->
        <div class="statiUsersHead line-bottom" :class="showTab ? 'mt50':''">
          <span class="memberListHeadSpan_pos">{{typeStatus[checkUserType]}}({{totalRows}}人)</span>
          <span>
        <div class="date-list-datebtn"></div>
            <!-- 选择时间 -->
        <span class="dateForRank"  @click="switchShowS=!switchShowS">{{checkDate}}</span>
      </span>
        </div>
      </div>
      <!-- tab只在已签到、未签到时显示 -->
      <Nav_tabs v-show="showTab"
                position="top"
                :defaultActiveKey="tab.activeKey"
                :tabs="tabs.Tabs"
                v-on:listenNavTabs="showIsHasCheck"
      >
      </Nav_tabs>
      <!-- 人员列表 -->
      <div :class="showTab ? 'listBody':'noTabListBody'" v-show="!noData">
        <div class="rankItem" v-for="rankItem in memberList" :key="rankItem.userId" @click="gotoPersonCalendar(rankItem)">
          <div class="rankItemContent line-bottom">
            <img :src="rankItem.headPic" alt="未获取图片">
            <div class="rankUserName qwui-spanEllips">{{rankItem.personName}}</div>
            <div class="rankMemberDept qwui-spanEllips">{{rankItem.rankDepName}}</div>
          </div>
        </div>
        <!--加载更多-->
        <Load_more v-show="totalRows>0" :loading="loading"
                   :currPage="myCurrentPage"
                   :maxPage="myMaxPage"
        >
          <span>共 {{totalRows}} 名人员</span>
        </Load_more>
      </div>
      <div :class="showTab ? 'warp-no-data':'warp-no-tab-no-data'" v-show="noData">
        <i class="icon_search_noCourse"></i>
        <p class="qwui-no-data-title">没有记录</p>
        <p class="qwui-no-data-sm_text">没有员工{{typeStatus[checkUserType]}}的记录</p>
      </div>
      <!--时间选择组件-->
      <time-picker
        :show="switchShowS"
        :defaultDate="checkDate"
        @confirm="confirmTime"
        @cancel="cancelTime"
        :dateOnly=true
        :minYear="minYear"
        :maxYear="maxYear"
      >
      </time-picker>
    </div>
    <div class="qwui-footerDiv"></div>
    <div class="qwui-bottom_confirm">
      <flow_button :buttondata="buttonConfig"></flow_button>
    </div>
  </div>
</template>

<script>
import Nav_tabs from "@/components/base/nav_tabs";
import flow_button from "@/components/button/flow_button.vue";
import timePicker from "@/components/basicUI/qwuiPicker/time_picker.vue";
import * as timeUtil from "@/assets/js/time-util";
import Load_more from "@/components/list/load_more";

const proHeadPicUrl = require("../../../assets/images/touxiang02.png");

export default {
  name: "statistic_member_list",
  components: {
    Nav_tabs,
    flow_button,
    timePicker,
    Load_more
  },
  props: {
    listConfig: {
      ruleId: String,
      checkDate: String,
      departId: String,
      parentDepartId: String,
      checkUserType: String
    }
  },
  data() {
    return {
      totalRows: "", //总条数
      myCurrentPage: "", //当前页面
      myMaxPage: "", //最大页面
      loading: false, //正在加载更多
      lock_roll: false, //滚动锁
      switchShowS: false,
      minYear: new Date().getFullYear() - 1, //最小年份
      maxYear: new Date().getFullYear(), //最大年份
      tabs: {
        Tabs: [{ text: "未打卡" }, { text: "已打卡" }]
      },
      tab: {
        indexActive: 0, //默认tab
        activeKey: "noCheck" //记录我的 当前的tab
      },
      noCheck: {
        index: 0,
        firstLoading: true, //第一次加载
        lock_roll: false,
        List: [], //列表
        keyWord: "",
        currPage: "",
        maxPage: "",
        totalRows: ""
      },
      memberList: [],
      rankItem: {
        headPic: "",
        personName: "",
        rankDepName: "",
        userId: ""
      },
      typeStatus: {
        "1": "已打卡",
        "2": "未打卡",
        "3": "旷工",
        "4": "迟到",
        "5": "请假",
        "6": "出差",
        "7": "外勤",
        "8": "早退"
      },
      checkUserType: this.listConfig.checkUserType,
      ruleId: this.listConfig.ruleId,
      checkDate: this.listConfig.checkDate,
      departId: this.listConfig.departId,
      parentDepartId: this.listConfig.departId,
      noData: false,
      buttonConfig: {
        //操作按钮
        primaryList: [],
        defaultList: [
          { type: "default", name: "返回", callBack: this.closeMemberList }
        ],
        class: "" //按钮是否置底部 active :底部、"":相对定位
      }
    };
  },
  computed: {
    showTab() {
      if (this.checkUserType == "1" || this.checkUserType == "2") {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    listConfig: {
      handler() {
        this.checkUserType = this.listConfig.checkUserType;
        this.ruleId = this.listConfig.ruleId;
        this.checkDate = this.listConfig.checkDate;
        this.departId = this.listConfig.departId;
        this.parentDepartId = this.listConfig.departId;
      },
      deep: true
    }
  },
  created() {
    this.getMemberList();
  },
  methods: {
    gotoPersonCalendar(rankItem) {
      this.$router.push({
        path: "/checkCalendar",
        query: {
          rankItem: rankItem,
          index: 1
        }
      });
    },
    /**初始化获取人员列表，加载10条 */
    getMemberList() {
      var _this = this;
      _.showLoading();
      _.ajax({
        url: _.baseURL + dataBase.statistics.memberListUrl,
        type: "post",
        data: {
          ruleId: _this.ruleId,
          checkDate: _this.checkDate,
          departId: _this.departId,
          parentDepartId: _this.parentDepartId,
          checkUserType: _this.checkUserType,
          page: "1"
        },
        success: function(result) {
          if (result.code == "0") {
            _.hideLoading();
            _this.handlerDateForMember(result);
          } else if (result.code == "261097") {
            _this.$emit("updateTotal", _this.checkDate);
            setTimeout(function() {
              _this.getMemberList();
              _.hideLoading();
            }, 1000);
          }
        }
      });
    },
    /**分页加载更多人员 */
    getMoreMembers() {
      var _this = this;
      _.showLoading();
      _.ajax({
        url: _.baseURL + dataBase.statistics.memberListUrl,
        type: "post",
        data: {
          ruleId: _this.ruleId,
          checkDate: _this.checkDate,
          departId: _this.departId,
          parentDepartId: _this.parentDepartId,
          checkUserType: _this.checkUserType,
          page: _this.myCurrentPage + 1
        },
        success: function(result) {
          if (result.code == "0") {
            _.hideLoading();
            _this.handlerDateForMember(result);
          } else if (result.code == "261097") {
            _this.$emit("updateTotal", _this.checkDate);
            setTimeout(function() {
              _this.getMemberList();
              _.hideLoading();
            }, 1000);
          }
        }
      });
    },
    /**处理后台传递数据 */
    handlerDateForMember(result) {
      var _this = this;
      if (_this.myCurrentPage < _this.myMaxPage) {
        _this.lock_roll = false;
      }
      var pageList = result.data.pageData;
      _this.totalRows = result.data.totalRows;
      _this.myCurrentPage = result.data.currPage;
      _this.myMaxPage = result.data.maxPage;
      if (pageList && pageList.length > 0) {
        _this.noData = false;
        for (var i = 0; i < pageList.length; i++) {
          var rankItem = {
            headPic: proHeadPicUrl,
            personName: "",
            rankDepName: "考勤部门",
            userId: ""
          };
          var item = pageList[i];
          rankItem.headPic =
            item.headPic && item.headPic != "0"
              ? item.headPic
              : rankItem.headPic;
          rankItem.personName = item.personName;
          rankItem.userId = item.userId;
          _this.memberList.push(rankItem);
        }
      } else {
        /*无数据处理*/
        _this.noData = true;
      }
    },
    closeMemberList() {
      this.memberList.splice(0);
      this.$emit("closeMemberList", this.checkDate);
    },
    showIsHasCheck(i) {
      var _this = this;
      if (i == 0) {
        _this.checkUserType = "2";
        _this.memberList.splice(0);
        _this.getMemberList();
      } else if (i == 1) {
        _this.checkUserType = "1";
        _this.memberList.splice(0);
        _this.getMemberList();
      }
    },
    confirmTime(val, valItem) {
      var data =
        valItem[0] +
        "-" +
        valItem[1] +
        "-" +
        (valItem[2] ? valItem[2].substring(0, 2) : "");
      this.checkDate = data;
      this.memberList.splice(0);
      this.getMemberList();
    },
    cancelTime() {
      this.switchShowS = false;
    },
    /**下拉加载滚动事件 */
    scrollFun() {
      var _this = this;
      var scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
      if (scrollTop + window.innerHeight >= document.body.scrollHeight) {
        if (!_this.lock_roll && _this.myCurrentPage < _this.myMaxPage) {
          _this.lock_roll = true;
          _this.getMoreMembers();
        }
      }
    }
  }
};
</script>

<style scoped>
.fixed {
  position: fixed;
  width: 100%;
  z-index: 2;
}
.allPage {
  background: #fff;
  z-index: 6;
}
.statiUsersHead {
  position: relative;
  overflow: hidden;
  background: #fff;
}
.mt50 {
  margin-top: 50px;
}
/*边框定位*/
.line-bottom{
  position: relative;
}
/*下边框*/
.line-bottom::after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: auto;
}
.memberListHeadSpan_pos {
  float: left;
  margin: 15px 0px 15px 16px;
  font-size: 16px;
}
.listBody {
  margin-top: 105px;
}
.noTabListBody {
  margin-top: 65px;
}
.rankItem {
  position: relative;
  overflow: hidden;
  padding-left: 15px;
}
.rankItem img {
  float: left;
  margin: 12px 11px 12px 0;
  width: 40px;
  height: 40px;
}
.rankItemContent {
  overflow: hidden;
}
.rankUserName {
  margin: 11px 0 0 0;
  float: left;
  font-size: 15px;
  max-width: 200px;
}
.qwui-spanEllips {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
.rankMemberDept {
  position: absolute;
  top: 35px;
  left: 50px;
  font-size: 12px;
  color: #999;
}
.icon_search_noCourse {
  display: inline-block;
  width: 130px;
  height: 130px;
  background: url("~assets/images/checkwork/noCourse.png") center no-repeat;
  background-size: cover;
}
.warp-no-data {
  margin: 220px 25px 0;
  text-align: center;
}
.warp-no-tab-no-data {
  margin: 170px 25px 0;
  text-align: center;
}
.warp-no-data p {
  margin-top: 18px;
  line-height: 20px;
}
.qwui-no-data-title {
  font-size: 20px;
  color: #666;
}
.qwui-no-data-sm_text {
  font-size: 14px;
  color: #bbb;
}
.date-list-datebtn {
  width: 20px;
  height: 20px;
  margin: 10px 15px 0 0;
  background: url(~assets/images/checkwork/ic_arrow_left.png) no-repeat left
    center;
  background-size: 10px;
  cursor: pointer;
  transform: rotate(270deg);
  float: right;
}
.dateForRank {
  display: block;
  float: right;
  margin: 15px 0 0 0;
  font-size: 14px;
  width: 80px;
  border: 0;
  color: #666;
}
.qwui-footerDiv {
  display: block;
  height: 60px;
  background-color: #FFF
}
.qwui-bottom_confirm{
  position: fixed;
  bottom: 0;
  z-index: 90;
  width: 100%;
  min-height: 50px;
  background: #fff;
  border-top: 1px solid #ddd;
}
@media screen and (min-width: 1024px) {
  .qwui-bottom_confirm {
    width: 740px !important;
    margin: 0 auto;
  }
}
</style>

