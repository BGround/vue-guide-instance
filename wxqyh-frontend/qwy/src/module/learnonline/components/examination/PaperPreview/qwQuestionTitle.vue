<template>
  <div class="qwui-paper_preview_questions_title"
  >
    <!-- 题目 -->
    <slot name="questionsTitle"><div class="questions_title" v-html=questionsTitle></div></slot>
    
    <div class="question_title_img_wrap" v-if="picShow && picList">
      <img 
        class="question_title_img"
        v-for="(picItem, index) in picList"
        :src="$completeImgUrl(picItem.picPath)"
        :key="index"
      >
    </div>
  </div>
</template>

<script>


export default {
  name: 'QwQuestionsTitle',
  components: {
  },

  props: {
    content: { // 题目内容
      type: String,
      default: ''
    },
    setScore: { // 题目分值
      type: [String, Number],
      defalut: ''
    },
    questionIndex: { // 题序下标
      type: [String, Number],
      default: ''
    },
    picList: { // 题目图片数组
      type: Array,
      default: []
    },
    picShow: { // 题目图片是否展示
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
    };
  },
  computed: {
    questionsTitle() {
      let questionIndex = this.questionIndex;
      let index = typeof questionIndex == 'number'? questionIndex + '. ': 
                  typeof questionIndex == 'string'? questionIndex: '';
      let retStr =  `${index}${this.$checkjs(this.content)}`;
      retStr += this.setScore != ''? `（${this.setScore}分）`: ''; // 有分值

      return retStr;
    }
  },
};
</script>

<style lang="scss" scoped>
.qwui-paper_preview_questions_title {
  margin-bottom: 15px;
  
  .question_title_img_wrap {
    margin: 5px 0 0 25px;

    .question_title_img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
  }
}
</style>
