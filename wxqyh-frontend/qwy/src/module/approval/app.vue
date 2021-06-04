<template>
  <div id="app">
    <div v-if="dataBase.config" id="approval">
      <router-view></router-view>
    </div>
    <msg-boxs></msg-boxs>
    <top-alert></top-alert>
  </div>
</template>

<script>
import msgBoxs from '@/components/base/msgBoxs';
import topAlert from '@/components/base/topAlert';

export default {
  name: 'app',
  components: {
    "msg-boxs":msgBoxs,
    topAlert,
  },
  data(){
    return {
      dataBase:dataBase
    }
  }
}

</script>

<style>
	@import '../../assets/css/style.css';
</style>
