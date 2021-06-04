<template>
  <qwInput
    class="qwui-date-editor"
    v-clickoutside="handleClose"
    :readonly="!editable || readonly || type === 'dates'"
    :disabled="pickerDisabled"
    ref="reference"
    v-if="!ranged"
    :placeholder="placeholder"
    @keydown.native="handleKeydown"
    :value="displayValue"
    @input="value => userInput = value"
    @focus="handleFocus"
    @change="handleChange"
    @mouseenter.native="handleMouseEnter"
    @mouseleave.native="showClose = false"
    >
    <span
      tabindex="0"
      slot="suffix"
      class="qwui-input_icon"
      @click="handleFocus"
      v-if="suffixIcon&&!showClose">
      <img :src="suffixSvg" alt="">
    </span>
    <span
      tabindex="0"
      slot="suffix"
      class="qwui-input_icon qwui-icon_circle_close"
      @click="handleClickIcon"
      v-if="suffixIcon&&showClose">
      <img :src="suffixSvgClose" alt="">
    </span>
  </qwInput>
</template>

<script>
  import qwInput from '@/components/Input/QwInput.vue';
  import Vue from 'vue';
  import Emitter from '@/assets/js/mixins/emitter.js';
  import Clickoutside from '@/assets/js/utils/clickoutside.js';
  import { isDateObject } from '../util';

  const DEFAULT_FORMATS = {
    date: 'yyyy-MM-dd',
    month: 'yyyy-MM',
    datetime: 'yyyy-MM-dd HH:mm:ss',
    time: 'HH:mm:ss',
    week: 'yyyywWW',
    timerange: 'HH:mm:ss',
    daterange: 'yyyy-MM-dd',
    datetimerange: 'yyyy-MM-dd HH:mm:ss',
    year: 'yyyy'
  };

  const HAVE_TRIGGER_TYPES = [
    'date',
    'datetime',
    'time',
    'time-select',
    'week',
    'month',
    'year',
    'daterange',
    'timerange',
    'datetimerange',
    'dates'
  ];

  const valueEquals = function(a, b) {
    const dateEquals = function(a, b) {
      const aIsDate = a instanceof Date;
      const bIsDate = b instanceof Date;

      if(aIsDate && bIsDate){
        return a.getTime() === b.getTime();
      }
      if(!aIsDate && !bIsDate){
        return a === b;
      }
      return false;
    }

    const aIsArray = a instanceof Array;
    const bIsArray = b instanceof Array;

    if (!aIsArray && !bIsArray) {
      return dateEquals(a, b);
    }
    return false;
  }

  const TYPE_VALUE_RESOLVER_MAP = {
    default:{
      formatter(value){
        if(!value){
          return '';
        }
        return ''+value;
      },
      parser(text){
        if(text === undefined || text === ''){
          return null;
        }
        return text;
      }
    },
  };

  const formatAsFormatAndType = (value, customFormat, type) => {
    if (!value){
      return null;
    };
    const formatter = (TYPE_VALUE_RESOLVER_MAP[type] || TYPE_VALUE_RESOLVER_MAP['default']).formatter;
    const format = customFormat || DEFAULT_FORMATS[type];
    return formatter(value, format);
  }

  export default {
    inject: {
      elForm: {
        default: ''
      },
    },
    mixins:[Emitter],
    props:{
      placeholder: {
        type:String,
      },
      format: {
        type:String,
      },
      valueFormat: {
        type:String,
      },
      suffixIcon:{
        type:String,
        default:'icon_b-xw_time-circle',
      },
      disabled: {
        type:Boolean,
      },
      readonly: {
        type:Boolean,
      },
      editable: {
        type: Boolean,
        default: true
      },
      popperClass: {
        type:String,
      },
      value: {},
      defaultValue: {},
      defaultTime: {},
      rangeSeparator: {
        default: '-'
      },
      pickerOptions:{},
    },
    mounted(){
      this.suffixSvg = require('assets/svg/'+this.suffixIcon+'.svg');
      this.suffixSvgClose = require('assets/svg/btn_b-commom_del.svg');
    },
    data(){
      return{
        showClose:false,
        pickerVisible: false,
        userInput: null,
        suffixSvg:'',
        suffixSvgClose:'',
        valueOnOpen: null,
      }
    },
    methods:{
      handleClose(){
        if (!this.pickerVisible){
          return;
        }
        this.pickerVisible = false;
      },
      handleClickIcon(event){
        if (this.readonly || this.pickerDisabled){
          return;
        };
        if (this.showClose) {
          this.valueOnOpen = this.value;
          event.stopPropagation();
          this.emitInput(null);
          this.emitChange(null);
          this.showClose = false;
          if (this.picker && typeof this.picker.handleClear === 'function') {
            this.picker.handleClear();
          }
        } else {
          this.pickerVisible = !this.pickerVisible;
        }
      },
      handleMouseEnter(){
        if (this.readonly || this.pickerDisabled){
          return;
        };
        if(!this.valueIsEmpty){
          this.showClose = true;
        }
      },
      blur() {
        this.refInput.forEach(input => input.blur());
      },
      handleKeydown(event){
        const keyCode = event.keyCode;

        // ESC
        if (keyCode === 27) {
          this.pickerVisible = false;
          event.stopPropagation();
          return;
        }

        // if user is typing, do not let picker handle key input
        if (this.userInput) {
          event.stopPropagation();
          return;
        }


      },
      formatToValue(date) {
        const isFormattable = isDateObject(date) || (Array.isArray(date) && value.every(isDateObject));
        if (this.valueFormat && isFormattable) {
          //为后面做日期组件做准备

        }else{
          return date;
        }
      },
      handleFocus(){
        const type = this.type;

        if (HAVE_TRIGGER_TYPES.indexOf(type) !== -1 && !this.pickerVisible) {
          this.pickerVisible = true;
        }

        this.$emit('focus', this);
      },
      handleChange(){
      },
      hidePicker() {
        if (this.picker) {
          this.pickerVisible = this.picker.visible = false;
        }
      },
      showPicker(){
        if (this.$isServer) return;
        if (!this.picker) {
          this.mountPicker();
        }
        this.pickerVisible = this.picker.visible = true;
        this.picker.value = this.parsedValue;
      },
      mountPicker(){
        this.picker = new Vue(this.panel).$mount();
        this.picker.defaultValue = this.defaultValue;
        this.picker.defaultTime = this.defaultTime;
        this.picker.popperClass = this.popperClass;
        this.picker.width = this.reference.getBoundingClientRect().width;
        this.picker.showTime = this.type === 'datetime' || this.type === 'datetimerange';
        this.picker.selectionMode = this.selectionMode;

        const updateOptions = () => {
          const options = this.pickerOptions;

          for (const option in options) {
            if (options.hasOwnProperty(option)) {
              this.picker[option] = options[option];
            }
          }
        };
        updateOptions();

        this.$el.appendChild(this.picker.$el);

        this.picker.$on('pick', (date = '', visible = false) => {
          this.userInput = null;
          this.pickerVisible = this.picker.visible = visible;
          this.emitInput(date);
        });
      },
      emitChange(val){
        if (!valueEquals(val, this.valueOnOpen)) {
          this.$emit('change', val);
          this.dispatch('QwFormItem', 'qw.form.change', val);
          this.valueOnOpen = val;
        }
      },
      emitInput(val){
        const formatted = this.formatToValue(val);
        if (!valueEquals(this.value, formatted)) {
          this.$emit('input', formatted);
        }
      },
    },
    computed:{
      valueIsEmpty() {
        const val = this.value;
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; i++) {
            if (val[i]) {
              return false;
            }
          }
        } else {
          if (val) {
            return false;
          }
        }
        return true;
      },
      refInput(){
        if(this.reference){
          return [].slice.call(this.reference.querySelectorAll('input'));
        }
        return [];
      },
      ranged() {
        return this.type.indexOf('range') > -1;
      },
      displayValue(){
        const formattedValue = formatAsFormatAndType(this.parsedValue, this.format, this.type, this.rangeSeparator);
        if (this.userInput !== null) {
          return this.userInput;
        }else if(formattedValue) {
          return formattedValue;
        }else{
          return '';
        }
      },
      reference() {
        const reference = this.$refs.reference;
        return reference.$el || reference;
      },
      pickerDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      },
      selectionMode() {
        if (this.type === 'week') {
          return 'week';
        } else if (this.type === 'month') {
          return 'month';
        } else if (this.type === 'year') {
          return 'year';
        } else if (this.type === 'dates') {
          return 'dates';
        }

        return 'day';
      },
      parsedValue(){
        // component value is not set
        if (!this.value){
          return this.value;
        };
        // time-select does not require parsing, this might change in next major version
        if (this.type === 'time-select'){
          return this.value;
        };
      },
    },
    watch:{
      pickerVisible(val){
        if (this.readonly || this.pickerDisabled){
          return;
        }
        if (val) {
          this.showPicker();
          this.valueOnOpen = Array.isArray(this.value) ? [...this.value] : this.value;
        }else{
          this.hidePicker();
          this.emitChange(this.value);
          this.userInput = null;
          this.dispatch('QwFormItem', 'qw.form.blur');
          this.$emit('blur', this);
          this.blur();
        }
      },
      parsedValue: {
        immediate: true,
        handler(val) {
          if (this.picker) {
            this.picker.value = val;
          }
        }
      },
      defaultValue(val) {
        if (this.picker) {
          this.picker.defaultValue = val;
        }
      },
    },
    directives: {
      Clickoutside
    },
    components:{
      qwInput,
    },
  };
</script>

<style lang="scss" scoped src="../scss/picker.scss">

</style>
