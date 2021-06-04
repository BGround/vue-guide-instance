<template>
  <export v-model="showExport"
          :exportOption="dealExportList"
          @delete-option="dealDeleteOption"
          @change-date="dealChangeDate"
          :exportCount="exportCount">

  </export>
</template>

<script>
import Export from "@/module/crm/components/crm-export";
import QwTitleCheckbox from "components/exportComponents/qw-titleCheckbox.vue";
const EVENT_INPUT = "input";
const GROUP_LIST = [
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
];

export default {
  components: {
    Export,
    QwTitleCheckbox
  },
  props: {
    value: Boolean,
    exportOption: {
      type: Array
    },
    exportCount: Number
  },
  data() {
    return {
      showExport: false,
      dealExportList: [],
      groupList: []
    };
  },
  created() {
    this.showExport = this.value;
  },
  watch: {
    value(newV) {
      this.showExport = newV;
    },
    showExport(newV) {
      this.$emit(EVENT_INPUT, newV);
    },
    exportOption(list) {
      this.dealExportList = JSON.parse(JSON.stringify(list));
    }
  },
  computed: {},
  methods: {
    dealDeleteOption(keyValue) {
      let deleteIndex;
      this.dealExportList.forEach((item, index) => {
        if (item.key === keyValue) {
          deleteIndex = index;
        }
      });
      if (deleteIndex) {
        this.dealExportList.splice(deleteIndex, 1);
      }
      console.log("keyvalue", keyValue);
    },
    dealChangeDate(startTime, endTime) {
      console.log(startTime, endTime);
    }
  }
};
</script>
<style lang='scss' scoped>
</style>