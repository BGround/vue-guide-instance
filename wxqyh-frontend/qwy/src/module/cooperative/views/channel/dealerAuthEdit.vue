<template>
  <div class="service-model-edit">




    <div>

      <div class="form">


        <div class="form__item">
          <div class="form__item__label">
            大区负责人:
          </div>
          <div class="form__item__value">
            <pick-exam
                    class="type_person"
                    :useDepts="departments"
                    :useUsers="users"
                    :useTab="tabsConfig"
                    :isShowRadios="false"
                    :onlyUser="true"
                    :maxUser="1"
                    @chooseDone="handleChooseLeader"
            ></pick-exam>
          </div>
        </div>

        <div class="form__item">
          <div class="form__item__label">
            经销商:
          </div>
          <div class="form__item__value">
            <el-select style="width: 468px" :multiple="true" :filter-method="handleFilter"  @change="handleChangeDealer"  v-model="dealerIds" :clearable="true" placeholder="请选择经销商简称" size="small" popper-class="chery" :filterable="true">
              <el-option :label="item.dealerFullName" :value="item.id" v-for="(item, index) in filteredDealerOptions" :key="item.id"></el-option>
            </el-select>
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

    import {ajaxAdd, ajaxUpdate, getAllDealerFullNameList} from '../../api/channel'
    import pickExam from '@/components/pickPerson/pickExam';
    import * as operatingAuthorityApi from "module/outletsAddressBook/api/operatingauth/api";


    export default {
        name: "serviceModelEdit",
        components: {
            qwuiButton,
            // qwuiRadio,
            qwuiCheckbox,
            QwuiRadioGroup,
            QwuiRadio,
            // QwUploadImg,
            numberInput,
            pickExam
        },
        data() {
            return {
                form:{
                    dealerId: '',
                    erpNo: '',
                    userId: '',
                    id: '',
                },
                dealerIds: [],

                tabsConfig:[
                    // {text:'部门'},
                    {text:'标签人员'},
                    {text:'特定人员'},
                    {text:'批量导入'},
                    {text:'高级筛选'},
                ],
                users: [],
                departments: [],
                dealerOptions:[],
                filteredDealerOptions:[],
            }
        },
        props: {
            detail:{
                type: Object,
                default(){
                    return {}
                }
            }
        },
        watch:{
            detail:{
                deep: true,
                handler: 'initFormData'
            },
        },

        methods: {


            handleFilter(keyword){
                if(keyword){
                    this.filteredDealerOptions = this.dealerOptions
                        .filter(item=>item.erpCarNo.includes(keyword) || item.dealerFullName.includes(keyword));
                }else{
                    this.filteredDealerOptions = this.dealerOptions
                }
            },

            handleChooseLeader(dept,tag,users){
                this.users = [...users];
                this.form.userId = this.users.map(this.pickUserId).join()
            },

            pickUserId(item){
                return item.userId ? item.userId: (item.id? item.id: '');
            },

            handleSubmit(){

                const params = {
                    'tbEntQrFileBagRPPO.userId': this.form.userId,
                    'tbEntQrFileBagRPPO.erpNo': this.form.erpNo,
                    'tbEntQrFileBagRPPO.dealerId': this.form.dealerId,
                }
                if(this.form.id){
                    const form = {...params, 'tbEntQrFileBagRPPO.id': this.form.id};
                    ajaxUpdate(form).then((data)=>{
                        this.$emit('afterSubmit');
                        if(data){
                            _.alert('提示', '更新成功')
                        }
                    })
                }else{
                    ajaxAdd(params).then((data)=>{
                        this.$emit('afterSubmit');
                        if(data){
                            _.alert('提示', '新增成功')
                        }
                    })
                }

            },

            initFormData(detail = {}){
                this.form.dealerId = detail.dealerId || '';
                this.form.erpNo = detail.erpNo || '';
                this.form.userId = detail.userId || '';
                this.dealerIds = detail.dealerId ? detail.dealerId.split(','): '';
                this.form.id = detail.id || '';
                if(detail.userId && detail.userName){
                    this.users = [{
                        id: detail.userId,
                        personName: detail.userName,
                    }]
                }else{
                    this.users = [];
                }

            },

            handleChangeDealer(dealerIds=[]){
                this.form.dealerId = dealerIds.join()
                this.form.erpNo = this.dealerOptions
                    .filter(item=>dealerIds.includes(item.id))
                    .map(item=>item.erpCarNo? item.erpCarNo: '')
                    .join()
            }

        },
        created() {
            getAllDealerFullNameList().then((data)=>{
                this.dealerOptions = data && data.postVOs ? data.postVOs: [];
                this.filteredDealerOptions = this.dealerOptions
            })
            this.initFormData(this.detail);
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
      .qwui-click_choose{
        width: 450px;
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
