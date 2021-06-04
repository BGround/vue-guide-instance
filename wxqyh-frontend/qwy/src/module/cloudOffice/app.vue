<template>
  <div id="app">
    <router-view></router-view>
    <msgBoxs></msgBoxs>
  </div>
</template>

<script>
import msgBoxs from "@/components/base/msgBoxs";
export default {
  name: 'app',
  data(){
    return {
      dataBase:dataBase
    }
  },
  components: {
    msgBoxs
  }
}

</script>

<style>
	@import '../../assets/css/style.css';
  #app {
    background: #fff;
  }
</style>
