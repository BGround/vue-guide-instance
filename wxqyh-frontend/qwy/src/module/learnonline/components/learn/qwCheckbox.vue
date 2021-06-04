<template>
  <div
    class="qwui-form_item_hasLabel"
    :class="{
      'qwui-form_item': !objConfig.dependBorther,
      'qwui-form_item_required' : objConfig.required,
      'qwui-form_item_paddingTop' : objConfig.dependProperty,
      'qwui-form_item_hasBorther' : objConfig.hasBorther,
     }"
  >
    <label class="qwui-form_item_label">
      {{ objConfig.title }}
      <slot name="popTarget"></slot>
      <slot name="popDescribe"></slot>
    </label>
    <div class="qwui-form_item_content checkbox">
      <div
        class="content_checkboxWrap"
        :class="{'checkboxWrap_marginRigth' : objConfig.options.length>1}"
      >
        <slot name="description"></slot>
        <qwui-checkbox-group>
          <qwui-checkbox
            :key="index"
            v-for="(item, index) in objConfig.options"
            :label="item.label"
            :disabled="item.disabled"
            :checked="objVal"
            :title="$isVipGold && objKey[0] == 'examAgain' && item.disabled && '请先设置考试时间'"
            v-model="msg"
          ></qwui-checkbox>
        </qwui-checkbox-group>
        <slot></slot>
      </div>
      <div class="qwui-form_item_error_tip" v-if="showValidate">{{ validateInfo }}</div>
    </div>
  </div>
</template>

<script>
import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
import qwuiCheckboxGroup from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckboxGroup'
import Base from 'learn/mixins/base';
import Validate from 'learn/mixins/validate'

export default {
  name: 'qwCheckbox',

  mixins: [ Base, Validate ],

  components: {
    qwuiCheckbox,
    qwuiCheckboxGroup
  },

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

  methods: {},

}
</script>

<style lang="scss" scoped>
/* @import '../style/qwInput' */
.qwui-form_item {
  &.qwui-form_item_paddingTop {
    padding-top: 0;
  }
  &.qwui-form_item_hasBorther {
    min-height: auto;
  }
}
.qwui-form_item_content {
  &.checkbox {
    height: 32px;
    padding-top: 6px;
  }
  .content_checkboxWrap {
    line-height: 1.5;
    height: 21px;
    /deep/ .qwui-checkbox-group {
      height: 21px;
      display: inline-block;
      .qwui-checkbox {
        display: inline-block;
        vertical-align: bottom;
        .qwui-checkbox-input {
          padding-top: 2px;
        }
        .qwui-checkbox-label {
          padding-left: 9px;
        }
      }
    }
    &.checkboxWrap_marginRigth {
      /deep/ .qwui-checkbox .qwui-checkbox-label {
        margin-right: 40px;
      }
    }
  }
}
</style>
