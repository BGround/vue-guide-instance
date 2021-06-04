<template>
  <div>
    <menu-set></menu-set>
  </div>
</template>

<script>
  import menuSet from '@/components/Menu/QwMenuSet';

  export default {
    data(){
      return {}
    },
    components:{
      menuSet
    },
    mounted(){
      dataBase.agentCode = 'diary';
    }
  }
</script>

<style lang="scss" scoped>
  .qwui-menu_wrap {
    height: 100%;
    position: absolute;
    top: 0;
    overflow: auto;
    background: #fbfbfb;
  }
</style>
