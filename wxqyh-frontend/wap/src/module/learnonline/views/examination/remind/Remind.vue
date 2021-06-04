<template>
  <div class="wrap qwui-lean_exam_remind">
    <div v-show="answer.examName">
      <!-- 阅卷提示 -->
      <div class="qwui-tips fixed_set_top">
        <div class="top_tips marking_tips" v-if="markingTip.show">
          {{$t('i18n.markingTips') + markingTip.score + $t('i18n.markingTipsAnd')}}
        </div>
      </div>

      <!-- 试卷信息 -->
      <div class="examination_info">
        <div class="exam_name">{{answer.examName}}</div>
        <div class="examinee_name">{{$t('i18n.lastName') + $t('i18n.colon') + answer.personName}}</div>
        <div class="handIn_time">{{$t('i18n.handInTime') + answer.finishTime}}</div>
      </div>

      <!-- 阅卷题目循环 -->
      <marking
        v-for="(item,index) in answer.questionVOList"
        :item="item"
        :imgUrls="markingData.imgUrls"
        :answer="markingData.answerMap.get(item.questionId)"
        :markingTip="markingTip"
        :key="index"
        @markingTip="listenFormMarking"
      ></marking>

      <!-- 提交按钮 -->
      <div class="submission" @click="submitMarking">{{$t('i18n.submission')}}</div>

      <!--图片预览组件-->
      <preview-images :useWxPreview="false"></preview-images>
    </div>
    
    <!-- 无数据组件 -->
    <no-record
      :hasrecord="comHasRecord"
    ></no-record>

    <!-- 返回首页 -->
    <div class="returnButton" v-show="hasRecord.common.show" @click="returnRemind">{{$t('i18n.returnRemind')}}</div>
  </div>
</template>

