<template>
  <div class="qw-select"
       v-click-outside="handleClose"
       @click="handleSelect">
    <input :placeholder="placeholder"
           readonly
           :value="label" />
    <ul class="qw-select-list"
        v-show="visible">
      <slot></slot>
    </ul>
  </div>
</template>
<script>
import ClickOutside from "crm/directives/click-outside";
export default {
  name: "qwSelect",
  directives: {
    ClickOutside
  },
  props: {
    value: {
      required: true
    },
    placeholder: {
      default: "请选择"
    }
  },
  provide() {
    return {
      select: this
    };
  },
  watch: {
    value(val) {
      if (val) {
        let selected =
          this.cachedOptions.find(item => {
            return item.value === val;
          }) || {};
        this.label = selected.label || "";
      } else {
        this.label = "";
      }
    },
    cachedOptions(val) {
      if (this.value) {
        let selected =
          this.cachedOptions.find(item => {
            return item.value === this.value;
          }) || {};
        this.label = selected.label || "";
      }
    }
  },
  data() {
    return {
      visible: false,
      label: "",
      cachedOptions: []
    };
  },
  mounted() {
    let selected =
      this.cachedOptions.find(item => {
        return item.value === this.value;
      }) || {};
    this.label = selected.label || "";
  },
  methods: {
    handleClose() {
      this.visible = false;
    },
    handleSelect() {
      this.visible = true;
    },
    handleItemClick(context) {
      this.visible = false;
      this.label = context.label;
      this.$emit("input", context.value);
    }
  }
};
</script>
<style lang="scss" scoped>
.qw-select {
  position: relative;
  display: inline-block;
  padding: 0 30px 0 15px;
  width: 120px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  border: 1px solid #ccc;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 3px;
  background: #fff;
  input {
    padding: 0;
    width: 100%;
    height: 100%;
    vertical-align: text-bottom;
    border: 0;
    background: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &::after {
    content: "";
    position: absolute;
    margin-top: -3px;
    right: 12px;
    top: 50%;
    border-color: transparent transparent #999;
    border-style: solid;
    border-width: 5px;
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  &-list {
    position: absolute;
    left: -1px;
    top: 35px;
    z-index: 2;
    min-width: 120px;
    width: 100%;
    max-height: 350px;
    border: 1px solid #ccc;
    border-radius: 3px;
    -webkit-box-shadow: 0px 1px 5px 1px #ccc;
    box-shadow: 0px 1px 5px 1px #ccc;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #fff;
    overflow: auto;
  }
}
</style>


