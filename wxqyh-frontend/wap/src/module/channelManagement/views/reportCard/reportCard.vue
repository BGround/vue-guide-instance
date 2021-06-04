<template>
  <!-- <keep-alive include="reportIndex">
    <router-view></router-view> 由于keep-alive致使从成绩单详情页跳转至列表页时没有重新加载页面，导致无法更改成绩单状态
  </keep-alive> -->
  <router-view></router-view>
</template>

<script>
export default {
  data() {
    return {}
  },

  methods: {}
}
</script>

<style>
  .qw-water-mark__list{
    z-index: 9000
  }
</style>