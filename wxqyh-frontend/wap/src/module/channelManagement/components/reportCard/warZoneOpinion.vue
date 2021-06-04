<template>
  <div class="war-zone-opinion">
    <div class="header">大区意见</div>
   <div class="lebel lebel-required">* 大区意见</div>
    <div class="text">
      <textarea :disabled="isDisabledOption"
                v-model="content">请输入</textarea>
    </div>

    <div class="lebel lebel-required">* 是否需要整改</div>
    <div class="text text-radio">
      <qw-radio-group v-model="isNeed" horizontal>
        <qw-radio
                v-for="item in radioOptions"
                :value="item.value"
                :disabled="isDisabledOption"
                :key="item.value">
          {{item.label}}
        </qw-radio>
      </qw-radio-group>
    </div>

    <template v-if="isNeed">
     <div class="lebel lebel-required">* 要求完成时间</div>

     <div class="text">
        <input v-model="finisTime" placeholder="请选择要求完成时间" :readonly="isDisabledOption" @click="handleClickInput" type="text">
      </div>
    </template>


    <!-- BEGIN: 整改计划表 -->
    <div class="plan" v-if="canShowPlan">

      <div class="plan__item" v-for="(item, index) in formList" :key="index">
        <div class="gutter"></div>
        <div class="plan__item__header">
            <div class="plan__item__header__title">
              整改计划表 {{formList.length>1? `(${index+1})`: ''}}
            </div>
            <div class="plan__item__header__operation">
              <button class="operation__btn" v-show="!isReadonlyPlanForm" @click="handleClickAdd(index)">新增</button>
              <button :disabled="formList.length===1" v-show="!isReadonlyPlanForm" class="operation__btn" @click="handleClickRemove(index)">删除</button>
            </div>
        </div>

        <div class="plan__item__content">

          <div class="filed">
            <div class="lebel lebel-required">* 短板指标</div>
            <div class="text">
              <input :readonly="isReadonlyPlanForm" v-model="formList[index].shortBoard" type="text" placeholder="请输入短板指标">
            </div>
          </div>

          <div class="filed">
            <div class="lebel lebel-required">* 整改计划</div>
            <div class="text">
              <input type="text" :readonly="isReadonlyPlanForm" v-model="formList[index].rectificationContents"  placeholder="请输入整改计划">
            </div>
          </div>

          <div class="filed">
            <div class="lebel lebel-required">* 计划完成时间</div>
            <div class="text">
              <datePicker :readonly="isReadonlyPlanForm" v-model="formList[index].planFinishedTime"  placeholder="请选择计划完成时间"></datePicker>
            </div>
          </div>

          <div class="filed">
            <div class="lebel lebel-required">* 下一阶段目标</div>
            <div class="text">
              <input type="text" :readonly="isReadonlyPlanForm" v-model="formList[index].nextObjective"  placeholder="请输入下一阶段目标">
            </div>
          </div>

        </div>

      </div>

    </div>
    <!-- END: 整改计划表 -->

    <div v-if="isShowReasonInput">
      <div class="lebel lebel-required">* 退回原因</div>
      <div class="text">
      <textarea :disabled="isDisabledReasonInput"
                v-model="exitReason">请输入</textarea>
      </div>
    </div>


    <div class="btn-group">

      <!--begin: 大区-->
      <button v-if="isWarZoneLeader"
              :disabled="isDisabledSubmitBtn"
              @click="handleSubmitWarZoneLeaderForm"
              class="submit">
        {{ getApprovalStatus === 0? '提交': (getApprovalStatus === 4? '确认': '已提交')}}
      </button>


      <button v-if="isShowReasonBtn"
              @click="handleSubmitRegionLeaderForm('-1')"
              :disabled="submitted"
              class="submit plain">
        退回
      </button>
      <!--end: 大区-->

      <!--  总经理  -->
      <button v-if="isManager"
              :disabled="isDisabled"
              @click="handleSubmitManagerForm"
              class="submit">
        确认已查阅
      </button>

      <!--服务总监-->
      <button v-if="isServiceDirector"
              :disabled="isDisabled"
              @click="handleSubmitServiceDirectorForm"
              class="submit">
        确认已查阅
      </button>

    </div>


      <qw-date-picker
        v-model="isVisibleDatePicker"
        :current="current"
        @select="handleSelectDate"
        show-week
      >
      </qw-date-picker>
  </div>
</template>

