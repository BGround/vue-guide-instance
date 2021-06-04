<template>
  <div class="crm-competitor">
    <keep-alive :include="cachePageList">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "CrmCompetitor",
  computed: {
    ...mapGetters(["cachePageList"])
  }
};
</script>

<style lang="scss" scoped>
.crm-competitor {
  height: 100%;
}
</style>
