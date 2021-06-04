<template>
  <div class="qwui-lean_result_answerParsing">
    
    <!-- 题序 -->
    <div class="question_index_wrap">
      <span class="question_index"><span class="question_now_index">{{nowIndex+1}}</span>/{{questionList.length}}</span>
      <span class="question_state" :class="questionState.class"><i class="state_icon"></i>{{questionState.text}}</span>
    </div>

    <!-- 答题卡/解析卡 -->
    <result-card
      :nowIndex="nowIndex"
      :questionList="questionList"
      :progress="progress"
    >
      <!-- 企微云logo/文字 -->
      <div  
        slot="footer" 
        v-if="$attrs.isShowFooter"
        class="advertising"
      >
        <a 
          class="advertising_link" 
          href="http://wbg.do1.com.cn" target="_blank"
        >
          <img class="advertising_img" src="~assets/images/newsmallLogo.svg">道一云|企微，让工作更简单
        </a>
      </div>
    </result-card>
    
    <!-- 底部操作按钮 -->
    <bottom-operation-button
      :nowIndex="nowIndex"
      :maxIndex="questionList.length"
      @bottomButton="listenFromBottomButton"
    ></bottom-operation-button>
  </div>
</template>

<script>
import * as timeUtil from '@/assets/js/time-util'; // 公共时间方法
import ResultCard from '../../../components/examination/examCard/ResultCard'; // 答题卡组件
import BottomOperationButton from '../../../components/examination/BottomOperationButton'; // 底部操作按钮组件
export default {
  name: 'QwResultAnswerParsing',
  components: {
    ResultCard,
    BottomOperationButton,
  },
  props: {
    questionList: { // 题目数组
      type: Array,
      required: true
    },
    nowIndex: {
      type: Number,
      required: true
    }
  },
  data(){
    return {
    };
  },
  computed: {
    // 进度
    progress() {
      return (this.nowIndex + 1) / this.questionList.length
    },
    // 题目状态
    questionState() {
      let nowQuestion = this.questionList[this.nowIndex];
      // 0:未考; 1:已考; 2:正确; 3:部分正确; 4错误
      let state = nowQuestion && nowQuestion.stateOfAnswer;
      return  state == 0? {text: this.$t('i18n.unanswered'), class: 'state_unanswered'}:
              state == 2? {text: this.$t('i18n.bingo'), class: 'state_bingo'}:
              state == 3? {text: this.$t('i18n.partialRight'), class: 'state_partialRight'}:
              {text: this.$t('i18n.wrongAnswer'), class: 'state_wrongAnswer'};
    }, 
  },
  methods:{
    /* 触发事件
      @answerParsing
        0: 功能  
        1: 完成（最后一题）
    */

    // 监听底部按钮组件事件
    listenFromBottomButton(state) {
      // state 0:上一题  1:下一题  2：功能按钮  3：完成按钮（最后一题）
      let nowIndex = this.nowIndex;

      state == 0? nowIndex > 0 && this.$emit('update:nowIndex', --nowIndex):
      state == 1? nowIndex < this.questionList.length && this.$emit('update:nowIndex', ++nowIndex):
      state == 2? this.$emit('answerParsing', 0): this.$emit('answerParsing', 1);
    },
  },
  created() {
  }
};

</script>

<style lang="scss" scoped>
@import '../../../static/css/mixin.scss';

.qwui-lean_result_answerParsing {
  min-height: 100vh;
  background: #fff;

  .question_index_wrap {
    padding: 0 15px;
    height: 45px;
    text-align: center;
    line-height: 45px;

    .question_index {
      float: left;
      width: 0;
      font-size: 18px;
      color: #CCC;

      .question_now_index {
        color: #45A8F5;
      }
    }

    .question_state {
      font-size: 16px;

      .state_icon {
        display: inline-block;
        margin-right: 9px;
        width: 22px;
        height: 22px;
        vertical-align: text-top;
        background: url('~assets/images/icon.png');
        background-size: cover;
      }
    }
    .state_unanswered {
      color: #999;
    }
    .state_bingo {
      color: #45A8F5;
      .state_icon {
        background-position: 0 -48px;
      }
    }
    .state_partialRight {
      color: #F56262;
      .state_icon {
        background-position: 0 -24px;
      }
    }
    .state_wrongAnswer {
      color: #F56262;
      .state_icon {
        background-position: 0 -24px;
      }
    }

  }

  .advertising {
    margin-top: 55px;
    padding: 10px 0;
    height: 16px;
    line-height: 16px;
    width: 100%;
    text-align: center;

    .advertising_link {
      font-size: 12px;
      color: #999;
      text-decoration: none;

      .advertising_img {
        margin-right: 5px;
        width: 15px;
        max-width: 100%;
        height: 15px;
        vertical-align: middle;
      }
    }
  }
}

</style>
