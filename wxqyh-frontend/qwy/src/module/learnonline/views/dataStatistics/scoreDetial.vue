<template>
  <div class="qwui-score_detail">
    <div class="qwui-returnBar">
      <div class="qwui-content">
        <a class="floatLeft btn backBtn" @click="$router.back(-1)">返回</a>
        <span id="optType" class="detialTitle">个人学分明细</span>
      </div>
    </div>
    <div class="qwui-container">
      <div class="qwui-addStudy_record">
        <div id="userContent" class="scoreDetail_titleBar clearfix">
          <div class="floatLeft">
            <div class="iblock fl pr30 lh32 clearfix userInfo">
              <img
                :src="userMsg.userInfo?userMsg.userInfo.headPic:''"
                alt
                class="headPic score_userImg fl"
              >
              <p
                class="userName iblock pl15 qwui-userName ellipsis fl"
              >{{userMsg.userInfo?userMsg.userInfo.personName:''}}</p>
            </div>
            <div class="qwui-userInfo">
              <div class="iblock fl pr30 clearfix qwui-userAccount ellipsis">
                账号：
                <span class="userWx fz">{{userMsg.userInfo?userMsg.userInfo.wxUserId:''}}</span>
              </div>
              <div class="white-space iblock fl qwui-department">
                <span
                  class="userDepartmentName ellipsis"
                > 部门：{{userMsg.userInfo?userMsg.userInfo.departmentName:''}}</span>
              </div>
            </div>
          </div>
          <form
            action
            method="post"
            onsubmit="return false;"
            templateid="default"
            dqdpcheckpoint="query_form"
            id="SearchBox"
          ></form>
          <div class="exportBox">
            <qwButton :color="qwButton.color" @click="exportFiles">{{qwButton.title}}</qwButton>
          </div>
        </div>
        <div class="pt10 pb40">
          <ul class="flex" id="studyRank_list">
            <li class="flexItem border-right tcenter">
              <span
                id="creditOrder"
                class="totalCreditRank block pb5 fz40 orangeFont"
              >{{userMsg.userInfo?userMsg.userInfo.creditOrder:''}}</span>
              <span class="block fz14 c999">学分排名</span>
            </li>
            <li class="flexItem border-right tcenter">
              <span
                id="totalCredit"
                class="totalCredit block pb5 fz40 orangeFont"
              >{{userMsg.userInfo?userMsg.userInfo.totalCredit:''}}</span>
              <span class="block fz14 c999">总学分</span>
            </li>
            <li class="flexItem border-right tcenter">
              <span
                id="learnCredit"
                class="finishNum block pb5 fz40 c333"
              >{{userMsg.userInfo?userMsg.userInfo.learnCredit:''}}</span>
              <span class="block fz14 c999">学习学分</span>
            </li>
            <li class="flexItem tcenter">
              <span
                id="examCredit"
                class="finishRate block pb5 fz40 c333"
              >{{userMsg.userInfo?userMsg.userInfo.examCredit:''}}</span>
              <span class="block fz14 c999">考试学分</span>
            </li>
          </ul>
        </div>
        <div id="recordPage">
          <div class="bankTable">
            <dataTable :headData="headData" :dataList="userMsg.pageData?userMsg.pageData:[]"></dataTable>
          </div>
          <!-- 分页 -->
          <div class="qwui-pageBox">
            <pagination :pageData="pageData" @change="changePage"></pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../../api/index";
import dataTable from "@/components/Table/dataTable.vue";
import pagination from "@/components/list/page.vue";
import qwButton from "../../components/base/QWButton.vue";
import exportReportForm from "@/assets/js/export/export.js";

export default {
  mixins: [exportReportForm],
  props: {},
  data() {
    return {
      userId: "",
      searchValue: {
        startTime: "",
        endTime: ""
      },
      headData: {
        middle: [
          {
            title: "获得时间",
            key: "gainTime",
            textAlign: "center",
            width: 220
          },
          {
            title: "获得学分",
            key: "credit",
            textAlign: "center",
            width: 220
          },
          {
            title: "获得方式",
            key: "isExam",
            textAlign: "center",
            width: 220
          },
          {
            title: "来源",
            key: "objName",
            textAlign: "center",
            width: 300
          }
        ],
        right: {
          isShowOperate: false,
          width: 45
        }
      },
      pageData: {
        page: 1,
        pageSize: 10,
        maxPage: 1,
        totalRows: 0
      },
      userMsg: "",
      qwButton: {
        title: "导出",
        color: "orange"
      },
      exportData: {
        "searchValue.start": "",
        "searchValue.end": "",
        reportType: "learn_exam_credit_detail",
        personalFileName: "",
        "searchValue.userId": ""
      }
    };
  },
  computed: {},
  created() {
    this.render();
  },
  mounted() {},
  watch: {},
  methods: {
    render() {
      this.userId = this.$route.params.Id;
      this.searchValue.startTime = this.$route.params.start;
      this.searchValue.endTime = this.$route.params.end;

      http.getScoreDetial(
        {
          page: this.pageData.page,
          pageData: this.pageData.pageSize,
          userId: this.userId,
          start: this.searchValue.startTime,
          end: this.searchValue.endTime
        },
        data => {
          if (data.pageData) {
            data.pageData.forEach(item => {
              item.isExam === 0
                ? (item.isExam = "学习")
                : (item.isExam = "考试");
              item.isClean > 0
                ? (item.credit = "已清空")
                : (item.credit = item.credit);
            });
          }
          this.userMsg = data;
          this.pageData.page = data.currPage;
          this.pageData.totalRows = data.totalRows;
          this.pageData.maxPage = data.maxPage;
        }
      );
    },
    changePage() {
      this.render();
    },
    exportFunction() {
      this.exportData["searchValue.start"] = this.searchValue.startTime;
      this.exportData["searchValue.end"] = this.searchValue.endTime;

      let startTime = this.exportData["searchValue.start"];
      let endTime = this.exportData["searchValue.end"];

      this.exportData["searchValue.userId"] = this.userId;

      this.exportData.personalFileName = this.$utils.exportFormName(
        ["云课堂(个人学分明细)"]
      );

      if (this.exportDaysLimitByMonthCounts(startTime, endTime)) {
        this.updateExportParams();
        this._createReport(this.exportData);
      }
    },
    updateExportParams() {},
    exportFiles() {
      this.exportFunction();
    }
  },
  components: { dataTable, pagination, qwButton }
};
</script>

