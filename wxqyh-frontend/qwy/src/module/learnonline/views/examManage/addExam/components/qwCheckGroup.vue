<template>
  <span class="qwui-checkGroup">
    <qwui-checkbox
      :label="objConfig.label"
      :checked="objVal"
      :disabled="objValArry[objKey[1]+1]"
      v-model="msg"
    ></qwui-checkbox>
  </span>
</template>

<script>
import qwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'
import Base from '../../../../mixins/base';
import Validate from '../../../../mixins/validate'

export default {
  name: 'checkGroup',

  mixins: [ Base, Validate ],

  components: { qwuiCheckbox },

  props: {
    //选项的配置
    objConfig: {
      type: Object,
      required: true
    },
    objValArry: {
      type: Array,
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

  created() {
  },

  methods: {},

}
</script>

<style lang="scss" scoped>
/* @import '../style/qwInput' */
  .qwui-checkGroup {
    display: inline-block;
    height: 21px;
    line-height: 21px;
    vertical-align: top;
    /deep/ .qwui-checkbox {
      display: inline-block;
      height: 21px;
      line-height: 21px;
      vertical-align: top;
      .qwui-checkbox-input {
        padding-top: 2px;
      }
      .qwui-checkbox-label {

      }
    }
  }
</style>
