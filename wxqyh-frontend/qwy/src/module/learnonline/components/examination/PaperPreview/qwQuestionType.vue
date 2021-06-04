<template>
  <div class="qwui-paper_preview_questions_type"
  >
    <!-- 类型名称/总题数 -->
    <div class="questions_type">{{questionType}}</div>
    
    <!-- 题 -->
    <question
      v-for="(question, index) in section.optionList"
      :question="question"
      :key="index"
    ></question>
  </div>
</template>

<script>
import Question from './qwQuestion';

export default {
  name: 'QwQuestionsType',
  components: {
    Question,
  },

  props: {
    section: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
    };
  },

  computed: {
    questionType() {
      return `${this.section.title}（${this.section.questionCount}题，共${this.section.totalScore}分）`;
    },
  },
};
</script>

<style lang="scss" scoped>
.qwui-paper_preview_questions_type {
  
  .questions_type {
    padding: 10px 0;
    font-size: 18px;
    color: #333;
  }
}
</style>