<script>
import addFile from '@/components/add/upload/add_file'
import addFileList from '@/components/add/upload/addFileList'
import addImg from '@/components/add/upload/add_img'
import addImgList from '@/components/add/upload/imgList'
import datePicker from "../../components/reportCard/datePicker";

import {saveManagerFeedback, saveRemediationAction, saveLeaderFeedback, saveServiceFeedback } from '../../api/reportCard/index'
import dayjs from 'dayjs'

export default {
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    },

    isWarZonePrincipalRole: {
      type: Boolean,
      default() {
        return false
      }
    },

      planList:{
          type: Array,
          default() {
              return []
          }
      },

  },
  components: {
    addFile,
    addFileList,
    addImgList,
    addImg,
    datePicker
  },
  data() {
    return {
          current: new Date(),
          content: this.info.remediationAction || '',
          finisTime: this.info.requireFinishTime ? this.info.requireFinishTime.substring(0,10): '',
          isVisibleDatePicker: false,
          isNeed: this.info.isNeed,
          radioOptions: [
            {
                value: 1,
                label: '是'
            },
            {
                value: 0,
                label: '否'
            }
        ],
        formList:[
            {
                shortBoard: '', //	短板指标
                rectificationContents: '', //	整改内容
                nextObjective: '', //	下阶段目标
                planFinishedTime: '', //	计划完成时间
            },
        ],
        submitted: false, // 表单是提交成功
        exitReason: '', //退回原因
    }
  },
  computed: {
      isWarZoneLeader(){
          return this.info.personRole === 1;
      },

      isManager(){
          return this.info.personRole === 2;
      },

      isServiceDirector(){
          return this.info.personRole === 3;
      },

      getApprovalStatus(){//0：未提交 1：已提交 2：总经理审批 3：服务总监审批 4：全部审批完成 5：已完成
          return this.info.approvalStatus;
      },

      canShowPlan(){
          const approvalStatus = this.getApprovalStatus;

          if(this.isWarZoneLeader && this.isNeed && (approvalStatus === 4 || approvalStatus === 5) ){
              return true;
          }
          if((this.isServiceDirector) && this.isNeed){
              return true;
          }

          return false
      },

    isDisabled() { //审批状态 1：已提交 0：未提交 2：总经理审批 3：服务总监审批 4：全部审批完成 5：已完成
        if(this.submitted){
            return true;
        }

        const approvalStatus = this.getApprovalStatus;
        if(this.isWarZoneLeader && [1, 2, 3, 4, 5].includes(approvalStatus)){
            return true;
        }
        //
        if(this.isManager && [0, 2, 4, 5].includes(approvalStatus)){
            return true;
        }

        if(this.isServiceDirector && [0, 3, 4, 5].includes(approvalStatus)){
            return true;
        }
        return false

    },

      isDisabledOption(){
          if(this.submitted){
              return true;
          }
          if(!(this.isWarZoneLeader && this.getApprovalStatus === 0)){
              return true;
          }
          return false
      },

      // 是否顯示退回原因
      isShowReasonInput(){
          // if(this.getApprovalStatus === 5 && this.isNeed){
          //     return true;
          // }
          if(this.isWarZoneLeader && this.getApprovalStatus === 4 && this.isNeed){
              return true;
          }

          if(this.isServiceDirector && this.info.exitReason){
              return true;
          }

          return false
      },

      isDisabledReasonInput(){
          if(this.submitted){
              return true;
          }
          if(this.getApprovalStatus === 5){
              return true;
          }
          if(this.isServiceDirector){
              return true
          }
          return false
      },

      isShowReasonBtn(){
          return this.isWarZoneLeader && this.getApprovalStatus === 4 && !!this.isNeed
      },

      isDisabledSubmitBtn(){
          if(this.submitted){
              return true;
          }
          if(this.getApprovalStatus !== 0 && this.getApprovalStatus !== 4){
              return true;
          }
          return false
      },

      isReadonlyPlanForm(){
          if(this.submitted){
              return true;
          }
          if([3, 4, 5].includes(this.getApprovalStatus)){
              return true;
          }
          return false
      }

  },
  watch: {
    'info.remediationAction'(value) {
      this.content = value || ''
    },
    'info.requireFinishTime'(value) {
      if(value){
        this.finisTime = value.substring(0,10);
      }else{
        this.finisTime = ''
      }
    },
    'info.exitReason'(value) {
        if(value){
            this.exitReason = value;
        }else{
            this.exitReason = ''
        }
    },
  },

  methods:{
      handleClickInput(){
        if(this.isDisabledOption){
          return;
        }
        this.isVisibleDatePicker = true;
      },
      handleSelectDate(date, columnsValue){
        this.finisTime = `${columnsValue[0]}-${columnsValue[1]}-${columnsValue[2]}`
      },

      validateForm(form){
          const result = {
              isValid: true,
              message: ''
          };
          if(!form.content){
              return Object.assign(result, {isValid: false, message: '大区意见不能为空'})
          }
          if(form.isNeed && !form.finisTime){
              return Object.assign(result, {isValid: false, message: '要求完成时间不能为空'})
          }
          return result
      },


      // 战区负责人保存整改意见

      saveRemediation(){
          const form = {
              content: this.content,
              isNeed: this.isNeed,
              id: this.info.id,
          }
          if(this.isNeed && this.finisTime){
              Object.assign(form, {finisTime: `${this.finisTime} 00:00:00`})
          }
          const validatedResult = this.validateForm(form)
          if(!validatedResult.isValid){
              _.alert('提示', validatedResult.message);
              return;
          }
          this.$confirm("提示", "是否确认将本成绩单及整改要求发送给经销商？").then(() => {
              saveRemediationAction(form).then((data)=>{
                  if(data){
                      _.alert('提示', '反馈成功');
                      this.$emit('updateStatus',3) // 反馈
                      this.submitted = true;
                  }
              })
          })
              .catch(() => {});
      },

      //提交大区负责人查阅表单
      handleSubmitRegionLeaderForm(status){
          if(status === '-1' && !this.exitReason){
              _.alert('提示', '退回原因不能为空');
              return false;
          }
          const form = {
              exitReason: this.exitReason,
              id: this.info.id,
              status: status,
          }
          saveLeaderFeedback(form).then((data)=>{
              if(data){
                  _.alert('提示', '反馈成功');
                  this.submitted = true;
                  if(status!=='-1'){
                      this.$emit('updateStatus',5) // 已完成
                  }else {
                      this.$emit('updateStatus',3) // 反馈
                  }
              }
          })
      },

      /**
       * 提交战区负责人表单
       */
      handleSubmitWarZoneLeaderForm() {
        if(this.getApprovalStatus === 0){
            this.saveRemediation();
        }
        if(this.getApprovalStatus === 4){
            this.handleSubmitRegionLeaderForm('1')
        }

      },

      // 总经理反馈
    handleSubmitManagerForm(){
      const form = {
          exitReason: '',
          id: this.info.id,
          status: 1, //审阅状态(1:确认，-1：退回)
      }
      saveManagerFeedback(form).then((data)=>{
        if(data){
            this.submitted = true;
            _.alert('提示', '反馈成功');
        }
      })
    },

      handleClickAdd(index){
          this.formList.splice(index+1, 0,  {
              shortBoard: '', //	短板指标
              rectificationContents: '', //	整改内容
              nextObjective: '', //	下阶段目标
              planFinishedTime: '', //	计划完成时间
          },)
      },

      handleClickRemove(index){
          this.formList.splice(index, 1);
      },


      /**
       * 验证反馈项目表单
       * @param forms
       * @return {{isValid: boolean, message: string}}
       */
      validatePlanForm(forms){
          const result = {
              isValid: true,
              message: ''
          }
          for (let index = 0; index < forms.length; index++){
              const form = forms[index];
              if(!form.shortBoard){
                  Object.assign(result, {isValid: false, message: `计划整改表${index+1}短板指标不能为空`})
                  break;
              }
              if(!form.rectificationContents){
                  Object.assign(result, {isValid: false, message: `计划整改表${index+1}整改内容不能为空`})
                  break;
              }
              if(!form.planFinishedTime){
                  Object.assign(result, {isValid: false, message: `计划整改表${index+1}计划完成时间不能为空`})
                  break;
              }
              if(!form.nextObjective){
                  Object.assign(result, {isValid: false, message: `计划整改表${index+1}下阶段目标不能为空`})
                  break;
              }
          }
          return result;
      },

      // 提交服务总监查阅表单
      handleSubmitServiceDirectorForm(){
          let form = [];
          if(this.isNeed){
              const validateResult = this.validatePlanForm(this.formList);
              if( !validateResult.isValid){
                  _.alert('提示', validateResult.message);
                  return;
              }
              // 提交
              form = this.formList.map(item=>{
                  const date = new Date(item.planFinishedTime.replace(/-/g, "/"));
                  const planFinishedTime = dayjs(date).format('YYYY-MM-DD');
                  return {...item, planFinishedTime: planFinishedTime}
              })
          }
          console.log(form, 'form list');
          saveServiceFeedback({id:this.info.id}, form).then((data)=>{
              if(data){
                  this.submitted = true
                  _.alert('提示', '已查阅成功')

              }
          })
      },

      initFormList(){
          if(this.canShowPlan && this.planList.length){
              this.formList = this.planList.map((item)=>({
                  shortBoard: item.shortBoard, //	短板指标
                  rectificationContents: item.rectificationContents, //	整改内容
                  nextObjective: item.nextObjective, //	下阶段目标
                  planFinishedTime: item.planFinishedTime   ,//	计划完成时间
              }))
          }
      },

  },

  watch:{
    planList: 'initFormList',
    ['info.exitReason'](value){
        this.exitReason = value;
    }
  },

    created(){
      this.initFormList();
      this.exitReason = this.info.exitReason || '';
    }
}
</script>

