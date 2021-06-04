<template>
<div class="qwui-list_wrap">
    <router-view class="qwui-task_wrap"></router-view>
    <div v-show="indexPageShow">
        <div class="qwui-top_main_bar">
            <div class="qwui-bar_left">
                <qwui-button @click="exportImportForm" v-perm="'taskexport'">导入</qwui-button>
                <span class="qwui-dotted_line" v-perm="'taskSet'"></span>
                <qwui-button @click="exportReportForm" v-perm="'taskexport'">导出</qwui-button>
                <span class="qwui-dotted_line" v-perm="'taskSet'"></span>
                <qwui-button type="primary" @click="addOrEditType('')" v-perm="'taskTemAdd'">新增</qwui-button>
                <span class="qwui-dotted_line" v-perm="'taskdel'"></span>
                <qwui-button @click="doDels(ids,true)" v-perm="'taskdel'">删除</qwui-button>
                <span class="qwui-dotted_line" v-perm="'taskSet'"></span>
                <qwui-button @click="checkExportImportForm" v-perm="'taskexport'">明检任务导入</qwui-button>
                <span class="qwui-dotted_line" v-perm="'taskSet'"></span>
                <qwui-button @click="checkExportReportForm" v-perm="'taskexport'">明检任务导出</qwui-button>
                <span class="qwui-dotted_line" v-perm="'taskSet'"></span>
                <qwui-button @click="toSettingPage" v-perm="'taskSet'">设置</qwui-button>
            </div>

            <div class="qwui-bar_right">
                <qwui-input inputType="search" @search='search' v-model="searchTitle" @input="searchInput" :inputTips="'搜索服务ERP号'"></qwui-input>
                <a class="qwui-senior_search_btn" @click="showAdvancedScreen">高级搜索</a>
            </div>
        </div>
        <advancedScreen v-show="isShowAdvancedScreen" :screenItemList="screenItemList" @searchResult="searchResult">
        </advancedScreen>
        <div class="qwui-table_wrap">
            <data-table :headData="headData" :dataList="dataList">
            </data-table>
            <page :pageData="pageData" @change="change"></page>
        </div>
    </div>

    <Upload :isImportPopShow="isImportPopShow" :reportType="reportType" @closeDialog="closeDialog"></Upload>
</div>
</template>

<script>
//  import qwTab from '@/components/Tab/QwTab';
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
import advancedScreen from '@/components/Screen/AdvancedScreen/AdvancedScreen';
import dataTable from '@/components/Table/dataTable.vue';
import page from '@/components/list/page.vue';
import Upload from '@/components/Add/Upload/Upload';

import exportReportForm from '@/assets/js/export/export.js';
import {
    getTaskTemplate,
    searchTaskData,
    delTask,
    closeTask
} from '../../api/taskAssignment/getData';
const taskPriority = ['普通', '不紧急但重要', '紧急但不重要', '紧急且重要'];
const searchObj = {
    searchUrl: '/contact/contactAction!ajaxSearchUserByPersonName.action',
    type: 'user',
    params: {
        keyWord: 1,
        pageSize: 10
    }
}

