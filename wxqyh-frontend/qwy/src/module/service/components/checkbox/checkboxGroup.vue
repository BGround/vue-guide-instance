<template>
    <div class="qw-checkbox-group" role="group">
        <slot></slot>
    </div>
</template>
<script>
  import Emitter from '../../mixins';

  export default {
    name:'QwCheckboxGroup',
    componentName: 'QwCheckboxGroup',
    mixins: [Emitter],
    props:{
      value: {},
      disabled: Boolean,
      min: Number,
      max: Number,
    },
    data() {
      return {}
    },
    watch: {
      value(value) {
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import './checkbox.scss';
</style>