<style lang="scss" scoped>
.war-zone-opinion {
  .upload__wrapper {
    padding: 0 27px;
    margin-bottom: 10px;
  }
  .gutter {
    height: 10px;
    background: rgba(247, 247, 247, 1);
  }

  .plan__item__header{
    display: flex;
    height: 50px;
    align-items: center;
    padding: 0 26px;
    justify-content: space-between;
    .plan__item__header__title{
      color: #2781db;
      font-size: 16px;
    }
    &::before {
      content: '';
      position: absolute;
      display: block;
      bottom: 0;
    }
  }

  /deep/ {
    .qw-upload-list {
      display: flex;
      padding: 0 27px;
    }
    .qw-upload-list__item {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      margin-bottom: 10px;
      flex-wrap: wrap;
      justify-content: flex-start;
      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      position: relative;
    }
    .qw-upload-list__item-name {
      display: none;
    }

    .qw-upload-list__item-actions {
      display: none;
    }
    .qw-upload-list__item-del {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }
  }

  background: #ffffff;
  padding-bottom: 22px;
  .header {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(20, 30, 40, 1);
    padding-bottom: 11px;
    padding-left: 26px;
    padding-top: 16px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      display: block;
      height: 16px;
      border-radius: 2px;
      width: 4px;
      top: 50%;
      background-color: #c6001f;
      top: 21px;
      left: 18px;
    }
  }
  .lebel {
    height: 19px;
    font-size: 13px;
    padding-left: 26px;
    font-weight: 600;
    line-height: 23px;
    color: rgba(102, 102, 102, 1);
    padding-bottom: 4px;
  }
  .upload-btn {
    margin-left: 26px;
    margin-bottom: 16px;
    width: 25px;
    height: 25px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(208, 208, 208, 1);
    opacity: 1;
    border-radius: 3px;
    background-size: 20px 20px;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url('~@/module/channelManagement/static/images/icon_paper_clip.png');
  }

  .text {
    margin: 10px 26px 20px;
    background: rgba(255, 255, 255, 1);
    position: relative;
    & > textarea {
      width: calc(100% - 16px);
      padding: 8px;
      min-height: 78px;
      border: 1px solid rgba(208, 208, 208, 1);
      background: rgba(255, 255, 255, 1);
    }
    & > input{
      text-indent: 8px;
        width: 100%;
        height: 32px;
        height: 32px;
       border: 1px solid rgba(208, 208, 208, 1);
    }
    &.text-radio{
      width: 160px;
    }

    /deep/ {
      .qw-radio-group[data-horz=true] .qw-radio .qw-radio__input{
        justify-content: flex-start;
        padding: 0;
      }
    }
  }
  .submit {
    display: block;
    width: 113px;
    height: 28px;
    background: rgba(39, 129, 219, 1);
    opacity: 1;
    border-radius: 4px;
    color: #fff;
    border: 1px solid rgba(39, 129, 219, 1);
    text-align: center;
    margin: 0 auto;
    line-height: normal;
  }

  button.submit[disabled]{
    background: #eee;
    border: #aaa;
    color: #999;
  }

  .operation__btn{
    background: #ffffff;
    border: 1px solid #a1a1a1;
    width: 50px;
    height: 26px;
    border-radius: 4px;
    line-height: normal;
    &[disabled]{
      border-color: #b7b7b7;
    }
  }

  .btn-group{
    display: flex;
    justify-content: center;
    button{
      margin: 0 10px;
    }
    .submit.plain{
      background: #ffffff;
      border: 1px solid #a1a1a1;
      color: rgb(170, 170, 170);
    }
  }
}
</style>
