<!--字段设置-->
<template>
  <transition name="fade">
    <div class="fieldSettingBox" id="fieldSettingBox">
      <componnet
        :is="currentFieldData._type+'Setting'"
        :currentData="currentFieldData"
        @fieldItemChanged="fieldItemChanged"
        @confirmSelected="confirmSelected"
        @cancelSelected="cancelSelected"
      >
        <validations
          slot="validations"
          :currentData="currentFieldData"
          :config="DesignerValidate[currentFieldData._type]"
          @validationChanged="validationChanged"
        >
        </validations>
      </componnet>
    </div>
  </transition>
</template>

<script>
  import fieldSetting from './fieldSetting'
  import mixinUtils from './mixin'
  import validations from "./core/validations"
  import DesignerValidate from './data/DesignerValidate'
  import {FieldTypeText} from './data/DesignerType'

  export default {
    name: "fieldSettingBox",
    components: {
      ...fieldSetting,
      validations,
    },
    mixins: [mixinUtils],
    data() {
      return {
        DesignerValidate,
        validationsData: null,    // 临时存放用户选择的校验数据
      }
    },
    methods: {
      // 保存校验数据
      validationChanged(payload) {
        this.validationsData = Object.assign({},payload)
      },
      cancelSelected() {
        this.cancelPublishType()
        this.$router.go(-1)
      },
      // 点击确定
      confirmSelected(payload) {
        if(!payload.label.length) {
          _.tooltips_succeed('请输入标题',true,'');
          return
        }
        let item = Object.assign({}, payload, this.validationsData)   // 保存用户选择的校验数据
        this.confirmFieldSetting(item)
        this.$router.go(-1)
      },
    },
    created() {
      // 设置标题
      document.title = '设置'+FieldTypeText[this.currentFieldData._type]
    },
    mounted() {
      this.$nextTick(()=>{
        document.getElementById('fieldSettingBox').scrollIntoView()
      })
    },
  }
</script>

<style lang="scss">
  .fieldSettingBox {
    min-height: 100vh;
    padding-bottom: 60px;
    box-sizing: border-box;
    background-color: #fff;
  }
  @media screen and (min-width: 1024px) {
    .fieldSettingBox {
      width: 740px;
    }
  }
  .fieldSettingBox {
    .De-form-input-lg {
      margin-top: 8px;
      margin-bottom: 36px;
    }
    &-title {
      padding: 15px;
      box-sizing: border-box;
      background-color: #f3f3f3;
    }
  }
</style>
