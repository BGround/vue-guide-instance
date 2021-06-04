<template>
  <div id="app">
    <div>
      <custom-form></custom-form>
      <!--<router-view></router-view>-->
    </div>
    <msg-boxs></msg-boxs>
    <top-alert></top-alert>
  </div>
</template>

<script>
  import CustomForm from './components/custom_form'
  import msgBoxs from '@/components/base/msgBoxs'
  import topAlert from '@/components/base/topAlert';
  export default {
    name: 'app',
    components: {
      CustomForm,
      msgBoxs,
      topAlert
    },
    data() {
      return {
        dataBase: dataBase
      }
    },
    created() {
      dataBase.loading = true
    }
  }

</script>

<style>
  @import '../../assets/css/style.css';
</style>

