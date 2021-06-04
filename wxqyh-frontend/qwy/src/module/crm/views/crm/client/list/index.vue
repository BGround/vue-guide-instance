<template>
  <div class="clientList">
    <!-- 页面顶部内容 -->
    <div class="pageTop">
      <div v-if="selectDatas.length == 0">
        <qwui-button type="primary" @click.stop="addClient" class = "marginR10">新建</qwui-button>
        <span v-perm="'clientImport'" class = "marginR10"><qwui-button plain @click.stop="doImport" >导入</qwui-button></span>
        <span v-perm="'clientExport'" ><qwui-button plain @click.stop="doExport" >导出</qwui-button></span>
      </div>
      <div v-else>
        <span  class= "marginR10"><qwui-button plain @click.stop="openModal('transfer')">转移</qwui-button></span>
        
        <span v-perm="'clientDel'" class= "marginR10"><qwui-button plain @click.stop="doDels" >删除</qwui-button></span>
        
        <span v-perm="'clientExport'"><qwui-button plain @click.stop="doExport">导出</qwui-button></span>
      </div>
      <div>
        <qwui-input
          inputType="search"
          @search="seniorSearch"
          inputTips="客户名称"
          v-model="searchFields[1]['searchValue.title']"
        ></qwui-input>
        <a
          href="javascript:void(0)"
          class="seniorSearchBtn"
          :class="{'borderStyle': isShowSearchBox}"
          @click.stop="toggleSearchBox"
        >高级</a>
        <span style="position:relative">
          <custom-field
            :customFieldList="customFieldList"
            v-show="isShowCustomSetting"
            @sure="saveCustomField"
            @cancel="toggleCustomSetting"
          ></custom-field>
          <i class="tableSettingIcon" @click.stop="toggleCustomSetting"></i>
        </span>
      </div>
    </div>
    <!-- 高级搜索内容 -->
    <!-- <transition name="fade"> -->
      <div class="seniorBox" v-show="isShowSearchBox">
        <ul class="searchUl">
          <li v-for="(field,index) in searchFields.slice(0,9)" :key="index" v-if = "field.name != '客户级别' || isStartClientGrade">
            <div class="searchTitle">{{field.name}}</div>
            <span v-if="field.type == 'base'">
              <qwui-input :inputType="field.type" v-model="field[field.text]" inputTips="请输入" @search="seniorSearch"></qwui-input>
            </span>
            <span v-if="field.type == 'select'">
              <qwui-select :dataList="field.name == '商机阶段' ? businessStage : clientLevel" v-model="field[field.text]" class="inputWidth"></qwui-select>
            </span>
            <span v-if="field.type == 'date'">
              <date-picker
                class="inputWidth"
                v-model="field.time"
                rangeSeparator="至"
                :showButtons="true"
                ref="searchCreateDate"
              ></date-picker>
            </span>
          </li>
          <li>
            <div class="searchTitle">部门</div>
            <span>
              <pick-exam
                class="competitorPickPerson"
                :useTab="deptTab"
                @chooseDone="chooseDone_dept"
                :isShowRadios="false"
                ref="deptPick"
                :maxDept = "maxDept"
              ></pick-exam>
            </span>
          </li>
          <li>
            <div class="searchTitle">负责人</div>
            <span>
              <pick-exam
                class="competitorPickPerson"
                :useTab="functionTab"
                @chooseDone="chooseDone_inchager"
                :isShowRadios="false"
                ref="inchargePersonsPick"
                :maxUser = "maxInchager"
              ></pick-exam>
            </span>
          </li>
          <li>
            <div class="searchTitle">创建人</div>
            <span>
              <pick-exam
                class="competitorPickPerson"
                :useTab="functionTab"
                @chooseDone="chooseDone_creator"
                :isShowRadios="false"
                ref="createPersonsPick"
                :maxUser = "maxCreator"
              ></pick-exam>
            </span>
          </li>
        </ul>
        <div class="searchConfirmBtn">
            <qwui-button plain @click.stop="emptySearch">清空</qwui-button>
            <qwui-button type="primary" @click.stop="seniorSearch" >查询</qwui-button>
        </div>
      </div>
    <!-- </transition> -->
    <!-- 表格 -->
    <div class="tableBox">
      <data-table :headData="tableHeadData" :dataList="tableDataList" ref="dataTable">
        <template slot-scope="{row,col}" v-if = "col.key == '创建时间/更新时间'">
          <p class = "c999">{{row['创建时间/更新时间'].createTime}}</p>
          <p class = "c999">{{row['创建时间/更新时间'].updateTime}}</p>
        </template>
      </data-table>
      <page :pageData="pageData" @change="changePage"></page>
    </div>
    <!-- 转移客户对话框 -->
    <qw-Modal
      :show.sync="isShowModal"
      :showCancelButton="true"
      :title="modalTitle"
      :zIndex="modalZindex"
      @on-confirm="modalConfirm"
      @on-cancel="modalCancel"
      
    >
      <div class="modalContent" v-if="modalTitle == '转移客户'">
        <div class="flex">
          <span class="lineH mr20">新负责人：</span>
          <ul class = "trans_pickPerson" @click = "listenAddPerson">
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
          <span @click = "listenAddPerson">修改</span>
        </div>
        <div>
          <div class="lineH textAlign">同时转移该客户关联的</div>
          <div class="flex">
            <qwui-checkbox
              class="mr44"
              v-model="transferObj.relBusiness"
              @change="toggleBusiness"
            >商机</qwui-checkbox>
            <span v-show="transferObj.relBusiness">
              <qwui-radio label="1" v-model="transferObj.relBusiness">未赢单商机</qwui-radio>
              <qwui-radio label="0" v-model="transferObj.relBusiness">所有商机</qwui-radio>
            </span>
          </div>
          <div class="textAlign">
            <qwui-checkbox v-model="transferObj.relContract" label="0">合同</qwui-checkbox>
          </div>
        </div>
      </div>
    </qw-Modal>
    <!-- 导入 -->
    <batch-import
      :step1="step1"
      :step2="step2"
      :step3="step3"
      v-model="visible"
      @handler-import="handlerImport"
      @on-confirm="importConfirm"
      @export-error="exportError"
    ></batch-import>
    <!-- 导出 -->
    <custom-export
      v-model="showExport"
      :exportCount="exportCount"
      :exportOption="exportOption"
      :searchOption="searchOption"
      :isVip="isVip"
      @renderTable="renderTable"
      @exportConfirm="exportConfirm"
     
    ></custom-export>
    <!-- 详情 -->
    <crm-detail type = "client" ref="clientDetail" :id="detailId" :operateConfig = "operateConfig" @edit = "openEdit" @moreOperate="moreOperateKey"></crm-detail> 
    <pick-person
      :show="isShowPickPerson"
      :functionTab="functionTab"
      @chooseDone="chooseDone"
      @closeThis="closePickPerson"
      :maxUser="maxUser"
      ref = "transferPerson"
      :defaultUsers="defaultUsers"
    ></pick-person>
  </div>
