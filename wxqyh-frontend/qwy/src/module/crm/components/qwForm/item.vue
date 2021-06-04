 
<template>
  <div class="qw-form-item">
    <div class="item-left">
      <i v-if="required">*</i>
      <span>
        {{label}}
      </span>
    </div>
    <div class="item-right">
      <div class="item-right-content">
        <template v-if="type==='text'">
          <qw-input v-model="currentValue"
                    inputType="base"
                    :inputTips="currentPlaceholder"
                    @blur="onBlue"></qw-input>
        </template>
        <template v-else-if="type==='number'">
          <qw-form-number v-model="currentValue"
                          ref="number"
                          :type="subType"
                          :placeholder="currentPlaceholder"
                          @blur="onBlue"></qw-form-number>
        </template>
        <template v-else-if="type==='textarea'">
          <qw-input v-model="currentValue"
                    inputType="textarea"
                    :inputTips="currentPlaceholder"
                    @blur="onBlue"
                    :max-length="2000"></qw-input>
        </template>
        <template v-else-if="type==='date'">
          <datepicker v-model="currentValue"
                      :placeholder="currentPlaceholder"></datepicker>
        </template>
        <template v-else-if="type==='select'">
          <qw-select v-model="currentValue"
                     :placeholder="currentPlaceholder">
            <qw-option v-for="(item, index) in options"
                       :key="index"
                       :label="item.label"
                       :value="item.value"></qw-option>
          </qw-select>
        </template>
        <template v-else-if="type==='email'">
          <qw-input v-model="currentValue"
                    inputType="base"
                    :inputTips="currentPlaceholder"
                    @blur="onBlue"></qw-input>
        </template>
        <template v-else-if="type==='phone'">
          <qw-input v-model="currentValue"
                    inputType="base"
                    :inputTips="currentPlaceholder"
                    @blur="onBlue"></qw-input>
        </template>
        <template v-else-if="type==='pickImage'">
          <qw-upload-img @imageObj="coverImg"
                         :uploadConfig="uploadConfig"
                         @moreImgUpload="moreImgUpload">
            <span class="upload_tip_text c999"
                  slot="upload_tip_text">
              {{currentPlaceholder}}
            </span>
          </qw-upload-img>
        </template>
        <template v-else-if="type==='pickPerson'">
          <qw-form-pick-result v-model="currentValue"
                               @on-click="showPickPerson=true"
                               :placeholder="currentPlaceholder"
                               type="成员"></qw-form-pick-result>
          <pick-person :show="showPickPerson"
                       :defaultUsers="useUsers"
                       :functionTab="useTab"
                       :maxUser="max"
                       :onlyUser="true"
                       @chooseDone="chooseDone"
                       @closeThis="showPickPerson=false"></pick-person>
        </template>
        <template v-else-if="type==='checklist'">
          <qw-checkbox v-model="item.checked"
                       v-for="(item, index) in options"
                       :key="index"
                       :label="item.value">{{item.label}}</qw-checkbox>
        </template>
        <template v-else-if="type==='pickResult'">
          <qw-form-pick-result v-model="currentValue"
                               @on-click="onClickPick"
                               :placeholder="currentPlaceholder"
                               :type="subType"></qw-form-pick-result>
        </template>
      </div>
      <div class="item-right-warning"
           v-if="warning.show">{{warning.tips}}</div>
    </div>
  </div>
</template>
 
