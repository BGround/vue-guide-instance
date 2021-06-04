<template>
  <div class="wrap exam_marking_detail">
    <!-- 试卷信息 -->
    <div class="examination_info" v-show="answer.examName">
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
      :key="index"
      :allReadOnly="true"
    ></marking>
    <!--图片预览组件-->
    <preview-images :useWxPreview="false"></preview-images>
  </div>
</template>


<script>
import PreviewImages from "@/components/base/previewImages"; // 图片预览组件
import Marking from '../../../components/examination/Marking'; // 阅卷组件
import { getManualDetail } from "../../../api/getData"; // 请求接口

export default {
  name: 'MarkingDetail',
  components:{
    PreviewImages,
    Marking
  },
  data(){
    return {
      /* 公共组件配置项 */


      /* 数据项 */
      answerId: '',
      markingData: {
        answer: {},
        answerMap: new Map(),
        submitLock: false, // 提交锁，防多次触发
        imgUrls: [],//图片地址数组
      },

    };
  },
  computed: {
    // 阅卷数据
    answer() {
      return this.markingData.answer;
    },
  },
  created() {
    this.answerId = this.$route.params.id;
    this._getManualDetail();
  },
  methods:{
    // 获取阅卷试卷答案数据请求 并 处理数据
    _getManualDetail() {
      return new Promise((resolve, reject) => {
        getManualDetail({
          answerId: this.answerId
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
          qeList.forEach(item => {
            answerMap.set(item.questionId, item);
          });

          /*
            数据赋值, questionVOList数组中增加以下几项属性
            markingScore： 便于评分
            warnTipShow： 警告提示，便于父组件提交前检阅设置。在子组件中触发核对事件时关闭
            focus：自动聚焦
          */
          questionVOList.forEach(nowQuestionVOList => {
            let nowAnswer = answerMap.get(nowQuestionVOList.questionId);
            nowQuestionVOList.markingScore = nowAnswer? '' + parseFloat(nowAnswer.score): '';

            // 设置预览图片
            if (nowQuestionVOList.picList) {
              nowQuestionVOList.picList.forEach(nowPicItem => {
                tempImgArr.push(nowPicItem);
              });
            }
            if (nowAnswer && nowAnswer.picList) {
              nowAnswer.picList.forEach(nowPicItem => {
                tempImgArr.push(nowPicItem);
              });
            }
          })
          imgUrls.push.apply(imgUrls, tempImgArr);

          Object.assign(this.markingData, data);
        }
      });
    },
  },

};

</script>

<style lang="scss" scoped>
.exam_marking_detail {
  
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
}
</style>
