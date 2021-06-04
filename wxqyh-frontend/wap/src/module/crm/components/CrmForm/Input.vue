<template>
  <label class="crm-form-input crm-form-item">
    <div class="item-label">
      <span>{{title}}</span>
      <span v-if="required"
            class="item-label-required">*</span>
    </div>
    <div class="item-content"
         :isLink="isLink">
      <input :type="inputType"
             v-model="currentValue"
             :placeholder="placeholder"
             :disabled="isLink">
      <span class="item-content-link"
            v-if="isLink"></span>
    </div>
  </label>
</template>

<script>
export default {
  name: "CrmFromInput",
  props: {
    value: String,
    title: String,
    inputType: {
      default: "text"
    },
    placeholder: {
      default: "请输入"
    },
    isLink: {
      default: false
    },
    required: {
      default: false
    }
  },
  data() {
    return {
      currentValue: ""
    };
  },
  watch: {
    value(val) {
      // console.log(val);
      this.currentValue = val;
    },
    currentValue(val) {
      this.$emit("input", val);
    }
  },
  mounted() {
    this.currentValue = this.value || "";
  }
};
</script>
<style lang="scss" scoped>
.crm-form-input {
  .item-content {
    display: flex;
    margin-top: 7px;
    input {
      flex: 1;
      font-size: 15px;
      color: #181a20;
      &:disabled {
        background-color: #fff;
        opacity: 1;
      }
    }
    &-link {
      display: inline-block;
      height: 16px;
      width: 16px;
      background: url("~assets/images/crm/icon_go.png") no-repeat;
      background-size: contain;
    }
  }
}
</style>



