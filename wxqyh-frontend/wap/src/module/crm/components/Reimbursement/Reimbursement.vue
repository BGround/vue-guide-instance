<template>
  <div class="wrap">
    <div class="qwui-returnMoney">
      <p class="qwui-returnMoney_period">{{moneyData.title}}</p>
      <div class="qwui-returnMoney_num">
        <p
          v-for="(item,index) in moneyData.returnMoney"
          :key="index">
          {{item.name}}
          <span v-html="moneyFilter(item.value)"></span>元
        </p>
      </div>

      <!--删除按钮-->
      <div class="qwui-returnMoney_delBtn" @click="del" v-if="editable">{{moneyData.delBtn}}</div>

      <!--计划回款-->
      <div class="qwui-returnMoney_content">
        <div class="qwui-returnMoney_planMoney">
          <p class="qwui-returnMoney_type">
            <span class="qwui-returnMoney_typeLabel">{{moneyData.content.plan.label}}</span>
            <span
              class="qwui-returnMoney_add"
              @click="planRecord(0)"
              v-if="!moneyData.content.plan.list.length && editable">{{moneyData.content.plan.add}} </span>
          </p>
          <ul class="qwui-returnMoney_ul">
            <li class="qwui-returnMoney_list"
                v-for="(item,index) in moneyData.content.plan.list"
                :key="index"
                @click="goEditPlan(item.id,0)"
                v-if="moneyData.content.plan.list.length">
              <span class="qwui-returnMoney_money" v-html="moneyFilter(item.value)"></span>元
              <span class="qwui-returnMoney_date">{{item.date}}</span>
            </li>
          </ul>
        </div>

        <!--实际回款-->
        <div class="qwui-returnMoney_receiveMoney">
          <p class="qwui-returnMoney_type">
            <span class="qwui-returnMoney_typeLabel">{{moneyData.content.receive.label}}</span>
            <span
              class="qwui-returnMoney_add"
              @click="receiveReturn(1)"
              v-if="editable">{{moneyData.content.receive.add}}</span>
          </p>
          <ul class="qwui-returnMoney_ul">
            <li class="qwui-returnMoney_list"
                v-for="(item,index) in moneyData.content.receive.list"
                :key="index"
                @click="goEditReceive(item.id,1,index)"
                v-if="moneyData.content.receive.list.length">
              <span class="qwui-returnMoney_money" v-html="moneyFilter(item.value)"></span>元
              <span class="qwui-returnMoney_date">{{item.date}}</span>
            </li>
          </ul>
        </div>

        <!--开票回款-->
        <div class="qwui-returnMoney_invoiceMoney">
          <p class="qwui-returnMoney_type">
            <span class="qwui-returnMoney_typeLabel">{{moneyData.content.invoice.label}}</span>
            <span class="qwui-returnMoney_add"
                  @click="invoiceReturn(2)"
                  v-if="editable">{{moneyData.content.invoice.add}}</span>
          </p>
          <ul class="qwui-returnMoney_ul">
            <li class="qwui-returnMoney_list"
                v-for="(item,index) in moneyData.content.invoice.list"
                :key="index"
                @click="goEditInvoice(item.id,2,index)"
                v-if="moneyData.content.invoice.list.length">
              <span class="qwui-returnMoney_money" v-html="moneyFilter(item.value)"></span>元
              <span class="qwui-returnMoney_date">{{item.date}}</span>
            </li>
          </ul>
        </div>

      </div>

    </div>

    <!--计划回款记录-->
    <PlanReimburseRecord v-if="showRecord"></PlanReimburseRecord>

  </div>
</template>

<script>

  import PlanReimburseRecord from '../ReimbursePlan/ReimbursePlan';
  import {delStep} from '../../api/contract/getData.js';
    export default {
      components:{
        PlanReimburseRecord,
      },
      data(){
        return{
          showRecord:false,
          editable:true,
        }
      },
      props:{
        moneyData:{
          type:Object,
          default:() => {}
        }
      },
      created(){
        this.editable=this.moneyData.editable;
      },
      methods:{
      //格式化金额，每三位逗号分隔
        moneyFilter:function(num){
         return  _.toThousands(Number(num));
        },

      //  删除
        del:function(){
          this.$emit('delStep');
        },

      //  计划回款记录
        planRecord:function(index){
          let contractId=this.moneyData.contractId;
          let step=this.moneyData.step;
          this.$router.push({path:'/reimbursePlan',query:{step:step,contractId:contractId,stepType:index}});
        },

      //  实际回款
        receiveReturn:function(index){
          let contractId=this.moneyData.contractId;
          let step=this.moneyData.step;
          this.$router.push({path:'/reimburseReceive',query:{step:step,contractId:contractId,stepType:index}});
        },

      //  开票回款
        invoiceReturn:function(index){
          let contractId=this.moneyData.contractId;
          let step=this.moneyData.step;
          this.$router.push({path:'/reimburseInvoice',query:{step:step,contractId:contractId,stepType:index}});
        },

      //  编辑计划回款
        goEditPlan:function(id,index){
          let contractId=this.moneyData.contractId;
          let step=this.moneyData.step;
          this.$router.push({path:'/reimbursePlan',query:{id:id,step:step,contractId:contractId,stepType:index}});
        },

        //  编辑实际回款
        goEditReceive:function(id,stepType,index){
          let contractId=this.moneyData.contractId;
          let step=this.moneyData.step;
          this.$router.push({path:'/reimburseReceive',query:{id:id,step:step,contractId:contractId,stepType:stepType,index:index}});
        },

        //  编辑开票回款
        goEditInvoice:function(id,stepType,index){
          let contractId=this.moneyData.contractId;
          let step=this.moneyData.step;
          this.$router.push({path:'/reimburseInvoice',query:{id:id,step:step,contractId:contractId,stepType:stepType,index:index}});
        },
      }
    }
</script>

<style>
  @import './Reimbursement.scss';
</style>
