<template>
  <div>
    <div
      class="qwui-form_item qwui-form_item_hasLabel"
      :class="{
      'qwui-form_item_required' : objConfig.required ,
      'qwui-form_item_paddingTop' : objConfig.dependProperty,
      'qwui-form_item_hasBorther' : objConfig.hasBorther,
    }"
    >
      <label class="qwui-form_item_label" v-if="!objConfig.noLabel">
        {{ objConfig.title }}
      </label>
      <div class="qwui-form_item_content">
        <qwui-radio
          :key="index"
          v-for="(item,index) in objConfig.options"
          :label="item.label"
          v-model="msg"
        >{{ item.label }}</qwui-radio>
      </div>
    </div>
  </div>
</template>

<script>
import Base from '../../../../mixins/base';
import Validate from '../../../../mixins/validate'
import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio'
export default {
  name: 'qwMutiRadio',

  components: { qwuiRadio },

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
    return {}
  },

  computed: {},

  watch: {},

  created() {
  },

  methods: {},

}
</script>

<style lang="scss" scoped>
  .qwui-form_item {
    &.qwui-form_item_paddingTop {
      padding-top: 0;
    }
    &.qwui-form_item_hasBorther {
      min-height: auto;
    }
  }
</style>
