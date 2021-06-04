<!--
    @param option：单选数据 [Object, String]
    @param hasLabel: 此单选是否有label Boolean

    用法：

    1. 当单选的label和单选的value不相同时，且需要禁用此单选框
    <crm-radio v-model="radioValue" :option="option"></crm-radio>

    data() {
      return {
        option: {
          label: 'radio label',
          value: 'radio1',
          disabled: true 
        },
        radioValue:  'radio2'    // 单选栏组的值
      }
    }

    2. 当label和value相同时，且不需要禁用此单选框。可选择用String类型传入option
    data() {
      return {
        option: 'radio1'
      }
    }
-->
<template>
  <div class="crmRadio"
       :class="_radioClass">
    <label class="radio-container">
      <input type="radio"
             class="radio-input"
             v-model="radioValue"
             :disabled="option.disabled"
             :value="option.value || option">
      <i class="iconfont  icon-radio">
        <i></i>
      </i>
      <slot>
        <span v-if="hasLabel"
              class="radio-label">{{option.label || option}}</span>
      </slot>
    </label>
  </div>
</template>

<script>
const EVENT_INPUT = "input";
export default {
  props: {
    value: [String, Number, Boolean],
    option: {
      type: [Object, String, Number],
      required: true
    },
    hasLabel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      radioValue: this.value
    };
  },
  computed: {
    _radioClass() {
      let option = this.option;
      return {
        radio_selected: this.radioValue === (this.option.value || this.option),
        radio_disabled: option.disabled
      };
    }
  },
  watch: {
    value(newV) {
      this.radioValue = newV;
    },
    radioValue(newV) {
      this.$emit(EVENT_INPUT, newV);
    }
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.crmRadio {
  position: relative;
  display: inline-block;
  font-size: 14px;
  .radio-container {
    position: relative;
    display: flex;
    justify-content: center;
  }
}
.crmRadio {
  .radio-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    margin: 0;
    &::before {
      content: normal;
    }
  }
  .icon-radio {
    position: relative;
    font-size: 16px;
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 1px solid #cbcbcb;
    line-height: 1;
    color: transparent;
    background-color: currentColor;
    border-radius: 50%;
    &::before,
    i {
      transition: all 0.2s;
    }
    i {
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transform: scale(0.4);
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50%;
        height: 50%;
        transform: translate(-50%, -50%);
        background-color: currentColor;
        border-radius: 50%;
      }
    }
  }
}
.crmRadio.radio_selected {
  &.radio_selected {
    .icon-radio {
      i {
        transform: scale(1);
        color: #f87b00;
      }
    }
  }
}
.crmRadio.radio_disabled {
  &.radio_selected {
    .icon-radio {
      background-color: #eee;
      i {
        color: #cbcbcb;
      }
    }
  }
}
</style>