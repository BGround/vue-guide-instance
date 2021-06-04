<template>
  <span>
    <vue-datepicker-local
      v-model="msg"
      :disabled-date="disabledDate"
      format="YYYY-MM-DD HH:mm:ss"
      :placeholder="objConfig.placeholder"
      show-buttons
      clearable
      @confirm="handleBlur"
    ></vue-datepicker-local>
  </span>
</template>

<script>
import Base from '../../../../mixins/base';
import Validate from '../../../../mixins/validate'
import vueDatepickerLocal from "vue-datepicker-local";

export default {
  name: 'vueDatepicker',

  mixins: [ Base, Validate ],

  components: {
    vueDatepickerLocal,
  },

  props: {
    //选项的配置
    objConfig: {
      type: Object,
      required: true
    },
    objVal: {
      required: true
    },
    objKey: {
      type: Array,
      required: true
    },
    EVENT_BUS: {
      type: Object,
      required: true
    },
    keyArr: {
      type: Array,
      required: true
    },
    parentName: {
      type: String,
      required: true
    },
    //已选的开始时间
    startTime: {
      required: false
    },
    //该组件所对应的校验状态
    validateObj: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
      keyName: this.objKey,
      validateState: '',
      validateMessage: ''
    }
  },

  computed: {},

  watch: {},

  created() {
  },

  methods: {
    handleBlur() {
      return this.validate();
    },
    disabledDate (time, format) {
      let date = (this.startTime && new Date(this.startTime)) || new Date();
      let lastDate = date.getTime() - (date.getHours() * 60 * 60 * 1000 + date.getMinutes()  * 60 * 1000 + date.getSeconds() * 1000);
      return time.getTime() < lastDate;
    },
  },

}
</script>

<style lang="scss" scoped>
/* @import '../style/qwInput' */
.qwui-addExam_datepicker {
  display: inline-block;
}
</style>
