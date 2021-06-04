<template>
  <div :class="cls({fixed})"
  >
    <slot />
  </div>
</template>
<script>
  import Mods from '../mixins/mods';
  export default {
    name:'QwNavGroup',
    mixins:[Mods],
    props:{
      fixed: {
        type: Boolean,
        default: true
      },
      value:{
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        items: []
      }
    },
    watch: {
      items() {
        this.settingActive();
      },
      value() {
        this.settingActive();
      }
    },
    methods:{
      settingActive() {
        this.items.forEach((item, index) => {
          item.active = index === this.value;
        });
      },
      //当前导航索引不一样触发
      handleChange(index){
        if (index !== this.value) {
          this.$emit('input', index);
          this.$emit('change', index);
        }
      }
    }

  }
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
