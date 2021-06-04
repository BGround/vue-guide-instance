const state = {
  taskPermission:'',// 任务权限
  startTime:'',// 主任务开始时间
  stopTime:'',// 主任务截止时间
  subStartTime:'',// 子任务开始时间
  subStopTime:'',// 子任务截止时间
  mainAddContentModuleShow:'',// 主任务添加内容模块
  relevantPersonDisplay:false,// 任务相关人
  placeDisplay:false,// 任务地点模块
  remindDisplay:false, // 任务提醒模块
  subTaskDisplay:false, // 子任务模块
  enclosurePicDisplay:false, // 图片附件模块
  imageDisplay:false,// 图片模块
  subAddContentModuleShow:false, // 子任务添加模块
  subEnclosurePicDisplay:false, // 子任务附件图片模块
  subImageDisplay:false, // 子任务图片模块
  subTaskNumber:'',// 子任务编号
  subTaskTitleFormat:'',// 子任务标题
  subTaskContentFormat:'',// 子任务内容
  rateDisplay:false, // 进度反馈模块
  rateAddContentDisplay:true,
  priorityDisplay:true,
  mainModuleNum:0,// 主任务模块数量
  subModuleNum:0,// 子任务模块数量
  mainIncharges:[],// 主任务负责人
  initDataFinished:false,
  changeSubTaskTime:false,
  subTaskNum:0,// 子任务数量
  taskRate:0,// 进度反馈
  mainEnclosurePicAddContentDisplay:true,
  subEnclosurePicAddContentDisplay:true,

  //任务详情页数据
  taskId:'',// 主任务id
  orgId:'',// orgId
  isDetailPage:false, // 是否是详情页面
  remindRender:false,// 是否详情页任务提醒
  taskLevel:'',// 任务权限
  hasPermission:false,// 拥有编辑权限
  personName:'',// 任务创建者
  // isMainIncharge:false,// 是否主任务的负责人
  isIncharge:false,// 是否是负责人
  // mainUrgentPermission:false,// 主任务催办权限
  urgentPermission:false,// 子任务催办权限
  updateRateShow:false,// 更新进度弹框
  switchControl:[],// 提醒按钮开关
  remindSwitch:false,// 重复提醒按钮开关
  subTaskPage:false,// 是否是子任务页面
  addSubTaskPage:false,// 是否是新增子任务页面
  subLoadFinish:false,// 子任务数据加载完成
  subtaskId:'',// 子任务id
  oldTaskStatus:1,// 任务状态，1：新建，0：草稿
  operationRecord:[],// 操作记录
  liveCommentList:[],// 实时更新的评论（更新进度）
  taskOver: false,// 任务是否已结束（子任务、主任务通用）
  mainTaskOver:false,// 记录主任务是否结束
  mainScore:false,// 是否已评分
  subScore:false,// 子任务是否已评分
  scoreInfo:null,// 主任评分信息
  subtaskScoreList:[],// 子任务评分列表
  subRate:0,
  subTotalRate:100,
  subtaskTitle:'',// 子任务标题

  // 复制页面数据
  isCopyPage:false,// 是否复制页面
  isDraftPage:false,// 是否草稿编辑页面

  // 子任务页面
  subTaskData:{// 子任务数据
    "subtask":[]
  },
  subTaskDetailData:[],// 子任务详情数据
  subTaskFileList:[],// 子任务附件图片列表
};

