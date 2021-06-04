<template>
  <div class="wrap qwui-wrap"></div>
</template>


<script>
import { getCard } from '../../../api/smallProgram/getBata.js';
  export default {
    data() {
      return {}
    },
    created(){
      getCard((res) => {
        if(!res.isPermission){
          this.$router.push({path:'/smallProgram',query:{wxUserId:res.wxUserId}});
        }else{
          this.$router.push({path:'/callingCard'});
        }
      });
    },
    methods:{}
  }
</script>

<style scoped lang="scss">
  
</style>
