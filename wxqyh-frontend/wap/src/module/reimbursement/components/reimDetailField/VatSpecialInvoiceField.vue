<template>
  <div>
    <qw-cell
      :label="$t(`i18n.reim.field.${field.field}`)"
      :isMust="field.isMust === '1'"
      :hasArrow="true">
      <select
        slot="title"
        class="qwui-invoice_select"
        v-model="fieldValue.vatSpecialInvoice">
        <option :value="0">{{$t('i18n.reim.editor.no')}}</option>
        <option :value="1">{{$t('i18n.reim.editor.yes')}}</option>
      </select>
    </qw-cell>
    <div class="qwui-inovie_info" v-if="isInfoMust">
      <qw-cell
        :label="$t('i18n.reim.editor.invoiceNumber')"
        :isMust="isInfoMust">
        <input
          slot="title"
          class="qwui-field_input"
          type="tel"
          :placeholder="$t('i18n.pleaseEnter')"
          maxlength="12"
          @input="filterInput"
          v-model="fieldValue.invoiceNumber"/>
      </qw-cell>
      <qw-cell
        :label="$t('i18n.reim.editor.noTaxesMoney')"
        :isMust="isInfoMust">
        <input
          slot="title"
          class="qwui-field_input"
          type="text"
          :placeholder="$t('i18n.pleaseEnter')"
          :value="fieldValue.noTaxesMoney"
          @input="limitMoney($event, 'noTaxesMoney')"/>
      </qw-cell>
       <qw-cell
        :label="$t('i18n.reim.editor.taxesMoney')"
        :isMust="isInfoMust">
        <input
          slot="title"
          class="qwui-field_input"
          type="text"
          :placeholder="$t('i18n.pleaseEnter')"
          :value="fieldValue.taxesMoney"
          @input="limitMoney($event, 'taxesMoney')"/>
      </qw-cell>
      <qw-cell
        :label="$t('i18n.reim.editor.adValorem')"
        :isMust="field.isMust === '1'"
        :title="`¥ ${Number(fieldValue.adValorem).toFixed(2)}`"
      >
        <p class="qwui-tip qwui-warn_tip" slot="tip" v-if="errorMsg">{{errorMsg}}</p>
      </qw-cell>
    </div>
  </div>
</template>

<script>
import QwCell from './Cell';
import { addNum } from '../../js/common';

export default {
  name: 'QwVatSpecialInvoiceField',
  components: {
    QwCell,
  },
  props: {
    field: Object,
    fieldValue: Object,
  },
  data() {
    return {
      errorMsg: '',
      isInfoMust: false,
    }
  },
  computed: {
    // 价税合计=不含税金额+税额，根据不含税金额、税额的数字相加得出
    adValorem(){
      return addNum(this.fieldValue.noTaxesMoney, this.fieldValue.taxesMoney) || 0;
    },
  },
  created() {
    if (this.fieldValue.vatSpecialInvoice === '') {
      this.fieldValue.vatSpecialInvoice = 0;
    }
  },
  mounted() {
    this.checkadValorem();
  },
  watch: {
    adValorem(adValorem) {
      this.fieldValue.adValorem = adValorem;
      this.checkadValorem();
    },
    // 报销金额改变时检查金额是否相等
    ['fieldValue.money'](money) {
      this.checkadValorem();
    },
    // 选择是否增值发票
    ['fieldValue.vatSpecialInvoice']: {
      immediate: true,
      handler(flag) {
        if (flag == 0) {
          this.fieldValue.noTaxesMoney = '';
          this.fieldValue.taxesMoney = '';
          this.fieldValue.invoiceNumber = '';
          this.fieldValue.adValorem = '';
          this.errorMsg = '';
          this.isInfoMust = false;
        } else {
          this.isInfoMust = true;
        }
      }
    }
  },
  methods: {
    // 不含税金额：仅支持数字、限制最长十位数,最多两位小数
    limitMoney(e, field) {
      let match = e.target.value.match(/^\d{1,8}\.\d{0,2}|\d{1,8}/);

      e.target.value = match ? match[0] : '';
      this.fieldValue[field]= match ? match[0] : '';
    },
    // 发票号码：仅支持数字输入，最多可输入12位数字
    filterInput(e) {
      let invoiceNumber = e.target.value.replace(/[^\d]/g, '');

      this.fieldValue.invoiceNumber = invoiceNumber;
      e.target.value = invoiceNumber;
    },
    // 加税合计的金额必须等于该报销明细字段的金额，若不等于，则出现提示语：价税合计不等于报销金额XX元，请重新核实填写
    checkadValorem() {
      let adValorem = parseFloat(this.fieldValue.adValorem || 0);
      let detailMoney = parseFloat(this.fieldValue.money || 0);

      if (detailMoney !== adValorem) {
        this.errorMsg = this.$t('i18n.reim.editor.checkadDetailValorem').replace('xx', detailMoney.toFixed(2));
        // `价税合计不等于报销金额${detailMoney.toFixed(2)}元，请重新核实填写`;
      } else {
        this.errorMsg = '';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/common.scss';

  .qwui-invoice_select {
    flex: 1;
    line-height: 20px;
    direction: rtl;
    font-size: $font-size-medium-x;
    background: $color-background;
    border: none;
  }
</style>
