<template>
  <div class="qwui-checkbox-group">
    <slot></slot>
  </div>
</template>


<script type="text/ecmascript-6">
  export default {
    name: 'qwuiCheckboxGroup',
    data() {
      return {

      }
    },
    props: {
      disabled:{
        type:Boolean,
        default:false
      },
      min:Number,
      max:Number,
    }
  }
</script>

<style scoped lang="scss">

</style>
