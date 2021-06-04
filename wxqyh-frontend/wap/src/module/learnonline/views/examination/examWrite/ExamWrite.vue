<template>
  <div class="wrap qwui-lean_exam_write">
    <!-- 答题卡部分 -->
    <write-answer-card
      v-show="!showWrite"
      :examData="examData"
      :remainingTime="remainingTime"
      :remainingTimeShow="remainingTimeShow"
      @handOver="handOver"
      @showWrite="listernAnswerCard"
    ></write-answer-card>


    <!-- 答案填写操作部分 -->
    <write-operation
      v-if="qusetionlist"
      v-show="showWrite"
      :nowIndex.sync="nowIndex"
      :questionList="qusetionlist"
      :remainingTime="remainingTime"
      :remainingTimeShow="remainingTimeShow"
      @operation="listenFromOperation"
      @saveCache="saveCache"
    ></write-operation>

    <!--无法进入该考试组件-->
    <div class="exam_noRecord"
         v-show="!allowAnswer">
      <no-record :setTop="false"
                 :hasRecord="recordData"
      >
        <div slot="tip" v-if="examDevice == 3">
          <p class="qwui-no_record_text">
            <span class="no_record_txt" ref="copyEle">https:qy.do1.com.cn/web</span>
            <span class="no_record_copy" @click="copyText">
              {{ $t('i18n.copy') }}
            </span>
          </p>
      </div>
        <div slot="tip" v-if="examDevice == 5">
          <span class="no_record_openTag" @click="openNewTag">点击打开</span>
        </div>
      </no-record>
    </div>

  </div>
</template>

<script>
import { mapState, mapMutations} from 'vuex';
import { getExamQuestion, getAnswerTime, postAnswerCache,
  handOverAnswer ,getExamQuestionExternal, postAnswerCacheExternal, handOverAnswerExternal, hasLogin, postExamDisorder, postExamDisorderExternal} from '../../../api/getData'; // 请求接口
