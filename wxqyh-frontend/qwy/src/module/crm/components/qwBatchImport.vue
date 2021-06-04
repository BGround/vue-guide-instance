<template>
  <qw-modal v-model="visible"
            :title="title"
            class="qw-batch-import"
            :zIndex="99"
            @on-confirm="onConfirm">
    <div class="import-container">
      <div class="import-steps">
        <div class="import-step step1">
          <span class="import-step-num">1</span>
          <a class="import-step-title"
             :href="step1.templateUrl||'javascript:void(0);'"
             @click="downloadTemplate">{{`点击下载《${step1.templateName}》`}}</a>
          <p class="import-step-tips">为保障粘贴信息被有效导入，请使用纯文本或数字</p>
        </div>

        <div class="import-step step2">
          <span class="import-step-num">2</span>
          <div class="import-step-title">导入编辑好的Excel文档
            <qw-popover ref="step2Popover"
                        placement="right"
                        :hover="true"
                        :gutter="8">
              <div slot="content"
                   class="import-step-popover">
                <p v-for="(item,index) in step2.tips"
                   :key="index">
                  {{item}}
                </p>
              </div>
              <i type="primary">?</i>
            </qw-popover>
          </div>
          <p class="import-step-tips">文件大小不超过2M</p>
          <label class="import-step-file">
            <input type="file"
                   ref="file"
                   @change="fileChange">
            <div class="import-step-file-label">
              <span>选择文件</span>
              <p>{{importFile&&importFile.name||'未选择任何文件'}}</p>
            </div>
          </label>
          <template v-if="step2&&step2.repeat">
            <div class="import-step-title">{{`选择“${step2.repeat.key}”重复时的操作`}}
              <qw-popover ref="step2Popover"
                          placement="right"
                          :hover="true"
                          :gutter="8">
                <div slot="content"
                     class="import-step-popover">
                  <p v-for="(item,index) in step2.repeat.tips"
                     :key="index">
                    {{item}}
                  </p>
                </div>
                <i>?</i>
              </qw-popover>
            </div>
            <qw-group-radio inline
                            :radio="repeatValue"
                            @radio="(val)=>{repeatValue=val}">
              <qw-radio :label="item"
                        v-for="(item,index) in step2.repeat.options"
                        :key="index">{{item}}</qw-radio>
            </qw-group-radio>
          </template>

          <qw-button type="primary"
                     @click="handlerImport">批量导入</qw-button>
        </div>

        <div class="import-step step3">
          <span class="import-step-num">3</span>
          <div class="import-step-title">导入结果：
          </div>
          <div class="import-step-result">
            <template v-if="step3.isFinish">
              <p>{{`已处理条数：${step3.processNum} / 总条数${step3.totalNum}`}}</p>
              <p>{{`导入失败条数：${step3.totalNum-step3.processNum}`}}</p>
              <qw-button type="primary"
                         @click="exportError">导出错误数据</qw-button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </qw-modal>
</template>

<script>
import QwModal from "crm/components/qwModal";
import QwButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
import QwRadio from "@/components/qwuiRadio/radio";
import QwGroupRadio from "@/components/qwuiRadio/radio_group";
import QwPopover from "./qwPopover";
export default {
  name: "QwBatchImport",
  components: {
    QwModal,
    QwButton,
    QwPopover,
    QwRadio,
    QwGroupRadio
  },
  props: {
    value: Boolean,
    title: {
      type: String,
      default: "数据导入"
    },
    step1: {
      type: Object,
      default: () => ({
        templateName: "导入模板",
        templateUrl: ""
      })
    },
    step2: {
      type: Object,
      default: () => ({
        tips: [
          //问号提示
          "【团队版】单个文档客户数不能多于100条；",
          "【尊享版】单个文档客户数不能多于2000条；"
        ]
        // repeat: {//重复
        //  tips: [
        //  " 覆盖导入：无条件替换旧数据",
        //  " 不导入：跳过重复数据，只导入新数据"
        //  ],
        //  options: ["覆盖导入", "不导入"]
        // }
      })
    },
    step3: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      visible: false,
      repeatValue: "",
      importFile: ""
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
  created() {
    this.init();
  },
  methods: {
    downloadTemplate() {
      if (!this.step1.templateUrl) {
        this.$emit("download-template");
      }
    },
    handlerImport() {
      if (!this.importFile) {
        dataBase.alert("提示", "请选择要上传的文件");
        return;
      }
      this.$emit("handler-import", {
        radio: this.repeatValue,
        file: this.importFile
      });
    },
    fileChange() {
      console.log("fileChange", this.$refs.file);
      this.importFile = this.$refs.file.files[0];
    },
    exportError() {
      this.$emit("export-error");
    },
    onConfirm() {
      this.$emit("on-confirm");
    },
    init() {
      if (this.step2.repeat && this.step2.repeat.options) {
        this.repeatValue = this.step2.repeat.options[0];
      }
      this.importFile = "";
      this.$refs.file && this.$refs.file.value
        ? (this.$refs.file.value = "")
        : undefined;
    }
  }
};
</script>

<style lang="scss" scoped>
.qw-batch-import {
  .import-container {
    width: 600px;
    height: 470px;
    display: flex;
    text-align: left;
    overflow-y: auto;
    .import-steps {
      flex: 1;
      margin: 20px 30px 20px 65px;
      .import-step {
        position: relative;
        padding-left: 35px;
        padding-bottom: 30px;
        border-left: 2px dotted #ccc;
        &.step3 {
          border-left: 0;
        }
        &-num {
          display: inline-block;
          width: 30px;
          height: 30px;
          position: absolute;
          left: -15px;
          top: 0;
          color: #fff;
          background-color: #ccc;
          font-size: 20px;
          border-radius: 50%;
          text-align: center;
        }
        &-title {
          padding: 5px 0;
          height: 1.5em;
          line-height: 1.5em;
          display: flex;
          i {
            display: inline-block;
            background-color: #ccc;
            color: #fff;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            font-size: 12px;
            text-align: center;
            line-height: 18px;
            margin-left: 5px;
            cursor: context-menu;
            &[type="primary"] {
              background-color: #f87b00;
            }
          }
        }
        a {
          color: #f87b00;
        }
        &-tips {
          color: #a6a6a6;
        }
        &-file {
          display: block;
          width: fit-content;
          input {
            opacity: 0;
            position: absolute;
          }
          &-label {
            margin: 15px 0;
            display: flex;
            align-items: center;
            color: #808080;
            cursor: pointer;
            span {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 2px;
              border: 1px solid #d5d5d5;
              margin-right: 5px;
            }
            p {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              flex: 1;
              max-width: 20em;
            }
          }
        }
        &-popover {
          background-color: #fff;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
          padding: 5px 10px;
          font-size: 12px;
          border-radius: 2px;
          color: #666;
          // border:1px solid #ccc;
          p::before {
            content: "";
            display: inline-block;
            width: 2px;
            height: 2px;
            background-color: #000;
            border-radius: 50%;
            margin-bottom: 2px;
            margin-right: 2px;
          }
        }
        .radio_group {
          width: min-content;
          margin-bottom: 10px;
        }
        &-result {
          p {
            margin: 5px 0 10px;
          }
        }
      }
    }
  }
}
</style>

