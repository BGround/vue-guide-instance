<template>
    <div v-if="data">
      <h1>单行文字</h1>
      <h2>标题</h2>
      <input type="text" v-model="title">
      <h2>默认值</h2>
      <input type="text" v-model="predefined_value">
      <h3>提示</h3>
      <textarea name="notes"
        v-model="notes"
      >
      </textarea>
    </div>
</template>

<script>
  export default {
    name: "TextFieldSetting",
    props: {
      data: {
        type: Object
      }
    },
    data() {
      return {
        title: '',
        predefined_value: '',
        notes: '',
      }
    }
  }
</script>

<style scoped>

</style>
