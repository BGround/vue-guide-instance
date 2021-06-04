<template>
  <div class="onlineEditing_example_base">
    <!-- 加粗导航文本 -->
    <div class="example_title">{{title}}</div>
    

    <!-- 题型展示 -->
    <div 
      class="example_question_type"
      v-for="(question, index) in questionArr"
      :key="index"
    >
      <!-- 题型文本 -->
      <div 
      class="question_type_text" 
      v-html="$checkjs(question.text)"
      ></div>

      <!-- 右箭头 -->
      <div class="cross_right"></div>
      
      <!-- 题型显示 -->
      <component 
        class="preview_question"
        :is="questionComponent[question.obj.questionType]"
        :question="question.obj"
      ></component>
    </div>

    
    <!-- 题型说明内容 -->
    <div 
      class="example_explain" 
      v-if="exampleExplain"
      v-html="processExampleExplain(exampleExplain)"
    ></div>

    <!-- 插槽 -->
    <slot></slot>
  </div>
</template>

<script>
import PreviewChose from './PreviewChose'; // 选择组件
import PreviewFill from './PreviewFill'; // 填空题组件
import PreviewEssay from './PreviewEssay'; // 问答题组件

export default {
  name: 'ExampleBase',
  props: {
    title: { // 加粗导航文本
      type: String,
      required: true
    },
    questionArr: { // 题目转换展示数组{text:, obj:}
      type: Array, 
      default: []
    },
    exampleExplain: { // 题型说明内容
      type: String,
      default: ''
    }
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

  methods: {
    processExampleExplain(exampleExplain) { // 处理题型说明内容
      let ret = this.$checkjs(this.exampleExplain);
      return ret.replace(/\s/g, '&nbsp;&nbsp;')
    }
  },
  created() {
    
  }
}
</script>
<style lang="scss" scoped>
.onlineEditing_example_base {
  .example_title {
    font-size: 16px;
    font-weight: bold;
    color: #383838;
  }

  .example_question_type {
    display: flex;
    align-items: stretch;
    margin: 12px 0;

    .question_type_text {
      display: inline-block;
      width: 450px;
      padding: 12px;
      background: #FAFAFA;
      font-size: 14px;
      line-height: 26px;
      vertical-align: middle;
    }

    .cross_right {
      display: inline-block;
      align-self: center;
      width: 12px;
      height: 21px;
      margin: 0 3px;
      font-size: 20px;
      background: url('~assets/images/arrow_orange_right.png') no-repeat;
      background-size: cover;
    }

    .preview_question {
      display: inline-block;
      width: 450px;
      padding: 12px;
      background: #FAFAFA;
      vertical-align: top;
      cursor: default;
    }
    & /deep/ {
      .essay_textarea {

        .qw_textarea {
          width: 406px;
          height: 56px;
        }
      }
      .answer {
        margin-top: 2px;
      }
    }
  }

  .example_explain {
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 24px;
    color: #808080;
  }
}
</style>
