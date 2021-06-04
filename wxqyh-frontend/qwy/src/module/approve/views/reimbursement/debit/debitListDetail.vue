<template>
  <slide-panel :width="1000" :show="show" @changeShow="hide">
    <div class="docs-body">
       <div class="clearfix">
         <p class="name" :style="{ width: (status==5 ? 730:800) + 'px'}">{{title}}  <span class="btn btn_status" :class="state_bg">{{state}}</span></p>
         <div class="more mr">
           <!--<span class="btn orangeBtn mr" v-if="status==5" @click="operation('confirmationRepayment')">确认还款</span>-->
           <span class="btn orangeBtn mr" v-if="status==5" @click="operation('remindRepayment')">提醒还款</span>
           <!--<span class="btn orangeBtn mr" @click="operation('printing')">打印</span>-->
           <span class="btn show_more" @click="showOperation">更多 <i class="icon_down" :class="{'icon_top':moreShow}"></i> </span>
           <div class="more_operation" v-show="moreShow">
             <p  @click="operation('export')">导出</p>
             <p  @click="operation('transferAccounts')" v-if="status==4 || status==7">转账</p>
             <p  @click="operation('delete')">删除</p>
           </div>
         </div>
       </div>
      <div class="tab_list">
        <span class="tab_item" :class="{'active':tabNum==1}" @click="goViewTab(1,'showBill')">单据信息</span>
        <span class="tab_item" :class="{'active':tabNum==2}" @click="goViewTab(2,'showDetail')" v-if="status==5 || status==6">借还款详情</span>
        <span class="tab_item" :class="{'active':tabNum==3}" @click="goViewTab(3,'showApproval')" v-if="status != 0 && isFree != 1">审批历史</span>
        <!--<span class="tab_item" :class="{'active':tabNum==4}" @click="goViewTab(4,'showComment')" v-if="commentCount>0">评论（{{commentCount}}）</span>-->
        <span class="tab_item" :class="{'active':tabNum==5}" @click="goViewTab(5,'showEnclosure')" v-if="mediaList.length>0 || picList.length>0">图片/附件</span>
      </div>
      <div id="detail_con">
        <!--单据信息-->
        <bill-info  v-if="tabName=='showBill'"
                    :billInfo="billInfoObj"
                    :isBeOver="isBeOver">
        </bill-info>
        <!--借还款详情-->
        <repayment-details
                           v-if="tabName=='showDetail'"
                           :repayObj="repayObj"
                           :isBeOver="isBeOver">
        </repayment-details>
        <!--审批历史-->
        <!--   <approval-history
                  v-if="tabName=='showApproval'"
                  :refId="loanId"
                  :isFree="isFree">auditSerial
           </approval-history>-->
        <approval-history
                          v-if="tabName=='showApproval'"
                          :flowSerialData="auditSerial"
                          :isover="auditSerial.isover">
        </approval-history>
        <!--  评论/回复
        <comment-list
                       v-if="tabName=='showComment'"
                       :commentList="commentList">

         </comment-list>-->
        <!--图片附件-->
        <enclosure
          v-if="tabName=='showEnclosure'"
          :mediaList="mediaList"
          :picList="picList">
        </enclosure>
      </div>

    </div>
  </slide-panel>
