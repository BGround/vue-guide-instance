<template>
  <div class="qwui-lean_result_card">

    <!-- 颜色进度条 -->
    <div class="progress_bar_wrap"><div class="progress_bar" :style="progressWidth"></div></div>

    <!-- 题目卡片 -->
    <div class="exam_card">

      <!-- 题目 -->
      <div class="question">
        <div class="subject_wrap">
          <apply-status :applystatus="comApplyStatus"></apply-status>
          <span class="subject" v-html="subject"></span>
        </div>

        <!-- 题目图片 -->
        <div class="picture_list clearfix" v-show="nowQuestion.hasPic">
          <div
              v-for="(picItem, index) in nowQuestion.picList"
              class="picture_item"
              :key="index">
            <img
              v-picfix="picItem.picPath"
              class="picture previewImages"
              :src="completeImgUrl(picItem.picPath)"
              @click="preview(picItem.picPath)"
            >
          </div>
        </div>
      </div>

      <!-- 考生答题/答案区 -->
      <div class="examinee_answer">
        <!-- 单选题/多选题/判断题 -->
        <div  class="question_choice"
              v-show="nowQuestion.questionType != 3
              && nowQuestion.questionType != 4"
        >

          <!-- 选项 -->
          <div class="option_item qwui-flexbox" v-for="(item,index) in nowQuestion.optionList">
            <!-- 选项题序字母 -->
            <span
              class="option_letter"
              :class="optionState[item.stateOfOption]">
              {{String.fromCharCode(65 + index)}}
            </span>

            <!-- 选项 -->
            <div class="option qwui-flexItem">
              <!-- 选项文本 -->
              <div class="option_content">{{item.content}}</div>
              <!-- 选项图片 -->
              <div class="picture_list clearfix">
                <div
                  v-for="(picItem, index) in item.picList"
                  class="picture_item"
                  :key="index">
                  <img
                    v-picfix="picItem.picPath"
                    class="picture previewImages"
                    :src="completeImgUrl(picItem.picPath)"
                    @click="preview(picItem.picPath)"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 考生问答题 -->
        <div class="essay_question" v-show="nowQuestion.questionType==3">
          <textarea
            class="essay_question_text"
            :value="nowQuestion.examineeAnswer"
            readonly="readonly"
            :placeholder="$t('i18n.unanswered')"
          ></textarea>
           <!-- 考生问答题图片 -->
          <div class="picture_list clearfix">
            <div
              v-for="(picItem, index) in nowQuestion.examineePicList"
              class="picture_item"
              :key="index">
              <img
                v-picfix="picItem.picPath"
                class="picture previewImages"
                :src="completeImgUrl(picItem.picPath)"
                @click="preview(picItem.picPath)"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 正确答案 -->
      <div
        class="right_answer"
        v-show="showRightAnswer"
      >
        {{$t('i18n.rightAnswer')}}

        <!-- 正确答案选择题 -->
        <span v-show="isChoiceQuestion">{{choiceAnswer}}</span>

        <!-- 正确答案填空题问答题 -->
        <div v-show="!isChoiceQuestion">
          <!-- 填空题正确答案 -->
          <div
            v-show="nowQuestion.questionType==4"
            class="fill_option"
            v-for="(item, index) in fillOption(nowQuestion.answer)"
          >{{$t('i18n.fillInItem')}}{{index+1}}：{{dealMoreAnswer(item)}}</div>

          <!-- 问答题正确答案 -->
          <div
            v-show="nowQuestion.questionType==3"
            class="answer_essay_question"
            v-html="processingHtml(nowQuestion.answerRemark)"
          ></div>
        </div>

      </div>


      <!-- 非问答题答案解析  -->
      <div
        v-show="nowQuestion.questionType!=3"
        class="answer_parsing_wrap"
      >
        <div
          class="answer_parsing_lable"
          v-show="nowQuestion.answerRemark"
        >{{$t('i18n.answerParsing')}}</div>
        <div
          class="answer_parsing"
          v-html="processingHtml(nowQuestion.answerRemark)"
        ></div>
      </div>
    </div>

    <slot name="footer"></slot>
    <!--图片预览组件-->
    <preview-images :useWxPreview="false"></preview-images>
  </div>
</template>

<script>
import ApplyStatus from '@/components/part/apply_status'; // 标签状态公共组件
import EventBus from '@/utils/eventBus';
import PreviewImages from "@/components/base/previewImages"; // 图片预览组件

