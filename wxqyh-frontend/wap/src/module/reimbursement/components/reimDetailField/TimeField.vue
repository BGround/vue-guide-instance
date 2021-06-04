<template>
  <qw-cell 
    :label="$t(`i18n.reim.field.${field.field}`)"
    :isMust="field.isMust === '1'">
    <div class="qwui-time_wrap" slot="title">
      <qw-select-time
        class="qwui-time"
        :defaultTime="fieldValue.time"
        timeType="start"
        @change="changeTime"
        @confirmChange="this.$parent.checkCostCenter"
      ></qw-select-time>
      <span class="qwui-blank">{{$t('i18n.reim.editor.to')}}</span>
      <qw-select-time
        class="qwui-time"
        :defaultTime="fieldValue.endTimes"
        timeType="end"
        @change="changeTime"
        @confirmChange="this.$parent.checkCostCenter"
      ></qw-select-time>
    </div>
    <p class="qwui-tip qwui-warn_tip" slot="tip" v-if="errorMsg">{{errorMsg}}</p>
    <p class="qwui-tip qwui-warn_tip" slot="tip" v-if="fieldValue.costCenterMessage">{{fieldValue.costCenterMessage}}</p>
  </qw-cell>
</template>

<script>
import QwCell from './Cell';
import QwSelectTime from '../base/SelectTime';

export default {
  name: 'QwTimeField',
  components: {
    QwCell,
    QwSelectTime
  },
  props: {
    field: Object,
    fieldValue: Object,
  },
  data() {
    return {
      errorMsg: '',
    }
  },
  methods: {
    // 产生日期改变
    changeTime(time, type) {
      if (type == 'start') {
        if (this.fieldValue.time != time) {
          this.fieldValue.time = time;
          this.$parent.checkMoney();
        }
      } else {
        if (this.fieldValue.endTimes != time) {
          this.fieldValue.endTimes = time;
          this.$parent.checkMoney();
        }
      }
      let startStamp = new Date(this.fieldValue.time);
      let endStamp = new Date(this.fieldValue.endTimes);

      if (startStamp > endStamp) {
        this.errorMsg = this.$t('i18n.reim.editor.startNotLaterThanEnd');
      } else {
        this.errorMsg = '';
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~../../styles/common.scss';

.qwui-time_wrap {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  height: 20px;
  line-height: 20px;

  .qwui-time {
    display: flex;
    align-items: center;
  }

  .qwui-blank {
    font-size: $font-size-medium-x;
    color: $color-text-sub;
    margin: 0 3px;
  }
}

</style>

