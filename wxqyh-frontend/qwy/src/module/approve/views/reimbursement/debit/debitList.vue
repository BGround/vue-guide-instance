<template>
  <div class="mt20">
    <div class="top_bar clearfix">
      <div class="lef_bar">
        <div class="btn"  @click="exportReportForm('','loan')" v-perm="'loanExport'">导出</div>
        <!--<div class="btn ml5"  @click="printDebit">打印</div>-->
        <span class="borderLine"  v-if="checkedIds"></span>
        <div class="btn" @click="deleteData()" v-if="checkedIds" v-perm="'loanDelete'">删除</div>
        <span class="borderLine"  v-if="status == 4 || status == 7"></span>
        <div class="btn"  @click="transferMoney()"  v-if="status == 4 || status == 7" v-perm="'loanTransfer'">转账</div>
        <span class="borderLine"  v-if="status == 5"></span>
        <div class="btn"  @click="remindRepay()"  v-if="status == 5">提醒还款</div>
        <span class="borderLine"></span>
        <div class="btn tipBtn" @click="applyRepay">还款申请<span class="tipsNum" v-if="payApplyNum">{{payApplyNum}}</span></div>
      </div>

      <div class="right_bar clearfix">
        <div class="searchBox">
          <input placeholder="搜索" class="inputSearchBox" type="text" v-model="searchValueTitle" @keyup.enter="searchTitle">
          <input class="submitSearchBtn" type="button" @click="searchTitle">
        </div>
        <i class="table_setting_icon" @click="showTablelist"></i>
        <!--显示隐藏列-->
        <div class="table_setting_list" v-if="customShow">
          <customField :customFieldList="customFieldList" @sure="sure" @cancel="cancel" ></customField>
        </div>
        <a class="form_search_btn" @click="isShowSeniorSearch = !isShowSeniorSearch">高级</a>
      </div>
      <!--高级搜索-->
      <div class="advance_com">
        <advancedScreen :screenItemList="screenItemList" :screenText="screenText" @searchResult="searchResult" v-if="isShowSeniorSearch"></advancedScreen>
      </div>
      <!--单据状态-->
      <search_head_bar :currBelong="currBelong" @chose="choseStatus" :title="'单据状态:'" v-show="!isShowSeniorSearch" :searchValue="status"></search_head_bar>
    </div>
    <div class="mt20">
      <!--列表-->
      <data-table :headData="headData" :dataList="dataList"></data-table>
      <!--分页-->
      <page :pageData="pageSetting" @change="pageChage"></page>
    </div>
    <!--还款申请列表-->
    <apply_repay :show="applyRepayListShow" @closeRepayList="closeRepayList" @viewDetail="viewDetail" :payApplyNum.sync="payApplyNum"></apply_repay>
    <!--借款单详情-->
    <detail :show="detailShow" :loanId="refId" @onHide="detailShow = false" @operation="operation"></detail>
    <!--操作弹窗-->
    <defaultMsgBox :title="msgTitle" :alertShow.sync="msgShow" zzIndex="100">
      <div slot="body">
        <div class="transTip">您正在进行确认转账操作，点击“确认转账”修改转账状态为“待还款”并向借款人发送转账通知</div>
        <div class="mt10">
          <input type="checkbox" @click="setWxTransfer" :checked="wxIsChecked" :disabled="checkDisabled">
          <span class="ml5">微信转账：开启后系统将同步把借款金额转到借款人账号</span>
          <i class="fa-question-circle">
            <div class="tipsItem">
              <div class="tipsContent" style="height: 40px">您没有开启借款转账功能，无法进行微信自动转账。请进入设置-开启借款转账开关。</div>
            </div>
          </i>
        </div>
      </div>
      <customBtn :customBtnList="customBtnList" slot="footer"></customBtn>
    </defaultMsgBox>
  </div>
