<template>
  <div class="qwui-email_edit">
    <div class="qwui-edit_item">
      <p class="qwui-edit_text">邮箱
        <span class="qwui-text_need">*</span>
      </p>
      <div class="qwui-content">
        <input class="qwui-content_edit"
               type="text"
               placeholder="请输入"
               maxlength="30"
               v-model="option.detail[0].title"
               @blur="check">
      </div>
      <div class="qwui-content_tip"
           v-show="checkFlag">
        <span>邮箱格式不合法</span>
      </div>
    </div>
  </div>
</template>

<script>
const emailCheck = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z]{2,5}$/
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
  methods: {
    check() {
      if (!this.option.detail[0].title) {
        this.checkFlag = true
        return
      }
      if (!emailCheck.test(this.option.detail[0].title)) {
        this.checkFlag = true
        return
      }
      this.checkFlag = false
    }
  },
  created() {
    if (!this.option.detail.length) {
      this.option.detail = [{}]
    }
    if (!this.option.detail[0].title) {
      return
    }
    this.check()
  }
}
</script>

<style lang="scss" scoped>
.qwui-email_edit {
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
        border: 1px solid #d5d5d5;
        font-size: 12px;
        border-radius: 2px;
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


