<template>
  <div :class="cls()" :style="{ width }"
  >
    <slot>
      <i :class="[icon]" @click="handleClick"></i>
    </slot>
  </div>
</template>
<script>
  import Mods from '../mixins/mods';
  import RouterLink from '../mixins/router-link';
  export default {
    name:'QwNavBtn',
    mixins:[Mods,RouterLink],
    props:{
      width: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: 'icon-nav_add'
      }
    },
    methods:{
      handleClick(event){
        this.$emit('click', event);
        this.routerLink();
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import './index.scss';
</style>
