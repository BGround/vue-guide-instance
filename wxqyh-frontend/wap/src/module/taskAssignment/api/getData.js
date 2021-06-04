import axios from 'axios';

export function countViewMessage(params){
  axios.get(_.baseURL+'/portal/qyservicePortalCtl/countViewMessage.do',params);
}

//获取任务权限
export function getTaskPermission(callback) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/getPermission.do').then(function (result) {
    if (result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}
//获取上下班时间
export function getWorkhour(callback){
  axios.get(_.baseURL+'/portal/managesetting!getWorkhourAndWorkTime.action').then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  });
}

//获取任务类型模板
export function getTaskTemplate(callback){
  axios.get(_.baseURL+'/portal/taskPortalCtl/getTaskTemplate.do').then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  });
}

// 根据模板标题翻译标题
export function getTitleTemp(data, cb) {
  axios.get(_.baseURL+'/portal/title/format.do', {
    params: {...data}
  }).then((result)=>{
    if(result.code == '0'){
      cb(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  })
}

//加载上次
export function loadLastIncharceData(selectType,callback) {
  axios.get(_.baseURL+'/portal/taskPortalCtl/loadLastPersonType.do?selectType='+selectType).then(function (result) {
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

//任务分派新增
export function taskAddSubmit(params,callback){
  axios.post(_.baseURL+'/portal/taskPortalCtl/ajaxAdd.do',params).then(function(result) {
    _.hideLoading();
    if (result.code == '0') {
      callback(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  });
}

//任务分派地点新增
export function taskAddPlace(params,callback){
  axios.post(_.baseURL+'/portal/taskPortalCtl/batchAddTaskAddress.do',params).then(function(result){
    if (result.code == '0') {
      callback(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  });
}

//任务分派地点历史列表
export function taskGetPlace(callback){
  axios.post(_.baseURL+'/portal/taskPortalCtl/getTaskAddressByUser.do').then((result)=>{
    if (result.code == '0') {
      callback(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  });
}

// 获取任务详情信息 9631166b-cc78-46f0-bb44-054402882487  c004b8fb-fc5d-4da9-b2ea-6383a13f2623/portal/taskPortalCtl/getTaskDetail.do
export function getTaskDetail(taskId,callback) {
  _.showLoading();
  axios.post(_.baseURL+'/portal/taskPortalCtl/getTaskDetail.do',{taskId:taskId,size:5}).then((result)=>{
    _.hideLoading();
    callback(result);
  })
}

// 获取进度详情
export function getRateDetail(params,callback) {
  axios.post(_.baseURL+'/portal/taskinfoAction!getRateDetailed.action',params).then((result)=>{
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 查看所有进度
export function getAllTaskRate(params,callback) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/allTaskRate.do',params).then((result)=>{
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 催办
export function urgentRemind(params,callback) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/remindRecNow.do',params).then((result)=>{
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 催办未完成
export function urgentUnOver(params,callback) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/remindUnOver.do',params).then((result)=>{
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 更新进度
export function updateRate(params,callback) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/updateRate.do',params).then((result)=>{
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 更新子任务进度
export function updateSubRate(params,callback) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/updateSubtaskRate.do',params).then((result)=>{
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 实时更新
export function liveUpdateTask(params,callback) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/updateTaskPO.do',params).then((result)=>{
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 新增负责人、相关人
export function updateInchargesRelative(params,callback) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/batchInsertTaskRecipient.do',params).then((result)=>{
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 删除负责人、相关人
export function deleteRecipient(params,cb) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/deleteRecipient.do',params).then((result)=>{
    if (result.code == '0'){
      cb(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 删除负责人、相关人
export function updateTaskIncharges(params,callback) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/updateTaskIncharges.do',params).then((result)=>{
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 更新任务提醒
export function updateRemindTask(params,callback) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/updateRemindTask.do',params).then((result)=>{
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 获取子任务详情
export function getSubTaskDetail(subtaskId,callback) {
  _.showLoading();
  axios.post(_.baseURL+'/portal/taskPortalCtl/getSubtaskDetail.do',{subtaskId:subtaskId,size:5}).then((result)=>{
    _.hideLoading();
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 更新编辑子任务
export function editSubTask(params, cb) {
  axios.post(_.baseURL + '/portal/taskPortalCtl/updateSubTask.do', params).then((result) => {
    if (result.code == '0') {
      cb(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  })
}

// 修改子任务负责人
export function updateSubtaskIncharge(params,cb) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/updateSubIncharge.do',params).then((result) => {
    if (result.code == '0') {
      cb(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  })
}

// 新增子任务执行人执行人
export function addSubTaskIncharges(params, cb) {
  axios.post(_.baseURL + '/portal/taskPortalCtl/batchInsertSubUser.do', params).then((result) => {
    if (result.code == '0') {
      cb(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  })
}

// 新增子任务
export function addSubTask(params,cb) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/addSubTask.do',params).then((result) => {
    if (result.code == '0') {
      cb(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  })
}

// 新增附件图片
export function updateTaskPic(params,cb) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/insertTaskPicOrFile.do',params).then((result) => {
    if (result.code == '0') {
      cb(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  })
}

// 删除图片
export function delePic(params, cb) {
  axios.post(_.baseURL + '/portal/imageupload/imageUploadAction!doDelFile.action', params).then((result) => {
    if (result.code == '0') {
      cb(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  })
}

// 删除附件图片
export function deleteTaskPic(params,cb) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/deleteTaskPicOrFile.do',params).then((result) => {
    if (result.code == '0') {
      cb(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  })
}

// 加载更多评论
export function loadMoreComment(params,callback) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/listComment.do',params).then((result)=>{
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 新增评论
export function addCommentList(data, cb) {
  axios.post(_.baseURL + "/portal/taskinfoAction!commitComment.action", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      _.tooltips_succeed("评论成功");
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

// 删除评论
export function deleteCommentList(data, cb) {                                  //删除评论
  axios.post(_.baseURL + "/portal/taskPortalCtl/deleteComment.do", {
    ...data
  }).then(function (result) {
    if (result.code === '0') {
      _.tooltips_succeed("删除成功");
      cb(result)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

// 复制任务
export function getTaskHistoryInfo(params,cb) {
  axios.post(_.baseURL + '/portal/taskPortalCtl/getTaskHistoryInfo.do',params).then((result)=>{
    if (result.code == '0'){
      cb(result.data);
    }else {
      // cb(result.data);
      _.alert('提示',result.desc);
    }
  })
}

// 任务评分
export function updateTaskScore(params,cb) {
  axios.post(_.baseURL + '/portal/taskPortalCtl/updateScore.do').then((result)=>{
    if (result.code == '0'){
      cb(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 获取负责人或执行人工时列表
export function getWorkHourPerson(params,cb) {
  axios.post(_.baseURL + '/portal/taskPortalCtl/getWorkHourPerson.do',params).then((result)=>{
    if (result.code == '0'){
      cb(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

// 详情页更改主任务负责人、子任务执行人预计工时
export function updateWorkHour(params,cb) {
  axios.post(_.baseURL + '/portal/taskPortalCtl/updateWorkHour.do',params).then((result)=>{
    if (result.code == '0'){
      cb(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}
// 子任务提交
export function dealerFeedback(params,cb){
	axios.post(_.baseURL + '/portal/taskPortalCtl/dealerFeedback.do',params).then((result)=>{
	  if (result.code == '0'){
	    cb(result.data);
	  }else {
	    _.alert('提示',result.desc);
	  }
	})
}
// 审批接口
export function subTaskApproval(params,cb){
	axios.post(_.baseURL + '/portal/taskPortalCtl/subTaskApproval.do',params).then((result)=>{
	  if (result.code == '0'){
	    cb(result.data);
	  }else {
	    _.alert('提示',result.desc);
	  }
	})
}

