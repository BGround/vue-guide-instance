<template>
  <div class="loanbursement-detail">
    <!-- 详情标题 -->
    <div class="detail border-bottom-1px">
      <div class="detail-title">
        <span class="detail-title-name">{{loanDetailData.title}}<apply-status class="apply_status" :applystatus="filterStatus"></apply-status></span>
      </div>
      <div class="detail-date">
        <span class="detail-date-time">{{loanDetailData.createTime}}</span>
        <span class="detail-date-name">{{loanDetailData.createPersonName}}</span>
      </div>
      <span class="detail-loan-No">{{loanDetailData.typeName}} | 借款单编号：{{loanDetailData.loanNo}}</span>
    </div>

    <!-- 借款明细 -->
    <field-list class="detail-item"
                :isExpand="isShowDebitis"
                :fieldValue="debitList"
                :readOnly="true">
    </field-list>

    <!--银行信息组件-->
    <bank-msg  class="detail-item"
      v-if="isShowBank"
      :bankMsg="bankMsg"
      :isEdit="false"
      :bankSwitch="false"
      :isShowHide="true"
      :showDown="isShowBankContent">
    </bank-msg>

    <flow-button class="qwui-back_btn" :buttondata="buttonConfig"></flow-button>
  </div>
</template>

<script>
import FlowButton from '@/components/button/flow_button';
import applyStatus from '@/components/part/apply_status';  
import FieldList from '../../components/Debit/DebitField';
import BankMsg from '../../components/bankMsg';
import { format } from '../../js/common';
import { mapGetters, mapMutations } from 'vuex';


export default {
  name: 'QwLoanDetail',
  components: {
    applyStatus,
    FlowButton,
    FieldList,
    BankMsg
  },
  data() {
    return {
      isShowDebitis: true,
      isShowBankContent: true,
      //操作按钮
      buttonConfig:{
        primaryList:[],
        defaultList:[
          { type: 'default', name:'i18n.returnBack', callBack: () => {this.updateLoanDetail({isShow: false})}},
        ],
        //按钮是否置底部 active :底部、"":相对定位
        class: 'active'
      },
    };
  },
  computed: {
    isShowBank() {
      return !!(this.loanDetailData.receiptFullName || this.loanDetailData.bankAccount || this.loanDetailData.depositBank);
    },
    debitList() {
      if (this.loanDetailData) {
        const { deptName, deptId, loanMoney, loanDate, repayDate, remark } = this.loanDetailData;
        return {
          deptName,   //部门
          deptId,      //部门id
          remark,      //备注
          loanMoney, //借款单金额
          loanDate,   //借款日期
          repayDate,  //还款日期
        }
      }
    },
    bankMsg() {
      if (this.loanDetailData) {
        const { receiptFullName, bankAccount, depositBank } = this.loanDetailData;
        return {
          receiptFullName,//收款单位全称
          bankAccount,    //银行账号
          depositBank     //开户银行
        }
      }
    },
    filterStatus() { //审批状态
      let classN = '';
      switch (this.loanDetailData.status) {
        case 1:  //审批中
          classN = "status_blue";
          this.showTab=false;
          this.showDetail=true;
          break;
        case 2:  //已取消
          classN = "status_gray";
          this.showTab=false;
          this.showDetail=true;
          break;
        case 3:  //退审
        classN = "status_red";
        this.showTab=false;
          this.showDetail=true;
        break;
        case 4:  //已审批
          classN = "status_green";
          this.showTab=false;
          this.showDetail=true;
          break;
        case 5:  //待还款
          classN = "status_red";
          this.showTab=true;
          this.showRepayment=true;
          this.showDetail=false;
          break;
        case 6:  //已还款
          classN = "status_red";
          this.showTab=true;
          this.showRepayment=true;
          this.showDetail=false;
          break;
        default:  //（转账失败）
          classN = "status_gray";
      }
      return {
        name: this.loanState ? this.loanState : '',
        class: classN,
        active: true
      }
    },
    ...mapGetters([
      'loanDetailData',
    ]),
  },
  filters: {
    //如果创建时间是当年则不显示年份,不是则不显示时间
    formatDate(time) {
        return _.getFormatTime(time);
    },
  },
  created() {
    this.titie = document.title;
    document.title = this.$t('i18n.reim.pages.loanDetail');
  },
  beforeDestroy() {
    document.title = this.titie;
    this.updateLoanDetail({isShow: false});
  },
  methods: {
    ...mapMutations([
      'updateLoanDetail',
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';

  .loanbursement-detail {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    padding-bottom: 80px;
    font-size: 15px;
    background-color: #F7F7F7;
    overflow-y: auto;

    .detail-item {
      margin-top: 10px;
    }
    .detail {
      padding: 15px;
      background-color: $color-background;
      .detail-title-name {
        display: inline-block;
        font-family: PingFangSC-Medium;
        color: #3F4A64;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 14px;
        white-space: pre-wrap;
      }
      .apply_status{
        margin-top: -3px;
      }
      .detail-title-status {
        color: #1AAD19;
        border: 1px solid #1AAD19;
        font-size: 12px;
      }
      .detail-date-time {
        display: inline-block;
        color: $color-text-sub;
        font-size: $font-size-small;
        margin-right: 10px;
      }
      .detail-date-name {
        color: $color-text-sub;
        font-size: $font-size-small;
      }
      .detail-loan-No {
        display: inline-block;
        color: $color-text-sub;
        font-size: $font-size-small;
        margin-top: 15px;
      }
    }
  }
</style>
