<!--
  @param option object类型
    结构： {
            label: 'checkbox的标签名',
            value: 'checkbox的值',
            disabled: false       // 是否可用
          }

  用法1:

    // 若只需要在选中时返回true，未选中是返回false (v-model绑定的值表示此选项是否被选中)
    <qw-checkbox v-model="clientGroup1">客户基本信息</qw-checkbox>

  用法2：

    // 若需要在选中时 返回某个指定的值，未选中时返回false
    <qw-checkbox v-model="clientGroup1" :option="option"></qw-checkbox>

-->
<template>
  <div class="checkbox"
       :style="checkboxStyle">
    <label class="checkbox-wrap">
      <input class="checkbox-input"
             type="checkbox"
             v-model="checkValue"
             :disabled="dealOption.disabled">
      <span class="checkbox-label">
        <slot>{{dealOption.label}}</slot>
      </span>
    </label>
  </div>
</template>

<script>
const EVENT_INPUT = "input";
const EVENT_CHECKED = "checked";
const EVENT_CANCLE_CHECKED = "cancle-checked";
const EVENT_CHANGE = "change";
export default {
  components: {},
  props: {
    width: {
      type: String
    },
    value: {
      type: [Boolean, String]
    },
    option: {
      type: Object,
      default() {
        return {
          _def_option: true
        };
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const parent = this.$parent;
    const isInGroup = parent.$data.checkboxGroup;
    return {
      isInGroup
    };
  },
  computed: {
    dealOption() {
      let option = this.option;
      let disabled = this.disabled;
      if (option._def_option === true) {
        option = {
          label: "",
          value: "",
          disabled
        };
      }
      return option;
    },
    // 用来表示此选项是否被选中
    checkValue: {
      get() {
        if (this.isInGroup) {
          return this.$parent.value.indexOf(this.dealOption.value) > -1;
        }
        return Boolean(this.value);
      },
      set(newValue) {
        let value = this.dealOption.value;
        let emitValue = value && newValue ? value : newValue;
        let parentEmitEvent = newValue ? EVENT_CHECKED : EVENT_CANCLE_CHECKED;
        this.$emit(EVENT_INPUT, emitValue);
        this.$emit(EVENT_CHANGE, emitValue);
        if (this.isInGroup) {
          this.$parent.$emit(parentEmitEvent, value);
        }
      }
    },
    checkboxStyle() {
      let style = {};
      if (this.width) {
        style = {
          width: this.width
        };
      }
      return style;
    }
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.checkbox {
  display: inline-block;
  line-height: 28px;
  margin-right: 10px;
}
</style>
