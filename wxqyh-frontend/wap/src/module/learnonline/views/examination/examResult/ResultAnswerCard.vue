<template>
  <div class="qwui-lean_result_answerCard">
    <div class="answer_card_result" :class="resultType">
      <div class="result_headpic">
        <!--内部显示头像-->
        <img v-if="!isExternal" class="result_img" :src="userInfo.headPic" :alt="$t('i18n.headPortrait')">
      </div>
      <!--外部显示：名字，手机-->
      <p class="result_person" v-if="isExternal"><span class="result_person_name">{{userInfo.personName | ellipsisFilter(8)}} | {{userInfo.mobile}}</span></p>
      <!--内部显示：名字和头像-->
      <p class="result_person" v-else><span class="result_person_name">{{userInfo.personName | ellipsisFilter(8)}}</span></p>
      <p class="result_exam_name">{{detailVO.examName | ellipsisFilter(30)}}</p>
      <!--答题情况可见-->
      <div class="result_info qwui-flexbox" v-if="detailVO">
        <div class="info_item qwui-flexItem" v-if="canShowRightCount">
          <div><span class="right_count">{{detailVO.rightCount}}</span>/{{questionList.length}}</div>
          <div class="info_lable">{{$t('i18n.answerCorrect')}}</div>
        </div>
        <div class="info_item qwui-flexItem" v-if="canShowScore">
          <div class="score">{{score}}</div>
          <div class="info_lable">{{$t('i18n.getScore')}}</div>
        </div>
        <!--显示时间方式1：-->
        <div class="info_item qwui-flexItem" v-if="isShowComplete">
          <div class="time">{{time}}</div>
          <div class="info_lable">{{$t('i18n.timeOfUse')}}</div>
        </div>
        <!--显示时间方式2：完成考试 -->
        <div class="info_item qwui-flexItem" v-else>
          <div class="time"><i class="icon_time"></i>{{time}}</div>
        </div>
      </div>
    </div>

    <!-- 答题卡字样 -->
    <div class="answer_card_lable">{{$t('i18n.answerCard')}}</div>

    <!-- 答题卡题列表 -->
    <answer-card  
      :questionList="questionList"
      :showRight="canShowRightCount"
      @enterContent="enterContent"
    ></answer-card>
    
    <!-- 企微云logo/文字 -->
    <div class="advertising" v-if="resultData.isShowFooter">
      <a class="advertising_link" href="http://wbg.do1.com.cn" target="_blank">
        <img class="advertising_img" src="~assets/images/newsmallLogo.svg">道一云|企微，让工作更简单
      </a>
    </div>

    <!-- 操作按钮 -->
    <div  class="btn_box_wrap" 
          v-if="canExamAgain||canShowAnalysis||showReturnButton">
      <div class="btn_box_fill"></div>
      <div class="qwui-btn_box button_fixed qwui-user_btn">
        <div class="qwui-flexbox button_box">
          <!-- 再次考试按钮 -->
          <div 
            class="qwui-flexItem exam_button" 
            v-if="canExamAgain" 
            @click="enterExam"
          >{{$t('i18n.againTest')}}</div>

          <!-- 查看解析按钮 -->
          <div 
            class="qwui-flexItem result_button" 
            :class="moreButtonClass"
            v-if="canShowAnalysis" 
            @click="showAnalysis"
          >{{$t('i18n.watchParsing')}}</div>

          <!-- 返回主页按钮 -->
          <div 
            class="qwui-flexItem return_button" 
            v-if="showReturnButton" 
            @click="enterIndex"
          >{{$t('i18n.returnIndex')}}</div>
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
import * as timeUtil from '@/assets/js/time-util'; // 公共时间方法
import AnswerCard from '../../../components/examination/AnswerCard'; // 答题卡组件
export default {
  name: 'QwResultAnswerCard',
  components: {
    AnswerCard,
  },
  props: {
    resultData: { // 结果页数据
      type: Object,
      required: true
    },
    canExamAgain: { // 是否可再次考试
      type: Boolean,
      required: true
    },
    isExternal: { // 是否外部考试
      type:Boolean,
      default: false
    }
  },
  data(){
    return {
      defalutUserInfo: {
        personName: '',
        headPic: '',
        mobile: ''
      }
    };
  },
  computed: {
    detailVO() {
      return this.resultData.detailVO;
    },
    userInfo () {
      return this.resultData.userInfo || this.defalutUserInfo;
    },
    optionList() { // 答案
      let detailVO = this.detailVO;
      return detailVO? detailVO.optionList: [];
    },
    questionList() { // 题目
      let questionList = this.resultData.questionList;
      return questionList? questionList: [];
    },
    // 显示返回主页按钮
    showReturnButton() {
      return  !this.detailVO? false:
              !this.isExternal &&  // 外部考试不显示
              !this.canShowAnalysis && 
              !this.canExamAgain? true: false;
    },
    // 学分
    score() {
      let score = this.detailVO.score;
      // 1.0取为1； 1.1还是1.1
      return  !score? '': parseFloat(score);
    },
    // 是否有权限看分数（分数可见） //
    canShowScore() {
      let detailVO = this.detailVO;
      return  !detailVO? false: // 还没获取到数据
              detailVO.isViewScore == 1 ||
              (detailVO.isViewScore == 2 && detailVO.examStatus == 2) ||
              detailVO.isViewScore == 3? true: false;// 仅显示已完成  
      // 分数是否可见 0不可见 ，1交卷后可见，2考试结束后可见，3考试结束后和交卷后均可见
    },
    // 是否有权看答对数 (对错可见)
    canShowRightCount() {  
      let detailVO = this.detailVO; // 状态有： 已完成、通过、不通过
      return  !detailVO? false: // 还没获取到数据
              detailVO.isViewRight == 1 ||
              (detailVO.isViewRight == 2 && detailVO.examStatus == 2) ||
              detailVO.isViewRight == 3? true: false; // 
      // 是否有权利看对错 // 正确与否 是否可见 0不可见，1交卷后可见，2考试结束后可见，3考试结束后和交卷后均可见
    },
    // 是否有权限看解析（答案可见）
    canShowAnalysis() {
      let detailVO = this.detailVO;
      return  !detailVO? false: // 获取到数据了 继续判断
              detailVO.isViewResult == 1 ||  // 
              (detailVO.isViewResult == 2 && detailVO.examStatus == 2) || 
              detailVO.isViewResult == 3? true: false;
      // 答案解析是否可见 0不可见，1交卷后可见，2考试结束后可见，3考试结束后和交卷后均可见
    },
    // 奖杯图片类
    resultImg() {
      let detailVO = this.detailVO; // 状态有： 已完成、通过、不通过
      return  !detailVO? '': // 还没获取到数据
              !this.canShowScore? 'result_img_complete': // 分数不可见
              detailVO.isPass == 1? 'result_img_pass': 'result_img_nopass'; // 显示通过状态
    },
    isShowComplete () { // 仅显示已完成
      let detailVO = this.detailVO;
      return  !detailVO? false:
        detailVO.isViewScore == 1 ||
        (detailVO.isViewScore == 2 && detailVO.examStatus == 2) ||
        detailVO.isViewScore == 3 ? true: false
    },
    resultType () {
      return !this.canShowScore && this.isExternal ? 'exam_result_out_finished_bg' : // 不可见，外部
        !this.canShowScore && !this.isExternal ? 'exam_result_in_finished_bg' : // 不可见，内部
          this.canShowScore && !this.isExternal && this.detailVO.isPass == 1 ? 'exam_result_pass_bg' : // 可见，内部通过
            this.canShowScore && !this.isExternal && this.detailVO.isPass !== 1 ? 'exam_result_nopass_bg' : // 可见，内部不通过
              this.canShowScore && this.isExternal && this.detailVO.isPass == 1 ? 'exam_result_out_pass_bg' : // 可见，外部通过
                this.canShowScore && this.isExternal && !this.detailVO.isPass == 1 ? 'exam_result_out_nopass_bg' : '' // 可见，外部不通过
    },
    // 多个按钮类
    moreButtonClass() {
      // 查看解析需要蓝色显示
      return {moreButton: this.canExamAgain && this.canShowAnalysis};
    },
    // 考试用时
    time() {
      let detailVO = this.detailVO;
      let newDateObj = timeUtil.newDateObj;
      let timeSpan = newDateObj(detailVO.finishTime).getTime() - newDateObj(detailVO.createTime).getTime(); // 
      let time = '--', hour, min, second; // 

      if (detailVO.finishTime) {
        if (timeSpan > detailVO.duration * 60 * 1000 && detailVO.duration != 0) {
          timeSpan = detailVO.duration * 60 * 1000; // 有时候自动交卷会超出几秒
        }
        // 时
        hour = Math.floor(timeSpan / (60 * 60 * 1000));
        time =  !hour? '':
                hour < 10? `0${hour}:`: `${hour}:`;
        // 分
        min = Math.floor(timeSpan / (60 * 1000) % 60);
        time += min < 10? 
                  time? '0' + min: min // 没有小时的时候，小于10显示一位即可
                :
                  min;
        // 秒
        second = Math.floor(timeSpan / 1000 % 60);
        time += "'";
        time += second < 10? '0' + second: second;
        time += '"';
      }
      return  time; // 
    },        
  },
  filters: {
    ellipsisFilter: function (str, len) {
      let bytes = 0
      let strLast = str.charAt(str.length-1)
      for (let i = 0; i < str.length; i++) {
        let c = str.charAt(i)
        if (/^[\u0000-\u00ff]$/.test(c)) {
          bytes += 1
        } else {
          bytes += 2
        }
        if (bytes > len) {
          return str.substr(0, i) + '...' + strLast
        } else if (bytes === len) {
          return str.substr(0, i + 1) + '...' + strLast
        }
      }
      return str
    }
  },
  methods:{
    // 进入考试
    enterExam() {
      this.$emit('enterExam');
    },

    // 进入内容
    enterContent(index) {
      // 判断是否可显示解析
      this.canShowAnalysis && this.showAnalysis(index)
    },

    // 显示解析
    showAnalysis(index) {
      this.$emit('showAnalysis', index);
    },

    // 返回主页
    enterIndex() {
      this.$emit('enterIndex');
    }
  },

};

