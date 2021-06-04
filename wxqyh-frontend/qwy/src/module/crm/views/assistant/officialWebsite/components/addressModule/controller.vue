<template>
  <div class="qwui-adress_edit">
    <div class="qwui-edit_item">
      <p class="qwui-edit_text">地址
        <span class="qwui-text_need">*</span>
      </p>
      <div class="qwui-content">
        <input class="qwui-content_edit"
               type="text"
               placeholder="请输入"
               v-model="option.detail[0].title"
               @blur="check"
               maxlength="300">
        <span class="qwui-content_tip"
              :class="option.detail[0].title.length === 300? 'qwui-tip_warn': ''">{{option.detail[0].title.length}}/300</span>
      </div>
      <div class="qwui-content_tip"
           v-show="checkFlag">
        <span>地址不能为空</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkFlag: false
    }
  },
  props: {
    option: {
      default: {},
      type: Object
    }
  },
  created() {
    if (!this.option.detail.length) {
      this.option.detail = [{ title: '' }]
    }
  },
  methods: {
    check() {
      if (!this.option.detail[0].title) {
        this.checkFlag = true
        return
      }
      this.checkFlag = false
    }
  }
}
</script>

<style lang="scss" scoped>
.qwui-adress_edit {
  width: 100%;
  .qwui-edit_item {
    padding: 24px;
    .qwui-edit_text {
      position: relative;
      font-size: 14px;
      line-height: 19px;
      color: #333;
      width: 35px;
      margin-bottom: 16px;
      .qwui-text_need {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        color: #ee5037;
      }
    }
    .qwui-content {
      position: relative;
      .qwui-content_edit {
        width: 100%;
        height: 32px;
        box-sizing: border-box;
        padding: 0 8px;
        padding-right: 56px;
        border: 1px solid #d5d5d5;
        font-size: 12px;
        border-radius: 2px;
      }
      .qwui-content_tip {
        height: 16px;
        line-height: 16px;
        position: absolute;
        color: #ccc;
        top: 50%;
        margin-top: -8px;
        right: 8px;
        font-size: 12px;
      }
      .qwui-tip_warn {
        color: #ee5037;
      }
    }
    .qwui-content_tip {
      margin-top: 8px;
      font-size: 12px;
      line-height: 16px;
      color: #f56262;
    }
  }
}
</style>


