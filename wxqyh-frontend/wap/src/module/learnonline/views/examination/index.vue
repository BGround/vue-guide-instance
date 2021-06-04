<template>
  <div class="wrap qwui-learn_examination">
    <!-- 顶部 -->
    <header class="qwui-tips fixed_set_top">
      <div class="top_tips" v-if="showExamTaking" @click="enterExamTaking">
        <span class="qwui-flexItem">
          {{$t('i18n.examingTips')}}
        </span>
        <i class="qwui-icon_arrow_fr"></i>
      </div>

      <!--tab选项卡-->
      <nav-tabs
        class="qwui-check_nav"
        v-bind="selectData"
        @listenNavTabs="listenFromNavTab"
      ></nav-tabs>

      <!-- 阅卷提示 -->
      <div class="top_tips marking_tips" v-if="markingTip.show">
        {{$t('i18n.markingTips') + markingTip.score + $t('i18n.markingTipsAnd')}}
      </div>
    </header>


    <!-- 内容区域 -->
    <div v-show="!comHasRecord.show" class="examination_content" :style="fillFixed">
      <!-- 考试 -->
      <div v-show="nowNavIndex==0" class="content_exam">
        <!-- 考试题目循环 -->
        <exam
          v-for="(item,index) in examPageData.pageData"
          :item="item"
          :nowTimeStamp="examination.nowTimeStamp"
          :key="index"
          @inHand="inHand"
        ></exam>
      </div>

      <!-- 练习 -->
      <div v-show="nowNavIndex==1" class="content_practice">
        <!-- 练习题目循环 -->
        <practice
          v-for="(item,index) in practicePageData.pageData"
          v-bind="item"
          :key="index"
        ></practice>
      </div>

      <!-- 阅卷 -->
      <div v-show="nowNavIndex==2 && answer.examName" class="content_marking">
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
    </div>

    <!-- 加载更多组件 -->
    <div v-show="loadMoreShow">
      <load-more
        :loading="nowContentData.loading"
        :maxPage="nowContentData.maxPage"
        :currPage="nowContentData.currPage"
        :borderTop=false
        colorType="transparent"
        @loadMoreClick="loadMoreList"
      >
        <span>{{$t('i18n.nomore')}}</span>
      </load-more>
    </div>

    <!-- 无数据提示 -->
    <no-record
      :hasrecord="comHasRecord"
    ></no-record>

    <!-- 前往后台提示 -->
    <div class="dialog_mask" v-if="dialogShow">
      <div class="dialog_mask_box">
        <div class="dialog_mask_head">{{$t('i18n.createTestTips')}}</div>
        <div class="dialog_mask_content add_border_bottom">{{$t('i18n.phoneTips')}}</div>
        <div class="dialog_mask_content"><p>{{$t('i18n.loginBackground')}}</p><p>https://work.weixin.qq.com/login</p></div>
        <div class="dialog_mask_button" @click="dialogMaskClick">{{$t('i18n.iKnow')}}</div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import NavTabs from '@/components/base/nav_tabs'; // nav组件
