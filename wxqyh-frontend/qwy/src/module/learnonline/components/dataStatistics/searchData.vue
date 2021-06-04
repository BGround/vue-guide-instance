<template>
  <div class="searchBox">
    <div class="qwui-chooseTimeBox">
      <vue-datepicker-local
        v-model="selectTime"
        inputClass="qwui-datetime"
        popupClass="qwui-popup"
        :local="timeLocal"
        :showButtons="true"
        @confirm="chooseTime"
        :clearable="true"
        type="normal"
      ></vue-datepicker-local>
    </div>
    <div class="qwui-searchInput">
      <searchInput
        :inputWidth="searchInput.inputWidth"
        :inputTips="searchInput.inputTips"
        @searchData="searchData"
      ></searchInput>
    </div>
    <div class="qwui-buttonBox">
      <qwButton
        v-for="(item,idx) in qwButton"
        :key="idx"
        :color="item.color"
        @click="operate"
      >{{item.title}}</qwButton>
    </div>
  </div>
</template>

<script>
import VueDatepickerLocal from "vue-datepicker-local";
import exportReportForm from "@/assets/js/export/export.js";
import qwButton from "../base/QWButton.vue";
import searchInput from "../../components/base/searchInput.vue";

export default {
  mixins: [exportReportForm],
  props: {
    qwButton: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectTime: [],
      clearable:true,
      timeLocal: {
        dow: 0, // 第一天为周日
        yearSuffix: "年", // format of head
        monthsHead: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split(
          "_"
        ), // months of head
        months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split(
          ""
        ), // months of panel
        weeks: "日_一_二_三_四_五_六".split("_"), // weeks
        cancelTip: "取消", // default text for cancel button
        submitTip: "确定" // default text for submit button
      },
      datepicker: {
        beginTime: "",
        endTime: ""
      },
      exportData: {
        "searchValue.start": "",
        "searchValue.end": "",
        reportType: "learn_exam_credit_count",
        personalFileName: ""
      },
      searchInput: {
        inputWidth: 180,
        inputTips: "学员/姓名/帐号/手机号"
      }
    };
  },
  methods: {
    //导出
    exportFunction() {
      let start = "";
      let end = "";
      if (this.selectTime[0] && this.selectTime[1]) {
        start = new Date(this.selectTime[0]).Format("yyyy-MM-dd");
        end = new Date(this.selectTime[1]).Format("yyyy-MM-dd");
      }

      this.exportData["searchValue.start"] = start;
      this.exportData["searchValue.end"] = end;

      this.exportData.personalFileName = this.$utils.exportFormName([
        "云课堂(学分统计)"
      ]);
      if (this.exportDaysLimitByMonthCounts(start, end)) {
        this.updateExportParams();
        this._createReport(this.exportData);
      }
    },
    updateExportParams() {},
    //搜索
    searchData(keyword) {
      let start = "";
      let end = "";
      if (this.selectTime[0] && this.selectTime[1]) {
        start = new Date(this.selectTime[0]).Format("yyyy-MM-dd");
        end = new Date(this.selectTime[1]).Format("yyyy-MM-dd");
      }
      let searchValue = {
        keyword,
        start,
        end
      };
      this.$emit("searchData", searchValue);
    },
    //清空
    operate(event) {
      if (event.toElement.innerText === "导出") {
        this.exportFunction();
      } else {
        this.$emit("cleanCredit", "clean");
      }
    },
    //选择时间
    chooseTime(time) {
      this.selectTime = time;
    }
  },
  components: {
    VueDatepickerLocal,
    qwButton,
    searchInput
  }
};
</script>

<style scoped lang="scss">
.searchBox {
  padding-bottom: 40px;
  .qwui-chooseTimeBox {
    float: left;
    .datepicker {
      min-width: 135px;
      /deep/.datepicker-range {
        position: relative;
        min-width: 135px;
        .qwui-datetime {
          text-align: center;
          background: inherit;
          border: 1px solid #d5d5d5;
          border-radius: 2px;
          width: auto;
        }
        &.active .qwui-datetime {
          color: #f78b00;
          border-color: #f87b00;
        }
        .qwui-popup {
          margin-left: -50%;
          width: 450px;
          text-align: center;
          .calendar {
            margin-bottom: 40px;
            margin-right: 10px;
          }
          & .datepicker__buttons {
            margin-bottom: 10px;
            text-align: center;
            position: absolute;
            bottom: 0;
            left: 10%;
            right: 10%;
            .datepicker__button-cancel {
              border-radius: 4px;
            }
            .datepicker__button-select {
              border-radius: 4px;
              background: #C31725;
            }
          }
        }
      }
    }
  }
  .qwui-searchInput {
    float: left;
    margin: 0px 20px;
  }
  .qwui-buttonBox {
    float: right;
    /deep/ .qwui-button {
      border-radius: 4px;
      padding: 0 11px;
      vertical-align: middle;
      margin-left: 20px;
      span {
        display: inline-block;
        min-width: 46px;
        line-height: 30px;
      }
    }
    /deep/ .qwui-button .qwui-button_orange {
      background: #C31725;
      color: #fff;
      border-color: #f87b00;
      float: right;
      margin-left: 20px;
    }
    .qwui-button_disabled {
      cursor: auto;
      color: #999;
      background-color: #eee;
      border-color: #ccc;
    }
    .qwui-button_clear {
      border: 1px solid rgba(235, 94, 94, 1);
      color: #fff;
      background-color: #f56262;
    }
  }
}
</style>
