<template>
  <div>
    <p class="fieldView-title">
      {{FieldItem.label}}
      <span v-show="titleTip" class="titleTip">{{titleTip}}</span>
      <span v-show="FieldItem.validations.indexOf('presence')>-1" class="mustTip">*</span>
    </p>
    <textarea
      type="text"
      class="De-form-input-lg"
      disabled="disabled"
      :placeholder="FieldItem.notes"
      :value="FieldItem.predefined_value"
    ></textarea>
  </div>
</template>

<script>

  export default {
    name: "TextArea",
    props: {
      FieldItem: {
        type: Object
      },
      index: {
        type: Number
      }
    },
    computed: {
      titleTip() {
        let max = this.FieldItem.maximum_length
        let min = this.FieldItem.minimum_length
        if( min && max ) {
          return '（请输入' + min + '-' + max + '个字符）'
        }
        if(!min && max) {
          return '（请输入最多' + max + '个字符）'
        }
        if(min && !max) {
          return '（请输入最少' + min + '个字符'
        }
        return ''
      }
    }
  }
</script>
