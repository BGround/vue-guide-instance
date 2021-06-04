
<template>
  <div>
    <div class="contractWrap" v-if="addTypeShow">
      <header>
        <setting-header :pages="['设置']" @go-back="goBackClick"></setting-header>
      </header>
      <div class="contract-select">
        <div class="left-select">
          <!-- 合同类型列表 -->
          <left-side-bar
                        v-show="hasContractData"
                        :renderConfig="renderConfig"
                        @listenToChild="changeContractId"
                        @listenAddPop="addContract"
          ></left-side-bar>
        </div>
        <div class="rightDetail">
          <div class="typeNameItem">
            <span class="itemTitle">合同类型名称：</span>
            <qwui-input
                        v-model="contractTypeName"
                        class="qwui-input_style"
                        :inputType="'text'"
                        :maxLength=20
                        :isWarning="isWarning"
                        :warningTips="'标题不能为空'"
                        @input="changeInput"
                        @blur="changeInput">
            </qwui-input>
          </div>
          <div class="flowItem">
            <span class="itemTitle">合同流程：</span>
            <div class="radio-item">
              <qwui-radio v-model="range" label="4" border>无需审批</qwui-radio>
              <qwui-radio v-model="range" label="1" border>自由流程</qwui-radio>
              <qwui-radio v-model="range" label="0" border>固定流程</qwui-radio>
              <qwui-radio v-model="range" label="3" border>分支流程</qwui-radio>
              <div class="choose-flow mt10" v-if="range==0">
                <div class="choose-btn">
                  <div class="clickBtn" @click="chooseHandle">选择固定流程
                    <span class="flowNum">({{flowNumber}})</span>
                  </div>
                </div>
                <div class="choose-list">
                  <span class="selected-name" v-for="(item,idx) in flowData" :key="idx">
                    <span class="name">{{item.flowName}}</span>
                    <i @click="delClick(item,idx)"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="default-person">
            <span class="associated-person">默认相关人：</span>
            <!--销售团队负责人 选人组件-->
            <person-count class="person_count"
                          :personCountShow="personCountShow"
                          :defaultUsers="defaultUsers"
                          :showType="showType"
                          @listenAddPerson="addPerson">
            </person-count>
            <pick-person :show="pickPersonShow"
                          :defaultUsers="defaultUsers"
                          :functionTab="functionTab"
                          @chooseDone="chooseDone"
                          onlyUser
                          @closeThis="closeThis">
            </pick-person>
          </div>

          <div class="save_btn">
            <qwui-button type='primary' @click="saveFlowData">保存</qwui-button>
          </div>
        </div>
      </div>
    </div>

    <div class="contractForm" v-if="!addTypeShow">
      <header>
        <setting-header  @go-back="chooseHandle">
          <div slot="left-btns">
            <span class="returnContract" @click="chooseHandle">返回</span>
            <span class="choose-text">选择固定流程<span class="orange-text">({{fixFlowNum}})</span></span>
          </div>
        </setting-header>
      </header>
      <div class="flowLeft">
        <left-side-bar
                        v-show="hasFlowGroup"
                        :renderConfig="flowRenderConfig"
                        @listenToChild="changeFlowId"
        ></left-side-bar>
      </div>
      <div class="flowRight">
        <div class="searchBar">
          <div class="left-btn">
              <qwui-button type='primary' @click="handleClick">确定</qwui-button>
          </div>
          <div class="right-searchBox">
              <qwui-input
                          inputType="search"
                          @search='search'
                          v-model="searchTitle"
                          :inputTips="'搜索固定流程名称'">
              </qwui-input>
          </div>
        </div>
        <div class="table_wrap">
          <data-table
                    :listData="listData"
                    :titleName="titleName"
                    @checkAllBtn="checkAllBtn"
                    @checkItemBtn="checkItemBtn"
                    >
          </data-table>
          <page :pageData="pageData" @change="change"></page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import page from '@/components/list/page.vue';
