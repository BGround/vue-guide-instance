<template>
  <div class="onlineEditing_preview_chose">
    <!-- 题目头部 -->
    <preview-question-header
      :questionType="question.questionType"
      :content="question.content"
      :sequence="question.otherInfo.sequence"
    ></preview-question-header>

    <!-- 选项 -->
    <!-- 这里采取@click.prevent用来禁止点击，不用多选
      框disabled，样式不满足, 强致换样式以后公共改变难维护 -->
    <div class="option" @click.prevent>
      <!-- 单选题组 单选题和判断题都在这-->
      <qwui-radio-group
        class="option_radio"
        v-if="questionType==0 || questionType==1"
        :radio="radio"
      >
        <qwui-radio
          v-for="(item, index) in question.option"
          :class="{error: !item.content}"
          :key="index"
          :label="String.fromCharCode(65 + index)"
          disabled
        >{{String.fromCharCode(65 + index) + '. ' + getFriendlyContent(item.content)}}</qwui-radio>
      </qwui-radio-group>


      <!-- 多选题组 -->
      <qwui-checkbox-group
        class="option_check"
        v-else
      >
        <qwui-checkbox
          class="option_check_item"
          :class="{error: !item.content}"
          v-for="(item, index) in question.option"
          :key="index"
          :label="item.content"
          :value="item.isAnswer=='1'?item.content:''"
        >{{String.fromCharCode(65 + index) + '. ' + getFriendlyContent(item.content)}}</qwui-checkbox>
      </qwui-checkbox-group>
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
import QwuiRadio from '@/components/qwuiRadio/radio'; // 公共-单选框组件
import QwuiRadioGroup from '@/components/qwuiRadio/radio_group'; // 公共-单选框群组组件
import QwuiCheckbox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox'; // 公共-多选框组件
import QwuiCheckboxGroup from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckboxGroup'; // 公共-多选框群组组件
import PreviewQuestionHeader from './PreviewQuestionHeader'; // 题目头部组件

export default {
  name: 'PreviewChose',
  components: {
    QwuiRadio,
    QwuiRadioGroup,
    QwuiCheckbox,
    QwuiCheckboxGroup,
    PreviewQuestionHeader,
  },
  props: {
    question: {
      type: Object,
      required: true
    }
  },
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
  data() {
    return {
    };
  },
  computed: {
    questionType() {
      return this.question.questionType;
    },
    answerRemark() {
      let answerRemark = this.question.answerRemark;
      return answerRemark? `解析：${answerRemark}`: '';
    },
    radio() { // 单选题默认选中赋值
      if (!(this.questionType == 0 || this.questionType == 1) || !this.question.option) { return '';} // 非判断题、单选题则返回 无提供选项时返回

      let option = this.question.option.filter(option => {
        return option.isAnswer == '1';
      })[0];

      return option? String.fromCharCode(64 + option.sort): '';
    },
  },
  watch: {

  },
  created() {
  },
  methods: {
    getFriendlyContent(content) {
      return typeof content == 'undefined'? '出错：该选项无提供选项编号': content;
    }
  },
}
</script>

<style lang="scss" scoped>
.onlineEditing_preview_chose {

  .option {
    margin: 6px 0 0 12px;

    .option_radio {
      /deep/ .radio{
        padding: 2px 0 0 4px;
        color: #383838;
        opacity: 1;
        cursor: default;
        user-select: auto;

        &.error {
          color: #F56262;
        }

        .radio_input {
          margin-right: 5px;
          vertical-align: text-bottom;

          input:hover + span {
            border:1px solid #ccc;
          }

          span {
            width: 16px;
            height: 16px;

            &:after {
              top: 3px;
              left: 3px;
            }
          }
        }
      }
    }

    .option_check {
      padding-left: 5px;

      .option_check_item {
        display: inline-block;
        width: 100%;
        cursor: default;

        &.error /deep/ .qwui-checkbox-label {
          color: #F56262;
        }


        /deep/ .qwui-checkbox-input {
          height: 16px;
          margin-right: 5px;
        }
      }
    }
  }

  .answerRemark {
    margin-top: 8px;
    font-size: 14px;
    line-height: 18px;
    color: #AFB3BC;
  }
}
</style>
