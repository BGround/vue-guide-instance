<template>
  <div class="checkboxGroup"
       ref="group">
    <slot>
      <qw-checkbox v-for="(option, index) in options"
                   :key="index"
                   :option="option"
                   :width="itemWidth"></qw-checkbox>
    </slot>
  </div>
</template>

<script>
import QwCheckbox from "./qw-checkbox";
const EVENT_INPUT = "input";
const EVENT_CHECKED = "checked";
const EVENT_CANCLE_CHECKED = "cancle-checked";
export default {
  components: {
    QwCheckbox
  },
  props: {
    value: {
      type: Array
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    itemWidth: {
      type: String
    }
  },
  mounted() {
    this.$on(EVENT_CHECKED, value => {
      this.value_temp.push(value);
      this.$emit(EVENT_INPUT, this.value_temp);
    });
    this.$on(EVENT_CANCLE_CHECKED, value => {
      let index = this.value_temp.indexOf(value);
      this.value_temp.splice(index, 1);
      this.$emit(EVENT_INPUT, this.value_temp);
    });
  },
  data() {
    return {
      value_temp: [],
      checkboxGroup: true
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue, oldValue) {
        this.value_temp = this.value.concat();
      }
    }
  },
  computed: {},
  methods: {}
};
</script>
<style lang='scss' scoped>
</style>
