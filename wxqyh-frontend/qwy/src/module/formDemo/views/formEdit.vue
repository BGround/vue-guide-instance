<template>
    <div class="formEditBox">
      <field-type-box
        @publishCurrentType="publishCurrentType"
      >
      </field-type-box>

      <field-setting-box
        :fieldType="currentType"
      >
      </field-setting-box>
      <field-view-box>
      </field-view-box>
    </div>
</template>

<script>

  import fieldSettingBox from '../components/fieldSettingBox'
  import fieldTypeBox from '../components/fieldTypeBox'
  import fieldViewBox from '../components/fieldViewBox'
  import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'

  export default {
    name: "formEdit",
    components: {
      fieldSettingBox,
      fieldTypeBox,
      fieldViewBox,
    },
    data() {
      return {
      }
    },
    computed: {
      ...mapState({
        currentIndex: state=>state.formFieldEdit.currentIndex,
        currentType: state=>state.formFieldEdit.currentType,
        currentFieldData: state=>state.formFieldEdit.currentFieldData,
        FieldData: state=>state.formFieldEdit.FieldData,
      })
    },
    methods: {
      ...mapMutations([
        "publishCurrentType",
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .formEditBox {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
</style>
