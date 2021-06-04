<template>
  <!-- <transition name="fade"> -->
    <div class="qwui-topSpan" v-if="filterInfo.showSearchOrder || filterInfo.showSearchState">
      <div class="qwui-mask" @click="closeMask"></div>
      <div class="qwui-dialog_top">
        <div class="qwui-dialog_top_header">
          <a href="javascript:;" class="qwui-dialog_top_btn qwui-dialog_top_btn_default" v-for="(item, index) in optionInfo.data" :key="index"
            :class="{'active': index === optionInfo.activeIndex}" @click="search(index, item.sortBy, filterInfo.dataType)">
            {{item.name}}
          </a>
        </div>
      </div>
    </div>
  <!-- </transition> -->
</template>

<script>
  export default {
    name: 'searchFilter',
    props: {
      filterInfo: {
        type: Object,
      },
    },
    data() {
      return {
        testIndex: 1,
      }
    },
    craeted() {
    },
    methods: {
      search(index, val, type) {
        this.$emit('listenToSearchOrder',index, val, type)
      },
      closeMask() {
        this.filterInfo.showSearchOrder = false;
        this.filterInfo.showSearchState = false;
        this.$emit('toggleBody', 0)
      }
    },
    computed: {
      optionInfo () {
        return this.filterInfo.showSearchOrder ? this.filterInfo.searchOrder : this.filterInfo.searchState
      }
    }
  }

</script>

<style lang="scss" scoped>
.qwui-topSpan {
  opacity: 1;
  .qwui-mask {
    position: fixed;
    z-index: 10;
    top: 45px;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.2);
  }
  .qwui-dialog_top {
    // position: absolute;
    position: fixed;
    z-index: 10;
    top: 45px;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 80%;
    margin: 0 auto;
    text-align: center;
    background-color: #fff;
    overflow: hidden;
    .qwui-dialog_top_header {
      display: flex;
      flex-direction: column;
      a {
        position: relative;
        height: 20px;
        font-size: 15px;
        padding: 15px;
        text-align: left;
        color: #0A1735;
        &.active {
          &:after {
            content: '';
            position: absolute;
            right: 14px;
            font-size: 18px;
            color: blue;
            width: 18px;
            height: 18px;
            background: url(../../../../assets/svg/icon-a-public_tick.svg) no-repeat center center;
            background-size: 18px 18px;
          }
        }
      }
    }
  }
}

</style>
