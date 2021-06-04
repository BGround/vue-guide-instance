<template>
  <header class="qw-header" :style="{ width,height }">
    <slot name="logo">
      <div class="logo">
        <img :src="logo" alt="">
        <span class="title">{{title}}</span>
      </div>
    </slot>
    <slot></slot>
  </header>
</template>
<script>

  import defaultLogo from 'assets/images/icon_logo.png'
  export default {
    name:'QwHeader',
    props:{
      width: {
        type: String,
        default: ''
      },
      height: {
        type: String,
        default: '70px'
      },
      logo: {
        type:String,
        default: defaultLogo
      },
      title:{
        type:String,
        default: ''
      }
    },
    data() {
      return {}
    }
  }
</script>
<style lang="scss" scoped>
  @import './header.scss';
</style>
