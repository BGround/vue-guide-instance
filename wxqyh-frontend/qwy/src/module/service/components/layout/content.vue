<template>
    <div class="qw-content" :style="{ width }">
        <div class="qw-content-wrap">
            <slot></slot>
        </div>
    </div>
</template>
<script>

  export default {
    name:'QwContent',
    props:{
      width: {
        type: String,
        default: ''
      },
    },
    data() {
      return {}
    }
  }
</script>
<style lang="scss" scoped>
  @import './layout.scss';
</style>
