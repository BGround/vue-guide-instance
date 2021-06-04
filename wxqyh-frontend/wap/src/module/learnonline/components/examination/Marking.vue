<template>
  <div class="qwui-lean_marking">
    <!-- 阅卷内容 -->
    <div class="qwui-lean_marking_content">
      <!-- 题目 -->
      <div class="question">
        <apply-status :applystatus="comApplyStatus"></apply-status>
        <span class="subject" v-html="subject"></span>

        <!-- 图片 -->
        <div class="picture_list clearfix" v-if="item.hasPic">
          <img
            class="picture previewImages"
            v-for="(picItem, index) in item.picList"
            :src="completeImgUrl(picItem.picPath)"
            @click="preview(picItem.picPath)"
          >
        </div>
      </div>

      <!-- 考生答案  问答题才有的-->
      <div v-if="!isFillIn && answer" class="examineeAnswer">
        <!-- 考生答案标签 -->
        <div class="answer_lable">
          {{$t('i18n.examineeAnswer')}}
        </div>

        <!-- 考生答案文字内容 -->
        <div class="examineeAnswer_content">
          {{answer.content}}
        </div>

        <!-- 图片 -->
        <div class="picture_list clearfix" v-if="answer && answer.hasPic">
          <img
            class="picture previewImages"
            v-for="(picItem, index) in answer.picList"
            :src="completeImgUrl(picItem.picPath)"
            @click="preview(picItem.picPath)"
          >
        </div>
      </div>

      <!-- 正确答案 -->
      <div class="answer" v-if="item.answer">
        <!-- 正确答案标签 -->
        <div class="answer_lable">
          {{$t('i18n.rightAnswer')}}
          <span class="disorder_tips" v-if="isFillIn&&isDisorder">{{disorderTips}}</span>
        </div>

        <!-- 填空题-答案 -->
        <div v-if="isFillIn" class="fillIn">
          <div class="fillIn_item" v-for="(answer,index) in answerArr">
            {{$t('i18n.fillInItem') + (index+1) + $t('i18n.colon')}}
            <span class="fillIn_item_answer">{{dealMoreAnswer(answer)}}</span>
          </div>
        </div>

        <!-- 问答题-答案 -->
        <div v-else class="queAndAnsw">
          {{item.answer}}
        </div>
      </div>

      <!-- 答案解析 -->
      <div class="answer_parsing" v-if="answerParsing">
        <div class="answer_parsing_lable">
          {{$t('i18n.answerParsing')}}
        </div>
        <span class="answer_parsing_content">{{answerParsing}}</span>
      </div>
    </div>

    <!-- 评分 -->
    <div class="score">
      <label class="score_tips">{{$t('i18n.getScore')}}</label>
      <input
        v-if="answer && answer.id"
        v-focus="item.focus"
        type="text"
        class="score_input"
        :class="{ban_input:allReadOnly}"
        v-model="item.markingScore"
        :placeholder="$t('i18n.scoreTips')"
        :name="'searchValue.appraise_'+ answer.id"
        :readonly="allReadOnly"
        @input="checkScore"
        @focus="checkScore"
        @blur="blurToCheck"
      >
      <!-- 不可评分项 -->
      <input
        v-else
        class="score_input ban_input"
        type="text"
        readonly="readonly"
        value="0"
      >

      <span v-show="item.warnTipShow || warnTipsShow"><i class="warn_tips"></i></span>
    </div>
  </div>
</template>

