<template>
  <qw-dialog class="qw-modal"
             v-model="show"
             @on-show="onShow"
             @on-hide="onHide"
             @on-click-mask="onClickMask"
             :zIndex="zIndex"
             :width="width">
    <div class="modal-container">
      <div class="modal-header">
        <div class="header-title">{{title}}</div>
        <div class="header-close"
             v-if="showClose"
             @click="hide">×</div>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-fotter"
           v-if="showCancelButton||showConfirmButton">
        <qw-button @click="onCancel"
                   v-if="showCancelButton"
                   class="mr20">{{cancelButtonText}}</qw-button>
        <qw-button type="primary"
                   @click="onConfirm"
                   v-if="showConfirmButton">{{confirmButtonText}}</qw-button>
      </div>
    </div>
  </qw-dialog>
</template>

<script>
import QwDialog from "./qwDialog";
import QwButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
export default {
  name: "QwModal",
  components: {
    QwDialog,
    QwButton
  },
  props: {
    show: {
      // 显示隐藏 v-model 或者 sync
      type: Boolean,
      default: false
    },
    hideOnBlur: {
      //是否在点击遮罩时自动关闭弹窗
      type: Boolean,
      default: false
    },
    showClose: {
      //  是否显示右上角关闭按钮
      type: Boolean,
      default: true
    },
    showCancelButton: {
      //  是否显示取消按钮
      type: Boolean,
      default: false
    },
    showConfirmButton: {
      //  是否显示确定按钮
      type: Boolean,
      default: true
    },
    cancelButtonText: {
      //  取消按钮的文本内容
      type: String,
      default: "取消"
    },
    confirmButtonText: {
      //  确定按钮的文本内容
      type: String,
      default: "确定"
    },
    // modal的宽度
    width: {
      type: Number
    },
    title: String,
    zIndex: Number
  },
  model: {
    prop: "show",
    event: "change"
  },
  watch: {
    show(val) {
      this.$emit("update:show", val);
    }
  },
  methods: {
    hide() {
      this.$emit("update:show", false);
      this.$emit("change", false);
    },
    onShow() {
      this.$emit("on-show");
    },
    onHide() {
      this.$emit("on-hide");
    },
    onClickMask() {
      if (this.hideOnBlur) {
        this.$emit("update:show", false);
        this.$emit("change", false);
        this.$emit("on-click-mask");
      }
    },
    onCancel() {
      this.$emit("on-cancel");
    },
    onConfirm() {
      this.$emit("on-confirm");
    }
  }
};
</script>
<style lang="scss" scoped>
.qw-modal {
  .modal-container {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    overflow: hidden;
    .modal-header {
      padding-left: 20px;
      height: 60px;
      background-color: #f7f7f7;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      color: #333;
      .header-close {
        padding: 12px 16px;
        line-height: 1;
        font-style: normal;
        font-size: 30px;
        color: #ccc;
        cursor: pointer;
      }
    }
    .modal-fotter {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 65px;
      background: #fff;
      button {
        margin: 0 10px;
      }
    }
  }
  .modal-body {
    max-height: 548px;
    overflow: auto;
  }
}
</style>

