import Vue from 'vue'
import Router from 'vue-router';
import i18nFun from "@/lang";
// 主页
const Learn = r => require.ensure([], () => r(require('./views/index')),'learn_index');

// 主页-学习任务
const LearningTasks = r => require.ensure([], () => r(require('./views/learnTask/LearningTasks')),'learning_tasks');
// 主页-考试
const Examination = r => require.ensure([], () => r(require('./views/examination/index')),'examination');
// 主页-直播列表
const LivePlayList = r => require.ensure([], () => r(require('./views/live/LivePlayList')),'liveplay_list');
// 主页-发现
const MallList = r => require.ensure([], () => r(require('./views/mall/MallList')),'mall_list');
// 主页-我的
const MyRelavent = r => require.ensure([], () => r(require('./views/myRelavent/MyRelavent')),'my_relavent');



// 商城管理员列表
const ManagerList = r => require.ensure([], () => r(require('./views/mall/ManagerList')),'manager_list');

// 发现详情页
const MallDetail = r => require.ensure([], () => r(require('./views/mall/MallDetail')),'mall_detail');

//发现课程预览
const PreviewDetail = r => require.ensure([], () => r(require('./views/mall/PreviewDetail')),'preview_detail');

// 直播
const LiveDetail = r => require.ensure([], () => r(require('./views/live/LiveDetail')),'live_detail');

const LiveInfo = r => require.ensure([], () => r(require('./views/live/LiveInfo')),'live_info');

const LivePlay = r => require.ensure([], () => r(require('./views/live/LivePlay')),'live_play');

const LiveReplay = r => require.ensure([], () => r(require('./views/live/LiveReplay')),'live_replay');

// 任务列表
const TaskList = r => require.ensure([], () => r(require('./views/learnTask/LearningTaskList')),'task_list');

//学习详情页面
const LearnDetail = r => require.ensure([], () => r(require('./views/learnTask/learningDetail')),'learn_detail');

// 我的
// 最近学习
const MyStudy = r => require.ensure([], () => r(require('./views/myRelavent/MyStudy')),'my_Study');

// 自定义菜单
const TheCustom = r => require.ensure([], () => r(require('./views/TheCustom/TheCustom')),'the_custom');

//学分明细
const ScoreDetail = r => require.ensure([], () => r(require('./views/myRelavent/ScoreDetail')),'score_detail');

// 快速体验入口列表页
const QuickExperience = r => require.ensure([], () => r(require('./views/myRelavent/QuickExperience')),'quick_experience');

// 快速体验轮播页
const Broadcast = r => require.ensure([], () => r(require('./views/myRelavent/Broadcast/index')),'broadcast');

// 搜索
const search = r => require.ensure([], () => r(require('./views/search/Search')),'search_index'); // 搜索首页

// 免费课程详情
const CourseDetail = r => require.ensure([], () => r(require('./views/courseDetail/CourseDetail')),'course_detail');

// 正在考试列表页面
const Examing = r => require.ensure([], () => r(require('./views/examination/examing/Examing')), 'examing');

// 考试详情页
const ExamDetail = r => require.ensure([], () => r(require('./views/examination/examDetail/ExamDetail')), 'exam_detail');

// 外部考试信息收集页
const CheckInformation = r => require.ensure([], () => r(require('./views/examination/examDetail/CheckInformation')), 'check_information');

// 练习详情页
const PracticeDetail = r => require.ensure([], () => r(require('./views/examination/practiceDetail/PracticeDetail')), 'practice_detail');

// 考试结果页/解析页
const ExamResult = r => require.ensure([], () => r(require('./views/examination/examResult/ExamResult')), 'exam_result');

// 考试阅卷结果页
const MarkingResult = r => require.ensure([], () => r(require('./views/examination/examResult/MarkingResult')), 'marking_result');

// 考试答题页
const ExamWrite = r => require.ensure([], () => r(require('./views/examination/examWrite/ExamWrite')), 'exam_write');

// 单场阅卷页
const ExamRemind = r => require.ensure([], () => r(require('./views/examination/remind/Remind')), 'exam_remind');

// 考试记录页
const ExamRecord = r => require.ensure([], () => r(require('./views/examination/examRecord/ExamRecord')), 'exam_record');

// 阅卷记录页
const MarkingRecord = r => require.ensure([], () => r(require('./views/examination/markingRecord')), 'marking_record');

// 阅卷试卷列表页
const MarkingExam = r => require.ensure([], () => r(require('./views/examination/markingRecord/MarkingExam')), 'marking_exam');

// 阅卷情况页
const MarkingDetail = r => require.ensure([], () => r(require('./views/examination/markingRecord/MarkingDetail')), 'marking_detail');

