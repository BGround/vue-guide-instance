<template>
  <div class="qwui-lean_answer_card">
    <!-- 答题卡行 -->
    <div class="answer_linage qwui-flexbox" v-for="(arr,index) in linageArr" :key="index">
      <!-- 一行5个 -->
      <div 
        class="linage_item_wrap qwui-flexbox"
        v-for="(item,subIndex) in arr"
        :key="subIndex"
      >
        <span 
          class="linage_item"
          :class="item.stateOfAnswerClass"  
          @click="$emit('enterContent', index*5+subIndex)"             
        >{{index*5+subIndex+1}}</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'QwAnswerCard',
  props: {
    questionList: { // 题目数组
      type: Array,
      required: true
    },
    onlyShowTested: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      /* 数据项 */

    };
  },
  computed: {
    linageArr() { // 以5分未1行的数组
      let arr = [];
      let questionList = this.questionList.slice(); // 浅复制一份数组

      while(questionList.length) {
        let times = 0;
        let tempArr = [];
        while(times < 5 && questionList.length) {
          // 添加状态标志
          let nowQuestion = questionList.shift();
          nowQuestion = nowQuestion? nowQuestion: {};

          // 为其直接增加类, 避开v-for和computed无法共用而导致添加方法
          if (this.onlyShowTested) { // 未答已答
            nowQuestion.stateOfAnswerClass = nowQuestion.hasAnswer? 'answer_state_tested': 'answer_state_untested';
          } else { // 所有状态
            let stateOfAnswer = nowQuestion.stateOfAnswer; 
            // 0:未考; 1:已考; 2:正确; 3:部分正确; 4错误
            nowQuestion.stateOfAnswerClass = stateOfAnswer == 0? 'answer_state_untested': // 没考过
                                              stateOfAnswer == 1? 'answer_state_tested': // 已考 无需显示对错
                                              stateOfAnswer == 2? 'answer_state_correct': 'answer_state_error';
          }
          tempArr.push(nowQuestion);
          ++times;
        }
        arr.push(tempArr);
      }
      return arr;
    }
  },
  methods:{
  },
  created() {

  }
};

</script>

<style lang="scss" scoped>

.qwui-lean_answer_card {
  
  .answer_linage {
    margin-bottom: 15px;
    padding: 0 20px;
    .linage_item_wrap {
      width: 20%;
      justify-content: center;

      .linage_item {
        display: inline-block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        border-radius: 50%;
        background: #45A8F5;
        user-select: none;
      }
      .answer_state_untested {
        color: #999;
        background: #E6E6E6;
      }
      .answer_state_tested {
        /* 目前继承即可，为扩展留 */
      }
      .answer_state_correct {
        /* 目前继承即可，为扩展留 */
      }
      .answer_state_error {
        background: #F56262;
      }
    }

  }
}

</style>
