<template>
  <div class="qwui-scoreStatistics">
    <div class="qwui-menuBox">
      <!-- 父组件-->
      <div class="qwui-treeMenuListBox" ref="treeMenuListBox">
        <ul class="qwui-treeMenu">
          <!-- 递归组件 -->
          <item class="item" :model="renderConfig"></item>
        </ul>
      </div>
    </div>
    <div class="qwui-mainBox">
      <div class="qwui-operateBox">
        <searchBox :qwButton="qwButton" @searchData="searchData" @cleanCredit="cleanCredit"></searchBox>
      </div>
      <div class="qwui-formBox">
        <dataTable :headData="headData" :dataList="dataList">
          <div
            v-for="(item,key) in dataList"
            :key="key"
            :slot="'personName'+key"
            :class="item.totalCredit>0?'goLink':'disabled'"
          >
            <span title="点击查看明细" @click="skipFunc(item)" class="personName">{{item.personName}}</span>
          </div>
        </dataTable>
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
import pagination from "@/components/list/page.vue";
import searchBox from "../../components/dataStatistics/searchData.vue";
import http from "../../api/index";
import { mapMutations, mapGetters } from "vuex";

export default {
  props: {},
  data() {
    return {
      qwButton: [
        {
          title: "清空学分",
          color: "disabled"
        },
        {
          title: "导出",
          color: "orange"
        }
      ],
      renderConfig: {
        nodeName: "",
        children: [],
        hasChildrent: 0,
        loadingShow: true
      },
      totalCreditParam: {
        sortWord: "totalCredit",
        sortType: "down",
        departmentName: "",
        deptId: ""
      },
      searchValue: {
        keyword: "",
        start: "",
        end: ""
      },
      pageData: {
        page: 1,
        pageSize: 10,
        maxPage: 1,
        totalRows: ""
      },
      dataList: [],
      headData: {
        left: {
          id: "userId",
          checkFunc: (isSelectedAll, list) => {
            let isChecked = list.filter((item, idx) => {
              return item.isChecked;
            });
            this.checkList = isChecked;
            isChecked.length > 0
              ? (this.qwButton[0].color = "clear")
              : (this.qwButton[0].color = "disabled");
          }
        },
        middle: [
          {
            title: "排名",
            key: "creditOrder",
            textAlign: "center",
            width: 25
          },
          {
            title: "姓名",
            key: "personName",
            textAlign: "center",
            userId: "userId",
            width: 45
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
            title: "总学分",
            key: "totalCredit",
            textAlign: "center",
            Color: "black",
            width: 45,
            sort: {
              sortFunc: item => {
                this.sortTotalCredit(item);
              },
              sortStyle: "sort_down" // 箭头向下'sort_down_on'//点击后的箭头向下  'sort_up'箭头向上  'sort_up_on'点击后的箭头向上
            }
          },
          {
            title: "学习学分",
            key: "learnCredit",
            textAlign: "center",
            width: 45,
            sort: {
              sortFunc: item => {
                this.sortTotalCredit(item);
              }, //排序回调函数
              sortStyle: "sort_down" // 箭头向下'sort_down_on'//点击后的箭头向下  'sort_up'箭头向上  'sort_up_on'点击后的箭头向上
            }
          },
          {
            title: "考试学分",
            key: "examCredit",
            textAlign: "center",
            width: 45,
            sort: {
              sortFunc: item => {
                this.sortTotalCredit(item);
              }, //排序回调函数
              sortStyle: "sort_down" // 箭头向下'sort_down_on'//点击后的箭头向下  'sort_up'箭头向上  'sort_up_on'点击后的箭头向上
            }
          }
        ],
        right: {
          isShowOperate: false,
          width: 45
        }
      },
      apartmentAction: {
        nodeId: "",
        currentDepartment: "",
        nextData: ""
      },
      checkList: [],
      userIds: "",
      timer_time: 2000 // 搜索轮询定时器的时间
    };
  },
  computed: {
    ...mapGetters("scoreStatistics", ["get_currentNode"]),
    ...mapGetters("scoreStatistics", ["get_scrollTop"])
  },
  created() {
    this._getScoreStatistics();
    this._getContactAction();
    this._getDepartmentAction();
  },
  activated() {
    // 恢复滚动条位置
    this.$refs.treeMenuListBox.scrollTop = this.get_scrollTop;
  },
  watch: {
    get_currentNode(message) {
      this.totalCreditParam.departmentName = message.nodeName;
      this.totalCreditParam.deptId = message.nodeId;
      this._getScoreStatistics();
    }
  },
  methods: {
    //设置架构列表滚动条高度
    ...mapMutations("scoreStatistics", ["SET_SCROLLTOP"]),
    //获取表格数据
    _getScoreStatistics() {
      let { page, pageSize } = this.pageData;
      let searchValue = {
        "searchValue.start": this.searchValue.start,
        "searchValue.end": this.searchValue.end,
        keyword: this.searchValue.keyword
      };
      let data = Object.assign(
        {},
        { page, pageSize },
        searchValue,
        this.totalCreditParam
      );
      return http.getScoreStatistics(data, data => {
        // 如果后台还在执行搜索，则递归请求
        if (data.ongoning) {
          setTimeout(()=> {
            if (this.timer_time < 5000) {
              this.timer_time + 1000;
            }
            this._getScoreStatistics();
          }, this.timer_time);
        } else {
          this.dataList = data.pageData ? data.pageData : [];
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
      this.qwButton[0].color = "disabled";
      this._getScoreStatistics();
    },
    //排序功能
    sortTotalCredit(item) {
      this.totalCreditParam.sortWord = this.headData.middle[item].key;
      if (this.headData.middle[item].sort.sortStyle === "sort_up") {
        this.$set(this.headData.middle[item].sort, "sortStyle", "sort_down");
        this.totalCreditParam.sortType = "up";
      } else {
        this.$set(this.headData.middle[item].sort, "sortStyle", "sort_up");
        this.totalCreditParam.sortType = "down";
      }
      this._getScoreStatistics();
    },
    //搜索功能
    searchData(searchValue) {
      this.searchValue = searchValue;
      this._getScoreStatistics();
    },
    //清空学分
    cleanCredit(clean) {
      this.userIds = this.$utils.handlerId(this.checkList);
      if (this.searchValue.start == "" || this.searchValue.end == "") {
        _.alert("提示", "必须同时填入开始和截止时间并搜索才可以清空");
      } else {
        let { page, pageSize } = this.pageData;
        let searchValue = {
          "searchValue.start": this.searchValue.start,
          "searchValue.end": this.searchValue.end,
          userIds: this.userIds
        };

        let data = Object.assign({}, searchValue, this.totalCreditParam);
        return http.cleanCredit(data, data => {
          if (JSON.stringify(data) == "{}") {
            dataBase.top_alert("清空成功", true, 3000);
            this.qwButton[0].color = "disabled";
          this._getScoreStatistics();
          }
        });
      }
    },
    //跳转明细页面
    skipFunc(item) {
      if (item.totalCredit != 0) {
        let startTime = this.searchValue.start;
        let endTime = this.searchValue.end;
        let page = this.pageData.page;
        let pageSize = this.pageData.pageSize;
        this.$router.push({
          name: "scoreDetial",
          params: {
            page,
            pageSize,
            Id: item.userId,
            start: startTime,
            end: endTime
          }
        });
        //记录滚动条高度
        this.SET_SCROLLTOP(this.$refs.treeMenuListBox.scrollTop);
      }
    }
  },
  components: {
    dataTable,
    searchBox,
    pagination,
    item
  }
};
</script>

<style scoped lang="scss">
@import "../../style/config.scss";
.qwui-scoreStatistics {
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
        /deep/ thead {
          .sort_down .sort_up {
            color: black;
          }
        }
        tbody {
          tr {
            td {
              box-sizing: border-box;
            }
            td:nth-child(3) {
              color: #f87b00 !important;
              overflow: hidden;
              span {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
            }
            .disabled {
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              line-height: 49px;
              cursor: not-allowed;
              color: #ccc;
              overflow: hidden;
              text-overflow: ellipsis;
              :hover {
                text-decoration: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>
