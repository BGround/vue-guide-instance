<template>
  <div class="feedback">
    <div class="header">经销商反馈</div>
      <div class="form-wrapper" v-for="(item, index) in formList" :key="index">
        <div class="operation" v-show="!isReadonly">
          <button class="operation__btn" @click="handleClickAdd(index)">＋</button>
          <button href="JavaScript:;" :disabled="formList.length<=3" class="operation__btn" @click="handleClickRemove(index)">－</button>
        </div>
        <div class="form" >
            <div class="form__item">
              <div class="form__item__label">项目{{ formList.length > 1? (index+1): '' }}</div>
              <div class="form__item__input">
                <input :readonly="isReadonly" placeholder="请输入经销商提升计划项目名称" type="text" v-model="item.projectName">
              </div>
            </div>

          <div class="form__item">
            <div class="form__item__label">负责人</div>
            <div class="form__item__input">
              <input :readonly="isReadonly" placeholder="请输入负责人姓名" type="text" v-model="item.projectLeader">
            </div>
          </div>

          <dateInput :readonly="isReadonly" label="完成时间" placeholder="请选择完成时间" v-model="item.finishedTime"></dateInput>
        </div>
        <div v-if="formList.length !== index+1" class="gutter"></div>
      </div>
      <div class="form" >
        <div class="form__item">
          <div class="form__item__label">参会人 (姓名之间用分号分割)</div>
          <div class="form__item__input">
            <input :readonly="isReadonly" placeholder="请输入参会人姓名"  type="text" v-model="attendee">
          </div>
        </div>

        <div class="form__item">
          <div class="form__item__label">上传图片</div>
          <div class="form__item__uploader">

            <div class="image-preview"  v-for="(image, imageIndex) in projectImage" :key="imageIndex">
              <img :src="getImage(image.src)" alt="" @click="handleClickImage(image.src)">
              <div v-show="!isReadonly" class="close" @click="handleClickRemoveImage(imageIndex)"><img :src="iconClose" alt=""></div>
            </div>

            <add_img v-if="!isReadonly && projectImage.length<5" agent="reportcard" :imageList="projectImage" :limit="5" @updateImageList="(list)=>{handleUploadedImage(list)}"></add_img>

          </div>
        </div>
      </div>
    <div class="form form-sign">
      <div class="form__item" v-if="!isReadonly || (isReadonly && managerSign)">
        <div class="form__item__label">总经理签字</div>
        <div class="form__item__sign">
          <div class="sign-preview" v-if="managerSign">
            <img :src="getImage(managerSign)" alt="" @click="handleClickSignPicture(managerSign)">
            <div v-show="!isReadonly" class="close" @click="handleClickRemoveSign1"><img :src="iconClose" alt=""></div>
          </div>
          <div v-else class="sign" @click="handleClickSignBtn1()">
            <img :src="iconPencil" alt=""><span>签名</span>
          </div>
        </div>
      </div>
      <div class="form__item" v-if="!isReadonly || (isReadonly && investorSign)">
        <div class="form__item__label">投资人签字（必填）</div>
        <div class="form__item__sign">
          <div class="sign-preview" v-if="investorSign">
            <img :src="getImage(investorSign)" alt="" @click="handleClickSignPicture(investorSign)">
            <div v-show="!isReadonly" class="close" @click="handleClickRemoveSign"><img :src="iconClose" alt=""></div>
          </div>
          <div v-else class="sign" @click="handleClickSignBtn()">
            <img :src="iconPencil" alt=""><span>签名</span>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <template v-if="!isAdmin">
        <button class="btn" v-if="isReadonly"  @click="handleClickFeedbackBtn">申请修改</button>
        <button class="btn" v-else @click="handleSubmitFeedback">反馈</button>
      </template>
      <button @click="print" class="btn">打印成绩单</button>
    </div>
    <qw_assign_box
            v-if="isShowSignBox"
            :imgUrl="investorSign"
            @cancelCanvas="cancelCanvas"
            @saveCanvasToURL="saveCanvasToURL">
    </qw_assign_box>
    <qw_assign_box
            v-if="isShowSignBox1"
            :imgUrl="managerSign"
            @cancelCanvas="cancelCanvas1"
            @saveCanvasToURL="saveCanvasToURL1">
    </qw_assign_box>
    

    <qw-popup v-model="isVisibleApplyingForm" position="center" :draggable="false" :disable-scroll="false" :need-refresh="true">
      <div class="applying">
          <div class="applying__header">
            反馈修改申请
          </div>
          <div class="applying__form">
            <div class="applying__form__item">
                <div class="applying__form__label">
                  申请原因:
                </div>
                <div class="applying__form__text">
                    <textarea v-model="applyForm.applyUpdateReason" resize="none"></textarea>
                </div>
            </div>

            <div class="applying__form__item">
              <div class="applying__form__label">
                申请人:
              </div>
              <div class="applying__form__input">
                <input :readonly="true" placeholder="请输入申请人" type="text" v-model="applyForm.applyUser">
              </div>
            </div>
            <dateInput :readonly="true" label="申请日期" placeholder="请选择申请日期" v-model="applyForm.applyTime"></dateInput>
          </div>
        <div class="btn-group">
          <button @click="handleSubmitApply" class="btn">提交</button>
        </div>
      </div>
    </qw-popup>

  </div>
