<template>
  <div class="qwui-lean_write_operation">
    
    <!-- 题序 -->
    <div class="question_index_wrap">
      <span class="question_index"><span class="question_now_index">{{nowIndex+1}}</span>/{{questionList.length}}</span>
      <span 
        v-show="remainingTimeShow"
        class="remaining_time" 
        :class="{close_end: remainingTime.iscloseEnd}"
      >{{remainingTime.time}}</span>
    </div>

    <!-- 答题卡/解析卡 -->
    <write-card
      :questionList="questionList"
      :nowIndex="nowIndex"
      :progress="progress"
      @saveCache="listenFromWriteCard"
    ></write-card>
    
    <!-- 底部操作按钮 -->
    <bottom-operation-button
      :nowIndex="nowIndex"
      :maxIndex="questionList.length"
      :finishText="$t('i18n.handOver')"
      @bottomButton="listenFromBottomButton"
    ></bottom-operation-button>
  </div>
</template>

<script>
import * as timeUtil from '@/assets/js/time-util'; // 公共时间方法
import WriteCard from '../../../components/examination/examCard/WriteCard'; // 答题卡组件
import BottomOperationButton from '../../../components/examination/BottomOperationButton'; // 底部操作按钮组件
export default {
  name: 'QwWriteOperation',
  components: {
    WriteCard,
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
    // 进度
    progress() {
      let questionList = this.questionList;
      let questionListLength = questionList.length;
      let completedNum = 0;
      for (let i = 0; i < questionListLength; i++) {
        let hasAnswer = questionList[i].hasAnswer
        hasAnswer && ++completedNum
      }
      return completedNum / questionListLength;
    },
  },
  methods:{
    /* 触发事件
      @operation
        0: 功能  
        1: 完成（最后一题）
    */

    // 监听底部按钮组件事件
    listenFromBottomButton(state) {
      // state 0:上一题  1:下一题  2：功能按钮  3：完成按钮（最后一题）
      let nowIndex = this.nowIndex;

      state == 0? nowIndex > 0 && this.$emit('update:nowIndex', --nowIndex):
      state == 1? nowIndex < this.questionList.length && 
                             this.$emit('update:nowIndex', ++nowIndex) && 
                             this.$emit('operation', 1):
      state == 2? this.$emit('operation', 2): this.$emit('operation', 3);
    },

    // 考生操作存缓存
    listenFromWriteCard() {
      this.$emit('saveCache');
    },
  },
  created() {
  }
};

</script>

<style lang="scss" scoped>
@import '../../../static/css/mixin.scss';

.qwui-lean_write_operation {
  min-height: 100vh;
  background: #fff;

  .question_index_wrap {
    position: relative;
    padding: 0 15px;
    height: 45px;
    text-align: center;
    line-height: 45px;

    .question_index {
      font-size: 18px;
      color: #CCC;

      .question_now_index {
        color: #45A8F5;
      }
    }
    
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
}

</style>
