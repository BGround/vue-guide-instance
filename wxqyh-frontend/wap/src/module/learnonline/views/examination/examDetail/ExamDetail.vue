<template>
  <div class="wrap qwui-lean_exam_detail">
    <!-- 出错时的白底+锁+字浮层, 以后产品需改 -->
    <div class="no_data" v-if="errHtml">
      <div class="no_data_content">
        <i class="icon_lock"></i>
        <div v-html="errHtml"></div>
      </div>
    </div>

    <div v-else>
      <!-- 考试标题 -->
      <div class="exam_title"><span class="exam_title_content">{{examPO.examName}}</span><apply-status :applystatus="comApplyStatus"></apply-status></div>

      <!-- 考试信息 -->
      <div class="exam_info">
        <!-- 第一行信息 -->
        <div class="qwui-flexbox">
          <!-- 考试总分 -->
          <div class="qwui-flexItem exam_info_item">
            <i class="ic_common ic_totalScore"></i>
            <div class="info">
              <div class="info_data">{{examPO.totalScore|filterScore}}</div>
              <div class="info_label">{{$t('i18n.examTotalScore')}}</div>
            </div>
          </div>
          <!-- 考试及格分 -->
          <div class="qwui-flexItem exam_info_item">
            <i class="ic_common ic_pass"></i>
            <div class="info">
              <div class="info_data">{{examPO.passGrade}}</div>
              <div class="info_label">{{$t('i18n.examPassScore')}}</div>
            </div>
          </div>
        </div>
        <!-- 第二行信息 -->
        <div class="qwui-flexbox">
          <!-- 考试总题数 -->
          <div class="qwui-flexItem exam_info_item">
            <i class="ic_common ic_numberOfQuestions"></i>
            <div class="info">
              <div class="info_data">{{examPO.questcount}}</div>
              <div class="info_label">{{$t('i18n.numberOfQuestions')}}</div>
            </div>
          </div>
          <!-- 考试时长 -->
          <div class="qwui-flexItem exam_info_item">
            <i class="ic_common ic_duration"></i>
            <div class="info">
              <div class="info_data">{{duration}}</div>
              <div class="info_label">{{$t('i18n.examDuration')}}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 考试时间信息box -->
      <div class="exam_supplement_box">
        <!-- 考试时间 -->
        <div>
          <span class="exam_label">{{$t('i18n.examTime')}}</span>
          <span class="exam_supplement_content">{{startTime|filterTime}} {{$t('i18n.to')}} {{endTime|filterTime}}</span>
        </div>
        <!-- 考试次数 -->
        <div class="exam_supplement_last">
          <span class="exam_label">{{$t('i18n.maxTimes')}}</span>
          <span class="exam_supplement_content">{{maxTimes}}</span>
        </div>
      </div>

      <!-- 补考时间信息box -->
      <div class="exam_supplement_box" v-if="examPO.resitStartTime">
        <!-- 补考时间 -->
        <div>
          <span class="exam_label">{{$t('i18n.resitTime')}}</span>
          <span class="exam_supplement_content">{{examPO.resitStartTime|filterTime}} {{$t('i18n.to')}} {{examPO.resitEndTime|filterTime}}</span>
        </div>
        <!-- 补考次数 -->
        <div class="exam_supplement_last">
          <span class="exam_label">{{$t('i18n.resitTimes')}}</span>
          <span class="exam_supplement_content">{{resitTimes}}</span>
        </div>
      </div>

      <!-- 考试说明 -->
      <div class="exam_instructions">
        <div class="exam_explain" v-html="examExplain"></div>
        <img  class="exam_img"
              v-for="(item, index) in detailData.picList"
              :src="filterCompressURL(item.picPath)"
              alt=""
        >
      </div>

      <!-- 按钮填充 -->
      <div class="button_fill" v-if="buttonShow"></div>
      <!-- 按钮 -->
      <div class="qwui-tips button_fixed qwui-nav_footer_fix" v-if="buttonShow">
        <div class="qwui-flexbox button_box">
          <!-- 查看结果按钮 -->
          <div class="qwui-flexItem result_button"
            v-if="resultButtonShow"
            :class="moreButton"
            @click="enterResult"
          >{{$t('i18n.watchResult')}}</div>

          <!-- 考试按钮 -->
          <div class="qwui-flexItem exam_button"
            v-if="examButtonText"
            :class="examButtonClass"
            @click="enterExam"
          >{{examButtonText}}{{remainingTimeStr}}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getExamDetail, getExternalExamDetail, searchExamCount as getExaming } from "../../../api/getData"; // 请求接口