</template>

<script>
import addFile from '@/components/add/upload/add_file'
import add_img from '@/components/add/upload/add_img'
import addFileList from '@/components/add/upload/addFileList'
import addImg from '@/components/add/upload/add_img'
import addImgList from '@/components/add/upload/imgList'
import qw_assign_box from '@/components/assign/assign_box'
import {uploadImageBase64, viewFeedProject} from '../../api/reportCard/index'
import iconPencil from '../../static/images/icon_pencil.png'
import iconClose from '../../static/images/icon_close.png'
import { addFeedProject, addFeedBack, viewFeedBack, updateFeedBack, updateFeedProject } from '../../api/reportCard/index'
import dateInput from "@/module/channelManagement/components/reportCard/dateInput";
import dayjs from 'dayjs';

//状态：0，未审批，1：审批通过，-1：审批不通过
const APPROVED_STATUS = {
    NOT_APPROVED: '0',
    APPROVE_SUCCESS: '1',
    APPROVE_FAIL: '-1',
}
const IMAGE_PATH_SEPARATOR = '##'; //多张图片，用##分割

export default {
  props: {
    reportDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    isAdmin: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  components: {
    addFile,
    addFileList,
    addImgList,
    addImg,
      qw_assign_box,
      add_img,
      dateInput,
  },
  data() {
    return {
        iconPencil,
        iconClose,
        feedbackProjects: [],
        formList:[
            {
                dealerInfoId: '', // 经销商id
                salesreportId: '', // 成绩单id
                projectName: '', // 项目名称
                projectLeader: '',
                finishedTime: '', // 完成时间
                // attendee: '', //  参会人
                // investorSign: '', // 签字
                // projectImage: [], // 项目图片
            },
            {
                dealerInfoId: '', // 经销商id
                salesreportId: '', // 成绩单id
                projectName: '', // 项目名称
                projectLeader: '',
                finishedTime: '', // 完成时间
            },
            {
                dealerInfoId: '', // 经销商id
                salesreportId: '', // 成绩单id
                projectName: '', // 项目名称
                projectLeader: '',
                finishedTime: '', // 完成时间
            },
        ],
        applyForm:{
            applyUpdateReason: '', //申请修改原因
            applyUser: _.personName || '', //申请人
            applyTime: dayjs(new Date()).format('YYYY-MM-DD'), //	申请时间
            dealerInfoId: '', //	经销商id
            salesreportId: '', //	成绩单id
            year: '', //	成绩单年份
            month: '', //	成绩单月份
        },
        attendee: '', //  参会人
        managerSign: '', //总经理签字
        investorSign: '', // 投资人签字
        projectImage: [], // 项目图片
        // approvalStatus: '',
    //   trainingFiles: [],
    //   deleteImage: {},
    //   content: '',
    //   fileUpload: {
    //     mediaList: [], // 编辑/复制等存在的原数据
    //     url: '/portal/imageupload/imageUploadAction!doUploadFile.action'
    //   },
    //   imgUploadPicList: [],
    //   camera: ['album', 'camera'],
        signImg1:'',
        signImg:'',
        // isFree: true,
        isShowSignBox1: false,
        isShowSignBox: false,
        // currentSignIndex:0,
        isVisibleApplyingForm: false,
    }
  },
  computed: {
    getId() {
      return this.reportCardId || ''
    },
    isDisabled() {
      return this.disabled;
    },
    canFeedback(){
      return this.reportDetail.readStatus === '3'; // 已读
    },
    hasFeedbackProjects(){
      return  this.feedbackProjects.length > 0
    },

    isReadonly(){
      const hasFeedbackProjects = !!this.feedbackProjects.length;
      if(!hasFeedbackProjects){
          return false || this.isAdmin;
      }
      const canModify =  String(this.feedbackProjects[0].status) === '0'; //可以修改的状态是0 ，不可以修改是1
      return !canModify || this.isAdmin;
    }
  },
  watch: {
    feedback(value) {
      this.content = value
    },
    files(value) {
      this.fileUpload.mediaList = value
    },
    imgs(val) {
      this.imgUploadPicList = val.map(item => {
        return Object.assign({}, item, { src: item.url })
      })
    },
    reportDetail(detail){
        this.initFeedbackForms(detail)
        this.fetchFeedbackProjects(detail)
    },
    feedbackProjects(feedbackProjects){
        this.setFeedbackForms(feedbackProjects)
        if(feedbackProjects.length){
            this.fetchFeedBackApprovalDetail(this.reportDetail)
        }
    }
  },
    created() {
        this.initFeedbackForms(this.reportDetail)
        this.setFeedbackForms(this.feedbackProjects);
        if(this.feedbackProjects.length){
            this.fetchFeedBackApprovalDetail(this.reportDetail)
        }
        this.fetchFeedbackProjects(this.reportDetail)

    },
    methods: {
      // showMsgFromFileDetail() {},
      // deleteFileItem() {},
      // setImgUploadValue() {},

      // // 图片删除
      // handleDeleteImage(item) {
      //   this.deleteImage = item
      // },

      // handleSubmit() {

      //   const files = this.fileUpload.mediaList.map(item => item.url)
      //   const fileNames = this.fileUpload.mediaList.map(item => item.fileName)
      //   const imgs = this.imgUploadPicList.map(item => item.src)

      //   if (!this.content) {
      //     this.$toast('不能反馈内容为空')
      //     return
      //   }

      //   if(imgs.length <2){
      //     this.$toast('培训照片至少上传2张')
      //     return
      //   }

      //   if(!this.canFeedback){
      //     this.$toast('当前成绩单状态不能反馈')
      //     return
      //   }

      //   this.$emit('submit', {
      //     fileNames: fileNames,
      //     files: files,
      //     content: this.content,
      //     imgs: imgs
      //   })
      // },

      handleClickAdd(index){
          const dealerInfoId = this.reportDetail.dealerId || ''; // 经销商id
          const salesreportId = this.reportDetail.id || ''; // 成绩单id
          // const investorSign = this.signImg || '';
          this.formList.splice(index+1, 0,   {
              dealerInfoId: dealerInfoId, // 经销商id
              salesreportId: salesreportId, // 成绩单id
              projectName: '', // 项目名称
              projectLeader: '', // 项目负责人
              finishedTime: '', // 完成时间
              // attendee: '', // 参会人
              // investorSign: investorSign, 
              // projectImage: [], // 项目图片
          })
      },
      handleClickRemove(index){
          this.formList.splice(index, 1);
      },

      saveCanvasToURL(event){
          const base64 = event.imageUrl;
          this.isShowSignBox = false;
          uploadImageBase64(base64).then((data)=>{
              // this.formList = this.formList.map(item=>({...item, investorSign: data.imgurl}));
              this.investorSign = data.imgurl
              // this.signImg =  data.imgurl
          })
      },

      saveCanvasToURL1(event){
          const base64 = event.imageUrl;
          this.isShowSignBox1 = false;
          uploadImageBase64(base64).then((data)=>{
              // this.formList = this.formList.map(item=>({...item, investorSign: data.imgurl}));
              this.managerSign = data.imgurl
              // this.signImg1 =  data.imgurl
          })
      },
      cancelCanvas(){
        this.isShowSignBox = false;
      },

      cancelCanvas1(){
        this.isShowSignBox1 = false;
      },
      handleClickSignBtn(){
        this.isShowSignBox = true;
      },

      handleClickSignBtn1(){
        this.isShowSignBox1 = true;
      },

      handleClickRemoveSign(){
          // this.formList = this.formList.map(item=> ({...item, investorSign: ''}));
          this.investorSign = '';
          this.signImg =  '';
      },

      handleClickRemoveSign1(){
          // this.formList = this.formList.map(item=> ({...item, investorSign: ''}));
          this.managerSign = '';
          // this.signImg1 =  '';
      },

      handleClickSignPicture(path){
          const url = _.fileDownURL + path
          this.$imagePreview({
              urls: [url]
          });
      },

      handleClickImage(path){
          const url = _.fileDownURL + path
          this.$imagePreview({
              urls: [url]
          });
      },

      handleClickRemoveImage(imageIndex){
          // this.formList[index].projectImage.splice(imageIndex, 1);
          this.projectImage.splice(imageIndex, 1);
      },

      handleUploadedImage(images){
          // this.formList[index].projectImage = images.slice(0,5)
          this.projectImage = images.slice(0,5)
      },


      validateApplyingForm(form){
          const result = {
              isValid: true,
              message: ''
          }
          if(!form.applyUpdateReason){
              Object.assign(result, {isValid: false, message: `申请修改原因不能为空`})
              return result;
          }
          if(!form.applyUpdateReason){
              Object.assign(result, {isValid: false, message: `申请修改原因不能为空`})
              return result;
          }
          if(!form.applyUser){
              Object.assign(result, {isValid: false, message: `申请人不能为空`})
              return result;
          }
          if(!form.applyTime){
              Object.assign(result, {isValid: false, message: `申请时间不能为空`})
              return result;
          }
          return result;
      },

      handleSubmitApply(){
          const validateResult = this.validateApplyingForm(this.applyForm);
          if(!validateResult.isValid){
              _.alert('提示', validateResult.message);
              return;
          }
          addFeedBack(this.applyForm).then((data)=>{
              if(data){
                  this.isVisibleApplyingForm = false;
                  _.alert('提示', '修改反馈信息申请提交成功')
              }
          })
      },

      handleClickUpdatedApply(){
          updateFeedBack(this.applyForm).then((data)=>{
              if(data){
                  this.isVisibleApplyingForm = false;
                  _.alert('提示', '更新申请提交成功')
              }
          })
      },

      handleClickFeedbackBtn(){
          this.isVisibleApplyingForm = true;
      },

        /**
         * 验证反馈项目表单
         * @param forms
         * @return {{isValid: boolean, message: string}}
         */
      validateFeedbackProjectsForm(forms){
          const result = {
              isValid: true,
              message: ''
          }
          for (let index = 0; index < forms.length; index++){
             const form = forms[index];
             if(!form.projectName){
                  Object.assign(result, {isValid: false, message: `项目${index+1}名称不能为空`})
                 break;
             }
            if(!form.projectLeader){
                 Object.assign(result, {isValid: false, message: `项目${index+1}负责人不能为空`})
                break;
            }
            if(!form.finishedTime){
                 Object.assign(result, {isValid: false, message: `项目${index+1}完成时间不能为空`})
                break;
            }
          }
          
          if (result.isValid) {
            if(!this.attendee){
              Object.assign(result, {isValid: false, message: `参会人不能为空`})
            }
            else if(!(this.attendee.includes(';') || this.attendee.includes('；'))){
              Object.assign(result, {isValid: false, message: `参会人姓名之间用分号分割`})
            }
            else if(!this.projectImage){
              Object.assign(result, {isValid: false, message: `图片不能为空`})
            }
            else if(this.projectImage.length <2){
              Object.assign(result, {isValid: false, message: `图片数量不能小于2`})
            }
            else if(this.projectImage.length >5){
              Object.assign(result, {isValid: false, message: `图片数量超过5`})
            }
            else if(!this.investorSign && !this.managerSign){
              Object.assign(result, {isValid: false, message: `总经理签字和投资人签字不能同时为空`})
            }
          }
          return result;
       },

      handleSubmitFeedback(){
          const validateResult = this.validateFeedbackProjectsForm(this.formList);
          if(!validateResult.isValid){
              _.alert('提示', validateResult.message);
              return;
          }
          let self = this
          const forms = this.formList.map((form,index)=>{ // 多个图片合并到一个字段
              const imageSrc = self.projectImage.map(item=>item.src).join(IMAGE_PATH_SEPARATOR);
              return Object.assign({}, form, {
                  projectImage: imageSrc,
                  investorSign: this.investorSign,
                  generalManagerSign: this.managerSign,
                  attendee: this.attendee,
                  projectSort: index
              })
          })
          // console.log(forms)
          /***************提交反馈*********** */
          if(this.hasFeedbackProjects){ // 更新
              updateFeedProject(forms).then((data)=>{
                  _.alert('提示', '反馈信息更新成功');
                  this.fetchFeedbackProjects(this.reportDetail)
                  this.$emit('afterFeedback')
              })
          }else{ //新增
              addFeedProject(forms).then((data)=>{
                  _.alert('提示', '反馈信息提交成功');
                  this.fetchFeedbackProjects(this.reportDetail) // 刷新反馈项目数据
                  this.$emit('afterFeedback')
              })
          }
          /*********************************** */
      },

      initFeedbackForms(detail){
          this.formList = this.formList.map((form)=>{
              return Object.assign({}, form, {
                  dealerInfoId: detail.dealerId || '', // 经销商id
                  salesreportId: detail.id || '', // 成绩单id
              })
          })
          // 反馈表单
          this.applyForm.dealerInfoId = detail.dealerId || '';
          this.applyForm.salesreportId = detail.id || '';
          this.applyForm.year = detail.year || '';
          this.applyForm.month = detail.month || '';
      },

        setFeedbackForms(feedbackProjects){
            if(!feedbackProjects.length){
                return
            }
            // 改
            this.formList = feedbackProjects.map((form)=>{
                let projectImagePaths = []
                if(form.projectImage){ // projectImage 字段修改数组保存, 可保存多张
                    const images = form.projectImage.split(IMAGE_PATH_SEPARATOR);
                    projectImagePaths = images.map((path)=>({
                        src: path
                    }))
                    this.projectImage = projectImagePaths
                }
                this.attendee = form.attendee || ''
                return {
                    // attendee: form.attendee,
                    dealerInfoId: form.dealerInfoId,
                    finishedTime: form.finishedTime,
                    // investorSign: form.investorSign,//改
                    // projectImage: projectImagePaths,//改
                    projectLeader: form.projectLeader,
                    projectName: form.projectName,
                    salesreportId: form.salesreportId,
                    id: form.id || undefined, // json Stringify 忽略undefined
                }
            })
           const item = feedbackProjects.find(item=>!!item.investorSign||!!item.generalManagerSign)
          //  this.signImg = item && item.investorSign ? item.investorSign:  '';
          //  this.signImg1 = item && item.generalManagerSign ? item.generalManagerSign:  '';
           this.investorSign = item && item.investorSign ? item.investorSign:  '';
           this.managerSign = item && item.generalManagerSign ? item.generalManagerSign:  '';
           
          //  console.log(this.projectImage)
        },

        getImage(path){
          return path ?  _.fileDownURL + path: '';
        },

        fetchFeedBackApprovalDetail(reportDetail={}){
            const dealerInfoId = reportDetail.dealerId || ''; // 经销商id
            const salesreportId = reportDetail.id || ''; // 成绩单id
            if(!dealerInfoId || !salesreportId){
                return
            }
            viewFeedBack({dealerInfoId, salesreportId}).then((data)=>{
                if(data){
                    this.applyForm.applyUpdateReason = data.applyUpdateReason || '';
                    this.applyForm.dealerInfoId = data.dealerInfoId || '';
                    this.applyForm.salesreportId = data.salesreportId || '';
                    this.applyForm.year = data.year || '';
                    this.applyForm.month = data.month || '';
                }
            })
        },

        fetchFeedbackProjects(reportDetail){
            const dealerInfoId = reportDetail.dealerId || ''; // 经销商id
            const salesreportId = reportDetail.id || ''; // 成绩单id
            if(!dealerInfoId || !salesreportId){
                return
            }
            viewFeedProject({dealerInfoId, salesreportId}).then((data)=>{
                this.feedbackProjects = data ?data: [];
            })
        },

        print(){
          this.$emit('print')
        },

        getProjectImages(imagePaths){
            return imagePaths? imagePaths.split(IMAGE_PATH_SEPARATOR) : []
        }
    }
}
</script>

<style lang="scss" scoped>
.feedback {
  background: #ffffff;
  padding-bottom: 12px;
  .header {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(20, 30, 40, 1);
    padding-left: 26px;
    padding-top: 13px;
    /*padding-bottom: 13px;*/
    position: relative;
    &::before {
      content: '';
      position: absolute;
      display: block;
      height: 16px;
      border-radius: 2px;
      width: 4px;
      background-color: #c6001f;
      top: 18px;
      left: 18px;
    }
    &>span{
      font-weight: normal;
      font-size: 14px;
    }
  }
  .form{
    padding:18px 18px 0;
    &.form-sign{
      padding:0 18px;
    }
    .form__item{
      padding-bottom: 14px;
    }
    .form__item__label{
      padding-left: 4px;
      padding-bottom: 6px;
    }
    .form__item__input{
      height:29px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(207,207,207,1);
      opacity:1;
      border-radius:1px;
      &>input{
        text-indent: 4px;
        width: 100%;
        height: 100%;
      }
    }
  }

  .btn-group{
    display: flex;
    padding-top: 30px;
    justify-content: center;
    .btn{
      width:96px;
      display: block;
      height:28px;
      background:rgba(91,155,239,1);
      border:none;
      opacity:1;
      border-radius:4px;
      margin: 0 4px;
      color: #ffffff;
      line-height: normal;
    }
  }

  .gutter {
    height: 10px;
    background: rgba(247, 247, 247, 1);
  }

  .operation{
    display: flex;
    justify-content: space-between;
    width: 44px;
    height: 20px;
    position: absolute;
    top: 18px;
    right: 18px;
  }
  .operation__btn{
    width: 20px;
    height: 20px;
    font-size: 20px;
    line-height: 1;
    background: #5B9BEF;
    color: #ffffff;
    border: none;
    &[disabled]{
      background: #AEAEAE;
    }
  }

  .form-wrapper{
    position: relative;
  }

  .sign{
    height: 32px;
    border: 1px solid #e5e5e5;
    width: 70px;
    border-radius: 4px;
    & >img{
      padding: 6px;
      height: 20px;
      width: 20px;
      vertical-align: top;
    }
    span{
      line-height: 32px;
      vertical-align: top;
      font-size: 14px;

    }
  }

  .sign-preview{
    height: 32px;
    border: 1px solid #e5e5e5;
    width: 70px;
    border-radius: 4px;
    position: relative;
    &>img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .close{
      position: absolute;
      top: -7px;
      right: -7px;
      width: 14px;
      height: 14px;
      &>img{
        width: 100%;
        height: 100%;
      }
    }
  }


    .form__item__uploader{
      display: flex;
      align-items: center;
    }

  .image-preview{
    height: 48px;
    border: 1px solid #e5e5e5;
    width: 48px;
    border-radius: 4px;
    position: relative;
    margin-right: 10px;
    &>img{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .close{
      position: absolute;
      top: -7px;
      right: -7px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: rgba(255,255,255,1);
      &>img{
        width: 100%;
        height: 100%;
      }
    }
  }

  .applying{
    width: 336px;
    padding: 14px;
    box-sizing: border-box;
    background: #ffffff;
    .applying__header{
      width: 100%;
      height:24px;
      font-size:17px;
      font-weight:400;
      line-height:24px;
      color:rgba(102,102,102,1);
    }
    .applying__form__item{
      margin-top: 15px;
    }
    .applying__form__input{
      height:29px;
      background:rgba(243,243,243,1);
      border:1px solid rgba(207,207,207,1);
      width: 100%;
      &>input{
        width: 100%;
        height: 100%;
        text-indent: 10px;
      }
    }
    .applying__form__label{
      margin-bottom: 10px;
    }
    .applying__form__text{
      background:rgba(243,243,243,1);
      border:1px solid rgba(207,207,207,1);
      width: 100%;
      height:139px;
      textarea{
        width: 100%;
        height: 100%;
        padding: 5px;
        box-sizing: border-box;
        border: 1px;
      }
    }
  }
}
</style>
