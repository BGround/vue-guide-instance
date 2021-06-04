<template>
  <div class="qwui-record">
    <div class="qwui-returnRecord_title">
      期次：<span>{{step}}</span>期
    </div>

    <div class="qwui-record_content">
      <div class="qwui-returnRecord_item qwui-returnRecord_date">
        <p class="qwui-returnRecord_itemName">实际回款日期</p>
        <div v-model="date">
          <select_time
            :dataDetailMsg="date"
            v-on:listenToChild="showMsgFromTimeDetail"
            :readonly="readonly">
          </select_time>
        </div>
      </div>
      <div class="qwui-returnRecord_item">
        <p class="qwui-returnRecord_itemName">实际回款金额</p>
        <input type="text" placeholder="请输入" v-model="getMoney" :readonly="readonly">
      </div>
      <div class="qwui-returnRecord_item qwui-returnRecord_payMethod">
        <p class="qwui-returnRecord_itemName">付款方式</p>
        <select v-model="selected" :disabled="!editable">
          <option
            v-for="(item,index) in payment"
            :key="index"
            :value="item.value">{{item.option}}</option>
        </select>
      </div>
      <div class="qwui-returnRecord_remark">
        <p>备注</p>
        <textarea
          placeholder="请输入"
          maxlength="2000"
          v-model="remark"
          :readonly="readonly">
        </textarea>
        <span class="textLength" :class="{activeReceive:textLength==2000}">{{textLength}}/2000</span>
      </div>
    </div>

    <button class="qwui-returnRecord_btn" @click="save" v-if="!showDel">保存</button>
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
    returnMoney
  } from '../../api/contract/getData.js';

    export default {
      components:{
        select_time,
      },
      data(){
        return{
          date:"",
          money:"",
          remark:"",
          textLength:"0",
          showDel:true,
          step:"",//当前期次
          index:"",//当前回款项索引
          contractId:"",//合同id
          editable:"",//是否可编辑
          readonly:false,//表单是否只读
          planData:{},
          selected:"",
          payment:[
            {value:"",option:"请选择"},
            {value:"0",option:"支票"},
            {value:"1",option:"现金"},
            {value:"2",option:"邮政汇款"},
            {value:"3",option:"电汇"},
            {value:"4",option:"网上转账"},
            {value:"5",option:"支付宝"},
            {value:"6",option:"微信支付"},
            {value:"7",option:"刷卡"},
            {value:"8",option:"其它"}
          ],
          isChange:false,//是否修改了回款信息
          btnConfig:{
            primaryBtn:{name:"", callBack:null},
            defaultBtn:{name:"取消", callBack:null},
          }
        }
      },
      computed:{
        getMoney:{
          set:function(val){
            this.money=val;
          },
          get:function(){
            return this.money;
          }
        }
      },
      watch:{
        // 文本长度
        remark:function(val ,oldval){
          return this.textLength=val.length
        },
      },
      created(){
        this.getReceive();
        if(this.$router.history.current.query.id){
          this.getPlanReturn();
        }
        this.step=this.$router.history.current.query.step;//获取当前期次
        this.index=this.$router.history.current.query.index;//获取当前回款项索引
        this.contractId=this.$router.history.current.query.contractId;
        this.$router.history.current.query.id==undefined?this.showDel=false:this.showDel=true;//回款id存在，表示编辑；回款id不存在，表示新增
      },
      beforeRouteLeave (to, from, next) {
        let newDate=this.planData.receiveDate;
        let newMoney=this.planData.money;
        let newSelected=this.planData.payment;
        let newRemark=this.planData.remark;
        if(this.isChange){    //如果是点击保存按钮，则跳转路由
          next();
        }
        //如果修改了没有保存，提示用户保存，不跳转
        if(!this.isChange && ((this.date!="" && this.date!=newDate) || (this.money!="" && this.money!=newMoney) || (this.remark!="" && this.remark!=newRemark) || (this.selected!="" && this.selected!=newSelected))){
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

        // 保存验证合法性
        save:function(){
          this.isChange=true;
          let receivePlanMoney=this.stepList.length==0?"":this.stepList.length==this.step?this.stepList[this.step-1].receivePlanMoney:"";//当前期次原计划回款金额
          let receiveMoney=this.stepList.length==0?"":this.stepList.length==this.step?this.stepList[this.step-1].receiveMoney:"";
          let totalReceive=Number(this.money)+receiveMoney;//当前实际回款金额
          if(this.date==""){
            _.alert('提示','请先选择"实际回款日期"');
            return;
          }
          if(this.money==""){
            _.alert('提示','请先输入"实际回款金额"');
            return;
          }
          if(this.selected==""){
            _.alert('提示','请先选择"付款方式"');
            return;
          }
          if(this.money<0.01){
            _.alert('提示','请输入大于0的金额');
            return;
          }
          if(receivePlanMoney > 0 && totalReceive > receivePlanMoney){
            this.btnConfig.primaryBtn.name="继续";
            this.btnConfig.primaryBtn.callBack=this.reveiveSubmit;
            _.alert("提示", "本期实际回款金额"+_.toThousands(totalReceive)+"元，比原计划回款金额"+_.toThousands(receivePlanMoney)+"元多" +
              _.toThousands(_.accSub(totalReceive, receivePlanMoney)) + "元，是否继续?", this.btnConfig);
          }
          else{
            this.reveiveSubmit()
          }
        },
        //  实际回款
        reveiveSubmit:function(){
          let total=Number(this.money)+this.contractOutlineVO.paymentAmount;//当前实际回款金额
          if(total>this.contractOutlineVO.contractAmount){
            this.btnConfig.primaryBtn.name="继续";
            this.btnConfig.primaryBtn.callBack=this.addSave;
            setTimeout(()=>{
              _.alert("提示", "实际回款总金额"+ _.toThousands(total)+"元，" + "比合同金额"+
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
            "contractId":this.contractId,
            "step": this.$router.history.current.query.step,
            "stepType": this.$router.history.current.query.stepType,
            "date": this.date,
            "money": this.money,
            "payment":this.selected,
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
            this.date=result.receiveDetailVO.receiveDate;
            this.money=result.receiveDetailVO.money;
            this.selected=result.receiveDetailVO.payment;
            this.remark=result.receiveDetailVO.remark;
          })
        },

        // 删除
        del:function(){
          this.btnConfig.primaryBtn.name="确定";
          this.btnConfig.primaryBtn.callBack=this.doDel;
          _.alert('提示','删除操作不可撤销,确定继续?',this.btnConfig);
        },
        doDel:function(){
          let id=this.planData.id;
          delPlanReturn(id,(result) =>{
            this.$router.replace({path:'/ContractContent',query:{id:this.contractId}})
          })
        },


        // 更新保存验证合法性
        update:function(){
          this.isChange=true;
          let receivePlanMoney=this.stepList.length==0?"":this.stepList.length==this.step?this.stepList[this.step-1].receivePlanMoney:"";//当前期次原计划回款金额
          let receiveMoney=this.stepList.length==this.step?this.stepList[this.step-1].receiveMoney:"";
          let money=this.stepList.length==this.step?this.stepList[this.step-1].receiveList[Number(this.index)+1].money:"";
          let totalReceive=Number(this.money)+(receiveMoney-money);//本期实际回款金额
          if(this.date==""){
            _.alert('提示','请先选择"实际回款日期"');
            return;
          }
          if(this.money==""){
            _.alert('提示','请先输入"实际回款金额"');
            return;
          }
          if(this.selected===""){
            _.alert('提示','请先选择"付款方式"');
            return;
          }
          if(this.money<0.01){
            _.alert('提示','请输入大于0的金额');
            return;
          }
          if(receivePlanMoney > 0 && totalReceive > receivePlanMoney){
            this.btnConfig.primaryBtn.name="继续";
            this.btnConfig.primaryBtn.callBack=this.reveiveUpdateSubmit;
            _.alert("提示", "本期实际回款金额"+_.toThousands(totalReceive)+"元，比原计划回款金额"+_.toThousands(receivePlanMoney)+"元多" +
              _.toThousands(_.accSub(totalReceive, receivePlanMoney)) + "元，是否继续?", this.btnConfig);
          }
          else{
            this.reveiveUpdateSubmit()
          }
        },
        //  实际回款
        reveiveUpdateSubmit:function(){
          let receiveMoney=this.stepList.length==0?"":this.stepList[this.step-1].receiveMoney;//当前期次实际回款金额
          let money=this.stepList.length==this.step?this.stepList[this.step-1].receiveList[Number(this.index)+1].money:"";
          let total=Number(this.money)+(receiveMoney-money);//当前实际回款总金额
          if(total>this.contractOutlineVO.contractAmount){
            this.btnConfig.primaryBtn.name="继续";
            this.btnConfig.primaryBtn.callBack=this.addUpdate;
            setTimeout(()=>{
              _.alert("提示", "实际回款总金额"+ _.toThousands(total)+"元，" + "比合同金额"+
                _.toThousands(this.contractOutlineVO.contractAmount)+"元多" +
                _.toThousands(_.accSub(total, this.contractOutlineVO.contractAmount)) + "元，是否继续?", this.btnConfig);
            },100)
          }else{
            this.addUpdate();
          }
        },
        //  更新保存
        addUpdate:function(){
          let obj={
            "receiveDetailPOId":this.planData.id,
            "contractId": this.contractId,
            "step": this.$router.history.current.query.step,
            "stepType": this.$router.history.current.query.stepType,
            "date": this.date,
            "money": this.money,
            "payment":this.selected,
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
  @import "./ReimburseReceive.scss";
</style>
