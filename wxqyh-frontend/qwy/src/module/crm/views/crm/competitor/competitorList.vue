<template>
    <div class="mt20">
        <!-- 顶部搜索 -->
        <div class="top_bar">
            <!-- 顶部 左边 快捷按钮 -->
            
            <div class="lef_bar">
              <!-- <qw-button type="primary" @click="addCompetitor" class="top-tool--add" v-if="!isShowTransAndDelete" >新增</qw-button>
                <qw-button @click="exportCompetitor"  v-if="!isShowTransAndDelete">导入</qw-button>
                <qw-button @click="exportCompetitor"  v-if="!isShowTransAndDelete">导出</qw-button> -->
              <template v-if="!isShowTransAndDelete">
                <qw-button type="primary" @click="addCompetitor">新增</qw-button>
                <qw-button @click="showImport=true">导入</qw-button>
                <qw-button @click="exportCompetitor">导出</qw-button>
              </template>
                <qw-button type="primary" @click="transferCompetitor" v-if="isShowTransAndDelete" >转移</qw-button>
                <qw-button @click="editCompetitor" v-if="isShowEditButton" >编辑</qw-button>
                <qw-button  @click="deleteCompetitor" v-if="isShowTransAndDelete" >删除</qw-button>
            </div>
             <!-- 顶部 右边 快捷搜索 -->
            <div class="right_bar">
                <qw-input inputType ="search" :maxLength ="200" v-model="quickSearch" inputTips="企业名称" @search="searchData" ></qw-input>
                <a href="javascript:void(0)" class="qw-table-tool-filter-btn" :class="{ active: isShowFilter }" @click="toggleFilter">高级</a>
            </div>
        </div>
        <!-- 高级搜索 -->
        <div class="top-search-tool">
            <transition name="slide-fade">
                <div class="qw-table-filter-wrap" v-show="isShowFilter">
                    <ul class="search_items">
                        <li class="qw-form-item">
                            <h1>
                                企业名称
                            </h1>
                            <qw-input class="search-input-width-284" inputType="base"  v-model="searchForm.competitorName" inputTips="请输入" ></qw-input>
                        </li>
                        <li class="qw-form-item">
                            <h1>
                                规模
                            </h1>
                            <qw-select class="search-input-width-284 select-box" @selectItem="selectItem" :dataList="scaleData" inputTips="请选择" ref="scale" ></qw-select>
                        </li>
                        <li class="qw-form-item">
                            <h1>
                                竞争商机标题
                            </h1>
                            <qw-input class="search-input-width-284" inputType="base"  v-model="searchForm.businessTitle" inputTips="请输入" ></qw-input>
                        </li>
                    </ul>
                    <ul class="search_items">
                        <li class="qw-form-item">
                            <div class="date-block">
                                <h1>
                                    创建时间
                                </h1>
                                <date-picker class="date-picker-width" v-model="rangeTime" rangeSeparator="至" :showButtons ="true" @confirm="dateConfirm" ref="searchDate" ></date-picker>
                            </div>
                        </li>
                        <li class="qw-form-item">
                            <h1>
                                创建人
                            </h1>
                            <pick-exam  class="competitorPickPerson"
                                        :useTab="functionTab"
                                        :useDepts ="defaultDeptVOList_creator"
                                        :useUsers ="defaultUserVOList_creator"
                                        @chooseDone ="chooseDone_creator"
                                        :isShowRadios ="false"
                                        ref="createPersonsPick">
                            </pick-exam>
                        </li>
                        <li class="qw-form-item">
                            <h1>
                                负责人
                            </h1>
                            <pick-exam  class="competitorPickPerson"
                                        :useTab="functionTab"
                                        :useDepts ="defaultDeptVOList_correlation"
                                        :useUsers ="defaultUserVOList_correlation"
                                        @chooseDone ="chooseDone_correlation"
                                        :isShowRadios ="false"
                                        ref="toPersonsPick">
                            </pick-exam>
                        </li>
                    </ul>
                    <div class="bottom-tool">
                        <qw-button @click="clearCompetitorSearch" size="small" >清空</qw-button>
                        <qw-button type="primary" @click="getList" size="small" >查询</qw-button>
                    </div>
                </div>
            </transition>
        </div>
        <!-- 列表 -->
        <div class="mt20">
            <data-table :headData="headData" :dataList="dataList"></data-table>
            <page :pageData="pageSetting" @change="pageChage"></page>
        </div>
        <!-- 新增 -->
        <competitor-add @refresh="getList" ref="addDialog"></competitor-add>
        <!-- 编辑 -->
        <competitor-edit @refreshInfo="getList" :editData.sync="detailData" ref="editDialog" ></competitor-edit>
        <!-- 详情 -->
        <competitor-detail @refreshInfo="getList" ref="competitorDetail" ></competitor-detail>
        <!-- 转移 -->
        <competitor-transfer :competitorIds ="ids" @refresh="getList" ref="competitorTransfer" ></competitor-transfer>
        <!-- 导入 -->
        <competitor-import v-model="showImport" @import-finish="getList"></competitor-import>
    </div>
