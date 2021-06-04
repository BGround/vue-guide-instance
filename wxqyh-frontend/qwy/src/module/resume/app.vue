<template>
<div id="app">
      <router-view >
      
      </router-view>
      <top-alert></top-alert>
      <msg-boxs></msg-boxs>
</div>
</template>

<script>
import topAlert from "@/components/base/topAlert";
import msgBoxs from "@/components/base/msgBoxs";
export default {
  name: 'app',
  created:function(){
  },
  data(){
    return {
      dataBase:dataBase
    }
  },
  components:{
    "msg-boxs": msgBoxs,
    topAlert
  }
}

</script>

<style>
@import "../../assets/css/style.css";
@import "../../assets/fonts/iconfont.css";

#app{
  padding: 0 10%;
}
</style>
