<template>
  <div class="dealer-feedback">
    <div class="header">经销商反馈</div>

    <div class="lebel lebel-required">投资人意见</div>
    <div class="text">
      <textarea :disabled="isDisabled"
        v-model="content">请输入</textarea>
    </div>

    <button :disabled="content.length===0 || isDisabled" @click="handleSubmit"
      class="submit">确认已查阅</button>
  </div>
</template>

<script>

export default {
  name:'dealer-feedback',
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    },
    feedback: {
      type: String,
      default() {
        return ''
      }
    },

  },
  components: {

  },
  data() {
    return {
      content: this.feedback || ''
    }
  },
  computed: {
    isDisabled(){
      if (typeof this.info.managerCheckStatus === 'undefined') {
          return false
      }else{
        return this.info.managerCheckStatus === 1;
      }
    }
  },
  watch: {
    feedback(value){
      debugger
      this.content = value ||''
    }
  },
  methods: {


    handleSubmit() {
      if (!this.content) {
        this.$toast('不能反馈内容为空')
        return
      }

      this.$emit('submit', {
        content: this.content,
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dealer-feedback {
  .upload__wrapper {
    padding: 0 27px;
    margin-bottom: 10px;
  }
  /deep/ {
    .qw-upload-list {
      display: flex;
      padding: 0 27px;
    }
    .qw-upload-list__item {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      margin-bottom: 10px;
      flex-wrap: wrap;
      justify-content: flex-start;
      & > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      position: relative;
    }
    .qw-upload-list__item-name {
      display: none;
    }

    .qw-upload-list__item-actions {
      display: none;
    }
    .qw-upload-list__item-del {
      position: absolute;
      top: 0;
      right: 0;
      transform: translate(50%, -50%);
    }
  }

  background: #ffffff;
  padding-bottom: 22px;
  .header {
    height: 24px;
    font-size: 17px;
    font-weight: 600;
    line-height: 24px;
    color: rgba(20, 30, 40, 1);
    padding-bottom: 11px;
    padding-left: 26px;
    padding-top: 16px;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      display: block;
      height: 16px;
      border-radius: 2px;
      width: 4px;
      top: 50%;
      background-color: #c6001f;
      top: 21px;
      left: 18px;
    }
  }
  .lebel {
    height: 19px;
    font-size: 13px;
    padding-left: 26px;
    font-weight: 600;
    line-height: 23px;
    color: rgba(102, 102, 102, 1);
    padding-bottom: 4px;
  }
  .upload-btn {
    margin-left: 26px;
    margin-bottom: 16px;
    width: 25px;
    height: 25px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(208, 208, 208, 1);
    opacity: 1;
    border-radius: 3px;
    background-size: 20px 20px;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url('~@/module/channelManagement/static/images/icon_paper_clip.png');
  }

  .text {
    margin: 10px 26px 20px;
    background: rgba(255, 255, 255, 1);
    position: relative;
    & > textarea {
      width: calc(100% - 16px);
      padding: 8px;
      min-height: 78px;
      border: 1px solid rgba(208, 208, 208, 1);
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(208, 208, 208, 1);
    }
  }
  .submit {
    display: block;
    width: 113px;
    height: 28px;
    background: rgba(39, 129, 219, 1);
    opacity: 1;
    border-radius: 4px;
    color: #fff;
    border: 1px solid rgba(39, 129, 219, 1);
    text-align: center;
    margin: 0 auto;
    line-height: normal;
  }

  button.submit[disabled]{
    background: #eee;
    border: #aaa;
    color: #999;
  }
}
</style>