</template>
<script>
  import slidePanel from "../components/debit/slidePanel";
  import billInfo from "../debitDetail/billInfo";//单据信息
  import repaymentDetails from "../debitDetail/repaymentDetails";//借还款详情
  import approvalHistory from "../debitDetail/approvalHistory";//审批历史
 /* import commentList from "../debitDetail/commentList";//评论*/
  import enclosure from "../debitDetail/enclosure";//附件
  import {format,deepClone} from "@/module/approve/js/common";

  import {
    debitDetail,//详情
    getFlow,//流转明细(审批历史)
  } from "@/module/approve/api/reimbursement/debit";


  export default {
    data(){
      return{
        title:'',
        isFree:'',//流程类型
        isBeOver:false,//是否逾期
        moreShow:false,//显示更多操作框
        tabNum:1,//当前显示的tab
        tabName:'',//对应当前展示tab的页面
        status:'',//借款单状态
        operationList:[],//操作列表
        state:'',//审批状态
        state_bg:'',//不同状态的背景颜色
        billInfoObj:{},//单据信息
        repaymentObj:{},//借还款详情
        mediaList:[],//附件列表
        picList:[],  //图片列表
        repayObj:{},//借还款详情信息
       /* commentCount:0,//评论总数
        commentList:[],//评论列表*/
        auditSerial: { //流程明细(审批历史)
          list: [],
          isFreeFlow: '',
          isover: ''
        },
      }
    },
    props: {
        show:{
          type:Boolean,
          default:false,
        },
      loanId:{
        type:String,
        default:'',
      },
    },
    components:{
      slidePanel,
      billInfo,
      repaymentDetails,
      approvalHistory,
//      commentList,
      enclosure
    },
    watch : {
      show (newValue,oldValue){
        if(newValue){
          this.getDetail(this.loanId);
          this.moreShow = false;
        }
      },
    },
    created(){
//      0草稿 1审批中 2取消 3退审 4待转账 5待还款 6已还款

    },
    methods: {
      operation(name){
        this.$emit('operation',name,this.loanId);
      },
      getDetail(val){
        let _this=this;
        debitDetail({loanId:val}).then((res) => { //1772c19d6dd84bf994ba0ba42499119f
          if(res.code=='0'){
            var data=res.data.data;
            _this.title=data.title;//标题
            _this.status=data.status;//审批状态
            _this.isFree=data.isFree;
            _this.commentCount = data.commentCount;
//            _this.commentList = res.data.comments;
            _this.billInfoObj.typeName=data.typeName;//单据类型
            _this.billInfoObj.deptName=data.deptName;//所属部门
            _this.billInfoObj.loanNo=data.loanNo;//借款单编号
            _this.billInfoObj.createTime=data.createTime;//创建时间
            _this.billInfoObj.loanDate=data.loanDate;//借款日期
            _this.billInfoObj.repayDate=data.repayDate;//还款日期
            _this.billInfoObj.loanMoney=data.loanMoney;//借款金额
            _this.billInfoObj.surplusMoney=data.surplusMoney;//待还金额
            _this.billInfoObj.amountReturned=(_this.billInfoObj.loanMoney-_this.billInfoObj.surplusMoney).toFixed(2);//已还金额
            _this.billInfoObj.createPersonName=data.createPersonName;//借款人
            _this.billInfoObj.receiptFullName=data.receiptFullName;//收款单位全称
            _this.billInfoObj.bankAccount=data.bankAccount;//银行账号
            _this.billInfoObj.depositBank=data.depositBank;//开户银行
            _this.billInfoObj.remark=data.remark;//备注
            _this.billInfoObj.ccPersonList=data.ccPersonList;//相关人
            _this.billInfoObj.toPersonList=data.toPersonList;//审批人
            _this.billInfoObj = deepClone(_this.billInfoObj);//深拷贝
            if(data.status==0){
              _this.state_bg='state_blue';
              _this.state='草稿';
            }else if(data.status==1){//审批中
              _this.state_bg='state_blue';
              _this.state='审批中';
            }else if(data.status==2){//取消
              _this.state='已取消';
              _this.state_bg='state_gray';
            } else if(data.status==3){//退审
              _this.state='已退审';
              _this.state_bg='state_info';
            }else if(data.status==4){//待转账
              _this.state='已审批';
              _this.state_bg='state_green';
            }else if(data.status==5){//待还款
              _this.state='待还款';
              _this.state_bg='state_orange';
            }else if(data.status==6){//已还款
              _this.state='已还款';
              _this.state_bg='state_green';
            }else{//7
              _this.state='转账失败';
              _this.state_bg='state_gray';
            }

            _this.repayObj.detailVOS=res.data.detailVOS;//借还款详情
            _this.repayObj.repayDate= _this.billInfoObj.repayDate;//还款日期
            _this.repayObj.surplusMoney=_this.billInfoObj.surplusMoney;//待
            _this.repayObj.time=data.repayDate;
            _this.repayObj.amountReturned=_this.billInfoObj.amountReturned;//已
            _this.repayObj = deepClone(_this.repayObj);//深拷贝

            _this.mediaList=res.data.mediaList;//附件
            _this.picList=res.data.picList; //图片
            _this.isBeOver=(new Date(new Date().setHours(23, 59, 59, 0)).getTime())>new Date(data.repayDate+' 23:59:59').getTime();
            _this.auditSerial.isFreeFlow = data.isFree;
            _this.auditSerial.isover = data.isover;
            _this.auditSerial = deepClone(_this.auditSerial);//深拷贝

            this.goViewTab(1,'showBill');//数据加载完显示第一个tab
          }else{
            this.hide();
            _.alert('提示',res.desc);
          }
          //计算得出详情页的高度,超出部分用滚动条
          let ow = document.documentElement.clientHeight;
          let obj = document.getElementById('detail_con');
          if(obj){
            let heightTop = obj.offsetTop;
            let clientHeight = ow-heightTop-20;
            obj.style.height=clientHeight+'px';
          }
        }).catch(err=>{
           _.alert('提示',err.desc);
        })
      },
      showOperation(){
        this.moreShow=!this.moreShow;
      },
      goViewTab(num,name){
         if(num==3){//审批历史
           let isFree=this.isFree == '0' ? 2 : this.isFree; //固定流程转为2
           let _this=this;
           dataBase.loading=true;
           getFlow({refId:this.loanId,isFree:isFree}).then((res)=>{
             dataBase.loading=false;
//             this.auditSerial=res.data.auditSerial;
             if (res.code=='0') {
               _this.auditSerial.list = res.data.auditSerial;
               _this.tabNum=num;
               _this.tabName=name;
             }else{
               _.alert('提示',res.desc);
             }
           }).catch(err => {
             dataBase.loading=false;
             _.alert('提示','网络错误');
           });
         }else{
           this.tabNum=num;
           this.tabName=name;
         }
      },
      hide() {
        this.$emit('onHide')
      },
    }
  }
