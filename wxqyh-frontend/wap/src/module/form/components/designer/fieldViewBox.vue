<!--中间部分字段预览-->
<template>
  <div class="fieldViewBox">
    <div
      class="fieldView"
      :class="{'active': currentIndex === -1}"
    >
      <div
        class="fieldView-header"
        @click="clickHeader"
      >
        <h1 class="fieldView-title">{{FormAjaxData.tbFormDetailsPO.formName}}</h1>
        <p class="fieldView-content">{{FormAjaxData.tbFormDetailsPO.content}}</p>
      </div>
      <div
        class="fieldView-action"
        v-show="currentIndex === -1"
        @click="clickEditHeader">
        <div class="fieldView-action-button fieldView-edit">
          <span class="action-icon"></span>编辑
        </div>
      </div>
    </div>
    <div
      v-for="(FieldItem,index) in FieldData">
      <field-view-group
        :index="index"
        :FieldItem="FieldItem"
      >
        <component
          slot="currentComponent"
          :is="FieldItem._type"
          :index="index"
          :FieldItem="FieldItem"
        >
        </component>
      </field-view-group>
    </div>
    <a
      class="FD-addButton"
      @click="addFieldButton"
    >
      <span class="FD-addButton-icon"></span>添加字段
    </a>
    <button_group :fixed="true">
      <p class="fieldViewBox-tip" v-show="tipShow">无法发布表单，请先登录企微云后台绑定管理</p>
      <p class="fieldViewBox-tip" v-show="!formAddPermission">没有创建表单权限，请先联系管理员</p>
      <qwui_button :type="buttonType" text="发布表单" @buttonClick="publishForm"></qwui_button>
    </button_group>

  </div>
</template>

<script>
  import { qwui_button, button_group } from '@/components/base/button'
  import fieldView from './fieldView'
  import mixinUtils from './mixin'
  import {mapState} from 'vuex'
  export default {
    name: "filedViewBox",
    components: {
      ...fieldView,
      qwui_button,
      button_group,
    },
    mixins: [mixinUtils],
    computed: {
      ...mapState({
        "managerUsers": state=>state.formDesign.managerUsers,
        "formAddPermission": state=>state.formDesign.formAddPermission,
        "isEditFieldSetting": state=>state.formDesign.isEditFieldSetting,
      }),
      tipShow() {
        return !this.managerUsers.length
      },
      buttonType() {
        return (this.tipShow || !this.formAddPermission) ? 'primaryDisabled' : 'primary'
      }
    },
    methods: {
      // 点击头部标题
      clickHeader() {
        this.publishCurrentField({
          FieldItem: {
            _type: ''
          },
          index: -1
        })
      },
      // 编辑标题
      clickEditHeader() {
        this.$router.go(-1)
      },
      // 发布表单
      publishForm() {
        // 如果未添加字段，则不能提交
        if(!this.FieldData.length) {
          _.tooltips_succeed('请添加表单字段',true,'');
          return
        }
        // 如果未绑定管理员账号，则不能提交
        if(this.tipShow) return
        // 如果无创建表单权限，则不能提交
        if(!this.formAddPermission) return
        this.$router.push('/formdesign/submit')
      },
      // 选择表单类型
      addFieldButton() {
        this.$router.push('/formdesign/selectType')
      }
    },
  }
</script>
<style lang="scss">
  @import "css/fieldView";
  @import "css/formDesigner";
  .fieldViewBox-tip {
    position: absolute;
    left: 0;
    bottom: 60px;
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: #FF666E;
    background-color: #FFE8E8;
  }
</style>
