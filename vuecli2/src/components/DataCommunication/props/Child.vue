<template>
  <div>
      <div v-for="(item, index) in articleList" :key="index">{{item}}</div>
  </div>
</template>

<script>
export default {
  props: ['articleList']

}
</script>

<style>

</style>
