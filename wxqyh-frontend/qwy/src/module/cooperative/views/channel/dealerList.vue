<template>
<div class="competing-management">

    <div class="qwui-nav_wrap">

        <div class="wrap__left">
            <qwuiButton type="primary" @click="handleClickAddBtn">&nbsp;新增&nbsp;</qwuiButton>
            <span class="qwui-dotted_line"></span>
            <qwuiButton type="button" @click="handleClickExportDialog">&nbsp;导入&nbsp;</qwuiButton>
        </div>

        <div class="wrap__right">
            <qwui-input inputType="search" @input="searchInput" @search='handleSearch' v-model="searchTitle" :inputTips="'搜索ERP号'"></qwui-input>
            <a class="qwui-senior_search_btn" @click="showAdvancedScreen">高级搜索</a>
        </div>
    </div>
    <advancedScreen v-show="isShowAdvancedScreen" :screenItemList="screenItemList" @searchResult="searchResult"></advancedScreen>


    <div class="competing">

        <dataTable :headData="headData" :dataList="tableData"> </dataTable>

    </div>

    <page :pageData="pageParams" @change="handleChangePage"></page>

    <el-dialog @close="handleCloseDialog" title="批量导入" :visible.sync="isVisibleDialog" width="800px">
        <div class="dialog__content">
            <importExcel v-if="isVisibleDialog" reportType="FAIL_BAG_SERVICE_ADMIN_JURISDICTION_INFO"></importExcel>

        </div>
        <div slot="footer">
        </div>

    </el-dialog>

    <el-dialog @close="handleCloseEditDialog" :title="isEditStatus?'编辑': '新增'" :visible.sync="isVisibleEditDialog" width="670px">
        <div class="dialog__content">

            <dealer-auth-edit :detail="currentDetail" @afterSubmit="handleAfterSubmit">
            </dealer-auth-edit>
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
import uploadImg from '@/components/Add/uploadImg/QwUploadImg'
import page from '@/components/list/page.vue'
import dataTable from '@/components/Table/dataTable.vue'
import exportReportForm from '@/assets/js/export/schoolReportexport.js';
import dealerAuthEdit from "./dealerAuthEdit";
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
import advancedScreen from '@/components/Screen/AdvancedScreen/AdvancedScreen';
import * as channelApi from '../../api/channel'
import * as operatingAuthorityApi from "module/outletsAddressBook/api/operatingauth/api";
import importExcel from "../../components/importExcel";

