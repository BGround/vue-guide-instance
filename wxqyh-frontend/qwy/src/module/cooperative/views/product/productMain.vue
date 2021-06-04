<template>
  <div class="qwui-list_wrap">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    created(){
      dataBase.agentCode = 'productinfo'
    }
  }
</script>

<style></style>
