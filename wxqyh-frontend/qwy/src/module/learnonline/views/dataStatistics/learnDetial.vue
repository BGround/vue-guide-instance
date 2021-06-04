<template>
  <div class="wrap-container qwui-score_detail">
    <div class="returnBar">
      <div class="content txtcenter">
        <a class="fl btn whiteBtn" @click="$router.back(-1)">返回</a>
        <span id="optType" class="pr50 mr20">个人学习档案</span>
      </div>
    </div>
    <div class="container">
      <div class="addStudy_record">
        <div id="userContent" class="rightTop scoreDetail_titleBar clearfix">
          <div class="fl">
            <div class="iblock fl pr30 lh32 clearfix">
              <img :src="userInfo?userInfo.headPic:''" alt class="headPic score_userImg fl">
              <p
                class="userName iblock pl15 qwui-userName ellipsis fl"
              >{{userInfo?userInfo.personName:''}}</p>
            </div>
            <div class="qwui-userINFO">
              <div class="iblock fl pr30 clearfix qwui-userAccount ellipsis">
                账号：
                <span class="userWx fz">{{userInfo?userInfo.wxUserId:''}}</span>
              </div>
              <div class="white-space iblock fl qwui-department">
                部门：
                <span class="userDepartmentName ellipsis">{{userInfo?userInfo.departmentName:''}}</span>
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
        <div class="pt20 pb50">
          <ul class="flex" id="studyRank_list">
            <li class="flexItem border-right tcenter">
              <span class="totalCredit block pb5 fz26">{{userInfo?userInfo.totalCredit:''}}</span>
              <span class="block fz14 c333">总学分</span>
            </li>
            <li class="flexItem border-right tcenter">
              <span class="totalCreditRank block pb5 fz26">{{userInfo?userInfo.totalCreditRank:''}}</span>
              <span class="block fz14 c333">学分排名</span>
            </li>
            <li class="flexItem border-right tcenter">
              <span class="studyTime block pb5 fz26">{{userInfo?userInfo.studyTime:''}}</span>
              <span class="block fz14 c333">总学时</span>
            </li>
            <li class="flexItem border-right tcenter">
              <span class="studyTimeRank block pb5 fz26">{{userInfo?userInfo.studyTimeRank:''}}</span>
              <span class="block fz14 c333">学时排名</span>
            </li>
            <li class="flexItem border-right tcenter">
              <span class="studyNum block pb5 fz26">{{userInfo?userInfo.studyNum:''}}</span>
              <span class="block fz14 c333">学习课程数</span>
            </li>
            <li class="flexItem border-right tcenter">
              <span class="finishNum block pb5 fz26">{{userInfo?userInfo.finishNum:''}}</span>
              <span class="block fz14 c333">完成课程数</span>
            </li>
            <li class="flexItem tcenter">
              <span class="finishRate block pb5 fz26">{{userInfo?userInfo.finishRate:''}}</span>
              <span class="block fz14 c333">完成率</span>
            </li>
          </ul>
        </div>
        <div id="recordPage">
          <div class="bankTable">
            <dataTable :headData="headData" :dataList="userMsg?userMsg.pageData:[]"></dataTable>
          </div>
          <!-- 分页 -->
          <div class="qwui-pageBox" v-if="userMsg.pageData &&userMsg.pageData.length>0">
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
import exportReportForm from "@/assets/js/export/export.js";
import pagination from "@/components/list/page.vue";
import qwButton from "../../components/base/QWButton.vue";

export default {
  mixins: [exportReportForm],
  props: {},
  data() {
    return {
      userId: "",
      isVIP: true,
      headData: {
        middle: [
          {
            title: "课程",
            key: "subjectName",
            textAlign: "center",
            width: 180
          },
          {
            title: "课时总数",
            key: "enclosureCount",
            textAlign: "center",
            width: 60
          },
          {
            title: "完成课时数",
            key: "finishEnclosureCount",
            textAlign: "center",
            width: 70
          },
          {
            title: "完成进度",
            key: "finishRate",
            textAlign: "center",
            width: 90
          },
          {
            title: "课件总时长(分)",
            key: "studyTime",
            textAlign: "center",
            width: 100
          },
          {
            title: "学习时长(分)",
            key: "expend",
            textAlign: "center",
            width: 80
          },
          {
            title: "考试成绩(分)",
            key: "score",
            textAlign: "center",
            width: 80
          },
          {
            title: "是否通过",
            key: "isPass",
            textAlign: "center",
            width: 60
          },
          {
            title: "获得学分",
            key: "credit",
            textAlign: "center",
            width: 60
          },
          {
            title: "课程学习时间",
            key: "createTime",
            textAlign: "center",
            width: 140
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
      userInfo: "",
      qwButton: {
        title: "导出数据",
        color: "orange"
      },
      exportData: {
        exportStartTime: "",
        exportEndTime: "",
        exportParams: {
          reportType: "study_detail",
          personalFileName: "",
          "searchValue.userId": ""
        }
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
      this.userId = this.$route.params.userId;
      http.getLearnDetial(
        {
          page: this.pageData.page,
          pageSize: this.pageData.pageSize,
          userId: this.userId
        },
        data => {
          if (data.isVIP) {
            data.pageData.forEach(element => {
              if (element.finishRate === "") {
                element.finishRate = "0.00%";
              }
              if (element.score === 0) {
                element.score = "-";
              }
              element.isPass === 1
                ? (element.isPass = "是")
                : (element.isPass = "-");
            });
            this.userMsg = data;
            this.pageData.page = data.currPage;
            this.pageData.totalRows = data.totalRows;
            this.pageData.maxPage = data.maxPage;
          } else {
            data.pageData = [];
            this.userMsg = data;
          }
        }
      );
      http.getLearnPersonalDetial(
        {
          userId: this.userId
        },
        data => {
          for (let i in data.stydyCount) {
            if (i === "studyTime") {
              let hour = Math.floor(data.stydyCount[i] / 60);
              let sec = data.stydyCount[i] % 60;
              sec = sec >= 10 ? sec : "0" + sec;
              data.stydyCount[i] = `${hour}小时${sec}分`;
              break;
            }
          }
          this.userInfo = data.stydyCount;
        }
      );
    },
    changePage() {
      this.render();
    },
    exportFunction() {
      let startTime = this.exportData.exportStartTime;
      let endTime = this.exportData.exportEndTime;

      this.exportData.exportParams["searchValue.userId"] = this.userId;
      this.exportData.exportParams.personalFileName = this.$utils.exportFormName(
        ["云课堂(学习档案)"]
      );
      if (this.exportDaysLimitByMonthCounts(startTime, endTime)) {
        this.updateExportParams();
        this._createReport(this.exportData.exportParams);
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
.wrap-container {
  width: 100%;
}

.container {
  position: relative;
  width: 1200px;
  margin: 20px auto;
  overflow: hidden;
  min-height: 555px;
}
.iblock {
  float: left;
}
.addStudy_record {
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
.returnBar {
  width: 100%;
  line-height: 32px;
  padding: 9px 0;
  background-color: #fff;
  border-bottom: 1px #eee solid;
  text-align: center;
}

.returnBar span {
  font-size: 18px;
  color: #333;
}

.returnBar i {
  font-size: 16px;
  color: #999;
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
  font-size: 14px;
}

.btn {
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
    padding: 6px 10px 6px;
    border: 1px solid #f87b00;
  }
}
.fz26 {
  font-size: 26px;
  color: #666;
}
.pb5 {
  padding-bottom: 5px;
}
.block {
  display: block;
}
.qwui-userINFO {
  float: right;
}
</style>