export default {
    name: 'taskAssignmentList',
    mixins: [exportReportForm],
    data() {
        return {
            reportType: "",
            isImportPopShow: false,
            searchTitle: '',
            isShowAdvancedScreen: false,
            ids: '',
            screenItemList: [{
                    type: 'select',
                    name: '任务状态',
                    dataList: [{
                            text: '全部',
                            value: ''
                        },
                        {
                            text: '草稿',
                            value: '0'
                        },
                        {
                            text: '进行中',
                            value: '1'
                        },
                        {
                            text: '待审批',
                            value: '2'
                        },
                        {
                            text: '已完成',
                            value: '3'
                        },
                        {
                            text: '已延时',
                            value: '4'
                        },
                        {
                            text: '已关闭',
                            value: '5'
                        },
                    ],
                    modelName: 'taskStatus',
                },
                {
                    type: 'time',
                    name: '下发时间',
                    modelName: 'taskStart',
                    timeHandler: (startTime, endTime) => {
                        this.exportStartTime = startTime;
                        this.exportEndTime = endTime;
                    }
                },
                {
                    type: 'time',
                    name: '完成时间',
                    modelName: 'completionTime',
                },
                {
                    type: 'text',
                    name: '任务类型',
                    modelName: 'taskType',
                },
                {
                    type: 'text',
                    name: '负责人',
                    modelName: 'chargeName',
                },
                {
                    type: 'text',
                    name: '分管领导',
                    modelName: 'leaderName',
                },
                {
                    type: 'text',
                    name: '区域',
                    modelName: 'erpSerNos',
                },
                {
                    type: 'text',
                    name: '服务站简称',
                    modelName: 'erpName',
                },
            ],
            headData: {
                left: {
                    id: 'taskId',
                    checkFunc: (isSelectedAll, list) => {
                        let arr = [];
                        list.forEach(function (item) {
                            if (item.isChecked) {
                                arr.push(item.id);
                            }
                        });
                        this.ids = arr.join(',');
                    }
                },
                middle: [{
                        title: '服务ERP号',
                        key: 'erpNo',
                        width: 100,
                    },
                    {
                        title: '服务站简称',
                        key: 'erpName',
                        width: 100,
                    },
                    {
                        title: '年度',
                        key: 'multiyearDesc',
                        width: 100,
                    },
                    {
                        title: '季度',
                        key: 'quarterlyDesc',
                        width: 100,
                    },
                    {
                        title: '任务类型',
                        key: 'taskType',
                        width: 100,
                    },
                    {
                        title: '任务名称',
                        key: 'title',
                        width: 100,
                    },
                    {
                        title: '子任务',
                        key: 'subtaskCount',
                        width: 100,
                    },
                    {
                        title: '状态',
                        key: 'taskStatusDesc',
                        width: 100,
                    },
                    {
                        title: '截止日期',
                        key: 'taskStop',
                        width: 100,
                    },
                    {
                        title: '实际完成日期',
                        key: 'completionTime',
                        width: 100,
                    },
                ],
                right: {
                    isShowOperate: true,
                    width: 80,
                }
            },
            exportStartTime: '',
            exportEndTime: '',
            dataList: [],
            pageSize: 10,
            pageData: {},
            page: 1,
            totalRows: 0,
            searchParams: {},
            searchData: [],
        }
    },
    components: {
        qwuiButton,
        qwuiInput,
        advancedScreen,
        dataTable,
        page,
        Upload,
    },
    mounted() {
        let self = this;
        // 获取所有任务类型
 
        // 初始化参数
        this.updateParams();
        // 获取任务列表数据
        this.searchTask();
    },
    watch: {
        '$route': function (val) {
            if (val.path == '/taskList')
                this.searchTask();
        }
    },
    methods: {
        closeDialog() {
            this.isImportPopShow = false;
        },
        // 查找任务
        searchTask() {
            let self = this;
            searchTaskData(this.searchParams, (data) => {
                this.pageData = {
                    page: data.currPage,
                    pageSize: this.pageSize,
                    maxPage: data.maxPage,
                    totalRows: data.totalRows
                };
                this.totalRows = data.totalRows;
                if (!data.pageData) {
                    this.dataList = [];
                    return;
                }
                data.pageData.forEach((item) => {
                    item.priority = taskPriority[item.priority]

                    var list = [];
                    var taskdetail = {
                        text: '查看详情',
                        perm: 'taskdetail',
                        operationFunc() {
                            self.doDetailList(item.taskId);
                        }
                    };
                    var doClose = {
                        text: '关闭',
                        perm: 'taskdel',
                        operationFunc() {
                            self.doClose(item.taskId);
                        }
                    };
                    var addOrEditType = {
                        text: '编辑',
                        perm: 'taskdetail',
                        operationFunc() {
                            self.addOrEditType(item.taskId);
                        }
                    };
                    var doDels = {
                        text: '删除',
                        perm: 'taskdel',
                        operationFunc() {
                            self.doDels(item.taskId);
                        }
                    };

                    if (item.taskStatus != '0') {
                        list.push(taskdetail);
                        if (item.taskStatus != '2') {
                            list.push(doClose);
                        }
                    } else {
                        list.push(taskdetail);
                        if (item.taskStatus != '2') {
                            list.push(doClose);
                        }
                        list.push(addOrEditType);
                        list.push(doDels);
                    }
                    item.operationList = list;
                    item.taskStop = item.taskStop ? item.taskStop.substring(0, 10) : '';

                });
                this.dataList = data.pageData;
                if (data[1001] === "子账号") {
                    let index = -1;
                    index = this.screenItemList.findIndex((item) => {
                        return item.name === '负责人';
                    })
                    if (index !== -1) {
                        this.screenItemList.splice(index, 1);
                    }
                }

            })
        },
        // 处理查找任务的条件参数
        updateParams() {
            this.searchParams = {
                'searchValue.title': this.searchData.title || '',
                'searchValue.taskStatus': this.searchData.taskStatus || '',
                'searchValue.taskType': this.searchData.taskType || '',
                'searchValue.taskStartStartTimes': this.searchData.taskStart ? this.searchData.taskStart[0] : '',
                'searchValue.taskStartEndTime': this.searchData.taskStart ? this.searchData.taskStart[1] : '',
                'searchValue.completionStartTimes': this.searchData.completionTime ? this.searchData.completionTime[0] : '',
                'searchValue.completionEndTime': this.searchData.completionTime ? this.searchData.completionTime[1] : '',
                'page': this.page || 1,
                'pageSize': this.pageSize || 10,
                'belongAgent': 'task',
                'searchValue.chargeName': this.searchData.chargeName || '',
                'searchValue.leaderName': this.searchData.leaderName || '',
                'searchValue.erpSerNos': this.searchData.erpSerNos || '',
                'searchValue.erpName': this.searchData.erpName || '',
            }
        },
        //导入
        exportImportForm() {
            this.reportType = "TASK"
            this.isImportPopShow = true;
        },
        // 导出
        exportReportForm() {
            let startTime = this.exportStartTime;
            let endTime = this.exportEndTime;
            if (this.totalRows > 0) {
                this.updateParams();
                this.searchParams['reportType'] = 'task';
                this._createReport(this.searchParams);
            } else {
                dataBase.top_alert('搜索结果为空，不支持导出', false, 3000);
            }
        },
        // 明检任务导出
        checkExportReportForm() {
            let startTime = this.exportStartTime;
            let endTime = this.exportEndTime;
            if (this.totalRows > 0) {
                this.updateParams();
                this.searchParams['reportType'] = 'checkTask';
                this._createReport(this.searchParams);
            } else {
                dataBase.top_alert('搜索结果为空，不支持导出', false, 3000);
            }
        },
        //明检任务导入
        checkExportImportForm() {
            this.reportType = "CHECK_TASK"
            this.isImportPopShow = true;
        },
        // 跳转至设置页面
        toSettingPage() {
            this.$router.push({
                name: 'taskSetting'
            })
        },
        // 显示高级搜索弹框
        showAdvancedScreen() {
            this.isShowAdvancedScreen = !this.isShowAdvancedScreen;
        },
        // 处理搜索结果
        search(value) {
            this.searchData.title = value;
            this.updateParams();
            this.searchTask();
        },
        // 实时处理输入的搜索条件
        searchInput(data) {
            console.log(data);
        },
        // 处理高级搜索的结果
        searchResult(data) {
            this.searchData = data;
            this.page = 1;
            this.updateParams();
            this.searchTask();
        },
        // 修改页数
        change(page, pageSize) {
            this.pageSize = pageSize;
            this.page = page;
            this.updateParams();
            this.searchTask();
        },
        // 查看任务详情
        doDetailList(id) {
            let top = (window.screen.height - 630) / 2;
            let left = (window.screen.width - 520) / 2;
            window.open(_.baseURL + '/manager/task/detail.jsp?id=' + id, 'newwindow', 'height=580,width=350,left=' + left + ',top=' + top + ',toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no')
        },
        //新增页面
        addOrEditType(id) {
            this.$router.push({
                name: 'taskAddOrEdit',
                query: {
                    id: id
                }
            })
        },
        doClose(taskId) {
            closeTask({
                taskId: taskId
            }, () => {
                dataBase.top_alert('关闭成功', true, 3000);
                this.searchTask();
            })
        },
        // 删除任务
        doDels(id, status) {
            let self = this;
            if (status && id == '') {
                _.alert('提示', '请选择要删除的数据');
                return;
            }
            _.alert('提示', '删除数据后将无法恢复，确认要删除吗？', function () {
                delTask({
                    ids: id
                }, () => {
                    dataBase.top_alert('删除成功', true, 3000);
                    self.ids = '';
                    self.searchTask();
                })
            }, '确定', true);
        }
    },
    computed: {
        indexPageShow() {
            return this.$route.name == 'taskList';
        }
    }
}
</script>

<style lang="scss" scoped>
.qwui-task_wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: #fbfbfb;
}

@mixin pt15 {
    padding-top: 15px;
}

@mixin pt20 {
    padding-top: 20px;
}

.qwui-dotted_line {
    border-right: 1px dashed #cfcfcf;
    margin: 0 8px 0 5px;
}

.qwui-list_wrap {
    position: relative;
    /*@include pt15;*/
    height: 100%;
    box-sizing: border-box;

    .qwui-top_main_bar {
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;
        @include pt20;

        .qwui-bar_left {
            flex: 1;
        }

        .qwui-bar_right {
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

    .qwui-table_wrap {
        @include pt15;
    }
}
</style>
