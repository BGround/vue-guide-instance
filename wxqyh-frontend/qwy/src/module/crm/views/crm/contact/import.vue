<template>
  <qw-batch-import v-model="visible"
                   class="competitor-import"
                   :step1="step1"
                   :step2="step2"
                   :step3="step3"
                   @handler-import="handlerImport"
                   @export-error="exportError"
                   @on-confirm="visible = false">
  </qw-batch-import>
</template>
<script>
import QwBatchImport from "crm/components/qwBatchImport";
import {
  importTemplateUrl,
  batchImportContact,
  viewImportProcess,
  getExportErrorUrl
} from "crm/api/contact";
export default {
  name: "ContactImport",
  components: {
    QwBatchImport
  },
  props: {
    value: Boolean
  },
  data() {
    return {
      visible: false,
      step1: {
        templateName: "联系人批量导入模板",
        templateUrl: importTemplateUrl
      },
      step2: {
        tips: [
          //问号提示
          "【团队版】单个文档中联系人数不能多于100条；",
          "【尊享版】单个文档中联系人数不能多于2000条；"
        ],
        repeat: {
          key: "手机号码",
          tips: [
            " 覆盖导入：无条件替换旧数据",
            " 不导入：跳过重复数据，只导入新联系人",
          ],
          options: ["覆盖导入", "不导入"]
        }
      },
      step3: {}
    };
  },
  watch: {
    value: {
      handler(val) {
        this.visible = val;
      },
      immediate: true
    },
    visible(val) {
      this.$emit("input", val);
      if (!val) {
        this.init();
      }
    }
  },
  methods: {
    //导入
    handlerImport(data) {
      let _alert = dataBase.alert;
      let formData = new FormData();
      let type = this.step2.repeat.options.indexOf(data.radio) == '0' ? 1 : 0
      formData.append("upFile", data.file);
      formData.append("type", type);
      dataBase.loading = true;
      batchImportContact(formData)
        .then(res => {
          if (res.code == 0) {
            this.step3.resultId = res.data.id;
            this.getImportResult();
          } else {
            dataBase.loading = false;
            _alert("提示", res.desc);
          }
        })
        .catch(err => {
          dataBase.loading = false;
          _alert("提示", (err && err.desc) || "网络错误");
        });
    },
    //查询导入结果
    getImportResult() {
      viewImportProcess(this.step3.resultId)
        .then(res => {
          if (res.code == 0) {
            if (res.data.isFinish) {
              this.step3 = Object.assign({}, this.step3, res.data);
              dataBase.loading = false;
              this.$emit("import-finish");
            } else {
              setTimeout(this.getImportResult, 2000);
            }
          } else {
            _.alert("提示", res.desc);
            dataBase.loading = false;
          }
        })
        .catch(err => {
          dataBase.loading = false;
          _.alert("提示", "网络错误");
        });
    },
    //导出错误结果
    exportError() {
      window.location.href = getExportErrorUrl(this.step3.resultId);
    },
    init() {
      this.step3 = {};
    }
  }
};
</script>


