<!--右边部分字段设置-->
<template>
    <div class="fieldSettingBox" v-if="fieldType">
      <componnet :is="fieldType + 'Setting'" :data="currentFieldData"></componnet>
    </div>
</template>

<script>
  import fieldSetting from './fieldSetting'
  import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'

  export default {
    name: "fieldSettingBox",
    components: {
      ...fieldSetting
    },
    props: {
      fieldType: {
        type: String,
        default: ''
      },
    },
    computed: {
      ...mapState({
        currentFieldData: state=>state.formFieldEdit.currentFieldData,
      })
    },
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .fieldSettingBox {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 300px;
    border-left: 1px solid #ccc;
  }
</style>
