<template>
  <slide-panel :width="1000" :show="show" @changeShow="hide">
  <div>
    <p class="title">还款申请</p>
    <div class="mt20">
      <div class="top_bar">
        <div class="lef_bar">
          <div class="btn-line">
            <div class="btn"  @click="comfirmRepay('comfirm')" v-if="status == '2'" v-perm="'loanRepayConfirm'">确认还款</div>
            <span class="borderLine"  v-if="status == '2'"></span>
            <div class="btn"  @click="comfirmRepay('reject')" v-if="status == '2'" v-perm="'loanRepayConfirm'">驳回</div>
          </div>
          <search-head-bar :currBelong="currBelong" @chose="choseStatus" :searchValue="status"></search-head-bar>
        </div>
        <div class="searchBox">
          <input placeholder="搜索" class="inputSearchBox" type="text" v-model="searchValueTitle" @keyup.enter="getListData">
          <input class="submitSearchBtn" type="button" @click="getListData">
        </div>
      </div>
      <div class="mt20">
        <data-table :headData="headData" :dataList="dataList"></data-table>
        <page :pageData="pageSetting" @change="pageChage"></page>
      </div>
    </div>
  </div>
    <!--操作弹窗-->
    <defaultMsgBox :title="msgTitle" :alertShow.sync="msgShow" zzIndex="100">
      <div slot="body">
        <div v-if="isMulti">{{msgBoxTip}}</div>
        <div v-else>
          <div class="comfirm_tip">是否确认从<strong>{{confirm.loanPersonName}}</strong>收到还款 <strong>¥{{confirm.repayMoney}}</strong>？</div>
          <div><span class="comfirm_tip_count">借款 ¥{{confirm.loanMoney}}</span><span>剩余未还 ¥{{confirm.noRepay}}</span></div>
        </div>
      </div>
      <customBtn :customBtnList="customBtnList" slot="footer"></customBtn>
    </defaultMsgBox>
  </slide-panel>
</template>
<script>
  import * as debit from "@/module/approve/api/reimbursement/debit";
  import slidePanel from "../components/debit/slidePanel";
  import searchHeadBar from "../components/debit/searchHeadBar";
