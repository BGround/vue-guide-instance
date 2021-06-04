<template>
  <div
    class="qwui-form_item qwui-form_item_hasLabel"
    :class="{ 'qwui-form_item_paddingTop' : !objConfig.needPaddingTop }"
  >
    <label class="qwui-form_item_label">{{ objConfig.title }}</label>
    <div class="qwui-form_item_content">
      <single-datepicker
        :objConfig="getObjConfig('开始时间')"
        :startTime="startTime"
        :objVal="objVal[0]"
        :objKey="getKeyArray(0)"
        :EVENT_BUS="EVENT_BUS"
        :keyArr="getKeyArray(0)"
        parentName="qwChooseDate"
        :validateObj="getValidateObj(0)"
      ></single-datepicker>
      <span class="content_midText">至</span>
      <single-datepicker
        :objConfig="getObjConfig('截止时间')"
        :startTime="objVal[0]"
        :objVal="objVal[1]"
        :objKey="getKeyArray(1)"
        :EVENT_BUS="EVENT_BUS"
        :keyArr="getKeyArray(1)"
        parentName="qwChooseDate"
        :validateObj="getValidateObj(1)"
      ></single-datepicker>
      <transition name="transition-drop">
        <div class="qwui-form_item_error_tip" v-if="showValidate">{{ validateInfo }}</div>
      </transition>
    </div>
  </div>
</template>

<script>
import singleDatepicker from './singleDatepicker.vue';

export default {
  name: 'qwChooseDate',

  components: {
    singleDatepicker
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
    startTime: {
      required: false
    }
  },

  data() {
    return {
      showValidate: '',
      validateInfo: '',
      validateObj: {},
    }
  },

  computed: {
    //比较结束事件是否早于开始事件
    compareStartEndDate() {
      let starDate = new Date(this.objVal[0]);
      let endDate = new Date(this.objVal[1]);
      if(starDate.getTime() > endDate.getTime()){
        return {
          validateState: 'error',
          validateMessage: '开始时间大于截止时间'
        }
      }else {
        return {
          validateState: 'success',
          validateMessage: ''
        }
      }
    },
  },

  watch: {},

  created() {
    this.$props.EVENT_BUS.$on('on-input-validate', obj => {
      if(obj.parentName !== 'qwChooseDate' || obj.keyArr[0] !== this.objKey[0]) return;
      if(!this.validateObj[obj.keyArr[0]]){
        this.validateObj[obj.keyArr[0]] = [
          {
            validateState: '',
            validateMessage: ''
          } ,
          {
            validateState: '',
            validateMessage: ''
          }
        ]
      }
      this.validateObj[obj.keyArr[0]].splice(obj.keyArr[1], 1, obj.validateObj);
      this.showValidateResult(this.validateObj[obj.keyArr[0]], obj.keyArr[1]);
      return false;
    })
  },

  mounted() {
    this.$props.EVENT_BUS.$emit('on-form-item-add', this);
  },
  beforeDestroy () {
    this.$props.EVENT_BUS.$emit('on-form-item-remove', this);
  },

  methods: {
    getObjConfig(message) {
      return {
        "rules": {
          "required": true,
          "message": message+'不能为空'
        },
        "placeholder": "选择" + message,
      }
    },
    getKeyArray(index) {
      return this.objKey.concat([index]);
    },
    getValidateObj(index) {
      return (this.validateObj[this.objKey[0]] && this.validateObj[this.objKey[0]][index]) || {
        validateState: '',
        validateMessage: ''
      }
    },
    //显示校验的结果
    showValidateResult(validateArray, index) {
      let resultArr = [...validateArray];
      index && resultArr.reverse();
      resultArr.push(this.compareStartEndDate);
      let flag = false;
      resultArr.forEach(item => {
        if (flag) return
        if(item.validateState === 'error') {
          this.showValidate = true;
          this.validateInfo = item.validateMessage;
          flag = true;
          return;
        }else {
          this.showValidate = false;
          this.validateInfo = '';
        }
      })
    },
    handleBlur() {
      this.showValidateResult(this.validateObj[this.objKey[0]], 0);
      if(this.validateState === 'error'){
        return this.returnPromise({status: false});
      }else {
        return this.returnPromise({status: true});
      }
    },
    //生成promise对象
    returnPromise(result) {
      return new Promise((resolve, reject) => {
        resolve(result);
      })
    },
  },

}
</script>

<style lang="scss" scoped>
/* @import '../style/qwInput' */
.qwui-form_item {
  line-height: normal;
  .qwwui-form_item_paddingTop {
    padding-top: 2px;
  }
  .content_midText {
    margin: 0 8px;
  }
  /deep/ .datepicker {
    >input {
      border: 1px solid #D5D5D5;
      box-shadow: none;
      -webkit-transition: all .2s ease-in-out;
      transition: border-color .2s ease-in-out;
      &:focus {
        outline: 0;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(255, 155, 0, 0.6)!important;
        border-color: #C31725!important;
      }
    }
    .datepicker-popup {
      line-height: normal;
    }
  }
}
</style>
