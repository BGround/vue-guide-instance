<template>
  <div class="qwui-lean_examItem_record" @click="enterDetal"> 
    <!-- 考试名 -->
    <div class="exam_name">{{exam.examName}}</div>

    <!-- 考试信息 -->
    <div class="qwui-flexbox">
      <!-- 时间信息 -->
      <div class="qwui-flexItem exam_info">
        <p class="exam_time"><i class="iconfont icon-peixunxuexi_shijian"></i>{{finishTime}}</p>
        <p class="exam_duration">{{$t('i18n.testLength')}}{{duration}}</p>
      </div>

      <!-- 印章 -->
      <div
        class="exam_pass_state" 
        :class="sealClass"
        v-if="buttonExamText!=$t('i18n.goonTest')"
      >
        <div class="exam_pass_container qwui-flexbox" 
          :class="sealClass"
        >
          <!-- 分数 状态 -->
          <div 
            v-if="showExamScore" 
            class="exam_score">
            {{parseFloat(exam.score)}}
          </div>

          <!-- 状态 -->
          <div class="exam_pass_desc">{{sealStr}}</div>
        </div>
      </div>
    </div>

    <!-- 考试说明 -->
    <div class="exam_explain">{{exam.examExplain}}</div>

    <!-- 考试图片 -->
    <div  class="exam_img_list clearfix" 
          v-if="exam.picList.length"
    >
      <div  class="exam_img_item" 
            v-for="imgItem in exam.picList"
      >
        <img class="exam_img" :src="imgItem.picPath|filterImg">
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="clearfix">
      <!-- 考试/再次考试按钮 -->
      <div
        v-if="buttonExamText"
        class="exam_button"
        :class="examButtonClass"
        @click.stop="enterExam"
      >{{buttonExamText}}</div>

      <!-- 查看结果按钮 -->
      <div
        v-if="buttonAnswerShow"
        class="exam_button exam_button_answer"
        @click.stop="enterAnswer"
      >{{$t('i18n.watchResult')}}</div>
    </div>
  </div>
</template>

<script>
import { newDateObj } from 'assets/js/time-util'; // 兼容ios时间

export default {
  name: 'ExamItemRecord',
  components: {
  },
  filters: {
    filterImg(url) {
      return _.filterCompressURL(url)
    }
  },
  props: {
    exam: {
      type: Object,
      required: true
    },
  },
  data(){
    return {
    };
  },
  computed:{
    // 盖章样式
    sealClass() {
      let exam = this.exam;
      let sealClass = exam.isAppraise == 2 && exam.finishTime? // finishTime为空是未考
                    {exam_pass_middle: !this.showExamScore}:
                  exam.isAppraise == 1? // 阅卷中
                    {exam_pass_middle: true}:
                    {exam_pass_big: true}; // 待阅
      
      sealClass['exam_pass'] = this.passStr == this.$t('i18n.pass');
      return sealClass;
    },
    // 开始考试按钮样式
    examButtonClass() {
      return this.isBanButton? 
              {'exam_button_ban': true}:
              {'exam_button_continue': this.buttonExamText == this.$t('i18n.goonTest')};
    },
    // 开始时间
    startTime() {
      let exam = this.exam;
      let time = exam.startTime? exam.startTime: exam.createTime;
      return time.substr(11, 15);
    },
    // 考试时长
    duration() {
      let duration = this.exam.duration;
      return duration == '0'? this.$t('i18n.noLimit'): duration + this.$t('i18n.minutes'); // 考试时长
    },
    // 考试已完成的时间
    finishTime() {
      let finishTime = this.exam.finishTime;
      let retStr = finishTime?  finishTime.substr(5, 15) + this.$t('i18n.handOver'): 
                                this.$t('i18n.hasNotTest');
      return ' ' + retStr;
    },
    // 通过文本
    passStr () {
      return this.exam.isPass? this.$t('i18n.pass'): this.$t('i18n.unPass');
    },
    // 盖章文本
    sealStr() {
      let exam = this.exam;
      return  !exam.finishTime? this.$t('i18n.hasNotTest'):
              exam.isAppraise == 2? this.passStr:
              exam.isAppraise? this.$t('i18n.readIng'):
                                this.$t('i18n.hasNotRead');
    },

    // 是否显示分数
    showExamScore() {
      // isViewScore: 分数是否可见 
      //    0不可见 ，
      //    1交卷后可见，
      //    2考试结束后可见，examStatus: 0草稿，1发布, 2已结束
      //    3考试结束后和交卷后均可见, examStatus: 0草稿，1发布, 2已结束
      //    没交卷不会出现在历史记录中，无需判断交卷
      let exam = this.exam;
      return  exam.finishTime    // 交过卷
              && (exam.isViewScore == 1
                  ||  ((exam.isViewScore == 2 || exam.isViewScore == 3) 
                      && exam.examStatus == 2));
    },
    // 查看按钮是否展示
    buttonAnswerShow() {
      let exam = this.exam;
      return exam.answerId && exam.finishTime; // 无交卷时间也不显示，后端bug
    },
    // 考试按钮是否被禁止
    isBanButton() {
      // 只有补考/再次考试可以操作, 后端过滤不掉正在考试中的补考，所以继续考试也要显示
      let whileArr = [this.$t('i18n.fixTest'), this.$t('i18n.againTest'), this.$t('i18n.goonTest')];
      return !whileArr.includes(this.buttonExamText);
    },
    // 考试按钮的文字(再次考试/补考未开始/补考/后台处理中)
    buttonExamText() {
      let exam = this.exam;
      /* 参数说明
          examStatus: 0草稿, 1发布, 2已结束
          hasNext: 是否有考试机会，在考试中则为考试机会，补考时即为补考次数。通过考试的人没有补考机会
          resitGetting: 补考名单是否已生成 0未提取 2提取中 5提取完 
          resiterFalg（非后台返参）：补考时间 0 未到开始; 1 范围内; 2 超出范围  
          finishTime: 交卷时间，后台返回是最高分，有交卷过的一定有数据，否则没
          isAppraise: 0待阅，1进行中，2已阅  
      */
      // 如果考试还没结束 且还有考试次数
      if(exam.examStatus == 1) {return exam.hasNext? this.$t('i18n.againTest'): '';}
      // 交卷的，而且还没阅过的。  
      if (exam.isAppraise != 2 && exam.finishTime) {return '';}

      let resiterFalg = this.checkTime(exam.resitStartTime, exam.resitEndTime);

      // 考试结束了，开始验证处理和补考
      let buttonExamText =  exam.inTheExam? this.$t('i18n.goonTest'): // 在考试中
                            exam.resitGetting != 5? this.$t('i18n.backgroundDealing'): // 如果后台在处理中
                            resiterFalg == 0? this.$t('i18n.fixTestNoBegin'): // 补考未开始(这时候肯定有补考次数，不用多验证)
                            resiterFalg == 1 && exam.hasNext? this.$t('i18n.fixTest'): '';// 补考进行时，且有补考次数
                              
      return buttonExamText;
    },
    
  },
  methods:{
    // 判断时间在区间位置
    checkTime(start, end) { // return: -1 参有误; 0 未到开始; 1 范围内; 2 超出范围

      if (start == '' || end == '') return -1; // 不能为空,提前返回

      let startTime = newDateObj(start).getTime(); 
      let endTime = newDateObj(end).getTime(); 
      let nowTime = (new Date()).getTime(); 
      return  nowTime < startTime? 0:
              nowTime > endTime? 2: 1;
    },

    // 进入查看结果
    enterAnswer() {
      this.$router.push({name: 'exam_result', params: {
        id: this.exam.id, 
        answerId: this.exam.answerId
      }});
    },

    // 进入考试
    enterExam() {
      // 禁止按钮无需操作
      if (this.isBanButton) {return ;}

      this.$router.push({name: 'exam_write', params: {id: this.exam.id}});
    },

    // 进入详情
    enterDetal() {
      this.$router.push({name: 'exam_detail', params: {id: this.exam.id}});
    },
  },
};

