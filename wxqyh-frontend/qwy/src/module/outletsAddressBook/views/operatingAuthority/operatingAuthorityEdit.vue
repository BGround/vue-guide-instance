<template>
  <div class="operating-authority-edit">

      <div class="form">

        <div class="form__item" v-show="readonlyDealer">
          <div class="form__item__label">
            整车ERP号:
          </div>
          <div class="form__item__value">
            <el-input style="width: 215px" size="small" v-model="erpNo" :disabled="true" placeholder="请输入整车ERP号"></el-input>
          </div>
        </div>


        <div class="form__item">
          <div class="form__item__label">
            经销商简称:
          </div>
          <div class="form__item__value">
            <el-select  @change="handleChangeDealer" :disabled="readonlyDealer" v-model="form.dealerId" :clearable="true" placeholder="请选择经销商简称" size="small" popper-class="chery" :filterable="true">
              <el-option :label="item.dealerFullName" :value="item.id" v-for="(item, index) in dealerOptions" :key="item.id"></el-option>
            </el-select>
          </div>
        </div>


        <div class="form__item">
          <div class="form__item__label">
            车型:
          </div>
          <div class="form__item__value">

            <el-select v-model="form.celebrityModelsIds" :clearable="true" :multiple="true" placeholder="请选择车型" size="small" popper-class="chery" :filterable="true">
              <el-option :label="item.modelName" :value="item.id" v-for="(item, index) in modelOptions" :key="item.id"></el-option>
            </el-select>

          </div>
        </div>

      </div>

    <div class="btn-group">
      <qwuiButton @click="handleSubmit" type='primary' >&nbsp;提交&nbsp;</qwuiButton>
    </div>


  </div>
</template>

<script>
    import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
    import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
    import QwuiRadio from '@/components/qwuiRadio/radio'; // 公共-单选框组件
    import numberInput from '@/components/base/numberInput'
    import QwuiRadioGroup from '@/components/qwuiRadio/radio_group'; // 公共-单选框群组组件
    import pickExam from '@/components/pickPerson/pickExam';
    import uploadImg from '@/components/Add/uploadImg/QwUploadImg'
    import dealerSelector from '@/module/distributorArchives/views/leaderManagement/components/dealerSelector'
    import * as operatingAuthorityApi  from '../../api/operatingauth/api'

    export default {
        name: "operatingAuthorityEdit",
        components: {
            qwuiButton,
            qwuiCheckbox,
            QwuiRadioGroup,
            QwuiRadio,
            uploadImg,
            numberInput,
            pickExam,
            dealerSelector
        },
        data() {
            return {
                id: '',
                dealerName: '',
                form:{
                    dealerId: '',
                    celebrityModelsIds: [],
                },
                erpNo: '',
                wxUserId: '',
                serviceStationName: '',
                personName: '',
                dealerFullName: '',
                isDisplay:'',
                modelOptions: [],
                dealerOptions: [],
                readonlyDealer: true,
            }
        },
        props: {
            detailId:{
                type: String,
                default(){
                    return '';
                }
            },
            dealerId:{
                type: String,
                default(){
                    return '';
                }
            }
        },
        watch:{
            detailId: 'initFormData'
        },
        methods: {

            handleConfirmServiceErp(item){
                this.dealerFullName = item.dealerFullName;
            },

            handleConfirmUser(item){
                this.wxUserId = item.wxUserId;
                this.personName = item.personName;
            },

            handleClickBack(){
                this.$router.back()
            },


            handleClickRemoveServiceErp(){
                this.serviceErp = '';
                this.wxUserId = '';
            },

            handleClickRemoveUser(item){
                this.wxUserId = '';
            },

            handleSubmit(){
                const params = {
                    'dealerId': this.form.dealerId,       //经销商ID
                    'ids': this.form.celebrityModelsIds.join(',')  //星途车型ID
                }
                if(this.detailId){
                    operatingAuthorityApi.ajaxUpdateDealerCelebrityModels(params).then((data)=>{
                        if(data){
                            _.alert('提示','更新成功');
                            this.$emit('submit')
                            this.resetForm();
                        }
                    })
                }
                operatingAuthorityApi.ajaxAddDealerCelebrityModels(params).then((data)=>{
                    if(data){
                        _.alert('提示','新增成功');
                        this.$emit('submit')
                        this.resetForm();
                    }
                })
            },

            resetForm(){
                this.form.dealerId = '';
                this.form.celebrityModelsIds = [];
            },


            //返回的部门、标签、人员数组（发布对象）
            chooseDone:function (dept=[],tag=[],user=[]) {
                console.log(user.map((item)=>item.id),'xx')
            },

            changeRedRadio(val){
                console.log(val);
            },

            handleChangeDealer(){
              this.celebrityModelsIds = [];
            },

            initFormData(detailId){
                operatingAuthorityApi.ajaxListCelebrityModels().then((data)=>{
                    this.modelOptions = data && data.list? data.list : [];
                })

                operatingAuthorityApi.getAllDealerFullNameList().then((data)=>{
                    this.dealerOptions = data && data.postVOs ? data.postVOs: [];
                })

                if(detailId){
                    operatingAuthorityApi
                        .ajaxViewDealerCelebrityModel({dealerId:this.dealerId})
                        .then((data)=>{
                            if(data && data.tbEntQrDealerCelebrityModelsPO){
                                const po = data.tbEntQrDealerCelebrityModelsPO;
                                this.erpNo = po.erpNo ? po.erpNo : '';
                                this.dealerName = po.dealerName ? po.dealerName : '';
                                this.form.celebrityModelsIds =  po.celebrityIds ? po.celebrityIds: [];
                            }
                        })
                    this.form.dealerId = this.dealerId;
                    this.readonlyDealer = true;
                }else{
                    this.readonlyDealer = false;
                }
            }


        },
        created() {
            this.initFormData(this.detailId)
        }
    }