export default {
    name: "serviceModelManagement",
    mixins: [exportReportForm],
    components: {
        dealerAuthEdit,
        qwuiButton,
        // qwuiRadio,
        qwuiCheckbox,
        QwuiRadioGroup,
        QwuiRadio,
        // QwUploadImg,
        uploadImg,
        page,
        dataTable,
        importExcel,
        qwuiInput,
        advancedScreen,
    },
    data() {
        return {
            tableData: [

            ],

            pageParams: {
                page: 1,
                pageSize: 10,
                maxPage: 1,
                totalRows: 0
            },
            ids: [],

            form: {},

            headData: {
                // left: {
                //     id: "id",
                //     checkFunc: (isSelectedAll, list) => {
                //         const ids = list.filter(item=>item.isChecked).map(item=>item.id);
                //         this.ids = ids;
                //     }
                // },
                middle: [{
                        title: '大区负责人',
                        key: 'userName',
                        textAlign: 'center',
                        width: 200
                    },
                    {
                        title: 'ERP号',
                        key: 'erpNo',
                        textAlign: 'center',
                        width: 200
                    },
                    {
                        title: '简称',
                        key: 'dealerShortName',
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
            isVisibleEditDialog: false,
            isShowAdvancedScreen: false,
            searchTitle: '',
            dataList: [],
            currentDetail: {
                dealerId: '',
                erpNo: '',
                userId: '',
                id: '',
            },
            screenItemList: [{
                    type: 'text',
                    name: 'ERP',
                    modelName: 'erpNo',
                    // defaultValue: 344343
                },
                {
                    type: 'text',
                    name: '简称',
                    modelName: 'dealerShortName',
                },
                {
                    type: 'text',
                    name: '大区负责人姓名',
                    modelName: 'userName',
                },
            ],
        }
    },
    props: {},
    computed: {
        isEditStatus() {
            return Boolean(this.currentId);
        }
    },
    methods: {

        moreImgUpload(e) {
            console.log(e.imageObj);
        },

        handleClickBack() {
            this.$router.back()
        },

        handleClickAddBtn() {
            this.isVisibleEditDialog = true;
        },

        handleClickCarModelManagementBtn() {
            this.$router.push({
                name: 'serviceModel'
            })
        },

        handleClickImportBtn() {
            const ids = this.ids.join(',');
            if (!ids) {
                this.$message('请选择要导出的数据')
                return;
            }
            const form = {
                // 'searchValue.ids':  this.ids.join(','),
                // 'reportType': 'FAIL_BAG_SERVICE_ADMIN_JURISDICTION_INFO', //导出成绩单明细
            }
            this._exportReport(form)
        },

        handleClickRemoveBatchBtn() {
            const params = {
                'ids[]': this.ids.join()
            }
            channelApi.ajaxBatchDelete(params).then((data) => {
                if (data) {
                    this.searchDealerList();
                }
            })
        },

        handleClickRemoveBtn(ids) {
            channelApi.ajaxBatchDelete({
                'ids': ids
            }).then((data) => {
                if (data) {
                    this.searchDealerList();
                }
            })
        },

        handleClickEditBtn(item) {
            this.isVisibleEditDialog = true;
            this.currentDetail = item || {};
            console.log(this.currentDetail)
        },

        headerCellStyle() {
            return {
                background: '#f5f5f5'
            }
        },
        cellStyle() {
            return {
                padding: '6px 0'
            }
        },

        handleInputKeyword(keyword) {
            console.log(keyword)
        },

        handleCheckedProductsChange() {

        },

        handleClickExportBtn() {

        },

        searchDealerList() {
            const self = this;
            const params = {
                page: this.pageParams.page,
                pageSize: this.pageParams.pageSize,
                // keyWord: this.keyWord,
                'searchValue.erpNo': this.form.erpNo || '',
                'searchValue.userName': this.form.userName || '',
                'searchValue.dealerShortName': this.form.dealerShortName || '',
            }
            console.log(params)
            channelApi.ajaxSearch(params).then((data) => {
                if (data) {
                    this.pageParams.totalRows = data.totalRows;
                    this.pageParams.maxPage = data.maxPage;
                    const list = data.pageData || [];
                    this.tableData = list.map((item) => {
                        // console.log(item, '333')
                        return Object.assign({}, item, {
                            operationList: [{
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

                } else {
                    this.tableData = [];
                }

                this.page = data && data.currPage ? data.currPage : 1;
            })
        },

        getImage(path) {
            return path ? (_.fileDownURL + path) : null;
        },

        handleChangePage(page, pageSize) {
            this.searchDealerList()
        },

        handleSearch(data) {
            console.log(data,'xx')
            this.form = {
                erpNo: data,
                userName: '',
                dealerShortName: '',
            }
            this.tableData = [];
            this.pageParams.page = 1;
            this.searchDealerList();
        },

        //
        handleClickExportDialog() {
            this.isVisibleDialog = true;
        },

        handleAfterSubmit() {
            this.isVisibleEditDialog = false;
            this.searchDealerList();
        },

        handleCloseDialog() {
            this.searchDealerList()
        },

        handleConfirmImport() {
            console.log('xx')
        },

        handleCloseEditDialog() {
            this.currentDetail = {};
        },
        // 显示高级搜索弹框
        showAdvancedScreen() {
            this.isShowAdvancedScreen = !this.isShowAdvancedScreen;
        },
        // 实时处理输入的搜索条件
        searchInput(data) {

        },
        // 处理高级搜索的结果
        searchResult(data) {
            this.form = data;

            this.form = data;

            this.searchDealerList();
        },
        // 处理搜索结果
        search(value) {
            console.log('input', value)
            this.tableData.erpNo = value;
            this.searchDealerList();
        },
    },
    created() {
        this.searchDealerList()
    },

}
</script>

<style lang="scss" scoped>
.competing-management {
    position: relative;
    width: 969px;
    min-height: 800px;
    background: #fbfbfb;
    .goLink {
        color: #C31725;
    }

    .qwui-nav_wrap {
        padding-bottom: 20px;
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

    .competing {
     width: 969px;
      margin-top: 15px;
    }

    .table-header {
        background: #d5d5d5;
    }

    .dialog__content__search {
        border-bottom: 1px solid #cfcfcf;
        padding-bottom: 15px;
    }

    .competing {
        /deep/ {
            table {
                td {
                    padding: initial;
                }
            }
        }
    }

    .qwui-nav_wrap {
        padding-top: 14px;
        display: flex;
        justify-items: center;
        justify-content: space-between;
    }

    .wrap__right {
        display: flex;
        flex-shrink: 0;
        width: 250px;
        justify-content: space-between;

        /deep/ {

            .datepicker>input {
                margin-top: -3px;
                height: 32px;
            }

            .el-table th.is-leaf {
                background: #e7e8e9;
                color: #000;
            }

            .el-select {
                margin: 0 5px;
                width: 120px;

                .el-input.is-focus {
                    .el-input__inner {
                        border-color: #ccc;
                    }
                }

                .el-input__inner:focus {
                    border-color: #ccc;
                }

                .el-input__inner {
                    height: 32px;
                    line-height: 32px;
                }

                .el-input__icon {
                    line-height: 32px;
                }
            }

            .el-input {
                .el-input__inner {
                    line-height: 32px;
                    height: 32px;
                }

                .el-input__icon {
                    line-height: 32px;
                }

                &.is-active .el-input__inner,
                .el-input__inner:focus {
                    border-color: #ccc;
                }
            }

            .el-input--prefix .el-input__inner {
                padding-left: 39px;
            }

            .el-date-editor--month {
                .el-input__inner {
                    padding-left: 43px;
                }
            }

            .el-date-editor.el-input,
            .el-date-editor.el-input__inner {
                width: 130px;
            }

            .el-button {
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

                &:hover {
                    background: #F08088;
                    border-color: #F08088;
                }
            }

            .qwui-senior_search_btn {
                cursor: pointer;
                float: right;
                font-size: 12px;
                height: 35px;
                line-height: 16px;
                margin: 0 5px;
                padding: 0 3px;
                text-align: center;
                width: 30px;
                color: #f87b00;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }

    .dialog__content__search {
        padding: 20px;
        border-bottom: 1px solid #dcdfe6;
    }

    .dialog__content__options {
        height: 300px;
        overflow: auto;
    }

    .products {}

    .products__item {
        padding: 5px 12px 5px 20px;
        box-sizing: border-box;
        overflow: hidden;
        cursor: pointer;

        &.active {
            background-color: #eee;
        }

        label {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    .footer {
        text-align: center;
    }


  .qwui-senior_search_btn {
    cursor: pointer;
    float: right;
    font-size: 12px;
    height: 35px;
    line-height: 16px;
    margin: 0 5px;
    padding: 0 3px;
    text-align: center;
    width: 30px;
    color: #f87b00;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style><style>
.el-dialog__wrapper {
    z-index: 1000;
}
</style>