</template>

<script>
import dataTable from '@/components/list/dataTable';
import page from '@/components/list/page';
import competitorAdd from './competitorAdd';
import CompetitorImport from './competitorImport';
import qwInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
import qwButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import qwSelect from '@/components/qwuiBase/qwuiSelect/qwuiSelect';
import datePicker from '@/components/base/VueDatepickerLocal';
import competitorDetail from './competitorDetail'
import competitorTransfer from './competitorTransfer'
import PickExam from "@/components/pickPerson/pickExam"
import { getCompetitorList, detailCompetitor, deleteCompetitor ,checkReport,createReportTask} from "@/module/crm/api/competitor";
export default {
    components: {
        dataTable,
        page,
        competitorAdd,
        qwInput,
        qwButton,
        datePicker,
        qwSelect,
        competitorDetail,
        competitorTransfer,
        PickExam,
        'competitorEdit': competitorAdd,
        CompetitorImport
    },
    data(){
        return {
            dataBase,
            isShowFilter: false, // 高级 按钮点击样式
            isShowEditButton: false, // 是否显示 编辑
            isShowTransAndDelete: false, // 是否显示 转移 删除
            quickSearch: "", // 快速搜索，企业名称
            pageSetting: { // 分页器相关配置
                maxPage: "",
                totalRows: "",
                page: "",
                pageSize: 10
            },  // 页码设置
            rangeTime: [], // 时间选择器值
            searchForm: { // 搜索框 表单
                competitorName: "", // 企业名称
                scale: "", // 规模
                businessTitle: "", // 商机标题
                createPerson: "", // 创建人
                toPerson: "", // 负责人
                toPersonDept: "", // 负责部门
                createPersonDept: "", // 创建人 部门
                startCreateTime: "", // 开始时间
                endCreateTime: "" // 结束时间
            },
            // 规模 下拉框数据
            scaleData: [
                {
                    val: '0',
                    optionName: '请选择'
                },
                {
                    val: '1',
                    optionName: '0~20人'
                },
                {
                    val: '2',
                    optionName: '20~50人'
                },
                {
                    val: '3',
                    optionName: '50~100人'
                },
                {
                    val: '4',
                    optionName: '100~200人'
                },
                {
                    val: '5',
                    optionName: '200~500人'
                },
                {
                    val: '6',
                    optionName: '500~1000人'
                },
                {
                    val: '7',
                    optionName: '1000以上人'
                },
            ],
            headData: {   //  页表数据头
                left: {
                    checkFunc:(checkAll,checkList) => {                        
                        let arr = [];
                        let checkNum = 0;                        
                        checkList.map(item => {
                            item.isChecked? arr.push(item.id) : checkNum++;

                        });                      
                        this.isShowTransAndDelete = checkNum == checkList.length?  false : true;
                        this.isShowEditButton = arr.length == 1 ? true : false;  
                        this.ids = arr.join(',');                        
                    }
                },
                middle: [
                    {
                        title: "企业名称",
                        key: "competitorName",
                        width: 270,
                        skip: {
                            skipFunc:(id) => {
                                // 打开详情
                                this.$refs.competitorDetail.showDetail(id);
                            }
                        }
                    },
                    {
                        title: "规模",
                        key: "scale",
                        width: 160,
                    },
                    {
                        title: "创建人",
                        key: "personName",
                        width: 153
                    },
                    {
                        title: "竞争商机数",
                        key: "businessCount",
                        width: 149
                    },
                    {
                        title: "创建时间",
                        key: "createTime",
                        width: 158
                    },
                ],
                right: {
                    isShowOperate: false
                }
            },
            // 表格数据
            dataList:[],
            // 选人组件 标签
            functionTab:[
                {text:'部门'},
                {text:'标签人员'},
                {text:'特定人员'},
            ],
            //  ...Dept 选人组件 默认部门
            //  ...User 选人组件 默认用户
            defaultDeptVOList_creator: [],
            defaultUserVOList_creator: [],
            deptList_creator: [],
            userList_creator: [],
            defaultDeptVOList_correlation: [],
            defaultUserVOList_correlation: [],
            deptList_correlation: [],
            userList_correlation: [],
            ids: "", // 勾选中的id
            detailData: {},
            exportParams:{},
            showImport:false//显示导入弹窗
        }
    },
    methods: {
        // 获取列表数据 包括 高级搜素中的关键词
        getList(){
            let { alert:_alert } = this.dataBase;
            let obj = {
                "searchValue.competitorName": this.searchForm.competitorName,
                "searchValue.scale": this.searchForm.scale,
                "searchValue.businessTitle": this.searchForm.businessTitle,
                "searchValue.createPerson": this.searchForm.createPerson,
                "searchValue.toPerson": this.searchForm.toPerson,
                "searchValue.toPersonDept": this.searchForm.toPersonDept,
                "searchValue.createPersonDept": this.searchForm.createPersonDept,
                "searchValue.startCreateTime": this.searchForm.startCreateTime,
                "searchValue.endCreateTime": this.searchForm.endCreateTime,
                "page": this.pageSetting.page,
                "pageSize": this.pageSetting.pageSize
            }
            getCompetitorList(obj)
            .then(res => {
                if(res.code == '0'){
                    this.dataList = res.data.pageData ? this.filterListData(res.data.pageData) : [];
                    this.pageSetting.totalRows = res.data.totalRows;
                    this.pageSetting.maxPage =  res.data.maxPage;
                    this.pageSetting.page = res.data.currPage;
                    this.isShowTransAndDelete = false; // 隐藏 删除 转移按钮
                    this.isShowEditButton = false; // 隐藏 编辑 按钮

                    //导出请求的参数
                    this.exportParams = Object.assign(obj,{
                       reportType:"crm_competitor",
                      "searchValue.startCreateTime": 
                         this.searchForm.startCreateTime&&this.searchForm.startCreateTime+' 00:00:00',
                      "searchValue.endCreateTime": 
                          this.searchForm.endCreateTime&&this.searchForm.endCreateTime+' 23:59:59'
                    });
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {                
                _alert('提示','网络错误');
            });
        },
        // 搜索框回调函数 获取表格数据 只根据企业名称进行搜索
        searchData() {
            let { alert:_alert } = this.dataBase;
            getCompetitorList({ "searchValue.competitorName": this.quickSearch })
            .then(res => {
                if(res.code == '0'){
                    this.dataList = res.data.pageData ? this.filterListData(res.data.pageData) : [];
                    this.pageSetting.totalRows = res.data.totalRows;
                    this.pageSetting.maxPage =  res.data.maxPage;
                    this.pageSetting.page = res.data.currPage;
                    this.isShowTransAndDelete = false; // 隐藏 删除 转移按钮
                    this.isShowEditButton = false; // 隐藏 编辑 按钮
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {                
                _alert('提示','网络错误');
            });
        },
        // 打开新增
        addCompetitor(){
            this.$refs.addDialog.openDialog();
        },     
        // 打开 转移竞争对手
        transferCompetitor(){
            this.$refs.competitorTransfer.openDialog();
        },
        // 删除
        deleteCompetitor(){
            let { alert:_alert, top_alert } = this.dataBase;
            if(!this.ids){
                _alert('提示','请选择要删除的数据');
                return;
            }
            else{
                _alert('提示','确认删除该竞争对手?',
                () => {
                    deleteCompetitor({ competitorIds: this.ids })
                    .then(res => {
                        if(res.code == '0'){
                            top_alert('删除成功',true,1000);
                            this.getList();
                        }
                        else{
                        _alert('提示',res.desc);
                        }
                    })
                    .catch(err => {
                        _alert('提示','网络错误');
                    });
                    },'确定',true
                );
            }
        },
        selectItem(optionName, val){
          this.searchForm.scale = val;
        },
        toggleFilter(){
            this.isShowFilter = !this.isShowFilter;
        },
        // 页码组件回调函数
        pageChage(page,pageSize){
            this.pageSetting.pageSize = pageSize;
            this.pageSetting.page = page;
            this.getList();
        },
        // 搜索框输入内容改变回调函数
        inputChange(title){
            this.searchTitle = title;
        },
        // 创建人 选人组件回调
        chooseDone_creator(dept, tag, user){
            let userResult = []
            let deptResult = []
            user.map(item => {
                userResult.push(item.userId)
            })
            dept.map(item => {
                deptResult.push(item.nodeId)
            })
            this.searchForm.createPerson  = userResult.join(",");
            this.searchForm.createPersonDept  = deptResult.join(",");
        },
        // 相关人 选人组件回调
        chooseDone_correlation(dept, tag, user){
            let userResult = []
            let deptResult = []
            user.map(item => {
                userResult.push(item.userId)
            })
            dept.map(item => {
                deptResult.push(item.nodeId)
            })
            this.searchForm.toPerson  = userResult.join(",");
            this.searchForm.toPersonDept = deptResult.join(",");
        },
        // 清空 高级搜索
        clearCompetitorSearch(){
            this.$refs.createPersonsPick.clearUsers();
            this.$refs.createPersonsPick.clearDepts();
            this.$refs.toPersonsPick.clearUsers();
            this.$refs.toPersonsPick.clearDepts();
            this.rangeTime = [];
            this.$refs.scale.setValue("");
            this.searchForm = {
                competitorName: "",
                scale: "",
                businessTitle: "",
                createPerson: "",
                toPerson: "",
                toPersonDept: "",
                createPersonDept: "",
                startCreateTime: "",
                endCreateTime: ""
            };
        },
        // 改变列表数据部分字段
        filterListData(data){
            data.map(item => {
                let result = "-";
                switch( item.scale ){
                    case "0":
                        break;
                    case "1":
                        result = "0~20人";
                        break;
                    case "2":
                        result = "20~50人";
                        break;
                    case "3":
                        result = "50~100人";
                        break;
                    case "4":
                        result = "100~200人";
                        break;
                    case "5":
                        result = "200~500人";
                        break;
                    case "6":
                        result = "500~1000人";
                        break;
                    case "7":
                        result = "1000以上人";
                        break;
                }
                item.scale = result;
                item.personName = item.personName    || "-";
                item.businessCount = item.businessCount    || "-";
                item.createTime = item.createTime || "-";
            })
            return data
        },
        // 日期组件 确定 按钮回调函数
        dateConfirm(val){
            this.$refs.searchDate.ok()
        },
        // 编辑
        editCompetitor(){
            this.detailData = {};
            detailCompetitor({ competitorId: this.ids })
            .then(res => {                
                if(res.code == '0'){
                    this.detailData = res.data.competitorDetail;                                     
                    let _this = this;
                    setTimeout(()=>{
                        _this.$refs.editDialog.openDialog();
                    },300)
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {                
                _alert('提示','网络错误');
            });
        },
        //导出
        exportCompetitor(){
            let { alert:_alert } = this.dataBase;
            if(!this.exportParams["searchValue.startCreateTime"]||!this.exportParams["searchValue.endCreateTime"]){
              _alert('导出提示',"请在【高级搜索】设置导出数据的创建时间段")
              return
            }
            if(this.dataList.length==0){
              _alert('导出提示',"搜索结果为空，不支持导出")
              return
            }
            checkReport(this.exportParams)
            .then(res => {
                if(res.code == '0'){
                   if(res.data.fileName){
                     _alert('提示',`已有相同查询条件的报表：【${res.data.fileName}】，是否重新导出？`,()=>{
                       this.exportCompetitorConfirm(this.exportParams)
                     },"确定",true)
                   }else{
                     this.exportCompetitorConfirm(this.exportParams)
                   }
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {                
                _alert('提示','网络错误');
            });
        },
        exportCompetitorConfirm(obj){
           let { alert:_alert } = this.dataBase;
            createReportTask(obj)
            .then(res => {
                if(res.code == '0'){
                    _alert('提示',
                    `操作成功，请稍后到 
                    <a style="color: #f87b00;" href="/wxqyh/manager/report/reportTask_main.jsp">导出报表管理(点击跳转)</a> 
                    处下载对应的导出文件：${res.data.fileName}`);
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {                
                _alert('提示','网络错误');
            });
        }
    },
    watch: {
        // 日期组件值变化时 将其拆分出 开始日期 和 结束日期 并赋值到高级搜索中的对应字段
        rangeTime(newVal,oldVal){
            if( newVal.length != 0 ){
                let StartDate = new Date(newVal[0]);
                this.searchForm.startCreateTime = StartDate.getFullYear() + '-' + (StartDate.getMonth() + 1) + '-' + StartDate.getDate();
                let endDate = new Date(newVal[1]);
                this.searchForm.endCreateTime = endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate();
            }
        }
    },
    created(){
        this.getList()
    }
}
</script>

<style scoped>
.wrap{
    width: 943px;
}
.mt20 {
  margin-top: 20px;
}
.mr10 {
  margin-right: 10px;
}
.top_bar {
  display: flex;
  justify-content: space-between;
}
.borderLine {
  margin: 0 8px 0 5px;
  border-right: 1px dashed #cfcfcf;
}
.right_bar {
  display: flex;
}
.top-tool--add{
    margin-right: 6px;
}
.search_items:first-child{
    margin-bottom: 14px;
}
.search-input-width-284{
    width: 284px;
}
.date-block{
    width: 284px;
}
.date-picker-width{
    min-width: 284px;
}
.date-range{
    display:inline-block;
    margin:0 2px;
}
.select-box.box_wrap.search-input-width-284{
    margin-top: 0;
}
.select-box.box_wrap >>> .qwui-select_wrap.round{
    width: 100%;
    background-color: #fff;
}
.select-box.box_wrap >>> input.text_wrap{
    background-color: #fff;
}
.date-picker-width >>> input{
    border: 1px solid #ccc;
    height: 32px;
}
.competitorPickPerson >>> .qwui-click_choose{
    box-sizing: border-box;
    max-width: 720px;
    max-height: 88px;
    min-width: 284px;
    min-height: 32px;
    width: auto;
    height: auto;
    padding-top: 2px;
    padding-bottom: 0;
}
.competitorPickPerson >>> span.qwui-click_choose_word{
    line-height: 28px;
}
.competitorPickPerson >>> .qwui-dept_selected{
    margin: 0px 5px 2px 0;
}
</style>
<style lang="scss">
.top_bar{
  .lef_bar{
    .qwui-button{
      margin-right: 6px;
    }
    .qwui-button-default{
      color: #808080;
    }
  }
}
</style>
