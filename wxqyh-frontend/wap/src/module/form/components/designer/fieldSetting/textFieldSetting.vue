<template>
  <div>
    <div class="fieldSet-content">
      <div v-if="settingConfig.label">
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
      </div>
      <div v-if="settingConfig.predefined">
        <h2 class="fieldSet-label">默认值</h2>
        <input
          type="text"
          class="De-form-input-lg"
          placeholder="请输入"
          v-model="fieldItem.predefined_value"
          maxlength= 30
        >
      </div>

      <div v-if="settingConfig.notes">
        <h2 class="fieldSet-label">提示</h2>
        <textarea
          class="De-form-input-lg"
          placeholder="请输入"
          v-model="fieldItem.notes"
          maxlength= 200
        >
      </textarea>
      </div>
    </div>
    <slot name="validations" v-if="settingConfig.validations"></slot>
    <button_group :fixed="true">
      <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
      <qwui_button type="primary" text="确定" @buttonClick="confirmSelected"></qwui_button>
    </button_group>
  </div>
</template>

<script>
  import { qwui_button, button_group } from '@/components/base/button'
  import {DesignerSetting} from '../data/DesignerSetting'

  export default {
    name: "TextFieldSetting",
    components: {
      qwui_button,
      button_group,
    },
    props: {
      currentData: {
        type: Object
      }
    },
    data() {
      return {
        fieldItem: null,
        addRedBorder: false
      }
    },
    computed: {
      settingConfig() {
        return DesignerSetting[this.currentData._type]
      }
    },
    methods: {
      confirmTitleEmpty() {
        this.addRedBorder = this.fieldItem.label ==='' ? true : false
      },
      cancelSelected() {
        this.$emit('cancelSelected')
      },
      confirmSelected() {
        this.$emit('confirmSelected',this.fieldItem)
      },
    },
    created() {
      this.fieldItem = Object.assign({},this.currentData)
    }
  }
</script>

<style lang="scss" scoped>
  @import "../css/fieldSetting";
</style>