</script>

<style scoped lang="scss">
  .operating-authority-edit{
    position: relative;
    padding: 10px 30px 0;
    background: #ffffff;
    .goLink {
      color: #C31725;
    }

    .qwui-nav_wrap {
      padding-bottom: 15px;
    }

    .qwui-line {
      position: relative;
      height: 1px;
      background: #eee;
      margin-bottom: 20px;
    }
    .qwui-title_wrap {
      background-color: #f5f5f5;
      border-left: 4px solid #C31725;
      height: 47px;
      line-height: 47px;
      position: relative;
      margin-bottom: 20px;
    }

    .qwui-title_wrap .qwui-title {
      font-weight: 700;
      margin-left: 20px;
      color: #666;
      font-size: 16px;
    }

    .qwui-button.qwui-button-primary:hover {
      background: #F08088;
      border-color: #F08088;
    }

    .qwui-button.qwui-button-primary {
      border-color: #C31725;
      color: #fff;
      background: #c31725;

    }

    .qwui-button {
      display: inline-block;
      line-height: 1;
      padding: 8px 15px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: #fff;
      color: #333;
    }

    position: relative;
    // border: 1px #ccc solid;
    // background-color: #fff;
    .form-wrapper {
      padding: 20px 20px 0;
    }
    .search-footer {
      margin-top: 10px;
      padding: 5px 20px;
      text-align: right;
      background-color: #f5f5f5;
      .search-btn {
        display: inline-block;
        padding: 0 16px;
        height: 26px;
        line-height: 26px;
        font-size: 14px;
        border-radius: 2px;
        box-sizing: border-box;
        &.search-btn-default {
          color: #333;
          border: 1px #ccc solid;
          margin-right: 16px;
          background-color: #fff;
          &:hover {
            background-color: #f7f7f7;
          }
        }
        &.search-btn-confirm {
          color: #fff;
          border: 1px #C31725 solid;
          background-color: #c31725;
          &:hover {
            background-color: #F08088;
          }
        }
      }
    }
    .line {
      text-align: center;
    }
    .qwui-dotted_line {
      border-right: 1px dashed #cfcfcf;
      margin: 0 8px 0 5px;
    }

    .competing{
      width: 600px;
    }

    .table-header{
      background:  #d5d5d5;
    }

    .dialog__content__search{
      border-bottom: 1px solid #cfcfcf;
      padding-bottom: 15px;
    }



    .result{
      margin-left: 10px;
      position: relative;
      display: inline-block;
      line-height: 1;
      padding: 8px 32px 8px 15px;
      font-size: 14px;
      border-radius: 4px;
      background: #fff;
      max-width: 180px;
      border: 1px solid #F08088;
      color: #C31725;
      &:hover{
        background: #fff9f0;
      }
      .result__text{
        display: inline-block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        vertical-align: bottom;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 160px;
      }
      .result__close{
        background: url("./images/selected-close.png") no-repeat scroll 0 0;
        cursor: pointer;
        height: 16px;
        position: absolute;
        right: 12px;
        top: 7px;
        width: 16px;
      }
    }


    .form__item{
      display: flex;
      align-items: flex-start;
      margin-bottom: 25px;
      .form__item__label{
        flex-basis: 100px;
        text-align: right;
        height: 32px;
        line-height: 32px;
      }
      .form__item__value{
        padding-left: 10px;
      }
    }

    .btn-group{
      text-align: center;
    }

    /deep/{
      .el-input.is-active .el-input__inner, .el-input__inner:focus{
        border-color: #C31725;
      }
      .el-select .el-input__inner:focus{
        border-color: #C31725;
      }
      .el-input.is-active .el-input__inner, .el-input__inner:focus{
        border-color: #C31725;
      }
      .el-select .el-input.is-focus .el-input__inner{
        border-color: #C31725;
      }
      .el-input-number__decrease:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled), .el-input-number__increase:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled){
        border-color: #C31725;
      }
    }
  }
</style>
<style lang="scss">
  .chery{
    .el-select-dropdown__item.selected{
      color: #C31725;
    }
    &.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover{
       color: #C31725;
     }
    &.el-select-dropdown.is-multiple .el-select-dropdown__item.selected{
       color: #C31725;
     }
  }
</style>
