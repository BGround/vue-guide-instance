<template>
  <div id="searchSenior">
    <div class="search-wrap" @keyup.enter="searchForm">
      <ul class="search-items clearfix">
        <li>
            <div class="search-title">表单名称</div>
            <input type="text" class="search-input" v-model="value.title">
        </li>
        <li>
            <div class="search-title">表单创建人</div>
            <input type="text" class="search-input" v-model="value.personName">
        </li>
        <li>
            <div class="search-title">表单状态</div>
            <select class="search-select" v-model="value.formStatus">
              <option value="">全部</option>
              <option v-for="item in formStatus"
                :key="item.value"
                :value="item.value">{{item.text}}</option>
            </select>
        </li>
        <li>
            <div class="search-title">分组</div>
            <treeSelector class="group-list" :currSelected="currSelected" @setCurrGroup="setCurrGroup"></treeSelector>
        </li>
        <li>
            <div class="search-title">类型</div>
            <select class="search-select" v-model="value.isTask">
              <option value="">全部</option>
              <option v-for="item in formType"
                :key="item.value"
                :value="item.value">{{item.text}}</option>
            </select>
        </li>
        <li>
            <div class="search-title">创建时间</div>
            <vue-datepicker-local v-model="value.searchTime" range-separator="至" clearable></vue-datepicker-local>
        </li>
        <li>
            <div class="search-title">表单归属</div>
            <select class="search-select" v-model="value.belong">
              <option value="">全部</option>
              <option v-for="item in formBelong"
                :key="item.value"
                :value="item.value">{{item.text}}</option>
            </select>
        </li>
        <li>
            <div class="search-title">提单时间</div>
            <vue-datepicker-local v-model="value.commitTime" range-separator="至" clearable popupClass="commit_date_class"></vue-datepicker-local>
        </li>
      </ul>
      <div class="search-footer">
          <input class="search-btn search-btn-default" type="button" value="导出" @click="exportReportForm">
          <input class="search-btn search-btn-default" type="button" value="清空" @click="resetForm">
          <input class="search-btn search-btn-confirm" type="button" value="查询" @click="searchForm">
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import VueDatepickerLocal from "vue-datepicker-local";
import treeSelector from './treeSelector'
import { searchGroup } from '@/module/approval/api/form/index'
import exportReportForm from '@/assets/js/export/export.js';
export default {
    mixins:[exportReportForm],
    name: "searchSenior",
    components: {
        VueDatepickerLocal,
        treeSelector
    },
    data() {
        return {
            formStatus: dataBase.FORMSTATUS,
            formType: dataBase.FORMTYPE,
            value: {
                title: '',
                personName: '',
                formStatus: '',
                isTask: '',
                searchTime: [],
                belong: '',
                commitTime: [], // 提单时间
            },
            currSelected: [{ name: '全部分组', id: '' }]
        };
    },
    computed: {
        ...mapGetters("form/index", [
            "currGroup",
            "searchValue",
            'isSearch',
            'setting',
            'viewMode'
        ]),
        formBelong() {
            if(dataBase.config.managerType == 0) {
                let belong = JSON.parse(JSON.stringify(dataBase.FORMBELONG));
                belong.pop();
                return belong;
            } else {
                return dataBase.FORMBELONG;
            }
        }
    },
    created() {
        this.initValue();
    },
    methods: {
        ...mapActions('form/index', [
            'GetFormData',
            'SetSearchValue',
            'SetSetting',
            'SetIsSearch',
            'SetCurrGroup',
            'SetShowResult'
        ]),
        initValue() { // 根据缓存，初始化搜索条件
            let value = this.searchValue;
            this.value.title = value['searchValue.title'] || "";
            this.value.personName = value['searchValue.personName'] || "";
            this.value.formStatus = value['searchValue.formStatus'] || "";
            this.value.isTask = value['searchValue.isTask'] || "";
            this.value.belong = value['searchValue.belong'] || '';
            if(value['searchValue.startTime']) {
                this.value.searchTime = [value['searchValue.startTime'], value['searchValue.endTime']];
            } else {
                this.value.searchTime = [];
            }
            // 提单时间
            if(value['searchValue.closeStartTime']) {
                this.value.commitTime = [value['searchValue.closeStartTime'], value['searchValue.closeEndTime']];
            } else {
                this.value.commitTime = [];
            }
            this.currSelected = this.currGroup;
        },
        isEmptySearchValue() {
            let isEmpty = false,
                searchValue = this.searchValue;
            if(JSON.stringify(searchValue) == '{}') {
                isEmpty = true
            } else {
                for(let key in searchValue) { // 判断搜索条件是否全部为空
                    isEmpty = this.isEmpty(searchValue[key]);
                    if(!isEmpty) {
                        break;
                    }
                }
            }
            return isEmpty;
        },
        searchForm() {
            // 高级查询
            let group = {},
                pageSize = this.setting.pageSize;
            if(this.currSelected.length != 1) {
                group = this.currSelected[this.currSelected.length - 1];
                searchGroup({id: group.id}).then(res => {
                    if(res.code != "0") {
                        return _top.alert("信息提示层", res.desc)
                    }
                    this.currSelected[this.currSelected.length - 1].data = res.data.formtypeList[0];
                    this.SetCurrGroup(this.currSelected);
                })
            }
            if(this.viewMode == 2) {
                pageSize = 40;
            }
            this.SetSearchValue({
                "searchValue.typeId": group.id || '',
                "searchValue.title": this.value.title,
                "searchValue.personName": this.value.personName,
                "searchValue.formStatus": this.value.formStatus,
                "searchValue.isTask": this.value.isTask,
                "searchValue.startTime": this.getDate(this.value.searchTime[0], ' 00:00:00'),
                "searchValue.endTime": this.getDate(this.value.searchTime[1], ' 23:59:59'),
                // 提单时间
                "searchValue.closeStartTime": this.getDate(this.value.commitTime[0], ' 00:00:00'),
                "searchValue.closeEndTime": this.getDate(this.value.commitTime[1], ' 23:59:59'),
                "searchValue.belong": this.value.belong
            });
            this.SetCurrGroup(this.currSelected);
            this.SetSetting({ page: 1, pageSize: pageSize });
            if(!this.isEmptySearchValue()) {
                this.SetShowResult(true)
                this.SetIsSearch(true);
                this.GetFormData({viewMode: 1});
            } else {
                this.GetFormData();
            }
        },
        getDate(date, str) {
            // 格式化高级查询日期
            if (date) {
                return new Date(date).Format("yyyy-MM-dd") + str;
            } else {
                return "";
            }
        },
        resetForm() { // 重置高级搜索条件
            this.value = {
                title: "",
                personName: "",
                formStatus: "",
                isTask: "",
                searchTime: [],
                // 提单时间
                commitTime: []
            }
            this.currSelected =  [{ name: '全部分组', id: '' }];
        },
        isEmpty(value) { // 判断是否是空数组、空对象、空字符串、undefined之一
            let isEmptyArray = (Array.isArray(value) && value.length === 0)
                || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0),
                isEmptyObject = JSON.stringify(value) == '{}';
            return value == undefined || value == "" || isEmptyArray || isEmptyObject;
        },
        setCurrGroup(level, parent, child) {// 改变当前分组
            var group = [],
                id = ''
            if(level >= 1) {
                group.push({ name: "全部分组", id: "" });
                if(level >= 2) {
                    group.push({ name: parent.typeName, id: parent.id, data: parent });
                    id = parent.id;
                    if(level >= 3) {
                        group.push({ name: child.typeName, id: child.id, data: child})
                        id = child.id;
                    }
                }
            }
            this.currSelected = group
        },
        // 导出
        exportReportForm(){
            if(this.setting.totalRows>0){
                let searchParams = this.searchValue
                searchParams['reportType'] = 'form_tp_info';
                this._createReport(searchParams);
            } else{
                dataBase.top_alert('搜索结果为空，不支持导出',false,3000);
            }
        },
    },
    watch: {
        'searchValue': {
            handler(val) {
                if(this.isEmptySearchValue()) {
                    this.SetShowResult(false)
                    this.SetIsSearch(false)
                }
                this.initValue();
            },
            deep: true
        }
    }
};
</script>