export default {
  name: 'QwResultCard',
  components:{
    ApplyStatus,
    PreviewImages
  },
  props: {
    questionList: { // 题目数组
      type: Array, // questionList.stateOfAnswer: 0:未考; 1:已考; 2:正确; 3:部分正确; 4错误
      required: true
    },
    nowIndex: { // 当前下标
      type: Number,
      required: true
    },
    progress: { // 进度
      type: Number,
      required: true
    },
  },
  data(){
    return {
      /* 公共组件配置项 */
      applyStatus: {
        common: {
          class: 'status_blue', // 标签颜色
          active: true // false为默认，true加了"padding:3px"会大一些
        },
        name: [this.$t('i18n.trueFalse'), this.$t('i18n.singleChoice'), this.$t('i18n.multipleChoice'), this.$t('i18n.essayQuestion'), this.$t('i18n.completion')], // 标签内容 0-判断题，1-单选题，2-多选题，3-问答题 4-填空题
      },
    };
  },
  computed: {
    // 当前题目
    nowQuestion() {
      let nowQuestion = this.questionList[this.nowIndex];
      return nowQuestion? nowQuestion: {}; // 此时还在请求数据）
    },
    // 公共组件标签配置
    comApplyStatus() {
      let applyStatus = this.applyStatus;
      return Object.assign({}, applyStatus.common, {name: applyStatus.name[this.nowQuestion.questionType]});
    },
    // 图片预览数组
    imgArr() {
      let nowQuestion = this.nowQuestion;
      let picList = [];
      let optionList = nowQuestion.optionList? nowQuestion.optionList: [];
      let optionListLength = optionList.length;

      // 推入问题的图片
      nowQuestion.picList && picList.push.apply(picList, nowQuestion.picList)

      // 推入选项图片
      for (let i = 0; i < optionListLength; i++) {
        let nowOption = optionList[i];

        let nowOptionPic =  nowOption.picList? nowOption.picList: [];
        picList.push.apply(picList, nowOptionPic);
      }

      // 推入问答题考生图片
      nowQuestion.examineePicList && picList.push.apply(picList,
        nowQuestion.examineePicList);

      return picList;
    },
    // 是选择题
    isChoiceQuestion() {
      return this.nowQuestion.questionType < 3;
    },
    // 是否正确答案显示
    showRightAnswer() {
      return !this.isChoiceQuestion || this.nowQuestion.stateOfAnswer != 2;
    },
    // 题目
    subject() { // 有填空题需要代入答案
      let content = this.nowQuestion.content;
      content = content && this.processingHtml(content); // 换行
      let subject = this.nowQuestion.questionType == '4'? this.fillTheBlank(content): content;
      return subject + this.$t('i18n.leftParenthesis') + parseFloat(this.nowQuestion.setScore) + this.$t('i18n.score') + this.$t('i18n.rightParenthesis');
    },
    // 进度条宽度
    progressWidth() {
      let progress = this.progress < 0 || this.progress > 1? 0: this.progress;
      return { width: progress * 100 + '%'  };
    },
    // 选择题选项状态
    optionState() { // 0:未选; 1:选择正确; 2:选择错误; 3:漏选正确; 4:未答正确（未答题-正确选项）
      return ['state_unanswered', 'state_bingo', 'state_wrongAnswer', 'state_partialRight', 'state_unanswered']
    },
    // 选择题正确答案
    choiceAnswer() { // stateOfOption0:未选; 1:选择正确; 2:选择错误; 3:漏选正确;4:未答正确（未答题-正确选项）
      let options = this.nowQuestion.optionList? this.nowQuestion.optionList: [];
      let rightAnswer = '';
      options.forEach((optionItem, index) => { // 取出正确答案
        rightAnswer += (optionItem.stateOfOption != 0 && optionItem.stateOfOption != 2)? String.fromCharCode(65 + index): '';
      });
      return rightAnswer;
    }
  },
  methods:{
    // 填空题多个参考答案文本处理
    dealMoreAnswer(str) {
      if (typeof str !== 'string') { return '';}
      // 将;替换为 或
      return str.replace(/;+$/g, '').replace(/;/g, this.$t('i18n.answerOr'));// 去除掉最后的; 避免参考答案出现空白： 答案A 或
    },

    // 填空题正确答案填空项提取
    fillOption(answer) {
      return answer? answer.replace(/\|\|\|$/g, '').split('|||'): []; // 提取为数组
    },

    // 填空题内容替换
    fillTheBlank(string) {
      let str = string;

      // 填空题需要判断答案是否存在, 存在将答案填上去,
      let examineeAnswer = this.nowQuestion.examineeAnswer;
      let answers = this.fillOption(examineeAnswer); // 答案数组

      str = str.replace(/\_+/g, '@!answer!@'); // 先把下划线改成@!answer!@标志
      // 避免直接更改_导致改到类

      for (let i = 0; i < answers.length; i++) { // 学习答案替换标志
        // 学生答案也要进行处理，好放入v-html中
        let nowAnswer = this.processingHtml(answers[i], false);

        str = str.replace(/@!answer!@/,
          '<span class="fill_up">&nbsp;'
          + (nowAnswer == ' '? '&nbsp;&nbsp;': nowAnswer)
          + '&nbsp;</span>');
      }

      // 到这里，有答案已经赋值完。考生未填的给他改成下划线样式，
      str = str.replace(/@!answer!@/g, '<span class="fill_up">&nbsp;&nbsp;&nbsp;</span>');

      return str;
    },

    // 文本处理HTML(用于v-html)
    processingHtml(str, replaceMore=true) {
      let eleDiv = document.createElement('div');
      eleDiv.appendChild(document.createTextNode(str)); // jsp页面说是兼容老代码，此处保留，避免此处是修bug后的代码，删除后出现bug
      let dealStr = eleDiv.innerHTML;

      return  replaceMore? // 默认换行也转成html
                dealStr? dealStr.replace(/\n+/g, '<br/>').replace(/\u3000/g,'  ').replace(/\u0020/g,' '): dealStr
              :
                dealStr; // 换行空格不转html
    },

    // 图片链接处理
    completeImgUrl(url) {
      return _.filterCompressURL(url)
    },

    //预览图片课件
    preview(picPath) {
      EventBus.$emit('previewImages', _.filterCompressURL(picPath), this.imgArr);
    },
  },
};

