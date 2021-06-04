<template>
  <div>
    <div v-if="hasPermission" class="qwui-add_content_item" @click="showAddContent()">
      <i class="qwui-add_content_left"></i>
      <div class="qwui-flexItem qwui-add_content">{{$t('i18n.taskAddContent')}}</div>
    </div>
    <add_module :add-module-config="addModuleConfig" :add-module-type="addModuleType" @addType="addType"></add_module>
  </div>

</template>

<script>
  import add_module from './TaskAddContentModule';

  export default {
    props:['addModuleType'],
    data(){
      return{
        addModuleConfig:{
          show:false,
        },
      }
    },
    computed:{
      addSubTaskPermission(){
        return this.$store.getters.taskLevel == 'a2' && this.$store.getters.taskPermission.openSubtask == 2 && !this.$store.getters.subTaskPage && !this.$store.getters.taskOver;
      },
      hasPermission(){
        if (this.addSubTaskPermission){
          return true;
        }
        this.$store.commit('hasPermissionUpdate');
        return this.$store.getters.hasPermission;
      }
    },
    methods:{
      showAddContent(){
        if(this.addModuleType=='mainAddModule'){
          window.sessionStorage.setItem('addModuleType','mainAddModule');
          this.$store.commit('mainAddContentModuleShowUpdate');
          this.addModuleConfig.show = this.$store.getters.mainAddContentModuleShow;
        }else if(this.addModuleType=='subAddModule'){
          window.sessionStorage.setItem('addModuleType','subAddModule');
          this.$store.commit('subAddContentModuleShowUpdate');
          this.addModuleConfig.show = this.$store.getters.subAddContentModuleShow;
        }
      },
      addType(type){
        this.$emit('addType',type);
      }
    },
    components:{
      add_module
    }
  }
</script>

<style type="text/css">
  .qwui-add_content_item{
    display: flex;
    color:#648EEC;
    font-size: 15px;
    line-height: 46px;
    background: #fff;
  }
  .qwui-flexItem {
    flex: 1;
  }
  .qwui-add_content{
    padding-left: 8px;
    padding-right: 15px;
  }
  .qwui-add_content_left{
    width: 26px;
    padding-left: 15px;
    background: url("../../../../assets/svg/add.svg") no-repeat scroll right;
  }
</style>
