<template>
  <span v-show="visible"
        :class="labelClass"
        class="labelContainer">
    <slot name="icon"></slot>
    <slot></slot>
    <i v-if="canClose"
       class="iconfont public-web-ic_b-close icon_label-close"
       @click="close"></i>
  </span>
</template>

<script>
const TYPE_WHITE = "white";
export default {
  components: {},
  props: {
    keyValue: {
      type: String
    },
    canClose: {
      type: Boolean,
      default: true
    },
    type: {
      type: String
    }
  },
  data() {
    return {
      visible: true
    };
  },
  computed: {
    labelClass() {
      let labelClass = {};
      labelClass = {
        white: this.type === TYPE_WHITE
      };
      return labelClass;
    }
  },
  methods: {
    close() {
      if (this.canClose && this.keyValue) {
        // this.visible = false;
        this.$emit("close", this.keyValue);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.labelContainer {
  position: relative;
  display: inline-block;
  border: 1px solid #d5d5d5;
  border-radius: 2px;
  height: 28px;
  line-height: 28px;
  margin-top: 8px;
  margin-right: 12px;
  padding: 0 8px;
  color: #666;
  font-size: 12px;
  .icon_label-close {
    color: #ccc;
    font-size: 12px;
    cursor: pointer;
  }
}
.labelContainer {
  &.white {
    color: #383838;
    background: #fff;
    border: 1px solid #e9e9e9;
    border-radius: 0;
  }
}
</style>
