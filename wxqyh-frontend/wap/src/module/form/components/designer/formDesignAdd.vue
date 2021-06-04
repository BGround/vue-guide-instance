<template>
  <div>
    <div class="formDesignAdd" id="formDesignAdd">
      <h2 class="De-form-label">表单名称 <span class="must-tip">*</span></h2>
      <input type="text"
        placeholder="请输入"
        class="De-form-input-lg"
        :class="addRedBorder?'red-border':''"
        @blur="confirmTitleEmpty"
        v-model.sync="formName"
        maxlength= 30
      >
      <h2 class="De-form-label">表单描述</h2>
      <textarea type="text" placeholder="请输入" class="De-form-input-lg" v-model.sync="content" maxlength= 200></textarea>
      <h2 class="De-form-label">分组</h2>
      <div class="De-form-group De-form-group-pointer" @click="showSelectGroup">
        <input readonly type="text" placeholder="请选择" class="De-form-input-lg" :value="typeName" ref="groupInput" maxlength= 30>
        <span class="De-form-icon-arrow"></span>
      </div>
    </div>
    <select-group :show.sync="showGroup" :groupList="groupList"></select-group>
    <button_group :fixed="true">
      <qwui_button type="primary" text="设计表单" @buttonClick="buttonClick"></qwui_button>
    </button_group>
  </div>
</template>

<script>
  import { qwui_button, button_group } from '@/components/base/button'
  import {mapState,mapMutations} from 'vuex'
  import selectGroup from './core/groups/selectGroup'
  import {findSubFormTypes} from '../../api/list'
  export default {
    name: "formDesignAdd",
    components: {
      button_group,
      qwui_button,
      selectGroup
    },
    data() {
      return {
        groupList: null,
        showGroup: false,
        addRedBorder: false
      }
    },
    computed: {
      ...mapState({
        FormAjaxData: state=>state.formDesign.FormAjaxData,
      }),

      // 表单名称
      formName: {
        get() {
          return this.FormAjaxData.tbFormDetailsPO.formName
        },
        set(val) {
          this.changeFormAjaxData({key: 'tbFormDetailsPO.formName', value: val})
          this.changeFormAjaxData({key: 'tbFormDetailsPO.title', value: val})
          this.changeFormAjaxData({key: 'tbFormControlPO.titleTemplate', value: val})
        }
      },
      // 表单描述
      content: {
        get() {
          return this.FormAjaxData.tbFormDetailsPO.content
        },
        set(val) {
          this.changeFormAjaxData({key: 'tbFormDetailsPO.content', value: val})
        }
      },
      // 分组名称
      typeName: {
        get() {
          return this.FormAjaxData.tbFormControlPO.typeName
        },
        set(val) {
          this.changeFormAjaxData({key: 'tbFormControlPO.typeName', value: val})
        }
      },
      // 分组Id
      typeId: {
        get() {
          return this.FormAjaxData.tbFormControlPO.typeId
        },
        set(val) {
          this.changeFormAjaxData({key: 'tbFormControlPO.typeId', value: val})
        }
      },
    },
    created() {
      this.getFormGroup()
    },
    mounted() {
      this.$nextTick(()=>{
        document.getElementById('formDesignAdd').scrollIntoView()
      })
    },
    methods: {
      ...mapMutations([
        "changeFormAjaxData",
      ]),

      buttonClick() {
        if(!this.formName.length) {
          _.tooltips_succeed('请输入表单名称',true,'');
          return
        }
        this.$router.push('view')
      },
      getFormGroup() {
        let list = JSON.parse(window.sessionStorage.getItem('formDesignGroup'+_.userId))
        if(list) {
          this.groupList = [...list]
        }else {
          findSubFormTypes().then(result=>{
            this.groupList=[...result.data.formTypeList]
            window.sessionStorage.setItem('formDesignGroup'+_.userId,JSON.stringify(this.groupList))
          })
        }
      },
      // 显示分组
      showSelectGroup() {
        this.showGroup = true
        document.body.style.overflowY = 'hidden'
        this.$refs.groupInput.blur()
      },
      confirmTitleEmpty() {
        this.addRedBorder = this.formName ==='' ? true : false
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "css/formDesigner";
  .formDesignAdd {
    height: 100vh;
    padding: 28px 15px 0;
    box-sizing: border-box;
    background-color: #fff;
  }
  .must-tip {
    color: #FF1515;
  }
  .De-form-label {
    margin-bottom: 10px;
  }
  .De-form-input-lg {
    margin-bottom: 24px;
  }
  .De-form-group.De-form-group-pointer{
    cursor: pointer;
  }
  .De-form-input-lg.red-border{
    border: 1px solid #FF666E;
  }
</style>
