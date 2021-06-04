<template>
  <div class="qw-dialog">
    <div class="qw-mask"
         v-show="show"
         @click="onClickMask"
         :style="{zIndex:zIndex-1}">
    </div>
    <div class="qw-dialog-box"
         v-show="show"
         :style="dialogStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "qw-dialog",
  props: {
    show: {
      type: Boolean,
      default: false
    },

    zIndex: {
      type: Number,
      default: 501
    },
    width: {
      type: Number
    }
  },
  model: {
    prop: "show",
    event: "change"
  },
  data() {
    return {};
  },
  watch: {
    show(val) {
        this.$emit("update:show", val);
        this.$emit(val ? "on-show" : "on-hide");
        // //弹窗显示 背景禁止滚动
        // if (val) {
        //   this.addModalClassName();
        // } else {
        //   this.removeModalClassName();
        // }
      }
    
  },
  // beforeDestroy() {
  //   this.removeModalClassName();
  // },
  // deactivated() {
  //   this.removeModalClassName();
  // },
  computed: {
    dialogStyle() {
      let style = {
        "z-index": this.zIndex
      };
      if (!this.width) return style;
      style = Object.assign({}, style, { width: `${this.width}px` });
      return style;
    }
  },
  methods: {
    onClickMask() {
        this.$emit("on-click-mask");
    },
    // addModalClassName() {
    //   if (!document.body.className.includes("qw-modal-open")) {
    //     document.body.className += "qw-modal-open";
    //   }
    // },
    // removeModalClassName() {
    //   if (document.body.className.includes("qw-modal-open")) {
    //     document.body.className = document.body.className
    //       .replace("qw-modal-open", " ")
    //       .replace(/^\s+|\s+$/g, "");
    //   }
    // }
  }
};
</script>
<style lang="scss" scoped>
.qw-dialog {
  .qw-mask {
    position: fixed;
    z-index: 500;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    overflow: hidden;
    top: 0;
    left: 0;
  }
  .qw-dialog-box {
    position: fixed;
    display: table;
    z-index: 501;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    overflow: hidden;
  }
}
</style>
