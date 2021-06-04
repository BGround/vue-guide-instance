<template>
  <qw-cell
    :label="$t(`i18n.reim.field.${field.field}`)"
    :title="fieldValue.projName || $t('i18n.pleaseSelect')"
    :hasArrow="true"
    :isMust="field.isMust === '1'"
    @click="selectProject">
  </qw-cell>
</template>

<script>
import { mapMutations } from 'vuex';
import QwCell from './Cell';

export default {
  name: 'QwReimProjectField',
  props: {
    field: Object,
    fieldValue: Object,
  },
  components: {
    QwCell,
  },
  methods: {
    selectProject() {
      this.updateViewScrollLock(true);
      this.updateTreeSelectConfig({
        isShow: true,
        treeType: 'showProjectData',
        data: this.fieldValue.projId ? { id: this.fieldValue.projId, name: this.fieldValue.projName } : '',
        callBack: {
          confirm: (selected) => {
            this.updateViewScrollLock(false);
            if (selected && selected.id) {
              this.fieldValue.projId = selected.id;
              this.fieldValue.projName = selected.name;

              this.$parent.checkMoney();
              this.$parent.checkCostCenter();
            }
          },
          close: () => {
            this.updateViewScrollLock(false);
          }
        }
      });
    },
    ...mapMutations([
      'updateViewScrollLock',
      'updateTreeSelectConfig'
    ])
  }
}
</script>

<style lang="scss" scoped>
</style>

