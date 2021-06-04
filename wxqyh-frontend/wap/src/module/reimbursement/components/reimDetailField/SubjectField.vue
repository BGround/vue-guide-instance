<template>
  <div>
    <qw-cell
      :label="$t(`i18n.reim.field.${field.field}`)"
      :title="fieldValue.subjFullName || $t('i18n.pleaseSelect')"
      :hasArrow="true"
      :isMust="field.isMust === '1'"
      @click="selectSubject"
    >
    </qw-cell>
    <qw-address
      v-if="fieldValue.control == 2"
      ref="address"
      :selectCityId="fieldValue.cityId"
      @addressChange="addressChange"
    ></qw-address>
  </div>
</template>

<script>
import QwAddress from '../base/Address';
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
    QwAddress
  },
  methods: {
    selectSubject() {
      let data = '';
      if (this.fieldValue.subjId) {
        data = {
          subjId: this.fieldValue.subjId,
          subjName: this.fieldValue.subjName,
          subjFullName: this.fieldValue.subjFullName,
          subjectParentsId: this.fieldValue.subjectParentsId,
          control: this.fieldValue.control,
        };
      }
      this.updateViewScrollLock(true);
      this.updateTreeSelectConfig({
        isShow: true,
        treeType: 'showSubjectData',
        data,
        callBack: {
          confirm: (selected) => {
            if (selected && selected.subjId) {
              this.fieldValue.subjId = selected.subjId;
              this.fieldValue.subjName = selected.subjName;
              this.fieldValue.subjFullName = selected.subjFullName;
              this.fieldValue.subjectParentsId = selected.subjectParentsId;
              this.fieldValue.control = selected.control;
            }
            this.$parent.checkMoney();
            this.$parent.checkCostCenter();
            this.updateViewScrollLock(false);
          },
          close: () => {
            this.updateViewScrollLock(false);
          }
        }
      })
    },
    // 地址改变
    addressChange(cityId, cityName) {
      this.fieldValue.cityId = cityId;
      this.fieldValue.cityName = cityName;
      this.$parent.checkMoney();
    },
    ...mapMutations([
      'updateViewScrollLock',
      'updateTreeSelectConfig'
    ])
  }
}
</script>
