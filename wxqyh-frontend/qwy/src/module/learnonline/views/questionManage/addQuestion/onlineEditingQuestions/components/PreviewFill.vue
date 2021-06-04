<template>
  <div class="onlineEditing_preview_fill">
    <!-- 题目头部 -->
    <preview-question-header
      :questionType="question.questionType"
      :content="question.content"
      :sequence="question.otherInfo.sequence"
      :isManual="question.isManual"
    ></preview-question-header>
    
    <!-- 填空项 -->
    <div class="fill_item_wrap">
      <div 
        class="fill_item"
        v-for="(item,index) in fillItem"
      >{{'填空项' + (index+1) + '：' + item}}</div>
    </div>

    <!-- 解析 -->
    <div
      class="answerRemark" 
      v-if="answerRemark"
      v-html="$checkjs(answerRemark)"
    ></div>
  </div>
</template>

<script>
import PreviewQuestionHeader from './PreviewQuestionHeader'; // 题目头部组件
export default {
  name: 'PreviewFill',
  components: {
    PreviewQuestionHeader,
  },
  props: {
    question: {
      type: Object,
      required: true
    }
    // question
    // {
    //   questionType: 题目类型0判断；1单选；2多选；3问答；4填空
    //   content: 题目
    //   answer: 答案
    //   answerRemark: 解析
    //   option: {  选项
    //     content: 选项文本
    //     sort: 排序
    //     isAnswer: 是否为答案
    //   } 
    //   isDisorder: 填空题顺序一致
    //   allowPic: 问答题允许上传照片作为答案
    //   isManual: 评分模式
    //   otherInfo: { 自定义信息
    //     row: { 题范围
    //       up: 上限
    //       down 下限
    //     },
    //     oriContent: 题目源文本，包含选项 // 如果后续无利用价值，这里要delete
    //     oriOption: 选项源文本
    //     essayQuestionMatch: 问答题匹配项
    //     sequence: 题序
    //   }
    // }
  },

  data() {
    return {

    };
  },
  computed: {
    // 填空项，用答案去分割
    fillItem() {
      if (!this.question.answer) {return [];} // 无答案则无需分割
      return this.question.answer.split('|||');
    },
    answerRemark() {
      let answerRemark = this.question.answerRemark;
      return answerRemark? `解析：${answerRemark}`: '';
    },
  },
  watch: {

  },
  created() {
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
.onlineEditing_preview_fill {
  
  .fill_item_wrap {
    margin: 9px 0 0 16px;
    font-size: 14px;
    line-height: 28px;
    color: #383838;
  }

  .answerRemark {
    margin-top: 8px;
    font-size: 14px;
    line-height: 18px;
    color: #AFB3BC;
  }
}
</style>
