<template>
  <div class="wrap qwui-lean_practice_detail">
    <!-- 考试标题 -->
    <div class="practice_title">{{countVO.practiceName}}</div>

    <!-- 练习信息 -->
    <ul class="qwui-flexbox practice_info">
      <!-- 总体数 -->
      <li class="qwui-flexItem">
          <p class="info_data">{{countVO.totalQuestionNum}}</p>
          <p class="info_label">{{$t('i18n.numberOfQuestions')}}</p>
      </li>
      <!-- 答对数 -->
      <li class="qwui-flexItem">
          <p class="info_data">{{countVO.correctAnswerNum}}</p>
          <p class="info_label">{{$t('i18n.numOfCorrect')}}</p>
      </li>
      <!-- 答错数 -->
      <li class="qwui-flexItem">
          <p class="info_data info_data_wrong">{{countVO.errorAnswerNum}}</p>
          <p class="info_label">{{$t('i18n.numOfWrong')}}</p>
      </li>
    </ul>


    <!-- 练习时间信息box -->
    <div class="practice_supplement_box">
      <!-- 练习时间 -->
      <div class="practice_supplement_item">
        <span class="practice_label">{{$t('i18n.practiceTime')}}</span><span 
        class="practice_supplement_content">{{countVO.startTime|filterTime}} {{$t('i18n.to')}} {{countVO.endTime|filterTime}}</span>
      </div>
      <!-- 练习次数 -->
      <div class="practice_supplement_item">
        <span class="practice_label">{{$t('i18n.practiceTimes')}}</span><span 
        class="practice_supplement_content">{{countVO.answerCount}}{{$t('i18n.times')}}</span>
      </div>
      <!-- 练习说明 -->
      <div class="practice_supplement_item">
        <span class="practice_label">{{$t('i18n.practiceExplain')}}</span>
        <span class="practice_supplement_content practice_explain">{{countVO.practiceExplain}}</span>
      </div>
    </div>


    <!-- 按钮 -->
    <div class="qwui-btn_box button_fixed qwui-nav_footer_fix" v-if="buttonPracticeText">
      <div class="qwui-flexbox button_box">
        <!-- 只做错题按钮 -->
        <div
          class="qwui-flexItem wrong_button"
          v-if="buttonWrongShow"
          @click="enterPractice(true)"
        >{{$t('i18n.soAsWrong')}}</div>

        <!-- 查看结果按钮 -->
        <div
          class="qwui-flexItem result_button"
          v-if="buttonResultShow"
          @click="enterResult"
        >{{$t('i18n.watchResult')}}</div>

        <!-- 练习按钮 -->
        <div
          class="qwui-flexItem practice_button"
          :class="buttonPracticeClass"
          @click="enterPractice"
        >{{buttonPracticeText}}</div>

      </div>
    </div>

  </div>
</template>

