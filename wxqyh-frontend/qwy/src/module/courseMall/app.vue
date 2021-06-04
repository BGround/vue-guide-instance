<template>
  <div id="app">
    <div v-if="dataBase.config">
      <mall-head :pagedata="dataBase.listdata"></mall-head>
      <router-view></router-view>
    </div>
    <msg-boxs></msg-boxs>
    <top-alert></top-alert>
  </div>
</template>

<script>
import mallHead from './components/courseMallHead'
import msgBoxs from '@/components/base/msgBoxs'
import topAlert from '@/components/base/topAlert';
export default {
  name: 'app',
  components:{"mall-head":mallHead,"msg-boxs":msgBoxs, topAlert},
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
