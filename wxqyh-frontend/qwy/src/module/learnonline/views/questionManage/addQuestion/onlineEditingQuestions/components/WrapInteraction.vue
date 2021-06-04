<template>
  <div class="onlineEditing_interaction flex">
    <!-- 按钮 -->
    <div class="flexItem">
      <!-- 查看编辑示例 -->
      <qwui-button 
        type="primary"
        @click="showExample"
      >查看编辑示例</qwui-button>
      <!-- 清空文本 -->
      <qwui-button
        :disabled="isEmpty"
        @click="clearContent"
      >清空文本</qwui-button>
    </div>


    <!-- 提示文本_预览区： -->
    <div class="flexItem lable_preview">
      预览区：
      <span 
        class="tip_error" 
        v-show="errorInfoArr.length"
      >
        共有 {{errorInfoArr.length}} 处错误，请参照编辑示例修改
        <qwui-button 
          class="button_error"
          type="primary"
          @click="showError"
        >查看</qwui-button>
      </span>
    </div>
  </div>
</template>

<script>
import QwuiButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import { mapGetters, mapMutations} from 'vuex';

export default {
  name: 'WrapInteraction',
  components: {
    QwuiButton
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters ('questionManageOnlineEditing', [
      'hasContent',
      'errorInfoArr',
      'Bus'
    ]),

    // 空文本
    isEmpty() {
      return !this.hasContent; // 不用length  只要有无文本即可，无需计算长度浪费性能
    }
  },

  methods: {
     ...mapMutations('questionManageOnlineEditing', [
      'SET_EXAMPLE'
    ]),
    // 查看编辑示例
    showExample() {
      this.SET_EXAMPLE({show: true});
    },

    // 清空文本
    clearContent() {
      this.isEmpty || this.Bus.$emit('clearContent');
    },

    // 点击错误事件, 聚焦错误
    showError() {
      this.Bus.$emit('focusQuestionErr');
    }
  },
}
</script>
<style lang="scss" scoped>
.onlineEditing_interaction {
  height: 56px;
  line-height: 56px;


  .lable_preview {
    font-size: 14px;
    color: #808080;
  
    .tip_error {
      color: #F56262;

      .button_error {
        width: 40px;
        height: 20px;
        margin: 0 0 4px 2px;
        padding: 0;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
}
</style>