//  import dataTable from "@/components/list/dataTable";
  import dataTable from '@/components/Table/dataTable.vue';
  import page from '@/components/list/page';
  import defaultMsgBox from "../components/debit/defaultMsgBox"
  import customBtn from "../components/debit/customBtn"
  import { permission,format } from "@/module/approve/js/common";
  export default {
    name:'applyRepayList',
    components: {
      slidePanel,
      searchHeadBar,
      dataTable,
      page,
      defaultMsgBox,
      customBtn
    },
    props:{
      show:{
        type:Boolean,
        default:false
      },
      payApplyNum:{
        type:[Number,String],
        default:0
      }
    },
    data() {
      return {
        searchValueTitle:'', //借款内容搜索
        status:'2',
        currBelong:[{text:'待确认还款',value:'2'},{text:'驳回还款',value:'4'},{text:'已确认还款',value:'6'}],
        // 表格
        checkedIds:'',
        headData:{
          left: {
            id:'repayId',
            show: true,
            checkFunc:(checkAll,checkList) => {
              let arr = [];
              let checkNum = 0;
              checkList.map(item => {
                item.isChecked? arr.push(item.id) : checkNum++;

              });
              this.checkedIds = arr.join(',');
              console.log(this.checkedIds);
            }
          },
          middle: [  //头部栏设置
            {title: "借款单编号",key: "loanNo",width: 150},
            {title: "借款主题",key: "title",width: 150},
            {title: "借款人",key: "createPersonName",width: 75},
            {title: "所属部门",key: "deptName",width: 120},
            {title: "借款金额",
              key: "loanMoney",
              width: 90,
              style:{
              'font-weight':700,
              'text-align':'right'
              }
            },
            {title: "借款日期",key: "loanDate",width: 100},
            {title: "还款金额",
              key: "repayMoney",
              width: 90,
              style:{
                'font-weight':700,
                'text-align':'right'
              }
            },
            {title: "还款日期",key: "createTime",width: 160},
            {title: "还款状态",key: "status",width: 80,}
          ],
          right: {
            isShowOperate: true
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
        operationList:[],//操作按钮
        msgTitle:'提示',
        msgShow:false,
        customBtnList:[{label:'确定',callBack:()=>{ this.msgShow = false;}}],
        msgBoxTip:'',
        isMulti:true,
        confirm:{
          loanPersonName:'',
          repayMoney:'',
          loanMoney:'',
          noRepay:''
        }
      }
    },
    created(){
//      this.getListData();
    },
    watch:{
      show(val){
        if(val){
          this.getListData();
        }
      }
    },
    methods: {
      hide(){
        this.$emit('closeRepayList')
      },
      //初始化弹窗
      initMsgBox(){
        this.isMulti = true;
        this.msgTitle = '提示';
        this.msgBoxTip = '';
        this.msgShow = true;
        this.customBtnList=[{label:'确定',customBtnClass:'orangeBtn',callBack:()=>{ this.msgShow = false;}}];
      },
      //列表数据
      getListData(){
        var params={
          status:this.status,
          keyword:this.searchValueTitle,  //借款主题和借款人
        }
        var jsonData = JSON.stringify(params);
        var postData={
          searchValue:jsonData,
          pageSize:this.pageSize,
          page:this.page,
        }
        dataBase.loading=true;
        debit.ajaxSearchRepay(postData).then(res=>{
          if(res.code == '0'){
            let _this = this;
            _this.pageSetting.pageSize = _this.pageSize;
            _this.pageSetting.maxPage = res.data.maxPage;
            _this.pageSetting.page = res.data.currPage;
            _this.pageSetting.totalRows = res.data.totalRows;
            if(res.data.pageData){
              var list = res.data.pageData;
              list.forEach(function (item,index) {
                list[index].operationList = [];
                let viewDetail,comfirmRepayList,comfirmRepay,undoRejectList,comfirmed = {};
                permission('loanDetail')? viewDetail = {text:'查看详情',forbidden:false,operationFunc:()=>{_this.viewDetail(item.loanId)}}: viewDetail = {};
                permission('loanRepayConfirm')? comfirmRepayList = {text:'确认还款',forbidden:false,operationFunc:()=>{_this.comfirmRepayList(item)}}: comfirmRepayList = {};
                permission('loanRepayConfirm')? comfirmRepay = {text:'驳回',forbidden:false,operationFunc:()=>{_this.comfirmRepay('reject',item)}}: comfirmRepay = {};
                permission('loanRepayConfirm')? undoRejectList = {text:'撤销驳回',forbidden:false,operationFunc:()=>{_this.undoRejectList(item)}}: undoRejectList = {};
                comfirmed = {text:'已确认还款',forbidden:true};

                if(item.repayStatus == 2){//待确认
                  list[index].operationList.push(viewDetail,comfirmRepayList,comfirmRepay);
                }else if(item.repayStatus == 4){//驳回还款
                  list[index].operationList.push(viewDetail,undoRejectList);
                }else{//已确认
                  list[index].operationList.push(viewDetail,comfirmed);
                }
                if(list[index].createTime > list[index].repayDate && list[index].surplusMoney>0){
                  list[index].key='createTime';
                  list[index].style = {
                    color:'#F76161',
                  };
                }
              })
              _this.dataList = list;
            }else {
              _this.dataList = [];
            }
          }else {
            this.initMsgBox();
            this.msgBoxTip = res.desc;
          }
          dataBase.loading=false;
        }).catch(err => {
          dataBase.loading=false;
          this.initMsgBox();
          this.msgBoxTip = '网络错误';
        });
      },
      //查看详情
      viewDetail(id){
        this.$emit('viewDetail',id)
      },
      //确认、驳回还款
      comfirmRepay(type,item){
        this.initMsgBox();
        this.isMulti = true;
        if(!this.checkedIds && !item){
          if(type == 'comfirm'){
            this.msgBoxTip = "请选择要确认的单据";
          }else if(type == 'reject'){
            this.msgBoxTip = "请选择要驳回的单据";
          }
          return;
        }else {
          let tipStr = '';
          let btnStr = '';
          let status = '';
          if(type == 'comfirm'){//确认
            tipStr = '是否确认已收到还款？';
            btnStr = '确认还款';
            status = 6;
          }else if(type == 'reject'){//驳回
            tipStr = '是否确认驳回还款？';
            btnStr = '驳回';
            status = 4;
          }
          this.msgShow = true;
          this.msgTitle = '提示';
          this.msgBoxTip = tipStr;
          let self = this;
          this.customBtnList =[
            {label:btnStr,customBtnClass:'orangeBtn',callBack:()=>{
              let repayId = item&&item.repayId? item.repayId:this.checkedIds;
              let params={
                ids: repayId,
                status:status,
                reason:''
              }
              console.log(params);
              this.postComfirm(params);
              this.msgShow = false;
            }},
            {label:'取消',callBack:()=>{this.msgShow = false;}}
          ]
        }
      },
      //列表操作列确认、驳回
      comfirmRepayList(item){
        this.confirm.loanPersonName = item.createPersonName;
        this.confirm.repayMoney = item.repayMoney;
        this.confirm.loanMoney = item.loanMoney;
        this.confirm.noRepay = item.surplusMoney;
        this.isMulti = false;
        this.msgTitle = '提示';
        this.msgShow = true;
        this.customBtnList =[
          {label:'确认还款',customBtnClass:'orangeBtn',callBack:()=>{
            let params={
              ids: item.repayId,
              status:6,
              reason:''
            }
            this.msgShow = false;
            this.postComfirm(params);
          }},
          {label:'驳回还款',callBack:()=>{
            let params={
              ids: item.repayId,
              status:4,
              reason:''
            }
            this.msgShow = false;
            this.postComfirm(params);
          }},
          {label:'取消',callBack:()=>{this.msgShow = false;}}
        ]
      },
      //确认、驳回请求借口
      postComfirm(params){
        debit.confirmRepay(params).then(res => {
          if (res.code == '0') {
            dataBase.top_alert('操作成功',true,3000);
            debit.ajaxGetRepayCount().then(res=>{
              if(res.code == '0'){
                this.$emit('update:payApplyNum',res.data.count);
              }
            })
            this.getListData();
            this.msgBoxTip = res.desc;
          } else {
            this.initMsgBox();
            this.msgBoxTip = res.desc;
          }
        }).catch(err => {
          this.initMsgBox();
          this.msgBoxTip = '网络错误';
        });
      },
      //列表操作列撤销驳回
      undoRejectList(item){
        this.confirm.loanPersonName = item.createPersonName;
        this.confirm.repayMoney = item.repayMoney;
        this.confirm.loanMoney = item.loanMoney;
        this.confirm.noRepay = item.surplusMoney;
        this.isMulti = false;

        this.msgShow = true;
        this.msgTitle = '撤销驳回';
        this.customBtnList =[
          {label:'确认',customBtnClass:'orangeBtn',callBack:()=>{
            let repayId = this.checkedIds;
            let params={
              repayId: item.repayId,
            }
            this.msgShow = false;
            debit.rejectCancel(params).then(res => {
              this.isMulti = true;
              if (res.code == '0') {
                dataBase.top_alert('操作成功',true,3000);
                this.getListData();
              } else {
                this.initMsgBox();
                this.msgBoxTip = res.desc;
              }
            }).catch(err => {
              this.initMsgBox();
              this.msgBoxTip = '网络错误';
            });
          }},
          {label:'取消',callBack:()=>{this.msgShow = false;}}
        ]
      },
      //单据状态
      choseStatus(val){
        this.checkedIds = '';
        this.status = val.value;
        this.getListData();
      },
      // 页码组件回调函数
      pageChage(page,pageSize){
        this.page = page;
        this.pageSize = pageSize || 10;
        this.checkedIds = '';
        this.getListData();
      },

    }
  }
</script>
<style scoped>
  .borderLine {
    margin: 0 8px 0 5px;
    border-right: 1px dashed #cfcfcf;
  }
  .title{
    font-size:22px;
    color: #333;
  }
  .top_bar {
    display: flex;
    justify-content: space-between;
  }
  .top_bar .btn {
    border: 1px solid #ccc;
  }
  .btn-line{
    height: 32px;
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
    background: url(../../../../../assets/images/search_icon.png) no-repeat center center;
    border: none;
    border-left: 1px solid #ccc;
  }
  .comfirm_tip{
    font-size: 17px;
  }
  .comfirm_tip_count{
    margin-right: 10px;
  }
</style>
