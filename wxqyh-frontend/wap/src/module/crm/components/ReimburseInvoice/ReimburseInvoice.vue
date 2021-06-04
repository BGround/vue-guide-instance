<template>
  <div class="wrap qwui-record">
    <div class="qwui-returnRecord_title">
      期次：<span>{{step}}</span>期
    </div>
    <div class="qwui-record_content">
      <div class="qwui-returnRecord_item">
        <p class="qwui-returnRecord_itemName">票据内容</p>
        <input
          type="text"
          placeholder="请输入"
          v-model="content"
          :readonly="readonly"
        >
      </div>
      <div class="qwui-returnRecord_item qwui-returnRecord_date">
        <p class="qwui-returnRecord_itemName">开票日期</p>
        <div v-model="date">
          <select_time
            :dataDetailMsg="date"
            v-on:listenToChild="showMsgFromTimeDetail"
            :readonly="readonly">
          </select_time>
        </div>
      </div>
      <div class="qwui-returnRecord_item">
        <p class="qwui-returnRecord_itemName">开票金额</p>
        <input
          type="text"
          placeholder="请输入"
          v-model="getMoney"
          :readonly="readonly"
        >
      </div>
      <div class="qwui-returnRecord_item qwui-returnRecord_select">
        <p>发票类型</p>
        <select v-model="typeSelected" @change="getRate" :disabled="!editable">
          <option value="">请选择</option>
          <option
            v-for="(item,index) in taxType"
            :key="index"
            :value="index">{{item.typeName}}</option>
        </select>
      </div>
      <div class="qwui-returnRecord_item qwui-returnRecord_select">
        <p>发票税率</p>
        <select v-model="rateSelected" :disabled="!editable">
          <option value="">请先选择发票类型</option>
          <option
            v-for="(item,index) in rate"
            :key="index"
            :value="index">{{item}}%</option>
        </select>
      </div>
      <div class="qwui-returnRecord_item">
        <p>发票号码</p>
        <input
          type="text"
          placeholder="请输入"
          maxlength="20"
          v-model="invoiceCode"
          :readonly="readonly"
        >
      </div>
      <div class="qwui-returnRecord_remark">
        <p>备注</p>
        <textarea
          placeholder="请输入"
          maxlength="2000"
          v-model="remark"
          :readonly="readonly">
        </textarea>
        <span class="textLength" :class="{activeInvoice:textLength==2000}">{{textLength}}/2000</span>
      </div>
    </div>
    <button class="qwui-returnRecord_btn" @click="save" v-if="!showDel" >保存</button>
    <div v-if="showDel && editable">
      <button class="qwui-returnRecord_delBtn" @click="del" >删除</button>
      <button class="qwui-returnRecord_updateBtn" @click="update">保存</button>
    </div>


  </div>
</template>

