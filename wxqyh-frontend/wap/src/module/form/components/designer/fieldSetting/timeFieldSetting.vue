<template>
  <div>
    <div class="fieldSet-content">
      <h2 class="fieldSet-label">标题
        <span class="mustTip">*</span>
      </h2>
      <input type="text" 
        class="De-form-input-lg" 
        v-model="fieldItem.label"
        :class="addRedBorder?'red-border':''"
        @blur="confirmTitleEmpty"
        placeholder="请输入"
        maxlength= 30>
      <h2 class="fieldSet-label">默认值</h2>
      <div class="De-form-group">
        <time-field :field='field' @change="changeDate"></time-field>
        <span class="De-form-icon-arrow"></span>
      </div>
      <h2 class="fieldSet-label">提示</h2>
      <textarea
        class="De-form-input-lg"
        placeholder="请输入"
        v-model="fieldItem.notes"
        maxlength= 200
      >
      </textarea>
    </div>
    <slot name="validations"></slot>
    <button_group :fixed="true">
      <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
      <qwui_button type="primary" text="确定" @buttonClick="confirmSelected"></qwui_button>
    </button_group>
  </div>
</template>

<script>
import { qwui_button, button_group } from "@/components/base/button";
import TimeField from "@/module/form/components/designer/core/mobiscroll/timeField";
export default {
  name: "TimeFieldSetting",
  components: {
    qwui_button,
    button_group,
    TimeField
  },
  props: {
    currentData: {
      type: Object
    }
  },
  data() {
    return {
      field: {                 // 传入子组件数据
        help: true,
        value: '',
        validations: []
      },
      addRedBorder: false
    };
  },
  methods: {
    cancelSelected() {
      this.$emit("cancelSelected");
    },
    confirmSelected() {
      this.$emit("confirmSelected", this.fieldItem);
    },
    changeDate(obj){
      this.fieldItem.predefined_value = obj.value
      this.field.value = obj.value
    },
    confirmTitleEmpty() {
        this.addRedBorder = this.fieldItem.label ==='' ? true : false
    },
  },
  created() {
    this.fieldItem = Object.assign({}, this.currentData);
    this.field.value = this.fieldItem.predefined_value
  }
};
</script>

<style lang="scss" scoped>
@import "../css/fieldSetting";
.fieldSet-content /deep/ .field-content .text-field {
  display: block;
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 8px;
  margin-bottom: 36px;
  font-size: 15px;
}
</style>
