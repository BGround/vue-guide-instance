<template>
  <div class="qwui-receipt">
    <qw-cell
      class="qwui-receipt_head"
      :label="$t(`i18n.reim.field.${field.field}`)"
      :hasBottomBorder="true" >
      <div class="qwui-bank_load" slot="title">
        <span class="qwui-bank_load_last">{{$t('i18n.reim.loadLast')}}</span>
        <switch-btn v-model="bankSwitch"></switch-btn>
      </div>
    </qw-cell>
    <div class="qwui-receipt_info">
      <qw-cell
        :label="$t('i18n.reim.receiptFullName')"
        :isMust="field.isMust"
        :hasBottomBorder="true">
        <input
          slot="title"
          class="qwui-field_input"
          type="text"
          :placeholder="$t('i18n.pleaseEnter')"
          v-model="vo['tbQyReimbursementPO.receiptFullName']"/>
      </qw-cell>
      <qw-cell
        :label="$t('i18n.reim.bankAccount')"
        :isMust="field.isMust"
        :hasBottomBorder="true">
        <input
          slot="title"
          class="qwui-field_input"
          type="tel"
          :placeholder="$t('i18n.pleaseEnter')"
          maxlength="30"
          v-model="vo['tbQyReimbursementPO.bankAccount']"
          @input="bankAccountInput"
          @blur="getBankName"/>
      </qw-cell>
      <qw-cell
        :label="$t('i18n.reim.depositBank')"
        :isMust="field.isMust"
        :hasBottomBorder="true">
        <input
          slot="title"
          class="qwui-field_input"
          type="text"
          :placeholder="$t('i18n.pleaseEnter')"
          v-model="vo['tbQyReimbursementPO.depositBank']"/>
      </qw-cell>
    </div>
  </div>
</template>

<script>
import QwCell from '../reimDetailField/Cell';
import SwitchBtn from '@/components/form/switchBtn';
import { getLastReceiptAccount, getBankName } from '../../api/editor';

export default {
  name: 'QwReceiptAccount',
  props: {
    field: Object,
    vo: Object,
  },
  components: {
    QwCell,
    SwitchBtn
  },
  data() {
    return {
      bankSwitch: false,
    }
  },
  watch: {
    // 加载上次收款信息
    bankSwitch(flag) {
      if (flag == 1) {
        getLastReceiptAccount().then(res => {
          const bank = res.data.receiptAccount;

          this.vo['tbQyReimbursementPO.receiptFullName'] = bank.receiptFullName;
          this.vo['tbQyReimbursementPO.bankAccount'] = bank.bankAccount;
          this.vo['tbQyReimbursementPO.depositBank'] = bank.depositBank;
        });
      } else {
        this.vo['tbQyReimbursementPO.receiptFullName'] = '';
        this.vo['tbQyReimbursementPO.bankAccount'] = '';
        this.vo['tbQyReimbursementPO.depositBank'] = '';
      }
    },
  },
  methods: {
    // 保留整数
    bankAccountInput(e) {
      let reg = /[^\d]/g;
      let bankAccount = e.target.value.replace(reg, '');

      this.vo['tbQyReimbursementPO.bankAccount'] = bankAccount;
      e.target.value = bankAccount;
    },
     // 根据银行卡获取开户银行
    getBankName() {
      const bankAccount = this.vo['tbQyReimbursementPO.bankAccount'];

      if ( bankAccount != '') {
        getBankName({cardId: bankAccount}).then(res => {
          if (res.data.bankName) {
            this.vo['tbQyReimbursementPO.depositBank'] = res.data.bankName;
          } else {
            this.vo['tbQyReimbursementPO.depositBank'] = '';
          }
        }).catch(err => {
          this.vo['tbQyReimbursementPO.depositBank'] = '';
        });
      }
    },
  }

}
</script>

<style lang="scss" scoped>
@import '~../../styles/common.scss';

  .qwui-receipt {
    background: #fff;

    .qwui-receipt_head {
      padding-left: 15px;
      .qwui-bank_load {
        flex: 1;
        align-items: center;
        padding-right: 45px;
        font-size: 13px;
        color: #888;
        text-align: right;
      }
    }

    .qwui-receipt_info {
      padding-left: 15px;
    }
  }
</style>

