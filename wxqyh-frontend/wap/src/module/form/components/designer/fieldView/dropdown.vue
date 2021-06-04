<template>
  <div class="fieldView">
    <p class="fieldView-title">
      {{FieldItem.label}}
      <span v-show="FieldItem.validations.indexOf('presence')>-1" class="mustTip">*</span>
    </p>
    <div class="De-form-group">
      <input
        readonly
        type="text"
        class="De-form-input-lg"
        :value="choicesText"
        placeholder="请选择"
      >
      <span class="De-form-icon-arrow"></span>
    </div>

  </div>
</template>

<script>
  export default {
    name: "Dropdown",
    props: {
      FieldItem: {
        type: Object
      },
      index: {
        type: Number
      }
    },
    computed: {
      choicesText() {
        let selectedItem = ''
        this.FieldItem.choices.forEach(item => {
          if(item.selected){
            selectedItem = item.value
          }
        })
        return selectedItem
      }
    }
  }
</script>
