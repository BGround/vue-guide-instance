import {mapState,mapGetters,mapMutations,mapActions} from 'vuex'
export default {
  computed: {
    ...mapState({
      currentIndex: state=>state.formDesign.currentIndex,
      currentType: state=>state.formDesign.currentType,
      currentFieldData: state=>state.formDesign.currentFieldData,
      FieldData: state=>state.formDesign.FieldData,
      FormAjaxData: state=>state.formDesign.FormAjaxData,
    })
  },
  methods: {
    ...mapMutations([
      "selectCurrentType",
      "cancelPublishType",
      "deleteSelectType",
      "publishCurrentField",
      "fieldItemChanged",
      "confirmFieldSetting",
    ])
  }
}
