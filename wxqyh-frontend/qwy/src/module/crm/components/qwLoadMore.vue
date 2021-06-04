<template>
  <div class="qw-load-more">
    <img v-if="showLoading"
         src="~assets/images/loading.gif">
    <span v-show="tip">{{tip}}</span>
  </div>
</template>
<script>
export default {
  name: "qwLoadMore",
  props: {
    showLoading: Boolean,
    tip: String
  }
};
</script>
<style lang="scss" scoped>
.qw-load-more {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  color: #999;
  img {
    width: 18px;
    height: 18px;
    margin-right: 5px;
  }
}
</style>

