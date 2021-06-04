<template>
  <div class="operating-authority-model-management">

    <div class="qwui-nav_wrap">

      <div class="wrap__left">
        <qwuiButton type="button" @click="handleClickBack">&nbsp;返回&nbsp;</qwuiButton>
        <span class="qwui-dotted_line"></span>
        <qwuiButton type="primary" @click="handleClickAddBtn">&nbsp;新增&nbsp;</qwuiButton>
      </div>

      <div class="wrap__right">

      </div>
    </div>

    <div class="qwui-title_wrap">
      <div class="qwui-title">星途车型管理</div>
    </div>

    <div class="competing">

      <dataTable :headData="headData" :dataList="tableData"> </dataTable>

    </div>

    <page :pageData="pageParams" @change="handleChangePage"></page>


    <el-dialog
            @close="handleCloseDialog"
            :title="isEdit?'编辑':'新增'"
            width="500px"
            :visible.sync="isVisibleEditDialog">
      <div class="dialog__content">
        <div class="form">

            <div class="form__item">
              <div class="form__item__label">
                星途车型:
              </div>
              <div class="form__item__value">
                <el-input size="small" v-model="modelName"  placeholder="请输入星途车型"></el-input>
              </div>
            </div>
        </div>
      </div>
      <div class="dialog-footer" slot="footer">
        <qwuiButton v-if="isEdit" type="primary" @click="handleConfirmUpdateBtn">&nbsp;确定&nbsp;</qwuiButton>
        <qwuiButton v-else type="primary" @click="handleConfirmSaveBtn">&nbsp;确定&nbsp;</qwuiButton>
      </div>

    </el-dialog>


  </div>
</template>

<script>
    import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
    import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
    import QwuiRadio from '@/components/qwuiRadio/radio'; // 公共-单选框组件
    import QwuiRadioGroup from '@/components/qwuiRadio/radio_group'; // 公共-单选框群组组件
    // import QwUploadImg from "@/components/Add/uploadImg/QwUploadImg";
    import uploadImg from '@/components/Add/uploadImg/QwUploadImg'
    import page from '@/components/list/page.vue'
    import dataTable from '@/components/Table/dataTable.vue'
    import exportReportForm from '@/assets/js/export/schoolReportexport.js';
    // import importExcel from "./importExcel";
    import operatingAuthorityEdit from "./operatingAuthorityEdit";
    import * as operatingAuthorityApi  from '../../api/operatingauth/api'

    export default {
        name: "competingManagement",
        mixins:[exportReportForm],
        components: {
            qwuiButton,
            // qwuiRadio,
            qwuiCheckbox,
            QwuiRadioGroup,
            QwuiRadio,
            // QwUploadImg,
            uploadImg,
            page,
            dataTable,
            // importExcel,
            operatingAuthorityEdit
        },
        data() {
            return {
                tableData:[

                ],

                pageParams: {
                    page: 1,
                    pageSize: 10,
                    maxPage: 1,
                    totalRows: 0
                },
                ids: [],

                headData: {

                    middle: [
                        {
                            title: '星途车型',
                            key: 'modelName',
                            textAlign: 'center',
                            width: 868
                        },
                    ],
                    right: {
                        isShowOperate: true,
                        width: 100
                    }
                },

                keyWord: '',
                isVisibleEditDialog: false,
                modelName: '', // 星途车型
                isEdit: false,
                id: '',
            }
        },
        props: {},
        methods: {


            handleClickBack(){
                this.$router.back()
            },

            handleClickAddBtn(){
                this.isEdit = false;
                this.isVisibleEditDialog= true;
            },

            handleClickRemoveBatchBtn(){
                const params = {'ids[]': this.ids.join()}
                operatingAuthorityApi.ajaxDeleteCelebrityModels(params).then((data)=>{
                    if(data){
                        _.alert('提示','新增成功');
                        this.searchCarModel();
                    }
                })
            },

            handleClickRemoveBtn(ids){
                operatingAuthorityApi.ajaxDeleteCelebrityModels({'ids':ids}).then((data)=>{
                    if(data){
                        _.alert('提示','新增成功');
                        this.searchCarModel();
                    }
                })
            },

            handleClickEditBtn(item){
                this.isEdit = true;
                this.modelName = item.modelName;
                this.id = item.id;
                this.isVisibleEditDialog = true;
            },

            searchCarModel(){
                const self = this;
                const params = {
                    page: this.pageParams.page,
                    pageSize: this.pageParams.pageSize,
                    keyWord: this.keyWord,
                }
                operatingAuthorityApi
                    .ajaxSearchCelebrityModels(params)
                    .then((data)=>{
                        if(data){
                            this.pageParams.totalRows = data.totalRows;
                            this.pageParams.maxPage = data.maxPage;
                            this.tableData = data.pageData.map((item)=>{
                                return Object.assign({}, item, {

                                    operationList: [
                                        {
                                            text: '删除',
                                            operationFunc: detail => {
                                                self.handleClickRemoveBtn(item.id)
                                            }
                                        },
                                        {
                                            text: '编辑',
                                            operationFunc: detail => {
                                                self.handleClickEditBtn(item)
                                            }
                                        }
                                    ]
                                })
                            })
                        }else {
                            this.tableData = [];
                        }
                    this.page = data && data.currPage ? data.currPage : 1;
                })
            },

            handleChangePage(page, pageSize) {
                this.searchCarModel()
            },

            handleCloseDialog(){
                this.modelName = '';
            },

            handleConfirmSaveBtn(){
                operatingAuthorityApi.ajaxAddCelebrityModels({
                    'TbEntQrCelebrityModelsPO.modelName': this.modelName
                }).then(data=>{
                    if(data){
                        _.alert('提示','新增成功');
                        this.isVisibleEditDialog = false;
                        this.searchCarModel();
                    }
                })
            },

            handleConfirmUpdateBtn(){
                operatingAuthorityApi.ajaxUpdateCelebrityModel({
                    'TbEntQrCelebrityModelsPO.modelName': this.modelName,
                    'TbEntQrCelebrityModelsPO.id': this.id
                }).then(data=>{
                    if(data){
                        _.alert('提示','更新成功');
                        this.searchCarModel();
                    }
                })
            }

        },
        created() {
            this.searchCarModel()
        }
    }
