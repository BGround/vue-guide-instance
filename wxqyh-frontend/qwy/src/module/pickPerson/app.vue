<template>
  <div id="app">
    <router-view></router-view>
    <top-alert></top-alert>
  </div>
</template>
<script>
  import topAlert from '@/components/base/topAlert';

  export default {
    name: 'app',
    data(){
      return {
        dataBase:dataBase,
      }
    },
    components:{
      topAlert
    }
  }

</script>
