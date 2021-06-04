<template>
  <qw-cell
    :label="$t(`i18n.reim.field.${field.field}`)"
    :title="fieldValue.deptName || $t('i18n.pleaseSelect')"
    :isMust="field.isMust === '1'"
    :hasArrow="true"
    @click="selectDept"
  >
  </qw-cell>
</template>

<script>
import { mapMutations } from 'vuex';
import QwCell from './Cell';

export default {
  name: 'QwDeptField',
  props: {
    field: Object,
    fieldValue: Object,
  },
  components: {
    QwCell,
  },
  methods: {
    // 部门选择
    selectDept() {
      this.updateViewScrollLock(true);
      let { deptId, deptName } = this.fieldValue;
      let data = this.fieldValue.deptId ? { id: deptId, departmentName: deptName } : '';
      this.updateDeptSelectConfirm({
        data,
        index: this.index,
        callBack: {
          confirm: (data) => {
            this.updateViewScrollLock(false);
            if (!data.dept.data.length) { return; }

            const { id, departmentName } = data.dept.data[0];

            this.fieldValue.deptId = id;
            this.fieldValue.deptName = departmentName;
          },
          close: () => {
            this.updateViewScrollLock(false);
          }
        }
      })
    },
    ...mapMutations([
      'updateViewScrollLock',
      'updateDeptSelectConfirm'
    ])
  }
}
</script>
