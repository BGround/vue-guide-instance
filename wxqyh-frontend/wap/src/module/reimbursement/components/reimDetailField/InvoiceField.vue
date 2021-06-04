<template>
  <qw-cell 
    :label="$t(`i18n.reim.field.${field.field}`)"
    :isMust="field.isMust === '1'">
    <input
      slot="title"
      class="qwui-field_input"
      type="tel"
      placeholder="0"
      :value="fieldValue.invoice"
      @input="integerFilter"/>
  </qw-cell>
</template>

<script>
import QwCell from './Cell';

export default {
  name: 'QwInvoiceField',
  components: {
    QwCell,
  },
  props: {
    field: Object,
    fieldValue: Object,
  },
  methods: {
    // 保留整数
    integerFilter(e) {
      let match = e.target.value.match(/[0]|[1-9][0-9]{0,2}/);
      let integer = match ? match[0] : '';

      this.fieldValue.invoice = integer;
      e.target.value = integer;
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~../../styles/common.scss';
</style>
