
<template>
  <div class="learn-search" :style="{ width: searchSetting.width + 'px', height: searchSetting.height + 'px' }">
    <input type="text" class="input"
           :style="{ width: (searchSetting.width-44) + 'px', lineHeight: (searchSetting.height-12) + 'px', }"
           :placeholder="searchSetting.placeholder"
           v-model="msg"
           @keyup.enter="searchCourse"
           @blur="searchCourse"
    >
    <span class="icon" @click="searchCourse"></span>
  </div>
</template>

<script>
// import base from '../mixins/base'

export default {
  name: 'searchBox',

  props: {
    searchSetting: {
      type: Object,
      required: true
    },
    keyWord: {
      type: String,
      required: true
    },
  },

  data() {
    return {
      msg: '',
    }
  },

  watch: {
    keyWord: {
      handler(val) {
        this.msg = val;
      },
      immediate: true,
    },
  },

  methods: {
    searchCourse() {
      this.$emit('click', this.msg);
    },
  },

}
</script>

<style lang="scss" scoped>
  .learn-search {
    padding: 6px 0 6px 12px;
    border:1px solid #D5D5D5;
    overflow: hidden;
    .input {
      float: left;
      border: none;
    }
    .icon {
      position: relative;
      top: -2px;
      display: inline-block;
      float: right;
      width: 30px;
      height: inherit;
      background: url(~assets/images/search_icon.png) no-repeat;
      cursor: pointer;
    }
  }
</style>