import NoRecord from '@/components/base/noRecord';
import WriteAnswerCard from './WriteAnswerCard'; // 答题卡组件
import WriteOperation from './WriteOperation'; // 答题操作组件
export default {
  name: 'QwExamWrite',
  components: {
    NoRecord,
    WriteAnswerCard,
    WriteOperation,
  },
  data() {
    return {
      isAlertAllHide: true, /* 温馨提醒的alert框是否全部消失 */
      hasLoginTime: '',/* 轮询查看是否登录该场考试 */
      examDevice: '',/* 该场考试所设置的设备，后台参数返回 */
      allowAnswer: true,/* 根据考试设备限制来决定此时是否可以进入考试，默认是可以进入 */
      recordData: {},
      recordDataArray: [
        {
          icon: "noRecord_pc",
          title: "本场考试仅允许在PC端答题",
          text: "请到微信或企业微信的PC端答题",
        },
        {
          icon: "noRecord_app",
          title: "本场考试仅允许在应用端答题",
          text: "请到微信或企业微信的应用端答题",
        },
        {
          icon: "noRecord_web",
          title: "本场考试仅允许在个人网页版答题",
          text: "请到企微云个人网页版答题，地址：",
        },
        {
          icon: "noRecord_fullScreen",
          title: "请最大化当前窗口，否则无法进入考试",
          text: "点击页面窗口最大化按钮，然后重新进入考试",
        },
        {
          icon: "noRecord_tag",
          title: "请在新打开的标签页中开始考试",
        },
        {
          icon: "noRecord_hasLogin",
          title: "无法进入",
          text: "您已在其他地方登录，且已进入考试",
        }
      ],

      /* 数据项 */
      examId: '', // 当前考试的id
      isExternal: false, // 是否外部考试
      isManual: false, // 是否人工阅卷

      examData: {}, // 答题页数据，请求后赋值
      nowIndex: 0, // 当前题目下标
      showWrite: true, // 切换显示填写页或答题卡，默认填写页
      handOverLock: false, // 交卷锁，避免重复交卷请求
      cherkTimeLock: false, // 核对时间锁， 避免重复请求
      secondAdd: 0, // 剩余时间倒计时自增变量
      isTimeAutoHand: false, // 目前是否在自动交卷3s期间
      timeHandle: 0, // 倒计时句柄
      cacheHandle: 0, // 缓存句柄，5分钟自动缓存一次（点击下一题页会缓存
      nowHandTimes: 0, // 当前交卷次数
      maxHandTimes: 2, // 最大交卷次数
      disorderSort: '', // 乱序后题序,|分隔开
      /* 考生写的数据是存在
      examData.qusetionlist.questionList.examineeAnswer*/

    }
  },
  computed: {
    ...mapState([
      'examination'
    ]),
    answerId() { // 答卷的id
      let examData = this.examData;
      return this.isExternal? this.$route.params.answerId: examData.answerPO && examData.answerPO.id;
    },
    qusetionlist() {
      return this.examData.qusetionlist;
    },
    examPO() {
      return this.examData.examPO;
    },
    // 结果页路由
    resultRoute() {
      return this.isExternal?
              {name: 'open_exam_result', params: {id: this.examId, answerId: this.answerId}}:
              {name: 'exam_result', params: {id: this.examId, answerId: this.answerId}};
    },
    // 缓存的数据
    cacheData() {
      let answerData = {};
      let qusetionlist = this.qusetionlist || [];
      let length = qusetionlist.length;

      for (let i = 0; i < length; i++) {
        let nowQuestion = qusetionlist[i];
        let examineeAnswer = nowQuestion.examineeAnswer;
        let questionType = nowQuestion.questionType;

        let hasAnswer = nowQuestion.hasAnswer;

        if (hasAnswer) { // 有答案的才记录缓存
          // 0:判断题；1:单选题；2:多选题；3:问答题；4:填空题
          let name, answer;
          if (questionType == 0 || questionType == 1) { //  0:判断题；1:单选题
            name = 'searchValue.radio_' + nowQuestion.questionId;
            answer = examineeAnswer.join('');

          } else if( questionType == 2) { // 多选题
            name = 'searchValue.select_' + nowQuestion.questionId;
            answer = examineeAnswer.join(',');

          } else if( questionType == 3) { // 问答题

            if (examineeAnswer.imgList.length) { // 有图片
              name = 'searchValue.imageUrls_' + nowQuestion.questionId;
              answer = examineeAnswer.imgList.map((item) => {
                return item.src;
              }).join('|');

              answerData[name] = answer;
            }

            name = ''; // 图片有的话已经提前赋值了，接下来只要判断是否有文字即可

            // 如果仅有图片，用户没写文字，需要在文字内写上【图片】
            if (examineeAnswer.content || answer) { // 有文字答案 或者 有图片
              name = 'searchValue.comment_' + nowQuestion.questionId;
              answer = examineeAnswer.content.trim()? examineeAnswer.content: '【图片】'; // 用户无答案则写上这个
            }

          } else { // 填空题
            name = 'searchValue.fill_' + nowQuestion.questionId;
            let fillArr = examineeAnswer.concat();
            for (let j = 0; j < fillArr.length; j++) {
              fillArr[j] = fillArr[j]? fillArr[j]: ' '; // 无答案要补空格
            }
            answer = fillArr.join('|||');
          }

          if (name) { // name才需要赋值
            answerData[name] = answer;
          }
        }
      }

      return {
        currentId: qusetionlist[this.nowIndex].questionId, // 存id用来更改index
        data: answerData // 题目数据，用来还原上次考试答题内容
        // data是按照提交的内容存
        // searchValue.radio_4dfc6007480a486393bb20e29ca00690
      };
    },
    // 答题剩余时间文本处理
    remainingTime() {
      let examPO = this.examPO;
      if (!examPO) {return {time:'', iscloseEnd:false};} // 还未获取到数据

      let answerTime = this.examData.answerTime > 0?parseInt(this.examData.answerTime): 0;
      let hour = Math.floor(answerTime / (60 * 60));
      let minute = Math.floor(answerTime / 60 % 60);
      let second = Math.floor(answerTime % 60);
      if (hour <= 9) hour = '0' + hour;
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;
      let time = `${hour}:${minute}:${second}`;
      let iscloseEnd = answerTime < 300;
      if (time == '00:00:00') {time = '';}
      return {
        time: time,
        iscloseEnd: iscloseEnd,
        timestamp: answerTime
      };
    },
    // 剩余时间展示
    remainingTimeShow() {
      // 仅无限时长，有截止时间，截止时间大于10分钟才隐藏，其他都显示
      return !(this.examPO && this.examPO.duration ==0 && this.remainingTime.timestamp > 600);
    },

  },
  methods:{
    // 读取缓存（初始化）
    readCache() {
      let localdata = JSON.parse(localStorage.getItem('exam_write_' + this.answerId));
      let dataObj = localdata && localdata.data;
      if (!dataObj) { return; } // 无缓存则无需继续

      let qusetionlist = this.qusetionlist;
      // 为对应题型赋值
      for (let key in dataObj) {
        // 问答题图片过滤
        if (key.includes('searchValue.imageUrl')) {continue;}

        let nowId = key.split('_')[1];
        let index = qusetionlist.findIndex((item) => {
          return item.questionId == nowId;
        });
        if (typeof index !== 'number') {continue;}

        let nowQusetion = qusetionlist[index]; // 当前问题
        let nowAnswer = nowQusetion.examineeAnswer; // 当前问题的答案存放
        let cacheAnswer = dataObj[key]; // Location答案数据


        // 赋值开始
        if (key.includes('searchValue.comment')) { // 问答题
          cacheAnswer = cacheAnswer == '【图片】'? '': cacheAnswer; // 去除掉图片
          nowAnswer.content = cacheAnswer;
          nowQusetion.hasAnswer = !!(nowAnswer.content);// 设置为答案有无
        } else {
          let answerArr = cacheAnswer.split(/,|\|\|\|/);
          while(nowAnswer.length) {
            nowAnswer.pop();
          }
          nowAnswer.push.apply(nowAnswer, answerArr);
          nowQusetion.hasAnswer = true; // 设置为有答案
        }
      }

      this.nowIndex = (localdata.currentId && qusetionlist.findIndex((item) => {
        return item.questionId == localdata.currentId;
      })) || 0;
    },

    // 将考生写的内容存缓存
    saveCache() {
      // 开始写入
      // 触发此事件都是脱焦/点击， 此时计算属性还未更新，
      // 因为触发是同步的，数据还未更新，用异步调用可正常更新
      setTimeout(() => {
        localStorage.setItem('exam_write_' + this.answerId, JSON.stringify(this.cacheData));
      }, 10);
    },

    // 清除缓存
    removeCache() {
      localStorage.removeItem('exam_write_' + this.answerId);
    },

    // 答题卡点击监听
    listernAnswerCard(index){
      this.addAnswerCache(); // 点击答题卡也要发送缓存数据，避免用户不点下一题

      if (typeof index === 'number') { // 如果为Number为点击答题卡题号
        // 非按钮进入需要更改当前题号
        this.nowIndex = index;
      }
      this.showWrite = true;
    },

    // 监听解析页组件事件
    listenFromOperation(state) {
      // state  1:下一题  2：功能按钮  3：完成按钮（最后一题）
      if (state == 1) { // 点击下一题
        this.addAnswerCache(); // 提交考生的缓存数据
      } else if (state == 2) {
        this.showWrite = false;
      } else {
        this.handOver();
      }
    },
    // 交卷操作（有弹窗提示
    handOver() {
      let self = this;
      _.alert(this.$t('i18n.notice'), '试卷提交后不可更改，确定要提交吗?', {
        primaryBtn:{ name: this.$t('i18n.confirm'), callBack() {
          self.handOverPost();
        }}, // 确认按钮
        defaultBtn:{name: this.$t('i18n.cancel'), callBack: null}//主操作按钮
      });
    },

    // 获取数据
    getData() {
      // 分为内部和外部考试
      let postPromise = this.isExternal? this._getExamQuestionExternal(): this._getExamQuestion();

      return postPromise.catch((err) => {
        // 如果是页面报错，这里是点弹框确认后的操作 后退
        this.$router.back();
      }).then(() => {
        // 该设备允许考试，则获取数据后，读取缓存
        this.allowAnswer && this.readCache();
      });
    },

    // 请求内部考试答题页数据
    _getExamQuestion() {
      return new Promise((resolve, reject) => {
        getExamQuestion({examId: this.examId, examDevice : this.sendDevice()}, data => {

          // 需要处理玩考试数据, 才继续判断。
          this.processExamData(data).then(() => {

            if(!this.allowAnswer) return;

            // 启动定时缓存功能
            this.cacheHandle && clearInterval(this.cacheHandle)
            this.cacheHandle = setInterval(() => {
              this.addAnswerCache();
            }, 300000); // 5分钟上传一次数据



            //  判断是否启动倒计时句柄，剩余时间
            let duration = data.examPO.duration;
            let answerTime = data.answerTime;
            // 这里理应只判断时长是否有限，有限就开始倒计时，无限时间的剩余时间有截止时间
            if (duration != '0' || (duration == '0' && answerTime != '0')) {
              // 启动倒计时周期事件
              /* 思路 （根据jsp思路改造过来【避免踩坑】）
                 用 secondAdd  来自加，当达到固定秒数，发送核对时间请求（核对后置0）
                 用 answerTime 来自减，用来【显示】，核对时间也是存在这个变量，自减倒计时嘛。
               */
              this.timeHandle && clearInterval(this.timeHandle)
              this.timeHandle = setInterval(() => {
                ++this.secondAdd; // 用来记录是否到固定秒数
                --this.examData.answerTime; // 剩余时间自减
                let examPO = this.examPO;
                let answerTime = parseInt(this.examData.answerTime);
                let duration = examPO.duration;
                let secondAdd = this.secondAdd;

                if(duration == '0' && answerTime <= 600){
                  // 无限时长，剩余时间小于10分钟 60s核对一次
                  secondAdd > 60 && this._getAnswerTime();
                }

                if (answerTime <= 300) {
                  // 剩余时间小于5分钟20s核对一次
                  secondAdd > 20 && this._getAnswerTime();
                }

                /*
                  上面这两个if在正常请求下并不会同时触发
                  【网速很慢，请求40s才同时触发，同时触发也没事，有请求锁】
                  duration == '0' && answerTime <= 600 这种情况原jsp有，
                  保险起见保留，只为了兼容多个情况，并不会影响原有逻辑。
                  在有限时间情况下，只有在5分钟内20s验证一次。
                 */

                // 考试时间完, 交卷
                if (answerTime <= 0 && !this.handOverLock) {
                  this.isTimeAutoHand = true;
                  this.handOverPost(); // 交卷

                  clearInterval(this.timeHandle);
                }

              }, 1000);
            }

            resolve();
          });
        }, reject);
      });
    },
    // 请求外部考试答题页数据
    _getExamQuestionExternal() {
      return new Promise((resolve, reject) => {
        getExamQuestionExternal({
          examId: this.examId,
          answerId: this.answerId
        }, data => {

          // 处理考试数据
          this.processExamData(data);

          // 启动定时缓存功能
          let self = this;
          this.cacheHandle && clearInterval(this.cacheHandle)
          this.cacheHandle = setInterval(() => {
            self.addAnswerCache();
          }, 300000); // 5分钟上传一次数据

          //  判断是否启动倒计时句柄，剩余时间
          let duration = data.examPO.duration;
          let answerTime = data.answerTime;
          // 这里理应只判断时长是否有限，有限就开始倒计时，但原逻辑还是多个无限时间的剩余时间判断段duration == '0' && answerTime != '0'
          // 这里保险起见保留，只为了兼容多个情况，并不会影响原有逻辑。
          if (duration != '0' || (duration == '0' && answerTime != '0')) {
            // 启动倒计时周期事件
            /* 思路 （根据jsp思路改造过来【避免踩坑】）
               用 secondAdd  来自加，当达到固定秒数，发送核对时间请求（核对后置0）
               用 answerTime 来自减，用来【显示】，核对时间也是存在这个变量，自减倒计时嘛。
             */
            this.timeHandle && clearInterval(this.timeHandle)
            this.timeHandle = setInterval(() => {
              --self.examData.answerTime; // 剩余时间自减
              let examPO = self.examPO;
              let answerTime = parseInt(self.examData.answerTime);
              let duration = examPO.duration;
              let secondAdd = self.secondAdd;
              // 在倒数2、3、5分钟时缓存数据
              if (answerTime == 120 || answerTime == 180 || answerTime == 300) {
                self.addAnswerCache(); // 缓存数据
              }
              // 考试时间完, 交卷
              if (answerTime <= 0 && !self.handOverLock) {
                self.isTimeAutoHand = true;
                self.handOverPost(); // 交卷

                _.showLoading('考试结束，正在交卷中....')
                clearInterval(self.timeHandle);
              }

            }, 1000);
          }

          resolve();
        }, reject);
      });
    },

    //识别当前进入该场考试的是什么设备
    sendDevice() {
      if(_.isMobileApp()) {  /** 应用端 **/
        return 2;
      }else if(_.isQiyeweixin() || _.isWeChat()) { /** 桌面版 **/
        return  1;
      }else {
        return 3;
      }
    },

    //判断此时的设备是否可以进去考试，传参0表示无限制、1表示只允许在PC端答题、2表示只允许在应用端答题、3表示只允许在个人网页版答题
    differDevice(device) {
      switch(device)
      {
        case 1:
          return !_.isMobileApp() && (_.isQiyeweixin() || _.isWeChat());
          break;
        case 2:
          return _.isMobileApp();
          break;
        case 3:
          return !_.isMobileApp() && !(_.isQiyeweixin() || _.isWeChat());
          break;
        default:
          return true;
      }
    },
    copyText() {
      const range = document.createRange();
      range.selectNode(this.$refs.copyEle);
      const selection = window.getSelection();
      if(selection.rangeCount > 0) selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand('copy');
      _.tooltips_succeed("复制成功", true, '');
    },
    //假如开启全屏才能考试规则则进入该函数
    isEnterScreen(examExtPO) {
      //屏幕可用工作区宽度
      let screenWidth = window.top.screen.availWidth;
      //屏幕可用工作区高度
      let screenHeight = window.top.screen.availHeight;
      //网页宽度的总宽度,在f11进入全屏后该值小于screenWidth
      let winWidth = window.top.outerWidth;
      //网页可见区域高,在f11进入全屏后该值大于screenHeight
      let winHeight = window.top.outerHeight;
      //判断不是全屏的条件
      if(winWidth < screenWidth*0.8 || winHeight < screenHeight*0.8) {
        examExtPO.examDevice = 4;
        this.allowAnswer = false;
        this.examDevice = 4;
      }
    },
    //全屏考试的温馨提示
    alertFullScreenTip(maxModel, allowCopy) {
      let self = this;
      if(maxModel != null) {
        _.alert(this.$t('i18n.warmNotice'), '在考试过程中只允许页面窗口最大化，缩小窗口超过｛'+ maxModel +'｝次将自动交卷，请认真作答！', {
          primaryBtn:{ name: this.$t('i18n.konw'), callBack() {
            self.alertNoCopyTip(allowCopy);
          }}, // 确认按钮
          defaultBtn:{name: '', callBack: null}//主操作按钮
        });
      }else if(allowCopy) {
        this.alertNoCopyTip(allowCopy);
      }else {
        this.isAlertAllHide = true;
      }
    },
    //禁止复制的温馨提示
    alertNoCopyTip(allowCopy) {
      let self = this;
      if(allowCopy) {
        _.alert(this.$t('i18n.warmNotice'), '考试不允许复制、粘贴、剪切，请认真作答！', {
          primaryBtn:{ name: this.$t('i18n.konw'), callBack() {
            self.isAlertAllHide = true;
          }}, // 确认按钮
          defaultBtn:{name: '', callBack: null}//主操作按钮
        });
      }else {
        this.isAlertAllHide = true;
      }
    },
    //个人网页版版答题时进入该函数
    banCheat(switchTimes, maxModel, allowCopy) {
      let self = this;
      if(switchTimes != null){
        //温馨提示
        this.isAlertAllHide = false;
        _.alert(this.$t('i18n.warmNotice'), '在考试过程中不允许切换离开当前考试页面，超过｛'+ switchTimes +'｝次将自动交卷，请认真作答！', {
          primaryBtn:{ name: this.$t('i18n.konw'), callBack() {
            self.alertFullScreenTip(maxModel, allowCopy);
          }}, // 确认按钮
          defaultBtn:{name: '', callBack: null}//主操作按钮
        });
        let switchNum = 0;//人为切屏的次数
        let isAlertShow = false;//是否把弹窗关闭
        //页面初始化,顶层window自动聚焦
        window.focus();
        window.addEventListener("blur", () => {
          if(this.isAlertAllHide) {
            !isAlertShow && switchNum++;
            isAlertShow = true;
            _.alert(this.$t('i18n.seriousNotic'), '您已切换窗口 '+ switchNum +' 次，超过 '+ switchTimes +' 次系统将自动交卷，请认真作答', {
              primaryBtn:{ name: this.$t('i18n.konw'), callBack() {
                isAlertShow = false;
              }}, // 确认按钮
              defaultBtn:{name: '', callBack: null}//主操作按钮
            });
            if(switchNum > switchTimes){
              let self = this;
              _.alert(this.$t('i18n.seriousNotic'), '您已切换离开考试页面｛'+ switchNum +'｝次，系统已自动交卷。', {
                primaryBtn:{ name: this.$t('i18n.konw'), callBack() {
                    self.handOverPost();
                  }}, // 确认按钮
                defaultBtn:{name: '', callBack: null}//主操作按钮
              })
            }
          }
        });
      }
      if(maxModel != null){
        if(switchTimes == null) {
          this.isAlertAllHide = false;
          this.alertFullScreenTip(maxModel, allowCopy);
        }
        let winWidth, winHeight,
            self = this,
            //人为退出全屏次数
            exitFullScreen = 0,
            //resise事件触发时上一次是否是全屏
            isFullScreen = true,
            //屏幕可用工作区宽度
            screenWidth = window.top.screen.availWidth,
            //屏幕可用工作区高度
            screenHeight = window.top.screen.availHeight,
            //弹框是否存在
            isAlertShow = false;
        window.top.addEventListener('resize', () => {
          if(this.isAlertAllHide) {
            //网页宽度的总宽度,在f11进入全屏后该值小于screenWidth
            winWidth = window.top.outerWidth;
            //网页可见区域高,在f11进入全屏后该值大于screenHeight
            winHeight = window.top.outerHeight;
            if(winWidth < screenWidth*0.95 || winHeight < screenHeight) {
              !isAlertShow && isFullScreen && exitFullScreen++;
              isAlertShow = true;
              if(isFullScreen) {
                if(exitFullScreen <= maxModel) {
                  _.alert('强制交卷提醒', '您已缩小窗口 '+ exitFullScreen +' 次，超过 '+ maxModel +' 次系统将自动交卷，请认真作答', {
                    primaryBtn:{ name: this.$t('i18n.konw'), callBack() {
                        isAlertShow = false;
                    }},
                    defaultBtn:{name: '', callBack: null}
                  });
                }else {
                  _.alert(this.$t('i18n.seriousNotic'), '您已缩小窗口｛'+ exitFullScreen +'｝次，系统已自动交卷。', {
                    primaryBtn:{ name: this.$t('i18n.konw'), callBack() {
                        self.handOverPost();
                    }},
                    defaultBtn:{name: '', callBack: null}
                  });
                }
              }
              isFullScreen = false
            }else {
              isFullScreen = true;
            }
          }
        });
      }
      if(allowCopy){
        if(switchTimes == null && maxModel == null) {
          this.isAlertAllHide = false;
          this.alertNoCopyTip(allowCopy);
        }
        ["oncontextmenu", "onpaste", "oncopy", "oncut", "onselectstart"].forEach(item => {
          document[item] = new Function("event.returnValue=false");
        });
        ["paste", "copy", "cut"].forEach(item => {
          document.addEventListener(item, () => {
            this.isAlertAllHide && _.alert(this.$t('i18n.warmNotice'),  '考试不允许复制、粘贴、剪切，请认真作答！', {
              primaryBtn:{ name: this.$t('i18n.konw'), callBack: null}, // 确认按钮
              defaultBtn:{name: '', callBack: null}//主操作按钮
            })
          })
        });
      }
    },
    //判断是否登录该页面
    hasLogin(examExtPO, answerId) {
      return new Promise((resolve, reject) => {
        hasLogin({ answerId }, data => {
          if(data.hasLogin) {
            examExtPO.examDevice = 6;
            this.allowAnswer = false;
            this.examDevice = 6;
          }else {
            this.hasLoginTime = setInterval(() => {
              hasLogin({ answerId }, () => {});
            }, 60000);
          }
          resolve();
        })
      })
    },
    //打开一个新标签
    openNewTag() {
      window.top.open(_.baseURL+"/vp/module/learnonline.html?corp_id=&agentCode=learnonline#/examWrite/"+this.examId, 'newwindow');
    },

    // 处理答题页数据
    processExamData(data) {
      // 将题目整合成一个数组, 并替换掉原来的结构
      let qusetionlist = data.qusetionlist;
      let qusetionlistLength = qusetionlist && qusetionlist.length;
      let questionArr = [];
      let examPO = data.examPO;
      let examExtPO = data.examExtPO;
      let isReorder = examPO && examPO.isReorder; // 题乱序
      let disOrder = examExtPO && examExtPO.disOrder; // 仅在题型内乱序
      let answerId = data.answerPO && data.answerPO.id;
      let hasLoginPromise = new Promise((resolve, reject) => {
        resolve();
      })

      this.examDevice = examExtPO && examExtPO.examDevice;
      //判断设备是否符合
      this.allowAnswer = this.differDevice(examExtPO.examDevice);
      //继续判断页面是否有最大化
      this.allowAnswer && examExtPO.maxModel != null && this.isEnterScreen(examExtPO);
      //继续判断是否已登录
      if(this.allowAnswer && examExtPO.examDevice == 3) {
        hasLoginPromise = this.hasLogin(examExtPO, answerId);
      }

      // 这里需要将此Promise返回，因为处理数据需要同步进行，
      // 此处不返回，会使请求数据在未处理完的情况下，异步执行接下去的代码
      // 导致answerId未定义
      return hasLoginPromise.then(() => {
        //显示缺省页
        if(examExtPO.examDevice && !this.allowAnswer) this.recordData = Object.assign({}, this.recordDataArray[examExtPO.examDevice-1]);
        //设备不符合或者设置了最大化然而并没有最大化，不再继续往下执行
        if(!this.allowAnswer) return;
        //继续判断是不是顶层iframe，有没有设置窗口切换作弊或者缩小窗口作弊规则,全部满足的话打开一个新的标签页，选择缺省页，然后不再往下执行
        if(window.self !=  window.top && this.allowAnswer && (examExtPO.maxModel != null || examExtPO.switchTimes != null)){
          //显示请在新打开的标签页中考试的缺省页
          if(examExtPO.examDevice) this.recordData = Object.assign({}, this.recordDataArray[4]);
          // 不再继续往下执行
          this.allowAnswer = false;
          this.examDevice = 5;
          return;
        }else {
          //设置防作弊规则
          this.allowAnswer && this.banCheat(examExtPO.switchTimes, examExtPO.maxModel, examExtPO.allowCopy);
        }

        for (let i = 0; i < qusetionlistLength; i++) {
          let nowList = qusetionlist[i].questionList;

          // 如果需要乱序
          if (isReorder) {
            nowList = nowList.slice(0).sort(() => {return 0.5 - Math.random();});
          }
          questionArr.push.apply(questionArr, nowList);
        }

      // 如果非题型内乱序，则全部打乱
      if (isReorder) {
        if (!disOrder) { // 非题型内乱序 再打乱一波
          questionArr.sort(() => {return 0.5 - Math.random();});
        }

        // 赋值乱序完题序
        this.disorderSort = questionArr.map(item => item.questionId).join('|');
        // 有乱序，提交题序给服务器
        this.addExamDisorder(data.answerPO.id);
      }

      data.qusetionlist = questionArr;


        // 为每个qusetionlist增加examineeAnswer字段，
        // 用来存考生答案
        qusetionlist = data.qusetionlist;
        qusetionlistLength = qusetionlist.length
        for (let i = 0; i < qusetionlistLength; i++) {
          let nowQusetion = qusetionlist[i];
          let questionType = nowQusetion.questionType;
          // 判断是否需要人工阅卷
          if (questionType == 3 || questionType == 4){
            if (nowQusetion.isManual == 1) {
              this.isManual = true;
            }
          }

          // 如果是填空题，需要计算填空数量
          let strArr = []; // 用来填空题绑定考生答案
          if (questionType == 4) {
            let content = nowQusetion.content;
            let strArrLength = content.match(/\_+/g).length; // 填空项目数量

            for (let j = 0; j < strArrLength; j++) {
              strArr.push('');
            }
          }


          // 0:判断题；1:单选题；2:多选题；3:问答题；4:填空题
          nowQusetion.examineeAnswer =  questionType == 3? {content: '', imgList: []}:
                                        questionType == 4?
                                          strArr: [];
          nowQusetion.hasAnswer = false; // 用来记录考生是否答题了
          nowQusetion.photoSet = examPO.photoSet; // 允许通过手机相册上传图片
          if (questionType == 3) {
            nowQusetion.lastPicPath = ''; // 记录问答题上传图片最后上传的那张地址
            nowQusetion.lastImgLength = 0; // 用来记录上次上传图片数量
          }
          /* 新增数据
            examineeAnswer: 存考生答案
            // 填空题是['',''] 问答题是：{content: '', imgList: []}
            hasAnswer: 考生是否答题了，根据examineeAnswer响应改变
            photoSet: 1是 0否  允许通过手机相册上传图片
            lastPicPath: 问答题存最后一张上传图片地址，适应公共组件的异题同图课传
            lastImgLength: 问答题记录上次上传图片数量
           */
        }

        this.examData = Object.assign({}, data); // 数据赋值
      });

    },

    // 提交乱序题序【自动判断内外部调用提交乱序】
    addExamDisorder(answerId) {
      // 外部用this.answerId即可，在路由取的，内部因为此时还未赋值，需要从data抽取
      return this.isExternal? this._postExamDisorderExternal(): this._postExamDisorder(answerId);
    },
    // 内部提交乱序题序
    _postExamDisorder(answerId) {
      return new Promise((resolve, reject) => {
        postExamDisorder({
          answerId: answerId,
          sort: this.disorderSort
        }, data => {
          resolve();
        }, reject);
      });
    },
    // 外部提交乱序题序
    _postExamDisorderExternal() {
      return new Promise((resolve, reject) => {
        postExamDisorderExternal({
          answerId: this.answerId,
          sort: this.disorderSort
        }, data => {
          resolve();
        }, reject);
      });
    },

    // 内部获取答题剩余时间
    _getAnswerTime() {
      if (this.cherkTimeLock) {
        return; // 有请求了，过滤多余请求
      } else {
        this.cherkTimeLock = true;
      }
      return new Promise((resolve, reject) => {
        getAnswerTime({answerId: this.answerId, examId: this.examId}, data => {
          this.examData.answerTime = data.answerTime; // 根据服务器返回核对下剩余时间
          this.secondAdd = 0; // 5分钟内20s核对一次
          this.cherkTimeLock = false;

          resolve();
        }, reject);
      });
    },

    // 提交考生缓存答案【自动判断内外部调用缓存接口】
    addAnswerCache() {
      return this.isExternal? this._postAnswerCacheExternal(): this._postAnswerCache();
    },
    // 内部提交考生缓存答案
    _postAnswerCache() {
      return new Promise((resolve, reject) => {
        postAnswerCache(Object.assign({
          examId: this.examId,
          answerId: this.answerId}, this.cacheData.data)
        , data => {
          resolve();
        }, reject);
      });
    },
    // 外部提交考生缓存答案
    _postAnswerCacheExternal() {
      return new Promise((resolve, reject) => {
        postAnswerCacheExternal(Object.assign({
          examId: this.examId,
          answerId: this.answerId}, this.cacheData.data)
        , data => {
          resolve();
        }, reject);
      });
    },


    // 交卷请求【自动判断内外部调用缓存接口】
    handOverPost() {
      return this.isExternal? this._handOverAnswerExternal(): this._handOverAnswer();
    },
    // 内部交卷请求
    _handOverAnswer() {
      if (this.handOverLock) {
        return; // 有请求了，过滤多余请求
      } else {
        this.handOverLock = true;
      }
      return new Promise((resolve, reject) => {
        handOverAnswer(Object.assign({
          examId: this.examId,
          answerId: this.answerId,
          sort: this.disorderSort}, this.cacheData.data)
        , data => {

          // 交卷成功后 清除缓存
          this.removeCache();

          if (this.isTimeAutoHand) { // 自动交卷, 延迟2.5秒再跳转
            let self = this;
            _.showLoading('考试结束，正在交卷中....'); //自动交卷提示
            setTimeout(() => {
              _.hideLoading(''); // 隐藏自动交卷loading,
              self.isTimeAutoHand = false;
              self.handOverLock = false;
              self.autoHandTurn(data); // 开始跳转对应链接
            }, 3000)
          } else {
            this.handOverLock = false;
            this.autoHandTurn(data); // 开始跳转对应链接
          }
          resolve();
        }, (err) => {
          if (err.code == "350013") {
            this.$router.replace({name: 'exam_result', params: {id: this.examId, answerId: this.answerId}});

          } else {
            this.handOverLock = false;

            // 提交次数超过，不再重新提交
            ++this.nowHandTimes;
            if (this.nowHandTimes >= this.maxHandTimes) {return;}

            this._handOverAnswer(); // 重新交卷
          }
        });
      });
    },
    // 外部交卷请求
    _handOverAnswerExternal() {
      if (this.handOverLock) {
        return; // 有请求了，过滤多余请求
      } else {
        this.handOverLock = true;
      }
      return new Promise((resolve, reject) => {
        handOverAnswerExternal(Object.assign({
          examId: this.examId,
          answerId: this.answerId,
          sort: this.disorderSort}, this.cacheData.data)
        , data => {

          // 交卷成功后 清除缓存
          this.removeCache();

          if (this.isTimeAutoHand) { // 自动交卷, 延迟2.5秒再跳转
            let self = this;
            _.showLoading('考试结束，正在交卷中....'); //自动交卷提示
            setTimeout(() => {
              _.hideLoading(''); // 隐藏自动交卷loading,
              self.isTimeAutoHand = false;
              self.handOverLock = false;
              self.autoHandTurn(data); // 开始跳转对应链接，外部考试则弹窗提示
            }, 2500)
          } else {
            this.handOverLock = false;
            this.autoHandTurn(data); // 开始跳转对应链接，外部考试则弹窗提示
          }
          resolve();
        }, (err) => {
          if (err.code == "350013") {
            this.$router.replace({name: 'open_exam_result', params: {id: this.examId, answerId: this.answerId}});

          } else {
            this.handOverLock = false;

            // 提交次数超过，不再重新提交
            ++this.nowHandTimes;
            if (this.nowHandTimes >= this.maxHandTimes) {return;}

            this._handOverAnswerExternal(); // 重新交卷
          }
        });
      });
    },

    // 自动交卷后的跳转判断
    autoHandTurn() {
      if (this.isManual) {
        // 外部只要弹出提示，并返回详情页
        if (this.isExternal) { // 外部考试跳转考试详情页
          let self = this;
          _.alert(this.$t('i18n.notice'), '已完成考试，等待阅卷...', {
            primaryBtn:{ name: this.$t('i18n.confirm'), callBack() {
              self.$router.replace({name: 'open_exam_detail', params: {id: self.examId}});

            }}, // 确认按钮
            defaultBtn:{name: '', callBack: null}//主操作按钮
          });

        } else { // 内部跳转阅卷结果页
          this.$router.replace({name: 'marking_result'});
        }
      }else {
        // 无需阅卷则跳转到对应结果页
        this.$router.replace(this.resultRoute); // 计算属性自动判断内外部
      }
    },

  },
  created() {

    this.examId = this.$route.params.id; // 获取当前考试id
    this.isExternal = location.hash.includes('open')? true: false; // 判断是否外部考试

    // 开始请求数据
    this.getData();
  },
  beforeRouteLeave (to, from, next) {
    // 组件离开前清除禁止考生复制、粘贴、剪切事件
    ["oncontextmenu", "onpaste", "oncopy", "oncut", "onselectstart"].forEach(item => {
      document[item] = new Function("event.returnValue=true");
    });
    this.hasLoginTime && clearInterval(this.hasLoginTime); //销毁轮询请求是否已登录接口的定时器
    next();
  },
  beforeDestroy() {
     this.timeHandle && clearInterval(this.timeHandle) // 销毁剩余时间句柄
     this.cacheHandle && clearInterval(this.cacheHandle) // 销毁定时自动提交句柄
  },
};

