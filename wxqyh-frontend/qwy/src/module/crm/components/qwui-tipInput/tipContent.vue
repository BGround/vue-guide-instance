<template>
  <div class="tipContent"
       v-show="visible">
    <div class="wrap">
      <li v-for="(option, index) in tipList"
          :key="index"
          class="tip-item"
          @click="selectItem(option)">
        <i class="default-head-pic"
           v-if="option.icon == 0"></i>
        <img class="icon"
             v-if="option.icon && option.icon != 0"
             :src="option.icon"
             width="26px"
             height="26px" />
        <span>{{option.label}}</span>
      </li>
    </div>
  </div>
</template>

<script>
const EVENT_INPUT = "input";
const EVENT_SELECT = "select";
export default {
  components: {},
  props: {
    optionList: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    },
    value: {
      type: Boolean
    }
  },
  data() {
    return {
      isClose: false
    };
  },
  computed: {
    tipList() {
      let list = JSON.parse(JSON.stringify(this.optionList));
      this.isClose = false;
      return list;
    },
    visible: {
      get() {
        if (this.tipList.length === 0) {
          return false;
        } else if (this.isClose) {
          return false;
        }
        return true;
      }
    }
  },
  watch: {
    value(newV) {
      this.visible = newV;
    }
  },
  methods: {
    selectItem(option) {
      this.isClose = true;
      this.$emit(EVENT_SELECT, option);
    }
  }
};
</script>
<style lang='scss' scoped>
.tipContent {
  width: 200px;
  height: 265px;
  background: #fff;
  box-shadow: #c7c7c7 0px 0px 18px;
  overflow: auto;
  z-index: 5;
  .wrap {
    .tip-item {
      list-style: none;
      display: flex;
      align-items: center;
      padding: 0 12px;
      &:hover {
        background: #f7f7f7;
      }
      .icon,
      .default-head-pic {
        width: 26px;
        height: 26px;
        margin-right: 5px;
      }
      .default-head-pic {
        background: url("~assets/images/touxiang02.png") no-repeat;
        background-size: 100%;
      }
    }
  }
  // .tip-item:hover {
  //   background: #865b5b !important;
  // }
}
</style>