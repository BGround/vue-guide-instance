<template>
  <div class="qwui-creditType">
    <div class="creditType_marginBottom">
      <qwui-radio
        :label="objConfig.options[0].label"
        v-model="msg"
      >{{ objConfig.options[0].label }}</qwui-radio>
    </div>

    <!--通过后获得的学分-->
    <transition name="transition-drop">
      <qw-input
        v-if="objVal === '按考试是否通过分配学分'"
        :objConfig="objConfig.creditTypeOne"
        :objVal="objParent.creditTypeOne"
        :objKey="['examCreditType', 'creditTypeOne']"
        :EVENT_BUS="EVENT_BUS"
      >
        <div class="qwui-input_tailWrap" slot="description">
          <span class="qwui-input_head">通过后获得</span>
        </div>
        <div class="qwui-input_tailWrap">
          <span class="qwui-input_unit">学分</span>
        </div>
      </qw-input>
    </transition>

    <div class="creditType_marginTop creditType_marginBottom">
      <qwui-radio
        :label="objConfig.options[1].label"
        v-model="msg"
      >{{ objConfig.options[1].label }}</qwui-radio>
    </div>

    <!--通过考试分数分配学分-->
    <transition name="transition-drop"
        :key="index"
        v-if="objVal === '按考试分数分配学分'"
        v-for="(item, index) in objParent.creditTypeTwo"
    >
      <div class="creditType_score">
        <credit-input
          :placeholder="'≥'"
          :objVal="item[0]"
          :objKey="['examCreditType', 'creditTypeTwo', index, 0]"
          :keyArr="['examCreditType', 'creditTypeTwo', index, 0]"
          parentName="qwRadio"
          :validateObj="getValidateObj(index, 0)"
          :max="+max"
          min="0"
          :creditTypeTwoArray="objParent.creditTypeTwo"
          :EVENT_BUS="EVENT_BUS"
        ></credit-input>
        <span class="content_midText">至</span>
        <credit-input
          :placeholder="'≤'"
          :objVal="item[1]"
          :objKey="['examCreditType', 'creditTypeTwo', index, 1]"
          :keyArr="['examCreditType', 'creditTypeTwo', index, 1]"
          parentName="qwRadio"
          :validateObj="getValidateObj(index, 1)"
          :max="+max"
          min="0"
          :creditTypeTwoArray="objParent.creditTypeTwo"
          :EVENT_BUS="EVENT_BUS"
        ></credit-input>
        <span class="content_midText">考试得分，获得</span>
        <credit-input
          :objVal="item[2]"
          :objKey="['examCreditType', 'creditTypeTwo', index, 2]"
          :keyArr="['examCreditType', 'creditTypeTwo', index, 2]"
          parentName="qwRadio"
          :validateObj="getValidateObj(index, 2)"
          min="1"
          :EVENT_BUS="EVENT_BUS"
        ></credit-input>
        <span class="content_midText">学分</span>
        <span class="rule_add"
          v-if="objParent.creditTypeTwo.length == 1 || index == (objParent.creditTypeTwo.length-1)"
          @click="handleAddRule(index)"
        ></span>
        <span class="rule_delete"
          :class="{ 'delete_left' : index < (objParent.creditTypeTwo.length-1)}"
          v-if="objParent.creditTypeTwo.length>1"
          @click="handleDeleteRule(index)"
        ></span>
        <transition name="transition-drop">
          <div class="qwui-form_item_error_tip" v-if="getShowValidateArray[index]"> {{ getValidateInfoArray[index] }} </div>
        </transition>
      </div>
    </transition>

  </div>
</template>