import wx from 'weixin-js-sdk'; // 微信操作
import ApplyStatus from '@/components/part/apply_status'; // 标签状态公共组件

export default {
  name: 'QwExamDetail',
  components:{
    ApplyStatus
  },
  filters: {
    // 过滤为分数，浮点能化整就整
    filterScore(score) {
      return  !score? '': parseFloat(score);
    },
    // 过滤时间 去掉年份
    filterTime(str) {
      // 获取数据前str为undefined，无includes方法;  没有- 则是无限制/--
      return str && !str.includes(':')? str:
             str? str.slice(5): '';
    },
  },
  data(){
    return {
      /* 公共组件配置项 */
      applyStatus: {
        common: {
          active: true // false为默认，true加了"padding:3px"会大一些
        },
        marking: { // 阅卷中
          class: 'status_blue', // 标签颜色
          name: this.$t('i18n.readIng'),
        },
        over: { // 已结束
          class: 'status_blue', // 标签颜色
          name: this.$t('i18n.isOver'),
        },
        hidden: { // 隐藏
          name: '' // name无值 标签会隐藏
        }
      },


      /* 数据项 */
      examId: '', // 当前考试的id
      isExternal: false, // 是否外部考试
      detailData: { // 详情页数据
        examPO: {} // 考试信息
      },
      answerMap: new Map(), // 考试中数据 id映射整个对象
      errHtml: '', // 白底错误页面的html 【以后新ui需改】
      showCourseTurnTips: false, // 展示课程自动跳转考试提示

    };
  },
  computed: {
    ...mapState([
      'examination'
    ]),
    examPO() {
      return this.detailData.examPO;
    },
    answerVO() {
      return this.detailData.answerVO;
    },
    // 考试时长
    duration() {
      let examPO = this.examPO;
      return examPO.duration == 0? this.$t('i18n.noLimit'): examPO.duration;
    },
    // 开考时间
    startTime() {
      let examPO = this.examPO;
      return examPO.startTime? examPO.startTime: examPO.createTime;
    },
    // 结束时间
    endTime() {
      let examPO = this.examPO;
      return examPO.lastStartTime? examPO.lastStartTime: '--';
    },
    // 可考次数
    maxTimes() {
      let examPO = this.examPO;
      return examPO.maxTimes? examPO.maxTimes + this.$t('i18n.times'): this.$t('i18n.unlimited');
    },
    // 补考次数
    resitTimes() {
      let examPO = this.examPO;
      return examPO.resitTimes? examPO.resitTimes + this.$t('i18n.times'): this.$t('i18n.unlimited');
    },
    // 考试说明
    examExplain() {
      let examPO = this.examPO;
      return examPO.examExplain? examPO.examExplain.replace(/\n/g, '<br/>'): '';
    },




    /*以下为需要监听的计算属性*/
    // 公共组件标签配置
    comApplyStatus() {
      let applyStatus = this.applyStatus;
      let nowApplyStatus =  this.examButtonText == this.$t('i18n.finishMarking')? applyStatus.marking:
                            this.examButtonText == this.$t('i18n.examIsOver') || this.examButtonText == ''? applyStatus.over: applyStatus.hidden;
      return Object.assign({}, applyStatus.common, nowApplyStatus);
    },
    // 是否继续考试
    isGoonTest() {
      return this.answerMap.get(this.examId);
    },
    // 剩余时间(ms) 负为时间已到
    remainingTime() {
      let answerVO = this.answerVO;
      let time = this.isGoonTest?
          new Date(this.isGoonTest.answerTime.replace(/-/g, "/")).getTime() + this.examPO.duration * 60 * 1000 - this.examination.nowTimeStamp: 0;
      // 剩余时间 = 开答时间 + 考试时长 - 当前时间。
      return time;
    },
    // 继续考试倒计时文本
    remainingTimeStr() {
      if (this.examPO.duration == '0') { return '';} // 如果无截止时间则返回
      let times = '';

      // 如果不是继续考试，则无需显示
      if (this.examButtonText == this.$t('i18n.goonTest') && this.remainingTime > 0) {
        let min = Math.floor(this.remainingTime / (60 * 1000));
        times = min < 10? '0' + min: min;

        let second = Math.floor(this.remainingTime / 1000 - min * 60);
        times += " : ";
        times += second < 10? '0' + second: second;
        times = ' ' + times;
      }
      return times;
    },
    // 查看结果按钮显示  外部考试直接显示 || 有答案，非继续考试，非提交卷中
    resultButtonShow() {
      return this.isExternal || (this.answerVO && this.answerVO.id &&
      this.examButtonText != this.$t('i18n.goonTest') &&
      this.examButtonText != this.$t('i18n.inHandOver'));
    },
    // 补考状态 -1 无补考；0 补考前；1 补考时；2 补考后
    resiterState() {
      let examPO = this.examPO;
      let resitStartTime = new Date(examPO.resitStartTime.replace(/\-/g, "/")).getTime();
      let resitEndTime = new Date(examPO.resitEndTime.replace(/\-/g, "/")).getTime();
      let current = this.examination.nowTimeStamp;
      return  !examPO.ifResit? -1: // 没有补考
              current < resitStartTime? 0: // 还没到补考时间;
              resitStartTime < current && current < resitEndTime? 1: 2;// 补考时/补考后
    },
    // 考试操作按钮文字 // 需改
    examButtonText() {
      let detailData = this.detailData;
      let examPO = this.examPO;
      let answerVO = this.answerVO;
      return  detailData.finish_learn? this.$t('i18n.finishLearn'): // 请先完成课程
              detailData.IsNotStart? this.$t('i18n.testNoBegin'): // 考试未开始
              detailData.isAppraise? this.$t('i18n.finishMarking'): // 已完成考试，阅卷中
              (answerVO && this.isGoonTest) || (this.isExternal && answerVO)? // 参加过考试, 本次还在考试中 // 外部考试
                examPO.duration == 0? this.$t('i18n.goonTest'): // 无限时长
                this.remainingTime > 0? this.$t('i18n.goonTest'): // 有限时间考试时间内
                this.remainingTime > -2000? this.$t('i18n.inHandOver'): '' // 小于0时，2秒显示交卷
              : // 没参加过考试 或 参加过考试有交卷记录
                examPO.examStatus == 2? // 没参加过考试且已结束 examStatus == 2已结束
                  examPO.resitGetting != 5? this.$t('i18n.backgroundProcessing'): // 后台还没处理完 resitGetting：5后台提取完
                  this.resiterState == 0? this.$t('i18n.fixTestNoBegin'): // 处理完 补考前
                  this.resiterState == 1? // 补考时=1，补考：还没开始新一轮； 继续考试：未交卷，
                    answerVO && answerVO.answerStauts == 0? this.$t('i18n.goonTest'): this.$t('i18n.fixTest')
                    : this.$t('i18n.examIsOver') // 2 补考后 -1 无补考都显示已结束
                :
                  answerVO? // 非第一次考试
                    examPO.maxTimes == 0 || examPO.maxTimes > detailData.answerTimes? // 在可考次数内
                      this.isGoonTest?
                        examPO.duration == 0? this.$t('i18n.goonTest'): // 无限时长
                          this.remainingTime > 0? this.$t('i18n.goonTest'): // 有限时间考试时间内
                          this.remainingTime > -2000? this.$t('i18n.inHandOver'): '' // 小于0时，2秒显示交卷
                      : this.$t('i18n.againTest')
                    : '' // 不在可考次数内
                  :
                    this.$t('i18n.test'); // 第一次考试且还没结束，可进行考试

    /*
      逻辑： 复杂是因为后端接口，考试状态用了太多参数区表示，普通只要获取数据后封装，用一个变量 0~n表示，后端的时间标准更为准确，也更为安全。
      多个变量导致：需要考虑判断顺序，预防冲突或落入多个状态同时显示的尴尬境地

      分界线是： 是否参加过考试（老版本思路）  优化过，还可以优化

      1、是否要求课程完成才能考、是否未开始、是否在阅卷中（这几个都是data子属性，特殊情况出现的，先判断）

      2、尝试优化：

      =====================================================================================================
      2、是否第一次参加考试, 本次还未交卷？
        是：第一次参加考试, 本次还未交卷： 是否无限时长？
                                是：'继续考试'√
                                否：继续考试，倒计时，倒计时完2s显示交卷，2s后重新请求数据√

        否：没参加过考试 或 参加过考试有交卷记录： 是否已结束？
                                            是：  是否后台处理完？
                                                  是：是否可以补考?
                                                      是： 补考前、补考（已交卷了，还没开始新一轮）、
                                                      继续考试（即点了补考还没交卷）、考试已结束; 4个状态√
                                                      否：'考试已结束'
                                                  否：'后台处理中'√

                                            否：  是否参加过考试？
                                                  是： 是否还有可考次数？
                                                       是： 是否在考试中？
                                                            是：是否无限时长？
                                                                是：'继续考试'√
                                                                否：继续考试，倒计时，倒计时完2s显示交卷，2s后重新请求数据√
                                                            否：'再次考试'

                                                       否： ''       √
                                                  否：'考试'√



      return  detailData.finish_learn? this.$t('i18n.finishLearn'): // 请先完成课程
              detailData.IsNotStart? this.$t('i18n.testNoBegin'): // 考试未开始
              detailData.isAppraise? this.$t('i18n.finishMarking'): // 已完成考试，阅卷中
              answerVO && this.isGoonTest? // 参加过考试, 本次还在考试中
                examPO.duration == 0? this.$t('i18n.goonTest'): // 无限时长
                this.remainingTime > 0? this.$t('i18n.goonTest'): // 有限时间考试时间内
                this.remainingTime > -2000? this.$t('i18n.inHandOver'): '' // 小于0时，2秒显示交卷
              : // 没参加过考试 或 参加过考试有交卷记录
                examPO.examStatus == 2? // 没参加过考试且已结束 examStatus == 2已结束
                  examPO.resitGetting != 5? this.$t('i18n.backgroundProcessing'): // 后台还没处理完 resitGetting：5后台提取完
                  this.resiterState == 0? this.$t('i18n.fixTestNoBegin'): // 处理完 补考前
                  this.resiterState == 1? // 补考时=1，补考：还没开始新一轮； 继续考试：未交卷，
                    answerVO.answerStauts == 0? this.$t('i18n.goonTest'): this.$t('i18n.fixTest')
                    : this.$t('i18n.examIsOver') // 2 补考后 -1 无补考都显示已结束
                :
                  answerVO? // 非第一次考试
                    examPO.maxTimes == 0 || examPO.maxTimes > detailData.answerTimes? // 在可考次数内
                      this.isGoonTest?
                        examPO.duration == 0? this.$t('i18n.goonTest'): // 无限时长
                          this.remainingTime > 0? this.$t('i18n.goonTest'): // 有限时间考试时间内
                          this.remainingTime > -2000? this.$t('i18n.inHandOver'): '' // 小于0时，2秒显示交卷
                      : this.$t('i18n.againTest')
                    : '' // 不在可考次数内
                  :
                    this.$t('i18n.test'); // 第一次考试且还没结束，可进行考试
    */
    },
    // 是否禁止按钮
    isBannedButton() {
      let banArr = [this.$t('i18n.backgroundProcessing'), this.$t('i18n.fixTestNoBegin'), this.$t('i18n.testNoBegin'), this.$t('i18n.finishLearn'), this.$t('i18n.examIsOver'), this.$t('i18n.finishMarking'), this.$t('i18n.inHandOver')];
      return banArr.includes(this.examButtonText);
    },
    // 考试按钮样式
    examButtonClass() {
      return  this.examButtonText == this.$t('i18n.fixTest')? {resit_button: true}: // 补考
              this.examButtonText == this.$t('i18n.goonTest') ||
                this.examButtonText == this.$t('i18n.inHandOver')? {goon_button: true}: // 继续考试 || 正在交卷
              this.isBannedButton? {ban_button: true}: {};
    },
    // 总按钮显示开关
    buttonShow() {
      return this.examPO.examName && (this.examButtonText || this.resultButtonShow); // 请求前无需显示
    },
    // 多个按钮存在时需要补充margin
    moreButton() {
      return {
        moreButton: this.examButtonText && this.resultButtonShow
      };
    },

  },
  methods:{
    ...mapMutations([
      'SET_CONTINUE_REMAIN',
      'UPDATE_NOWTIME'
    ]),
    // 处理图片url
    filterCompressURL(url) {
      return url? _.filterCompressURL(url): '';
    },

    // 获取正在考试数据请求
    _getExaming(obj){
      return new Promise((resolve, reject) => {
        getExaming({}, data => {
          if(data.answerIngList) {
            // 提取正在考试中的数组
            this.answerMap = new Map(); // 初始化

            let answerMap = this.answerMap;
            data.answerIngList.forEach(obj => {
              answerMap.set(obj.id, obj);
            });
          }

          resolve();
        }, reject);
      });
    },

    // 请求考试详情页数据
    _getExamDetail() {
      return new Promise((resolve, reject) => {
        getExamDetail({examId: this.examId}, data => {
          this.detailData = Object.assign({}, data); // 数据赋值

          // 设置微信分享信息
          let shareContent = data.qyName? `[${data.qyName}]`: '';
          shareContent += this.$t('i18n.invitingExam');
          if(_.isWeChatApp()){ // 手机端微信端
            _.checkApi.setDataForWeixinValue(data.examPO.examName, data.logo, shareContent, window.location.href);
          }
          resolve();

        }, (res) => { // 产品说按老版，白色页面显示错误
          let descArr = res.desc.split('，');
          this.errHtml =  descArr.length == 1? `<p class="content_title">${descArr[0]}</p>`:
                          `<p class="content">${descArr[0]}</p><p class="content">${descArr[1]}</p>`
          reject();
        }, false);
      });
    },

    // 请求外部考试详情页数据
    _getExternalExamDetail() {
      return new Promise((resolve, reject) => {
        getExternalExamDetail({examId: this.examId}, data => {
          this.detailData = Object.assign({}, data); // 数据赋值

          // 设置微信分享信息
          let shareContent = data.qyName? `[${data.qyName}]`: '';
          shareContent += this.$t('i18n.invitingExam');
          if(_.isWeChatApp()){ // 手机端微信端
            _.checkApi.setDataForWeixinValue(data.examPO.examName, data.logo, shareContent, window.location.href);
          }
          resolve();

        }, (err) => {
          let length = window.history.length;
          length > 1? this.$router.back(): wx.closeWindow();
          reject();
        });
      });
    },

    // 获取数据
    getData() {
      // 分为内部和外部考试
      return this.isExternal?
        this._getExternalExamDetail().catch(() => {})// 外部考试 获取考试详情页数据
      :
        this._getExaming().then(() => { // 内部考试  获取考试中的数据
          // 开始获取考试详情页数据
          this._getExamDetail().then(() => {
            // 课程完成自动跳转到考试，需要3秒提示。【课程已学完，请开始考试】
              this.showCourseTurnTips && _.tooltips_succeed(this.$t('i18n.finishCourseToExam'), true, '', 3000)
          }).catch(() => {}); // 捕获Promise.reject()
        });


    },

    // 进入考试
    enterExam() {
      if (this.isBannedButton) {return;}

      // 外部考试, 需要进入信息收集页 1为进入考试 0为查询结果
      if (this.isExternal) {
        sessionStorage.setItem('learn_examName', this.examPO.examName); // 在外部考试中取得考试名字
        this.$router.push({name: 'check_information', params: {id: this.examId, status: 1}});
        return;
      }

      // 判断考试是否超过时间，超过则不跳转 || 如果无截止时间，直接跳转
      let lastStartTimeData = this.examPO.lastStartTimeData? this.examPO.lastStartTimeData.replace(/-/g, '/'): '';

      if(lastStartTimeData && Date.now() > Date(lastStartTimeData).getTime()) {
        _.alert(this.$t('i18n.overTips'), '', {
          primaryBtn:{
            name: this.$t('i18n.confirm'),
            callBack() {
              this.$router.back();
            }
          }, // 确认按钮
          defaultBtn:{name:'', callBack: null}//主操作按钮
        });
        return;
      }

      this.$router.push({name: 'exam_write', params: {id: this.examId}});
    },

    // 进入查看结果
    enterResult() {
      // 外部考试, 需要进入信息收集页 1为进入考试 0为查询结果
      if (this.isExternal) {
        sessionStorage.setItem('learn_examName', this.examPO.examName); // 在外部考试中取得考试名字
        this.$router.push({name: 'check_information', params: {id: this.examId, status: 0}});
        return;
      }

      this.$router.push({name: 'exam_result', params: {
        id: this.examId,
        answerId: this.answerVO.id
      }});
    }
  },
  created() {
    this.examId = this.$route.params.id; // 获取当前考试id
    this.isExternal = location.href.includes('open')? true: false; // 判断是否外部考试

    // 获取数据
    this.getData().then(() => {

      // 继续考试剩余时间定时器
      if(!this.examination.handle) {// 当前无定时器时开启
        this.UPDATE_NOWTIME(); // 先更新当前时间在开启循环,避免空档期1s
        let remainingTimer = setInterval(() => {
          this.UPDATE_NOWTIME(); // 1s更新一次当前时间
        }, 1000);

        // 存句柄
        this.SET_CONTINUE_REMAIN({handle: remainingTimer})
      }
    });
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 如果是从课程详情跳转过来的，判断是否自动跳转，
      // 自动跳转需要弹提示【课程已学完，请开始考试】，否则无需操作
      let key = 'learnonline_course_exam_'+ vm.$route.params.id;
      let storage = sessionStorage.getItem(key)
      if (from.name == 'course_detail' && storage) {
        sessionStorage.removeItem(key) // 读取后清除缓存
        vm.showCourseTurnTips = true;
      }
    });
  },
};

