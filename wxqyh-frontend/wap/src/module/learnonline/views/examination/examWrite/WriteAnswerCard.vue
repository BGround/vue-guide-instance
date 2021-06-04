<template>
  <div class="qwui-lean_write_answerCard">
    <!-- 答题卡字样 -->
    <div class="answer_card_lable">{{$t('i18n.answerCard')}}
      <span
        v-show="remainingTimeShow"
        class="remaining_time" 
        :class="{close_end: remainingTime.iscloseEnd}"
      >{{remainingTime.time}}</span>
    </div>

    <!-- 答题卡提示 -->
    <div class="answer_card_tips qwui-flexbox">
      <div class="qwui-flexItem has_answer"><i class="color_tips"></i><span>{{$t('i18n.hasAnswer')}}</span></div>
      <div class="qwui-flexItem unanswered"><i class="color_tips"></i><span>{{$t('i18n.unanswered')}}</span>
      <span class="unanswered_num" v-show="unansweredNum">({{unansweredNum}}题未答)</span></div>
    </div>

    <!-- 答题卡题列表 -->
    <answer-card  
      :questionList="questionList"
      :onlyShowTested="true"
      @enterContent="continueAnswer"
    ></answer-card>

    <!-- 操作按钮 -->
    <div  class="btn_box_wrap">
      <div class="btn_box_fill"></div>
      <div class="qwui-btn_box button_fixed qwui-user_btn" >
        <div class="qwui-flexbox button_box">
          <!-- 继续答题按钮 -->
          <div 
            class="qwui-flexItem continue_button" 
            @click="continueAnswer"
          >{{$t('i18n.continueAnswer')}}</div>

          <!-- 交卷按钮 -->
          <div
            class="qwui-flexItem handover_button" 
            @click="handOver"
          >{{$t('i18n.handOver')}}</div>
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
import * as timeUtil from '@/assets/js/time-util'; // 公共时间方法
import AnswerCard from '../../../components/examination/AnswerCard'; // 答题卡组件
export default {
  name: 'QwWriteAnswerCard',
  components: {
    AnswerCard,
  },
  props: {
    examData: { // 答题页数据
      type: Object,
      required: true
    },
    remainingTime: { // 考试剩余时间
      type: Object,
      required: true
    },
    remainingTimeShow: { // 剩余时间显示
      type: Boolean,
      required: true
    }
  },
  data(){
    return {
    };
  },
  computed: {
    questionList() {
      return this.examData.qusetionlist || [];
    },
    // 未答数量
    unansweredNum() {
      let questionList = this.questionList;
      let questionListLength = questionList.length;
      let unansweredNum = 0;
      for (let i = 0; i < questionListLength; i++) {
        let hasAnswer = questionList[i].hasAnswer
        !hasAnswer && ++unansweredNum
      }
      return unansweredNum;
    },
     
  },
  methods:{

    // 点击题号展示内容
    continueAnswer(index) {
      this.$emit('showWrite', index);
    },

    // 交卷按钮事件
    handOver() {
      this.$emit('handOver');
    }
  },
};

</script>

<style lang="scss" scoped>
@import '../../../static/css/mixin.scss';

.qwui-lean_write_answerCard {
  min-height: 100vh;
  background: #fff;

  .answer_card_lable {
    position: relative;
    padding: 15px 0;
    font-size: 16px;
    line-height: 16px;
    color: #333;
    text-align: center;
    @include border-b-1px(#DDD);

    .remaining_time {
      position: absolute;
      right: 15px;
      font-size: 16px;
      color: #666;
    }
    .close_end {
      color: #F56262;
    }
  }

  .answer_card_tips {
    padding: 25px 0 15px 0;
    font-size: 14px;
    line-height: 14px;
    color: #666;
  
    .color_tips {
      display: inline-block;
      margin: 1px 5px 1px 0;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      vertical-align: top;
    }
    .has_answer {
      margin-right: 15px;
      text-align: right;

      .color_tips {
        background: #45A8F5;
      }
    }
    .unanswered {
      text-align: left;

      .color_tips {
        background: #E6E6E6;
      }
    }
    .tips_answer_lable {
      
    }
    .unanswered_num {
      color: #F56262;
    }
  }
  
  .btn_box_wrap {
    .btn_box_fill {
      height: 55px;
    }

    .button_fixed {
      position: fixed;
      bottom: 0;
      width: 100%;

      .button_box {
        height: 50px;
        line-height: 50px;
        font-size: 17px;
        color: #333;
        text-align: center;
        background: #fff;
        cursor: pointer;
        user-select: none;
        @include border-t-1px(#DDD);

        .continue_button {
          @include border-r-1px(#DDD);
        }
      }
    }
  }
}

</style>
