<template>
  <ul class="sort-list">
    <slot></slot>
  </ul>
</template>

<script>
import { ContainerMixin } from 'vue-slicksort';

export default {
  mixins: [ContainerMixin]
}

</script>
<style lang="scss" scoped>
.sort-list {
  list-style: none;
  background: #F7F8FA;
  > li:nth-of-type(4) {
    margin-bottom: 8px;
  }
}
</style>