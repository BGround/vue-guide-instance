<template>
  <div>
    <div class="designerSubmit" v-show="!successShow">
      <div class="selectContent qwui-border_bottom">
        <label v-for="(value,key) in options" class="qwui-border_bottom">
          <input type="radio" name="radio" :value="key" class="form_designer_radio" v-model="checkedData"> {{value}}
        </label>
      </div>
      <user-add v-if="isShowUserAdd" :userselect="dataBase.selectConfig" :hiddenTitle="hiddenTitle" @selectPerson="selectPerson"></user-add>

      <user-select :selectconfig="dataBase.selectConfig" v-if="dataBase.selectConfig.show" @chooseDone="chooseDone"></user-select>
      <div class="pageBottom">
        <div class="tips">
          <p>所选人员可在应用端填写表单，并可查看相关明细数据</p>
        </div>
        <label class="advise">
          <input v-model="isSendMsg" type="checkbox" class="form_designer_checkbox">后台发布/编辑表单后发送通知
        </label>
      </div>
      <button-group :fixed="true">
        <qwui-button type="default" text="取消" @buttonClick="cancel"></qwui-button>
        <qwui-button type="primary" text="发布" @buttonClick="publish"></qwui-button>
      </button-group>
    </div>
    <div v-if="successShow">
      <form-designer-success :addFormShow="addFormShow"></form-designer-success>
    </div>

  </div>
</template>

<script>
import user_add from "@/components/add/user_select_build";
import user_select from '@/components/base/user_or_dept_select';
import { qwui_button, button_group } from "@/components/base/button";
import {formAjaxAdd} from '../../api/list'
import formDesignerSuccess from './formDesignSuccess'
import {mapState,mapMutations} from 'vuex'

export default {
  components: {
    userAdd: user_add,
    userSelect: user_select,
    qwuiButton: qwui_button,
    buttonGroup: button_group,
    formDesignerSuccess
  },
  data() {
    return {
      options: {
        1: "所有人",
        // 2: "特定对象（成员、部门、标签）"
      },
      hiddenTitle:true,
      successShow: false,       // 发布成功显示
      addFormShow: true,        // 是否有填单权限
      dataBase: dataBase
    };
  },
  created () {
    this.dataBase.selectConfig.signIndex = 'toPersonList'
    this.dataBase.selectConfig.selectList.toPersonList.title = '处理人'
  },
  computed: {
    ...mapState({
      FormAjaxData: state=>state.formDesign.FormAjaxData,
    }),
    // 表单名称
    checkedData: {
      get() {
        return this.FormAjaxData.range
      },
      set(val) {
        this.changeFormAjaxData({key: 'range', value: val})
      }
    },
    // 发送通知
    isSendMsg: {
      get() {
        return this.FormAjaxData.tbFormControlPO.isSendMsg
      },
      set(val) {
        if(val) {
          this.changeFormAjaxData({key: 'tbFormControlPO.isSendMsg', value: 2})
        }else {
          this.changeFormAjaxData({key: 'tbFormControlPO.isSendMsg', value: null})
        }
      }
    },
    isShowUserAdd () {
      return this.checkedData==1? false:true
    },
   },
  methods: {
    ...mapMutations([
      "changeFormAjaxData",
      "publishFormDesignData"
    ]),
    // 发布表单
    publish(){
      _.showLoading()
      this.publishFormDesignData()
      formAjaxAdd(this.FormAjaxData).then((result)=>{
        _.hideLoading()
        if(result.code==0){
          this.successShow = true
          this.addFormShow = result.data.isFormTarget
          this.changeFormAjaxData({key: 'id', value: result.data.versionsId})
        }else {
          _.alert('提示',result.desc)
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    selectPerson(el,obj){
    },
    chooseDone(){
    }
  }
};
</script>

<style scoped>
@media screen and (min-width: 1024px) {
  .designerSubmit {
    width: 740px;
    margin: auto;
  }
}
.designerSubmit {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: #f5f5f5;
}
.selectContent {
  padding-left: 15px;
  background-color: #fff;
  margin-bottom: 8px;
}
.selectContent label {
  display: block;
  height: 44px;
  line-height: 44px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 0px 0px rgba(247, 248, 250, 1);
  font-size: 15px;
  color: rgba(10, 23, 54, 1);
}
.designerSubmit .qwui-border_bottom:last-child:after {
  border: none;
}
.designerSubmit .selectContent .form_designer_radio {
  -webkit-appearance: none;
  background: #fff url("../../../../assets/images/ic_form_noradio.png")
    no-repeat;
  background-size: 16px;
  height: 16px;
  width: 16px;
  margin-right: 10px;
  vertical-align: middle;
}
.designerSubmit .selectContent .form_designer_radio:checked {
  background: #fff url("../../../../assets/images/ic_form_radio.png") no-repeat;
  background-size: 16px;
  height: 16px;
  width: 16px;
}
.designerSubmit .pageBottom {
  padding-left: 15px;
}
.designerSubmit .pageBottom .tips {
  font-size: 13px;
  color: rgba(178, 185, 200, 1);
  line-height: 18px;
  padding-top: 16px;
  padding-bottom: 16px;
}
.designerSubmit .pageBottom .advise {
  font-size: 15px;
  color: rgba(122, 125, 128, 1);
  line-height: 21px;
}
.designerSubmit .pageBottom .advise .form_designer_checkbox {
  -webkit-appearance: none;
  margin-right: 10px;
  height: 17px;
  width: 16px;
  background: #fff;
  border: 2px solid rgba(227, 228, 232, 1);
  vertical-align: middle;
}
.designerSubmit .pageBottom .advise .form_designer_checkbox:checked {
  background: url("../../../../assets/images/ic_form_checkbox.png") no-repeat;
  background-size: 16px;
  border: none;
}
.qwui-check_btn {
  margin-right: 10px;
}
</style>
