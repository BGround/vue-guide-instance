import axios from 'axios';

// 获取查询参数
let search = (key, link = location.href) => {
  let reg = new RegExp('^[^\\?#]*\\?[^#]*?(|&)' + key + '=([^&#]*)'),
    match = link.match(reg);

  return match && match[2];
};

// 添加agentCode
let _parseURL = agentCode => {
  return link => {
    // agentCode不存在时不做任何修改
    if (!agentCode)
      return link;

    let temp = document.createElement('a');

    temp.href = link;
    if (temp.search) {
      temp.search = temp.search.replace(
        /(\?|&)agentCode=\w+|$/,
        '&agentCode=' + agentCode
      );
    } else {
      temp.search = '?agentCode=' + agentCode;
    }

    return link.split(/[\?#]/)[0] + temp.search + temp.hash;
  }
};

// 全局AGENT_CODE
window.AGENT_CODE = '';

// 封装接口方法
// params url: 接口url
// params isLoad：是否需要loading过程
// params agentCode：默认AgentCode
let getData = (() => {
  let agentCode = search('agentCode');

  // 目前仅限于党建应用会识别出agentCode参数
  if (agentCode !== 'partyconstruction') {
    agentCode = null;
  }

  window.AGENT_CODE = agentCode;
  window.parseURL = _parseURL(agentCode);

  return (url, isLoad = true, _agentCode) => {
    _agentCode = agentCode || _agentCode;

    const SUCCESS_CODE = '0';

    return (data, cb, errCb = null, showErrAlert = true, privateIsLoad = true) => {
      if (isLoad && privateIsLoad)
        _.showLoading('');

      if (_agentCode)
        data.belongAgent = _agentCode;

      axios.post(_.baseURL + url, { ...data })
      .then(result => {
        isLoad && privateIsLoad && _.hideLoading('');
        // 公共axios拦截错误在报错404时, 此函数依然会跑到result.code报错
        // 如果result为undefined 直接返回
        if (!result)
          return;

        if (result.code === SUCCESS_CODE) {
          cb && cb(result.data);
        } else {
          // 默认错误信息需要弹窗, 可设置无需弹窗
          if (showErrAlert) {
            _.alert('提示', result.desc, {
              primaryBtn: {
                name: 'i18n.confirm',
                callBack () {
                  if (errCb)
                    errCb(result);
                }
              }, // 确认按钮
              defaultBtn: {
                name: '',
                callBack: null
              }//主操作按钮
            });
          } else {
            if (errCb)
              errCb(result);
          }
        }
      })
    }
  }
})();

/* 可以公用的 */
// 获取当前机构流量数据
let getUserFlow = getData('/portal/alicloudupload/portalAliCloudUploadAction!volumeFlow.action' ,false, 'learnonline');

// 记录流量
let recordFlow = getData('/portal/alicloudupload/portalAliCloudUploadAction!expendFlow.action' ,false, 'learnonline');

// 获取视频真实Url
let getVideoUrl = getData('/portal/QCloud/qCloudAction!getVodPermission.action' ,false, 'learnonline');



/* 商城(发现)相关 */
// 获取商城列表数据
let getMallListData = getData('/portal/learn/subjectMarket/findLike.do', true, 'learnonline');

// 获取商城详情页数据
let getMallDetailData = getData('/portal/learn/subjectMarket/ajaxViewShopSubject.do', true, 'learnonline');

//课程商城图文的预览
let getArticleContent = getData('/portal/learn/subjectMarket/ajaxViewArticle.do', true, 'learnonline');

// 记录学习时长（详情页）
let recordLearnTime = getData('/portal/learn/subjectMarket/recondStudyTime.do', false, 'learnonline');

// 获取管理员列表
let getManager = getData('/portal/managesetting!getUserList.action', true, 'learnonline');

// 发送购买请求
let sendBuyAsk = getData('/portal/learn/subjectMarket/sendBuyRequest.do', true, 'learnonline');



/* 直播相关 */
// 获取直播列表数据
let getLiveListData = getData('/portal/learnonline/portalLiveAction!searchLive.action', true, 'learnonline');

//讲师直播通知的url
let getLiveInfoData = getData('/open/learnonline/openLiveAction!searchLive.action', true, 'learnonline');

// 获取直播详情页数据
let getLiveDetailData = getData('/portal/learnonline/portalLiveAction!searchWxLiveDetail.action', true, 'learnonline');

// 进入直播间的请求
let getLivePlayData = getData('/portal/learnonline/portalLiveAction!enterLive.action', false, 'learnonline');

// 直播间和回放间发送统计学习时长的请求
let recordLiveTime = getData('/portal/learnonline/portalLiveAction!updateLiveViewTime.action', false, 'learnonline');

// 直播间获取评论
let getLiveCommentData = getData('/portal/learnonline/portalLiveAction!searchLiveComment.action', false, 'learnonline');

// 直播间发送评论
let sendLiveCommentData = getData('/portal/learnonline/portalLiveAction!addLiveComment.action', false, 'learnonline');

// 进入回放间的请求
let getReplayData = getData('/portal/learnonline/portalLiveAction!enterLiveVideo.action', true, 'learnonline');

// 回放间发送记录流量请求
let recordReplayFlow = getData('/portal/learnonline/portalLiveAction!updateVideoFlow.action', false, 'learnonline');



/* 学习任务相关 */
// 初始化开课信息
let portalCourseInit = getData('/portal/learnonline/portalCourseAction!courseInite.action', true, 'learnonline');

// 获悉学习任务的课程 / 获得搜索的课程
let getCoursesData = getData('/portal/learnonline/portalCourseAction!ajaxIndex.action', true, 'learnonline');

// 获取是否显示【前往后台弹窗提示】的标志
let getIsRemind = getData('/portal/managesetting!ajaxIsRemindUser.action');

// 关闭【前往后台弹窗提示】反馈给服务器
let closeGuideDialog = getData('/portal/managesetting!ajaxUpdateRemindUser.action');



/* 我的相关 */
// 获取用户信息：头像、姓名等, 用于【我的】
let getLearnUserInfo = getData('/portal/learnonline/portalCourseAction!ajaxMyStudy.action', true, 'learnonline');

//个人学分明细
let scoreDetail = getData('/portal/learn/creditDetail.do', true, 'learnonline');

// 获取最近学习课程
let getMyStudyCourse = getData('/portal/learnonline/portalCourseAction!ajaxStudyCourse.action', true, 'learnonline');

// 获取统计权限
let getStatistics = getData('/portal/examination/exam/myCountPower.do', true, 'learnonline');



/* 搜索相关 */
// 搜索课程
let searchSubject = getData('/portal/learn/subjectMarket/searchSubject.do', true, 'learnonline');

// 搜索直播
let searchLive = getData('/portal/learnonline/portalLiveAction!searchLive.action', true, 'learnonline');

// 查询是否有正在进行的考试
let searchExamCount =  getData('/portal/portalExamAction!seachExamCount.action', true, 'examination');

// 搜索考试
let searchExam = getData('/portal/portalExamAction!seachExamList.action', true, 'examination');

// 搜索练习
let searchPractice = getData('/portal/exam/practice/practicePortalAction!ajaxWxPracticePage.action', true, 'examination');



/* 课程详情相关 */
// 获取必学课/选学课详情页数据
let getCourseDetailData = getData('/portal/learnonline/portalCourseAction!ajaxPersonCourse.action', true, 'learnonline');

// 获取目录
let getCatalog = getData('/portal/learnonline/portalCourseAction!ajaxCourseChapter.action', true, 'learnonline');

// 获取课件类型
let getFileType = getData('/portal/learnonline/portalCourseAction!ajaxStudyEnclosure.action', false, 'learnonline');

// 记录时长
let recordCourseTime = getData('/portal/learnonline/portalCourseAction!studyEnclosure.action', false, 'learnonline');

// 获取课程评论
let getCourseCommentData = getData('/portal/learnonline/portalCourseAction!listMoreComment.action', true, 'learnonline');

// 发送课程评论
let sendCourseCommentData = getData('/portal/learnonline/portalCourseAction!addSubjectComment.action', true, 'learnonline');

// 删除课程评论
let delCourseCommentData = getData('/portal/learnonline/portalCourseAction!delCommentPO.action', true, 'learnonline');



/* 课程相关 */
//获取课程的目录
let getCourseCategory = getData('/portal/learnonline/portalCourseAction!loadCategory.action', true, 'learnonline');

/* 获取课程的数据 */
let getCourseListData = getData('/portal/learnonline/portalCourseAction!ajaxCoursePage.action', true, 'learnonline');

/* 获取课程学习情况的详细数据 */
let getLeanDetail = getData('/portal/learnonline/portalCourseAction!ajaxStudyEnclosure.action', true, 'learnonline');

/* 发送学习时长 */
let sendLearnTime = getData('/portal/learnonline/portalCourseAction!studyEnclosure.action', false, 'learnonline');

//查询菜单
let getMenu = getData('/portal/learn/loadMenu.do',true,'learnonline')
//保存菜单
let saveMenu = getData('/portal/learn/saveMenu.do',true,'learnonline')



/* 考试首页相关 */
// 初始化考试信息
let getInitExam = getData('/portal/portalExamAction!examInite.action', true, 'examination');

// 请求考试和阅卷的小红点提醒
let getRedPoint = getData('/portal/portalExamAction!ajaxWaitCount.action', false, 'examination');

// 获取阅卷试卷数据
let getMarkingAnswer = getData('/portal/portalExamAction!getAnswer.action', true, 'examination');

// 评阅答案
let appraiseAnswer = getData('/portal/portalExamAction!appraiseAnswer.action', true, 'examination');



/* 考试详情页 */
// 获取考试详情页数据
let getExamDetail = getData('/portal/portalExamAction!ajaxExamView.action', true, 'examination');

// 获取外部考试详情页数据
let getExternalExamDetail = getData('/open/examination/openExamAction!ajaxView.action', true, 'examination');

// 获取外部考试检验填写项
let getExternalCheckInformation = getData('/open/examination/openExamAction!getOpenInfo.action', true, 'examination');

// 提交外部考试用户信息
let saveExternalInfo = getData('/open/examination/openExamAction!saveOpenInfo.action', true, 'examination');

// 核对用户身份以查询结果
let getAnswerInfo = getData('/open/examination/openExamAction!getAnswerInfo.action', true, 'examination');

// 获取当前考试是否重复登录
let hasLogin = getData('/portal/examination/exam/hasLogin.do', false, 'examination');


/* 练习详情页 */
// 获取练习详情页数据
let getPracticeDetail = getData('/portal/exam/practice/practicePortalAction!ajaxBeforeAnswerCount.action', true, 'examination');



/* 考试结果页/解析页 */
// 内部获取考试结果页数据
let getResultData = getData('/portal/portalExamAction!seachExamAnswer.action', true, 'examination');

// 外部获取考试结果页数据
let getResultDataExternal = getData('/open/examination/openExamAction!seachExamAnswer.action', true, 'examination');



/* 考试答题页 */
// 内部获取考试答题页数据
let getExamQuestion = getData('/portal/portalExamAction!seachExamQusetionList.action', true, 'examination');

// 外部获取考试答题页数据
let getExamQuestionExternal = getData('/open/examination/openExamAction!seachExamQusetionList.action', true, 'examination');

// 内部获得答题剩余时间
let getAnswerTime = getData('/portal/portalExamAction!ajaxAnswerTime.action', false, 'examination');

// 内部提交考生缓存答案
let postAnswerCache = getData('/portal/portalExamAction!addAnswerCache.action', false, 'examination');

// 外部提交考生缓存答案
let postAnswerCacheExternal = getData('/open/examination/openExamAction!addAnswerCache.action', false, 'examination');

// 内部交卷请求
let handOverAnswer = getData('/portal/portalExamAction!saveExamAnswer.action', false, 'examination');

// 外部交卷请求
let handOverAnswerExternal = getData('/open/examination/openExamAction!saveExamAnswer.action', false, 'examination');

// 内部提交乱序
let postExamDisorder = getData('/portal/examination/exam/saveSort.do', false, 'examination');

// 外部提交乱序
let postExamDisorderExternal = getData('/open/examination/openExamAction!saveSort.action', false, 'examination');

//反馈来源
const managesetting = getData("/portal/managesetting!ajaxIsManager.action",false,'get',false);

// 获取阅卷记录列表数据
let getManualList = getData('/portal/portalExamAction!searchManualList.action', true, 'examination');

// 获取阅卷试卷列表数据
let getManualDetailList = getData('/portal/portalExamAction!searchManualDetailList.action', true, 'examination');
 
// 获取阅卷情况页数据
let getManualDetail = getData('/portal/portalExamAction!searchManualDetail.action', true, 'examination');

// 获取考试统计页数据
let getStatisticsList = getData('/portal/examination/exam/searchExamCount.do', true, 'examination');
 
// 获取统计详情页已考数据
let getStatisticsAnswer = getData('/portal/examination/exam/searchAnswerByExam.do', true, 'examination');

// 获取统计详情页未考数据
let getStatisticsUnAnswer = getData('/portal/examination/exam/searchUnAnswerByExam.do', true, 'examination');
 
// 反馈历史
let feedbackList = getData('/portal/portalForm/getOpenFormForDo1FeedBack.do');
export {
  getMallListData,
  getMallDetailData,
  getArticleContent,
  getLiveListData,
  getLiveInfoData,
  getLiveDetailData,
  getLivePlayData,
  getUserFlow,
  getVideoUrl,
  recordLearnTime,
  recordFlow,
  getManager,
  sendBuyAsk,
  recordLiveTime,
  getLiveCommentData,
  sendLiveCommentData,
  getReplayData,
  portalCourseInit,
  getCoursesData,
  getIsRemind,
  closeGuideDialog,
  getLearnUserInfo,
  scoreDetail,
  getMyStudyCourse,
  searchSubject,
  searchLive,
  searchExamCount,
  searchExam,
  searchPractice,
  getCourseDetailData,
  getCatalog,
  getFileType,
  recordCourseTime,
  recordReplayFlow,
  getCourseCommentData,
  sendCourseCommentData,
  delCourseCommentData,
  getCourseCategory,
  getCourseListData,
  getLeanDetail,
  sendLearnTime,
  getInitExam,
  getRedPoint,
  getMarkingAnswer,
  appraiseAnswer,
  getStatistics,
  getExamDetail,
  getExternalExamDetail,
  getExternalCheckInformation,
  saveExternalInfo,
  getAnswerInfo,
  hasLogin,
  getPracticeDetail,
  getMenu,
  saveMenu,
  getResultData,
  getResultDataExternal,
  getExamQuestion,
  getExamQuestionExternal,
  getAnswerTime,
  postAnswerCache,
  postAnswerCacheExternal,
  handOverAnswer,
  handOverAnswerExternal,
  postExamDisorder,
  postExamDisorderExternal,
  managesetting,
  getManualList,
  getManualDetailList,
  getManualDetail,
  getStatisticsList,
  getStatisticsAnswer,
  getStatisticsUnAnswer,
  feedbackList
};
