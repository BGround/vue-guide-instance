<template>
  <div class="menu-setting">
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
    created(){
      dataBase.agentCode = 'learnonline';
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
  .menu-setting{
    padding-right: 50px;
  }
</style>
