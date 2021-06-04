<template>
  <div class="personalReport">
    <div class="header">人事统计报表</div>
    <div class="table_header">
      <span class="name">名称</span>
      <span class="operate">操作</span>
    </div>
    <div class="table_body">
      <ul>
        <li v-for="(item, i) in reportList" :key="i">
          <span class="name">{{item.name}}</span>
          <span class="operate" @click="downLoad(i+1)">下载</span>
        </li>
      </ul>
    </div>
    <!-- 选人弹窗 -->
    <div v-show="showAletBox">
      <funcBox
        boxTitle="下载报表"
        firstBtn="生成Excel"
        secondBtn="取消"
        boxWidth="500"
        @secondFunc="close"
        @closeBox="close"
        @firstFunc="ok"
      >
        <div class="alert_content">
          <span class="desc">部门选择</span>
          <auto-choose
            :EVENT_BUS="EVENT_BUS"
            :objVal="definedPersonObj"
            :keyName="'definedPersonObj'"
          ></auto-choose>
        </div>
      </funcBox>
    </div>
    <div class="page">
      <page :pageData="pageData"></page>
    </div>
  </div>
</template>
<script>
import autoChoose from "./autoChoosePerson";
import funcBox from "@/components/list/funcBox";
import page from "@/components/list/page";
import { createEventBus } from "../../utils";
import exportReportForm from "@/assets/js/export/export.js";
export default {
  name: "personalReport",
  mixins: [exportReportForm],
  components: {
    autoChoose,
    funcBox,
    page
  },
  data() {
    return {
      pageData: {
        page: 1,
        pageSize: 10,
        maxPage: 1,
        totalRows: 2
      },
      reportList: [
        { name: " 近12月各部门人员进出统计报表" },
        { name: " 近30周各部门人员进出统计报表" }
      ],
      EVENT_BUS: createEventBus(),
      definedPersonObj: {
        "markSetting[0].viewUserIds": [],
        "markSetting[0].viewDeptIds": [],
        "markSetting[0].postId": {}
      },
      showAletBox: false,
      //每一个组件的数组
      fields: [],
      params: {
        reportType: "hrmanagement_report_personnel",
        "searchValue.departIds": "",
        "searchValue.type": 1 //1月，2周
      }
    };
  },
  created() {
    //保存每一个组件示例
    this.EVENT_BUS.$on("on-form-item-add", field => {
      if (field) this.fields.push(field);
      return false;
    });
    //监听组件的销毁事件
    this.EVENT_BUS.$on("on-form-item-remove", field => {
      if (field) this.fields.splice(this.fields.indexOf(field), 1);
      return false;
    });
    // 处理返回值
    this.EVENT_BUS.$on("on-set-form-data", payload => {
      this.setFormData(payload);
    });
    //改变侧边栏状态
    this.$store.commit("leftSide/active", "HRReport");
  },
  methods: {
    downLoad(type) {
      this.params["searchValue.type"] = type;
      this.showAletBox = true;
      this.definedPersonObj["markSetting[0].viewDeptIds"] = [];
    },
    close() {
      //保存每一个组件示例
      this.fields[0].showValidate = false
      this.showAletBox = false;
      this.definedPersonObj["markSetting[0].viewDeptIds"] = [];
    },
    ok() {
      let validatePass = true;
      this.fields.forEach((field, index) => {
        if (index == 1) {
          field.confirm().then(obj => {
            if (!obj.status) {
              validatePass = false;
            }
          });
        } else {
          field.validate().then(obj => {
            if (!obj.status) {
              validatePass = false;
            }
            if (index == this.fields.length - 1 && validatePass) {
              this._createReport(this.params);
              this.showAletBox = false;
            }
          });
        }
      });
    },
    setFormData(payload) {
      this.fields[0].showValidate = false
      this.definedPersonObj["markSetting[0].viewDeptIds"] =
        payload.value["markSetting[0].viewDeptIds"];
      let viewDeptId = this.handlePeopleId(
        this.definedPersonObj["markSetting[0].viewDeptIds"],
        "nodeId"
      );
      this.params["searchValue.departIds"] = viewDeptId;
    },
    handlePeopleId(array, id) {
      let idArray = [];
      array.forEach(item => {
        idArray.push(item[id]);
      });
      return idArray.join(",");
    }
  }
};
</script>
<style lang="scss" scoped>
.personalReport {
  margin-top: 100px;
  border: 1px solid #ddd;
  .header {
    width: 78.5%;
    position: absolute;
    top: 20px;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
    font-size: 20px;
  }
  .table_header {
    display: flex;
    width: 100%;
    background-color: #eee;
    border-bottom: 1px solid #ddd;
    .name {
      flex: 1;
    }
    span {
      padding: 15px 10px;
      &:first-child {
        border-right: 1px solid #ddd;
        text-align: left;
      }
      &:last-child {
        min-width: 100px;
        text-align: center;
      }
    }
  }
  .table_body {
    width: 100%;
    li {
      display: flex;
      &:first-child {
        border-bottom: 1px solid #ddd;
      }
    }
    span {
      padding: 15px 10px;
      &:first-child {
        border-right: 1px solid #ddd;
        text-align: left;
        flex: 1;
      }
      &:last-child {
        min-width: 100px;
        text-align: center;
        color: #C31725;
        cursor: pointer;
      }
    }
  }
  /deep/ .close {
    right: 20px !important;
  }
  /deep/ .alert_content {
    position: relative;
    padding: 40px 5px;
    background: #fff;
    .desc {
      position: absolute;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
    }
  }
  /deep/ .qwui-form_item_hasLabel > .qwui-form_item_content {
    margin-left: 110px;
  }
  /deep/ .qwui-click_choose {
    width: 335px;
  }
  .page {
    position: relative;
  }
  /deep/ .pager-nav {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
  }
}
</style>
