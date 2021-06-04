<template>
  <div v-click-outside="onClickedOutside"
       class="qw-popover-component"
       @mouseover="mouseover"
       @mouseout="mouseout">
    <span ref="trigger"
          @click="toggle">
      <slot>
      </slot>
    </span>
    <div class="qw-popover"
         ref="popover"
         :style="popoverStyle"
         v-show="show">
      <div :class="arrowClass"
           v-if="showArrow"></div>
      <div @click="$emit('on-click-content')">
        <slot name="content">
          <div v-html="content"></div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "../../directives/click-outside";

export default {
  name: "qwPopover",
  mounted() {
    this.$nextTick(() => {
      this.init();
      window.addEventListener("resize", this.reset);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.reset);
  },
  directives: {
    ClickOutside
  },
  props: {
    content: String,
    placement: String,
    gutter: {
      type: Number,
      default: 5
    },
    showArrow: {
      //是否显示三角标
      type: Boolean,
      default: true
    },
    hover: {
      //hover形式调用
      type: Boolean,
      default: false
    }
    // align: {
    //   type: String,
    //   default: "center",
    //   validator: val => {
    //     return ["start", "center", "end"].includes(val);
    //   }
    // }
  },
  methods: {
    reset() {
      if (this.show) {
        this.init(true);
      }
    },
    init(isReset) {
      const trigger = this.$refs.trigger.children[0];
      const popover = this.$refs.popover;
      switch (this.placement) {
        case "top":
          this.position.left =
            trigger.offsetLeft -
            popover.offsetWidth / 2 +
            trigger.offsetWidth / 2;
          this.position.top =
            // trigger.getBoundingClientRect().top -
            trigger.offsetTop - popover.offsetHeight - this.gutter;
          break;
        case "left":
          this.position.left =
            trigger.offsetLeft - popover.offsetWidth - this.gutter;
          this.position.top =
            // trigger.getBoundingClientRect().top +
            trigger.offsetTop +
            trigger.offsetHeight / 2 -
            popover.offsetHeight / 2;
          break;
        case "right":
          this.position.left =
            trigger.offsetLeft + trigger.offsetWidth + this.gutter;
          this.position.top =
            // trigger.getBoundingClientRect().top +
            trigger.offsetTop +
            trigger.offsetHeight / 2 -
            popover.offsetHeight / 2;
          break;
        case "bottom":
          this.position.left =
            trigger.offsetLeft -
            popover.offsetWidth / 2 +
            trigger.offsetWidth / 2;
          this.position.top =
            // trigger.getBoundingClientRect().top +
            trigger.offsetTop + trigger.offsetHeight + this.gutter;
          break;
        default:
          console.warn("Wrong placement prop");
      }
      if (!isReset) {
        this.show = false;
      }

      this.popoverStyle = {
        top: this.position.top + "px",
        left: this.position.left + "px",
        display: isReset ? this.popoverStyle.display : "none"
      };
    },
    onClickedOutside() {
      if (this.show) {
        this.show = false;
        this.$emit("on-hide");
      }
    },
    toggle(val) {
      if (typeof val == "undefined") {
        this.show = !this.show;
      } else {
        this.show = !!val;
      }
      if (this.show) {
        this.$nextTick(() => {
          this.init(true);
        });
      }
      this.$emit(`on-${this.show === true ? "show" : "hide"}`);
    },
    mouseover() {
      clearTimeout(this.timer);
      this.hover && this.toggle(true);
    },
    mouseout() {
      if (this.hover) {
        this.timer = setTimeout(() => {
          this.toggle(false);
        }, 200);
      }
    }
  },
  data() {
    return {
      position: {
        top: 0,
        left: 0
      },
      show: true,
      popoverStyle: {}
    };
  },
  computed: {
    arrowClass() {
      return {
        "qw-popover-arrow": true,
        "qw-popover-arrow-up": this.placement === "bottom",
        "qw-popover-arrow-right": this.placement === "left",
        "qw-popover-arrow-left": this.placement === "right",
        "qw-popover-arrow-down": this.placement === "top"
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.qw-popover {
  position: absolute;
  left: 0;
  top: 0;
  background-color: transparent;
  color: #333;
  border-radius: 4px;
  z-index: 500;
}
.qw-popover-arrow {
  position: absolute;
  width: 0;
  height: 0;
}
.qw-popover-arrow-up {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid #fff;
  left: 50%;
  transform: translateX(-50%);
  top: -5px;
}
.qw-popover-arrow-down {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #fff;
  left: 50%;
  transform: translateX(-50%);
  bottom: -5px;
}
.qw-popover-arrow-left {
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 5px solid #fff;
  top: 50%;
  transform: translateY(-50%);
  left: -5px;
}
.qw-popover-arrow-right {
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid #fff;
  top: 50%;
  transform: translateY(-50%);
  right: -5px;
}
</style>

