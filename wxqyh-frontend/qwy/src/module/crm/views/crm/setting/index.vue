<template>
  <div class="crm-setting">
    <transition name="fade"
                mode="out-in">
      <keep-alive :include="cacheList">
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
export default {
  name: "crmSetting",
  data() {
    return {
      cacheList: ["crmSettingList"]
    };
  }
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
