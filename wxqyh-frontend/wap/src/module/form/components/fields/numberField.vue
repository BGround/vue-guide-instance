<template>
    <div class="field-content">
         <input class="text-field"
			          type="number"
			          :class="{'text-field-help':field.help,'readOnly':field.readonly || field.disabled}"
                :value="field.value"
                :disabled="field.readonly||field.disabled"
                @blur="setValue($event),validate()">
        <!--@input="setValue($event,field)"-->
		<div class="help-block" v-show="field.validations&&field.validations.indexOf('iscapital')!=-1">{{'大写金额￥：'+ smalltoBIG(field.value)}}</div>
	</div>
</template>
<script>
import { calculator, convertCurrency } from "../../js/getData";
import { field_validation } from "./validation.js";
export default {
  //['field','isChildField'],
  props: {
    field: {
      type: Object,
      required: true
    },
    isChildField: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    if (this.field.value) {
      this.setCalculator();
    }
  },
  methods: {
    smalltoBIG(n) {
      if (!n) return "";
      if (
        this.field.validations &&
        this.field.validations.indexOf("iscapital") != -1
      ) {
        return convertCurrency(n);
      }
    },
    //转换精度
    toFixed(value, accurate_num) {
      if (accurate_num == 0 || value < Number.MIN_SAFE_INTEGER || value > Number.MAX_SAFE_INTEGER) {
        return value;
      }
      accurate_num = accurate_num < 0 ? 0 : accurate_num;
      return Number(value).toFixed(accurate_num)
    },
    setValue({ target }, type) {
      var key = this.field._id;
      var value = target ? target.value : this.field.value;
      if (value) {
        value = this.toFixed(value, this.field.accurate_num);
      }
      target && (target.value = value);
      this.$emit("change", { key, value }, false, false, type);
      this.setCalculator();
    },
    //设置计算式的值
    setCalculator() {
      //不是详情页进行计算式计算
      if (this.$route.path === "/detail") {
        if (!this.$store.state.detail.isEditForm) {
          return;
        }
      }
      var field = this.field;
      //判断是否有计算式要计算
      var _this = this,
        store = this.$store,
        formData = {},
        equationMatch = null,
        equationList = null,
        schema,
        showMap = {},
        equationDisabled = {},
        schemaData;
      //子表单的计算式
      if (this.isChildField) {
        equationList = this.$parent.equationList;
        equationMatch = this.$parent.equationMatch;
        var index = this.$parent.index;
        var parentId = this.$parent.$parent.field._id;
        formData = this.$store.state.formBase.data[parentId][index];
        schemaData = this.$parent.childItem;
        //父表单的计算式
      } else {
        formData = this.$store.state.formBase.data;
        equationList = this.$store.state.formBase.equation;
        equationMatch = this.$store.state.formBase.equationMatch;
        schemaData = schema = this.$store.state.formBase.schema;
        schema.forEach(function(item) {
          showMap[item._id] = item.show;
          // 保存计算式字段是否可编辑
          equationList.forEach(equationItem => {
            if (item._id == equationItem.id) {
              equationDisabled[equationItem.id] = item.disabled;
            }
          });
        });
      }
      if (equationMatch.indexOf(field._id) != -1) {
        equationList.forEach(function(item) {
          // 计算式字段不可编辑时
          // 或形成环时，不进行计算
          if (equationDisabled[item.id]) {
            return;
          }
          if (item.matchs.indexOf(field._id) != -1) {
            var calculatorStr = item.calculator;
            var obj = {};
            item.matchs.forEach(function(i) {
              obj[i] = formData[i] || 0;
              if (schema && showMap[i] === false) {
                obj[i] = 0;
              }
            });
            var result = calculator(obj, calculatorStr),
              accurate_num;
            schemaData && schemaData.find(field => field._id == item.id && (accurate_num = field.accurate_num));
            result = _this.toFixed(result, accurate_num);
            _this.$emit("change", { key: item.id, value: result }, true);
          }
        });
      }
    },
    validate() {
      field_validation(this.field);
    }
  },
  watch: {
    "field.value": function() {
      //监听数字变化
      this.setValue({}, true);
    },
    "field.show": function() {
      this.setCalculator();
    }
  }
};
</script>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
input {
  font-family: -apple-system-font, "Helvetica Neue", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}
</style>
