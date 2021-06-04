<template>
  <div class="qwui-paper_preview_questions"
  >
    <!-- 题目 -->
    <question-title v-bind="question"></question-title>

    <!-- 题目内容 -->
    <component 
      :is="currentComponent" 
      :optionList="question.optionList"
    ></component>
  </div>
</template>

<script>
import QuestionTitle from './qwQuestionTitle'; // 题目组件
import GroupRadio from './qwGroupRadio'; // 单选框组
import GroupCheckbox from './qwGroupCheckbox'; // 多选框组
import Textarea from './qwTextarea'; // 问答题输入框

export default {
  name: 'QwQuestions',
  components: {
    QuestionTitle,
    GroupRadio,
    GroupCheckbox,
    Textarea
  },

  props: {
    question: { // 题目对象
      type: Object,
      required: true
    },
  },

  data() {
    return {
    };
  },
  computed: {
    // 当前操作题目组件
    currentComponent() {
      // 题目类型 0:判断题；1:单选题；2:多选题；3:问答题；4:填空题；
      let questionType = this.question.questionType;
      return  questionType < 2? GroupRadio:
              questionType == 2? GroupCheckbox:
              questionType == 3? Textarea: '';
    },

  },
};
</script>

<style lang="scss" scoped>
.qwui-paper_preview_questions {
  margin-bottom: 10px;
  padding: 20px 30px;
  border: none;
  background: #fff;
}
</style>
