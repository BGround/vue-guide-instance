import { getData, getDataSecond } from '../utils/getData'

/* -------------------- 开课管理 -------------------- */
//获取课程分类
const getCategory = getData('/learnonline/course/courseAction!loadCategory.action');
//获取课程列表
const getCourseList = getData('/learnonline/course/courseAction!loadCourse.action');
//获取课程详情
const getCourseDetail = getData('/learnonline/course/courseAction!ajaxViewCourse.action');
//获取课程二维码
const getCourseLink = getData('/learnonline/course/courseAction!getLink.action');
//获取学习进度
const getLearnProgerss = getData('/learnonline/course/courseAction!loadCourseSchedule.action');
//提醒课程未完成的人
const remindUnFinish = getData('/learnonline/course/courseAction!remindUnFinish.action');
//课程考试结果
const getLearnExamResult = getData('/learnonline/course/courseAction!getCourseExamResult.action');

/* -------------------- 新建考试 -------------------- */
// 请求试卷分类
const getPaperTypes = getData('/exam/examAction!AjaxGetTestpaperTypes.action');

// 请求的试卷列表
const getPaperList = getData('/exam/examAction!AjaxGetPaperByType.action');

// 请求试卷预览数据
const getPaperPreview = getData('/testpaper/testpaperAction!ajaxGetPaperDetail.action');

// 请求试卷预览数据-随机
const getPaperPreviewRandom = getData('/testpaper/testpaperAction!getRandomQuestionList.action');

//判断所选试卷是否允许上传图片
const judgeAllowPic = getData('/exam/examAction!judgeAllowPic.action');

//发布考试
const publishExam = getDataSecond('/exam/examAction!saveAndPublishExamination.action');

//发布草稿
const saveExamDraft = getDataSecond('/exam/examAction!addExamination.action');

//编辑页面发布考试
const editPublishExam = getDataSecond('/exam/examAction!publishExaminationInEdit.action');

//编辑页保存草稿
const editSaveExamDraft = getDataSecond('/exam/examAction!updateExamination.action');

//查询考试信息
const getExamInfo = getData('/exam/examAction!getExam.action');


/* -------------------- 在线编辑题库 -------------------- */
// 提交题库数据
const publishQuestions = getData('/examination/question/batchAddQuestion.do');

//设置页面
const getMenuSet = getData('/custommenus/custommenusAction!ajaxGetMenus.action');

// 获取考试统计可见
const getAvailSet = getData('/examination/exam/searchExamCountPower.do');

//保存考试统计可见
const saveAvailSet = getData('/examination/exam/saveExamCountPower.do')

/* -------------------- 数据 -------------------- */

//学分统计-表格数据
const getScoreStatistics = getData('/learn/train/getCreditRanking.do');

//学习统计-表格数据
const getLearnStatistics = getData('/learnonline/course/studyCountAction!ajaxSearchRanking.action');
//组织架构
const getContactAction = getData('/contact/contactAction!getRootNodeByUser.action');

const getDepartmentAction = getData('/department/departmentAction!listOrgNodeByParent.action');

//导出功能1
const getOutputAction1 = getData('/report/reportAction!checkReport.action');
const getOutputAction2 = getData('/report/reportAction!createReportTask.action');

//学分个人明细
const getScoreDetial = getData('/learn/train/creditDetail.do');

//学习个人明细页面-表格数据
const getLearnDetial = getData('/learnonline/course/studyCountAction!ajaxStudyDetail.action');

//学习个人明细页面-个人数据
const getLearnPersonalDetial = getData('/learnonline/course/studyCountAction!ajaxPersonalDetail.action');

//清空学分
const cleanCredit = getData('/learn/train/cleanCredit.do');

export default {
  getCategory,
  getCourseList,
  getCourseDetail,
  getCourseLink,
  getLearnProgerss,
  remindUnFinish,
  getLearnExamResult,
  getPaperTypes,
  getPaperList,
  getPaperPreview,
  getPaperPreviewRandom,
  judgeAllowPic,
  publishExam,
  saveExamDraft,
  editPublishExam,
  editSaveExamDraft,
  getExamInfo,
  publishQuestions,
  getScoreStatistics,
  getContactAction,
  getDepartmentAction,
  getOutputAction1,
  getOutputAction2,
  getScoreDetial,
  getLearnDetial,
  getLearnPersonalDetial,
  getLearnStatistics,
  cleanCredit,
  getMenuSet,
  getAvailSet,
  saveAvailSet
};
