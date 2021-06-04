<template lang="html">
  <div id="app">
    <router-view></router-view>
    <msg-boxs></msg-boxs>
    <top-alert></top-alert>
  </div>
</template>

<script>

  import  {msgBoxs,topAlert} from './index'
  export default {
    name: 'app',
    data(){
      return {
        dataBase:dataBase,
      }
    },
    created(){
      dataBase.loading = true;
    },
    components: {
      msgBoxs,
      topAlert
    }
  }
</script>
<style lang="scss" scoped>
  @import './css/exclusive.scss';
</style>