</template>
<script>
  import * as debit from "@/module/approve/api/reimbursement/debit";
  import search_head_bar from "../components/debit/searchHeadBar";
  import advancedScreen from "@/components/Screen/AdvancedScreen/AdvancedScreen";
  import dataTable from '@/components/Table/dataTable.vue';
  import apply_repay from "./applyRepayList";
  import detail from "./debitListDetail"
  import defaultMsgBox from "../components/debit/defaultMsgBox"
  import customBtn from "../components/debit/customBtn"
  import page from '@/components/list/page';
  import customField from '@/components/Table/CustomField/CustomField.vue';
  import exportReportForm from '@/assets/js/export/export.js';//导出
  import { permission,format } from "@/module/approve/js/common";
  import {  mapGetters } from "vuex";
//  import {  mapGetters } from 'vuex';
  export default {
    name: 'debitList',
    mixins:[exportReportForm],
    components: {
      search_head_bar,
      dataTable,
      page,
//      operation,
      apply_repay,
      advancedScreen,
      detail,
      customField,
      defaultMsgBox,
      customBtn
    },
    computed: {
      ...mapGetters("advancedScreen", ["advancedScreenData"]),
    },
    data() {
      return {
        refId:'',//当前点击数据的id
        showTips:true,  //是否显示提醒还款按钮
        showTransfer:true,  //是否显示转账按钮
        payApplyNum:'',  //还款申请条数
        showPayNum:true,  //是否显示还款申请数目
        applyRepayListShow:false,  //是否显示还款申请列表
        detailShow:false,//是否显示详情
        /*currBelong:[{text:'全部',value:''},{text:'待转账',value:7},{text:'待还款',value:1},{text:'已还款',value:2},
                    {text:'已取消',value:3},{text:'审批中',value:4},{text:'已退审',value:5},{text:'转账失败',value:6},],*/
//        showStatusSearch:true,  //是否显示单据状态
        status:'',//单据状态
        searchValueTitle:'', //借款内容搜索
        isShowSeniorSearch:false, //是否展示高级搜索
        currBelong:[{text:'全部',value:''},{text:'审批中',value:'1'},{text:'已审批',value:'4'},{text:'待还款',value:'5'},
                    {text:'已还款',value:'6'},{text:'已取消',value:'2'},{text:'已退审',value:'3'},{text:'转账失败',value:'7'}],

        //操作弹窗
        msgTitle:'操作',
        msgShow:false,
        customBtnList:[{label:'确定',customBtnClass:'orangeBtn',callBack:()=>{}},{label:'取消',callBack:()=>{}}],

        //操作
        operationList:[],
        customFieldList:[],//列表显示隐藏列
        customShow:false, //是否显示列选择
        checkedIds:'',//选中行id
        // 表格
        headData:{
          left: {
            id:'loanId',
            show: true,
            checkFunc:(checkAll,checkList) => {
              let arr = [];
              let checkNum = 0;
              checkList.map(item => {
                item.isChecked? arr.push(item.id) : checkNum++;

              });
              this.checkedIds = arr.join(',');
            }
          },
          middle: [],
          right: {
            isShowOperate: true,
            width:70,
          }
        },
        dataList:[],  // 表格数据
        // 页码
        page: 1,  // 页码,
        pageSize: 10,  // 数据条数
        pageSetting: { // 页码设置
          page: 1,
          pageSize: 10,
          maxPage: 1,
          totalRows: 0
        },
        //高级搜索
        screenText:'高级',
        screenItemList:[
          {
            type:'text',
            name:'借款单编号',
            modelName:'loanNo',
          },
          {
            type:'text',
            name:'借款主题',
            modelName:'title',
          },
          {
            type:'text',
            name:'借款人',
            searchUrl:'',
            modelName:'creator',
            searchObj:{
              searchUrl:'/contact/contactAction!ajaxSearchUserByPersonName.action',
              type:'user',
              params:{
                keyWord: '',
                pageSize: 10
              }
            },
          },
          {
            type:'select',
            name:'单据状态',
            dataList:[
              {text:'全部',value:''},{text:'审批中',value:'1'},{text:'已审批',value:'4'},{text:'待还款',value:'5'},
              {text:'已还款',value:'6'},{text:'已取消',value:'2'},{text:'已退审',value:'3'},{text:'转账失败',value:'7'}
            ],
            defaultValue:'',
            modelName:'status',
          },
          {
            type:'time',
            name:'借款日期',
            defaultValue:[],
            modelName:'loanDate',
          },
          {
            type:'time',
            name:'还款日期',
            defaultValue:[],
            modelName:'repayDate',
          },
          {
            type:'text',
            name:'所属部门',
            searchUrl:'',
            modelName:'departmentName',
            searchObj:{
              searchUrl:'/contact/contactAction!ajaxSearchDeptByDeptName.action',
              type:'dept',
              params:{
                keyWord: '',
                pageSize: 10
              }
            },
          },
          {
            type:'text',
            name:'当前节点',
            searchUrl:'',
            modelName:'nodeName',
          },
          {
            type:'text',
            name:'当前处理人',
            searchUrl:'',
            modelName:'curProcessName',
            searchObj:{
              searchUrl:'/contact/contactAction!ajaxSearchUserByPersonName.action',
              type:'user',
              params:{
                keyWord: '',
                pageSize: 10
              }
            },
          },
          {
            type:'text',
            name:'最后处理人',
            searchUrl:'',
            modelName:'closePersonName',
            searchObj:{
              searchUrl:'/contact/contactAction!ajaxSearchUserByPersonName.action',
              type:'user',
              params:{
                keyWord: '',
                pageSize: 10
              }
            },
          },
          {
            type:'text',
            name:'流程名称',
            searchUrl:'',
            modelName:'flowName',
          },
          //先隐藏打印相关部分
          /*{
            type:'select',
            name:'打印状态',
            dataList:[
              {
                text:'全部',
                value:'',
              },
              {
                text:'未打印',
                value:'0',
              },
              {
                text:'已打印',
                value:'1',
              },
            ],
            defaultValue:'',
            modelName:'printState',
          },*/
          {
            type:'time',
            name:'审批时间',
            defaultValue:[],
            modelName:'closeTime',
            timeHandler:(startTime,endTime)=> {
              this.exportCloseStartTime = startTime;
              this.exportCloseEndTime = endTime;
            }
          },

          {
            type:'time',
            name:'创建时间',
            defaultValue:[],
            modelName:'createTime',
            timeHandler:(startTime,endTime)=> {
              this.exportStartTime = startTime;
              this.exportEndTime = endTime;
            }
          },
        ],
        wxIsChecked:false,//微信转账
        checkDisabled:true,
        rankList:[], //列

        serchData:{},
        //导出创建时间
        exportStartTime:'',
        exportEndTime:'',
        //导出审批时间
        exportCloseStartTime:'',
        exportCloseEndTime:''
      }
    },
    created(){
      debit.ajaxGetRepayCount().then(res=>{
        if(res.code == '0'){
          this.payApplyNum = res.data.count;
        }
      })
    },
    updated(){

    },
    mounted(){
      this.getListItem();
    },
    methods: {
      //显示隐藏的列表列
      showTablelist(){
        this.customShow = !this.customShow;
      },
      //获取显示隐藏列数据，匹配表格显示列
      getListItem(){
        this.customFieldList = [];
        this.headData.middle = [];
        dataBase.loading=true;
        debit.loanRankList().then(res=>{
          if(res.code == 0){
            this.rankList = res.data.loanRankList || [];
            this.rankList.forEach(item=>{
              this.customFieldList.push({
                key:item.rank,
                text:item.rankName,
                isChecked:item.type == 1?true:false,
                isDisabled:item.readOnly !== 1 ? true :false,
              });
              //表格头部显示列
              if(item.type == 1){
                let obj = {
                  title: item.rankName,
                  key: item.rank,
                  width: 100,
                  textAlign: 'center'
                }
                //主题列点击单元格可跳详情
                if(item.rank === 'title'){
                  let isPermission = permission('loanDetail');
                  obj.width = 200;
                  obj.textAlign = 'left';
                  isPermission?obj.skip={
                    skipFunc: (item) => {  //点击跳转的回调函数
                      this.refId=item.loanId;
                      this.detailShow=true;
                    }
                  }:obj.skip={};
                }

                //先隐藏关于打印的部分
                if(item.rank === 'printState'){
                  obj = {};
                }

                if(item.rank === 'createTime' || item.rank === 'closeTime'){obj.width = 160;}
                if(item.rank.indexOf('Money')>-1){
                  obj.style={
                    'font-weight':700,
                    'text-align':'right'
                  }
                }
                this.headData.middle.push(obj);
              }
            })
            this.getListData(self.serchData);
          }else {
            _.alert('提示',res.desc);
            dataBase.loading=false;
          }
        }).catch(err=>{
          dataBase.loading=false;
        })
      },
      //保存显示隐藏列
      sure(data){
        debit.saveLoanRank({searchRank:data.join('|')}).then(res=>{
          if(res.code == 0){
            this.getListItem();
          }else {
            _.alert('提示',res.desc);
          }
        }).catch(err=>{
          _.alert('提示','网络错误');
        })
        this.customShow = false;
      },
      cancel(){
        this.customShow = false;
      },
      operation(name,loanId){ //404
        if(name=='remindRepayment'){//提醒还款
          this.remindRepay(loanId);
        }else if(name=='printing'){//打印
          this.printDebit(loanId);
        }else if(name=='export'){//导出
          this.exportFile(loanId,'loan_detail');
        }else if(name=='delete'){//删除
          this.deleteData(loanId);
        }else if(name=='transferAccounts'){//转账
          this.transferMoney(loanId);
        }
      },
      //单据状态
      choseStatus(item){
        this.status = item.value;
        let params = {status:this.status,keyword:this.searchValueTitle};
        this.page = 1;
        this.serchData=Object.assign({}, params);
        this.getListData(this.serchData);
        this.checkedIds = '';
      },
      //内容搜索
      searchTitle(){
        let params = {keyword:this.searchValueTitle,status:this.status};
        this.page = 1;
        this.serchData=Object.assign({}, params);
        this.getListData(this.serchData);
      },
      //高级搜索
      searchResult(data){
        this.status = data.status;

        var params={
          creator: data.creator.personName || data.creator,//借款人名稱
          userId: data.creator.userId,  //借款人ID
          startTime: data.createTime[0], //创建开始时间YYYY-MM-DD
          endTime: data.createTime[1],//创建结束时间
          flowName: data.flowName,  //流程名称
          nodeName: data.nodeName,  //当前节点
          departmentName: data.departmentName.departmentName || data.departmentName,  //所属部门
          loanStartDate: data.loanDate[0], //借款日期
          loanEndDate: data.loanDate[1], //借款日期
          repayStartDate: data.repayDate[0], //还款日期
          repayEndDate: data.repayDate[1], //还款日期
          loanNo: data.loanNo,  //借款单编号
          title: data.title,  //借款主题
          status:data.status,  //单据状态
          printState: data.printState,  //打印状态
          closeStartTime: data.closeTime[0],  //审批开始时间
          closeEndTime: data.closeTime[1], //审批结束时间
          curProcessName: data.curProcessName.personName || data.curProcessName,    //当前处理人
          closePersonName: data.closePersonName.personName || data.closePersonName,  //最后处理人
        }
        this.serchData=Object.assign({}, params);
        this.getListData(params);
        this.checkedIds = '';
      },
      //获取借款列表数据
      getListData(data){
        var jsonData = JSON.stringify(data);
        var postData={
          searchValue:jsonData,
          pageSize:this.pageSize,
          page:this.page,
        }
        dataBase.loading=true;
        debit.ajaxSearchLoan(postData).then(res=>{
          if(res.code == '0' && this.headData.middle.length){
            let _this = this;
            _this.pageSetting.pageSize = _this.pageSize;
            _this.pageSetting.maxPage = res.data.maxPage;
            _this.pageSetting.page = res.data.currPage;
            _this.pageSetting.totalRows = res.data.totalRows;
            var list = res.data.pageData;
            if(res.data.pageData){
              var currentDate = Date.parse(new Date());
              list.forEach(function (item,index) {
                var repayDate= Date.parse(list[index].repayDate);
                if(item.status == 5 && repayDate < currentDate && list[index].surplusMoney>0){
                  list[index].key='repayDate';
                  list[index].style = {
                    color:'#F76161',
                  };
                }
                _this.operationListData(item);
                list[index].operationList = _this.operationList;

                item.printState == 0 ? list[index].printState = '未打印': list[index].printState = '已打印';
                if(item.status == 1 || item.status == 2 || item.status == 3 || item.status == 4 || item.status == 7  ){
                  list[index].repayMoney = '-';
                  list[index].surplusMoney = '-';
                }
              })
              _this.dataList = list;
            }else{
              _this.dataList = [];
            }
          }else {
            _.alert('提示',res.desc);
          }
          dataBase.loading=false;
        }).catch(err => {
          dataBase.loading=false;
//          _.alert('提示','网络错误');
        });
      },
      operationListData(item){//按不同情况加不同操作按钮
        let _this = this;
        _this.operationList = [];
        let detail,transfer,exportReport,deleteData,remind,print = {};

        permission('loanDetail')? detail = {text:'查看详情',forbidden:false,operationFunc:()=>{_this.refId=item.loanId;_this.detailShow=true}}:detail = {};
        permission('loanTransfer')? transfer = {text:'转账',forbidden:false,operationFunc:()=>{_this.transferMoney(item.loanId)}}:transfer = {};
        permission('loanExport')? exportReport = {text:'导出',forbidden:false,operationFunc:()=>{_this.exportReportForm(item,'loan_detail')}}:exportReport = {};
        permission('loanDelete')? deleteData = {text:'删除',forbidden:false,operationFunc:()=>{_this.deleteData(item.loanId)}}:deleteData = {};
        remind = {text:'提醒还款',forbidden:false,operationFunc:()=>{_this.remindRepay(item.loanId)}};
//      print = {text:'打印',forbidden:false,operationFunc:()=>{_this.printDebit(item.loanId)}};
        if(item.status == 4 || item.status == 7){//待转账、已审批
          _this.operationList.push(detail,transfer,exportReport,deleteData);
        }else if(item.status == 5){//待还款
          _this.operationList.push(detail,remind,exportReport,deleteData);
        }else{
          _this.operationList.push(detail,exportReport,deleteData);
        }
        return _this.operationList;
      },
      // 导出
      exportReportForm(item,type){
        let startTime = this.exportStartTime || this.exportCloseStartTime;
        let endTime = this.exportEndTime || this.exportCloseEndTime;
        if(item.loanId){
          this.exportFile(item.loanId,type);
        }else {
          if(startTime==""||endTime==""){
            dataBase.top_alert('请在【高级搜索】设置导出数据的创建时间段或审批时间段',false,3000);
            return;
          }else{
            if(this.exportDaysLimitByMonthCounts(startTime,endTime)){
              this.exportFile(item.loanId,type);
            }
          }
        }
      },
      //导出单据
      exportFile(loanId,type){
        this.updateExportParams(type);
        if(this.pageSetting.totalRows>0){
          var searchParams={};
          searchParams = Object.assign(searchParams, this.exportParams);
          searchParams['searchValue.loanId']= loanId;
          this._createReport(searchParams);
        } else{
          dataBase.top_alert('搜索结果为空，不支持导出',false,3000);
        }
      },
      updateExportParams(type){
        let exportObj = JSON.parse(JSON.stringify(this.advancedScreenData));
        exportObj.startTime = exportObj.createTime&&exportObj.createTime[0]?format(exportObj.createTime[0],'day')+' 00:00:00':'';
        exportObj.endTime = exportObj.createTime&&exportObj.createTime[1]?format(exportObj.createTime[1],'day')+' 23:59:59':'';
        exportObj.loanStartDate = exportObj.loanDate&&exportObj.loanDate[0]?format(exportObj.loanDate[0],'day')+' 00:00:00':'';
        exportObj.loanEndDate = exportObj.loanDate&&exportObj.loanDate[1]?format(exportObj.loanDate[1],'day')+' 23:59:59':'';
        exportObj.repayStartDate = exportObj.repayDate&&exportObj.repayDate[0]?format(exportObj.repayDate[0],'day')+' 00:00:00':'';
        exportObj.repayEndDate = exportObj.repayDate&&exportObj.repayDate[1]?format(exportObj.repayDate[1],'day')+' 23:59:59':'';
        exportObj.closeStartTime = exportObj.closeTime&&exportObj.closeTime[0]?format(exportObj.closeTime[0],'day')+' 00:00:00':'';
        exportObj.closeEndTime = exportObj.closeTime&&exportObj.closeTime[1]?format(exportObj.closeTime[1],'day')+' 23:59:59':'';

        this.exportParams = {
          'searchValue.creator': exportObj.creator ? (exportObj.creator.personName || exportObj.creator) : '',
          'searchValue.userId': exportObj.creator ? exportObj.creator.userId : '',
          'searchValue.startTime':exportObj.startTime ? exportObj.startTime : '',
          'searchValue.endTime': exportObj.endTime ? exportObj.endTime : '',
          'searchValue.flowName': exportObj.flowName ? exportObj.flowName : '',
          'searchValue.nodeName': exportObj.nodeName ? exportObj.creator : '',
          'searchValue.departmentName': exportObj.departmentName ? (exportObj.departmentName.departmentName || exportObj.departmentName) : '',
          'searchValue.loanStartDate': exportObj.loanStartDate ? exportObj.loanStartDate : '',
          'searchValue.loanEndDate': exportObj.loanEndDate ? exportObj.loanEndDate : '',
          'searchValue.repayStartDate': exportObj.repayStartDate ? exportObj.repayStartDate : '',
          'searchValue.repayEndDate': exportObj.repayEndDate ? exportObj.repayEndDate : '',
          'searchValue.loanNo': exportObj.loanNo ? exportObj.loanNo : '',
          'searchValue.title': exportObj.title ? exportObj.title : '',
          'searchValue.status':exportObj.status ? exportObj.status : '',
          'searchValue.printState': exportObj.printState ? exportObj.printState : '',
          'searchValue.closeStartTime': exportObj.closeStartTime ? exportObj.closeStartTime : '',
          'searchValue.closeEndTime': exportObj.closeEndTime ? exportObj.closeEndTime : '',
          'searchValue.curProcessName': exportObj.curProcessName ? (exportObj.curProcessName.personName || exportObj.curProcessName): '',
          'searchValue.closePersonName': exportObj.closePersonName ? (exportObj.closePersonName.personName || exportObj.closePersonName) : '',
//          'belongAgent': dataBase.agentCode,
          'reportType': type
        }
      },
      //还款申请
      applyRepay(){
        this.applyRepayListShow = true;
      },
      closeRepayList(){
        this.applyRepayListShow = false;
      },
      //打印单据
      printDebit(){
        alert('打印')
      },
      //列表删除数据
      deleteData(id){
        if(!this.checkedIds && !id){
          _.alert('提示','请选择要删除的数据');
          return;
        }else {
          _.alert('提示', '删除借款信息会无法恢复，请确认是否要删除？',() => {
            let ids = id ? id:this.checkedIds;
            debit.ajaxDelLoan({ids:ids}).then(res => {
              if (res.code == '0') {
                dataBase.top_alert('删除成功',true,3000);
                this.checkedIds = '';
                this.getListData(this.serchData);
                this.detailShow = false;
              } else {
                _.alert('提示', res.desc);
              }
            }).catch(err => {
              _.alert('提示', '网络错误');
            });
          })
        }
      },
      //提醒还款
      remindRepay(id){
        if(!this.checkedIds && !id){
          _.alert('提示','请选择要提醒还款的单据');
          return;
        }else {
          _.alert('提示', '发送提醒还款消息?',() => {
            debit.remindRepayment({ids: id?id:this.checkedIds}).then(res => {
              if (res.code == '0') {
                dataBase.top_alert('发送成功',true,3000);
              } else {
                _.alert('提示', res.desc);
              }
            }).catch(err => {
              _.alert('提示', '网络错误');
            });
          })
        }
      },
      //是否开启维信转账
      setWxTransfer(event){
        if(event.target.checked){
          this.wxIsChecked = true;
        }else {
          this.wxIsChecked = false;
        }
      },
      //转账
      transferMoney(id){
        if(!this.checkedIds && !id){
          _.alert('提示','请选择要确认的数据');
          return;
        }else {
          //判断是否设置微信转账，是则可以勾选，否则不可勾选
          debit.getLoanBaseSetting().then(res=>{
            if(res.code == '0'){
              if(res.data.loanSetting.openWx == 1){//开启微信转账0 不开启 1-开启
                this.wxIsChecked =true;
                this.checkDisabled = false;
              }else {
                this.checkDisabled = true;
                this.wxIsChecked = false;
              }
            }else {
              _.alert('提示', res.desc);
            }
          });


          let ids = id ? id:this.checkedIds;
          let isOnly = id ? true:false;
          this.msgTitle = "提示";
          this.msgShow = true;
          let self = this;
          this.customBtnList =[
            {label:'确认转账',customBtnClass:'orangeBtn',callBack:()=>{
              var params = {
                ids: ids,
                openWxTransfer: self.wxIsChecked? 1:0//是否需要微信转账
              }
              dataBase.loading=true;
              debit.confirmTransfer(params).then(res => {
                if (res.code == '0') {
                  let isErro = res.data.isErro;
                  let erroInfo = res.data.erroInfo;
                  if(isOnly){//单条记录
                    if(!self.wxIsChecked){//不开启微信转账
                      _.alert("提示","已成功修改转账状态为“待还款”并将转账通知发送给借款人。");
                    }else{//开启微信转账
                      if(isErro){//有转账失败
                        _.alert("提示","微信转账失败，失败原因："+erroInfo);
                      }else{
                        _.alert("提示","微信转账成功，已修改借款单状态为“待还款”并将转账通知发送给借款人。");
                      }
                    }
                  }else {//批量转账
                    let transferSize = res.data.transferSize;
                    if(!self.wxIsChecked){//不开启微信转账
                      _.alert("提示","操作成功，应处理"+transferSize+"张借款单，已成功处理"+transferSize+"张转账单，已全部修改转账状态为“待还款”，转账通知已发送给相应借款人。")
                    }else{//开启微信转账
                      let transferSumMoney = res.data.transferSumMoney;
                      let successSize = res.data.successSize;
                      let successMoney = res.data.successMoney;
                      if(isErro){//有转账失败
                        let erroSize = res.data.erroSize;
                        let erroMoney = res.data.erroMoney;
                        _.alert("提示","操作失败，此次转账应处理"+transferSize+"张转账单，应转"+transferSumMoney+"元，实际成功处理"+successSize+"张转账单，共"+successMoney+"元；转账失败"+erroSize+"张转账单，共"+erroMoney+"元，转账失败原因是："+erroInfo);
                      }else{
                        _.alert("提示","操作成功，此次转账应处理"+transferSize+"张转账单，应转"+transferSumMoney+"元，实际成功处理"+successSize+"张转账单，转账"+successMoney+"元，全部转账成功，转账通知发送给相应借款人");
                      }
                    }
                  }

                  this.checkedIds = '';
                  this.getListData(this.serchData);
                } else {
                  _.alert('提示', res.desc);
                }
                dataBase.loading=true;
              }).catch(err => {
                dataBase.loading=true;
                _.alert('提示', '网络错误');
              });
              this.msgShow = false;
            }},
            {label:'取消',callBack:()=>{
              this.msgShow = false;
            }}]
        }
      },
      //还款申请列表里查看借款单详情
      viewDetail(val){
        this.refId = val;
        this.detailShow = true;
      },
      // 页码组件回调函数
      pageChage(page,pageSize){
        this.page = page;
        this.pageSize = pageSize || 10;
        this.getListData(this.serchData);
      },
    }
  }