</script>

<style lang="scss" scoped>
@import '../../../static/css/mixin.scss';

.qwui-lean_result_answerCard {
  min-height: 100vh;
  background: #ffffff;

  .answer_card_info {
    padding: 18px 0 12px 0;
    background: #F2F3F5;

    .result_img_complete {
      background: url(~assets/images/ic_complete.png) center no-repeat;
    }
    .result_img_pass {
      background: url(~assets/images/ic_pass.png) center no-repeat;
    }
    .result_img_nopass {
      background: url(~assets/images/ic_nopass.png) center no-repeat;
    }
    .result_img_common {
      margin: 0 auto;
      padding-top: 18px;
      width: 232px;
      height: 152px;
      background-size: cover;
      transform: translateX(-6px); /* 平衡图片，原图左右不均 */
    }
  }

  /*6种样式状态*/
  .exam_result_in_finished_bg{
    background: url(~assets/images/learnonline/exam_result_in_finished_bg.png) top center no-repeat;
    .result_headpic{
      background: url(~assets/images/learnonline/exam_result_in_finished_cont.png) top center no-repeat;
    }
    .result_person_name{
        background: #4595F7;
    }
  }
  .exam_result_nopass_bg{
    background: url(~assets/images/learnonline/exam_result_nopass_bg.png) top center no-repeat;
    .result_headpic{
      background: url(~assets/images/learnonline/exam_result_nopass_cont.png) top center no-repeat;
    }
    .result_person_name{
        background: #728D96;
    }
  }
  .exam_result_out_finished_bg{
    background: url(~assets/images/learnonline/exam_result_out_finished_bg.png) top center no-repeat;
    .result_headpic{
      background: url(~assets/images/learnonline/exam_result_out_finished_cont.png) top center no-repeat;
    }
    .result_person_name{
        background: #4595F7;
    }
  }
  .exam_result_out_nopass_bg{
    background: url(~assets/images/learnonline/exam_result_out_nopass_bg.png) top center no-repeat;
    .result_headpic{
      background: url(~assets/images/learnonline/exam_result_out_nopass_cont.png) top center no-repeat;
    }
    .result_person_name{
        background: #728D96;
    }
  }
  .exam_result_out_pass_bg{
    background: url(~assets/images/learnonline/exam_result_out_pass_bg.png) top center no-repeat;
    .result_headpic{
      background: url(~assets/images/learnonline/exam_result_out_pass_cont.png) top center no-repeat;
    }
    .result_person_name{
        background: #F5A031;
    }
  }
  .exam_result_pass_bg{
    background: url(~assets/images/learnonline/exam_result_pass_bg.png) top center no-repeat;
    background-size: cover;
    .result_headpic{
      background: url(~assets/images/learnonline/exam_result_pass_cont.png) top center no-repeat;
      background-size: cover;
    }
    .result_person_name{
        background: #F5A031;
    }
  }

  .answer_card_result{
    height: 350px;
    text-align: center;
    background-color: #ccdfe6;
    background-size: cover;
    .result_headpic{
      position: relative;
      top: 0;
      width: (574px/2);
      height: (460px/2);
      margin: 0 auto;
      background-size: cover;
      .result_img{
        position: relative;
        top: 62px;
        width: 68px;
        height: 68px;
        border-radius: 68px;
      }
    }
    .result_person{
      margin-top: -30px;
      .result_person_name{
        padding: 3px 12px;
        font-size: 12px;
        color: #ffffff;
        border-radius: 30px;
      }
    }
    .result_exam_name{
      margin: 8px 0 18px;
      font-size: 14px;
      color: #85868F;
    }
    .info_item {
      font-size: 24px;
      line-height: 24px;
      color: #0A1735;
      .right_count {
        color: #61A6EF;
      }
      .info_lable {
        margin-top: 7px;
        font-size: 14px;
        line-height: 14px;
        color: #999;
      }
      .icon_time{
        display: inline-block;
        margin-right: 8px;
        padding-bottom: 1px;
        width: 16px;
        height: 16px;
        background: url(~assets/images/learnonline/exam_result_time.png) top center no-repeat;
        background-size: 100%;
      }
    }
  }
  /*2种考试状态图片距离微调*/
  .exam_result_in_finished_bg .result_headpic .result_img,
  .exam_result_nopass_bg .result_headpic .result_img{
    position: relative;
    top: 60px;
    left: 1px;
    width: 72px;
    height: 72px;
    border-radius: 72px;
  }

  .answer_card_lable {
    position: relative;
    top: -20px;
    padding: 20px 0 0;
    font-size: 18px;
    line-height: 18px;
    color: #333;
    text-align: center;
    border-radius: 20px 20px 0 0;
    background: #fff;
  }

  .advertising {
    margin-top: 10px;
    padding: 10px 0;
    height: 16px;
    line-height: 16px;
    width: 100%;
    text-align: center;
    background: #fff;

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

        .moreButton {
          color: #fff;
          background: #45A8F5;
        }
      }
    }
  }
}

</style>
