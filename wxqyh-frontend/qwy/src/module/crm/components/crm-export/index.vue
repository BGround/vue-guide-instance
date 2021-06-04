<template>
  <qw-modal class="crmExport"
            v-model="visible"
            :title="title"
            :width="modalWidth"
            :zIndex="2"
            @on-confirm="onConfirm">
    <div :class="exportCount===0 ? 'modal-container_noData' : 'modal-container'">
      <div v-show="exportCount != 0"
           class="exportCountContainer">已选数据：
        <span class="count">{{exportCount}}</span>
      </div>
      <div v-show="exportCount === 0"
           class="label-content">
        <qw-label v-for="(item, index) in dealExportList"
                  :key="index"
                  :keyValue="item.key"
                  :canClose="item.canClose"
                  @close="dealClose">
          <span class="title">{{item.title}}：</span>
          <span v-if="item.type==='text'">{{item.value}}</span>
          <span class="value"
                v-if="item.type === 'date'">
            <span>{{item.value[0]}}</span>
            <span>&nbsp;-&nbsp;</span>
            <span>{{item.value[1]}}</span>
          </span>
          <date-picker v-if="item.type==='datePicker'"
                       class="date-picker-width"
                       v-model="item.value"
                       rangeSeparator="至"
                       :showButtons="true"
                       @confirm="dateConfirm"
                       ref="searchDate"></date-picker>
        </qw-label>
      </div>
      <div class="exportDataContent">
        <slot></slot>
        <!-- <crm-tab>
          <crm-tab-item label="客户"
                        name="client">客户</crm-tab-item>
          <crm-tab-item label="联系人"
                        name="contact">联系人</crm-tab-item>
        </crm-tab> -->
        <!-- <qw-title-checkbox v-for="(item, index) in groupList"
                           :key="index"
                           v-model="item.value"
                           :title="item.title"
                           :checkboxList="item.optionVoList"></qw-title-checkbox> -->
      </div>
    </div>
  </qw-modal>
</template>

<script>
import QwModal from "@/module/crm/components/qwModal";
import QwLabel from "components/exportComponents/qw-label.vue";
import DatePicker from "components/base/VueDatepickerLocal";
import QwTitleCheckbox from "components/exportComponents/qw-titleCheckbox.vue";
import CrmTab from "@/module/crm/components/qw-tab/tab/tab";
import CrmTabItem from "@/module/crm/components/qw-tab/tabItem/tabItem";
const MODAL_WIDTH = 800;
const EVENT_DELETE_OPTION = "delete-option";
const EVENT_CHANGE_DATE = "change-date";
export default {
  components: {
    QwModal,
    QwLabel,
    DatePicker,
    CrmTabItem,
    QwTitleCheckbox,
    CrmTab
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    exportOption: {
      type: Array
    },
    exportCount: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.dealExportList = JSON.parse(JSON.stringify(this.exportOption))
  },
  data() {
    return {
      title: "导出",
      modalWidth: MODAL_WIDTH,
      dealExportList: [],
      clientGroup1: false,
      groupList: [
        {
          title: "客户基本信息",
          optionVoList: [
            {
              label: "客户名称",
              value: "clientName"
            },
            {
              label: "客户类别",
              value: "clientType"
            },
            {
              label: "所属公海",
              value: "sea"
            },
            {
              label: "客户编码",
              value: "id"
            },
            {
              label: "行业",
              value: "industry"
            },
            {
              label: "区域",
              value: "area"
            }
          ],
          value: ["clientName", "clientType", "sea", "id", "industry", "area"]
        }
      ]
    };
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(newV) {
        this.$emit("input", newV);
      }
    }
  },
  watch: {
    dealExportList(list) {
      list.forEach((item, index) => {
        let canClose = item.key ? true : false;
        this.$set(item, "canClose", canClose);
      });
    },
    exportOption: {
      deep:  true,
      handler(list) {
        this.dealExportList = JSON.parse(JSON.stringify(list))
      }
    }
    // exportOption(list) {
    //   console.log(123)
    //   this.dealExportList = JSON.parse(JSON.stringify(list));
    // }
  },

  methods: {
    dealClose(keyValue) {
      let deleteIndex;
      this.dealExportList.forEach((item, index) => {
        if (item.key == keyValue) {
          deleteIndex = index;
        }
      });
      if (deleteIndex + 1 > 0) {
        this.dealExportList.splice(deleteIndex, 1);
      }
      this.$emit(EVENT_DELETE_OPTION, keyValue);
    },

    dateConfirm(val) {
      let startTime = new Date(val[0]);
      let endTime = new Date(val[1]);

      let formated_startTime = `${startTime.getFullYear()}-${startTime.getMonth() +
        1}-${startTime.getDate()}`;
      let formated_endTime = `${endTime.getFullYear()}-${endTime.getMonth() +
        1}-${endTime.getDate()}`;
      this.$emit(EVENT_CHANGE_DATE, formated_startTime, formated_endTime);
    },
    onConfirm() {
      this.$emit("on-confirm");
    }
  }
};
</script>
<style lang='scss' scoped>
.crmExport {
  .modal-container_noData {
    padding: 10px 0 20px;
    min-height: 310px;
  }
  .modal-container{
    padding: 10px 0 20px;
  }
  .exportCountContainer {
    text-align: left;
    color: #808080;
    font-size: 13px;
    padding: 0 28px 10px;
    border-bottom: 1px solid #f7f7f7;
    .count {
      color: #383838;
    }
  }
  .label-content {
    min-height: 44px;
    box-sizing: border-box;
    text-align: left;
    padding: 0 28px;
    .title {
      color: #999;
      margin-right: 5px;
    }
  }
  .exportDataContent {
    text-align: left;
    .title {
      display: inline-block;
      line-height: 18px;
      height: 18px;
      font-weight: 600;
    }
  }
}
.date-picker-width {
  min-width: 200px;
}
.date-picker-width /deep/ input {
  border: none;
  height: 28px;
  font-size: 12px;
  padding-left: 0;
}
.date-picker-width /deep/ .datepicker-popup {
  margin-top: 5px;
}
</style>
