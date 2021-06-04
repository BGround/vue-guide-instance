<template>
  <div class="qwui-form_item_hasLabel">
    <div class="qwui-form_item_content checkInput">
      <div class="content_checkboxWrap">
        <qwui-checkbox
          :label="objConfig.options[0].label"
          :disabled="objConfig.options[0].disabled"
          :checked="objVal"
          v-model="msg"
        ></qwui-checkbox>
      </div>
      <qw-input
        :objConfig="objConfig.inputConfig"
        :objVal="objInputVal"
        :objKey="objInputKey"
        :parentName="objInputKey[0]"
        :validateObj="validateObj"
        :EVENT_BUS="EVENT_BUS"
      >
        <div class="qwui-input_tailWrap" slot="description">
          <span class="qwui-input_head">{{ objConfig.inputConfig.inputHead }}</span>
        </div>
        <div class="qwui-input_tailWrap">
          <span class="qwui-input_unit">{{ objConfig.inputConfig.inputUnit }}</span>
        </div>
      </qw-input>
      <transition name="transition-drop">
        <div class="qwui-form_item_error_tip" v-if="showValidate">{{ validateInfo }}</div>
      </transition>
    </div>
  </div>
</template>

<script>
import Base from '../../../../mixins/base';
import Validate from '../../../../mixins/validate'
import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
import qwInput from './qwInput'

export default {
  name: 'qwCheckInput',

  components: { qwuiCheckbox, qwInput },

  mixins: [ Base, Validate ],

  props: {
    //选项的配置
    objConfig: {
      type: Object,
      required: true
    },
    objVal: {
      required: true
    },
    objDeviceControl: {
      required: true
    },
    objKey: {
      type: Array,
      required: true
    },
    objInputVal: {
      required: true
    },
    objInputKey: {
      required: true
    },
    EVENT_BUS: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      validateObj: {
        validateMessage: '',
        validateMessage: ''
      }
    }
  },

  computed: {},

  watch: {
    objDeviceControl(val) {
      if(val !== '只允许在个人网页版答题') {
        this.validateObj = {
          validateMessage: '',
          validateMessage: ''
        };
      }
    },
    msg(val) {
      if(!val) {
        this.validateObj = {
          validateMessage: '',
          validateMessage: ''
        };
      }
    }
  },

  created() {
    this.$props.EVENT_BUS.$on('on-input-validate', obj => {
      const {parentName, keyArr, validateObj} = obj;
      if(parentName !== this.objInputKey[0]) return;
      this.validateObj = Object.assign({}, validateObj);
    })
  },

  methods: {},

}
</script>

<style lang="scss" scoped>
/* @import '../style/qwInput' */
.qwui-form_item_content {
  &.checkInput {
    min-height: 32px;
    padding-top: 6px;
  }
  .content_checkboxWrap {
    line-height: 1.5;
    height: 21px;
    /deep/ .qwui-checkbox {
      display: inline-block;
      vertical-align: bottom;
      .qwui-checkbox-input {
        padding-top: 2px;
      }
    }
  }
  /deep/ .qwui-form_item {
    position: absolute;
    top: 0;
    left: 23px;
    min-height: auto;
    padding: 0;
  }
}
</style>
