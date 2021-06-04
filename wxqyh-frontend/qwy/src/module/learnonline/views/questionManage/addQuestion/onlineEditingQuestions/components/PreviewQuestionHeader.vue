<template>
  <div class="onlineEditing_preview_header">
   <!-- 头部序号 -->
    <div class="question_header">
      <span class="header_sequence" v-if="sequence">{{sequence}}.</span>
      <span class="header_type">{{nowQuestionTypeString + isManualString}}</span>
    </div>

    <!-- 题目 -->
    <div class="question_content" v-html="processContent(content)"></div>
  </div>
</template>

<script>

export default {
  name: 'PreviewQuestionHeader',
  components: {

  },
  props: {
    questionType: { // 题目类型 0判断；1单选；2多选；3问答；4填空
      type: Number,
      required: true
    },
    content: { // 题目内容
      type: String,
      required: true
    },
    sequence: { // 题序
      type: String,
      default: ''
    },
    isManual: { // 阅卷评分模式 -1无；0系统评分；1人工评分
      type: Number,
      default: -1
    }
  },

  data() {
    return {
      questionTypeString: ['判断题', '单选题', '多选题', '问答题', '填空题'] // 0判断；1单选；2多选；3问答；4填空
    };
  },
  computed: {
    // 当前题型文案
    nowQuestionTypeString() {
      return this.questionTypeString[this.questionType];
    },
    // 人工阅卷文案
    isManualString() {
      let isManual = this.isManual;
      let retString = isManual == -1? '':
                      isManual == 0? '系统评分': '人工评分';
      return retString? '-' + retString: retString; // 加个分割-
    }
  },
  watch: {

  },
  created() {
  },
  methods: {
    // 处理题目
    processContent(content) {
      let retContent = this.$checkjs(content);

      // 填空题 替换_成更长的
      return this.questionType == 4? retContent.replace(/_+/g, '__________'): retContent;
    }
  },
}
</script>

<style lang="scss" scoped>
.onlineEditing_preview_header {
  .question_header {

    .header_type {
      width: 48px;
      height: 20px;
      padding: 1px 6px;
      font-size: 12px;
      color: #2D95FF;
      border-radius: 2px;
      border: 1px solid #2D95FF;
    }
  }

  .question_content {
    margin-top: 10px;
    font-size: 16px;
    color: #383838;
  }
}
</style>
