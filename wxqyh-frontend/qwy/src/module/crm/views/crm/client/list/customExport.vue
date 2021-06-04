<template>
  <div class="exportPage">
    <export
      v-model="showExport"
      :exportOption="dealSearchOption"
      @delete-option="dealDeleteOption"
      @change-date="dealChangeDate"
      :exportCount="exportCount"
      @on-confirm="exportConfirm"
    >
      <crm-tab
        @tabClick="tabClick"
        v-show="isVip"
        :checkboxSwitch="true"
        defaultTabName="clientList"
        @change="changeTabCheckBox"
        ref="tabs"
      >
        <crm-tab-item
          v-for="(item,index) in tabData"
          :label="item.label"
          :name="item.name"
          :checked="item.isChecked"
          :disabled="item.isDisabled"
          :key="index"
        ></crm-tab-item>
      </crm-tab>
      <qw-title-checkbox
        v-for="(item, index) in groupList"
        :key="index"
        :curIndex="index"
        v-model="item.value"
        :title="item.title"
        :checkboxList="item.optionVOList"
        v-show="isVip"
        @checkedHandle="checkedHandle"
      ></qw-title-checkbox>
    </export>
  </div>
</template>

<script>
import Export from "@/module/crm/components/crm-export";
import QwTitleCheckbox from "@/components/exportComponents/qw-titleCheckbox.vue";
import CrmTab from "@/module/crm/components/qw-tab/tab/tab";
import CrmTabItem from "@/module/crm/components/qw-tab/tabItem/tabItem";
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
    QwTitleCheckbox,
    CrmTab,
    CrmTabItem
  },
  props: {
    value: Boolean,
    exportOption: {
      type: [Array, Object]
    },
    exportCount: Number,
    searchOption: [Array, Object],
    isVip: Boolean,
    oldExportOption: [Array, Object]
  },
  data() {
    return {
      showExport: false, //是否显示导出组件
      dealExportList: [],
      groupList: [], //当前tab的选项
      checkOption: {
        //保存选项的状态值
        "searchValue.checkClientOption": [],
        "searchValue.checkContactOption": [],
        "searchValue.checkBusinessOption": [],
        "searchValue.checkVisitOption": []
      },
      tabType: "clientList", //当前tab类型
      tabData: [
        //tab的值
        {
          label: "客户",
          name: "clientList",
          isChecked: true,
          isDisabled: true
        },
        {
          label: "联系人",
          name: "contactList",
          isChecked: false,
          isDisabled: false
        },
        {
          label: "商机",
          name: "businessList",
          isChecked: false,
          isDisabled: false
        },
        {
          label: "拜访",
          name: "visitList",
          isChecked: false,
          isDisabled: false
        }
      ],
      oldTabData: [], //tab值的复制
      isClearHandle: false, //取消checkbox时清除选项状态的值
      hasConfirmExport: false, //是否点击了导出的确定按钮
      oldSearchOption: [],
      dealSearchOption: []
    };
  },
  created() {
    this.showExport = this.value;
  },
  watch: {
    value(newV) {
      this.showExport = newV;
    },
    searchOption(list) {
      this.dealSearchOption = JSON.parse(JSON.stringify(list));
    },
    showExport(newV) {
      this.$emit(EVENT_INPUT, newV);
      if (newV) {
        this.hasConfirmExport = false;
        //保存旧的tab数据
        this.oldTabData = this.tabData.map(item => {
          return { ...item };
        });
        //缓存就得搜索数据
        this.oldSearchOption =
          this.dealSearchOption.length > 0
            ? this.dealSearchOption.map(item => {
                return { ...item };
              })
            : this.searchOption.map(item => {
                return { ...item };
              });
      } else {
        if (!this.hasConfirmExport) {
          this.tabData = this.oldTabData.map(item => {
            return { ...item };
          });
          this.dealSearchOption = this.oldSearchOption.map(item => {
            return { ...item };
          });
        }
      }
    },
    exportOption(list) {
      this.groupList = JSON.parse(JSON.stringify(list[this.tabType]));
      //初始化选中的值
      let copyExpotion = JSON.parse(localStorage.getItem("copyExpotion"));
      Object.keys(list).forEach(key => {
        let valArr = [];
        list[key].forEach(item => {
          valArr.push(...item.value);
        });
        if (valArr.length) {
          let tab = this.tabData.find(tab => tab.name == key);
          tab && (tab.isChecked = true);
          this.renderCheckData(list[key], key);
        }
        if (copyExpotion) {
          Object.keys(copyExpotion).forEach(copyKey => {
            if (copyKey == key) {
              list[key] = copyExpotion[copyKey].map(item => {
                return { ...item };
              });
            }
          });
        }
      });
      //初始化tab
      this.$refs.tabs.tabIndex = 0;
      this.$refs.tabs.tabName = "clientList";
      //初始化时间

      if (this.searchOption.length == 1) {
        let time = this.searchOption[0].value;
        this.dealChangeDate(time[0], time[1]);
      }
    }
  },
  methods: {
    //删除搜索项
    dealDeleteOption(keyValue) {
      let deleteIndex;
      this.dealSearchOption.forEach((item, index) => {
        if (item.key === keyValue) {
          deleteIndex = index;
        }
      });
      if (deleteIndex + 1 > 0) {
        this.dealSearchOption.splice(deleteIndex, 1);
      }
      //this.$emit('renderTable',keyValue)
    },
    //改变搜索日期
    dealChangeDate(startTime, endTime) {
      this.$emit("renderTable", 7, startTime, endTime);
    },
    //确定导出
    exportConfirm() {
      //记录未被选中的模块
      let copyExpotion = {};
      this.tabData.forEach(tab => {
        if (!tab.isChecked) {
          copyExpotion[tab.name] = [...this.exportOption[tab.name]];
        }
      });
      localStorage.setItem("copyExpotion", JSON.stringify(copyExpotion));
      this.hasConfirmExport = true;
      //如果导出搜索项有删减就重置搜索项的值
      if (this.dealSearchOption.length < this.oldSearchOption.length) {
        let arr = this.dealSearchOption.map(newData => newData.title);
        let filterList = this.oldSearchOption.map(old => {
          if (!arr.includes(old.title)) {
            return old;
          }
        });
        filterList.forEach(item => {
          item && this.$emit("renderTable", item.key);
        });
      }
      //确定导出
      this.$emit("exportConfirm", this.checkOption);
    },
    //字段选择事件
    checkedHandle(i, val) {
      this.groupList[i].value = val;
      this.exportOption[this.tabType] = [...this.groupList];
      let tab = this.tabData.find(tab => tab.name == this.tabType);
      if (tab && tab.isChecked) {
        this.renderCheckData();
      }
    },
    //切换tab
    tabClick({ index, name }) {
      let {
        businessList,
        clientList,
        contactList,
        visitList
      } = this.exportOption;
      let obj1 = {
        clientList: clientList,
        contactList: contactList,
        visitList: visitList,
        businessList: businessList
      };
      this.groupList = obj1[name];
      this.tabType = name;
      //this.groupList ? this.renderCheckData() : []
    },
    //重新渲染选中的字段
    renderCheckData(arr, type) {
      arr = arr || this.groupList;
      type = type || this.tabType;
      let obj = {
        clientList: () => {
          this.checkOption["searchValue.checkClientOption"] = [];
          this.dealData(arr, "checkClientOption");
        },
        contactList: () => {
          this.checkOption["searchValue.checkContactOption"] = [];
          this.dealData(arr, "checkContactOption");
        },
        businessList: () => {
          this.checkOption["searchValue.checkBusinessOption"] = [];
          this.dealData(arr, "checkBusinessOption");
        },
        visitList: () => {
          this.checkOption["searchValue.checkVisitOption"] = [];
          this.dealData(arr, "checkVisitOption");
        }
      };
      obj[type]();
      this.isClearHandle = false;
    },
    dealData(arr, str) {
      if (!this.isClearHandle) {
        arr.forEach(item => {
          this.checkOption[`searchValue.${str}`].push(...item.value);
        });
      }
    },
    //改变tab的checkbox
    changeTabCheckBox({ index, value }) {
      this.tabData[index].isChecked = !value;
      let type = this.tabData[index].name;
      let arr = this.exportOption[type];
      if (value) {
        this.isClearHandle = true;
      }
      if (this.tabData[index].name != this.tabType) {
        this.renderCheckData(arr, type);
      } else {
        this.renderCheckData();
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.exportPage {
  /deep/ .crmExport {
    /deep/.labelContainer {
      height: 32px !important;
      line-height: 32px !important;
    }
    /deep/ .modal-container {
      /deep/ .exportDataContent {
        padding: 0 28px;
        margin-top: 12px;
      }
    }
    /deep/.qw-mask {
      z-index: 2 !important;
    }
    /deep/.datepicker:before {
      right: -7px;
    }
  }
  /deep/ .titleCheckbox {
    margin-bottom: 24px;
  }
  /deep/ .qwui-tab {
    margin-bottom: 24px;
    /deep/.qwui-tab-header--block {
      height: 40px;
      /deep/.qwui-tab-header {
        line-height: 40px;
      }
    }
  }
}
</style>