<template lang="html">
  <div class="logo">
    <img src="../../static/img/logo.png" alt="logo" class="logo-img">
    <span>企微云智慧党建</span>
    <router-link to="/" class="logo-index">管理平台</router-link>
  </div>
</template>

<script>
export default {
  name: 'QwLogo'
}
</script>

<style lang="scss" scoped>
.logo {
  display: inline;
  color: #FD2F09;
  font-size: 26px;
  letter-spacing: 1px;

  .logo-img {
    position: relative;
    top: 5px;
  }

  .logo-index {
    position: relative;
    margin-left: 10px;
    color: #666666;
    font-size: 16px;

    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: -10px;
      width: 1px;
      height: 20px;
      background-color: #E1E1E1;
    }
  }
}
</style>