// 考试统计页
const ExamStatistics = r => require.ensure([], () => r(require('./views/examination/examStatistics')), 'exam_statistics');

// 考试统计详情页
const StatisticsDetail = r => require.ensure([], () => r(require('./views/examination/examStatistics/StatisticsDetail')), 'statistics_detail');
// 问题反馈列表页
const FeedBackList=  r => require.ensure([], () => r(require('./views/myRelavent/feedBackList/FeedBackList')),'FeedBackList');
Vue.use(Router);

function newRouterFun() {
  const i18n = i18nFun(_.lang)
  const locale = i18n.locale;
  const title = i18n.messages[locale].i18n;
  let learnTitle = title.learn;

  if (window.AGENT_CODE === 'partyconstruction') {
    learnTitle = title.partyLearn;
  }

  const newRouter = new Router({
    routes: [
      {
        path: '/', // 首页
        name: 'learn',
        component: Learn,
        meta: {
          title: learnTitle,
          keepAlive: true
        },
        children: [ // 主页的几个分页面
          { // 学习任务
            path: 'learnTask',
            name: 'learning_tasks',
            component: LearningTasks,
            meta: {
              title: learnTitle,
              keepAlive: true
            }
          },
          { // 考试
            path: 'examination/:index',
            name: 'examination',
            component: Examination,
            meta: {
              title: learnTitle,
              keepAlive: true,
              isExam: true
            }
          },
          { // 直播
            path: 'livePlayList',
            name: 'liveplay_list',
            component: LivePlayList,
            meta: {
              title: learnTitle,
              keepAlive: true
            }
          },
          { // 发现
            path: 'mallList',
            name: 'mall_list',
            component: MallList,
            meta: {
              title: learnTitle,
              keepAlive: true
            }
          },
          { // 我的
            path: 'myRelavent',
            name: 'my_relavent',
            component: MyRelavent,
            meta: {
              title: learnTitle,
              keepAlive: true
            }
          }
        ]
      },
      {
        path: '/liveDetail',  // 直播详情
        name: 'live_detail',
        meta: {title: title.liveDetail},
        component: LiveDetail
      },
      {
        path: '/liveInfo/:id',  // 直播详情
        name: 'live_info',
        meta: {title: title.liveInfo},
        component: LiveInfo
      },
      {
        path: '/livePlay', // 直播间
        name: 'live_play',
        meta: {title: title.liveDetail},
        component: LivePlay,
      },
      {
        path: '/liveReplay', // 回放间
        name: 'live_replay',
        meta: {title: title.liveDetail},
        component: LiveReplay
      },
      {
        path: '/mallDetail', // 商城详情
        name: 'mall_detail',
        meta: {title: title.courseDetail},
        component: MallDetail
      },
      {
        path: '/previewDetail',
        name: 'preview_detail',
        meta: {title: learnTitle},
        component: PreviewDetail
      },
      {
        path: '/managerList', // 管理员列表
        name: 'manager_list',
        meta: {title: title.buyCourse},
        component: ManagerList
      },
      {
        path: '/taskList/:isMust',
        name: 'task_list',
        meta: {title: learnTitle},
        component: TaskList
      },
      {
        path: '/learnDetail/:id/:enclosureId/:cheatTime',
        name: 'learn_detail',
        meta: {title: learnTitle},
        component: LearnDetail
      },
      {
        path: '/myStudy', // 我的学习页面
        name: 'my_Study',
        meta: {
          title: title.myStudy,
        },
        component: MyStudy
  	  },
  	  {
        path: '/theCustom', // 自定义菜单
        name: 'the_Custom',
        meta: {
          title: title.theCustom,
        },
        component: TheCustom
      },
      {
        path: '/scoreDetail',// 学分明细
        name: 'score_detail',
        meta:{title: title.creditDetail},
        component: ScoreDetail
      },
      {
        path: '/quickExperience',// 快速体验入口列表页
        name: 'quick_experience',
        meta:{title: title.quickExperience},
        component: QuickExperience
      },
      {
        path: '/broadcast/:key',// 快速体验轮播页面
        name: 'broadcast',
        meta:{title: learnTitle},
        component: Broadcast
      },
      {
        path: '/search', // 搜索页面
        name: 'search',
        meta: {
          title: title.search,
        },
        component: search
      },
      {
        path: '/courseDetail', // 课程详情
        name: 'course_detail',
        meta: {
          title: title.courseDetail,
        },
        component: CourseDetail
      },

      /* 考试 */
      {
        path: '/examing',  // 正在考试列表页面
        name: 'examing',
        meta: {
          title: title.examEvaluation,
          isExam: true
        },
        component: Examing
      },
      {
        path: '/examDetail/:id',  // 考试详情页
        name: 'exam_detail',
        meta: {
          title: title.examDetail,
          isExam: true
        },
        component: ExamDetail
	  },
	  {
        path: '/open/examDetail/:id',  // 外部考试详情页
        name: 'open_exam_detail',
        meta: {
          title: title.examDetail,
          isExam: true
        },
        component: ExamDetail
      },
      {
        path: '/practiceDetail/:id',  // 练习详情页
        name: 'practice_detail',
        meta: {
          title: title.practiceDetail,
          isExam: true
        },
        component: PracticeDetail
      },
	    {
        path: '/open/checkInformation/:id/:status',  // 外部考试信息收集页 1为进入考试 0为查询结果
        name: 'check_information',
        meta: {
          title: title.examEvaluation,
          isExam: true
        },
        component: CheckInformation
      },
      {
        path: '/examResult/:id/:answerId',  // 考试结果页/解析页
        name: 'exam_result',
        meta: {
          title: title.examResult,
          isExam: true
        },
        component: ExamResult
      },
      {
        path: '/open/examResult/:id/:answerId',  // 外部考试结果页/解析页
        name: 'open_exam_result',
        meta: {
          title: title.examResult,
          isExam: true
        },
        component: ExamResult
      },
      {
        path: '/markingResult',  // 阅卷结果页
        name: 'marking_result',
        meta: {
          title: title.examResult,
          isExam: true
        },
        component: MarkingResult
      },
      {
        path: '/examWrite/:id',  // 考试答题页
        name: 'exam_write',
        meta: {
          title: title.duringTheExamination,
          isExam: true
        },
        component: ExamWrite
      },
      {
        path: '/open/examWrite/:id/:answerId',  // 外部考试答题页
        name: 'open_exam_write',
        meta: {
          title: title.duringTheExamination,
          isExam: true
        },
        component: ExamWrite
      },
      {
        path: '/remind/:id',  // 单场阅卷页
        name: 'exam_remind',
        meta: {
          title: learnTitle,
          isExam: true
        },
        component: ExamRemind
      },
      {
        path: '/examRecord',  // 考试记录页
        name: 'exam_record',
        meta: {
          title: title.examRecord,
          isExam: true
        },
        component: ExamRecord
      },
      {
        path: '/markingRecord',  // 阅卷记录页
        name: 'marking_record',
        meta: {
          title: title.markingRecord,
          isExam: true
        },
        component: MarkingRecord
      },
      {
        path: '/markingExam/:id',  // 阅卷试卷页
        name: 'marking_exam',
        meta: {
          title: title.markingRecord,
          isExam: true
        },
        component: MarkingExam
      },
      {
        path: '/markingDetail/:id',  // 阅卷详情页
        name: 'marking_detail',
        meta: {
          title: title.markingDetail,
          isExam: true
        },
        component: MarkingDetail
      },
      {
        path: '/examStatistics',  // 考试统计页
        name: 'exam_statistics',
        meta: {
          title: title.examStatistics,
          isExam: true
        },
        component: ExamStatistics
      },
      {
        path: '/statisticsDetail/:id/:isOpen',  // 考试统计页
        name: 'statistics_detail',
        meta: {
          title: title.examStatistics,
          isExam: true
        },
        component: StatisticsDetail
      },
      {
        path:'/FeedBackList',
        name:'FeedBackList',
        component:FeedBackList,
        meta: {
          title: "问题反馈",
        },
      },
    ]
  })

  newRouter.beforeEach((route, redirect, next) => {
    let wxqyh = dataBase.wxqyh_uploadfile

    document.title = route.meta.title;

    // 根据路由设置agentCode
    wxqyh.agent = route.meta.isExam? 'examination': 'learnonline';

    // router刷新链接，防止微信ios 分享链接依然为入口链接
    // if (route.path !== '/') {
    //   setTimeout(() => {
    //     window.location = window.location;
    //   }, 500);
    // }
    if(route.name == 'learning_tasks' && window.AGENT_CODE != 'partyconstruction'){
      let titleJsonObj = JSON.parse(localStorage.getItem('titleCache'+ _.userId));
      titleJsonObj ? document.title = titleJsonObj['learnonline'] : ''
    }
    next();
  });

  /*必配 start*/
  newRouter.afterEach(function (route, redirect, next) {
    try {
      _.initializedData();//初始化配置数据
    } catch (e) {

    }
  });
  return newRouter;
}
export default newRouterFun
/*必配 end*/
