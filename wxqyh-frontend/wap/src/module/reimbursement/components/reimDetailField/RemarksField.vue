<template>
  <div class="qwui-remarks_field border-bottom-1px">
    <qw-cell 
      :label="$t(`i18n.reim.field.${field.field}`)"
      :hasBottomBorder="false"
      :isMust="field.isMust === '1'">
    </qw-cell>
    <qw-remarks-textarea
      slot="title"
      class="qwui-reim_remarks"
      v-model="fieldValue.remark"
      :initRows="3"
      :maxLength="300"
    ></qw-remarks-textarea>
  </div>
</template>

<script>
import QwRemarksTextarea from '../base/RemarksTextarea';
import QwCell from './Cell';

export default {
  name: 'QwRemarksField',
  components: {
    QwCell,
    QwRemarksTextarea
  },
  props: {
    field: Object,
    fieldValue: Object,
  },
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';

  .qwui-remarks_field {
    padding-bottom: $box-padding;
    .qwui-reim_remarks {
      padding-right: $box-padding;
    }
  }
</style>
