<template>
  <p class="sectionBreakView">{{FieldItem.label}}</p>
</template>

<script>
  export default {
    name: "sectionBreak",
    props: {
      FieldItem: {
        type: Object
      },
      index: {
        type: Number
      }
    },
    data() {
      return {
      }
    }
  }
</script>

<style scoped>
  .sectionBreakView {
    font-size: 12px;
    padding-top: 10px;
    margin-top: 12px;
    margin-bottom: 16px;
    color: #B2B9C8;
    border-top: 1px dashed #E4E4E8;
  }
</style>
