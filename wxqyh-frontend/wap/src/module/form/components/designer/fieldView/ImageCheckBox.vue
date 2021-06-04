<template>
  <div>
    <p class="fieldView-title">
      {{FieldItem.label}}
      <span v-show="FieldItem.validations.indexOf('presence')>-1" class="mustTip">*</span>
    </p>
    <p class="notes">{{FieldItem.notes}}</p>
  </div>
</template>

<script>

  export default {
    name: "ImageCheckBox",
    props: {
      FieldItem: {
        type: Object
      },
      index: {
        type: Number
      }
    },
  }
</script>
<style scoped>
  .notes {
    font-size:12px;
    color: #B2B9C8;
  }
</style>