const getters = {
  hasPermission:state => state.hasPermission,
  subTaskData:state => state.subTaskData,
  subTaskDetailData:state => state.subTaskDetailData,
  subTaskFileList:state => state.subTaskFileList,
  subtaskTitle:state => state.subtaskTitle,
  isCopyPage:state => state.isCopyPage,
  isDraftPage:state => state.isDraftPage,
  subRate:state => state.subRate,
  subTotalRate:state => state.subTotalRate,
  subScore:state => state.subScore,
  scoreInfo:state => state.scoreInfo,
  subtaskScoreList:state => state.subtaskScoreList,
  taskPermission:state => state.taskPermission,
  startTime:state => state.startTime,
  stopTime:state => state.stopTime,
  subStartTime:state => state.subStartTime,
  subStopTime:state => state.subStopTime,
  mainAddContentModuleShow:state => state.mainAddContentModuleShow,
  subAddContentModuleShow:state => state.subAddContentModuleShow,
  relevantPersonDisplay:state => state.relevantPersonDisplay,
  placeDisplay:state => state.placeDisplay,
  remindDisplay:state => state.remindDisplay,
  subTaskDisplay:state => state.subTaskDisplay,
  enclosurePicDisplay:state => state.enclosurePicDisplay,
  imageDisplay:state => state.imageDisplay,
  subEnclosurePicDisplay:state => state.subEnclosurePicDisplay,
  subImageDisplay:state => state.subImageDisplay,
  rateDisplay:state => state.rateDisplay,
  priorityDisplay:state => state.priorityDisplay,
  subTaskNumber:state => state.subTaskNumber,
  subTaskTitleFormat:state => state.subTaskTitleFormat,
  subTaskContentFormat:state => state.subTaskContentFormat,
  mainModuleNum:state => state.mainModuleNum,
  subModuleNum:state => state.subModuleNum,
  mainIncharges:state => state.mainIncharges,
  initDataFinished:state => state.initDataFinished,
  changeSubTaskTime:state => state.changeSubTaskTime,
  subTaskNum:state => state.subTaskNum,
  taskRate:state => state.taskRate,
  rateAddContentDisplay:state => state.rateAddContentDisplay,
  mainEnclosurePicAddContentDisplay:state => state.mainEnclosurePicAddContentDisplay,
  subEnclosurePicAddContentDisplay:state => state.subEnclosurePicAddContentDisplay,
  taskId:state => state.taskId,
  orgId:state => state.orgId,
  isDetailPage:state => state.isDetailPage,
  personName:state => state.personName,
  remindRender:state => state.remindRender,
  taskLevel:state => state.taskLevel,
  updateRateShow:state => state.updateRateShow,
  switchControl:state => state.switchControl,
  remindSwitch:state => state.remindSwitch,
  subTaskPage:state => state.subTaskPage,
  addSubTaskPage:state => state.addSubTaskPage,
  isIncharge:state => state.isIncharge,
  subtaskId:state => state.subtaskId,
  oldTaskStatus:state => state.oldTaskStatus,
  urgentPermission:state => state.urgentPermission,
  subLoadFinish:state => state.subLoadFinish,
  operationRecord:state => state.operationRecord,
  liveCommentList:state => state.liveCommentList,
  taskOver:state => state.taskOver,
  mainTaskOver:state => state.mainTaskOver,
  mainScore:state => state.mainScore,
};

