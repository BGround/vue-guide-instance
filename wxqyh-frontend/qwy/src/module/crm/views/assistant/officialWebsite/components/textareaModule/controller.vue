<template>
  <div class="richTextModule">
    <div class="richTextContainer">
      <editor :config="editorOption"
              agentCode="crmmini"
              :defaultMsg="option.detail[0].content"
              ref="editor"></editor>
    </div>
    <qwui-button type='primary'
                 @click="save()">保存</qwui-button>
  </div>
</template>

<script>
import QwuiButton from 'components/qwuiBase/qwuiButton/qwuiButton'
import Editor from 'components/base/editor'
const EDITOR_OPTION = {
  initialFrameHeight: 350,
  enableAutoSave: false,
  saveInterval: 3000,
  maximumWords: 20000,
  wordCountMsg: '{#count}/20000',
  wordOverFlowMsg:
    "<span style='color:red;'>您输入的字符已超出2W限制，将无法提交富文本！</span>",
  autoHeightEnabled: false, //禁止自动改变高度
  toolbars: [
    [
      'fullscreen',
      'source',
      '|',
      'undo',
      'redo',
      '|',
      'bold',
      'italic',
      'underline',
      'forecolor',
      '|',
      'insertorderedlist',
      'insertunorderedlist',
      'fontsize',
      'justifyleft',
      'justifycenter',
      'justifyright',
      'justifyjustify',
      'insertimage'
    ]
  ]
}

export default {
  components: {
    Editor,
    QwuiButton
  },
  data() {
    return {
      editorOption: EDITOR_OPTION
    }
  },
  props: {
    option: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created() {
    if (this.option.detail.length === 0) {
      this.option.detail = [{}]
    }
  },

  methods: {
    init() {
      this.$refs.editor.setUEContent(this.option.detail[0].content)
    },
    save() {
      this.$set(
        this.option.detail[0],
        'content',
        this.$refs.editor.getUEContent()
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.richTextModule {
  display: flex;
  align-items: center;
  flex-direction: column;
  .richTextContainer {
    padding: 24px;
  }
}
</style>