import NoRecord from '@/components/base/no_record'; // 暂无数据组件
import LoadMore from '@/components/list/load_more'; // 加载更多组件
import PreviewImages from "@/components/base/previewImages"; // 图片预览组件
import { getInitExam, getRedPoint, getIsRemind, closeGuideDialog, searchExamCount as getExaming, searchExam as getExam, searchPractice as getPractice, getMarkingAnswer, appraiseAnswer} from "../../api/getData"; // 请求接口
import { newDateObj } from '../../../../assets/js/time-util'; // 兼容ios时间
import Exam from '../../components/examination/Exam'; // 考试组件(以时间为单位)
import Practice from './index/Practice'; // 练习组件
import Marking from '../../components/examination/Marking'; // 阅卷组件
export default {
  name: 'QwExamination',
  components:{
    NavTabs,
    NoRecord,
    LoadMore,
    PreviewImages,
    Exam,
    Practice,
    Marking,
  },
  data() {
    return {
      /* 公共组件配置项 */
      // 加载更多显示
      loadMoreShow: false,

      // nav栏
      selectData: {
        tabs: [  //@data：点击切换传递的数据
          {text: this.$t('i18n.test'), num: 0},
          {text: this.$t('i18n.practice'), num: 0},
          {text: this.$t('i18n.marking'), num: 0}
        ],
        activeIndex: 0,
        useBadge: true, // 开启数字显示
      },

      // 无数据设置
      hasRecord: {
        common: {
          show: false,
          setTop: true,
        },
        exam: {
          icon: 'icon_search_noCourse',
          title: this.$t('i18n.examNoExam'),
          text: this.$t('i18n.examNoExamTips'),
        },
        practice: {
          icon: 'icon_search_noCourse',
          title: this.$t('i18n.examNoPractice'),
          text: this.$t('i18n.examNoPracticeTips'),
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
      },



      /* 数据项 */
      firstGetRemind: true, // 获取【前往后台弹窗提示】标志, 仅请求一次
      showExamTaking: false, // 是否展示考试中
      dialogShow: false, // 前往后台提示框

      examPageData: { // 考试数据
        inTheExamMap: new Map(), // 正在考试中的数据
        pageData: [],
        currPage: 0,
        maxPage: 1,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
      },
      practicePageData: { // 练习数据
        pageData: [],
        currPage: 0,
        maxPage: 1,
        loading: false, // 加载更多的加载提示
        scrollLock: false, // 滚动锁，防止下拉多次请求
      },
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
    };
  },
  computed: {
    ...mapState([
      'examination'
    ]),
    // 填充fixed的高度
    fillFixed() {
      // 有正在考试中的，则为50+40 否则进nav的50
      let height = this.showExamTaking? 90: 50;
      return {
        marginTop: height + 'px'
      };
    },

    // nav栏选项
    nowNavIndex: {
      get() {
        return this.selectData.activeIndex;
      },
      set(value) {
        this.selectData.activeIndex = value;
      }
    },

    // 无数据切换
    comHasRecord() { // 搜索类型 课程0 直播1 考试2
      let marking = this.hasRecord.marking;
      let nowHasRecord =  this.nowNavIndex == 0? this.hasRecord.exam:
                          this.nowNavIndex == 1? this.hasRecord.practice:
                          marking.index == 0? marking.noData:
                          marking.index == 1? marking.complete:
                          marking.index == 2? marking.noPower: marking.other;
      return  Object.assign({}, this.hasRecord.common, nowHasRecord);
    },

    // 当前内容数据
    nowContentData() {
      return  this.nowNavIndex === 0? this.examPageData:
              this.nowNavIndex == 1? this.practicePageData: this.markingData;
    },

    // 阅卷数据
    answer() {
      return this.markingData.answer;
    },
  },
  created() {
    // 继续考试剩余时间定时器
    if(!this.examination.handle) {// 当前无循环时开启
      this.UPDATE_NOWTIME(); // 先更新当前时间在开启循环,避免空档期1s
      let remainingTimer = setInterval(() => {
        this.UPDATE_NOWTIME(); // 1秒更新一次当前时间
      }, 1000);

      // 存句柄
      this.SET_CONTINUE_REMAIN({handle: remainingTimer})
    }

    this.initGetData();

  },
  activated() {
    //不用局部设高+scroll，因为前一个页面有键盘，安卓键盘有问题，ios的前进后退栏有问题
    window.addEventListener('scroll', this.scrollList);
  },
  deactivated() {
    // 移除滚动事件，避免其他页面触发
    window.removeEventListener('scroll', this.scrollList);
  },
  beforeDestroy() {
    // 清除定时器
    clearInterval(this.examination.handle);
    // 初始化仓库计时数据
    this.SET_CONTINUE_REMAIN({
      handle: 0
    });
  },
  methods: {
    ...mapMutations([
      'SET_CONTINUE_REMAIN',
      'UPDATE_NOWTIME'
    ]),

    // 初始化请求
    initGetData() {
      let index = parseInt(this.$route.params.index);
      0 < index? this._getExaming(): index = 0; // 防止NaN
      // 初始化考试信息
      this._getInitExam().then(() => {
        this.listenFromNavTab(index); // 触发切换,内自带请求
      });
    },

    // 初始化数据, 仅切换nav的需要
    initData() {
      if (this.nowNavIndex < 2) {
        Object.assign(this.nowContentData, {
          pageData: [],
          currPage: 0,
          maxPage: 1,
          loading: false, // 加载更多的加载提示
          scrollLock: false, // 滚动锁，防止下拉多次请求});
        });
      } else {
        Object.assign(this.nowContentData, {
          answer: {},
          answerMap: new Map(),
          submitLock: false,
          imgUrls: [],//图片地址数组
        });
      }

      // 阅卷提示初始化
      Object.assign(this.markingTip, {
        show: false,
        score: 10
      });
    },

    // nav栏切换
    listenFromNavTab(index) {
      // 请求红点
      this._getRedPoint();

      this.nowNavIndex = index;
      // 同步切换路由,
      this.$router.replace({name: 'examination', params: {index: index}});
      this.hasRecord.common.show = false; // 隐藏无数据组件
      this.loadMoreShow = false; // 隐藏加载更多组件
      this.initData(); // 初始化数据

      // 请求数据,请求完设置对应无数据页面和加载更多显示
      this.getData().then(() => {
        this.hasRecordCherk(); // 有无数据/加载更多组件判断设置
      });
    },

    // 获取数据
    getData() {
      return  this.nowNavIndex == 2? this._getMarkingAnswer():
              this.nowNavIndex == 1? this.loadMoreList():
              this._getExaming().then(() => {// 请求考试中数据
                return this.loadMoreList();
              });
    },

    // 加载更多请求
    loadMoreList() {
      // 根据当前nav项去加载跟多
      return this.nowNavIndex?
      this._getPractice({ // 请求练习
        currPage: ++this.nowContentData.currPage
      }).catch(err => {
          // 刷新页面
          location.reload(); //
      }):
      this._getExam({ // 请求考试
        currPage: ++this.nowContentData.currPage
      }).catch(err => {
          // 刷新页面
          location.reload(); //
      });
    },

    // 初始化考试请求
    _getInitExam() {
      return new Promise((resolve, reject) => {
        getInitExam({}, data => {
          resolve()
        });
      });
    },

    // 请求考试和阅卷的小红点提醒
    _getRedPoint() {
      return new Promise((resolve, reject) => {
        getRedPoint({}, data => {
          let tabs = this.selectData.tabs;
          tabs[0].num = data.examCount > 99? 99: data.examCount;
          tabs[2].num = data.manualCount > 99? 99: data.manualCount;

          resolve();
        }, reject);
      });
    },

    // 获取标志, 判断是否显示【前往后台弹窗提示】
    _getIsRemind(courseLength) {
      return new Promise((resolve, reject) => {
        getIsRemind({agentCode: 'examination'},
        data => {
          if (data.isRemind) {
            if(courseLength < 5){
              this.dialogShow = true;
            } else {
              closeGuideDialog({agentCode: 'examination'});
            }
          }
          resolve();
        });
      });
    },

    // 获取正在考试数据请求
    _getExaming(obj){
      return new Promise((resolve, reject) => {
        getExaming({}, data => {
          let i,
              examPageData = this.examPageData,
              answerIngList = data.answerIngList;

          examPageData.inTheExamMap = new Map(); // 每次都初始化

          if (answerIngList.length) { // 如果有
            for(i = 0; i < answerIngList.length; i++){
              examPageData.inTheExamMap.set(answerIngList[i].id, answerIngList[i]);
            }

            // 显示考试中提示
            this.showExamTaking = true;
          } else {
            this.showExamTaking = false;
          }

          resolve();
        }, reject);
      });
    },

    // 获取考试数据请求
    _getExam(obj){
      this.nowContentData.loading = true; // 下拉加载中显示设置

      return new Promise((resolve, reject) => {
        getExam({
          examStatus: 0,
          page: obj.currPage
        }, data => {

          if (this.firstGetRemind) {// 获取【前往后台弹窗提示】标志, 仅请求一次
            this.firstGetRemind = false;
            let pageDataLength = data.pageData? data.pageData.length: 0;
            this._getIsRemind(pageDataLength);
          }

          if (data.pageData && data.pageData.length) {
            data.pageData = this.dataProcessing(data.pageData);// 数据处理
            let pageData = this.nowContentData.pageData;

            // 对接数据
            this.dockingData(pageData, data.pageData);

            pageData.push.apply(pageData, data.pageData); // 数组添加
            delete data.pageData;
          }

          Object.assign(this.nowContentData, data, {loading: false, scrollLock: false}); // 数据赋值
          resolve();
        }, reject);
      });
    },

    // 获取练习数据请求
    _getPractice(obj) {
      this.nowContentData.loading = true; // 下拉加载中显示设置

      return new Promise((resolve, reject) => {
        getPractice({
          currentPage: obj.currPage
        }, data => {
          let pageData = this.nowContentData.pageData;
          pageData.push.apply(pageData, data.pageData); // 数组添加
          delete data.pageData;

          Object.assign(this.nowContentData, data, {loading: false, scrollLock: false}); // 数据赋值
          resolve();
        }, reject);
      });
    },

    // 获取阅卷试卷答案数据请求 并 处理数据
    _getMarkingAnswer() {
      let marking = this.hasRecord.marking;
      marking.index = 0; // 无数据初始化为noData 无待阅试卷
      return new Promise((resolve, reject) => {
        getMarkingAnswer({}, data => {
          resolve(data);
        }, reject, false);
      }).then(data => {
        if (data) { // code非0会被catch捕获, data为undefined
          let imgUrls = this.markingData.imgUrls; // 预览图片数组
          let questionVOList = data.answer.questionVOList; // 题目数组
          let qeList = data.answer.qeList; // 答案数组
          let answerMap = this.nowContentData.answerMap; // 答案和题目的映射
          let tempImgArr = [];

          if (!questionVOList) { // 如果题目数组没定义，则重新获取
             // 重新刷新请求
            this.listenFromNavTab(2);
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

          Object.assign(this.nowContentData, data);
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
            this.listenFromNavTab(2);

            // 返回一个pendding 中断后面的Promise
            return new Promise(() => {});
            break;
          default:
            marking.index = 3; // 无数据other
        }
        return;
      });
    },

    // 提交阅卷
    _appraiseAnswer(obj) {
      return new Promise((resolve, reject) => {
        appraiseAnswer(obj,
         data => {
          resolve();
        }, reject);
      });
    },

    // 点击按钮判断并提交阅卷
    submitMarking() {
      this.markingData.submitLock = true; // 提交锁， 防多次触发

      let questionVOList = this.nowContentData.answer.questionVOList; // 题目数组
      let answerMap = this.nowContentData.answerMap; // 答案和题目的映射
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
          this.listenFromNavTab(2);
        });
      } else {
        // 有错误，无需提交，这波提交操作终止
        this.markingData.submitLock = false; // 提交锁关闭
      }
    },

    // 无数据/加载更多组件判断设置
    hasRecordCherk() {
      let data = this.nowNavIndex < 2? this.nowContentData.pageData.length: this.nowContentData.answer.qeList // 用答案数组做判断 请求失败时为undefined
      this.hasRecord.common.show = data? false: true;
      this.loadMoreShow = data? true: false;
    },

    // 滚动事件
    scrollList(event) {
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      if (this.nowContentData.scrollLock || !scrollTop || this.nowNavIndex == 2) return; // 锁定/在顶处/阅卷不用触发滚动
      if (scrollTop + window.innerHeight >= document.body.scrollHeight - 44) { // 44是loadmore高度
        this.nowContentData.scrollLock = true; // 防止滚动多次请求
        if (!this.nowContentData.loading && this.nowContentData.currPage < this.nowContentData.maxPage) {
          this.loadMoreList();
        }
      }
    },

    // 进入考试中页面
    enterExamTaking() {
      // 如果考试中有多个，进入列表，如果考试仅有一个，进入考试页面
      let inTheExamMap = this.examPageData.inTheExamMap;
      if (!inTheExamMap.size) {return;}

      if (inTheExamMap.size == 1) {
        inTheExamMap.forEach((examingItem, examingId) => {
          this.$router.push({name: 'exam_write', params: {id: examingId}});
          return;
        });
      } else { // 多个考试列表, 进入考试中页面
        this.$router.push({name: 'examing'});
      }
    },

    // 从后台拿到的数据进行处理
    dataProcessing(pageData) {
      let i, j, nowPageData, picList, picListLength, // 临时数据
          inTheExamMap = this.examPageData.inTheExamMap,
          pageList = [], // 用来返回的，一个包含listItem数组
          listItem = {}, // 当前日期项对象，里面包含该日期点信息，以及包含考试数组
          dateTime= '',  // 当前日期, 与oldDateTime来判断是否新日期
          oldDateTime = '', // 老日期, 用来判断是否同新日期
          pageDataLength = pageData.length,
          dataObject = {}, // 存放时间的对象，可提取信息
          exam = {}; // 当前考试的信息。

      for (i = 0; i < pageDataLength; i++) {
        nowPageData = pageData[i];
        dateTime = nowPageData.startTime.substr(0, 10)? nowPageData.startTime.substr(0, 10): nowPageData.createTime.substr(0, 10);
        if (oldDateTime != dateTime && dateTime != '') { // 新的日期点
          oldDateTime && pageList.push(listItem); // 推入只在新日期(第一个新日期不用) 以及 最后一个推入

          listItem = {}; // 新的日期点需要新的listItem
          dataObject = this.getDateObejct(newDateObj(nowPageData.startTime)); // 需要把时间的-换成/ 兼容ios
          listItem.week = dataObject.day;
          listItem.data = `${dataObject.month}月${dataObject.date}日`;
          oldDateTime = dateTime;
          listItem.list = [];
        }
        // listItem.list = listItem.list || [];// 未初始化则初始化。

        /* 考试数据赋值 */
        exam = {};
        // 判断是否在考试中，判断是否有答题记录 并赋值
        Object.assign(exam, nowPageData, {
          inTheExam: inTheExamMap.get(nowPageData.id)? true: false,
          answerTime: inTheExamMap.get(nowPageData.id)? inTheExamMap.get(nowPageData.id).answerTime: ''
        });

        listItem.list.push(exam); // 将考试推入当前日期点
      } // for循环完

      pageList.push(listItem); // 推入只在新日期 以及 最后一个推入
      return pageList;
      /* 返回结构
      pageList: [
        listItem: {
          week: '',
          data: '',
          list: [
            {
              exam：{}
            }
          ]
        }
      ]
      */
    },

    // 对接数据, 在数据处理后调用，用于拼接加载更多的数据
    dockingData(oriArr, newArr) {
      if (!oriArr.length || !newArr.length) {return;} // 一方无值不用操作
      let oriLastItem = oriArr[oriArr.length - 1]; // 原数据的最后一个时间项
      let newFirstItem = newArr[0];// 新数据的第一个时间项
      let dockingArr = []; // 用来做对接的中间容器

      // 如果日期和星期都一样，需要对接
      if (oriLastItem.data == newFirstItem.data && oriLastItem.week == newFirstItem.week) {
        // 将新数据第一个内容推入原数据最后一项
        oriLastItem.list.push.apply(oriLastItem.list, newFirstItem.list);

        // 弹出新数据第一个，由请求接口内的推入对接完的data.pageData（即newArr）
        newArr.shift();
      }
    },

    //获取当前年、月、日、时、分、秒、周期的对象（以对象形式返回）
    getDateObejct(newDate=Date.now()) {
      let date = new Date(newDate);
      let dateObject={};
      dateObject.year = date.getFullYear();
      dateObject.month = date.getMonth() + 1;
      dateObject.date = date.getDate();
      dateObject.day = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][date.getDay()];
      dateObject.month = dateObject.month < 10 ? "0" + dateObject.month : dateObject.month;
      dateObject.date = dateObject.date < 10 ? "0" + dateObject.date : dateObject.date;
      dateObject.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      dateObject.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      dateObject.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

      return dateObject;
    },

    // 前往后台确定点击
    dialogMaskClick() {
      this.dialogShow = false;
      closeGuideDialog({agentCode: 'examination'});
    },

    // 考试列表有交卷触发
    inHand() {
      this._getRedPoint();// 请求红点
    },

    // 阅卷警告提示更换监听
    listenFormMarking(obj) {
      this.markingTip = Object.assign({}, obj);
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../static/css/mixin.scss';
.qwui-learn_examination {
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

  .examination_content {
    .content_marking {
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
    }
  }

  & /deep/ .icon_search_noCourse {
    display: inline-block;
    width: 130px;
    height: 130px;
    background: url('../../../../assets/images/noCourse.png') center no-repeat;
    background-size: cover;
  }

  & /deep/ .icon_exam_markingLock {
    display: inline-block;
    width: 130px;
    height: 130px;
    background: url('../../../../assets/images/icon_noContent.png') -512px center no-repeat;
    background-size: cover;
  }

  /* 更换nav公共组件内激活的颜色 */
  & /deep/ .qwui-nav_tabs_box.active {
    border-bottom: 3px solid #45A8F5;
    color: #45A8F5;
  }

  .dialog_mask {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 3;
    .dialog_mask_box {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 270px;
      padding: 30px 20px;
      transform: translate(-50%, -50%);
      background: rgba(249, 249, 249, .96);
      border-radius: 10px;
      box-sizing: border-box;

      .dialog_mask_head {
        font-size: 17px;
        line-height: 24px;
        font-weight: 500;
        color: #000;
        text-align: center;
      }
      .dialog_mask_content {
        padding: 15px 0;
        font-size: 14px;
        line-height: 24px;
        color: #9b9b9b;
      }
      .add_border_bottom {
        @include border-b-1px(#E6E6E6);
      }
      .dialog_mask_button {
        padding: 14px 0;
        text-align: center;
        font-size: 18px;
        line-height: 18px;
        color: #fff;
        border-radius: 5px;
        background: #2F7DCD;
        cursor: pointer;
      }
    }
  }
}
</style>
