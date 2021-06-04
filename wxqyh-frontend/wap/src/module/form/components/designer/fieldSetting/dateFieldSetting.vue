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
      <div
        class="De-form-group"
        @click="showPicker"
      >
        <input
          readonly
          type="text"
          class="De-form-input-lg"
          placeholder="请选择"
          v-model="fieldItem.value"
          maxlength= 30
        >
        <span class="De-form-icon-arrow"></span>
      </div>
      <div class="De-form-special-date" v-if="showDateComponent">
        <date-field :field='field'  @change="changeDate"></date-field>
      </div>
      <h2 class="fieldSet-label">提示</h2>
      <textarea placeholder="请输入" class="De-form-input-lg" v-model="fieldItem.notes" maxlength= 200>
      </textarea>
    </div>
    <slot name="validations"></slot>
    <button_group :fixed="true">
      <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
      <qwui_button type="primary" text="确定" @buttonClick="confirmSelected"></qwui_button>
    </button_group>

    <picker
      ref="picker"
      :data="selects"
      @select="handleSelect(arguments)"
      :selectedIndex="[fieldItem.selected]"
      cancelTxt="取消"
      confirmTxt="确定"
    >
    </picker>
  </div>
</template>

<script>
import { qwui_button, button_group } from "@/components/base/button";
import DateField from "@/module/form/components/designer/core/mobiscroll/dateField";
import picker from '@/components/picker'
import * as timeUtil from "@/assets/js/time-util";
const date = [
  {
    text: "特定日期",
    value: '0'
  },
  {
    text: "填写当天",
    value: '1'
  },
  {
    text: "填写前一天",
    value: '2'
  },
  {
    text: "填写后一天",
    value: '3'
  }
]

export default {
  name: "DateFieldSetting",
  components: {
    qwui_button,
    button_group,
    DateField,
    picker
  },
  props: {
    currentData: {
      type: Object
    }
  },
  data() {
    return {
      fieldItem:{
        value: '特定日期',
        selected: ''
      },
      showDateComponent: true,
      field: {                 // 传入子组件数据
        help: true,
        value: '',
        validations: []
      },
      selects: [date],
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
    handleSelect(args) {
      this.fieldItem.selected = date[args[1][0]].value
      this.showDateComponent = this.fieldItem.selected == 0 ? true: false
      this.fieldItem.value = date[args[1][0]].text
      switch(this.fieldItem.selected) {
        case '1': this.fieldItem.predefined_value = timeUtil.changeFormat(new Date(), "yyyy-MM-dd"); break;
        case '2': this.fieldItem.predefined_value = timeUtil.changeFormat(new Date(new Date().getTime() - 24 * 3600 * 1000), "yyyy-MM-dd"); break;
        case '3': this.fieldItem.predefined_value = timeUtil.changeFormat(new Date(new Date().getTime() + 24 * 3600 * 1000), "yyyy-MM-dd"); break;
        case '0': this.fieldItem.predefined_value = this.field.value; break;
      }
    },
    showPicker() {
      this.$refs.picker.show()
    },
    changeDate(obj){
      this.field.value = obj.value
      this.fieldItem.predefined_value = this.field.value
    },
    confirmTitleEmpty() {
      this.addRedBorder = this.fieldItem.label ==='' ? true : false
    },
  },
  created() {
    this.fieldItem = Object.assign({}, this.currentData);
    if(!this.fieldItem.selected){
      this.$set(this.fieldItem,'selected','0')
      this.$set(this.fieldItem,'value','特定日期')
    }
    this.field.value = this.fieldItem.selected=='0'?this.fieldItem.predefined_value:''
    this.showDateComponent = this.fieldItem.selected == '0' ? true: false
  }
};
</script>

<style lang="scss" scoped>
@import "../css/fieldSetting";
.De-form-special-date{
  font-size: 15px;
  line-height: 40px;
  vertical-align: middle;
  margin-top: -24px;
  margin-bottom: 32px;
  padding-left: 15px;
  padding-right: 15px;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
}

</style>