<script>
import PreviewImages from "@/components/base/previewImages"; // 图片预览组件
import NoRecord from '@/components/base/no_record'; // 暂无数据组件
import Marking from '../../../components/examination/Marking'; // 阅卷组件
import { getMarkingAnswer, appraiseAnswer} from "../../../api/getData"; // 请求接口
export default {
  name: 'QwExamRemind',
  components:{
    PreviewImages,
    NoRecord,
    Marking
  },
  filters: {
  },
  data(){
    return {
      examId: '',
      markingData: {
        answer: {},
        answerMap: new Map(),
        submitLock: false, // 提交锁，防多次触发
        imgUrls: [],//图片地址数组
      },
      markingTip: { // 阅卷提示
        show: false,
        score: 10
      },
      hasRecord: {
        common: {
          show: false,
          setTop: true,
        },
        marking: {
          index: 0, // 根据index 用计算属性去切换以下几项
          noData: {
            icon: 'icon_search_noCourse',
            title: '',
            text: this.$t('i18n.noMarkingTest'),
          },
          complete: {
              icon: 'icon_search_noCourse',
              title: '',
              text: this.$t('i18n.markingComplete'),
          },
          noPower: {
            icon: 'icon_exam_markingLock',
            title: this.$t('i18n.noPermission'),
            text: this.$t('i18n.markingNoPermissionTips')
          },
          other: {
            icon: 'icon_search_noCourse',
            title: '',
            text: this.$t('i18n.noData'),
          },
        },
      }
    };
  },
  computed: {
    // 阅卷数据
    answer() {
      return this.markingData.answer;
    },
    // 无数据页面
    comHasRecord() { // 搜索类型 课程0 直播1 考试2
      let marking = this.hasRecord.marking;
      let nowHasRecord =  marking.index == 0? marking.noData:
                          marking.index == 1? marking.complete:
                          marking.index == 2? marking.noPower: marking.other;
      return  Object.assign({}, this.hasRecord.common, nowHasRecord);
    },
  },
  methods:{
    // 初始化数据
    initData() {
      // 阅卷数据初始化
      Object.assign(this.markingData, {
          answer: {},
          answerMap: new Map(),
          submitLock: false,
          imgUrls: [],//图片地址数组
        });
      // 阅卷提示初始化
      Object.assign(this.markingTip, {
        show: false,
        score: 10
      });

      this.hasRecord.common.show = false; // 隐藏无数据组件
      this.hasRecord.marking.index = 0; // 无数据初始化为noData 无待阅试卷
    },

    // 获取阅卷试卷答案数据请求 并 处理数据
    _getMarkingAnswer() {
      this.initData(); // 初始化数据后请求
      let marking = this.hasRecord.marking;
      
      return new Promise((resolve, reject) => {
        getMarkingAnswer({
          examId: this.examId
        }, data => {
          resolve(data);
        }, reject, false);
      }).then(data => {
        if (data) { // code非0会被catch捕获, data为undefined
          let imgUrls = this.markingData.imgUrls; // 预览图片数组
          let questionVOList = data.answer.questionVOList; // 题目数组
          let qeList = data.answer.qeList; // 答案数组
          let answerMap = this.markingData.answerMap; // 答案和题目的映射
          let tempImgArr = [];

          if (!questionVOList) { // 如果题目数组没定义，则重新获取
             // 重新刷新请求
            this._getMarkingAnswer();
            // 返回一个pendding 中断后面的Promise
            return new Promise(() => {});
          }

          // 添加答案和题目映射关系
          for (let i = 0; i < qeList.length; i++) {
            let nowQeItem = qeList[i];
            answerMap.set(nowQeItem.questionId, nowQeItem);
          }

          /*
            数据赋值, questionVOList数组中增加以下几项属性
            markingScore： 便于评分
            warnTipShow： 警告提示，便于父组件提交前检阅设置。在子组件中触发核对事件时关闭
            focus：自动聚焦
          */
          for (let i = 0; i < questionVOList.length; i++) {
            let nowQuestionVOList = questionVOList[i];
            let nowAnswer = answerMap.get(nowQuestionVOList.questionId);
            nowQuestionVOList.markingScore = nowAnswer? '' + parseFloat(nowAnswer.score): '';
            nowQuestionVOList.warnTipShow = false; // 父组件设置的警告显示， 在子组件验证时关掉
            nowQuestionVOList.focus = false;

            // 设置预览图片
            if (nowQuestionVOList.picList) {
              for (let j = 0; j < nowQuestionVOList.picList.length; j++) {
                let nowPicItem= nowQuestionVOList.picList[j];
                tempImgArr.push(nowPicItem);
              }
            }
            if (nowAnswer && nowAnswer.picList) {
              for (let j = 0; j < nowAnswer.picList.length; j++) {
                let nowPicItem= nowAnswer.picList[j];
                tempImgArr.push(nowPicItem);
              }
            }
          }


          imgUrls.push.apply(imgUrls, tempImgArr);

          Object.assign(this.markingData, data);
        }
      }).catch(err => {
        let code = err.code;

        switch(code) {
          case '350021': // 已完成所有的阅卷
            marking.index = 1; // 无数据complete
            break;
          case '350022': // 你没有阅卷权限
            marking.index = 2; // 无数据noPower
            break;
          case '350025': // 你无此答卷阅卷权限
            // 重新刷新请求
            this._getMarkingAnswer();

            // 返回一个pendding 中断后面的Promise
            return new Promise(() => {});
            break;
          default:
            marking.index = 3; // 无数据other
        }

        this.hasRecord.common.show = !this.markingData.answer.qeList;
        return;
      });
    },

    // // 提交阅卷
    _appraiseAnswer(obj) {
      return new Promise((resolve, reject) => {
        appraiseAnswer(obj,
         data => {
          resolve();
        }, reject);
      });
    },

    // // 点击按钮判断并提交阅卷
    submitMarking() {
      this.markingData.submitLock = true; // 提交锁， 防多次触发

      let questionVOList = this.markingData.answer.questionVOList; // 题目数组
      let answerMap = this.markingData.answerMap; // 答案和题目的映射
      let firstWarnFlag = true;
      let postData = {
            examId: this.answer.examId,
            answerId: this.answer.id,
            manualId: this.answer.manualId
          };

      // 判断评分是否都有数据，且在评分范围内
      for (let i = 0; i < questionVOList.length; i++) {
        let nowQuestionVOList = questionVOList[i];
        let scoreNum = parseFloat(nowQuestionVOList.markingScore); // 当前评分,如果是空文本则转成NaN
        let setScore = nowQuestionVOList.setScore; // 评分上限
        let nowAnswer = answerMap.get(nowQuestionVOList.questionId);


        // 请求数组赋值答案数组的id
        if (nowAnswer) {
          postData['searchValue.appraise_' + nowAnswer.id] = scoreNum;
        } else {// 得有答案才需要检测是否为空文本NaN， 无答案本身就为0
          scoreNum = 0;
        }

        if (isNaN(scoreNum) || scoreNum > setScore) { //空文本转为NaN, 无数据或超范围要提示
          nowQuestionVOList.warnTipShow = true; // 开启错误警告，在子组件触发验证时关闭

          // 第一个警告则聚焦过去, 后续警告只要显示警告号即可。
          if (firstWarnFlag) {
            firstWarnFlag = false;
            nowQuestionVOList.focus = true; // 开启自动聚焦，在子组件触发验证时关闭
          }
        }
      }

      // 如果firstWarnFlag还是true，证明没错误，可以提交
      if (firstWarnFlag) {
        this._appraiseAnswer(postData).then(() => {
          this.markingData.submitLock = false; // 提交锁关闭
          this._getMarkingAnswer(); // 获取新的试卷
        });
      } else {
        // 有错误，无需提交，这波提交操作终止
        this.markingData.submitLock = false; // 提交锁关闭
      }
    },
    
    // 阅卷警告提示更换监听
    listenFormMarking(obj) {
      this.markingTip = Object.assign({}, obj);
    },

    // 返回阅卷首页
    returnRemind() {
      this.$router.push({name: 'examination', params: {index: 2}});
    }
  },
  created() {
    this.examId = this.$route.params.id;
    this._getMarkingAnswer();
  },
};

