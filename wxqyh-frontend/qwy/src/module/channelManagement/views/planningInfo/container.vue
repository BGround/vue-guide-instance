<template>
    <keep-alive include="newsBulletinList">
  <router-view></router-view>
    </keep-alive>
</template>

<script>
  export default {
    data(){
      return {}
    },
    created(){
      console.log("xx")
    }
  }
</script>
