<!--中间部分字段预览-->
<template>
  <div class="fieldViewBox">
    <div
      v-for="(FieldItem,index) in FieldData">
      <field-view-group
        :index="index"
        :FieldItem="FieldItem"
      >
        <component
          :is="FieldItem._type"
          :index="index"
          :FieldItem="FieldItem"
        >
        </component>
      </field-view-group>
    </div>
  </div>
</template>

<script>
  import fieldView from './fieldView'
  import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
  export default {
    name: "filedViewBox",
    components: {
      ...fieldView
    },
    props: {
    },
    data() {
      return {
      }
    },
    computed: {
      ...mapState({
        FieldData: state=>state.formFieldEdit.FieldData,
      })
    },
    methods: {
    }
  }
</script>

<style scoped>
  .fieldViewBox {
    position: absolute;
    left: 250px;
    top: 0;
    bottom: 0;
    overflow: hidden;
  }
</style>
