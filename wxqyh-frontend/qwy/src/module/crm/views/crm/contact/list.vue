<template>
    <div class="contactWrap">
        <div class="title-bar">
            <div class="top-btn" v-if="!isChooseContact">
                <span v-perm="'contactSave'">
                    <qw-button type="primary" @click="addContact" class="top-tool-add">新建</qw-button>
                </span>
                <span v-perm="'contactsImport'">
                    <qw-button @click="showImport=true" class="ml6">导入</qw-button>
                </span>
                <span v-perm="'contactsExport'">
                    <qw-button @click="exportData" class="ml6">导出</qw-button>
                </span>
            </div>
            <transition name="fade">
                <div class="top-btn_check" v-if="isChooseContact">
                    <qw-button @click="cancelTransfer" class="top-tool-add">转移</qw-button>
                    <span v-perm="'contactsDel'"><qw-button @click="delContact(selectedIds)" class="ml6">删除</qw-button></span>
                    <span v-perm="'clientEdit'"><qw-button @click="synchronizePerson(selectedIds)" class="ml6">同步负责人和相关人</qw-button></span>
                    <span v-perm="'contactsExport'"><qw-button @click="exportSelected" class="ml6">导出</qw-button></span>
                </div>
            </transition>
            <div class="top-search">
                <!-- 顶部 右边 快捷搜索 -->
                <qw-input inputType="search" :maxLength="200" v-model="searchValue.title" inputTips="联系人名称" @search="searchData"></qw-input>
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
                        字母或者关键字
                    </h1>
                    <qw-input class="search-input-width-284" inputType="base" v-model="searchValue.title" inputTips="请输入" @search="searchList"></qw-input>
                </li>
              <li class="qw-form-item">
                <h1>
                  所属客户
                </h1>
                <qw-input class="search-input-width-284" inputType="base" v-model="searchValue.clientName" inputTips="请输入" @search="searchList"></qw-input>
              </li>
              <li class="qw-form-item">
                <h1>
                  手机
                </h1>
                <qw-input class="search-input-width-284" inputType="base" v-model="searchValue.mobile" inputTips="请输入" @search="searchList"></qw-input>
              </li>
            </ul>
            <ul class="search_items">
                <li class="qw-form-item">
                    <div class="date-block">
                    <h1>
                        创建时间
                    </h1>
                    <date-picker class="date-picker-width search-input-width-284" v-model="createTime" rangeSeparator="至" :showButtons="true"
                        @confirm="createDateConfirm" ref="searchCreateDate"></date-picker>
                    </div>
                </li>
                <li class="qw-form-item">
                    <h1>
                    创建人
                    </h1>
                    <pick-exam class="competitorPickPerson" :useTab="functionTab" :useDepts="defaultDeptVOList_creator" :maxUser=5
                    :useUsers="defaultUserVOList_creator" @chooseDone="chooseDone_creator" :isShowRadios="false" ref="createPersonsPick">
                    </pick-exam>
                </li>
                <li class="qw-form-item">
                    <h1>
                    负责人
                    </h1>
                    <pick-exam class="competitorPickPerson" :useTab="functionTab" :useDepts="defaultDeptVOList_charge" :maxUser=5
                    :useUsers="defaultUserVOList_charge" @chooseDone="chooseDone_charge" :isShowRadios="false" ref="chargePersonsPick">
                    </pick-exam>
                </li>
            </ul>
            <ul class="search_last_items">
              <li class="qw-form-item">
                <div class="date-block">
                  <h1>
                    更新时间
                  </h1>
                  <date-picker class="date-picker-width search-input-width-284" v-model="updateTime" rangeSeparator="至" :showButtons="true"
                    @confirm="updateDateConfirm" ref="searchUpdateDate"></date-picker>
                </div>
              </li>

                <li class="qw-form-item ml15">
                    <h1>
                    部门
                    </h1>
                    <pick-exam class="competitorPickPerson" :maxDept=1 :useTab="deptFunctionTab" :useDepts="defaultDeptVOList_dept"
                    :useUsers="defaultUserVOList_dept" @chooseDone="chooseDone_dept" :isShowRadios="false" ref="DeptPick">
                    </pick-exam>
              </li>
            </ul>
            <div class="bottom-tool">
              <qw-button @click="clearSearch" size="small">清空</qw-button>
              <qw-button type="primary" @click="searchList" size="small">查询</qw-button>
            </div>
          </div>
        </transition>
      </div>
      <!--选人组件-->
      <pick-person :show="isPickPerson" :defaultUsers="principalUsers" :defaultTags="principalTags" :functionTab="principalFunctionTab"
        @chooseDone="choosePrincipal" @closeThis="closeThis"></pick-person>

      <!-- 列表 -->
      <div class="tableBox mt10">
        <data-table :headData="headData" :dataList="dataList"></data-table>
        <page :pageData="pageSetting" @change="pageChage"></page>
      </div>

      <!-- 导入 -->
      <contact-import v-model="showImport" @import-finish="getList"></contact-import>

      <!-- 导出 -->
      <crm-export 
                v-model="showExport"  
                :exportOption='exportOption' 
                :exportCount="exportCount" 
                @on-confirm="onConfirm" 
                @change-date="changeDate"
                @delete-option="dealDeleteOption"
      ></crm-export>

      <!-- 详情 -->
      <crm-detail type="contact" :permissionEdit="'contactsEdit'" ref="contactDetail" :id="detailId" :operateConfig="operateConfig" @edit="openEdit" @moreOperate="moreOperateKey"></crm-detail>
        <!-- 转移弹窗 -->
        <div class="transferBox" v-if="isShowDialog">
            <!-- 转移客户对话框 -->
        <qw-Modal
        :show.sync="isShowDialog"
        :showCancelButton="true"
        :title="modalTitle"
        :zIndex="modalZindex"
        @on-confirm="transferContact"
        @on-cancel="cancelTransfer"
        >
        <div class="modalContent" v-if="modalTitle == '转移联系人'">
            <div class="flex">
            <span class="lineH mr20">新负责人：</span>
            <ul class = "trans_pickPerson" @click = "addPerson">
                <span v-show="defaultUsers.length == 0"><i>+</i>点击选择</span>
                <li v-for="(item,index) in defaultUsers" :key = "index">
                <div class="trans-user_selected">
                    <img  v-if="item.headPic && item.headPic!='0'" class="trans-dept_selected_icon" :src = "item.headPic">
                    <div v-else class="qwui-user_default_img"></div>
                    {{item.personName}}
                </div>
                </li>
            </ul>
            </div>
            <div class = "transfer_personCount">
            <span>已选{{defaultUsers.length}}成员</span>
            <span @click = "addPerson">修改</span>
            </div>
        </div>
        </qw-Modal>

            <pick-person
                        :show="pickPersonShow"
                        :defaultUsers="defaultUsers"
                        :functionTab="functionTab"
                        @chooseDone="newPersonChooseDone"
                        onlyUser
                        :maxUser=1
                        @closeThis="closeTransfer">
            </pick-person>
        </div>
    </div>
