<template>
  <div class="qw-from-number">
    <qw-input v-model="currentValue"
              inputType="base"
              :inputTips="placeholder"
              @blur="onBlur"></qw-input>
    <span v-if="type ==='percent'">%</span>
  </div>
</template>
<script>
import QwInput from "@/components/qwuiBase/qwuiInput/qwuiInput";
import { customNumber } from "crm/utils/common";
export default {
  name: "qwFormNumber",
  components: { QwInput },
  props: {
    placeholder: {
      default: "请输入"
    },
    value: null,
    type: {
      default: "integer",
      validator(val) {
        // 整数 小数 百分数
        return ["number", "integer", "decimals", "percent"].includes(val);
      }
    }
  },
  data() {
    return {
      currentValue: ""
    };
  },
  watch: {
    currentValue(val, oldVal) {
      this.$emit("input", val);
    },
    value(val) {
      this.currentValue = val;
    }
  },
  mounted() {
    this.currentValue = this.value;
  },
  methods: {
    onBlur() {
      this.$emit("blur");
    },
    // 错误提示
    valid(value = this.currentValue, type = this.type) {
      if (value) {
        let _obj = customNumber.find(item => {
          return item.key === type;
        });
        if (_obj) {
          if (!_obj.reg.test(value)) {
            return _obj.tips;
          }
        }
      }
      return "";
    }
  }
};
</script>
<style lang="scss" scoped>
.qw-from-number {
  span {
    margin-left: 5px;
  }
}
</style>
