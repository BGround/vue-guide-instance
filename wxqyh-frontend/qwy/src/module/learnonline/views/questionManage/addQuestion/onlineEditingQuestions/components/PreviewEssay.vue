<template>
  <div class="onlineEditing_preview_essay">
    <!-- 题目头部 -->
    <preview-question-header
      :questionType="question.questionType"
      :content="question.content"
      :sequence="question.otherInfo.sequence"
      :isManual="question.isManual"
    ></preview-question-header>
    
    <!-- 方框 -->
    <qwui-input 
      class="essay_textarea" 
      inputType="textarea"
      ref="qwuiInput"
    ></qwui-input>
    
    <!-- 答案 -->
    <div 
      class="answer" 
      v-if="answer"
      v-html="$checkjs(answer)"
    ></div>

    <!-- 匹配项 -->
    <div class="match" v-if="match">
      {{match}}
    </div>

  </div>
</template>

<script>
import QwuiInput from '@/components/qwuiBase/qwuiInput/qwuiInput'; // 公共-文本框组件
import PreviewQuestionHeader from './PreviewQuestionHeader'; // 题目头部组件
export default {
  name: 'PreviewEssay',
  components: {
    QwuiInput,
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
    // 匹配项 问答题用的就是答案key
    match() {
      let answer = this.question.answer;
      return answer? `匹配项：${answer}`: ''
    },
    // 答案 问答题用的就是答案解析key
    answer() {
     let answerRemark = this.question.answerRemark;
      return answerRemark? `答案：${answerRemark}`: ''
    }
  },
  watch: {

  },
  created() {
  },
  mounted() {
    this.$nextTick(() => { // 编辑框设置为只读，禁止操作
      // 多段判空赋值，避免空值报错
      let qwuiInput = this.$refs.qwuiInput;
      let textareaNode = qwuiInput && qwuiInput.$refs.textareaNode
      textareaNode && textareaNode.setAttribute('readonly', 'readonly');
    });
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
.onlineEditing_preview_essay {
  
  .essay_textarea {
    margin: 8px 0 0 16px;

    /deep/ {
      .qw_textarea {
        width: 500px;
        height: 76px;
        resize: none;
        cursor: default;
      }
      .textarea_tips {
        display: none;
      }
    }
  }

  .answer, .match {
    margin: 8px 0 0 16px;
    font-size: 14px;
    color: #383838;
    line-height: 20px;
  }
  .match {
    margin-top: 0;
  }
}
</style>
