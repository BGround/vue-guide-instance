<template>
<div class="qwui-search_wrap border-bottom-1px">
  <search-box
    class="qwui-search_box"
    :searchinput="searchinput"
    @listenToSearchBox="listenToSearchBox"
  ></search-box>
  <span class="qwui-advanced_btn" @click="$emit('showAdvancedSearch')"></span>
  </div>
</template>

<script>
import SearchBox from '@/components/base/search_box';

export default {
  name: 'QwAdvanceSearchBox',
  components: {
    SearchBox,
  },
  props: {
    searchinput: Object,
  },
  methods: {
    listenToSearchBox(val) {
      this.$emit('listenToSearchBox', val);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '~../../styles/variable';

  .qwui-search_wrap {
    display: flex;
    width: 100%;

    &::before {
      z-index: 2;
    }

    .qwui-search_box {
      flex: 1;
    }

    .qwui-advanced_btn {
      position: relative;
      width: 35px;
      margin-left: -7px;
      background: $color-background;

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 32px;
        transform: translate(-50%, -50%) scale(0.5);
        background: url('~assets/images/qwui-content.png') no-repeat 0 -43px;
      }
    }
  }


/* 覆盖搜索框样式 */
.qwui-search_box /deep/ {
  .qwui-search_bar {
    background: #fff;

    &::after {
      border: none;
    }
  }

  .qwui-search_inner, .qwui-search_text {
    background: #F3F4F7;
  }

 .qwui-full_width {
    background: #F7F7F7;
  }
}

@media screen and (min-width: 1024px){
  .search-wrap{
    width: 740px;
  }
}
</style>