<style scoped lang="scss">
.qwui-score_detail {
  width: 100%;
  .btn {
    min-width: 46px;
    padding: 0 11px;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    border-radius: 4px;
  }
  .clearfix:before,
  ul.inline-float:before {
    content: "";
    display: table;
    font: 0/0 a;
  }
  .floatLeft {
    float: left;
  }
  .qwui-returnBar {
    width: 100%;
    line-height: 32px;
    padding: 9px 0;
    background-color: #fff;
    border-bottom: 1px #eee solid;
    text-align: center;
    .qwui-content {
      width: 1200px;
      margin: 0 auto;
      text-align: center;
    }
    .backBtn {
      color: #666;
      background-color: #fff;
      border: 1px solid #cccccc;
    }
    .detialTitle {
      display: inline-block;
      font-size: 18px;
      color: #333;
      padding-right: 100px;
      margin-right: 50px;
    }
  }
  .qwui-container {
    position: relative;
    width: 1200px;
    margin: 20px auto;
    overflow: hidden;
    min-height: 555px;
    .qwui-addStudy_record {
      padding: 1px 50px 20px;
      float: left;
      background: #fff;
      .scoreDetail_titleBar {
        padding: 20px 0;
        padding-bottom: 8px;
        margin-bottom: 30px;
        border-bottom: 1px #e8e8e8 solid;
      }
    }
  }
}

.iblock {
  float: left;
}
.qwui-addStudy_record {
  padding: 1px 50px 20px;
  float: left;
  background: #fff;
  .scoreDetail_titleBar {
    padding: 20px 0;
  }
  .fl {
    float: left;
  }
  .lh32 {
    line-height: 32px;
  }
  .pr30 {
    padding-right: 30px;
    .score_userImg {
      display: inline-block;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
    }
    .qwui-score_detail .qwui-userName {
      max-width: 300px;
    }
    .ellipsis {
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
      overflow: hidden;
    }
  }
}

.clearfix:before,
ul.inline-float:before {
  content: "";
  display: table;
  font: 0/0 a;
}

.content {
  width: 1200px;
  margin: 0 auto;
}
.pt10 {
  padding-top: 10px;
}
.pb40 {
  padding-bottom: 40px;
}
.flex {
  display: -webkit-box !important;
  display: -webkit-flex !important;
  display: -ms-flexbox !important;
  display: flex !important;
}

.flexItem {
  -webkit-box-flex: 1 !important;
  -webkit-flex: 1 !important;
  -ms-flex: 1 !important;
  flex: 1 !important;
}

.flexCenter {
  display: -webkit-box !important;
  display: -webkit-flex !important;
  display: -ms-flexbox !important;
  display: flex !important;
  -ms-align-items: center !important;
  -webkit-align-items: center !important;
  align-items: center !important;
}
.border-right {
  border-right: 1px #eee solid;
}
.fz40 {
  font-size: 40px;
}
.orangeFont {
  color: #f87b00;
}
.pb5 {
  padding-bottom: 5px;
}
.rightTop {
  padding-bottom: 8px;
  margin-bottom: 30px;
  border-bottom: 1px #e8e8e8 solid;
}
.rightTop span {
  font-size: 14px;
}

.rightTop span {
  font-size: 14px;
  line-height: 32px;
  color: #666;
}
.qwui-score_detail .qwui-userAccount {
  display: inline-block;
  max-width: 220px;
}
.clearfix {
  *zoom: 1;
}

.clearfix:before,
ul.inline-float:before {
  content: "";
  display: table;
  font: 0/0 a;
}

.clearfix:after,
ul.inline-float:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.userDepartmentName {
  width: 300px;
  display: inline-block;
  font-size: 14px;
}

.btn {
  min-width: 46px;
  padding: 0 11px;
  line-height: 30px;
  text-align: center;
  display: inline-block;
  border-radius: 4px;
}

.orangeBtn {
  color: #fff;
  background-color: #C31725;
  border: 1px #f87b00 solid;
}

.orangeBtn:hover {
  background-color: #f87b00;
}

.whiteBtn {
  color: #666;
  background-color: #fff;
  border: 1px solid #cccccc;
}

.whiteBtn:hover {
  background-color: #f7f7f7;
}
.exportBox {
  float: right;
  .qwui-button_orange {
    color: #fff;
    background-color: #C31725;
    border-radius: 4px;
    border: 1px solid #f87b00;
  }
}
.qwui-userInfo {
  float: right;
  height: 32px;
  line-height: 32px;
}
</style>
