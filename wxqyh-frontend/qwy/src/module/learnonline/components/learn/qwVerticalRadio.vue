<template>
  <div class="qwui-form_item_hasLabel">
    <label class="qwui-form_item_label">
      {{ objConfig.title }}
    </label>
    <div class="qwui-form_item_content">
      <div v-for="(item, index) in objConfig.options"
           :key="index"
      >
        <qwui-radio
          :label="item.label"
          :disabled="item.disabled"
          v-model="msg"
        >{{ item.label }}</qwui-radio>
      </div>
    </div>
  </div>
</template>

<script>
import Base from 'learn/mixins/base';
import qwuiRadio from '@/components/qwuiBase/qwuiRadio/qwuiRadio'

export default {
  name: 'qwVerticalRadio',

  components: { qwuiRadio },

  mixins: [ Base, ],

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
</style>