<script>
  import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio'
  import qwInput from './qwInput'
  import creditInput from './creditInput'
  import Base from '../../../../mixins/base';
  import Validate from '../../../../mixins/validate'

  export default {
    name: 'qwRadio',

    mixins: [ Base, Validate ],

    components: { qwuiRadio, qwInput, creditInput },

    props: {
      //选项的配置
      objConfig: {
        type: Object,
        required: true
      },
      objVal: {
        required: true
      },
      objParent: {
        required: true
      },
      objKey: {
        type: Array,
        required: true
      },
      max: {
        required: true,
        default: 0
      },
      EVENT_BUS: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        keyName: this.objKey,
        validateObj: [],
      }
    },

    computed: {
      getShowValidateArray() {
        let resultArr = [];
        this.validateObj.forEach((item, index) => {
          let result;
          item.forEach((val, i) => {
            if(val.validateState === 'error'){
              result = true;
            }
          })
          resultArr.push(result);
        });
        return resultArr;
      },
      getValidateInfoArray() {
        let resultInfoArr = [];
        this.validateObj.forEach((item, index) => {
          let resultInfo;
          let flag = true;
          item.forEach((val, i) => {
            if(val.validateState === 'error' && flag){
              resultInfo = val.validateMessage;
              flag = false;
            }
          });
          resultInfoArr.push(resultInfo);
        });
        return resultInfoArr;
      }
    },

    watch: {
      //切换评分方式，清空保存各个输入框的校验结果对象
      objVal() {
        this.validateObj.splice(0);
      }
    },

    created() {
      this.$props.EVENT_BUS.$on('on-input-validate', obj => {
        const {parentName, keyArr, validateObj} = obj;
        if(parentName !== 'qwRadio') return;
        let keyIndex = keyArr[2], keyOrder = keyArr[3];
        this.validateObj[keyIndex].splice(keyOrder, 1, validateObj);
      })
    },

    methods: {
      getValidateObj(index, order) {
        if(!this.validateObj[index]){
          this.$set(this.validateObj, index, [], {
            validateState: '',
            validateMessage: ''
          });
        }
        if(!this.validateObj[index][order]){
          this.$set(this.validateObj[index], order, {
            validateState: '',
            validateMessage: ''
          });
        }
        return this.validateObj[index][order];
      },
      handleAddRule(index) {
        //在addExam组件中监听
        this.$props.EVENT_BUS.$emit('on-credit-rule-change', {
          type: 'add',
          index
        })
      },
      handleDeleteRule(index) {
        //在addExam组件中监听
        this.$props.EVENT_BUS.$emit('on-credit-rule-change', {
          type: 'delete',
          index
        })
        this.validateObj.splice(index,1);
      },
      getShowValidate(index) {
        let result;
        let validateArr = this.validateObj[index];
        validateArr.forEach((item,index) => {
          if(item.validateState === 'error'){
            result = false;
          }
        });
        return result;
      },
      getValidateInfo(index) {
        let result;
        let flag = true;
        let validateArr = this.validateObj[index];
        validateArr.forEach((item,index) => {
          if(item.validateState === 'error' && flag){
            result = item.validateMessage;
            flag = false;
          }
        });
        return result;
      },
    },

  }
</script>

<style lang="scss" scoped>
  /* @import '../style/qwInput' */
  .qwui-creditType {
    margin-left: 141px;
    .creditType_marginBottom {
      margin-bottom: 10px;
    }
    .creditType_marginTop {
      margin-top: 10px;
    }
    .creditType_score {
      margin-top: 10px;
    }
    .content_midText {
      margin: 0 4px;
    }
    .rule_add {
      position: relative;
      top: 2px;
      left: 7px;
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url("~assets/images/ic_add.png") center/16px 16px no-repeat;
      cursor: pointer;
      transition: all .2s ease-in-out;
      &:hover {
        transform: scaleX(1.2) scaleY(1.2);
      }
    }
    .rule_delete {
      position: relative;
      top: 2px;
      left: 12px;
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url("~assets/images/ic_delete.png") center/16px 16px no-repeat;
      cursor: pointer;
      transition: all .2s ease-in-out;
      &:hover {
        transform: scaleX(1.2) scaleY(1.2);
      }
      &.delete_left {
        left: 7px;
      }
    }
  }
</style>