</script>
<style scoped>
  .top_bar {

  }
  .lef_bar{
    display: inline-block;
  }
  .right_bar{
    display: inline-block;
    float: right;
  }
  .advance_com{
    margin-top: 10px;
  }
  .top_bar .btn {
    border: 1px solid #ccc;
  }
  .borderLine {
    margin: 0 8px 0 5px;
    border-right: 1px dashed #cfcfcf;
  }
  .tipBtn{
    position: relative;
  }
  .tipsNum{
    text-align: center;
    line-height: 16px;
    background-color: #F76161;
    color: #fff;
    width: 16px;
    font-size: 11px;
    height: 16px;
    display: inline-block;
    position: absolute;
    top: -8px;
    border-radius: 8px;
  }
  .searchBox{
    width: 210px;
    height: 30px;
    border-radius: 2px;
    border: 1px solid #cccccc;
    background: #fff;
    position: relative;
    display: inline-block;
  }
  .inputSearchBox{
    width: 165px;
    border: 0px solid #ffffff;
    color: #333;
    margin-left: 8px;
    line-height: 28px;
    vertical-align: top;
  }
  .submitSearchBtn{
    position: absolute;
    width: 32px;
    height: inherit;
    top: 0;
    right: 0;
    background: url(~assets/images/search_icon.png) no-repeat center center;
    border: none;
    border-left: 1px solid #ccc;
  }
  .form_search_btn{
    cursor: pointer;
    float: right;
    font-size: 14px;
    height: 40px;
    line-height: 34px;
    margin: 0 5px;
    padding: 0 15px 0 10px;
    text-align: center;
    background: #fbfbfb;
    border: 1px solid #fbfbfb;
    position: relative;
    margin-right: 0px;
    box-sizing: border-box;
    color: #f87b00;
  }
  .form_search_btn:before{
    border-color: transparent transparent #C31725;
    border-style: solid;
    border-width: 5px;
    content: "";
    right: 4px;
    position: absolute;
    top: 15px;
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
  }
  .form_search_btn:after{
    content: "";
    height: 5px;
    width: 100%;
    display: block;
    position: absolute;
    left: 0;
    bottom: -2px;
    background: #fbfbfb;
  }
  .table_setting_icon{
    position: relative;
    display: inline-block;
    margin: 10px 0 0 10px;
    float: right;
    width: 16px;
    height: 16px;
    background: url(~assets/images/reim/loan/crm_setting_icon.png) no-repeat center;
  }
  .table_setting_list{
    position: absolute;
    top: 120px;
    right: 240px;
  }
  .transTip{
    font-size: 14px;
  }
  .fa-question-circle{
    display: inline-block;
    position: relative;
    left: 5px;
    top: 3px;
    width: 16px;
    height: 16px;
    background: url(~assets/images/reim/loan/tip_important.png);
    background-size: 100%;
    cursor: pointer;
  }
  .fa-question-circle:hover .tipsItem{
    display: block;
  }
  .tipsItem{
    display: none;
    background: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    left: 30px;
    top: -10px;
    position: absolute;
    max-width: 278px;
    min-width: 278px;
    min-height: 20px;
    box-shadow: 0 0 7px rgba(0, 0, 0, 0.2);
    color: #666;
    z-index: 1223;
    text-align: left;
  }
  .tipsItem::before {
    border-color: transparent #ddd transparent transparent;
    border-style: solid;
    border-width: 8px;
    content: "";
    font-size: 20px;
    left: -16px;
    position: absolute;
    top: 9px;
  }
  .tipsContent{
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    max-height: 350px;
    overflow-y: auto;
  }
</style>
