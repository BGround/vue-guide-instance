<template>
  <div class="qwui-lean_exam_item" @click="enterDetal">
    <div class="clearfix">
      <p><span class="exam_state" v-if="exam.inTheExam && examState">{{examState}}</span><span class="exam_name">{{exam.examName}}</span></p>
      <div class="qwui-flexbox">
        <!-- 时间信息 -->
        <div class="qwui-flexItem">
          <p class="exam_time">{{$t('i18n.cutTime')}}<i class="iconfont icon-peixunxuexi_shijian"></i> {{startTime}} {{$t('i18n.to')}} {{exam.lastStartTime|filterEndTime}}</p>
          <p class="exam_duration">{{$t('i18n.testLength')}}{{examDuration}}</p>
        </div>
      </div>
      <p class="exam_explain">{{exam.examExplain}}</p>
      <div class="exam_img_list clearfix" v-if="exam.picList.length">
        <div class="exam_img_item" 
          v-for="(imgItem, index) in exam.picList"
          :key="index"
        >
          <img 
            class="exam_img"
            v-picfix
            :src="imgItem.picPath|filterImg"
          >
        </div>
      </div>

      <!-- 考试/再次考试按钮 -->
      <div
        v-if="buttonExamText"
        class="exam_button"
        :class="buttonClass"
        @click.stop="enterExam"
      >{{buttonExamText}}{{remainingTimeStr}}</div>

      <!-- 查看结果按钮 -->
      <div
        v-if="buttonAnswerText"
        class="exam_button exam_button_answer"
        @click.stop="enterAnswer"
      >{{buttonAnswerText}}</div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'QwExamItem',
  props: {
    exam: {
      type: Object,
      required: true
    },
    nowTimeStamp: { // 当前时间戳 用于继续考试倒计时
      type: Number,
      required: true
    }
  },
  data(){
    return {
      inHandEmit: false, // 继续考试倒计时完成触发标志 仅需触发一次
    };
  },
  computed:{
    // 剩余时间(ms) 负为时间已到
    remainingTime() {
      let time = this.exam.answerTime? this.exam.answerTime: this.exam.lastStartTime; // 有开答时间用开答时间, 否则用截止时间。
      // 剩余时间 = 开考时间 + 考试时长 - 当前时间。
      return new Date(time.replace(/-/g, "/")).getTime() + this.exam.duration * 60 * 1000 - this.nowTimeStamp;
    },

    // 按钮的样式
    buttonClass() {
      return {
        exam_button_wait: this.buttonExamText == this.$t('i18n.testNoBegin'),
        exam_button_continue: this.buttonExamText == this.$t('i18n.goonTest') || this.buttonExamText == this.$t('i18n.inHandOver')
      };
    },

    // 考试时长
    examDuration() {
      return this.exam.duration == '0'? this.$t('i18n.noLimit'):
                                        this.exam.duration + this.$t('i18n.minutes');
    },

    // 小标签的文字: 答题中
    examState() {
      let exam = this.exam;

      return  !exam.inTheExam? '': // 非答题中无需文字
              exam.duration == '0'? this.$t('i18n.testing'): // 无限时长显示答题中
              this.remainingTime > 0? this.$t('i18n.testing'): ''; // 有限时长&&有剩余时间显示答题中
    },

    // 查看按钮的文字
    buttonAnswerText() {
      return this.exam.answerId? this.$t('i18n.watchResult'): '';
    },

    // 考试按钮的文字
    buttonExamText() {
      let resiterFalg, time, // 与当前时间的比较
          buttonExamText = '';

      if (this.exam.inTheExam) {
        if (this.exam.duration == "0") {
          buttonExamText = this.$t('i18n.goonTest');
        } else {
          buttonExamText =  this.remainingTime > 0? this.$t('i18n.goonTest'):
                            -2000 < this.remainingTime? this.$t('i18n.inHandOver'): '';
                            // 在两秒时间内显示正在交卷ing... 两秒后取消交卷状态
        }
      } else {
        time = new Date(this.exam.startTime.replace(/-/g, "/")).getTime() - this.nowTimeStamp;
        // console.log(new Date(this.exam.startTime.replace(/-/g, "/")).getTime(), this.nowTimeStamp)
        buttonExamText = time > 0? this.$t('i18n.testNoBegin'): this.$t('i18n.test');
      }
      return buttonExamText;
    },

    // 开始时间
    startTime() {
      return this.exam.startTime? this.exam.startTime.slice(11):
                                  this.exam.createTime.slice(11);
    },

    // 剩余时间文本
    remainingTimeStr() {
      if (this.exam.duration == '0') { return '';} // 如果无截止时间则返回
      let times = '';

      if (this.remainingTime < 0) {
        // 时间到  仅触发一次
        if (!this.inHandEmit) {
          this.inHandEmit = true;
          this.$emit('inHand');
        }
        times = '';
      } else {
        if (this.buttonExamText != this.$t('i18n.goonTest')) {return '';} // 如果不是继续考试，则无需显示
        let min = Math.floor(this.remainingTime / (60 * 1000));
        times = min < 10? '0' + min: min;

        let second = Math.floor(this.remainingTime / 1000 - min * 60);
        times += " : ";
        times += second < 10? '0' + second: second;
        times = ' ' + times;
      }

      return times;
    },
  },
  created() {
    let picList = this.exam.picList;
    while (picList.length > 3) {
      picList.pop(); // 只显示3张图片
    }
  },
  methods:{

    // 进入查看结果
    enterAnswer() {
       this.$router.push({name: 'exam_result', params: {
        id: this.exam.id, 
        answerId: this.exam.answerId
      }});
    },

    // 进入考试
    enterExam() {
      if (this.buttonExamText == this.$t('i18n.testNoBegin')) {return;}
      this.$router.push({name: 'exam_write', params: {id: this.exam.id}});
    },

    // 进入详情
    enterDetal() {
      this.$router.push({name: 'exam_detail', params: {id: this.exam.id}});
    },
  },

  filters: {
    filterEndTime(time) {
      return time? time.toUpperCase().substr(11, 15): '--';// 结束时分
    },
    filterImg(url) {
      return _.filterCompressURL(url)
    }
  }
};