</script>

<style lang="scss" scoped>
.qwui-lean_examItem_record {
  position: relative;
  padding: 20px 15px 14px 0;
  
  .exam_name {
    color: #333;
    font-size: 17px;
    line-height: normal;
    vertical-align: middle;
  }

  .exam_info {
    font-size: 14px;
    line-height: 14px;
    color: #999;

    .exam_time {
      margin-top: 10px;
    }
    .exam_duration {
      margin: 6px 0;
    }
  }
  .exam_explain {
    margin-bottom: 18px;
    font-size: 14px;
    color: #333;
  }
  .exam_img_list {
    margin-bottom: 5px;
    .exam_img_item {
      float: left;
      margin: 0 10px 5px 0;
      .exam_img {
        width: 74px;
        height: 74px;
      }
    }
  }
  .exam_button {
    float: right;
    display: inline-block;
    margin-left: 10px;
    width: 81px;
    height: 30px;
    font-size: 13px;
    line-height: 30px;
    color: #2F7DCD;
    text-align: center;
    border: 1px solid #2F7DCD;
    border-radius: 3px;
    cursor: default;
  }
  .exam_button_ban {
    color: #CCC;
    background: #F5F5F5;
    border-color: #CCC;
  }
  .exam_button_answer {
    color: #666;
    border-color: #666;
  }
  .exam_button_continue {
    color: #D64949;
    border-color: #D64949;
  }

  .exam_pass_state {
    position: relative;
    width: 56px;
    height: 56px;
    font-weight: 500;
    font-size: 24px;
    text-align: center;
    background: #fff;
    border: 2px solid #999;
    border-radius: 50%;
    transform: rotate(-15deg);

  }
  /* exam_pass_container不包含进去exam_pass_state是为了exam_pass，防止优先级覆盖border */
  .exam_pass_container {
    position: absolute;
    top: -21px;
    left: -21px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    border: 1px solid #999;
    border-radius: 50%;
    transform: scale(.5);

    .exam_score {
      margin-top: 8px;
      width: 100%;
      font-size: 40px;
      line-height: 40px;
    }
    .exam_pass_desc {
      margin-bottom: 10px;
    }
  }
  .exam_pass {
    color: #468CEB;
    border-color: #468CEB;
  }
  .exam_pass_middle {
    font-size: 28px;
    .exam_pass_desc {
      margin-bottom: 0;
    }
  }
  .exam_pass_big {
    font-size: 32px;
    .exam_pass_desc {
      margin-bottom: 0;
    }
  }
}
</style>