</script>

<style lang="scss" scoped>
@import '../../../static/css/mixin.scss';

.qwui-lean_exam_detail {
  min-height: 100vh;
  background: #fff;

  .exam_title {
    margin: 0 0 20px 15px;
    padding-top: 30px;
    font-size: 20px;
    line-height: 20px;
    color: #333;

    .exam_title_content {
      vertical-align: middle;
    }
  }

  .exam_info {

    .exam_info_item {
      padding: 20px 9.2%;

      .ic_common {
        float: left;
        display: inline-block;
        margin-right: 15px;
        width: 30px;
        height: 30px;
        background: url(../../../../../assets/images/ic_exam.png);
        background-size: 60px 60px;
      }
      .ic_totalScore {
        background-position: 0 0;
      }
      .ic_pass {
        background-position: -30px 0;
      }
      .ic_numberOfQuestions {
        background-position: 0 -30px;
      }
      .ic_duration {
        background-position: -30px -30px;
      }

      .info {
        float: left;
        width: 56px;
        text-align: center;

        .info_data {
          margin-bottom: 1px;
          font-size: 26px;
          line-height: 26px;
          color: #666;
        }
        .info_label {
          font-size: 14px;
          color: #B3B3B3;
        }
      }
    }
  }

  .exam_supplement_box {
    margin-left: 15px;
    padding: 25px 0;
    font-size: 15px;
    line-height: 15px;
    @include border-t-1px(#DDD);

    .exam_supplement_last {
      margin-top: 10px;
    }
    .exam_label {
      color: #666;
    }
    .exam_supplement_content {
      margin-left: 12px;
      color: #333;
    }
  }

  .exam_instructions {
    padding: 7px 15px 0 15px;

    .exam_explain {
      padding-bottom: 10px;
      font-size: 16px;
      line-height: 1.5em;
      color: #333;
    }
    .exam_img {
      width: 100%;
      max-width: 100%;
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
      padding: 8px 15px;
      height: 44px;
      line-height: 44px;
      font-size: 17px;
      text-align: center;
      background: #fff;
      cursor: pointer;
      user-select: none;
      @include border-t-1px(#DDD);

      .exam_button {
        color: #fff;
        background: #45A8F5;
        border-radius: 5px;
        cursor: pointer;
      }
      .goon_button {
        background: #f56262;
      }
      .resit_button {
        color: #666;
        line-height: 42px;
        background: #fff;
        border: 1px #878787 solid;
      }
      .ban_button {
        background: #ccc;
      }

      .result_button {
        color: #45a8f5;
        border: 1px #45a8f5 solid;
        border-radius: 5px;
        cursor: pointer;
      }
      .moreButton {
        margin-right: 14px;
      }
    }
  }

  .no_data {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: #fff;

    .no_data_content {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
      line-height: 20px;
      text-align: center;

      .icon_lock {
        display: inline-block;
        width: 130px;
        height: 130px;
        background: url('../../../../../assets/images/icon_noContent.png') -512px center no-repeat;
        background-size: cover;
      }
      & /deep/ .content_title {
        font-size: 20px;
        color: #666;
      }
      & /deep/ .content:last-of-type {
        margin-top: 10px;
      }
    }
  }
}

</style>
