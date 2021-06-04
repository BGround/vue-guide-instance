<!--左边部分字段类型选择-->
<template>
  <div class="fieldTypeBox">
    <div v-for="FieldType in FieldTypes">
      <p>{{ FieldType.title }}</p>
      <div v-for="Field in FieldType.data" @click="publishCurrentType(Field.type)">
        <span>{{ Field.icon }}</span>
        <p>{{ Field.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import FieldTypes from '../data/FieldTypeBox'

  export default {
    name: "fieldTypeBox",
    data() {
      return {
        FieldTypes
      }
    },
    methods: {
      // 当前选中的字段类型
      publishCurrentType(type) {
        this.$emit('publishCurrentType',type)
      }
    }
  }
</script>

<style scoped>
  .fieldTypeBox {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 250px;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: 1px solid #ccc;
  }
</style>
