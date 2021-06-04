<template>
  <div>
    单行预览
  </div>
</template>

<script>
  import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'

  export default {
    name: "TextField",
    props: {
      FieldItem: {
        type: Object
      },
      index: {
        type: Number
      }
    },
    data() {
      return {

      }
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
