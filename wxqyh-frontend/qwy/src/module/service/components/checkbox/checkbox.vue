<template>
    <label
    role="checkbox"
    :class="[
      className ? 'qw-checkbox-' + className : '',
      { 'is-disabled': disabled },
      { 'is-checked': isChecked }
    ]">
         <input type="checkbox"
              :class="[className ? 'qw-checkbox-' + className + '__input': '']"
              :name="name"
              :value="label"
              v-model="model"
              @change="handleChange"
         >
        <span
          v-if="$slots.default || label"
          :style="{ width }"
          :class="[className ? 'qw-checkbox-' + className + '__label': '']"
          :ant-click-animating-without-extra-node="animating"
          @click="animatingClick"
          >
          <slot></slot>
          <template v-if="!$slots.default">{{label}}</template>
        </span>
    </label>
</template>
<script>
  import Emitter from '../../mixins';
  export default {
    name:'QwCheckbox',
    mixins: [Emitter],
    props:{
      width: {
        type: String,
        default: '150px'
      },
      className: {
        type: String,
        default: 'button'
      },
      checked: {
        type: Boolean,
        default: false
      },
        disabled: {
            type: Boolean,
          default: false
        },
        name: {
            type: String,
          default: ''
        },
      value: {},
      label: {},
      animate:{
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        selfModel: false,
        isLimitExceeded: false,
        animating: false
      }
    },
    created(){
      this.checked && this.addToStore();
    },
    computed: {
      model: {
        get() {
          return this.isGroup
            ? this.store : this.value !== undefined
              ? this.value : this.selfModel;
        },
        set(val) {
          if (this.isGroup) {
            this.isLimitExceeded = false;
            (this._checkboxGroup.min !== undefined &&
              val.length < this._checkboxGroup.min &&
              (this.isLimitExceeded = true));

            (this._checkboxGroup.max !== undefined &&
              val.length > this._checkboxGroup.max &&
              (this.isLimitExceeded = true));

            this.isLimitExceeded === false &&
            this.dispatch('QwCheckboxGroup', 'input', [val]);
          } else if (this.value !== undefined) {
            this.$emit('input', val);
          } else {
            this.selfModel = val;
          }
        }
      },
      isGroup() {
        let parent = this.$parent;
        while (parent) {
          if (parent.$options.componentName !== 'QwCheckboxGroup') {
            parent = parent.$parent;
          } else {
            this._checkboxGroup = parent;
            return true;
          }
        }
        return false;
      },
      store() {
        return this._checkboxGroup ? this._checkboxGroup.value : this.value;
      },
      isChecked() {
        let type = Object.prototype.toString.call(this.model)
        if (Array.isArray(this.model)) {

          return this.model.indexOf(this.label) > -1;
        }else if (type === '[object Boolean]') {
          return this.model
        }
      },
    },
    methods:{
      addToStore() {
        if (
          Array.isArray(this.model) &&
          this.model.indexOf(this.label) === -1
        ) {
          this.model.push(this.label);
        } else {
          this.model = true;
        }
      },
      handleChange(ev) {
        if (this.isLimitExceeded) return;
        let value = ev.target.checked? true:false;
        this.$emit('change', value, ev);
        this.$nextTick(() => {
          if (this.isGroup) {
            this.dispatch('QwCheckboxGroup', 'change', [this._checkboxGroup.value]);
          }
        });
      },
      animatingClick(){

        let self = this
        if(this.animate){
          this.animating = true
          let timer = setTimeout(function () {
            self.animating = false
            clearTimeout(timer)
          },300)
        }

      }
    }
  }
</script>
<style lang="scss" scoped>
  @import './checkbox.scss';
</style>