<script>
import { getPracticeDetail } from "../../../api/getData"; // 请求接口
import wx from 'weixin-js-sdk'; // 微信操作
export default {
  name: 'QwPracticeDetail',
  filters: {
    // 过滤为整数
    filterInt(str) {
      return str? parseInt(str): '';
    },
    // 过滤时间 去掉年份
    filterTime(str) {
      // 获取数据前str为undefined，无includes方法。 没有- 则是无限制/--
      return str && !str.includes(':')? str:
             str? str.slice(5): '';
    },
  },
  data(){
    return {
      /* 数据项 */
      practiceId: '', // 当前练习的id
      countVO: {} // 详情页数据

    };
  },
  computed: {
    // 练习按钮文字
    buttonPracticeText() {
      let countVO = this.countVO;
      return  countVO.practiceState == 1? this.$t('i18n.practiceNotStarted'):
              countVO.practiceState == 3? this.$t('i18n.practiceOver'):
              countVO.practiceState == 2?
                countVO.answerState == 0? this.$t('i18n.continuePractice'):
                countVO.answerState == 1? this.$t('i18n.againPractice'):
                countVO.answerState == 2? this.$t('i18n.enterPractice'): ''
              : '';
      // practiceState： 1 练习未开始；2练习进行中；3练习已结束
      // answerState：   0 继续练习；1 再次练习；2 进行练习
    },
    // 练习按钮Class
    buttonPracticeClass() {
      let show =  this.buttonPracticeText == this.$t('i18n.practiceNotStarted') ||
                  this.buttonPracticeText == this.$t('i18n.practiceOver');
      return {
        practice_button_ban: show
      };
    },
    // 查看结果按钮展示
    buttonResultShow() {
      // 仅在完成上一次练习，未开始下次练习时显示（即再次考试）
      return this.buttonPracticeText == this.$t('i18n.againPractice');
    },
    // 只做错题按钮展示
    buttonWrongShow() {
    /*  显示条件：
        1)  完成状态下，答对的题目小于总题目数
        2)  开始练习后未完成情况下，有错题
            即仅会和【继续练习、再次练习】搭配出现
    */
      let countVO = this.countVO;
      let show =  this.buttonPracticeText == this.$t('i18n.againPractice') &&
                    parseInt(countVO.correctAnswerNum) < parseInt(countVO.totalQuestionNum)? true:
                  this.buttonPracticeText == this.$t('i18n.continuePractice') &&
                    countVO.errorAnswerNum > 0? true: false;
      return show;
    },
  },
  methods:{
    // 处理图片url
    filterCompressURL(url) {
      return url? _.filterCompressURL(url): '';
    },

    // 请求练习详情页数据
    _getPracticeDetail() {
      return new Promise((resolve, reject) => {
        getPracticeDetail({practiceId: this.practiceId}, data => {
          this.countVO= Object.assign({}, data.countVO); // 数据赋值
          resolve();
        }, (err) => { // 有错误 单页面微信需要关掉
          let length = window.history.length;
          length > 1? this.$router.back(): wx.closeWindow();
          reject();
        });
      });
    },

    // 进入练习页面 如果wrong为真, 进入错题页面
    enterPractice(wrong) {

      // 练习未开始、练习已结束 无需操作
      if (this.buttonPracticeText == this.$t('i18n.practiceNotStarted') || this.buttonPracticeText == this.$t('i18n.practiceOver')) {
        return ;
      }

      // 无传值时为event, 有&wrong是错题重做
      let wrongUrl = (typeof wrong == 'boolean') && wrong? '&wrong=1': '';
      window.location.href = window.parseURL(_.baseURL + '/jsp/wap/examination/practice/practice_answer.jsp?id=' + this.practiceId + wrongUrl);
    },

    // 进入查看结果页
    enterResult() {
      window.location.href = window.parseURL(_.baseURL + '/jsp/wap/examination/practice/practice_result.jsp?id=' + this.practiceId + "&answerId=" + this.countVO.answerId);
    },
  },
  created() {
    this.practiceId = this.$route.params.id; // 获取当前考试id

    // 开始考试详情页数据
    this._getPracticeDetail();

  },
};

</script>

<style lang="scss" scoped>
@import '../../../static/css/mixin.scss';

.qwui-lean_practice_detail {
  margin-bottom: 50px;
  background: #fff;
  @include border-b-1px(#DDD);

  .practice_title {
    margin: 0 0 35px 15px;
    padding-top: 30px;
    font-size: 20px;
    line-height: 20px;
    color: #333;
  }

  .practice_info {
    margin-bottom: 25px;
    padding: 10px 0;
    text-align: center;

    .info_data {
      font-size: 24px;
      line-height: 24px;
      color: #333;
    }
    .info_data_wrong {
      color: #F56262;
    }
    .info_label {
      margin-top: 7px;
      font-size: 14px;
      line-height: 14px;
      color: #999;
    }
  }

  .practice_supplement_box {
    margin-left: 15px;
    padding: 25px 0;
    font-size: 15px;
    @include border-t-1px(#DDD);

    .practice_supplement_item {
      &:not(:last-of-type) {
        margin-bottom: 4px;
      }
      &:last-of-type .practice_label {
        float: left;
        margin-right: 12px;
      }
      .practice_label {
        color: #666;
      }
      .practice_supplement_content {
        margin-left: 12px;
        color: #333;
      }
      .practice_explain {
        display: block;
        margin: 0 10px 0 0;
      }
    }
  }

  .button_fill {
    height: 65px;
  }
  .button_fixed {
    position: fixed;
    display: block;
    bottom: 0;
    width: 100%;
    padding-top: 0;
    background-color: transparent;

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

      .qwui-flexItem:not(:last-of-type) {
        @include border-r-1px(#DDD);
      }

      .practice_button {
        color: #fff;
        background: #45A8F5;
      }
      .practice_button_ban{
        color: #fff;
        background: #ccc;
      }

    }
  }

}

</style>
