<template>
    <div class="bill_info">
        <div class="bill_info_list border_bottom">
          <ul>
            <li class="bill_info_item">
              <span class="name">单据类型 :</span> {{billInfo.typeName||'-'}}
            </li>
            <li class="bill_info_item">
              <span class="name">借款单编号 :</span> {{billInfo.loanNo||'-'}}
            </li>
            <li class="bill_info_item">
              <span class="name">借款人 :</span> {{billInfo.createPersonName||'-'}}
            </li>
            <li class="bill_info_item">
              <span class="name">创建时间 :</span> {{billInfo.createTime||'-'}}
            </li>
            <li class="bill_info_item">
              <span class="name">所属部门 :</span> {{billInfo.deptName||'-'}}
            </li>
          </ul>
        </div>
        <div class="bill_info_list border_bottom">
          <ul>
            <li class="bill_info_item"><span class="name">借款金额 :</span> {{('￥'+billInfo.loanMoney)||'-'}}</li>
            <li class="bill_info_item"><span class="name">待还金额 :</span> <span class="info">{{('￥'+billInfo.surplusMoney)||'-'}}</span></li>
            <li class="bill_info_item"><span class="name">已还金额 :</span> {{('￥'+billInfo.amountReturned)||'-'}}</li>
            <!--<li class="bill_info_item"><span class="name">还款日期 :</span> {{billInfo.repayDate||'-'}}</li>-->
            <li class="bill_info_item"><span class="name">借款日期 :</span> {{billInfo.loanDate||'-'}}</li>
            <li class="bill_info_item"><span class="name">截止还款日期 :</span> <span :class="{'info':isBeOver}">{{billInfo.repayDate||'-'}}</span></li>
            <li class="bill_info_item"><span class="name">备注 :</span> {{billInfo.remark||'-'}}</li>
          </ul>
        </div>
      <div class="bill_info_list border_bottom">
        <p class="bill_info_item"><span class="name">收款单位全称</span> {{billInfo.receiptFullName||'-'}}</p>
        <p class="bill_info_item"><span class="name">银行账号</span> {{billInfo.bankAccount||'-'}}</p>
        <p class="bill_info_item"><span class="name">开户银行</span> {{billInfo.depositBank||'-'}}</p>
      </div>
      <div class="bill_info_list border_bottom">
        <p class="bill_info_item personnel_item" v-if="billInfo.toPersonList.length>0"><span class="name">审批人</span>
               <span class="person_con">
                 <span class="approver" v-for="(item,index) in billInfo.toPersonList"><img :src="item.headPic" alt="">{{item.personName}}</span>
               </span>
        </p>
        <p class="bill_info_item personnel_item" v-if="billInfo.ccPersonList.length>0"><span class="name">相关人</span>
          <span class="person_con">
             <span class="approver" v-for="(item,index) in billInfo.ccPersonList"><img :src="item.headPic" alt="">{{item.personName}}</span>
          </span>
        </p>
      </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    props:{
      billInfo:{
        type: Object,
        default() {
          return {}
        }
      },
      isBeOver:{
        type:Boolean,
        default:false,//是否逾期
      },

    },
  }
</script>

<style scoped>
  .info{
    color:#FF574D;
  }
  .bill_info_list{
    padding: 20px;
    word-break: break-all;
  }
  li.bill_info_item{
    display: inline-block;
    width: 300px;
    vertical-align: top;
  }
  .bill_info_item{
    margin-bottom: 10px;
  }
  .bill_info_item .name{
    display: inline-block;
    color:#888;
  }
  p.bill_info_item .name{
    width: 125px;
  }
  .person_con{
    display: inline-block;
    width: 792px;
  }
  .border_bottom{
    border-bottom: 1px solid #ccc;
  }
  .personnel_item .name{
    vertical-align: top;
  }
  .relevant,.approver{
    display: inline-block;
    overflow: hidden;
    height: 24px;
    padding-right: 5px;
    margin-bottom: 5px;
    margin-right: 5px;
    line-height: 24px;
    font-size: 14px;
    background: #eee;
    border: 1px solid #ddd;
    border-radius: 2px;
  }
  .relevant img,.approver img{
    width: 24px;
    height: 24px;
    vertical-align: top;
    margin-right: 5px;
  }
</style>