</script>

<style lang="scss" scoped>

.qwui-lean_exam_remind {
  min-height: 100vh;
  background: #fff;
  
  .fixed_set_top {
    .top_tips {
      display: flex;
      height: 40px;
      padding: 0 15px;
      font-size: 15px;
      color: #fff;
      line-height: 40px;
      background: #E94F4F;
      cursor: pointer;
    }
    .marking_tips {
      display: block;
      font-size: 14px;
      text-align: center;
    }
  }

  .examination_info {
    padding: 15px 0;
    color: #333;
    text-align: center;

      .exam_name {
        font-size: 20px;
        line-height: 20px;
      }
      .examinee_name {
        margin-top: 14px;
        font-size: 15px;
        line-height: 15px;
      }
      .handIn_time {
        margin-top: 9px;
        font-size: 14px;
        line-height: 14px;
        color: #999;
      }
  }

  .submission {
    margin: 20px 15px;
    padding: 14px 0;
    text-align: center;
    font-size: 17px;
    line-height: 17px;
    color: #fff;
    border-radius: 5px;
    background: #45A8F5;
    cursor: pointer;
  }

  & /deep/ .icon_search_noCourse {
    display: inline-block;
    width: 130px;
    height: 130px;
    background: url('~assets/images/noCourse.png') center no-repeat;
    background-size: cover;
  }

  & /deep/ .icon_exam_markingLock {
    display: inline-block;
    width: 130px;
    height: 130px;
    background: url('~assets/images/icon_noContent.png') -512px center no-repeat;
    background-size: cover;
  }

   & /deep/ .qwui-no_record_box {
    top: 40%
   }
  .returnButton {
    position: fixed;
    top: 54%;
    right: 0;
    left: 0;
    margin: 0 auto;
    width: 220px;
    height: 42px;
    line-height: 42px;
    font-size: 16px;
    color: #666;
    text-align: center;
    background: #FFF;
    border:1px solid #DDDDDD;
    border-radius: 5px;
  }
}

</style>
