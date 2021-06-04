<template>
  <div class="crm-avator"
       :size="size"
       :style="avatorStyle">
    <img ref="avator"
         class="crm-avator-image"
         :src="src"
         @error="error"
         alt="头像">
    <!-- <x-img class="crm-avator-image"
           :src="src"
           :default-src="defaultSrc"
           @on-success="success"
           @on-error="error"
           :offset="offset"
           :container="container"></x-img> -->
  </div>
</template>

<script>
import { XImg } from "vux";

export default {
  name: "crmAvator",
  components: {
    XImg
  },
  props: {
    avatorSrc: String,
    size: {
      type: [Number, String],
      default: "small" //small mini
    },
    avatorStyle: Object,
    defaultSrc: {
      default: require("../../../assets/images/icon_person.png")
    },
    offset: {
      default: Number.MAX_SAFE_INTEGER
    }
  },
  data() {
    return {
      src: this.avatorSrc || this.defaultSrc
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.avatorSrc) {
        if (this.avatorSrc.includes("base64")) {
          this.src = this.avatorSrc;
        } else if (!this.avatorSrc.includes("http")) {
          this.src = _.filterCompressURL(this.avatorSrc);
        }
      }
    },
    success(...args) {
      this.$emit("on-success", ...args);
    },
    error(...args) {
      this.src = this.defaultSrc;
      this.$emit("on-error", ...args);
    }
  }
};
</script>
<style lang="scss" scoped>
.crm-avator {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  &[size="mini"] {
    width: 20px;
    height: 20px;
  }
  &-image {
    width: 100%;
    height: 100%;
  }
}
</style>