<script>
import ApplyStatus from '@/components/part/apply_status'; // 标签状态公共组件
import EventBus from '@/utils/eventBus';
export default {
  name: 'QwMarking',
  components:{
    ApplyStatus
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    answer: {
      required: true
    },
    imgUrls: {
      type: Array,
      required: true
    },
    markingTip: {
      type: Object,
      default:() => {return {show:false,score:0}}
    },
    allReadOnly: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      /* 公共组件配置项 */
      applyStatus: {
        common: {
          class: 'status_blue', // 标签颜色
          active: true // false为默认，true加了"padding:3px"会大一些
        },
        name: ['判断题', '单选题', '多选题', '问答题', '填空题'], // 标签内容 0-判断题，1-单选题，2-多选题，3-问答题 4-填空题
      },

      /* 数据项 */
      warnTipsShow: false,
    };
  },
  computed: {
    // 公共组件标签配置
    comApplyStatus() {
      let applyStatus = this.applyStatus;
      return Object.assign(applyStatus.common, {name: applyStatus.name[this.item.questionType]})
    },
    // 题目
    subject() { // 有填空题需要代入答案
      return this.fillTheBlank(this.item.content) + this.$t('i18n.leftParenthesis') + this.item.setScore + this.$t('i18n.score') + this.$t('i18n.rightParenthesis');
    },
    // 排序提示
    disorderTips() {
      return this.$t('i18n.leftParenthesis') + this.$t('i18n.disorderTips') + this.$t('i18n.rightParenthesis');
    },
    // 填空题
    isFillIn() {
      return this.item.questionType == 4? true: false;
    },
    // 是否有序
    isDisorder() {
      return this.item.isDisorder? false: true;
    },
    // 填空题答案数组
    answerArr() {
      return this.item.answer.replace(/\|\|\|$/g, '').split('|||');
    },
    // 答案解析内容
    answerParsing() {
      return this.item.answerRemark;
    },
    // 全部可读
    readonly() {
      return this.allReadOnly? 'readonly': ''
    }
  },
  methods:{
    // 填空题多个参考答案文本处理
    dealMoreAnswer(str) {
      if (typeof str !== 'string') { return '';}
      let tempStr = this.$t('i18n.answerOr');

      // 将;替换为 或
      return str.replace(/;+$/g, '').replace(/;/g, tempStr);// 去除掉最后的; 避免参考答案出现空白： 答案A 或
    },

    // 填空题内容替换
    fillTheBlank(string) {
      let str = string;

      // 填空题需要判断答案是否存在, 存在将答案填上去,
      if (this.isFillIn && this.answer && this.answer.content) {
        let content = this.answer.content;
        let answers = content.replace(/\|\|\|$/g, '').split('|||'); // 答案数组

        str = str.replace(/\_+/g, "@Answer"); // 将原文的_改成标志@Answer
        for (let i = 0; i < answers.length; i++) { // 学习答案替换标志@Answer
            str = str.replace("@Answer", '<span class="fill_up">' + (answers[i] == ' '? '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : answers[i]) + '</span>');
        }
      }
      return str;
    },

    // 脱焦过滤判断
    blurToCheck() {
      let markingScore = this.item.markingScore;
      // 【最后输入位是.，且仅有1个小数点】和【第一位为小数点】 再次验证，其他情况脱焦无需再次验证
      if (markingScore[0] == '.' || 
          (markingScore[markingScore.length - 1] == '.' && markingScore.indexOf('.') == markingScore.length-1)) {

        // 如果用户保留了小数点时，点击其他地方，将最后小数点去掉
        this.item.markingScore = isNaN(parseFloat(markingScore))? '': parseFloat(markingScore);
        // 进行验证
        this.checkScore();
      }
    },

    // 判断评分是否满足条件
    checkScore() {
      this.item.warnTipShow = false; // 将父组件设置的警告显示关掉
      this.item.focus = false; // 将父组件设置的自动聚焦关掉

      let markingScore = this.item.markingScore;

      // 仅保留小数点和数字
      markingScore = (markingScore + '').replace(/[^\d|\.]/g, '');
      this.item.markingScore = markingScore; // 过滤后先赋值

      // 【最后输入位是.，且仅有1个小数点】和【第一位为小数点】，则在脱焦事件中去点再判断，在此处return
      // 不能在此过滤小数点，因为用户输入0.时会被干掉，导致无法输入小数
      // 【第一位为小数点】，方便用户删掉个位数，不会导致个位数初始为0
      let markingScoreLast = markingScore.length - 1;
      if (markingScore == '' ||
          markingScore[0] == '.' ||
          (markingScore[markingScoreLast] == '.' && markingScore.indexOf('.') == markingScoreLast)) {
        return;
      }

      // 到这里都是 整/浮点数， 不会出现多个小数点情况
      // 开始浮点数转换，排除001、01.2、1.20这些情况, 如果有小数，才取1位
      markingScore = parseFloat(markingScore);
      markingScore = (markingScore + '').includes('.')? markingScore.toFixed(1): markingScore;
      this.item.markingScore = this.item.markingScore? markingScore: ''; // 用户输入内容不为空才赋值

      let markingTip = this.markingTip; // 父组件的显示提示
      let setScore = this.item.setScore;  // 分数上限

      // 判断分数是否在范围内
      if (!isNaN(markingScore) && markingScore > setScore) { // 超出范围了
        // 如果已经显示了且分数一样，则不用触发事件
        if (markingTip.show == false || markingTip.score != setScore) {
          this.$emit('markingTip', {
            show: true,
            score: setScore
          });
        }
        this.warnTipsShow = true; // 感叹号警告提示
      } else {
        // 如果已经隐藏了，则不用触发事件
        if (markingTip.show != false) {
          this.$emit('markingTip', {
            show: false,
            score: setScore
          });
        }
        this.warnTipsShow = false; // 感叹号警告隐藏
      }

    },

    // 图片链接处理
    completeImgUrl(url) {
      return _.filterCompressURL(url)
    },

    //预览图片课件
    preview(picPath) {
      EventBus.$emit('previewImages', _.filterCompressURL(picPath), this.imgUrls);
    },
  },
};

</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';

.qwui-lean_marking {
  margin-bottom: 10px;
  padding: 19px 0 0 15px;
  background: #fff;

  .qwui-lean_marking_content {
    padding-right: 11px;

    .question {
      .subject {
        font-size: 16px;
        line-height: 20px;
        color: #333;
        vertical-align: middle;

        /* 填空答案下划线 */
        & /deep/ .fill_up {
          text-decoration: underline;
        }
      }

      .picture_list {

        .picture {
          position: relative;
          float: left;
          width: 33.33333333%;
          max-width: 100%;
          height: 100%;
          padding: 5px 5px 0 0;
          box-sizing: border-box;
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

    .examineeAnswer {
      margin-top: 28px;

      .answer_lable {
        margin-bottom: 7px;
        font-size: 16px;
        line-height: 16px;
        color: #45A8F5;
      }
      .examineeAnswer_content {
        font-size: 14px;
        color: #666;
      }
      .picture_list {

        .picture {
          position: relative;
          float: left;
          width: 33.33333333%;
          max-width: 100%;
          height: 100%;
          padding: 5px 5px 0 0;
          box-sizing: border-box;
        }
      }
    }

    .answer {
      margin: 28px 0;

      .answer_lable {
        margin-bottom: 7px;
        font-size: 16px;
        line-height: 16px;
        color: #45A8F5;

        .disorder_tips {
          color: #999;
        }
      }
      .fillIn {
        .fillIn_item {
          font-size: 14px;
          color: #666;

          .fillIn_item_answer {
            color: #333;
          }
        }
      }
      .queAndAnsw {
        font-size: 14px;
        color: #333;
      }
    }

    .answer_parsing {

      .answer_parsing_lable {
        margin-bottom: 7px;
        font-size: 16px;
        line-height: 16px;
        color: #333;

      }
      .answer_parsing_content {
        font-size: 14px;
        color: #666;
        // line-height: 42px;
      }
    }
  }
  .score {
    margin-top: 20px;
    padding: 10px 0;
    height: 35px;
    @include border-t-1px(#E6E6E6);

    .score_tips {
      line-height: 35px;
      font-size: 16px;
      color: #333;
      vertical-align: top;
    }
    .score_input {
      padding: 10px 0 10px 10px;
      width: 120px;
      height: 35px;
      font-size:16px;
      color: #333;
      vertical-align: top;
      background: #FAFAFA;
      box-sizing: border-box;

      /* input默认字颜色 */
      &::-webkit-input-placeholder {
        color: #BBB;
      }
      &:-moz-placeholder {
        color: #BBB;
      }
      &::-moz-placeholder {
        color: #BBB;
      }
      &:-ms-input-placeholder {
        color: #BBB;
      }
    }

    .ban_input {
      color: #CCC;
      background: #F5F5F5;
      cursor: default;
    }

    .warn_tips {
      display: inline-block;
      margin: 7px;
      width: 20px;
      height: 20px;
      background: url('../../../../assets/images/overdue.png') center no-repeat;
      background-size: cover;
    }
  }
}

</style>
