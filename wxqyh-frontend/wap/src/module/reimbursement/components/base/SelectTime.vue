<template>
  <div class="qwui-date_container">
    <span class="qwui-date" @click="showPicker">{{time || this.$t('i18n.pleaseSelect')}}</span>
    <time-picker
      :min-year=1918
      :max-year=2050
      :show.sync="showTimePicker"
      :defaultDate="time"
      :dateOnly="true"
      @confirm="confirm"
    ></time-picker>
  </div>
</template>

<script>
import timePicker from '@/components/basicUI/qwuiPicker/time_picker.vue'

export default {
  name: 'QwSelectTime',
  components: {
    timePicker,
  },
  props: {
    defaultTime: String,
    timeType: String,
  },
  data() {
    return {
      showTimePicker: false,
      time: '',
    };
  },
  // 复制或重新编辑报销时，异步请求获取的日期需要watch
  // 如果没有指定日期则当天为默认值
  watch: {
    defaultTime: {
      immediate: true,
      handler(time) {
        const formatDate =  _.getFormatDate(new Date(), 'yyyy-MM-dd');

        this.time = time ? time : formatDate;
        this.$emit('change', this.time, this.timeType);
      }
    },
  },
  methods: {
    showPicker() {
      this.showTimePicker = true;
    },
    confirm(time) {
      this.$emit('change', time, this.timeType);
      this.$emit('confirmChange');
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable.scss';

  .qwui-date {
    font-size: $font-size-medium-x;
    color: $color-text-d;
    text-align: right;
    line-height: 19px;
    background: $color-background;
  }
</style>
