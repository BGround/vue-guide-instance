<template>
  <div class="qwui-loan-container border-bottom-1px">
    <qw-cell
      :label="field.fieldName"
      :hasBottomBorder="false"
      :isMust="field.isMust && isRelation === 1"
      @click="selectLoan">
      <span v-if="!isApproveredit" class="qwui-add_icon" slot="title">{{iconText}}</span>
    </qw-cell>
    <div v-if="vo['tbQyReimbursementPO.loanId']">
      <qw-relation-card
        class="qwui-relaction_card"
        :isShowOperate="!isApproveredit"
        :relationData="loanInfo"
        @chooseRelation="getLoanDetail"
        @deleteRelation="deleteLoan"
        ></qw-relation-card>
    </div>
  </div>
</template>

<script>
import QwCell from '../reimDetailField/Cell';
import QwRelationCard from '../reimbursement/RelationCard';
import { getLoanDetail } from '../../api/editor';
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'QwLoan',
  components: {
    QwCell,
    QwRelationCard,
  },
  props: {
    field: Object,
    vo: Object,
    totalMoney: [Number, String],
    isRelation: Number,
  },
  computed: {
    isApproveredit() {
      return this.$route.name === 'approveredit';
    },
    iconText() {
      return this.vo['tbQyReimbursementPO.loanId'] ? this.$t('i18n.reim.editor.relactionChange') : this.$t('i18n.reim.editor.relactionAdd');
    },
    // 借款单信息
    loanInfo() {
      if (this.selectLoanData != null ) {
        const { loanId, title, repayDate } = this.selectLoanData;
        return {
          title: this.$t('i18n.reim.loan'),
          name: title,
          price: `${this.$t('i18n.reim.verificationMoney')}：${this.vo['tbQyReimbursementPO.verificationMoney']}`,
          time: `${this.$t('i18n.reim.repayDate')}：${repayDate}`,
        };
      }
    },
    ...mapGetters([
      'selectLoanData',
    ])
  },
  watch: {
    totalMoney(totalMoney) {
      if (totalMoney) {
        this.calculateVerificationMoney();
      }
    },
  },
  methods: {
    selectLoan() {
      if (this.isApproveredit) {  return; }

      this.updateViewScrollLock(true);
      this.updateRelationConfig({
        isShow: true,
        type: 'loan',
        data: this.vo['tbQyReimbursementPO.loanId'],
        callBack: {
          confirm: (selected) => {
            this.updateViewScrollLock(false);
            this.setLoanData(selected);
            this.vo['tbQyReimbursementPO.loanId']= selected.loanId;
            this.calculateVerificationMoney();
          },
          close: () => {
            this.updateViewScrollLock(false);
          }
        }
      });
    },
    // 借款单待还借款≥报销金额：核销金额=报销金额。
    // 借款单待还借款<报销金额：核销金额=借款单待还借款
    calculateVerificationMoney() {
      const surplusMoney = this.selectLoanData ? this.selectLoanData.surplusMoney : '';
      const totalMoney = this.totalMoney;

      if (surplusMoney >= this.totalMoney) {
        this.vo['tbQyReimbursementPO.verificationMoney'] = totalMoney;
      } else {
        this.vo['tbQyReimbursementPO.verificationMoney'] = surplusMoney;
      }
    },
    // 获取借款单详情
    getLoanDetail() {
      _.showLoading();
      getLoanDetail({ loanId: this.vo['tbQyReimbursementPO.loanId']}).then(res => {
        this.updateLoanDetail({isShow: true, data: res.data.data});
        _.hideLoading();
      })
    },
    // 删除借款单
    deleteLoan() {
      this.vo['tbQyReimbursementPO.loanId'] = '';
      this.vo['tbQyReimbursementPO.verificationMoney'] = '';
      this.setLoanData(null);
    },
    ...mapMutations([
      'updateViewScrollLock',
      'updateRelationConfig',
      'updateLoanDetail',
      'setLoanData'
    ])
  }
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';

  .qwui-loan-container {
    padding-left: 15px;
    background: $color-background;
    overflow: hidden;

    .qwui-relaction_card {
      margin: 0 $box-padding $box-padding 0;
    }

    .qwui-add_icon {
      flex: 1;
      text-align: right;
      font-size: $font-size-medium-s;
      color: $color-sub-theme;
    }
  }
</style>