</template>
<script>
import qwModal from "crm/components/qwModal";
import qwButton from '@/components/qwuiBase/qwuiButton/qwuiButton'
import qwInput from '@/components/qwuiBase/qwuiInput/qwuiInput'
import PickExam from '@/components/pickPerson/pickExam'
import contactImport from './import'
import personCount from '@/components/pickPerson/qwuiPersonCount';
import datePicker from '@/components/base/VueDatepickerLocal'
import funcBox from "@/components/list/funcBox";
import dataTable from '@/components/list/dataTable'
import page from '@/components/list/page'
import pickPerson from '@/components/pickPerson/pickPerson'
import crmDetail from "@/module/crm/components/crm-detail/crmDetail"
import crmExport from "@/module/crm/components/crm-export/index"
import {
        getContactsList,
        changeContactsCharge,
        deleteContacts,
        synContactsStaff,
        checkReport,
        createReportTask,
        } from '@/module/crm/api/contact'
import { checkExport,exportReport } from '@/module/crm/utils/export'
const option = {
  title: '字母或者关键字',
  clientName: '所属客户',
  mobile: '手机',
  userName:'创建人',
  chargeName: '负责人',
  deptName:'部门',
  createTime: '创建时间',
  updateTime: '更新时间',
}

const MAX_EXPORT_COUNT = 100000   // 最大导出条数
export default {
    name: "contactList",
    components:{
        qwButton,
        qwInput,
        PickExam,
        datePicker,
        dataTable,
        page,
        pickPerson,
        contactImport,
        crmDetail,
        personCount,
        funcBox,
        crmExport,
        qwModal
    },
    data() {
        return {
            // isShowModal: false, //是否显示对话框
            modalTitle: "转移联系人", //对话框标题
            modalZindex: 10,//qwModal的层级
            exportSearchValue: '',
            exportCount: 0, // 勾选中的条数，导出
            exportOption: [
                {
                    title: '创建时间',
                    type: 'datePicker',
                    value: [

                    ]
                },

            ],
            selectedIds: '', // 勾选中的联系人id
            pickPersonShow:false,
            functionTab:[
                {text:'标签人员'},
                {text:'特定人员'},
                {text:'批量导入'},
            ],
            personCountShow:true,// 选人结果显示隐藏
            defaultUsers:[],
            showType:{
                person:true,
            },
            isShowDialog: false,
            dialogTitle: '转移联系人',
            operateConfig: [ // 详情更多操作
                 {
                    key: 'transfer',
                    name: '转移',
                },
                {
                    key: 'synchronize',
                    name: '同步',
                    permission: 'clientEdit'
                },
                {
                    key: 'delete',
                    name: '删除',
                    permission: 'contactsDel'
                }
            ],
            // isChooseContact: false, // 是否勾选联系人，按钮的显示隐藏
            detailId: '', //详情id
            showImport: false, //显示导入弹窗
            showExport: false, //显示导入弹窗
            createTime: [], // 创建时间
            updateTime: [], // 更新时间
            searchValue: { // 搜索框 表单
                title: '', // 联系人名称
                mobile: '', // 手机
                clientName: '', // 客户名称
                deptName: '', // 部门名称
                userId: '', // 创建人id
                chargeId: '', // 负责人id
                userName: '', // 创建人名字
                chargeName: '', // 负责人名字
                startTimes: '', // 开始时间
                endTime: '', // 结束时间
                startUpdateTime: '', // 更新开始时间
                endUpdateTime: '', // 更新结束时间
                page: 1, // 页码
                pageSize: 10 // 每页显示条数
            },
            title: '',
            isShowFilter: false, // 高级 按钮点击样式
            isPickPerson: false, //默认-默认公海池分配选人隐藏
            principalTags: [], // 标签
            principalUsers: [], // 成员
            // 选人tab
            principalFunctionTab: [{
                text: '标签人员'
            },
            {
                text: '特定人员'
            },
            ],
            // 选人组件 标签
            functionTab: [{
                text: '标签人员'
            },
            {
                text: '特定人员'
            }
            ],
            // 选人组件 部门
            deptFunctionTab: [{
                text: '部门'
            }
            ],
            //  ...Dept 选人组件 默认部门
            //  ...User 选人组件 默认用户
            defaultDeptVOList_charge: [],
            defaultUserVOList_charge: [],
            deptList_charge: [],
            userList_charge: [],
            deptList_correlation: [],
            userList_correlation: [],
            defaultDeptVOList_creator: [],
            defaultUserVOList_creator: [],
            deptList_creator: [],
            userList_creator: [],
            defaultUserVOList_dept: [],
            defaultDeptVOList_dept: [],
            // 表格数据
            dataList: [],
            // 分页器相关配置,页码设置
            pageSetting: {
                maxPage: '',
                totalRows: '',
                page: '1',
                pageSize: 10
            },
             headData: {
                //  页表数据头
                left: {
                    checkFunc: (checkAll, checkList) => {
                        let arr = []
                        let notCheckNum = 0
                        checkList.map(item => {
                            item.isChecked ? arr.push(item.id) : notCheckNum++
                        })
                        this.exportCount = arr.length;
                        // this.isChooseContact = (checkList.length - notCheckNum) ? true : false
                        this.selectedIds = arr.join(',')
                    }
                },
                middle: [{
                    title: '联系人名称',
                    key: 'contactsName',
                    width: 224,
                    skip: {
                        skipFunc: id => {
                        // 打开详情
                            this.detailId = id
                            this.$refs.contactDetail.showDetail()
                        }
                    }
                    },
                    {
                        title: '所属客户',
                        key: 'clientName',
                        width: 143
                    },
                    {
                        title: '手机',
                        key: 'mobile',
                        width: 145
                    },
                    {
                        title: '客户编码',
                        key: 'clientCode',
                        width: 145
                    },
                    {
                        title: '更新时间',
                        key: 'updateTime',
                        width: 144
                    },
                ],
                right: {
                    isShowOperate: false
                }
                },
        }
    },
    created(){
        this.handleTime()
        this.getList();
    },
    computed: {
        isChooseContact(){
            return this.selectedIds != ''
        }
    },
    watch: {
        // 日期组件值变化时 将其拆分出 开始日期 和 结束日期 并赋值到高级搜索中的对应字段
        createTime(newVal, oldVal) {
        if (newVal.length != 0) {
            let {
            startTime,
            endTime
            } = this.getStartEndTime(newVal, oldVal)

            this.searchValue.startTimes = `${startTime} 00:00:00`
            this.searchValue.endTime = `${endTime} 23:59:59`
        }
        },
        updateTime(newVal, oldVal) {
        if (newVal.length != 0) {
            let {
            startTime,
            endTime
            } = this.getStartEndTime(newVal, oldVal)

            this.searchValue.startUpdateTime = `${startTime} 00:00:00`
            this.searchValue.endUpdateTime = `${endTime} 23:59:59`
        }

        }
    },
    methods: {
        // 获取列表数据
        getList(){
            if(this.searchValue.startTimes != '' && this.searchValue.endTime != '')
            this.exportOption[0].value = [this.searchValue.startTimes,this.searchValue.endTime];
            let obj = {
                // 搜索框 表单
                'searchValue.title': this.searchValue.title, // 联系人名称
                'searchValue.mobile': this.searchValue.mobile, // 手机
                'searchValue.clientName': this.searchValue.clientName, // 客户名称
                'searchValue.deptName': this.searchValue.deptName, // 部门
                'searchValue.userId': this.searchValue.userId, // 创建人
                'searchValue.chargeId': this.searchValue.chargeId, // 负责人
                'searchValue.startTimes': this.searchValue.startTimes, // 开始时间
                'searchValue.endTime': this.searchValue.endTime, // 结束时间
                'searchValue.startUpdateTime': this.searchValue.startUpdateTime,
                'searchValue.endUpdateTime': this.searchValue.endUpdateTime,
                page: this.pageSetting.page,
                pageSize: this.pageSetting.pageSize
            }
            dataBase.loading = true;
            getContactsList(obj).then(res => {
                dataBase.loading = false;
                if(res.code == '0'){
                    // 手机为空的话，由-代替
                    if(res.data.pageData){
                        res.data.pageData.forEach((item) => {
                            if(item.mobile == ''){
                                this.$set(item,'mobile','-')
                            }
                        })
                    }
                    this.dataList = res.data.pageData ? res.data.pageData　: [];
                    this.pageSetting.totalRows = res.data.totalRows
                    this.pageSetting.maxPage = res.data.maxPage
                    this.pageSetting.page = res.data.currPage
                    this.selectedIds = ''
                }else{
                    _.alert('提示', res.desc)
                }
            })
        },

        // 新建联系人
        addContact() {
            this.$router.push(
                {path: 'add'}
            )
        },

        searchData() {
            this.getList();
        },
        //切换显示高级搜索
        toggleFilter() {
            this.isShowFilter = !this.isShowFilter
        },
        // 选人关闭按钮
        closeThis() {
            this.isPickPerson = false;
        },

        // 部门 选人组件回调
        chooseDone_dept(dept, tag, user) {
            let {
                userResult,
                deptResult
            } = this.chooseDone(dept, tag, user)
            this.searchValue.deptName = deptResult.join(',')
        },

        // 创建人 选人组件回调
        chooseDone_creator(dept, tag, user) {
            let {
            userResult,
            deptResult,
            userNameResult
            } = this.chooseDone(dept, tag, user)
            this.searchValue.userId = userResult.join(',')
            this.searchValue.userName = userNameResult.join()
        },

        // 负责人 选人组件回调
        chooseDone_charge(dept, tag, user) {
            let {
            userResult,
            deptResult,
            userNameResult
            } = this.chooseDone(dept, tag, user)
            this.searchValue.chargeId = userResult.join(',')
            this.searchValue.chargeName = userNameResult.join()
        },

        //高级搜索选人返回值
        chooseDone(dept, tag, user) {
            let userResult = []
            let deptResult = []
            let userNameResult = []
            user.map(item => {
                userResult.push(item.userId);
                userNameResult.push(item.personName);
            })
            dept.map(item => {
                deptResult.push(item.nodeName)
            })
            
            return {
                userResult,
                deptResult,
                userNameResult
            }
        },

        // 日期组件 确定 按钮回调函数
        createDateConfirm(val) {
            this.$refs.searchCreateDate.ok()
        },

        // 日期组件 确定 按钮回调函数
        updateDateConfirm(val) {
            this.$refs.searchUpdateDate.ok()
        },

        // 清空 高级搜索
        clearSearch() {
            this.$refs.DeptPick.clearDepts()
            this.$refs.createPersonsPick.clearUsers()
            this.$refs.chargePersonsPick.clearUsers()

            this.createTime = [];
            this.updateTime = [];
            this.searchValue = {};
            // 默认空数据
            this.searchValue = { // 搜索框 表单
                title: '', // 联系人名称
                mobile: '', // 手机
                clientName: '', // 客户名称
                deptName: '', // 部门名称
                userId: '', // 创建人id
                chargeId: '', // 负责人id
                userName: '', // 创建人id
                chargeName: '', // 负责人id
                startTimes: '', // 开始时间
                endTime: '', // 结束时间
                startUpdateTime: '', // 更新开始时间
                endUpdateTime: '', // 更新结束时间
                page: 1, // 页码
                pageSize: 10 // 每页显示条数
            }
        },

        choosePrincipal(){},

        // 页码组件回调函数
        pageChage(page, pageSize) {
            this.pageSetting.pageSize = pageSize
            this.pageSetting.page = page
            this.getList()
        },

        // 条件搜索
        searchList(event){
            this.getList();
        },

        //获取日期组件数据，开始和结束时间
        getStartEndTime(newVal, oldVal) {
            const StartDate = new Date(newVal[0])
            const startTime = `${StartDate.getFullYear()}-${StartDate.getMonth() +
            1}-${StartDate.getDate()}`
            const endDate = new Date(newVal[1])
            const endTime = `${endDate.getFullYear()}-${endDate.getMonth() +
            1}-${endDate.getDate()}`
            return {
            startTime,
            endTime
            }
        },

        //打开编辑页面
        openEdit(id) {
            document.body.style.overflow = 'visible';
            this.$router.push(
                {
                    path: 'add',
                    query: {
                        id: this.detailId
                    }}
            )
        },

        // 转移联系人
        transferContact() {
            if(this.defaultUsers.length>0){
                let obj = {
                    inCharges: this.defaultUsers[0].userId,
                    contactsIds: this.$refs.contactDetail.$refs.detailBlock.show ? this.detailId : this.selectedIds // 判断详情块是否显示
                }
                dataBase.loading = true;
                changeContactsCharge(obj).then(res => {
                    dataBase.loading = false;
                    if(res.code == '0'){
                        dataBase.top_alert('转移成功',true,2000);
                        this.getList();
                        this.$refs.contactDetail.$refs.detailBlock.close()
                    }else{
                        _.alert('提示', res.desc)
                    }
                })
                this.isShowDialog = !this.isShowDialog
            }else{
                _.alert('提示','负责人不能为空')
            }
        },

        // 关闭转移窗口
        cancelTransfer(){
            this.defaultUsers = [];
            this.isShowDialog = !this.isShowDialog
        },

        // 删除联系人
        delContact(id) {
            let self = this
            _.alert('提示','删除数据后将无法恢复，确认要删除吗？',function () {
                let obj = id ? {ids: id,belongAgent: 'crm'} : {ids: self.selectedIds, belongAgent: 'crm'}
                dataBase.loading = true;
                deleteContacts(obj).then(res => {
                    dataBase.loading = false;
                    if(res.code == '0'){
                        dataBase.top_alert('删除成功',true,2000);
                        self.getList();
                        self.$refs.contactDetail.$refs.detailBlock.close()
                    }else{
                        _.alert('提示', res.desc)
                    }
                })
            },'确定',true)
        },

        // 同步负责人和相关人
        synchronizePerson(id){
            let self = this
            _.alert('提示','将联系人的负责人、相关人同步为所属客户的负责人、相关人一致，同步后不可恢复，是否确认同步？',function () {
                let obj = id ? {contactsIds: id} : {contactsIds: self.selectedIds}
                dataBase.loading = true;
                synContactsStaff(obj).then(res => {
                    dataBase.loading = false;
                    if(res.code == '0'){
                        dataBase.top_alert('同步成功',true,2000);
                        self.getList();
                        self.$refs.contactDetail.$refs.detailBlock.close()
                    }else{
                        _.alert('提示', res.desc)
                    }
                })
            },'确定',true)
        },

        // 添加人员
        addPerson(status){
            this.pickPersonShow = true;
        },

        // 选人回调
        newPersonChooseDone(deptSelected,tagList,specialUsers){
            if(specialUsers.length > 10){
                dataBase.top_alert('人员选择超出上限(10)',false,3000);
                return
            }else{
                this.defaultUsers = specialUsers;
                this.pickPersonShow = false;
            }
        },

         // 选人关闭按钮回调
        closeTransfer(){
            this.pickPersonShow = false;
        },

        //详情里更多操作按钮回调
        moreOperateKey(key) {
            let fun = {
                'transfer': this.cancelTransfer,
                'synchronize': this.synchronizePerson,
                'delete': this.delContact,
            }
            fun[key]((this.detailId));
        },

        // 导出
        exportData(){
            this.exportOption = [];
            this.handleTime();
            this.exportDataShow();
            this.exportSearchValue = JSON.parse(JSON.stringify(this.searchValue));
            this.showExport = !this.showExport;
        },

        // 按导出显示出填写的数据
        exportDataShow() {
            let optionList = []
            let arr = ['title', 'clientName','mobile', 'userName','chargeName','deptName']; 
            arr.forEach((item) => {
                if(this.searchValue[item] != ''){
                    optionList.push({
                        title: option[item],
                        type: 'text',
                        value: this.searchValue[item],
                        key: item
                    })
                }
            })

            // 创建时间
            if(this.createTime.length > 0) {
                let data = {
                    title: '创建时间',
                    type: 'datePicker',
                    value: [this.searchValue['startTimes'], this.searchValue['endTime']]
                }
                optionList.unshift(data)
            }else{
                optionList.unshift(this.exportOption[0])
            }


             // 更新时间 
            if(this.updateTime.length > 0) {
                let data = {
                    title: '更新时间',
                    type: 'date',
                    value: [this.searchValue['startUpdateTime'].split(' ')[0], this.searchValue['endUpdateTime'].split(' ')[0]],
                    key: 'updateTime'
                }
                optionList.push(data)
            }
            if(optionList.length != 0){
                this.exportOption = [... optionList]
            }
        },

        exportSelected(){
            this.exportSearchValue = JSON.parse(JSON.stringify(this.searchValue));
            this.onConfirm();
        },

        // 时间处理
        handleTime() {
            if(this.createTime.length == '0'){
                let nowTime = (new Date()).Format("yyyy-M-d");
                let arr = nowTime.split('-');
                let startTime = arr.join('-')
                let lastTime = new Date((new Date()- 1000 * 60 * 60 * 24 * 30)).Format("yyyy-M-d");
                this.$set(this.exportOption,0,{
                    title: '创建时间',
                    type: 'datePicker',
                    value: [
                        lastTime,startTime
                    ]
                });
            }
        },

        // 时间确认
        changeDate(startTime,endTime){
            this.$set(this.exportOption[0],'value',[startTime,endTime]);
        },

        // 导出确认按钮
        onConfirm() {
            let self = this
            let obj = {
                'searchValue.title': this.showExport ? this.exportSearchValue.title : '', // 联系人名称
                'searchValue.mobile': this.showExport ? this.exportSearchValue.mobile : '', // 手机
                'searchValue.clientName': this.showExport ? this.exportSearchValue.clientName : '', // 客户名称
                'searchValue.deptName': this.showExport ? this.exportSearchValue.deptName : '', // 部门
                'searchValue.userId':this.showExport ?  this.exportSearchValue.userId : '', // 创建人
                'searchValue.chargeId': this.showExport ? this.exportSearchValue.chargeId : '', // 负责人
                'searchValue.startTimes': this.showExport ? this.exportOption[0].value[0] + ' 00:00:00' : '',
                'searchValue.endTime': this.showExport ? this.exportOption[0].value[1] + ' 23:59:59' : '',
                'searchValue.startUpdateTime': this.showExport ? this.exportSearchValue.startUpdateTime : '',
                'searchValue.endUpdateTime': this.showExport ? this.exportSearchValue.endUpdateTime : '',
                reportType: 'crm_contacts'
            }
            dataBase.loading = true;
            if(this.createTime.length != 0){
                obj['searchValue.startTimes'] = this.exportOption[0].value[0]
                obj['searchValue.endTime'] = this.exportOption[0].value[1]
            }
            if(this.selectedIds != ''){
                obj['searchValue.startTimes'] = ''
                obj['searchValue.endTime'] = ''
            }
            // 查看是否有导出数据
            getContactsList(obj).then(res => {
                dataBase.loading = false;
                if(res.code == '0'){
                    if(this.selectedIds != ''){
                        obj = Object.assign({'searchValue.id': this.selectedIds}, obj)
                    }
                    if(res.data.totalRows === 0){
                        _.alert('提示','搜索结果为空，不支持导出')
                        return;
                    }
                    if(res.data.totalRows > MAX_EXPORT_COUNT){
                        _.alert("提示", '数据量超出限制,建议这样做 1.缩短创建时间或增加筛选条件，以减少本次导出的数据量 2.分批导出，每次控制在10w条以内');
                        return;
                    }
                    // 导出请求
                    checkExport(checkReport,obj).then(res => {
                        if(res.code == '0'){
                            exportReport(createReportTask,obj)
                        }else{
                            _.alert('提示', res.desc)
                        }
                    })
                }else{
                    _.alert('提示', res.desc)
                }
            })

        },

        // 删除导出条件
        dealDeleteOption(delKey){
            this.exportOption.forEach((item,idx) => {
                if(item.key == delKey){
                    this.exportOption.splice(idx,1)
                    this.exportSearchValue[delKey] = ''
                    if(delKey == 'userName'){
                        this.exportSearchValue['userId'] = ''
                    }else if(delKey == 'chargeName'){
                        this.exportSearchValue['chargeId'] = ''
                    }else if(delKey == 'updateTime'){
                        this.exportSearchValue['startUpdateTime'] = ''
                        this.exportSearchValue['endUpdateTime'] = ''
                    }
                }
            })
        },


    }
};
</script>
<style lang="scss" scoped>
.contactWrap{
    .title-bar{
        margin-top: 25px;
        display: flex;
        justify-content: space-between;
        position: relative;
        height: 40px;
        .top-btn{
            /deep/ .qwui-button-default{
                color: #808080;
            }
        }
        .top-btn_check{
            position: absolute;
            left: 0;
            top: 0;
            /deep/ .qwui-button-default{
                color: #808080;
            }
        }
        .top-search{
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            .qw-table-tool-filter-btn{
                color: #666666;
                padding: 0 18px 0 10px;
                line-height: 30px;
                &::before{
                    top: 13px;
                    border-color: transparent transparent #B3B3B3;
                }
            }
        }
    }
    .ml6{
        margin-left: 6px;
    }
    .ml15{
        margin-left: 15px;
    }
    .qw-form-item{
        width: 284px;
    }
    .search_last_items{
        display: flex;
        padding: 0 28px;
    }
    .search_items{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 28px;
    }
    .search_items {
        margin-bottom: 14px;
    }
    .search-input-width-284 {
        width: 284px;
    }
    /deep/ .qw_baseInput{
        border:1px solid rgba(213,213,213,1);
    }
    .top-search-tool{
        /deep/ .datepicker>input{
            border: 1px solid #d5d5d5;
        }

        /deep/ .datepicker-range {
            min-width: 0;
        }
        /deep/ .bottom-tool .qwui-button-default{
            margin-right: 14px;
        }
    }
    .competitorPickPerson{
        /deep/ .qwui-click_choose {
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

        /deep/ .qwui-click_choose_word {
            line-height: 28px;
        }
        /deep/ .qwui-dept_selected {
            margin: 0 5px 2px 0;
        }
    }
    .tableBox{
        /deep/ .table_header{
            /deep/ td{
                text-align: left;
                padding-left: 12px;
            }
            /deep/ td:first-child{
                text-align: center;
                padding-left: 0;
            }

        }
    }
    .selectPerson{
        padding: 0 80px;
        margin: 20px 0 40px 0;
    }
    .transferBox{
        position: fixed;
        z-index: 100;
    }
    .qw-modal{
    .modal-body{
      .modalContent {
        min-width: 300px;
        margin: 20px 0 34px 0;
        padding: 0 76px;
      }
    }
  }
  .trans_pickPerson{
    width:340px;
    height:48px;
    border:1px dashed #D5D5D5;
    padding:4px 8px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    span{
      display: inline-block;
      width:100%;
      height:100%;
      font-size: 14px;
      color:#BABABA;
      line-height: 38px;
      text-align: center;
      cursor: pointer;
    }
    li{
      .trans-user_selected{
        border: 1px solid #ddd;
        list-style:none;
        width:auto;
        height:24px;
        padding-right:10px;
        line-height: 24px;
        vertical-align: top;
        border-radius:3px;
        display: flex;
        vertical-align: top;
        .trans-dept_selected_icon{
          display: inline-block;
          width: 26px;
          height: 24px;
          margin-right: 5px;
          list-style: none;
          vertical-align: top;
        }
      }
    }
  }
  .lineH {
    line-height: 40px;
  }
  .transfer_personCount{
    width:100%;
    text-align: left;
    margin-top:5px;
    padding-left:88px;
    box-sizing: border-box;
    font-size: 12px;
    span:first-of-type{
      color:#B6B6B6;
    }
    span:last-of-type{
      color:#74ACFF;
      cursor: pointer;
    }
    
  }
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.right_side{
    background: #fff !important;
}
</style>