</script>

<style lang="scss" scoped>

.qwui-lean_result_card {
  overflow: hidden;

  .progress_bar_wrap{
    height: 3px;
    background: linear-gradient(to bottom, #E1E3E6 0, #E1E3E6 2px, transparent 2px);

    .progress_bar {
      height: 100%;
      background: #45A8F5;
    }
  }

  .exam_card {
    padding: 12px 15px 0 15px;

    /* 通用图片样式 */
    .picture_list {
      .picture_item {
        position: relative;
        float: left;
        margin-bottom: 5px;
        width: 70px;
        height: 70px;
        overflow: hidden;
        &:not(:last-of-type) {
          margin-right: 12px;
        }

        .picture {
          width: 100%;
          height: 100%;
        }
      }
    }

    .question {
      .picture_list {
        margin-bottom: 20px;
      }

      .subject_wrap {
        margin-bottom: 12px;

        .subject {
          font-size: 16px;
          color: #333;
          vertical-align: middle;
          word-break: break-word;

          /* 填空答案下划线 */
          & /deep/ .fill_up {
            text-decoration: underline;
          }
        }

        /* 更换下标签状态公共组件的蓝色 */
        & /deep/ .qwui-apply_status.status_blue {
          border: 1px solid #45A8F5;
          color: #45A8F5;
        }
        /* 更换下标签状态公共组件激活不要margin */
        & /deep/ .qwui-apply_status.active {
          margin:0 8px 0 0;
        }
      }
    }

    /* 考生答题/答案区 */
    .examinee_answer {
      /* 单选题 */
      .question_choice {

        .option_item {
          margin-bottom: 18px;

          .option_letter {
            display: inline-block;
            width: 22px;
            height: 22px;
            font-size: 14px;
            font-family: arial,sans-serif;
            color: #999;
            line-height: 20px;
            text-align: center;
            border: 1px #999 solid;
            border-radius: 50%;
            box-sizing: border-box;
            overflow: hidden;
          }
          .option {
            margin-left: 12px;
            font-size: 14px;
            color: #333;
            .option_content {
              word-break: break-word;
            }
          }
          .state_unanswered {
            // 继承即可
          }
          .state_bingo {
            border: none;
            background: url('~assets/images/icon.png') 0 -48px;
            background-size: cover;
            border-width: 0;
            text-indent: -50px;
            overflow: hidden;
          }
          .state_partialRight {
            color: #fff;
            border-color: #45A8F5;
            background: #45A8F5;
          }
          .state_wrongAnswer {
            color: #fff;
            border-color: #F56262;
            background: #F56262;
          }


        }
      }

      /* 问答题 */
      .essay_question {
         margin-bottom: 12px;

        .essay_question_text {
          padding: 10px;
          width: 100%;
          min-height: 145px;
          color: #333;
          font-size: 14px;
          line-height: 20px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 4px;
          box-sizing: border-box;
          outline: none;
        }
      }
    }

    /* 正确答案 */
    .right_answer {
      font-size: 16px;
      color: #45A8F5;
      line-height: 16px;

      .fill_option {
        margin: 2px 0;
        font-size: 14px;
        color: #666;

        &:first-of-type {
          margin-top: 10px;
        }
      }

      .answer_essay_question {
        margin-top: 10px;
        font-size: 14px;
        color: #666;
        line-height: normal;
      }
    }

    .answer_parsing_wrap {
        margin-top: 18px;
        line-height: normal;

      .answer_parsing_lable {
        font-size: 16px;
        color: #333;
      }
      .answer_parsing {
        font-size: 14px;
        color: #666;
      }
    }
  }
}

</style>
