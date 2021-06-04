<template>
  <div
    class="qwui-form_item qwui-form_item_hasLabel"
    :class="{
      'qwui-form_item_noLabel' : objConfig.noLabel,
      'qwui-form_item_required' : objConfig.required ,
      'qwui-form_item_hasBorther' : objConfig.hasBorther,
    }"
  >
    <label class="qwui-form_item_label" v-if="!objConfig.noLabel">{{ objConfig.title }}</label>
    <div class="qwui-form_item_content">
      <div class="qwui-input_wrapper">
        <slot name="description"></slot>
        <div class="qwui_input_box">
          <input
            class="qwui_input"
            :class="{
              errorBorder: showValidate,
              numPaddingRight: objConfig.type === 'number',
              disabled: objConfig.disabled,
            }"
            :style="`width: ${objConfig.width}px;`"
            :type="objConfig.type"
            :min="objConfig.min"
            :placeholder="objConfig.placeholder"
            :maxlength="objConfig.maxlength"
            :disabled="objConfig.disabled"
            v-model="msg"
            @blur="handleBlur">
          <span class="qwui_input_length" v-show="objConfig.maxlength">
            {{ msg.length }}/{{ objConfig.maxlength }}
          </span>
        </div>
        <slot></slot>
      </div>
      <transition name="transition-drop">
        <div class="qwui-form_item_error_tip" v-if="showValidate && !parentName">{{ validateInfo }}</div>
      </transition>
    </div>
  </div>
</template>

<script>
import Base from 'learn/mixins/base';
import Validate from 'learn/mixins/validate'

export default {
  name: 'qwInput',

  mixins: [ Base, Validate ],

  components: {},

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
    parentName: {
      required: false
    },
    validateObj: {
      required: false
    },
    EVENT_BUS: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      keyName: this.objKey,
      validateState: '',
      validateMessage: ''
    }
  },

  computed: {},

  watch: {},

  created() {},

  methods: {
    handleBlur() {
      if(!this.objConfig.disabled) {
        return this.validate().then((result) => {
          return this.validateMin(result);
        });
      }
    },
  },

}
</script>

<style lang="scss" scoped>
@import "learn/style/config.scss";
.qwui-form_item {
  &.qwui-form_item_hasBorther {
    padding-top: 7px;
  }
}
.qwui-input_wrapper {
  display: flex;
  width: 100%;
  position: relative;
  vertical-align: middle;
  line-height: normal;

  .qwui_input_box {
    position: relative;
    .qwui_input {
      display: inline-block;
      height: 32px;
      line-height: 1.5;
      padding: 7px 54px 6px 12px;
      font-size: 12px;
      border: 1px solid #D5D5D5;
      border-radius: 2px;
      color: #333;
      background-color: #fff;
      background-image: none;
      position: relative;
      cursor: text;
      transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
      &.disabled {
        background-color: #eee;
        cursor: not-allowed;
      }
      &:focus {
         outline: 0;
         box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(255, 155, 0, 0.6);
         border-color: #C31725;
      }
      &.errorBorder {
         border-color: $redColor;
       }
      &.numPaddingRight {
        padding-right: 10px;
       }
    }
    .qwui_input_length {
      position: absolute;
      top: 8px;
      right: 8px;
      line-height: 1.5;
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
