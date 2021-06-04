<template>
  <div class="qwui-selectTime">
    <datetime v-model="minuteListValueS" :readonly="readonly" :clear-text="$t('i18n.today')" @on-clear="setTodayS" format="YYYY-MM-DD" @on-change="change" year-row="{value}年" month-row="{value}月" day-row="{value}日" :confirm-text="$t('i18n.sure')" :cancel-text="$t('i18n.cancel')"></datetime>
  </div>
</template>

<script>
  import Datetime from 'vux/src/components/datetime';
  import * as timeUtil from '../../../../assets/js/time-util';


  export default {
    props:["dataDetailMsg","readonly"],
    data(){
      return {
        resetLimitDate: '',
        minuteListValueS:'请选择',
      }
    },
    watch: {
      dataDetailMsg: function (val) { // 编辑页面使用，传入旧数据
        this.minuteListValueS = val;
      },
      minuteListValueS: function (val) {
        this.resetLimitDate = val.substring(0,10);
      }
    },
    components:{Datetime},
    methods: {
      change (value) {
        this.$emit("listenToChild", this.minuteListValueS)
      },
      setDate (value) {
        let now = new Date()
        let cmonth = now.getMonth() + 1
        let day = now.getDate()
        if (cmonth < 10) cmonth = '0' + cmonth
        if (day < 10) day = '0' + day
        return now.getFullYear() + '-' + cmonth + '-' + day + ' '
      },
      setTodayS (value) {
        this.minuteListValueS = this.setDate();
      },
    }
  }

</script>

<style type="text/css">
  .qwui-selectTime{
    color: #333;
    font-size: 15px;
  }
</style>
