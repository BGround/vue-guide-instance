<template>
  <div class="qwui-global_remark"
        :class="{'ismust': field.isMust == '1'}">
    <div class="qwui-remark_label">{{$t('i18n.reim.field.globalRemarks')}}</div>
    <qw-textarea
      :placeholder="$t('i18n.pleaseEnter')"
      :readonly="false"
      v-model="vo['tbQyReimbursementPO.globalRemark']"
      :initRows="3"
      :maxLength="300"
    ></qw-textarea>
  </div>
</template>

<script>
import QwTextarea from '../customField/textarea';
import QwCell from '../reimDetailField/Cell';

export default {
  name: 'QwGlobalRemarks',
  components: {
    QwCell,
    QwTextarea
  },
  props: {
    field: Object,
    vo: Object,
  },
}
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';

  .qwui-global_remark {
    margin-top: 10px;
    font-size: 17px;
    padding: 15px;
    background-color: $color-background;

    &.ismust {
      .qwui-remark_label::after {
        content: ' *';
        color: $color-text-warn;
      }
    }
    .qwui-remark_label{
      padding-bottom: 10px;
    }
  }
</style>