</script>

<style lang="scss" scoped>
.qwui-lean_exam_item {
  position: relative;
  padding: 10px 15px 14px 0;

  .exam_state {
    display: inline-block;
    width: 45px;
    height: 20px;
    margin-right: 6px;
    font-size: 12px;
    line-height: 21px;
    text-align: center;
    vertical-align: top;
    color: #fff;
    background: #f56262;
    border-radius: 2px;
  }
  .exam_name {
    color: #333;
    font-size: 17px;
    line-height: 21px;
    vertical-align: top;
  }
  .exam_time {
    margin: 6px 0;
    font-size: 14px;
    line-height: 14px;
    color: #999;
  }
  .exam_duration {
    margin: 6px 0;
    font-size: 14px;
    line-height: 14px;
    color: #999;
  }
  .exam_explain {
    margin-bottom: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .exam_img_list {
    margin-bottom: 5px;
    .exam_img_item {
      position: relative;
      float: left;
      margin: 0 10px 5px 0;
      width: 74px;
      height: 74px;
      overflow: hidden;
      .exam_img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .exam_button {
    float: right;
    display: inline-block;
    height: 24px;
    margin-left: 10px;
    padding: 2px 15px;
    font-size: 13px;
    color: #45a8f5;
    line-height: 26px;
    border: 1px #45a8f5 solid;
    border-radius: 4px;
    cursor: pointer;
  }
  .exam_button_answer {
    color: #666;
    border: 1px #878787 solid;
  }
  .exam_button_wait {
    color: #ccc;
    border: 1px #ccc solid;
  }
  .exam_button_continue {
    color: #E94F4F;
    border:1px #D64949 solid;
  }
}
</style>
