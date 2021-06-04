<template>
  <label class="crm-form-textarea crm-form-item">
    <div class="item-label">
      <span>{{title}}</span>
      <span v-if="required"
            class="item-label-required">*</span>
    </div>
    <div class="item-content">
      <InputTextarea v-model="currentValue"
                     :autosize="{minRows:1,maxRows:10}"
                     :rows="1"
                     :maxLength="maxLength"
                     :placeholder="placeholder">
      </InputTextarea>
      <span class="item-content-counter"
            :warning="currentValue.length>=maxLength"
            v-if="showCounter&&currentValue">
        {{currentValue.length+'/'+maxLength}}
      </span>
    </div>
  </label>
</template>
<script>
import InputTextarea from "@/components/input/inputTextarea";
export default {
  name: "CrmFromTextarea",
  components: { InputTextarea },
  props: {
    value: String,
    title: String,
    showCounter: {
      default: false
    },
    required: {
      default: false
    },
    maxLength: Number,
    placeholder: {
      default: "请输入"
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
      if (val.length <= this.maxLength) {
        this.$emit("input", val);
      } else {
        this.currentValue = this.currentValue.slice(0, this.maxLength);
      }
    }
  },
  mounted() {
    this.currentValue = this.value || "";
  }
};
</script>
<style lang="scss" scoped>
.crm-form-textarea {
  .item-content {
    position: relative;
    margin-top: 7px;
    &-counter {
      position: absolute;
      bottom: -14px;
      right: 0;
      color: #999;
      &[warning="true"] {
        color: #ff5a72;
      }
    }
  }
}
</style>
<style lang="scss">
.crm-form-textarea {
  .item-content {
    textarea {
      border: 0;
      font-size: 15px;
      color: #1b233a;
      resize: none;
      width: 100%;
    }
  }
}
</style>


