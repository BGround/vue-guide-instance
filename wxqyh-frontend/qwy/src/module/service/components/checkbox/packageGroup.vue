<template>
    <div class="qw-checkbox-group" role="group">
        <slot></slot>
    </div>
</template>
<script>
  export default {
    name:'QwCheckboxGroup',
    componentName: 'QwCheckboxGroup',
    data() {
      return {}
    },
    watch: {

    }
  }
</script>
<style lang="scss" scoped>
  @import 'checkbox.scss';
</style>
