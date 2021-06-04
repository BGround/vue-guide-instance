<template>
  <div class="wrap qwui-lean_exam_result" v-if="detailVO.finishTime">
    <!-- 答题卡部分 -->
    <result-answer-card 
      v-show="!showAnalysis"
      :resultData="resultData"
      :canExamAgain="canExamAgain"
      :isExternal="isExternal"
      @enterExam="enterExam"
      @showAnalysis="listernAnswerCard"
      @enterIndex="enterIndex"
    ></result-answer-card>


    <!-- 答案解析部分 -->
    <result-answer-parsing
      v-show="showAnalysis"
      :nowIndex.sync="nowIndex"
      :questionList="questionList"
      :isShowFooter="resultData.isShowFooter"
      @answerParsing="listenFromAnswerParsing"
    ></result-answer-parsing>
  </div>
</template>

<script>
import * as timeUtil from '@/assets/js/time-util'; // 公共时间方法
import { getResultData, getResultDataExternal, getExamDetail } from '../../../api/getData'; // 请求接口
import ResultAnswerCard from './ResultAnswerCard'; // 答题卡组件
import ResultAnswerParsing from './ResultAnswerParsing'; // 答案解析组件
// import wx from 'weixin-js-sdk'; // 微信操作 
export default {
  name: 'QwExamResult',
  components: {
    ResultAnswerCard,
    ResultAnswerParsing,
  },
  data() {
    return {
      /* 数据项 */
      examId: '', // 当前考试的id
      answerId: '', // 当前答案的id
      isExternal: false, // 是否外部考试

      resultData: {}, // 结果页数据，请求后赋值
      answerMap: new Map(), // 答案数据, 将答案和题目关系连接起来(答案:optionList 题目:questionList)
      detailData: {}, // 详情页数据（用于提取再次考试权限
      nowIndex: 0, // 当前题目下标
      showAnalysis: false, // 切换显示答题卡或解析 默认false显示答题卡
      timeHandle: 0, // 如果无截止时间, 发送请求句柄
    };
  },
  computed: {
    detailVO() {
      return (this.resultData && this.resultData.detailVO) || {};
    },
    questionList() {
      let questionList = this.resultData.questionList
      return questionList? questionList: [];
    },
    // 再次考试权限
    canExamAgain() {
      let detailData = this.detailData;
      let examPO = detailData && detailData.examPO;
      return  !examPO? false: 
              examPO.maxTimes == 0 || 
              examPO.maxTimes > detailData.answerTimes? true: false;
    },
  },
  watch: {
    showAnalysis: function (value) {
      document.title = value? this.$t('i18n.questionAnalysis'): this.$t('i18n.examResult'); // title动态更换为 试题解析, 考试结果
    }
  },
  methods:{
    // 答题卡点击监听
    listernAnswerCard(index){
      if (typeof index === 'number') { // 如果为Number为点击答题卡题号
        // 非按钮进入需要更改当前题号
        this.nowIndex = index;
      }
      this.showAnalysis = true;
    },

    // 监听解析页组件事件
    listenFromAnswerParsing(state) {
      // state 0:功能  1:完成（最后一题）
      // 在解析页无需区分， 因为都是切换显示答题卡组件
      this.showAnalysis = false;
    },

    // 请求内部考试详情页数据(用于取再次考试权限)
    _getExamDetail() {
      return new Promise((resolve, reject) => {
        getExamDetail({examId: this.examId}, data => {
          this.detailData = Object.assign({}, data);
          resolve();
        }, reject);
      });
    },

    // 请求内部考试结果页数据
    _getResultData(isFirst = true) {
      return new Promise((resolve, reject) => {
        getResultData({examId: this.examId, answerId: this.answerId}, data => {
          let detailVO = data.detailVO;

          // 无交卷时间处理
          // 如果无截止时间, 则3s后再次发送请求, 本次数据继续处理
          if (!detailVO.finishTime) {
            _.showLoading('已完成考试，加载中');
            this.timeHandle = setTimeout(this._getResultData, 3000, false);
          } else {
            _.hideLoading();
          }
          // 开始处理数据
          this.processResultData(data, detailVO);
          
          resolve();
        }, reject, true, isFirst);
      });
    },

    // 请求外部考试结果页数据
    _getResultDataExternal(isFirst = true) {
      return new Promise((resolve, reject) => {
        getResultDataExternal({examId: this.examId, answerId: this.answerId}, data => {
          let detailVO = data.detailVO;

          // 无交卷时间处理
          // 如果无截止时间, 则3s后再次发送请求, 本次数据继续处理
          if (!detailVO.finishTime) {
            _.showLoading('已完成考试，加载中');
            setTimeout(this._getResultDataExternal, 3000, false);
          } else {
            _.hideLoading();
          }

          // 开始处理数据
          this.processResultData(data, detailVO);
          
          resolve();
        }, reject, true, isFirst);
      });
    },

    // 处理结果页数据
    processResultData(data, detailVO) {
      let questionList = [];
      let answerList = detailVO && detailVO.optionList; // option即答案
      let answerListLength = answerList? answerList.length: 0;
      let questionSort = data.questionSort;
      if (questionSort && questionSort.length) { 
        // 题目为乱序的
        // 根据questionSort重新为data.questionList排序
        let questionSortMap = new Map();
        data.questionList.forEach(item => {
          questionSortMap.set(item.questionId, item);
        });

        questionSort.forEach(id => {
          questionList.push(questionSortMap.get(id));
        });
        
      } else { // 非乱序
        questionList = data.questionList;
      }
      let questionListLength = questionList? questionList.length: 0;

      // 对答案数据初始化
      this.answerMap = new Map();
      let answerMap = this.answerMap;

      // 是否有权利看对错 // 正确与否 是否可见 0不可见，1交卷后可见，2考试结束后可见，3考试结束后和交卷后均可见
      let canShowRightCount = !detailVO? false: // 没获取到数据
                              detailVO.isViewRight == 1 ||
                              (detailVO.isViewRight == 2 && detailVO.examStatus == 2) ||
                              detailVO.isViewRight == 3? true: false; // 


      /*--- 开始赋值答案数据, 建立题目和答案的联系  即通过题目id  找到答案项 --START--*/ 
      // 单选/多选/判断 赋值答案数据
      for (let i = 0; i < answerListLength; i++) {// answerList => option即答案
        let nowAnswer = answerList[i];
        let answerOfMap = answerMap.get(nowAnswer.questionId); // 是否有记录

        // 有记录则在optionId多添加一个, 没有记录则按照
        nowAnswer.optionId = answerOfMap? `${answerOfMap.optionId}|${nowAnswer.optionId}`: nowAnswer.optionId;
        answerMap.set(nowAnswer.questionId, nowAnswer); // 通过题目id记录答案项
      }
      
      // 填空/问答 赋值答案数据
      let qeList = detailVO && detailVO.qeList
      let qeListLength = qeList? qeList.length: 0;
      for (let i = 0; i < qeListLength; i++) {
        let nowQeItem = qeList[i];
        answerMap.set(nowQeItem.questionId, nowQeItem);
      }
      /*--- 开始赋值答案数据, 建立题目和答案的联系  即通过题目id  找到答案项 --END--*/

      // 题目赋值答案
      for (let i = 0; i < questionListLength; i++) {

        // 选择题答案赋值
        let nowQuestion = questionList[i];
        let nowAnswer = answerMap.get(nowQuestion.questionId);

        // 选择题答案状态赋值
        // 0:未考; 1:已考; 2:正确; 3:部分正确; 4错误 
        nowQuestion.stateOfAnswer = !nowAnswer? 0: // 没考过
                                    !canShowRightCount? 1: // 无需显示对错
                                    nowAnswer.earnScore == nowQuestion.setScore || 
                                    nowAnswer.score == nowQuestion.setScore? 2: // 得分置正确
                                    (nowAnswer.earnScore == '0.0' || nowAnswer.earnScore == '' ||
                                    nowAnswer.score == '0.0' || nowAnswer.score == '')? 4: 3;

        let option = nowQuestion.optionList? nowQuestion.optionList: [];
        let optionLength = option.length;
        for (let j = 0; j < optionLength; j++) {
          let nowOption = option[j];
          let stateOfAnswer = nowQuestion.stateOfAnswer;
          let isExamineeOption = nowAnswer? nowAnswer.optionId.includes(nowOption.id): false; // 考生是否选择
          nowOption.stateOfOption = stateOfAnswer == 0? nowOption.isAnswer == 1? 4: 0 // 未答 4：未答正确
                                    :
                                    stateOfAnswer == 2? 
                                      isExamineeOption? 1: 0: // 答对，考生选择都为1，其他未选
                                    nowOption.isAnswer == 1? // 该选项是否正确
                                        isExamineeOption? 1: 3//  正确答案，考生有选/漏选正确  考生是否选了
                                      : 
                                        isExamineeOption? 2: 0// 错选/未选         
        }

        // 填空题/问答题答案赋值
        nowQuestion.examineeAnswer =  !nowAnswer
                                      ? '': 
                                        nowAnswer.content
                                        ? nowAnswer.content:
                                          '';

        nowQuestion.examineePicList = !nowAnswer
                                      ? '': 
                                        nowAnswer.picList
                                        ? nowAnswer.picList:
                                          [];
      }
      this.resultData = Object.assign({}, data, {
        questionList: questionList
      }); // 数据赋值

      /*
      新增数据
      questionList:[
        {
          stateOfAnswer: 0:未考; 1:已考; 2:正确; 3:部分正确; 4错误 
          optionList:[
            stateOfOption: 0:未选; 1:选择正确; 2:选择错误;3:漏选正确;4:未答正确（未答题-正确选项） 
          ]
          examineeAnswer: // 考生答案
          examineePicList: // 考生图片
        }
      ]
       */
    },

    // 获取数据
    getData() {
      // 分为内部和外部考试
      if (this.isExternal) {
        // 外部考试
        this._getResultDataExternal(); // 获取外部考试结果页数据 
      } else {
        // 内部考试
        this._getResultData(); // 获取内部考试结果页数据 
        this._getExamDetail(); // 请求内部考试详情页数据(用于取再次考试权限)

      }
    },

    // 进入考试页面
    enterExam() {
      this.$router.replace({name: 'exam_write', params: {id: this.examId}});
    },

    // 返回主页
    enterIndex() {
       this.$router.push({name: 'examination', params: {index: -1}});
    },

  },
  created() {
    this.examId = this.$route.params.id; // 获取当前考试id
    this.answerId = this.$route.params.answerId; // 获取当前答案的id
    this.isExternal = location.hash.includes('open')? true: false; // 判断是否外部考试

    // 开始请求数据
    this.getData();
  },
  beforeDestroy() {
    // 清除无交卷时间时的间隔3s请求时间句柄，避免用户退出过快，一直请求
    clearTimeout(this.timeHandle);
  }
};

</script>

<style lang="scss" scoped>

.qwui-lean_exam_result {
  
}

</style>
