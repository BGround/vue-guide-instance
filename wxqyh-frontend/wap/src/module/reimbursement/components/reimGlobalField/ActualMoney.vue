<template>
  <qw-cell
    class="qwui-actual_money"
    v-if="isShow"
    :label="$t(`i18n.reim.field.${field.field}`)"
    :isMust="field.isMust"
    :style="{paddingLeft: '15px'}">
    <input
      slot="title"
      class="qwui-field_input"
      type="text"
      :placeholder="$t('i18n.pleaseEnter')"
      :value="vo['tbQyReimbursementPO.actualMoney']"
      @input="limitMoney"
      @blur="restrictMoney"/>
  </qw-cell>
</template>

<script>
import QwCell from '../reimDetailField/Cell';

export default {
  name: 'QwActualMoney',
  props: {
    field: Object,
    vo: Object
  },
  components: {
    QwCell,
  },
  computed: {
    isShow() {
      return this.field && this.$route.name === 'approveredit';
    }
  },
  methods: {
    // 限制最长十位数,最多两位小数
    limitMoney(e) {
      let match = e.target.value.match(/^\d{1,8}\.\d{0,2}|\d{1,8}/);
      e.target.value = match ? match[0] : '';
      this.vo['tbQyReimbursementPO.actualMoney'] = match ? match[0] : '';
    },
    //输入框失去焦点的时候判断实付金额
    restrictMoney() {
      let actualMoney = this.vo['tbQyReimbursementPO.actualMoney'];
      let totalMoney = this.vo['tbQyReimbursementPO.totalMoney'];
      this.vo['tbQyReimbursementPO.actualMoney'] = actualMoney > totalMoney ? totalMoney : actualMoney
    },
  }
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';
</style>

