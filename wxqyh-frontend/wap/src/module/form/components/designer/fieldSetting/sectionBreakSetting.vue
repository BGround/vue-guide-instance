<template>
  <div>
    <slot name="currentType"></slot>
    <div class="fieldSet-content">
      <h2 class="fieldSet-label">标题
      </h2>
      <textarea
        type="text"
        class="De-form-input-lg"
        :class="addRedBorder?'red-border':''"
        @blur="confirmTitleEmpty"
        placeholder="请输入"
        v-model="fieldItem.label"
        maxlength= 200
      ></textarea>
    </div>
    <button_group :fixed="true">
      <qwui_button type="default" text="取消" @buttonClick="cancelSelected"></qwui_button>
      <qwui_button type="primary" text="确定" @buttonClick="confirmSelected"></qwui_button>
    </button_group>
  </div>
</template>

<script>
  import { qwui_button, button_group } from '@/components/base/button'

  export default {
    name: "TextAreaSetting",
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
    methods: {
      cancelSelected() {
        this.$emit('cancelSelected')
      },
      confirmSelected() {
        this.$emit('confirmSelected',this.fieldItem)
      },
      confirmTitleEmpty() {
        this.addRedBorder = this.fieldItem.label ==='' ? true : false
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
