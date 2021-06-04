<template>
  <div>
    <slot name="currentType"></slot>
    <div class="fieldSet-content">
      <h2 class="fieldSet-label">标题
        <span class="mustTip">*</span>
      </h2>
      <input
        type="text"
        class="De-form-input-lg"
        :class="addRedBorder?'red-border':''"
        @blur="confirmTitleEmpty"
        placeholder="请输入"
        v-model="fieldItem.label"
        maxlength= 30
      >

      <choices-box
        :currentType="fieldItem._type"
        :CurrentChoices="CurrentChoices"
        @choicesChanged="choicesChanged"
      >
      </choices-box>

      <div v-if="fieldItem._type!==DesignerMap.DropDown">
        <h2 class="fieldSet-label">排列方式</h2>
        <div
          class="De-form-group"
          @click="showPicker"
        >
          <span class="De-form-input-lg">{{arrangeText[fieldItem.line_row]}}</span>
          <span class="De-form-icon-arrow"></span>
        </div>
      </div>
    </div>
    <slot name="validations"></slot>
    <button_group :fixed="true">
      <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
      <qwui_button type="primary" text="确定" @buttonClick="confirmSelected"></qwui_button>
    </button_group>

    <picker
      ref="picker"
      :data="arrange"
      :selectedIndex="[fieldItem.line_row-1]"
      @select="handleSelect(arguments)"
      cancelTxt="取消"
      confirmTxt="确定"
    >
    </picker>
  </div>
</template>

<script>
  import { qwui_button, button_group } from '@/components/base/button'
  import choicesBox from "../core/choices"
  import picker from '@/components/picker'
  import DesignerMap from '../data/DesignerMap'
  const arrangeText = {
    1: '一行一列',
    2: '一行两列',
    3: '一行三列',
  }
  const arrange = [
    {text: arrangeText[1], value: 1},
    {text: arrangeText[2], value: 2},
    {text: arrangeText[3], value: 3},
  ]


  export default {
    name: "radioButtonSetting",
    components: {
      qwui_button,
      button_group,
      choicesBox,
      picker,
    },
    props: {
      currentData: {
        type: Object
      }
    },
    data() {
      return {
        fieldItem: null,
        CurrentChoices: null,
        arrangeText,
        DesignerMap,
        arrange: [arrange],
        addRedBorder: false
      }
    },
    methods: {
      cancelSelected() {
        this.$emit('cancelSelected')
      },
      confirmSelected() {
        this.$emit('confirmSelected',this.fieldItem)
      },
      choicesChanged(val) {
        this.fieldItem.choices = [...val]
      },
      handleSelect(args) {
        this.fieldItem.line_row = arrange[args[1][0]].value
      },
      showPicker() {
        this.$refs.picker.show()
      },
      confirmTitleEmpty() {
        this.addRedBorder = this.fieldItem.label ==='' ? true : false
      },
    },
    created() {
      this.fieldItem = Object.assign({},this.currentData)
      this.CurrentChoices = [...this.fieldItem.choices]
    }
  }
</script>

<style lang="scss" scoped>
  @import "../css/formDesigner";
  @import "../css/fieldSetting";
</style>