const mutations = {
  taskDataStatusInit(state){
    state.startTime = '';// 主任务开始时间
    state.stopTime = '';// 主任务截止时间
    state.subStartTime = '';// 子任务开始时间
    state.subStopTime = '';// 子任务截止时间
    state.isDetailPage = false;// 详情页
    state.isCopyPage = false;// 复制页
    state.isDraftPage = false;// 草稿编辑页
    state.subTaskPage = false;// 子任务编辑页面
    state.relevantPersonDisplay = false;
    state.placeDisplay = false;
    state.rateDisplay = false;
    state.remindDisplay = false;
    state.enclosurePicDisplay = false;
    state.imageDisplay = false;
    state.subTaskDisplay = false;
    state.initDataFinished = false;
    state.rateAddContentDisplay = true;
    state.mainEnclosurePicAddContentDisplay = true;
    state.isIncharge = false;
    state.updateRateShow = false;
    state.urgentPermission = false;
    state.taskOver = false;
    state.addSubTaskPage = false;
    state.mainTaskOver = false;
    state.subTaskNum = 0;
    state.mainTaskOver = false;// 记录主任务是否结束
    state.mainScore = false;// 是否已评分
    state.subScore = false;// 子任务是否已评分
    state.scoreInfo = null;// 主任评分信息
    state.subtaskScoreList = [];// 子任务评分列表
    state.subRate = 0;
    state.subTotalRate = 100;
    state.subTaskData = {
      "subtask":[]
    };
    state.subTaskDetailData = [];
    state.subTaskFileList = [];
    state.subTaskNumber = '';
    state.subTaskTitleFormat = '';
    state.subTaskContentFormat = '';
  },
  hasPermissionUpdate(){
    state.hasPermission = !state.isDetailPage || state.addSubTaskPage || ((state.taskLevel == 'a1' || (state.subTaskPage && state.urgentPermission)) && !state.taskOver)
  },
  subTaskDataUpdate(state,obj){
    state.subTaskData = obj;
  },
  subTaskDetailDataUpdate(state,arr){
    state.subTaskDetailData = arr;
  },
  subTaskFileListUpdate(state,arr){
    state.subTaskFileList = arr;
  },
  subtaskTitleUpdate(state,val){
    state.subtaskTitle = val;
  },
  isCopyPageUpdate(state,val){
    state.isCopyPage = val;
  },
  isDraftPageUpdate(state,val){
    state.isDraftPage = val;
  },
  subTotalRateUpdate(state,val){
    state.subTotalRate = val;
  },
  subRateUpdate(state,val){
    state.subRate = val;
  },
  mainScoreUpdate(state,val){
    state.mainScore = val;
  },
  subScoreUpdate(state,val){
    state.subScore = val;
  },
  scoreInfoUpdate(state,val){
    state.scoreInfo = val;
  },
  subtaskScoreListUpdate(state,val){
    state.subtaskScoreList = val;
  },
  taskPermissionUpdate(state,data){
    state.taskPermission = data;
  },
  startTimeHandler(state,startTime){
    state.startTime = startTime;
  },
  stopTimeHanlder(state,stopTime){
    state.stopTime = stopTime;
  },
  subStartTimeHandler(state,startTime){
    state.subStartTime = startTime;
  },
  subStopTimeHanlder(state,stopTime){
    state.subStopTime = stopTime;
  },
  startTimeUpdate(state,startTime){
    state.startTime = startTime;
  },
  stopTimeUpdate(state,stopTime){
    state.stopTime = stopTime;
  },
  subStartTimeUpdate(state,startTime){
    state.subStartTime = startTime;
  },
  subStopTimeUpdate(state,stopTime){
    state.subStopTime = stopTime;
  },
  personNameUpdate(state,val){
    state.personName = val;
  },
  mainAddContentModuleShowUpdate(state){
    state.mainAddContentModuleShow = true;
  },
  mainAddContentModuleHideUpdate(state,boolean){
    if (!boolean){
      state.mainModuleNum = --state.mainModuleNum;
    }
    state.mainAddContentModuleShow = false;
  },
  subAddContentModuleShowUpdate(state){
    state.subAddContentModuleShow = true;
  },
  subAddContentModuleHideUpdate(state){
    state.subModuleNum = --state.subModuleNum;
    state.subAddContentModuleShow = false;
  },
  relevantPersonDisplayUpdate(state,val){
    state.relevantPersonDisplay = val;
  },
  placeDisplayUpdate(state){
    state.placeDisplay = true;
  },
  placeDisplayUpdateHide(state){
    state.placeDisplay = false;
  },
  remindDisplayUpdate(state){
    state.remindDisplay = true;
  },
  remindDisplayUpdateHide(state){
    state.remindDisplay = false;
  },
  subTaskDisplayUpdate(state){
    state.subTaskDisplay = true;
  },
  subTaskDisplayUpdateHide(state){
    state.subTaskDisplay = false;
  },
  enclosurePicDisplayUpdate(state){
    state.enclosurePicDisplay = true;
  },
  imageDisplayUpdate(state,val){
    state.imageDisplay = val;
  },
  enclosurePicDisplayUpdateHide(state){
    state.enclosurePicDisplay = false;
  },
  subEnclosurePicDisplayUpdate(state){
    state.subEnclosurePicDisplay = true;
  },
  subEnclosurePicDisplayUpdateHide(state){
    state.subEnclosurePicDisplay = false;
  },
  subImageDisplayUpdate(state,val){
    state.subImageDisplay = val;
  },
  rateDisplayUpdate(state){
    state.rateDisplay = true;
  },
  rateDisplayUpdateHide(state){
    state.rateDisplay = false;
  },
  priorityDisplayUpdate(state){
    state.priorityDisplay = true;
  },
  priorityDisplayUpdateHide(state){
    state.priorityDisplay = false;
  },
  subTaskNumberUpdate(state,val){
    state.subTaskNumber = val;
  },
  subTaskTitleFormatUpdate(state,val){
    state.subTaskTitleFormat = val;
  },
  subTaskContentFormatUpdate(state,val){
    state.subTaskContentFormat = val;
  },
  mainModuleNumUpdate(state){
    state.mainModuleNum = parseInt(window.sessionStorage.getItem('mainModuleNum'))
  },
  subModuleNumUpdate(state){
    state.subModuleNum = parseInt(window.sessionStorage.getItem('subModuleNum'))
  },
  updateMainIncharges(state,val){
    state.mainIncharges = val;
  },
  initDataFinishedUpdate(state,val){
    state.initDataFinished = val;
  },
  changeSubTaskTimeUpdate(state,val){
    state.changeSubTaskTime = val;
  },
  subTaskNumUpdate(state,val){
    state.subTaskNum = val;
  },
  taskRateUpdate(state,val){
    state.taskRate = val;
  },
  rateAddContentDisplayUpdateHide(state){
    state.rateAddContentDisplay = false;
  },
  mainEnclosurePicAddContentDisplayUpdateHide(state){
    state.mainEnclosurePicAddContentDisplay = false;
  },
  subEnclosurePicAddContentDisplayUpdate(state,val){
    state.subEnclosurePicAddContentDisplay = val;
  },
  taskIdUpdate(state,val){
    state.taskId = val;
  },
  orgIdUpdate(state,val){
    state.orgId = val;
  },
  isDetailPageUpdate(state,val){
    state.isDetailPage = val;
  },
  remindRenderUpdate(state,val){
    state.remindRender = val;
  },
  taskLevelUpdate(state,val){
    state.taskLevel = val;
  },
  changeUpdateRateShow(state,val){
    state.updateRateShow = val;
  },
  switchControlUpdate(state,array){
    array.forEach((item)=>{
      state.switchControl.push(item.onOff)
    })
    // state.switchControl = array;
  },
  remindSwitchUpdate(state,val){
    state.remindSwitch = val;
  },
  subTaskPageUpdate(state,val){
    state.subTaskPage = val;
  },
  addSubTaskPageUpdate(state,val){
    state.addSubTaskPage = val;
  },
  isInchargeUpdate(state,val){
    state.isIncharge = val;
  },
  subtaskIdUpdate(state,val){
    state.subtaskId = val;
  },
  oldTaskStatusUpdate(state,val){
    state.oldTaskStatus = val;
  },
  urgentPermissionUpdate(state,val){
    state.urgentPermission = val;
  },
  subLoadFinishUpdate(state,val){
    state.subLoadFinish = val;
  },
  operationRecordUpdate(state,arr){
    state.operationRecord = arr;
  },
  liveCommentListUpdate(state,arr){
    state.liveCommentList = arr;
  },
  taskOverUpdate(state,val){
    state.taskOver = val;
  },
  mainTaskOverUpdate(state,val){
    state.mainTaskOver = val;
  }
};

export default {
  state,
  getters,
  mutations,
}
