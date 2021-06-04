<template>
  <div class="qw-search-select">
    <div class="qw-search-select-box">
      <div class="qw-search-select-tag"
           v-for="(item,index) in tagList"
           :key="index">
        <div class="tag-icon"
             v-if="item.icon">
          <img :src="item.icon"
               alt="">
        </div>
        <div class="tag-name">{{item.label||item.name}}</div>
        <div class="tag-close"
             @click="onDelete(item)">×</div>
      </div>
      <input type="text"
             :placeholder="placeholder"
             v-model="currentValue"
             @input="input">
    </div>
    <div class="qw-search-select-list">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "QwSearchSelect",
  props: {
    placeholder: {
      default: "请输入"
    },
    value: {
      default: ""
    },
    tagList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentValue: ""
    };
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      this.$emit("input", val);
    }
  },
  created() {
    this.currentValue = this.value;
  },
  methods: {
    input() {
      this.$emit("on-input", this.currentValue);
    },
    onDelete(item) {
      this.$emit("on-delete", item);
    }
  }
};
</script>

<style lang="scss" scoped>
.qw-search-select {
  position: relative;
  .qw-search-select-box {
    border: 1px solid #ddd;
    background-color: #fff;
    max-height: 110px;
    padding-top: 5px;
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    .qw-search-select-tag {
      background-color: #eee;
      border: 1px solid #ccc;
      height: 24px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      margin: 0 5px 5px;
      .tag-icon {
        height: 24px;
        width: 24px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .tag-name {
        margin-left: 5px;
        max-width: 8em;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      .tag-close {
        color: #afafaf;
        font-size: 19px;
        font-weight: 600;
        cursor: pointer;
        margin: 0 5px;
      }
    }
    input {
      flex: 1;
      border: 0;
      height: 24px;
      line-height: 24px;
      margin: 0 5px 5px;
    }
  }
  .qw-search-select-list {
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    background-color: #fff;
    z-index: 9;
  }
}
</style>
