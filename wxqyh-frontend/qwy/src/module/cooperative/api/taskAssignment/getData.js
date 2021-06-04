import axios from 'axios';

function commonPost(url,params,callback,status){
  dataBase.loading=true;
  axios.post(_.baseURL+url,params).then(function (result) {
    dataBase.loading=false;
    if (result.code == '0'){
      if (status){
        callback(result);
      }else {
        callback(result.data);
      }
    }else {
      dataBase.top_alert(result.desc,false,3000);
    }
  });
}

function commonGet(url,params,callback){
  dataBase.loading=true;
  axios.get(_.baseURL+url,params).then(function (result) {
    dataBase.loading=false;
    if (result.code == '0'){
      callback(result.data);
    }else {
      dataBase.top_alert(result.desc,false,3000);
    }
  });
}

/*任务分派列表页*/

// 获取任务类型
export function getTaskTemplate(cb) {
  commonPost('/task/taskMgrCtl/getTaskTemplate.do',{},cb)
}

// 获取任务列表数据
export function searchTaskData(params,cb) {
  commonPost('/task/taskMgrCtl/ajaxSearchTask.do',params,cb)
}

// 删除任务
export function delTask(params,cb) {
  commonPost('/task/taskMgrCtl/ajaxBatchDel.do',params,cb)
}

/* 任务分派设置页*/
// 获取任务设置项按钮开关
export function getTaskSettingInfo(params,cb) {
  commonPost('/task/taskMgrCtl/getSettingInfo.do',params,cb)
}

// 修改任务设置项按钮开关
export function updateTaskSetting(params,cb) {
  commonPost('/task/taskMgrCtl/updateSetting.do',params,cb)
}

// 获取任务发布权限设置
export function getTaskPermission(params,cb) {
  commonPost('/intercalate/intercalateAction!viewIntercalateTarget.action',params,cb)
}

// 更新任务发布权限设置
export function updateTaskPermission(id,params,cb) {
  commonPost('/intercalate/intercalateAction!ajaxUpdate.action?id='+id,params,cb)
}

// 获取工作日时间
export function getWorkTime(cb) {
  commonGet('/managesetting/managesettingAction!getWorkhourAndWorkTime.action',{params:{}},cb)
}

/*任务分派类型设置页*/

// 获取类型列表
export function searchTaskType(params,cb) {
  commonPost('/task/taskMgrCtl/ajaxSearchTemplate.do',params,cb)
}

// 启用/禁用任务类型
export function updateTypeStatus(params,cb) {
  commonPost('/task/taskMgrCtl/updateStatus.do',params,cb)
}

// 删除任务类型
export function deleteTaskType(params,cb) {
  commonPost('/task/taskMgrCtl/ajaxBatchDeleteTemplate.do',params,cb,true)
}

// 新增任务类型
export function addTaskType(params,cb) {
  commonPost('/task/taskMgrCtl/ajaxAddTemplate.do',params,cb)
}

// 获取任务类型数据
export function getTaskTypeData(params,cb) {
  commonPost('/task/taskMgrCtl/ajaxViewTemplate.do',params,cb)
}

// 更新任务类型
export function updateTaskType(params,cb) {
  commonPost('/task/taskMgrCtl/ajaxUpdateTemplate.do',params,cb)
}

// 获取任务高级设置
export function getSettingLabel(params,cb) {
  commonGet('/title/labels.do',{params:params},cb)
}

// 获取任务高级设置
export function isDealer(params,cb) {
  commonGet('/task/taskMgrCtl/ajaxIsDealer.do',{params:params},cb)
}

// 添加任务管理
export function addOrUpdTask(params,cb) {
  commonPost('/task/taskMgrCtl/ajaxAddOrUpdTask.do',params,cb)
}
// 获取任务管理信息
export function getTaskInfo(params,cb) {
  commonPost('/task/taskMgrCtl/ajaxGetTaskInfo.do',params,cb)
}

// 关闭任务
export function closeTask(params,cb) {
  commonPost('/task/taskMgrCtl/closeTask.do',params,cb)
}
