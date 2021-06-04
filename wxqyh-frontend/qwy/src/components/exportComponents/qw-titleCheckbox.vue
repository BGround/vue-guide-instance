<template>
  <div class="titleCheckbox">
    <qw-checkbox v-model="titleValue"
                 @change="dealChange">
      <h3 class="title">{{title}}</h3>
    </qw-checkbox>
    <qw-checkbox-group item-width="128px"
                       v-model="groupValue"
                       :options="checkboxList"
                       ></qw-checkbox-group>
  </div>
</template>

<script>
import QwCheckbox from "./qw-checkbox";
import QwCheckboxGroup from "./qw-checkboxGroup";
const EVENT_INPUT = "input";
export default {
  components: {
    QwCheckbox,
    QwCheckboxGroup
  },
  props: {
    curIndex: {
      type: Number
    },
    value: {
      type: Array
    },
    title: {
      type: String,
      required: true
    },
    checkboxList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      groupValue: [],
      titleValue: false
    };
  },
  created() {
    this.groupValue = this.value;
  },
  watch: {
    value(newV) {
      this.groupValue = newV;
    },
    // titleValue(newV) {
    //   if(newV) {
    //     this.groupValue = this.allValue
    //   } else {
    //     this.
    //   }
    //   // this.groupValue = newV ? this.allValue : [];
    // },
    groupValue(newList) {
      let length = newList.length;
      this.titleValue = length === this.allValue.length;
      this.$emit(EVENT_INPUT, newList);
      this.$emit("checkedHandle", this.curIndex, this.groupValue);
    }
  },
  computed: {
    allValue() {
      let allValue = [];
      this.checkboxList.forEach((item, index) => {
        allValue.push(item.value);
      });
      return allValue;
    }
  },
  methods: {
    dealChange(val) {
      this.groupValue = val ? this.allValue : [];
      this.$emit("checkedHandle", this.curIndex, this.groupValue);
    }
  }
};
</script>
<style lang='scss' scoped>
.titleCheckbox {
  .title {
    display: inline-block;
    line-height: 18px;
    height: 18px;
    font-weight: 600;
  }
}
</style>
