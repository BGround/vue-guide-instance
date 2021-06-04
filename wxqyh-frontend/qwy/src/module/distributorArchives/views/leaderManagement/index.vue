<template>
  <div class="competing-management">

    <div class="qwui-nav_wrap">

      <div class="wrap__left">
        <qwuiButton @click="handleClickBack" type="button" >&nbsp;返回&nbsp;</qwuiButton>
        <span class="qwui-dotted_line"></span>
        <qwuiButton type="button" @click="handleClickExportDialog">&nbsp;导入&nbsp;</qwuiButton>
<!--        <qwuiButton type="button" @click="handleClickExportBtn">&nbsp;导出&nbsp;</qwuiButton>-->
        <qwuiButton type="button" @click="handleClickRemoveBatchBtn">&nbsp;删除&nbsp;</qwuiButton>
        <qwuiButton type="primary" @click="handleClickAddBtn">&nbsp;新增&nbsp;</qwuiButton>
      </div>

      <div class="wrap__right">
        <el-input v-model="keyWord" placeholder="搜索ERP号\经销商姓名"></el-input>
        <el-button type="primary" @click="handleSearch">查询</el-button>
<!--        <qwuiButton type="primary" @click="handleClickAddBtn">&nbsp;新增&nbsp;</qwuiButton>-->
      </div>
    </div>

    <div class="qwui-title_wrap">
      <div class="qwui-title">大区负责人管理</div>
    </div>

    <div class="competing">

      <dataTable :headData="headData" :dataList="tableData"> </dataTable>

    </div>

    <page :pageData="pageParams" @change="handleChangePage"></page>

    <el-dialog
            @close="handleCloseDialog"
            title="批量导入"
            :visible.sync="isVisibleDialog"
            width="800px">
      <div class="dialog__content">

        <importExcel v-if="isVisibleDialog" reportType="SERVICE_ADMIN_INFO"></importExcel>


      </div>
      <div slot="footer">
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
    import { ajaxDeleteServiceAdmin, ajaxSearchServiceAdmin} from "../../api/getData";
    import page from '@/components/list/page.vue'
    import dataTable from '@/components/Table/dataTable.vue'
    import exportReportForm from '@/assets/js/export/schoolReportexport.js';
    import importExcel from "./importExcel";

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
            importExcel
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
                    left: {
                      id: "id",
                      checkFunc: (isSelectedAll, list) => {
                        const ids = list.filter(item=>item.isChecked).map(item=>item.id);
                        this.ids = ids;
                      }
                    },

                    middle: [
                        {
                            title: '服务ERP号',
                            key: 'serviceErp',
                            textAlign: 'center',
                        },
                        {
                            title: '服务站简称',
                            key: 'serviceStationName',
                            textAlign: 'center',
                        },
                        {
                            title: '大区负责人',
                            key: 'personName',
                            textAlign: 'center',
                        },
                        {
                            title: '账号',
                            key: 'wxUserId',
                            textAlign: 'center',
                        },
                    ],
                    right: {
                        isShowOperate: true,
                        width: 100
                    }
                },

                keyWord: '',
                isVisibleDialog: false,

            }
        },
        props: {},
        methods: {

            moreImgUpload(e){
                console.log(e.imageObj);
            },

            handleClickBack(){
                this.$router.back()
            },

            handleClickAddBtn(){
                // this.isVisibleDialog= true;
                this.$router.push({
                  name: 'editLeader'
                })
            },

            handleClickImportBtn(){
               const ids = this.ids.join(',');
               if(!ids){
                   this.$message('请选择要导出的数据')
                   return;
               }
                const form = {
                    'searchValue.ids':  this.ids.join(','),
                    'reportType': 'SALES_SERVICE_PLAN', //导出成绩单明细
                }
                this._exportReport(form)
            },

            handleClickRemoveBatchBtn(){
                const params = {'ids[]': this.ids.join()}
                ajaxDeleteServiceAdmin(params).then((data)=>{
                    if(data){
                        this.searchLeaders();
                    }
                })
            },

            handleClickRemoveBtn(ids){
                ajaxDeleteServiceAdmin({'ids[]':ids}).then((data)=>{
                    if(data){
                        this.searchLeaders();
                    }
                })
            },

            handleClickEditBtn(item){
                this.$router.push({
                    name: 'editLeader',
                    query:item,
                })
            },

            headerCellStyle(){
                return {
                    background: '#f5f5f5'
                }
            },
            cellStyle(){
                return {
                    padding: '6px 0'
                }
            },

            handleInputKeyword(keyword){
              console.log(keyword)
            },

            handleCheckedProductsChange(){

            },

            searchLeaders(){
                const self = this;
                const params = {
                    page: this.pageParams.page,
                    pageSize: this.pageParams.pageSize,
                    keyWord: this.keyWord,
                }
                ajaxSearchServiceAdmin(params).then((data)=>{
                    if(data){
                        this.pageParams.totalRows = data.totalRows;
                        this.pageParams.maxPage = data.totalPages;
                        this.tableData = data.pageData.map((item)=>{
                            return Object.assign({}, item, {
                                wxUserId: item.wxUserId? item.wxUserId:'-',
                                personName: item.personName? item.personName:'-',
                                serviceStationName: item.serviceStationName? item.serviceStationName:'-',
                                serviceErp: item.serviceErp? item.serviceErp:'-',
                                operationList: [
                                    {
                                        text: '删除',
                                        operationFunc: detail => {
                                            self.handleClickRemoveBtn([item.id])
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

            getImage(path){
                return path? (_.fileDownURL + path) : null;
            },

            handleChangePage(page, pageSize) {
                this.searchLeaders()
            },

            handleSearch(){
                this.tableData = [];
                this.pageParams.page = 1;
                this.searchLeaders();
            },

            //
            handleClickExportDialog(){
              this.isVisibleDialog = true;
                // window.location.href = _.baseURL + '/manager/qiruiqd/qiruiqd_import.jsp?reportType=SERVICE_ADMIN_INFO'
            },

            handleCloseDialog(){
                this.searchLeaders()
            },

            handleConfirmImport(){
                console.log('xx')
            }

        },
        created() {
            this.searchLeaders()
        }
    }
</script>

<style scoped lang="scss">
  .competing-management{
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
  }
</style>