<script>
  import select_time from '../SelectTime/SelectTime';
  import {
    savePlanReturn,
    editPlanReturn,
    updatePlanReturn,
    delPlanReturn,
    getTaxType,
    returnMoney} from '../../api/contract/getData.js';
  export default {
    components:{
      select_time,
    },
    data(){
      return{
        content:"",//内容
        date:"",//日期
        money:"",//金额
        remark:"",//备注
        invoiceCode:"",//发票号码
        textLength:"0",//备注文本长度
        showDel:true,//是否显示删除按钮
        step:"",//当前期次
        index:"",//当前回款项索引
        contractId:"",//合同id
        editable:"",//是否可编辑
        readonly:false,//表单是否只读
        planData:{},//接口返回数据
        typeSelected:"",//发票类型默认选中项
        rateSelected:"",//税率默认选中项
        taxType:[],//发票类型
        rate:[],//税率
        isChange:false,//是否修改了回款信息
        btnConfig:{
          primaryBtn:{name:"", callBack:null},
          defaultBtn:{name:"取消", callBack:null},
        },
      }
    },
    computed:{
      getMoney:{
        set:function(val){
          this.money=val;
        },
        get:function(){
          return this.money;
        },
        rate:function(){

        }
      }
    },
    watch:{
      // 文本长度
      remark:function(val ,oldval){
        return this.textLength=val.length
      },
      // 监听发票类型数据变化
      typeSelected:function(newVal,oldVal){
        if(oldVal!==''){
          this.rateSelected=0;
        }
        if(newVal===''){
          this.rateSelected='';
        }
      }
    },
    created(){
      this.getReceive();
      this.getType();
      if(this.$router.history.current.query.id){
        this.getPlanReturn();
      }
      this.step=this.$router.history.current.query.step;//获取当前期次
      this.index=this.$router.history.current.query.index;//获取当前回款项索引
      this.contractId=this.$router.history.current.query.contractId;
      this.$router.history.current.query.id==undefined?this.showDel=false:this.showDel=true;//回款id存在，表示编辑；回款id不存在，表示新增
    },
    beforeRouteLeave (to, from, next) {
      let obj={
        "newContent":this.planData.content,
        "newDate":this.planData.receiveDate,
        "newMoney":this.planData.money,
        "newTypeSelected":this.planData.invoiceType,
        "newRateSelected":this.planData.invoiceRatio,
        "newInvoiceCode":this.planData.invoiceCode,
        "newRemark":this.planData.remark,
      }
      if(this.isChange){    //如果是点击保存按钮，则跳转路由
        next();
      }
      //如果修改了没有保存，提示用户保存，不跳转
      let flag=(this.content!="" && this.content!=obj.newContent) || (this.date!="" && this.date!=obj.newDate) ||
        (this.money!="" && this.money!=obj.newMoney) || (this.typeSelected!="" && this.typeSelected!=obj.newTypeSelected) ||
        (this.rateSelected!="" && this.rateSelected!=obj.newRateSelected) || (this.invoiceCode!="" && this.invoiceCode!=obj.newInvoiceCode) ||
        (this.remark!="" && this.remark!=obj.newRemark);
      if(!this.isChange && flag && this.editable){
        this.btnConfig.primaryBtn.name="确定";
        this.btnConfig.primaryBtn.callBack=next;
        _.alert('提示','确定要放弃此次编辑?',this.btnConfig);
        next(false);
      }else{    //如果没有修改，则跳转
        next();
      }
    },
    methods:{
      //日期
      showMsgFromTimeDetail:function (date) {
        this.date=date;
      },

      //获取发票类型
      getType:function(){
        getTaxType((result) =>{
          this.taxType=result.taxTypeList;
        })
      },

      //获取税率
      getRate:function(){
        if(this.typeSelected!==""){
          getTaxType((result) =>{
            this.taxType=result.taxTypeList;
            this.rate=this.taxType[this.typeSelected].ratio.split('|');
          })
        }else{
          this.rate=[];
          this.rateSelected="";
        }
      },

      //获取回款明细
      getReceive(){
        let id=this.$router.history.current.query.contractId;
        returnMoney(id,(result) =>{
          this.contractOutlineVO=result.contractOutlineVO;
          this.stepList=result.stepList;
          this.editable=result.editable;
          this.readonly=!result.editable;
        })
      },

      // 保存时验证合法性
      save:function(){
        this.isChange=true;
        let receiveMoney=this.stepList.length==0?"":this.stepList.length==this.step?this.stepList[this.step-1].receiveMoney:"";//当前期次实际回款金额
        let invoiceMoney=this.stepList.length==0?"":this.stepList.length==this.step?this.stepList[this.step-1].invoiceMoney:"";//本期已开票金额
        let totalInvoice=Number(this.money)+invoiceMoney;//本期实际开票金额
        if(this.content==""){
          _.alert('提示','请先选择"票据内容"');
          return;
        }
        if(this.date==""){
          _.alert('提示','请先输入"开票日期"');
          return;
        }
        if(this.money==""){
          _.alert('提示','请先输入"开票金额"');
          return;
        }
        if(this.money<0.01){
          _.alert('提示','请输入大于0的金额');
          return;
        }
        if(receiveMoney > 0 && totalInvoice > receiveMoney){
          this.btnConfig.primaryBtn.name="继续";
          this.btnConfig.primaryBtn.callBack=this.invoiceSubmit;
          _.alert("提示", "本期实际开票金额"+_.toThousands(totalInvoice)+"元，比实际回款金额"+_.toThousands(receiveMoney)+"元多" +
            _.toThousands(_.accSub(totalInvoice, receiveMoney)) + "元，是否继续?", this.btnConfig);
        }
        else{
          this.invoiceSubmit()
        }
      },
      //  开票回款
      invoiceSubmit:function(){
        let total=Number(this.money)+this.contractOutlineVO.totalInvoiceAmount;//实际开票总金额
        if(total > this.contractOutlineVO.contractAmount){
          this.btnConfig.primaryBtn.name="继续";
          this.btnConfig.primaryBtn.callBack=this.addSave;
          setTimeout(()=>{
            _.alert("提示", "实际开票总金额"+ _.toThousands(total)+"元，" + "比合同金额"+
              _.toThousands(this.contractOutlineVO.contractAmount)+"元多" +
              _.toThousands(_.accSub(total, this.contractOutlineVO.contractAmount)) + "元，是否继续?", this.btnConfig);
          },100)
        }else{
          this.addSave();
        }
      },
      //  保存
      addSave:function(){
        let obj={
          "contractId": this.contractId,
          "step": this.$router.history.current.query.step,
          "stepType": this.$router.history.current.query.stepType,
          "content": this.content,
          "date": this.date,
          "money": this.money,
          "invoiceType": this.typeSelected,
          "invoiceRatio": this.rateSelected,
          "invoiceCode": this.invoiceCode,
          "remark": this.remark,
        }
        savePlanReturn(obj,result =>{
          this.$router.replace({path:'/ContractContent',query:{id:this.contractId}})
        })
      },


      //  编辑渲染
      getPlanReturn:function(){
        let id=this.$router.history.current.query.id;
        editPlanReturn(id,(result) =>{
          this.planData=result.receiveDetailVO;
          this.content=result.receiveDetailVO.content;
          this.date=result.receiveDetailVO.receiveDate;
          this.money=result.receiveDetailVO.money;
          this.typeSelected=result.receiveDetailVO.invoiceType;
          this.rateSelected=result.receiveDetailVO.invoiceRatio;
          this.getRate();
          this.invoiceCode=result.receiveDetailVO.invoiceCode;
          this.remark=result.receiveDetailVO.remark;
        })
      },

      // 删除
      del:function(){
        let btnConfig={
          primaryBtn:{name:"确定", callBack:this.doDel},
          defaultBtn:{name:"取消", callBack:null},
        }
        _.alert('提示','删除操作不可撤销,确定继续?',btnConfig);
      },
      doDel:function(){
        let id=this.planData.id;
        delPlanReturn(id,(result) =>{
          this.$router.replace({path:'/ContractContent',query:{id:this.contractId}})
        })
      },


      // 保存时验证合法性
      update:function(){
        this.isChange=true;
        let obj={
          "newContent":this.planData.content,
          "newDate":this.planData.receiveDate,
          "newMoney":this.planData.money,
          "newTypeSelected":this.planData.invoiceType,
          "newRateSelected":this.planData.invoiceRatio,
          "newInvoiceCode":this.planData.invoiceCode,
          "newRemark":this.planData.remark,
        }
        let flag=this.content===obj.newContent && this.date===obj.newDate && this.money===obj.newMoney && this.typeSelected===obj.newTypeSelected &&
          this.rateSelected===obj.newRateSelected && this.invoiceCode===obj.newInvoiceCode && this.remark==obj.newRemark;
        let receiveMoney=this.stepList.length==0?"":this.stepList.length==this.step?this.stepList[this.step-1].receiveMoney:"";//本期实际回款金额
        let invoiceMoney=this.stepList.length==0?"":this.stepList.length==this.step?this.stepList[this.step-1].invoiceMoney:"";//本期已开票的金额
        let money="";
        if(this.stepList.length==this.step){ //本期每一项的开票金额
          if(this.stepList[this.step-1].receiveList.length==1){
            money=this.stepList[this.step-1].receiveList[Number(this.index)].money
          }else{
            money=this.stepList[this.step-1].receiveList[Number(this.index+1)].money
          }
        }else{
          money=''
        }
        let totalInvoice=Number(this.money)+(invoiceMoney-money);//本期实际开票金额
        if(flag){
          _.alert('温馨提示','未作修改,无需保存');
          return;
        }
        if(this.content==""){
          _.alert('提示','请先选择"票据内容"');
          return;
        }
        if(this.date==""){
          _.alert('提示','请先输入"开票日期"');
          return;
        }
        if(this.money==""){
          _.alert('提示','请先输入"开票金额"');
          return;
        }
        if(this.money<0.01){
          _.alert('提示','请输入大于0的金额');
          return;
        }
        if(receiveMoney > 0 && totalInvoice > receiveMoney){
          this.btnConfig.primaryBtn.name="继续";
          this.btnConfig.primaryBtn.callBack=this.invoiceUpdateSubmit;
          _.alert("提示", "本期实际开票金额"+_.toThousands(totalInvoice)+"元，比实际回款金额"+_.toThousands(receiveMoney)+"元多" +
            _.toThousands(_.accSub(totalInvoice, receiveMoney)) + "元，是否继续?", this.btnConfig);
        }
        else{
          this.invoiceUpdateSubmit()
        }
      },
      //  开票回款
      invoiceUpdateSubmit:function(){
        let invoiceMoney=this.stepList.length==0?"":this.stepList.length==this.step?this.stepList[this.step-1].invoiceMoney:"";//本期已开票金额
        let money="";
        if(this.stepList.length==this.step){ //每一项的开票金额
          if(this.stepList[this.step-1].receiveList.length==1){
            money=this.stepList[this.step-1].receiveList[Number(this.index)].money
          }else{
            money=this.stepList[this.step-1].receiveList[Number(this.index+1)].money
          }
        }else{
          money=''
        }
        let total=Number(this.money)+(invoiceMoney-money);//当前实际开票总金额
        if(total > this.contractOutlineVO.contractAmount){
          this.btnConfig.primaryBtn.name="继续";
          this.btnConfig.primaryBtn.callBack=this.addUpdate;
          setTimeout(()=>{
            _.alert("提示", "实际开票总金额"+ _.toThousands(total)+"元，" + "比合同金额"+
              _.toThousands(this.contractOutlineVO.contractAmount)+"元多" +
              _.toThousands(_.accSub(total, this.contractOutlineVO.contractAmount)) + "元，是否继续?", this.btnConfig);
          },100)
        }else{
          this.addUpdate();
        }
      },
      //  保存更新
      addUpdate:function(){
        let obj={
          "receiveDetailPOId":this.planData.id,
          "contractId": this.contractId,
          "step": this.$router.history.current.query.step,
          "stepType": this.$router.history.current.query.stepType,
          "content": this.content,
          "date": this.date,
          "money": this.money,
          "invoiceType": this.typeSelected,
          "invoiceRatio": this.rateSelected,
          "invoiceCode": this.invoiceCode,
          "remark": this.remark,
        }
        updatePlanReturn(obj,result =>{
          this.$router.replace({path:'/ContractContent',query:{id:this.contractId}})
        })
      },
    }
  }
</script>

<style>
  @import "./ReimburseInvoice.scss";

</style>
