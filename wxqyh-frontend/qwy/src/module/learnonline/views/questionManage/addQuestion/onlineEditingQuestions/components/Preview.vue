<template>
  <div class="onlineEditing_preview">
    <component
      class="preview_question"
      ref="question"
      :is="questionComponent[question.questionType]"
      v-for="(question,index) in questions"
      :class="{hasError: question.otherInfo.errArr.length}"
      :key="index"
      :question="question"
      @click.native="clickQuestion(index)"
    ></component>
  </div>
</template>

<script>
import PreviewChose from './PreviewChose'; // 选择组件
import PreviewFill from './PreviewFill'; // 填空题组件
import PreviewEssay from './PreviewEssay'; // 问答题组件
import { mapGetters } from 'vuex';

export default {
  name: 'Preview',
  components: {
    PreviewChose,
    PreviewFill,
    PreviewEssay
  },
  props: {
    questions: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      questionComponent: { // 0判断；1单选；2多选；3问答；4填空
        '0': PreviewChose,
        '1': PreviewChose,
        '2': PreviewChose,
        '3': PreviewEssay,
        '4': PreviewFill,
      },
    };
  },
  computed: {
    ...mapGetters ('questionManageOnlineEditing', [
      'firstErrIndex',
      'Bus',
    ]),
  },
  watch: {
  },
  created() {
    // 监听点击错误事件, 聚焦错误
    this.Bus.$on('focusQuestionErr', () => {
      this.focusQuestion(this.firstErrIndex);
    });
    this.Bus.$on('focusQuestion', (questionIndex) => {
      this.focusQuestion(questionIndex);
    });
  },
  methods: {
    // 点击了预览题目
    clickQuestion(index) {
      let question = this.questions[index];
      this.$emit('clickQuestion', question.otherInfo.row);
    },

    // 题目滚动聚焦
    focusQuestion(index) {
      // 超数组量无需聚焦
      let questionLength = this.questions.length
      if (index < 0 || index >= questionLength) {return;}
      this.$refs.question[index]['$el'].scrollIntoView();
    }
  },
}
</script>

<style lang="scss" scoped>
.onlineEditing_preview {
  padding: 8px 16px;
  cursor: default;
  overflow: auto;

  .preview_question {
    margin-bottom: 12px;
    padding: 10px 8px 20px;

    &:not(:last-of-type) {
      border-bottom: 1px solid #F5F5F5;
    }
  }

  .hasError {
    background: #FEF7F7;
  }
}
</style>
