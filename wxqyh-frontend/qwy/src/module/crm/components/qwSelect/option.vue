<template>
  <li class="qw-select-option"
      :class="{ 'selected': itemSelected,}"
      @click.stop="selectOptionClick">
    <slot>
      <span>{{label}}</span>
    </slot>
  </li>
</template>
<script>
export default {
  name: "qw-option",
  inject: ["select"],
  props: {
    value: {
      required: true
    },
    label: [String, Number]
  },
  computed: {
    itemSelected() {
      return (
        this.value && this.select.value && this.value === this.select.value
      );
    }
  },
  created() {
    this.select.cachedOptions.push(this);
  },
  methods: {
    selectOptionClick() {
      this.select.handleItemClick(this);
    }
  }
};
</script>
<style lang="scss" scoped>
.qw-select-option {
  padding-left: 15px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover {
    color: #333;
    background: #F4F5F9;
  }
  &.selected {
    color: #fff;
    background: #a7a7a7;
  }
}
</style>