</script>

<style lang="scss" scoped>

.qwui-lean_exam_write {
 .exam_noRecord {
   height: 100vh;
   width: 100%;
   background-color: #fff;
   /deep/ .qwui-no_record_box {
     margin-top: 0;
     transform: translateY(-50%);
     -webkit-transform: translateY(-50%);
     .qwui-no_record_title {
       color: #0A1735;
     }
     .qwui-no_record_text {
       color: #B2B9C8;
       .no_record_txt {
         -webkit-tap-highlight-color:transparent;
       }
       .no_record_copy {
         margin-left: 8px;
         color: #5585F0;
         cursor: pointer;
         -webkit-tap-highlight-color: transparent;
       }
     }
     .no_record_openTag {
       display: inline-block;
       margin-top: 10px;
       font-size: 18px;
       color: #5585F0;
       cursor: pointer;
     }
     .noRecord_pc {
       width: 220px;
       height: 160px;
       background: url(~assets/images/exam_usePc.png) center/contain no-repeat;
     }
     .noRecord_app {
       width: 220px;
       height: 160px;
       background: url(~assets/images/exam_useApp.png) center/contain no-repeat;
     }
     .noRecord_web {
       width: 220px;
       height: 160px;
       background: url(~assets/images/exam_useWeb.png) center/contain no-repeat;
     }
     .noRecord_fullScreen {
       width: 220px;
       height: 160px;
       background: url(~assets/images/exam_fullScreen.png) center/contain no-repeat;
     }
     .noRecord_tag {
       width: 220px;
       height: 160px;
       background: url(~assets/images/exam_useTag.png) center/contain no-repeat;
     }
     .noRecord_hasLogin {
       width: 220px;
       height: 160px;
       background: url(~assets/images/exam_hasLogin.png) center/contain no-repeat;
     }
   }
 }
}

</style>
