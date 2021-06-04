<template>
  <div :class="[
    type === 'textarea' ? 'qwui-textarea' : 'qwui-input',
    {'is-disabled': inputDisabled,}
  ]">
    <template v-if="type!=='textarea'">
      <!--前置元素-->
      <input
        v-if="type !== 'textarea'"
        class="qwui-input_inner"
        v-bind="$attrs"
        :type="type"
        :readonly="readonly"
        :disabled="inputDisabled"
        :placeholder="placeholder"
        :value="currentValue"
        ref="input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      >
      <!--前置内容-->

      <!--后置内容-->
      <span
        class="qwui-input_suffix"
        v-if="$slots.suffix || suffixIcon">
        <span class="qwui-input_suffix_inner">
          <template>
            <slot name="suffix"></slot>
            <i
              class="qwui-input_icon"
              v-if="suffixIcon">
              <img :src="suffixSvg" alt="">
            </i>
          </template>
        </span>
      </span>
      <!-- 后置元素 -->

    </template>
  </div>
</template>

<script>
  export default {
    name: 'QwInput',
    componentName: 'QwInput',
    inheritAttrs: false,
    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },
    props:{
      placeholder: {
        type:String,
      },
      value: [String, Number],
      suffixIcon:{
        type:String,
      },
      type: {
        type: String,
        default: 'text'
      },
      disabled: {
        type:Boolean,
      },
      readonly: {
        type:Boolean,
      },
    },
    watch: {
      value(val, oldValue) {
        this.setCurrentValue(val);
      }
    },
    mounted(){
      if(this.suffixIcon){
        this.suffixSvg = require('assets/svg/'+this.suffixIcon+'.svg');
      }
    },
    data(){
      return{
        currentValue:this.value === undefined || this.value === null ? '' : this.value,
        suffixSvg:'',
        isOnComposition: false,
        valueBeforeComposition: null,
        focused: false,
      }
    },
    computed:{
      inputDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      },
    },
    methods:{
      blur() {
        (this.$refs.input || this.$refs.textarea).blur();
      },
      handleBlur(event){
        this.focused = false;
        this.$emit('blur', event);
        if (this.validateEvent) {
          this.dispatch('QwFormItem', 'qw.form.blur', [this.currentValue]);
        }
      },
      handleFocus(event) {
        this.focused = true;
        this.$emit('focus', event);
      },
      handleInput(event){
        const value = event.target.value;
        this.setCurrentValue(value);
        this.$emit('input', value);
      },
      setCurrentValue(value){
        if (this.isOnComposition && value === this.valueBeforeComposition){
          return;
        };
        console.log(333333333)
        this.currentValue = value;
        if (this.isOnComposition){
          return;
        };
      },
      handleChange(event) {
        this.$emit('change', event.target.value);
      },
    }
  }
</script>

<style lang="scss" scoped src="./input.scss"></style>