</script>

<style scoped lang="scss">
  .operating-authority-model-management{
    position: relative;
    padding: 10px 30px 0;
    width: 969px;
    min-height: 800px;
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
      width: 969px;
    }

    .table-header{
      background:  #d5d5d5;
    }

    .dialog__content__search{
      border-bottom: 1px solid #cfcfcf;
      padding-bottom: 15px;
      height: 200px;
    }

    .competing{
      /deep/{
        table{
          td{
            padding: initial;
          }
        }
      }
    }

    .qwui-nav_wrap{
      padding-top: 14px;
      display: flex;
      justify-items: center;
      justify-content: space-between;
    }

    .wrap__right{
      display: flex;
      flex-shrink: 0;
      width: 280px;
      justify-content: space-between;
      /deep/{

        .datepicker > input {
          margin-top: -3px;
          height: 32px;
        }
        .el-table th.is-leaf{
          background: #e7e8e9;
          color: #000;
        }
        .el-select {
          margin: 0 5px;
          width: 120px;
          .el-input.is-focus{
            .el-input__inner{
              border-color: #ccc;
            }
          }
          .el-input__inner:focus{
            border-color: #ccc;
          }

          .el-input__inner{
            height: 32px;
            line-height: 32px;
          }
          .el-input__icon{
            line-height: 32px;
          }
        }
        .el-input{
          .el-input__inner{
            line-height: 32px;
            height: 32px;
          }
          .el-input__icon{
            line-height: 32px;
          }
          &.is-active .el-input__inner, .el-input__inner:focus{
            border-color: #ccc;
          }
        }
        .el-input--prefix .el-input__inner{
          padding-left: 39px;
        }
        .el-date-editor--month{
          .el-input__inner{
            padding-left: 43px;
          }
        }
        .el-date-editor.el-input, .el-date-editor.el-input__inner{
          width: 130px;
        }

        .el-button{
          line-height: 32px;
          height: 32px;
          padding-top: 0;
          padding-bottom: 0;
        }

        .el-button.el-button--primary {
          color: #fff;
          background-color: #c31725;
          border-color: #c31725;
          margin-left: 6px;
          &:hover{
            background: #F08088;
            border-color: #F08088;
          }
        }
      }
    }




    .dialog__content__search{
      padding: 20px ;
      border-bottom: 1px solid #dcdfe6;
    }

    .dialog__content__options {
      height: 300px;
      overflow: auto;
    }

    .products{

    }

    .products__item{
      padding: 5px 12px 5px 20px;
      box-sizing: border-box;
      overflow: hidden;
      cursor: pointer;
      &.active {
        background-color: #eee;
      }
      label{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

    .footer{
      text-align: center;
    }

    .dialog-footer{
      text-align: center;
    }

    .form__item{
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
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
  .operating-auth{
    .el-dialog__wrapper{
      /*z-index: 100 !important;*/
    }
  }
  #msgBoxs ._mask{
    z-index: 2500 !important;
  }
  #msgBoxs ._alert_mask{
    z-index: 2500 !important;
  }
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
