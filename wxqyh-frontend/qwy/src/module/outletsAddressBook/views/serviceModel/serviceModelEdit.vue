<template>
  <div class="service-model-edit">




    <div>

      <div class="form">


        <div class="form__item">
          <div class="form__item__label">
            服务车型名称:
          </div>
          <div class="form__item__value">
            <el-input size="small" v-model="form.modelName" controls-position="right" ></el-input>
          </div>
        </div>

        <div class="form__item">
          <div class="form__item__label">
            服务车型代码:
          </div>
          <div class="form__item__value">
            <el-input size="small" v-model="form.modelCode" controls-position="right" ></el-input>
          </div>
        </div>


      </div>

     <div class="btn-group">
       <qwuiButton @click="handleSubmit"  type='primary' >&nbsp;提交&nbsp;</qwuiButton>
     </div>

    </div>







  </div>
</template>

<script>
    import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
    import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
    import QwuiRadio from '@/components/qwuiRadio/radio'; // 公共-单选框组件
    import numberInput from '@/components/base/numberInput'
    import QwuiRadioGroup from '@/components/qwuiRadio/radio_group'; // 公共-单选框群组组件
    import uploadImg from '@/components/Add/uploadImg/QwUploadImg'
    import {ajaxAddServiceModels, ajaxUpdateServiceModels} from '../../api/serviceCarModel/api'



    export default {
        name: "serviceModelEdit",
        components: {
            qwuiButton,
            // qwuiRadio,
            qwuiCheckbox,
            QwuiRadioGroup,
            QwuiRadio,
            // QwUploadImg,
            uploadImg,

            numberInput
        },
        data() {
            return {
                form:{
                    modelName: this.modelName,
                    modelCode: this.modelCode,
                    id: this.id,
                },
                sequence: 0,
                config_numberInput:{
                    data:0,
                    multiple:1,
                    showBtn:false
                },
                brands: [], // 品牌
                isDisplay: '1', ///状态(0.否,1.是)
                companyOptions: [],
                brandOptions: []
            }
        },
        props: {
            id:{
                type: String,
                default(){
                    return ''
                }
            },
            modelName:{
                type: String,
                default(){
                    return ''
                }
            },
            modelCode:{
                type: String,
                default(){
                    return ''
                }
            },
        },
        watch:{
            id(value){
                this.form.id = value;
            },
            modelName(value){
                this.form.modelName = value;
            },
            modelCode(value){
                this.form.modelCode = value;
            },
        },

        methods: {

            handleConfirm(name){
                this.brandName = name;
            },

            moreImgUpload(e){
                this.brandImg = e.imageURL
            },

            handleClickBack(){
                this.$router.back()
            },


            handleClickRemoveBrandName(){
                this.brandName = '';
            },

            handleSubmit(){

                const params = {
                    'TbEntQrServiceModelsPO.modelName': this.form.modelName,
                    'TbEntQrServiceModelsPO.modelCode': this.form.modelCode,
                }
                if(this.form.id){
                    const form = {...params, 'TbEntQrServiceModelsPO.id': this.form.id};
                    ajaxUpdateServiceModels(form).then((data)=>{
                        this.$emit('afterSubmit');
                        if(data){
                            _.alert('提示', '更新成功')
                        }
                    })
                }else{
                    ajaxAddServiceModels(params).then((data)=>{
                        this.$emit('afterSubmit');
                        if(data){
                            _.alert('提示', '新增成功')
                        }
                    })
                }

            },

        },
        created() {

        }
    }
</script>

<style scoped lang="scss">
  .service-model-edit{

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
      max-width: 120px;
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
      }
      /*.result__close{*/
      /*  background: url("./images/selected-close.png") no-repeat scroll 0 0;*/
      /*  cursor: pointer;*/
      /*  height: 16px;*/
      /*  position: absolute;*/
      /*  right: 12px;*/
      /*  top: 7px;*/
      /*  width: 16px;*/
      /*}*/
    }


    .form__item{
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      .form__item__label{
        flex-basis: 120px;
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
