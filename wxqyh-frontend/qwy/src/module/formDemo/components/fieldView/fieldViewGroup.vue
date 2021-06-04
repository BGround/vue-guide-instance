<template>
  <div @click="publishCurrentField({FieldItem,index})">
    <slot></slot>
  </div>
</template>

<script>
  import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'

  export default {
    name: "fieldViewGroup",
    props: {
      FieldItem: Object,
      index: Number,
    },
    data() {
      return {

      }
    },
    methods: {
      ...mapMutations([
        "publishCurrentField"
      ])
    }
  }
</script>

<style scoped>

</style>