<script>
import QwInput from "@/components/qwuiBase/qwuiInput/qwuiInput";
import QwCheckbox from "@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox";
import Datepicker from "@/components/base/VueDatepickerLocal";
import { qwOption, qwSelect } from "crm/components/qwSelect";
import QwFormNumber from "./number";
import QwFormPickResult from "./pickResult";
import { phoneReg, emailReg } from "crm/utils/common";
import QwUploadImg from "@/components/Add/uploadImg/QwUploadImg";
import pickPerson from "@/components/pickPerson/pickPerson";
export default {
  name: "qwFormItem",
  components: {
    QwInput,
    Datepicker,
    QwFormNumber,
    qwOption,
    qwSelect,
    QwUploadImg,
    pickPerson,
    QwCheckbox,
    QwFormPickResult
  },
  props: {
    value: null,
    label: String,
    placeholder: String,
    required: {
      default: false,
      type: Boolean
    },
    type: {
      default: "text",
      type: String,
      validator(val) {
        return [
          "text",
          "number",
          "textarea",
          "date",
          "select",
          "email",
          "phone",
          "pickImage",
          "pickPerson",
          "checklist",
          "pickResult"
        ].includes(val);
      }
    },
    options: Array,
    subType: String,
    max: Number,
    min: Number
  },
  computed: {
    currentPlaceholder() {
      if (this.placeholder) {
        return this.placeholder;
      } else {
        let _obj = {
          text: "请输入",
          number: "请输入",
          phone: "请输入",
          email: "请输入",
          date: "请选择",
          textarea: "请选择",
          pickImage: "支持jpg、jpeg、png"
        };
        return _obj[this.type];
      }
    }
  },
  data() {
    return {
      currentValue: undefined,
      warning: {
        show: false,
        tips: ""
      },
      uploadConfig: {
        uploadFileId: dataBase.agentCode + "CoverImg",
        agent: "crm", //哪个模块agent
        // showType: "small",
        showType: "large",
        isMoreImg: false,
        // imageObj: {},
        moreList: []
      },
      useTab: [
        { text: "标签人员" },
        { text: "特定人员" },
        { text: "批量导入" }
      ],
      useUsers: [],
      showPickPerson: false
      // noBlueType: [
      //   "date",
      //   "select",
      //   "pickImage",
      //   "pickPerson",
      //   "checklist",
      //   "pickResult"
      // ] //没有失去焦点时间的组件类型
    };
  },
  watch: {
    value: {
      handler(val) {
        this.currentValue = val;
        if (val) {
          let funName = this.type + "Init";
          this[funName] && this[funName]();
        }
      },
      immediate: true
    },
    currentValue: {
      handler(val) {
        this.$emit("input", val);
        // if (this.noBlueType.includes(this.type)) {
        //   this.onBlue();
        // }
      },
      immediate: true
    }
  },
  created() {
    let funName = this.type + "Init";
    this[funName] && this[funName]();
  },
  mounted() {
    this.currentValue = this.value;
  },
  methods: {
    onClickPick() {
      this.$emit("on-click-pick");
    },
    chooseDone(dept, tag, user, position) {
      this.currentValue = user.map(item => {
        return Object.assign(item, {
          label: item.personName,
          value: item.userId,
          icon: item.headPic
        });
      });
      this.showPickPerson = false;
    },
    coverImg(data) {
      this.currentValue = [this.cloneDeep(data)];
    },
    moreImgUpload(data) {
      this.currentValue = data;
    },
    onBlue() {
      this.warning.show = false;
      this.$emit("on-blue");
      setTimeout(() => {
        let msg = this.valid();
        msg && this.showWarning(msg);
      });
    },
    showWarning(tips) {
      if (!tips) {
        this.warning.show = false;
        return;
      }
      this.warning = {
        show: true,
        tips
      };
    },
    valid() {
      if (!this.currentValue) {
        if (this.required) {
          return this.label + "不能为空";
        }
        return "";
      }

      let funName = this.type + "Valid";
      return (this[funName] && this[funName]()) || "";
    },
    numberValid() {
      return this.$refs.number.valid();
    },
    emailValid() {
      if (!emailReg.test(this.currentValue)) {
        return this.label + "格式错误";
      }
    },
    phoneValid() {
      if (!phoneReg.test(this.currentValue)) {
        return this.label + "格式错误";
      }
    },
    pickResultValid() {
      if (
        this.required &&
        (!this.currentValue || this.currentValue.length === 0)
      ) {
        return this.label + "不能为空";
      }
    },
    pickImageValid() {
      if (
        this.required &&
        (!this.currentValue || this.currentValue.length === 0)
      ) {
        return this.label + "不能为空";
      }
      if (
        this.max &&
        this.currentValue &&
        this.currentValue.length > this.max
      ) {
        return this.label + "数量超过最大限制";
      }
    },
    pickPersonValid() {
      if (
        this.required &&
        (!this.currentValue || this.currentValue.length === 0)
      ) {
        return this.label + "不能为空";
      }
    },
    pickImageInit(val = this.currentValue) {
      if (typeof val === "object" && this.type === "pickImage") {
        if (this.max && this.max === 1) {
          this.uploadConfig.imageObj = val[0];
        } else {
          this.uploadConfig.moreList = val;
        }
      }
      if (this.max && this.max > 1) {
        this.$set(this.uploadConfig, "isMoreImg", true);
      }
    },
    pickPersonInit(val = this.currentValue) {
      if (typeof val === "object" && this.type === "pickPerson") {
        this.useUsers = this.cloneDeep(val) || [];
      }
    },
    cloneDeep(val) {
      return JSON.parse(JSON.stringify(val));
    }
  }
};
</script>
<style lang="scss" scoped>
.qw-form-item {
  display: flex;
  // align-items: center;
  .item-left {
    line-height: 32px;
    text-align: right;
    margin-right: 20px;
    color: #383838;
    i {
      color: red;
      font-size: 13px;
    }
  }
  .item-right {
    &-content {
      display: flex;
      .upload_tip_text {
        margin-left: 12px;
      }
    }
    &-warning {
      color: #f56262;
      margin-top:3px; 
    }
  }
}
</style>
<style lang="scss">
.qw-form-item {
  .item-right {
    &-content {
      .qw-select {
        width: 340px;
        padding-left: 10px;
      }
      .datepicker {
        input {
          cursor: pointer;
          padding-left: 10px;
        }
      }
      .qwui-choose_person {
        .qwui-click_choose {
          width: 340px;
          height: 48px;
          .qwui-click_choose_word {
            line-height: 48px;
            cursor: pointer;
          }
        }
      }
      .textarea_wrap {
        .qw_textarea {
          padding: 6px 10px;
        }
      }
      .qwui-checkbox {
        line-height: 32px;
      }
    }
  }
}
</style>

