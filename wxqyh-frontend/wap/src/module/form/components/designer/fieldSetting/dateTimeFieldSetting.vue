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
      <h2 class="fieldSet-label">提示</h2>
      <textarea class="De-form-input-lg" v-model="fieldItem.notes" maxlength= 200>
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
export default {
  name: "DateTimeFieldSetting",
  components: {
    qwui_button,
    button_group
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
        validations: [],
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
    confirmTitleEmpty() {
        this.addRedBorder = this.fieldItem.label ==='' ? true : false
    },
  },
  created() {
    this.fieldItem = Object.assign({}, this.currentData);
  }
};
</script>

<style lang="scss" scoped>
@import "../css/fieldSetting";
</style>
