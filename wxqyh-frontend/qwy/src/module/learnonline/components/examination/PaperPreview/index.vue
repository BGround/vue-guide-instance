<template>
  <div class="qwui-paper_preview"
  >
    <question-type
      v-for="(section, index) in sectionList"
      :section="section"
      :sectionIndex="index"
      :key="index"
    ></question-type>
  </div>
</template>

<script>
import QuestionType from './qwQuestionType';

export default {
  name: 'QwPaperPreview',
  components: {
    QuestionType,
  },

  props: {
    //选项的配置
    paper: {
      type: Object,
      required: true
    },
  },

  data() {
    return {
    };
  },

  computed: {
    examDataCopy() { // 原数据副本
      return this.processExamData(this.paper);
    },
    sectionList() { // 试卷数组
      let sectionList = this.examDataCopy && this.examDataCopy.sectionList || [];
      return sectionList;
    },

  },

  created() {
  },

  mounted() {
  },
  beforeDestroy () {

  },
  methods: {
    processExamData(data) {
      // 为题目赋值提序号、赋值变量存储答案
      let nowIndex = 0,
          fillIndex = -1, // 填空题排序
          answerIndex = -1, // 填空题排序
          sectionList = data.sectionList || [],
          sectionListLength = sectionList.length;


      // 排序
      sectionList.sort((obj, nextObj) => {
        return obj.sort - nextObj.sort;
      });

      for (let i = 0; i < sectionListLength; i++) {
        let nowSection = sectionList[i];
        let questionLength = nowSection.optionList? nowSection.optionList.length: 0;

        for (let j = 0; j < questionLength; j++) {
          ++nowIndex;
          let nowQuestion = nowSection.optionList[j];
          nowQuestion.questionIndex = nowIndex;
        }
      }
      return Object.assign({}, data); // 数据赋值
    }
  },

};
</script>

<style lang="scss" scoped>
.qwui-paper_preview {
  width: 980px;
  margin: 60px auto;

}
</style>