import dataTable from "./components/dataTable";
import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio';
import qwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
import qwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import leftSideBar from '@/components/list/LeftSideBar';
import settingHeader from "./components/settingHeader";
import personCount from '@/components/pickPerson/qwuiPersonCount';
import pickPerson from '@/components/pickPerson/pickPerson';
import { getTypeList,getContractTypeDetail,getFlowGroup,flowPageSearch,saveContractType,deleteType } from "crm/api/setting";
export default {
  data(){
    return{
      // isCheckAll: false,
      searchFlowName: '', // 搜索的flow名
      checkedData: [], // 存放选中的数据
      titleName: '固定流程名称',
      listData: [ // 固定流程数据
        // { name: '', id: '', isCheck: false },
      ],
      contractTypeId: '', // 当前的类别id
      selectedList: [], // 被选中的固定流程数据
      selectedsData: [], // 已经选到的数据数组
      selectedData: [], // 已经选到的数据数组
      selectedFlowId: '', // 选中的固定流程Id
      searchTitle: '',
      pageSize:10,
      pageData:{
      },
      page:1,
      ids:'',
      flowListData: [], // 存放固定流程数据列表
      hasFlowGroup: true, // 固定流程列表
      addTypeShow: true, // 打开选择流程的时候隐藏
      flowRenderConfig: {
        renderList:[],// 规则列表
      },
      functionTab:[
        {text:'标签人员'},
        {text:'特定人员'},
        {text:'批量导入'},
      ],
      pickPersonShow:false,
      showType:{
        person:true,
      },
      personCountShow:true,// 选人结果显示隐藏
      defaultUsers:[],
      flowData: [
        // { flowName: '' }
      ],
      range:'1', // 单选按钮
      isWarning: false, // 类型为空的tip提示
      contractTypeName: '', // 合同类型
      contractListData: [], // 存放合同列表
      hasContractData: true,
      renderConfig:{
        addOperateName:'新建类型',
        renderList:[],// 规则列表
        currentIndex:0,
      },
    }
  },
  components: {
    settingHeader,
    leftSideBar,
    qwuiButton,
    qwuiInput,
    qwuiRadio,
    personCount,
    pickPerson,
    dataTable,
    page
  },
  created(){
    this.init()
  },
  computed: {
    // 固定流程的数量
    flowNumber(){
      return this.flowData.length
    },
    // 选中的固定流程
    fixFlowNum(){
      return this.checkedData.length;
    },
  },
  watch:{
  },
  methods: {
    init(){
      this.renderConfig.renderList = [];
      this.contractListData = [];
      dataBase.loading = true;
      getTypeList().then(res => {
        dataBase.loading = false;
        if(res.code == '0'){
          // 获取返回的发票数据
          this.contractListData = res.data.typeList;
          this.contractTypeId = res.data.typeList[0].id;
          this.contractListData.forEach((item) => {
            this.renderConfig.renderList.push({
              itemName: item.typeName,
              itemIcon:require('../../../../../assets/images/crm/contractIcon.svg'),
              id: item.id,
              status:0,
              operateList:[
                {
                  operateName:'删除',
                  operateFunc:()=> {
                    this.delContract(item)
                  }
                }
              ]
            })
          })
          if (this.contractListData && this.contractListData.length > 0){
            this.renderConfig.currentIndex = 0;
          }
          this.getDetail(this.contractListData[0].id);
        }else{
          _.alert('提示',res.desc)
        }
      })
    },

    // 返回上一级
    goBackClick(){
      this.$router.go(-1);
    },

    // 选人回调
    chooseDone(deptSelected,tagList,specialUsers){
      this.defaultUsers = specialUsers;
      this.pickPersonShow = false;
    },

    // 选择合同类型监听事件
    changeContractId(id,key){
      this.renderConfig.currentIndex = key;
      this.contractTypeId = id;
      this.getDetail(id);
    },

    // 选择固定流程事件
    changeFlowId(id,key){
      this.selectedFlowId = id
      this.$set(this.flowRenderConfig,'currentIndex',key)
      this.fixFlowDetail(id)
    },

    // 新增团队
    addContract(){
      this.contractTypeName = '';
      this.contractTypeId = '';
      this.range = '3';
      this.defaultUsers = [];
    },

    // 输入input
    changeInput(){
      this.isWarning = this.billTypeName == '';
    },

    // 正则去掉左右空白格
    trim(str){
      return str.replace(/(^\s*)|(\s*$)/g, '');
    },

    // 删除团队
    delContract(item){
      let self = this
      _.alert('提示','确定要删除该合同类型吗？',function () {
        dataBase.loading = true
        deleteType({id:item.id}).then(res => {
          dataBase.loading = false
          if(res.code == '0'){
            self.init();
          }else{
            _.alert('提示', res.desc)
          }
        });
      },'确定',true)
    },

    // 添加人员
    addPerson(status){
      if (status){
        this.principalPickShow = true;
      }else {
        this.pickPersonShow = true;
      }
    },

    // 选人关闭按钮回调
    closeThis(status){
      if (status){
        this.principalPickShow = false;
      }else {
        this.pickPersonShow = false;
      }
    },

    // 删除流程
    delClick(item,idx){
      this.flowData.splice(idx,1)
    },

    // 保存按钮事件
    saveFlowData(){
      let userArr = [],flowIdArr = [];
      if(this.defaultUsers.length > 0){
        this.defaultUsers.forEach((item) => {
          userArr.push(item.userId)
        })
      }
      if(this.flowData.length > 0){
        this.flowData.forEach((item) => {
          flowIdArr.push(item.id)
        })
      }
      let obj = {
        'tbCrmContractTypePO.typeName': this.contractTypeName,
        'tbCrmContractTypePO.id': this.contractTypeId,
        isFree: this.range,
        flowIds: flowIdArr.join('|'),
        // flow: '',
        isOrderAudit: 1,
        userIds: userArr.join('|'),
      }
      saveContractType(obj).then(res => {
        if(res.code == '0'){
          this.init();
          console.log(res.data)
        }else{
          _.alert('提示', res.desc)
        }
      })
    },

    // 获取合同类型详情
    getDetail(id){
      // 清空默认相关人
      this.defaultUsers = [];
      // 清空固定流程
      this.flowData = [];
      // 清空选中的数据
      this.checkedData = [];
      getContractTypeDetail({id}).then(res => {
        if(res.code == '0'){
          this.contractTypeName = res.data.type.typeName
          this.range = String(res.data.type.isFree)
          // 有固定流程的情况
          if(res.data.flowList.length > 0){
            this.flowData = res.data.flowList;
            let arr = []
            this.flowData.forEach((item) => {
              let obj = {
                name: item.flowName,
                id: item.id,
                isCheck: true
              }
              arr.push(obj)
            })
            this.checkedData = this.checkedData.concat(arr)
          }
          // 默认相关人的赋值
          if(res.data.type.personList.length > 0){
            this.defaultUsers = res.data.type.personList
          }
        }else{
          _.alert('提示',res.desc)
        }
      })
    },

    // 打开流程表格
    chooseHandle(){
      this.addTypeShow = !this.addTypeShow;
      this.getFlowDetail()
    },

    getFlowDetail(){
      dataBase.loading = true;
      getFlowGroup().then(res => {
        dataBase.loading = false;
        if(res.code == '0'){
          // 获取返回的发票数据
          this.flowListData = res.data.groupList;
          this.flowListData.forEach((item) => {
            this.flowRenderConfig.renderList.push({
              itemName: item.name,
              itemIcon:require('../../../../../assets/images/crm/icon_b-contract_flow.svg'),
              id: item.id,
              status:0,
            })
          })
          // if (this.flowListData && this.flowListData.length > 0){
          //   this.renderConfig.currentIndex = 0;
          // }
          this.fixFlowDetail();
        }else{
          _.alert('提示',res.desc)
        }
      })
    },

    fixFlowDetail(id){
      dataBase.loading = true;
      this.listData = [];
      let obj = {
        flowIds: '',
        flowNames: '',
        'searchValue.flow_name': this.searchFlowName,
        'searchValue.status': 2,
        'searchValue.group_id': id,
        page: this.page,
        pageSize: this.pageSize
      }
      // 页码组件赋值
      flowPageSearch(obj).then(res => {
        dataBase.loading = false;
        if(res.code == '0'){
          this.pageData = {
            page: res.data.currPage,
            pageSize: this.pageSize,
            maxPage: res.data.maxPage,
            totalRows: res.data.totalRows
          };
          if(res.data.pageData)
          {
            res.data.pageData.forEach((item) => {
              let obj = {
                name: item.flowName,
                id: item.id,
                isCheck: false
              }
              this.checkedData.forEach((citem) => {
                if(citem.id == item.id){
                  this.$set(obj,'isCheck',true)
                }
              })
              this.listData.push(obj)
            })
          }
        }else{
          _.alert('提示', res.desc)
        }
      })
    },

    change(page,pageSize){
      this.pageSize = pageSize;
      this.page = page;
      this.fixFlowDetail(this.selectedFlowId)
    },

    // 根据固定流程名称搜索
    search(val){
      this.searchFlowName = val;
      this.fixFlowDetail()
      this.searchFlowName = '';
    },

    // 按确定返回固定流程名称
    handleClick(){
      this.flowData = [];
      this.checkedData.forEach((item) => {
        let obj = {
          flowName: item.name,
          id: item.id
        }
        this.flowData.push(obj)
      })
      this.addTypeShow = !this.addTypeShow
    },

    // 点击全选
    checkAllBtn(val){
      this.listData.forEach((item) => {
        if(val){
          if(item.isCheck == false){
            this.$set(item,'isCheck',true);
            this.checkItemBtn(item, val);
          }
        }else{
          this.$set(item,'isCheck',false);
          this.checkItemBtn(item, val);
        }
      })
    },

    // 点击单项
    checkItemBtn(item,boolean){
      if(boolean){
        this.checkedData.push(item);
      }else {
        this.checkedData = this.checkedData.filter(per => {
          return per.id != item.id;
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.contractWrap{
  height: 100%;
  .contract-select{
    margin-top: 20px;
    height: 100%;
    width: 100%;
    position: relative;
    .rightDetail{
      float: left;
      margin-left: 25px;
      width: 645px;
      padding-top: 20px;
      .flowItem{
        display: flex;
        margin-top: 20px;
        .radio-item{
          margin-left: 4px;
          flex: 5.5;
          .choose-flow{
            .choose-btn{
              border-top: 1px solid #ddd;
              padding-top: 10px;
              .clickBtn{
                background: none repeat scroll 0 0 white;
                border: 1px solid #dadada;
                border-radius: 5px;
                cursor: pointer;
                display: inline-block;
                font-size: 14px;
                padding: 0 15px;
                line-height: 30px;
                margin-right: 5px;
                .flowNum{
                  color: #C31725;
                  font-weight: bold;
                }
              }
            }
            .choose-list{
              margin-top: 10px;
              .selected-name{
                background: none repeat scroll 0 0 white;
                border: 1px solid #f4d6aa;
                border-radius: 5px;
                color: #C31725;
                display: inline-block;
                font-size: 14px;
                margin: 5px 3px;
                padding: 4px 30px 4px 15px;
                position: relative;
                .name{
                  color: #C31725;
                  font-size: 14px;
                }
                i{
                  background: url(../../../../../assets/images/selected-close.png) no-repeat scroll 0 0 rgba(0, 0, 0, 0);
                  cursor: pointer;
                  height: 16px;
                  position: absolute;
                  right: 5px;
                  top: 7px;
                  width: 16px;
                }
              }
            }
          }
        }
      }
      .default-person{
        margin-top: 20px;
        .associated-person{
          vertical-align: top;
          width: 102px;
          display: inline-block;
          text-align: right;
          margin-top: 9px;
        }
        .person_count{
          width: 83%;
          display: inline-block
        }
      }
      .save_btn{
        text-align: center;
        margin-top: 70px;
      }
    }
    .itemTitle{
      display: inline-block;
      width: 100px;
      text-align: right
    }
    .mt10{
      margin-top: 10px;
    }
  }
}
.contractForm{
  .returnContract{
    cursor: pointer;
  }
  .choose-text{
    font-size: 16px;
    font-weight: bold;
    margin-left: 10px;
    .orange-text{
      color: #C31725;
      margin-left: 3px;
    }
  }
  .flowLeft{
    margin-top: 50px;
    height: 100%;
    float: left;
  }
  .flowRight{
    float: left;
    padding-left: 15px;
    width: 700px;
    .searchBar{
      width: 100%;
      margin-top: 50px;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      padding-bottom: 20px;
      .left-btn{
      }
    }
  }
  /deep/ .table_wrap{
    min-width: 700px;
    /deep/ .table_list tr td{
      text-align: center !important;
    }
  }
}
</style>

