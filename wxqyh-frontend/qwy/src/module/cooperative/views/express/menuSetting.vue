<template>
  <div>
    <qwMenuSet></qwMenuSet>
  </div>
</template>
<script>
  import qwMenuSet from '@/components/Menu/QwMenuSet';
  export default {
    components:{
      qwMenuSet
    },
    mounted(){
      dataBase.agentCode = 'express';
    }
  }
</script>
