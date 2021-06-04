<template>
  <div>
    <p class="fieldView-title">
      {{FieldItem.label}}
      <span v-show="titleTip" class="titleTip">{{titleTip}}</span>
      <span v-show="FieldItem.validations.indexOf('presence')>-1" class="mustTip">*</span>
    </p>
    <input
      type="text"
      class="De-form-input-lg"
      disabled="disabled"
      :placeholder="FieldItem.notes"
      :value="FieldItem.predefined_value"
    >
  </div>
</template>

<script>

  export default {
    name: "TextField",
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
        let num_max = this.FieldItem.range_max
        let num_min = this.FieldItem.range_min
        let r_max = !Number.isNaN(Number.parseInt(num_max))
        let r_min = !Number.isNaN(Number.parseInt(num_min))
        if( min && max ) {
          return '（请输入' + min + '-' + max + '个字符）'
        }
        if(!min && max) {
          return '（请输入最多' + max + '个字符）'
        }
        if(min && !max) {
          return '（请输入最少' + min + '个字符）'
        }
        if(r_min && r_max) {
          return '（请输入' + num_min + '-' + num_max + '之间的数字）'
        }
        if(r_min && !r_max) {
          return '（请输入' + num_min + '及以上的数字）'
        }
        if(!r_min && r_max) {
          return '（请输入不大于' + num_max + '的数字）'
        }
        return ''
      }
    }
  }
</script>
