<template>
  <div class="qwui-learnStatistics">
    <div class="qwui-menuBox">
      <!-- 父组件-->
      <div class="qwui-treeMenuListBox">
        <ul class="qwui-treeMenu">
          <!-- 递归组件 -->
          <item class="item" :model="renderConfig"></item>
        </ul>
      </div>
    </div>
    <div class="qwui-mainBox">
      <div class="qwui-operateBox">
        <qwButton :color="qwButton.color" @click="exportFiles">{{qwButton.title}}</qwButton>
        <div class="searchInput">
          <searchInput
            :inputWidth="searchInput.inputWidth"
            :inputTips="searchInput.inputTips"
            @searchData="searchData"
          ></searchInput>
        </div>
      </div>
      <div class="qwui-formBox">
        <dataTable :headData="headData" :dataList="dataList"></dataTable>
      </div>
      <div class="qwui-pageBox">
        <pagination :pageData="pageData" @change="changePage"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import item from "../../components/dataStatistics/zTree.vue";
import dataTable from "@/components/Table/dataTable.vue";
import exportReportForm from "@/assets/js/export/export.js";
import searchInput from "../../components/base/searchInput.vue";
import pagination from "@/components/list/page.vue";
import http from "../../api/index";
import qwButton from "../../components/base/QWButton.vue";
import { mapGetters } from "vuex";

export default {
  mixins: [exportReportForm],
  props: {},
  data() {
    return {
      exportData: {
        exportStartTime: "",
        exportEndTime: "",
        exportParams: {
          reportType: "learning_count",
          personalFileName: ""
        }
      },
      renderConfig: {
        nodeName: "",
        children: [], // 区域列表
        hasChildrent: 0,
        loadingShow: true
      },
      totalCreditParam: {
        keyWord: "",
        departmentName: "",
        deptId: ""
      },
      dataList: [],
      headData: {
        middle: [
          {
            title: "序号",
            key: "index",
            textAlign: "center",
            width: 35
          },
          {
            title: "姓名",
            key: "personName",
            textAlign: "center",
            userId: "userId",
            width: 45,
            skip: {
              skipFunc: item => {
                let page = this.pageData.page;
                let pageSize = this.pageData.pageSize;
                this.$router.push({
                  name: "learnDetial",
                  params: {
                    page,
                    pageSize,
                    userId: item.userId
                  }
                });
              }
            }
          },
          {
            title: "账号",
            key: "wxUserId",
            textAlign: "center",
            width: 65
          },
          {
            title: "部门",
            key: "departmentName",
            textAlign: "center",
            width: 65
          },
          {
            title: "学习课程数",
            key: "totalCourseCount",
            textAlign: "center",
            width: 45
          },
          {
            title: "完成课程",
            key: "finishNum",
            textAlign: "center",
            width: 45
          },
          {
            title: "完成率",
            key: "finishRate",
            textAlign: "center",
            width: 45
          },
          {
            title: "学分",
            key: "totalCredit",
            textAlign: "center",
            width: 45
          },
          {
            title: "学习时长",
            key: "studyTime",
            textAlign: "center",
            width: 45
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
        totalRows: ""
      },
      apartmentAction: {
        nodeId: ""
      },
      qwButton: {
        title: "导出",
        color: "orange"
      },
      searchInput: {
        inputWidth: 180,
        inputTips: "学员/姓名/帐号/手机号"
      }
    };
  },
  computed: {
    ...mapGetters("scoreStatistics", ["get_currentNode"])
  },
  created() {
    this._getLearnStatistics();
    this._getContactAction();
    this._getDepartmentAction();
  },
  mounted() {},
  watch: {
    get_currentNode(message, b) {
      this.totalCreditParam.departmentName = message.nodeName;
      this.totalCreditParam.deptId = message.nodeId;
      this._getLearnStatistics();
    }
  },
  methods: {
    //获取表格数据
    _getLearnStatistics() {
      let { page, pageSize } = this.pageData;
      let data = Object.assign({}, { page, pageSize }, this.totalCreditParam);
      return http.getLearnStatistics(data, data => {
        if (data.pageData) {
          data.pageData.forEach((item, idx) => {
            item.index = idx + 1;
          });
          this.dataList = data.pageData;
          this.pageData.maxPage = data.maxPage;
          this.pageData.totalRows = data.totalRows;
        }
      });
    },
    //获取架构名称
    _getContactAction() {
      return http.getContactAction(
        {
          agentCode: "learnonline"
        },
        data => {
          if (data.orgList) {
            this.renderConfig.nodeName = data.orgList[0].nodeName;
          }
        }
      );
    },
    //获取架构分支
    _getDepartmentAction() {
      return new Promise((resolve, reject) => {
        return http.getDepartmentAction(
          {
            nodeId: this.apartmentAction.nodeId
          },
          data => {
            data.loadingShow = true;
            if (data.orgList) {
              data.orgList.forEach(item => {
                item.children = [];
              });
              this.renderConfig.children = data.orgList;
              this.renderConfig.hasChildrent = data.orgList.length;
              this.renderConfig.loadingShow = data.loadingShow;
            }
          }
        );
      });
    },
    //换页功能
    changePage() {
      this._getLearnStatistics();
    },
    //搜索功能
    searchData(keyword) {
      this.totalCreditParam.keyWord = keyword;
      this._getLearnStatistics();
    },
    //导出功能
    exportFunction() {
      let startTime = this.exportData.exportStartTime;
      let endTime = this.exportData.exportEndTime;
      this.exportData.exportParams.personalFileName = this.$utils.exportFormName(
        ["云课堂(学习统计)"]
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
  components: {
    dataTable,
    item,
    pagination,
    qwButton,
    searchInput
  }
};
</script>

<style scoped lang="scss">
@import "../../style/config.scss";
.qwui-learnStatistics {
  position: relative;
  width: 999px;
  background-color: #fff;
  min-height: 555px;
  color: #666;
  .qwui-menuBox {
    width: 199px;
    padding: 30px 6px 0;
    border-right: 1px #e8e8e8 solid;
    float: left;
    border-radius: 5px;
    .qwui-contactAction {
      padding: 20px 0px;
      text-align: center;
      .qwui-rule_ContactAction {
        height: 28px;
        font-size: 14px;
        color: #666;
        background: #fff;
        border-radius: 2px;
      }
    }
    .qwui-treeMenuListBox {
      min-height: 537px;
      height: 840px;
      overflow-y: auto;
       .qwui-treeMenu {
        list-style: none;
        /deep/ .qwui-menuWrap .item {
          li {
            overflow-x: hidden;
            position: relative;
            color: #666;
            span {
              cursor: pointer;
              display: inline-block;
              width: 170px;
              line-height: 20px;
              font-size: 14px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              box-sizing: border-box;
            }
            .qwui-menuWrap {
              padding-left: 0px;
            }
          }
        }
      }
    }
  }
  .qwui-mainBox {
    float: left;
    width: 799px;
    padding: 30px;
    .qwui-operateBox {
      padding: 20px 0px;
      margin-top: 0;
      .qwui-button_orange {
        color: #fff;
        background-color: #C31725;
        border-radius: 4px;
        border: 1px solid #f87b00;
      }
      .searchInput {
        float: right;
      }
    }
    .qwui-formBox {
      width: 739px;
      height: 560px;
      overflow-y: auto;
      /deep/ .table_wrap {
        min-width: auto;
        .qwui-content {
          font-size: 13px;
        }
      }
    }
  }
}
</style>
