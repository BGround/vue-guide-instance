<template>
  <div class="qwui-form_item" :class="[{
  'is-required':isRequired || required,
  'is-error':validateState === 'error',
  }]">
    <label class="qwui-form_item_label" :style="labelStyle" v-if="label || $slots.label">
      <slot name="label">{{label}}</slot>
    </label>
    <div class="qwui-form_item_content" :style="contentStyle">
      <slot></slot>
      <transition name="qwui-zoom-in-top">
        <div v-if="validateState==='error'" class="qwui-form_item_error">
          {{validateMessage}}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import emitter from '@/assets/js/mixins/emitter.js';
  import {getPropByPath,noop} from "@/assets/js/utils/util";
  import objectAssign from '@/assets/js/utils/merge';
  import AsyncValidator from 'async-validator';

  export default {
     name: 'QwFormItem',
     componentName: 'QwFormItem',
     mixins: [emitter],
     props:{
       label:String,
       prop:String,
       rules: [Object, Array],
       required: {
         type: Boolean,
         default: undefined
       },
       labelWidth: String,
       rightWidth: String,
     },
    inject: ['qwForm'],
     data(){
       return{
         isNested: false,
         validateState:'',
         validateDisabled: false,
         validateMessage: '',
       }
     },
     mounted(){
        if(this.prop){
          this.dispatch('QwForm', 'qw.form.addField', [this]);

          let initialValue = this.fieldValue;
          if(Array.isArray(initialValue)){
            initialValue = [].concat(initialValue);
          }
          Object.defineProperty(this,'initialValue',{
            value:initialValue,
          });

          let rules = this.getRules();
          if(rules.length || this.required !== undefined){
            this.$on('qw.form.blur',this.onFieldBlur);
          }
        }
     },
     computed:{
       contentStyle(){
         let ret = {};
         let label = this.label;
         if (!label && !this.labelWidth && this.isNested) return ret;
         let labelWidth = this.labelWidth || this.form.labelWidth;

         if (labelWidth) {
           ret.marginLeft = labelWidth + 'px';
         }
         return ret;
       },
       labelStyle(){
         let ret = {};
         let labelWidth = this.labelWidth || this.form.labelWidth;
         if (labelWidth) {
           ret.width = labelWidth + 'px';
         }
         return ret;
       },
       form(){
         let parent = this.$parent;
         let parentName = parent.$options.componentName;
         while(parentName!=='QwForm'){
           if(parentName==='QwFormItem'){
             this.isNested = true;
           }
           parent = parent.$parent;
           parentName = parent.$options.componentName;
         }
         return parent;
       },
       fieldValue(){
         let model = this.form.model;
         if(!model || !this.prop){
           return;
         }

         let path = this.prop;
         if(path.indexOf(':')!==-1){
           path = path.replace(/:/,'.');
         }
         return getPropByPath(model,path,true).v;
       },
       isRequired(){
         let rules = this.getRules();
         let isRequired = false;
         if (rules && rules.length) {
           rules.every((rule)=>{
             if(rule.required){
               isRequired = true;
               return false;
             }
             return true;
           });
         }
         return isRequired;
       },
     },
     methods:{
       getRules(){
          let formRules = this.form.rules;
          let selfRules = this.rules;
          let requiredRule = this.required !== undefined ? {required:!!this.required}:[];

          let prop = getPropByPath(formRules,this.prop || '');
          formRules = formRules ? (prop.o[this.prop||'']||prop.v) : [];

          return [].concat(selfRules || formRules || []).concat(requiredRule);
       },
       onFieldBlur(){
         this.validate('blur');
       },
       validate(trigger,callback = noop){
        this.validateDisabled = false;
        let rules = this.getFilteredRule(trigger);
        if((!rules||rules.length===0)&&this.required===undefined){
          callback();
          return true;
        }

        this.validateState = 'validating';

        let descriptor = {};
        if(rules && rules.length > 0){
          rules.forEach(rule => {
            delete rule.trigger;
          });
        }
        descriptor[this.prop] = rules;
        let validator = new AsyncValidator(descriptor);
        let model = {};
        model[this.prop] = this.fieldValue;
         validator.validate(model,{ firstFields: true },(errors,invalidFields)=>{
          this.validateState = !errors ? 'success' : 'error';
          this.validateMessage = errors ? errors[0].message : '';
          callback(this.validateMessage,invalidFields);
          this.qwForm && this.qwForm.$emit('validate',this.prop,!errors);
        });
       },
       getFilteredRule(trigger){
         let rules = this.getRules();

         return rules.filter(rule=>{
           if(!rule.trigger || trigger === ''){
             return true;
           }
           if(Array.isArray(rule.trigger)){
             return rule.trigger.indexOf(trigger) > -1;
           }else {
             return rule.trigger === trigger;
           }
         }).map(rule => objectAssign({}, rule));
       },
     }
   }
</script>

<style scoped lang="scss">
  .qwui-zoom-in-top-enter-active,
  .qwui-zoom-in-top-leave-active {
    opacity: 1;
    transform: scaleY(1);
    transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1),
                opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
    transform-origin: center top;
  }
  .qwui-zoom-in-top-enter,
  .qwui-zoom-in-top-leave-active {
    opacity: 0;
    transform: scaleY(0);
  }

  .qwui-form_item{
    position: relative;
    margin-bottom: 20px;
    .qwui-form_item {
      margin-bottom: 0;
    }
    &.is-required{
      .qwui-form_item_label{
        &:before{
          content: "*";
          color: #f56c6c;
          margin-right: 4px;
        }
      }
    }
    .qwui-form_item_label{
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #333;
      line-height: 32px;
      padding-right: 20px;
      box-sizing:border-box;
    }
    .qwui-form_item_content{
      position: relative;
      font-size: 14px;
      .qwui-form_item_error{
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 3px;
        position: absolute;
        top: 100%;
        width: 200%;
        left: 0;
      }
    }
  }
  // override
  .publishObjectWrap{
     .qwui-form_item_label {
        color:red !important;
       font-weight: 600;
    }
  }
</style>
