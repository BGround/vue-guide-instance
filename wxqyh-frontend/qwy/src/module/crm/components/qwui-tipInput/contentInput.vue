<template>
  <div class="contentInput"
       :style="inputStype">
    <div class="input-wrap">
      <div class="input-container">
        <slot></slot>
      </div>
      <input v-show="inputShow"
             class="input"
             :placeholder="placeholder"
             type="text"
             :disabled="disabled"
             v-model="inputValue"
             @keyup.enter="enterSearch">
    </div>
    <span class="search-btn"
          @click="search"></span>
  </div>
</template>

<script>
const EVENT_INPUT = "input";
const EVENT_SEARCH = "search";
export default {
  components: {},
  props: {
    width: {
      type: Number,
      default: 200
    },
    placeholder: {
      type: [String, Number]
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // input框类型
    type: {
      type: String,
      default: "search"
    },
    value: {
      type: [String, Array]
    },
    maxCount: {
      type: Number,
      default: 1
    },
    selectList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      inputShow: true
    };
  },
  computed: {
    inputStype() {
      return {
        width: `${this.width}px`
      };
    },
    inputValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit(EVENT_INPUT, newValue);
      }
    }
  },
  watch: {
    selectList(newList) {
      let length = newList.length;
      this.inputShow = this.maxCount === length ? false : true;
    }
  },
  methods: {
    search() {
      this.$emit(EVENT_SEARCH);
    },
    enterSearch() {
      this.$emit(EVENT_SEARCH);
    }
  }
};
</script>
<style lang='scss' scoped>
.contentInput {
  display: flex;
  .input-wrap {
    display: flex;
    overflow: hidden;
    border: 1px solid #ccc;
    border-right: none;
    position: relative;
    flex: 1;
    box-sizing: border-box;
    height: 32px;
    padding: 2px 5px;
    .input {
      width: 100%;
      border: none;
    }
    .input-container {
      flex-shrink: 0;
    }
  }

  .search-btn {
    display: inline-block;
    width: 32px;
    height: 32px;
    border: 1px solid #ccc;
    background: url("~assets/images/search_icon.png") no-repeat center;
    box-sizing: border-box;
    cursor: pointer;
  }
}
</style>