</template>

<script>
import qwuiButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
import qwuiSelect from "@/components/qwuiBase/qwuiSelect/QwSelect";
import qwuiInput from "@/components/qwuiBase/qwuiInput/qwuiInput";
import qwuiRadio from "@/components/qwuiBase/qwuiRadio/qwuiRadio";
import qwuiCheckbox from "@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox";
import datePicker from "@/components/base/VueDatepickerLocal";
import dataTable from "@/components/list/dataTable";
import customField from "@/components/Table/CustomField/CustomField";
import page from "@/components/list/page";
import qwModal from "crm/components/qwModal";
import personCount from "@/components/pickPerson/qwuiPersonCount";
import pickPerson from "@/components/pickPerson/pickPerson";
import batchImport from "crm/components/qwBatchImport";
import customExport from "./customExport";
import pickExam from "@/components/pickPerson/pickExam";
import crmDetail from "@/module/crm/components/crm-detail/crmDetail";
import baseURL from '@/assets/js/baseURL_config';
import {
  getCustomField,
  getClientList,
  saveCustomField,
  getBusinessStage,
  transferClient,
  importTemplateUrl,
  doBatchImport,
  delClient,
  getExportOption,
  checkExport,
  createExportTask,
  inserExportRecord,
  viewImportProcess,
  isVipUser,
  getClientLevel,
  startClientGrade,
  getExportErrorUrl
} from "crm/api/client/index";
export default {
  components: {
    qwuiButton,
    qwuiSelect,
    qwuiInput,
    qwuiCheckbox,
    qwuiRadio,
    datePicker,
    dataTable,
    customField,
    page,
    qwModal,
    personCount,
    pickPerson,
    batchImport,
    customExport,
    pickExam,
    crmDetail
  },
  data() {
    return {
      selectDatas: [], //保存列表选中的记录
      searchFields: [
        {
          name: "客户类别",
          type: "base",
          "searchValue.clientType": "",
          text: "searchValue.clientType"
        },
        {
          name: "客户名称",
          type: "base",
          "searchValue.title": "",
          text: "searchValue.title"
        },
        {
          name: "客户编码",
          type: "base",
          "searchValue.clientCode": "",
          text: "searchValue.clientCode"
        },
        {
          name: "客户级别",
          type: "select",
          text: "searchValue.clientGrade"
        },
        {
          name: "客户地址",
          type: "base",
          "searchValue.area": "",
          text: "searchValue.area"
        },
        {
          name: "行业",
          type: "base",
          "searchValue.industry": "",
          text: "searchValue.industry"
        },
        {
          name: "商机阶段",
          type: "select",
          text: "searchValue.stage",
          "searchValue.stage": ""
        },
        {
          name: "创建时间",
          type: "date",
          time:[],
          "searchValue.startTimes":"",
          "searchValue.endTime": "",
          text: ["searchValue.startTimes", "searchValue.endTime"]
        },
        {
          name: "更新时间",
          type: "date",
          time:[],
          "searchValue.startUpdateTime": [],
          "searchValue.endUpdateTime": "",
          text: ["searchValue.startUpdateTime", "searchValue.endUpdateTime"]
        },
         {
          name: "负责人",
          type: "selUser",
          "searchValue.userId": "",
          text: "searchValue.userId"
        },
        {
          name: "创建人",
          type: "selUser",
          "searchValue.closeUserId": "",
          text: "searchValue.closeUserId"
        },
        {
          name: "部门",
          type: "selUser",
          "searchValue.deptName": "",
          text: "searchValue.deptName"
        },
      ], //搜索条件列表
      businessStage: [
        {
          optionName: "请选择目前所在阶段",
          val: ""
        }
      ], //商机阶段列表
      isShowSearchBox: false, //是否显示高级搜索框
      customFieldList: [], //表头列表
      selectField: [],//选中的列表字段设置
      tableHeadData: {
        left:{},
        middle:[],
        right:{isShowOperate: false}
      },//保存列表头部设置
      tableDataList: [],//客户列表数据
      isShowCustomSetting: false, //是否显示自定义字段设置
      pageData: {}, //分页配置数据
      isShowModal: false, //是否显示对话框
      modalTitle: "转移客户", //对话框标题
      personCountShow: true,
      defaultUsers: [],//选人组件的默认值
      isShowPickPerson: false,
      functionTab: [{ text: "标签人员" }, { text: "特定人员" }],//选人组件的数据
      deptTab: [{ text: "部门" }],
      showType: {
        person: true
      },
      transferObj: {//转移客户的参数
        relBusiness: "1",
        relContract: "",
        inCharges: "",
        clientIds: ""
      },
      modalTitle: "",//对话框的标题
      step1: {//导入组件的参数
        templateName: "客户批量导入模板",
        templateUrl: importTemplateUrl
      },
      step2: {
        tips: [
          //问号提示
          "【团队版】单个文档客户数不能多于100条；",
          "【尊享版】单个文档客户数不能多于2000条；"
        ],
        repeat: {
          key: "客户编码",
          tips: [
            " 覆盖导入：无条件替换旧数据",
            " 不导入：跳过重复数据，只导入新数据",
            "保留重复数据：两个数据都保留，以客户编码为区分条件"
          ],
          options: ["覆盖导入", "不导入", "不覆盖，保留数据"]
        }
      },
      step3: {},
      visible: false,//是否显示导入组件
      pageSize: 10,
      curPage: "1",
      showExport: false,//是否显示导出组件
      exportOption: [],//导出的字段选项
      modalZindex: 10,//qwModal的层级
      maxUser: 1,//选人组件的可选个数
      searchOption: [],//传给导出组件的有值搜索项
      searchValue: {},//保存传递给搜索列表接口的对象
      isVip: true,//判断当前用户是否是vip
      detailId:'',//传递给详情组件的客户id
      operateConfig:[
        {
          key: 'export',
          name: '导出',
          permission:'clientExport'
        },
        {
          key: 'transfer',
          name: '转移'
        },
        {
          key: 'delete',
          name: '删除',
          permission:'clientDel'
        },
      ],//传递给详情组件的操作配置
      maxDept:1,
      maxInchager:5,
      maxCreator:5,
      creators:[],
      inCharges:[],
      clientLevel:[
        {
          optionName:'请选择',
          val:''
        }
      ],
      isStartClientGrade:false,
      oldCustomFieldList:[],
    };
  },
  mounted() {
    this.checkVipUser();
    this.getBusinessStage();
    this.getCustomFieldList();
    this.getClientLevels()
    this.hasStartClientGrade()
  },
  computed: {
    exportCount() {
      return this.selectDatas.length;
    }
  },
  methods: {
    seniorSearch(){
      //获取高级索搜中有值的搜索项
      this.searchOption = [];
      this.searchFields.forEach((item, index) => {
        if (item[item.text] !== "") {
          //对高级搜索的时间进行格式化
          if (item.type == "date" && item.time.length > 0) {
            let startTime = item.time[0]
              ? this.formatTime(new Date(item.time[0]))
              : "";
            let endTime = item.time[1]
              ? this.formatTime(new Date(item.time[1]))
              : "";
            if(item.name == '创建时间'){
                this.searchOption.unshift({
                  title: item.name,
                  type: "datePicker",
                  value: [startTime, endTime]
                });
            }else{
              this.searchOption.push({
                  title: item.name,
                  type: "date",
                  value: [startTime, endTime]
              });
            }
         
            
          } else if (item.type != "date") {
            if(item.type == 'select'){
              let stage = this.businessStage.find( stage => stage.val == item[item.text])
              let level = this.clientLevel.find( (level,i) => level.val == item[item.text])
              if(stage || level){
                this.searchOption.push({
                title: item.name,
                type: "text",
                value: stage ? stage.optionName : level.optionName,
                key: index + ""
              });
              }
            }else{
              this.searchOption.push({
                title: item.name,
                type: "text",
                value: item.name == '负责人' ? this.inCharges : (item.name == '创建人' ? this.creators : item[item.text]),
                key: index + ""
              });
            }
        
          }
        }
      });
      
      this.getTableList()
    },
    //验证是否开启了客户分级
    hasStartClientGrade(){
      startClientGrade().then( res => {
        if(res.code == '0'){
          this.isStartClientGrade = res.data.is_photograph == '1' ? true : false
        }else{
          dataBase.alert('提示',res.desc)
        }
      }).catch((res) => {
        dataBase.alert('提示','网络错误')
      })
    },

    //获取客户级别
    getClientLevels(){
      getClientLevel().then( res => {
        if( res.code == '0'){
          let clientGradeInfo = res.data.clientGradeInfo || []
          clientGradeInfo.forEach( (item,index) => {
            if(item.display == '1'){
               this.clientLevel.push(
                {
                  optionName: item.name,
                  val:item.name
                }
               )
            }
            
          })
        }else{
          dataBase.alert('提示', res.desc)
        }
      }).catch( (res) => {
        dataBase.alert('提示', "网络错误")
      })
    },

    //新建客户
    addClient(){
      this.$router.push({
          path: 'operate'
      })
    },
    
    //编辑用户
    openEdit(id){
      document.body.style.overflow = 'visible';
        this.$router.push({
          path: 'operate',
          query: {
            id
          }
      })
    },

    //详情里的更多方法
    moreOperateKey(key){
      const func = {
        export: this.doExport,
        transfer: this.openModal,
        delete: this.doDels,
      }
      func[key]()
    },

    //初始化导出
    initExportOption() {
      dataBase.loading = true
      getExportOption().then(res => {
        dataBase.loading = false
        if (res.code == "0") {
          this.exportOption = res.data.optionList || [];
        }
      });
    },

    //验证用户是否为vip
    checkVipUser() {
      isVipUser()
        .then(res => {
          if (res.code == "0") {
            this.isVip = res.data.isVip
          } else {
            dataBase.alert("提示", res.desc);
          }
        })
        .catch(() => {
          dataBase.alert("提示", res.desc);
        });
    },

    //获取商机阶段
    getBusinessStage() {
      getBusinessStage()
        .then(res => {
          if (res.code == "0") {
            let stageList = res.data.stageList || []
            let arr = res.data.stageList.map((stage, index) => {
              return {
                optionName: stage.name,
                val: stage.stageCode
              };
            });
            this.businessStage.push(...arr);
          } else {
            dataBase.alert("提示", res.desc);
          }
        })
        .catch(() => {
          dataBase.alert("提示", res.desc);
        });
    },

    //显示与隐藏高级搜索
    toggleSearchBox() {
      this.isShowSearchBox = !this.isShowSearchBox;
    },

    //显示与隐藏表头设置
    toggleCustomSetting() {
      this.isShowCustomSetting = !this.isShowCustomSetting;
      if(!this.isShowCustomSetting){
        this.customFieldList = this.oldCustomFieldList.map( item => {return {...item}})
      }
    },

    //获取表头字段设置列表
    getCustomFieldList() {
      getCustomField()
        .then(res => {
          if (res.code == "0") {
            let sortArr = [];
            this.customFieldList = res.data.searchOption || [];
            this.customFieldList.forEach(element => {
              element.text = element.optionName;
              element.isDisabled =
              element.optionName == "客户名称" ? true : false;
              element.isChecked = element.status == "1" ? true : false;
              element.status == "1" ? sortArr.push(element.sortNum) : "";
              element.key = element.sortNum;
            });
            this.oldCustomFieldList = this.customFieldList.map( item => {return {...item}})
            this.selectField = sortArr;
            this.formatTableHead(sortArr);
            this.getTableList();
          } else {
            dataBase.alert("提示", res.desc);
          }
        })
        .catch((res) => {
          dataBase.alert("提示", res.desc);
        });
    },

    //保存表头选取的字段
    saveCustomField(list) {
      this.selectField = list;
      //重新加载表头
      this.formatTableHead(list);
      //保存字段
      this.customFieldList.forEach(item => {
        item.status = item.isChecked ? "1" : "0";
      });
      let lists = {
        list: this.customFieldList
      };
      let obj = {
        searchItem: JSON.stringify(lists)
      };
      saveCustomField(obj)
        .then(res => {
          if (res.code == "0") {
            //重新渲染表格数据
            this.getTableList();
            this.getCustomFieldList();
            this.isShowCustomSetting = false;
            this.$refs.dataTable.checkedAll = false;
            this.selectDatas = []
          } else {
            dataBase.alert("提示", res.desc);
            
          }
        })
        .catch((res) => {
          dataBase.alert("提示", res.desc);
        });
    },
 
    //格式化表头数据
    formatTableHead(list) {
      let arr = [];
      let that = this;
      list.forEach(sort => {
        this.customFieldList.forEach((item,index) => {
          let obj = {};
          if (item.sortNum == sort) {
            obj = {
              title: item.optionName,
              key: item.optionName,
              width: 150
            };
            if (item.optionName == "客户名称") {
              obj.skip = {
                skipFunc: (id) => {
                  // 打开详情
                  this.detailId = id;
                  this.transferObj.clientIds = id
                  let option = this.$refs.dataTable.checkList.find( option => option.id == id)
                  option.isChecked = true
                  this.selectDatas = [{
                    id:id,
                    isChecked:true
                  }]
                  this.$refs.clientDetail.showDetail();
                  this.isShowCustomSetting = false
                }
              };
              obj.width= 242
            }
            if(item.optionName == "负责人" || item.optionName == "创建人" || item.optionName == "状态"){
              obj.width = 80
            }
            
            arr.push(obj);
          }
        });
      });
      this.tableHeadData = {
        left: {
          checkFunc: function(checkAll, checkList, idx) {
            that.selectList(checkAll, checkList, idx);
          },
          id: "id"
        },
        middle: arr,
        right: {
          isShowOperate: false,
          width: 80
        },
        width: "100%"
      };
    },

    //获取客户列表
    getTableList() {
      let self = this;
      let obj = {};
      obj.page = this.curPage;
      obj.pageSize = this.pageSize;
      this.searchFields.forEach(item => {
        if (item.type == "date") {
          obj[item.text[0]] = item.time[0]
            ? this.formatTime(new Date(item.time[0])) + " 00:00:00"
            : ""
          obj[item.text[1]] = item.time[1]
            ? this.formatTime(new Date(item.time[1])) + " 23:59:59"
            : ""
        }else{
          obj[item.text] = item[item.text]
        }
      });
      this.searchValue = obj;
      dataBase.loading = true;
      getClientList({ ...obj })
        .then(res => {
          dataBase.loading = false;
          if (res.code == "0") {
            this.tableDataList = res.data.pageData || [];
            this.tableDataList.forEach( item => {
              let time = item["创建时间/更新时间"].split(",")
              item["创建时间/更新时间"] = {
                createTime: time[0],
                updateTime: time[1]
              }
            })
            this.pageData = {
              pageSize: this.pageSize,
              totalRows: res.data.totalRows,
              page: res.data.currPage,
              maxPage: res.data.maxPage
            };
            this.$refs.dataTable.checkedAll = false;
            this.selectDatas = []
          } else {
            dataBase.alert("提示", res.desc);
          }
          //this.isShowSearchBox = false;
        })
        .catch((res) => {
          dataBase.alert("提示", res.desc);
        });
    },

    //分页
    changePage(curPage, pageSize) {
      this.curPage = curPage;
      this.pageSize = pageSize;
      this.getTableList();
      this.selectDatas = []
      this.$refs.dataTable.checkedAll = false;
    },

    //选择记录
    selectList(checkAll, checkList, idx) {
      this.selectDatas = checkList.filter(item => {
        return item.isChecked;
      });
      let ids = this.selectDatas.map(item => {
        return item.id;
      });
      this.transferObj.clientIds = ids.join(",");
    },

    //监听选人事件
    listenAddPerson() {
      this.isShowPickPerson = true;
    },

    //选人组件确认按钮
    chooseDone(deptSelected, tagList, specialUsers, specialPosition) {
      this.defaultUsers = specialUsers;
      this.transferObj.inCharges = specialUsers[0] ? specialUsers[0].userId : '';
      this.isShowPickPerson = false;
      this.transSelectShow = false
    },

    //关闭选人组件
    closePickPerson() {
      this.isShowPickPerson = false;
    },

    //打开转移对话框
    openModal() {
      this.modalTitle = "转移客户";
      this.isShowModal = true;
      this.isShowCustomSetting = false
    },

    //关闭对话框
    modalCancel() {
      this.isShowModal = false;
    },

    //对话框确认按钮
    modalConfirm() {
      if (!this.transferObj.inCharges) {
        dataBase.alert("提示", "负责人不能为空");
        return;
      }
      this.transferObj.relContract = this.transferObj.relContract ? "0" : "";
      dataBase.loading = true;
      transferClient(this.transferObj)
        .then(res => {
          dataBase.loading = false;
          if (res.code == "0") {
            dataBase.top_alert(res.desc, true, 1000);
            this.isShowModal = false;
            this.selectDatas = [];
            this.$refs.dataTable.checkList.forEach(
              item => (item.isChecked = false)
            );
            this.getTableList()
            this.$refs.dataTable.checkedAll = false;
            this.defaultUsers = []
            this.$refs.clientDetail.$refs.detailBlock.close();
            this.transferObj.inCharges = ''
          } else {
            dataBase.alert("提示", res.desc);
          }
        })
        .catch(() => {
          dataBase.alert("提示", res.desc);
        });
    },

    //切换转移中的商机类型
    toggleBusiness(val) {
      if (val) {
        this.transferObj.relBusiness = "1";
      } else {
        this.transferObj.relBusiness = "";
      }
    },

    //导入
    handlerImport(obj) {
      let type = this.step2.repeat.options.indexOf(obj.radio);
      let formData = new FormData();
      formData.append("upFile", obj.file);
      formData.append("importType", type);
      dataBase.loading = true;
      doBatchImport(formData).then(res => {
        if (res.code == 0) {
          this.step3.resultId = res.data.id;
          this.getImportResult();
        } else {
          dataBase.loading = false;
          dataBase.alert("提示", res.desc);
        }
      });
    },

    //查询导入结果
    getImportResult() {
      viewImportProcess(this.step3.resultId)
        .then(res => {
          if (res.code == 0) {
            if (res.data.isFinish) {
              this.step3 = Object.assign({}, this.step3, res.data);
              dataBase.loading = false;
            } else {
              setTimeout(this.getImportResult, 2000);
            }
          } else {
            dataBase.alert("提示", res.desc);
            dataBase.loading = false;
          }
        })
        .catch(err => {
          dataBase.loading = false;
          dataBase.alert("提示", "网络错误");
        });
    },

    //导出错误结果
    exportError() {
      window.location.href = getExportErrorUrl(this.step3.resultId);
    },

    //删除客户
    doDels() {
      let ids = this.selectDatas.map(item => {
          return item.id;
        });
      dataBase.alert(
        "提示",
        "删除客户会将所属的联系人和商机一并删除，无法恢复，请确认是否要删除？",
        () => {
          dataBase.loading = true;
          delClient({ ids: ids.join(",") }).then(res => {
            dataBase.loading = true;
            if (res.code == "0") {
              dataBase.top_alert(res.desc, true, 1000);
              this.getTableList();
              this.selectDatas = [];
              this.$refs.dataTable.checkedAll = false;
              this.$refs.clientDetail.$refs.detailBlock.close();
            }
          });
        }
      );
    },

    //导入
    doImport() {
      this.visible = true;
      this.isShowCustomSetting = false
    },

    //点击导出
    doExport() {
      if (
        this.selectDatas.length > 50000 ||
        this.pageData.totalRows > 50000
      ) {
        dataBase.alert(
          "提示",
          "数量超出限制，建议这样做：1)缩短创建时间或增加筛选条件以减少本次导出的数据量；2)分批导出，每次控制在5w条以内"
        );
        return;
      }
      if(this.tableDataList.length == 0){
        dataBase.alert('提示','搜索结果为空不支持导出')
        return;
      }
      //获取导出的字段项
      this.initExportOption()
      console.log(this.searchOption)
      //若高级搜索中创建时间没有值，则默认给出创建时间
      let arr = this.searchOption.filter(item => item.title == "创建时间");
      if (this.searchOption.length == 0 || arr.length == 0) {
        let curDate = this.formatTime(new Date());
        let oldDate = this.formatTime(
          new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
        );
        this.searchOption.unshift({
          title: "创建时间",
          type: "datePicker",
          value: [oldDate, curDate]
        });
      }
      this.isShowCustomSetting = false
      this.showExport = true;
    },

    //重新渲染表格
    renderTable(key, startTime, endTime) {
      let obj = this.searchFields[key];
      if (startTime) {
        this.searchValue[obj.text[0]] = startTime + ' 00:00:00';
        this.searchValue[obj.text[1]] = endTime + ' 23:59:59';
      } else {
        this.searchValue[obj.text] = "";
      }
    },

    //时间格式化
    formatTime(date) {
      //let date = new Date(str);
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },

    //确定导出
    exportConfirm(obj) {
      let ClientOption = "searchValue.checkClientOption"
      let ContactOption = "searchValue.checkContactOption"
      let VisitOption = "searchValue.checkVisitOption"
      let BusinessOption = "searchValue.checkBusinessOption"
      if(obj[ClientOption].length > 0){
        obj[ClientOption] = obj[ClientOption] instanceof Array ? obj[ClientOption].join(",") : obj[ClientOption]
      }else{
        obj[ClientOption] = ''
      }

      if(obj[ContactOption].length > 0){
        obj[ContactOption] = obj[ContactOption] instanceof Array ? obj[ContactOption].join(",") : obj[ContactOption]
      }else{
        obj[ContactOption] = ''
      }

     if(obj[VisitOption].length > 0){
        obj[VisitOption] = obj[VisitOption] instanceof Array ? obj[VisitOption].join(",") : obj[VisitOption]
      }else{
        obj[VisitOption] = ''
      }

     if(obj[BusinessOption].length > 0){
        obj[BusinessOption] = obj[BusinessOption] instanceof Array ? obj[BusinessOption].join(",") : obj[BusinessOption]
      }else{
        obj[BusinessOption] = ''
      }
     
      let data = this.selectDatas.length > 0 ? this.selectDatas : [];
      let idArr = data.map(item => {
        return item.id;
      });
      this.searchValue = Object.assign({}, this.searchValue, obj);
      this.searchValue["searchValue.exportClientId"] =
        idArr.length > 0 ? idArr.join(",") : "";
      this.searchValue.reportType = "crm_allcustomer";
      checkExport(this.searchValue).then(res => {
        if (res.code == "0") {
          if (res.data.fileName) {
            dataBase.alert(
              "提示",
              `已找到相同查询条件的报表：【${
                res.data.fileName
              }】是否重新导出？`,
              () => {
                this.inserExportRecords();
              }
            );
            
          } else {
            this.inserExportRecords();
          }
         
        }
      });
    },

    //检查导出后的操作
    inserExportRecords() {
      createExportTask(this.searchValue).then(res => {
        if (res.code == "0") {
          inserExportRecord(this.searchValue).then( obj => {
            if (obj.code == "0") {
                
                this.$refs.dataTable.checkList.forEach(
                  item => (item.isChecked = false)
                );
                this.$refs.dataTable.checkedAll = false; 
                this.$refs.clientDetail.$refs.detailBlock.close(); 
                this.hasConfirmExport = true
                dataBase.alert(
                "提示",
                `操作成功，请稍后到<a href = '${baseURL}/manager/report/reportTask_main.jsp' style = 'color:#F08D00'>导出报表管理(点击跳转)</a>处下载对应的导出文件：${
                  res.data.fileName
                }`,
                () => {
                  this.selectDatas = [];
                  this.showExport = false
                }
              );
             
              
            }
          });
   
        }
      });
    },

    //清空高级搜索
    emptySearch() {
      this.searchFields.forEach(item => {
        if (item.type == "date") {
          item[item.text[0]] = "";
          item[item.text[1]] = "";
          item.time = []
        } else {
          item[item.text] = "";
        }
      });
      //选人组件清空
      this.$refs.inchargePersonsPick.defaultUsers = [];
      this.$refs.createPersonsPick.defaultUsers = [];
      this.$refs.deptPick.defaultDepts = [];
    },

    //选择创建人
    chooseDone_creator(deptSelected, tagList, specialUsers, specialPosition) {
      this.creators = specialUsers.map( user => user.personName).join(',')
      let ids = specialUsers.map(user => user.userId);
      this.searchFields[10]["searchValue.closeUserId"] =
        ids.length > 0 ? ids.join(",") : "";
      
    },

    //选择负责人
    chooseDone_inchager(deptSelected, tagList, specialUsers, specialPosition) {
      this.inCharges = specialUsers.map( user => user.personName).join(',')
      let ids = specialUsers.map(user => user.userId);
      this.searchFields[9]["searchValue.userId"] =
        ids.length > 0 ? ids.join(",") : "";
    },

    //选择部门
    chooseDone_dept(deptSelected, tagList, specialUsers, specialPosition) {
      let ids = deptSelected.map(dept => dept.nodeName);
      this.searchFields[11]["searchValue.deptName"] =
        ids.length > 0 ? ids.join(",") : "";
    },

    //导入确定
    importConfirm() {
      this.visible = false;
    }
  }
};
</script>


<style lang='scss' scoped>
  @import './list.scss'
 

</style>