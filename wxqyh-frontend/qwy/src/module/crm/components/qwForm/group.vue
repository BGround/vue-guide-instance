<template>
  <div class="qw-form-group">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "qwFromGroup"
};
</script>
<style lang="scss" scoped>
.qw-form-group {
  padding-top: 20px;
  /deep/ .qw-form-item {
    margin-bottom: 20px;
    .item-left {
      width: 10em;
    }
  }
}
</style>


