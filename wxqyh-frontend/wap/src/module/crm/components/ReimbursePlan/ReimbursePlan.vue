<template>
  <div class="qwui-record">
    <div class="qwui-returnRecord_title">
      期次：<span>{{step}}</span>期
    </div>
    <div class="qwui-record_content">
      <div class="qwui-returnRecord_item qwui-returnRecord_date">
        <p class="qwui-returnRecord_itemName">计划回款日期</p>
        <div v-model="date">
          <select_time
            :dataDetailMsg="date"
            v-on:listenToChild="showMsgFromTimeDetail"
            :readonly="readonly">
          </select_time>
        </div>
      </div>
      <div class="qwui-returnRecord_item">
        <p class="qwui-returnRecord_itemName">计划回款金额</p>
        <input
          type="text"
          placeholder="请输入"
          v-model="getMoney"
          :readonly="readonly"
        >
      </div>
      <div class="qwui-returnRecord_remark">
        <p>备注</p>
        <textarea
          placeholder="请输入"
          maxlength="2000"
          v-model="remark"
          ref="text"
          :readonly="readonly">
        </textarea>
        <span class="textLength" :class="{active:textLength==2000}">{{textLength}}/2000</span>
      </div>
    </div>
    <button class="qwui-returnRecord_btn" @click="save" v-if="!showDel">保存</button>
    <div v-if="showDel && editable">
      <button class="qwui-returnRecord_delBtn" @click="del">删除</button>
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
    returnMoney} from '../../api/contract/getData.js';
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
          showDel:true,//是否显示删除按钮
          step:"",//表示第几期次
          contractId:"",//合同id
          editable:"",//是否可编辑
          readonly:false,//表单是否只读
          planData:{},
          stepList:[],
          contractOutlineVO:{},//回款明细数据
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
        this.contractId=this.$router.history.current.query.contractId;
        this.$router.history.current.query.id==undefined?this.showDel=false:this.showDel=true;//回款id存在，表示编辑；回款id不存在，表示新增
      },
      beforeRouteLeave (to, from, next) {
        let newDate=this.planData.receiveDate;
        let newMoney=this.planData.money;
        let newRemark=this.planData.remark;
        if(this.isChange){    //如果是点击保存按钮，则跳转路由
          next();
        }
        //如果修改了没有保存，提示用户保存，不跳转
        if(!this.isChange && (this.date!=newDate || this.money!=newMoney || this.remark!=newRemark)){
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

      // 保存时验证合法性
        save:function(){
          this.isChange=true;
          let receive=this.stepList.length==0?"":this.stepList.length==this.step?this.stepList[this.step-1].receiveMoney:"";//本期实际回款金额
          if(this.date==""){
            _.alert('提示','请先选择"计划回款日期"');
            return;
          }
          if(this.money==""){
            _.alert('提示','请先输入"计划回款金额"');
            return;
          }
          if(this.money<0.01){
            _.alert('提示','请输入大于0的金额');
            return;
          }
          if(receive>0 && this.money<receive){
            this.btnConfig.primaryBtn.name="继续";
            this.btnConfig.primaryBtn.callBack=this.planSubmit;
            _.alert("提示", "本期计划回款金额"+_.toThousands(this.money)+"元，比实际"+_.toThousands(receive)+"元少" +
              _.toThousands(_.accSub(receive, this.money)) + "元，是否继续?", this.btnConfig);
          }
          else{
            this.planSubmit()
          }
        },

      //  计划回款
        planSubmit:function(){
          let total=Number(this.money)+this.contractOutlineVO.totalPlanAmount;//当前计划回款金额
          if(total>this.contractOutlineVO.contractAmount){
            this.btnConfig.primaryBtn.name="继续";
            this.btnConfig.primaryBtn.callBack=this.addSave;
            setTimeout(()=>{
              _.alert("提示", "计划回款总金额"+ _.toThousands(total)+"元，" + "比合同金额"+
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
            "date": this.date,
            "money": this.money,
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

      //  更新保存验证合法性
        update:function(){
          this.isChange=true;
          let newDate=this.planData.receiveDate;
          let newMoney=this.planData.money;
          let newRemark=this.planData.remark;
          let receive=this.stepList[this.step-1].receiveMoney;
          if(this.date==newDate && this.money==newMoney && this.remark==newRemark){
            _.alert('温馨提示','未作修改,无需保存');
            return;
          }
          if(this.date==""){
            _.alert('提示','请先选择"计划回款日期"');
            return;
          }
          if(this.money==""){
            _.alert('提示','请先输入"计划回款金额"');
            return;
          }
          if(this.money<0.01){
            _.alert('提示','请输入大于0的金额');
            return;
          }
          if(receive>0 && this.money<receive){
            this.btnConfig.primaryBtn.name="继续";
            this.btnConfig.primaryBtn.callBack=this.planUpdateSubmit;
            _.alert("提示", "本期计划回款金额"+_.toThousands(this.money)+"元，比实际"+_.toThousands(receive)+"元少" +
              _.toThousands(_.accSub(receive, this.money)) + "元，是否继续?", this.btnConfig);
          }
          else{
            this.planUpdateSubmit()
          }
        },

        //  计划回款
        planUpdateSubmit:function(){
          let totalPlanAmount=this.contractOutlineVO.totalPlanAmount;//已计划回款总金额
          let receivePlan=this.stepList.length==0?"":this.stepList[this.step-1].receivePlanMoney;//本期计划回款金额
          let total=Number(this.money)+(totalPlanAmount-receivePlan);//当前计划回款总金额
          if(total>this.contractOutlineVO.contractAmount){
            this.btnConfig.primaryBtn.name="继续";
            this.btnConfig.primaryBtn.callBack=this.addUpdate;
            setTimeout(()=>{//第二个弹窗需要加个定时器，组件原因
              _.alert("提示", "计划回款总金额"+ _.toThousands(total)+"元，" + "比合同金额"+
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
  @import 'ReimbursePlan.scss';
</style>
