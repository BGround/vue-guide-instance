<template>
  <div>
    <keep-alive :include="['schoolReportIndex', 'afterSchoolReport', 'competingManagement']">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>