<style>
    .search-wrap {
        position: relative;
        margin-top: 10px;
        border: 1px #ccc solid;
        background-color: #fff;
    }
    .search-wrap::before{
        content: "";
        position: absolute;
        top: -43px;
        right: -1px;
        z-index: 1;
        width: 56px;
        height: 42px;
        background-color: #fff;
        border: 1px #ccc solid;
        border-bottom: 0;
    }
    .search-items > li {
        float: left;
        width: 210px;
        margin: 10px 0 0 20px;
    }
    .search-title {
        color: #666;
        font-size: 14px;
        line-height: 26px;
    }
    .search-input {
        padding: 0 7px;
        width: 100%;
        height: 26px;
        line-height: 26px;
        color: #333;
        border: 1px #ccc solid;
        box-sizing: border-box;
    }
    .search-wrap .datepicker>input{
        padding: 0 30px 0 10px;
        border: 1px #ccc solid;
        height: 26px;
    }
    .search-select {
        padding: 0 7px;
        width: 100%;
        height: 26px;
        line-height: 26px;
        color: #333;
        border: 1px #ccc solid;
        box-sizing: border-box;
        outline: none;
    }
    .search-footer {
        margin-top: 10px;
        padding: 5px 20px;
        text-align: right;
        background-color: #f5f5f5;
    }
    .search-btn {
        display: inline-block;
        padding: 0 16px;
        height: 26px;
        line-height: 26px;
        font-size: 14px;
        border-radius: 2px;
        box-sizing: border-box;
    }
    .search-btn-default {
        color: #333;
        border: 1px #ccc solid;
        margin-right: 16px;
        background-color: #fff;
    }
    .search-btn-default:hover {
        background-color: #f7f7f7;
    }
    .search-btn-confirm {
        color: #fff;
        border: 1px #f87b00 solid;
        background-color: #C31725;
    }
    .search-btn-confirm:hover {
        background-color: #F08088;
    }
    .datepicker-range {
        min-width: 210px !important;
    }
    .search-wrap .group-list {
        width: 100%;
        border: 1px solid #ccc;
        line-height: 26px;
        margin: 2px 0;
        box-sizing: border-box;
        padding-left: 10px;
    }
    .commit_date_class {
        left: -204px
    }
</style>