</script>
<style scoped>
 #detail_con{
   overflow: auto;
 }
  .btn{
    border:1px solid #ccc;
  }
  .more{
    position: relative;
    display: inline-block;
    margin-right: 50px;
  }
  .more .show_more{
    margin-right: 20px;
  }
  .more_operation{
    position: absolute;
    left:-8px;
    width: 88px;
    text-align: center;
    margin-top: 5px;
    border:1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
  }
  .more_operation p{
    cursor: pointer;
  }
  .more_operation p:hover{
    color: #C31725;
  }
  .name{
    display: inline-block;
    vertical-align: bottom;
    word-break: break-all;
    font-size: 22px;
  }
  .tab_list {
    width: 100%;
    margin-top:50px;
    border-bottom: 1px solid #ccc;
  }
  .tab_list .tab_item {
    display: inline-block;
    padding: 0 30px;
    margin: 0 5px;
    height: 50px;
    line-height: 50px;
    color: #333;
    font-size: 16px;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    box-sizing: border-box;
  }
  .tab_list .tab_item:hover {
    color: #f87b00;
  }
  .tab_list .tab_item.active {
    color: #f87b00;
    border-bottom: 2px solid #f87b00;
  }
  .icon_down{
    display: inline-block;
    width: 10px;
    height: 6px;
    margin-bottom: 2px;
    background-image: url(~assets/images/reim/loan/icon_arrow_d.png);
    background-size: 100%;
  }
  .btn_status{
    margin:5px 0 0 30px;
    height:24px;
    line-height: 24px;
    vertical-align: top;
    color:#fff;
    border-radius: 2px;
    border: none;
    cursor: default;
  }
  .state_green{
    background-color:#84D67F ;
  }
  .state_orange{
    background-color:#F6BB66 ;
  }
  .state_info{
    background-color:#F76161 ;
  }
  .state_gray{
    background-color:#C7D1D8 ;
  }
  .state_blue{
    background-color:#81C6ED ;
  }

  .icon_top{
    transform: rotate(180deg);
  }
  .mr{
    float: right;
  }
  .ml{
    float: left;
  }
  .clearfix:after{
    content:"";
  　height:0;
    line-height:0;
    display:block;
    visibility:hidden;
    clear:both
  }
  .clearfix{
   zoom:1;
  }
</style>
