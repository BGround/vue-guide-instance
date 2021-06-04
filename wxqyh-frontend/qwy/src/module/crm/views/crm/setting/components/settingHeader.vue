<!-- 
   <setting-header :pages="['设置','数据权限设置']"
                    @go-back="goBack"> 
    </setting-header>
-->
<template>
  <div class="setting-header">
    <div class="setting-header-left">
      <div class="qw-return_btn"
           @click="goBack"></div>
      <slot name="left-btns"></slot>
      <div class="setting-header-left-pages">
        <div class="setting-header-left-page"
             v-for="(item, index) in pages"
             :key="index">
          <p>{{item}}</p>
          <i>{{separator}}</i>
        </div>
      </div>
    </div>
    <div class="setting-header-center">
      <slot name="center"></slot>
    </div>
    <div class="setting-header-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "settingHeader",
  props: {
    // 分隔线
    separator: {
      default: "/",
      type: String
    },
    pages: Array
  },
  methods: {
    goBack() {
      this.$emit("go-back");
    }
  }
};
</script>
<style lang="scss" scoped>
.setting-header {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
  & > div {
    max-width: 33%;
    flex: 1;
  }
  &-left {
    display: flex;
    align-items: center;
    &-pages {
      margin-left: 8px;
      display: flex;
    }
    &-page {
      display: flex;
      i {
        margin: 0 5px;
        display: none;
      }
      &:not(:last-child) {
        color: #999;
        i {
          display: initial;
        }
      }
    }
  }
  &-center {
    text-align: center;
  }
  &-right {
    text-align: right;
  }
}
</style>

