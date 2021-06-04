<template>
  <qw-cell :label="$t(`i18n.reim.field.${field.field}`)" :isMust="field.isMust === '1'">
    <input
      class="money-input qwui-field_input"
      slot="title"
      :value="fieldValue.money"
      @input="limitMoney"
      @blur="filterMoney"
      type="text"
      placeholder="0.00"/>
    <p class="qwui-tip qwui-warn_tip" v-if="this.$parent.warn.limitMoney" slot="tip">{{this.$parent.warn.limitMoney}}</p>
    <p class="qwui-tip qwui-warn_tip" v-if="this.$parent.warn.limitBudget" slot="tip">{{this.$parent.warn.limitBudget}}</p>
    <p class="qwui-tip qwui-warn_tip" v-if="this.warn.control" slot="tip">{{warn.control}}</p>
  </qw-cell>
</template>

<script>
import QwCell from './Cell';

export default {
  name: 'QwMoneysField',
  components: {
    QwCell,
  },
  props: {
    field: Object,
    fieldValue: Object,
  },
  data() {
    return {
      warn: {
        control: '',
      }
    }
  },
  watch: {
    // 如果有城市控制提示选择城市
    ['fieldValue.control'](control) {
      if (control == 1) {
        this.fieldValue.cityName = '';
        this.fieldValue.cityId = '';
        this.warn.control = '';
      } else if (control == 2 && this.fieldValue.cityId == '') {
        this.warn.control = this.$t('i18n.reim.editor.chooseCity');
      }
    },
    // 如果已经有城市id则清空提示
    ['fieldValue.cityId'](cityId) {
      if (this.fieldValue.control == 2 && cityId != '') {
        this.warn.control = '';
      }
    },
  },
  methods: {
    // 限制最长十位数,最多两位小数
    limitMoney(e) {
      let match = e.target.value.match(/^\d{1,8}\.\d{0,2}|\d{1,8}/);
      e.target.value = match ? match[0] : '';
      this.fieldValue.money= match ? match[0] : '';
    },
    filterMoney(e) {
      this.$parent.checkMoney();
    },
  }
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/common.scss';

  .money-input {
    color: $color-sub-theme;
  }
</style>
