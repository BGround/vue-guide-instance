<template>
  <div>
    <p class="fieldView-title">
      {{FieldItem.label}}
      <span v-show="FieldItem.validations.indexOf('presence')>-1" class="mustTip">*</span>
    </p>
    <span
      class="icon"
      :class="icon"
      v-for="item in FieldItem.choices"
    >
      </span>
  </div>
</template>

<script>
  export default {
    name: "RatingField",
    props: {
      FieldItem: {
        type: Object
      },
      index: {
        type: Number
      }
    },
    computed: {
      icon() {
        return 'ic_a-form_'+ this.FieldItem.rating_type
      }
    }
  }
</script>
<style lang="scss" scoped>
  .icon {
    margin-right: 14px;
  }
</style>
