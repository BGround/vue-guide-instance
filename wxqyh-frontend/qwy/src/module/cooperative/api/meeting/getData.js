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

/* 会议助手列表页 */

// 获取会议列表
export function searchMeetingList (params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!ajaxSearch.action',params,cb)
}

// 删除会议
export function deleteMeeting(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!ajaxBatchDel.action',params,cb)
}

// 获取所有会议室
export function getAllMeetingRoom(cb) {
  commonPost('/meetinginfo/meetinginfoAction!searchAllRoom.action',{},cb)
}

/* 会议纪要页 */

// 获取会议纪要列表
export function searchSummaryList(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!searchSummaryList.action',params,cb)
}

// 删除会议纪要
export function deleteSummary(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!batchDeleteSummary.action',params,cb)
}

/* 会议设置页 */

// 获取会议设置按钮开关
export function getMeetingSetting(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!getMeettingQuickmark.action',params,cb)
}

// 更新会议设置按钮开关
export function updateMeetingSetting(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!updateMeettingQuickmark.action',params,cb)
}

// 获取签到、签退设置
export function getSignInSetting(cb) {
  commonPost('/meetinginfo/meetinginfoAction!getMeettingQuickmark.action',{},cb)
}

// 更新签到、签退设置
export function updateSignInSetting(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!updateMeettingQuickmark.action',params,cb)
}

// 获取会议权限与时长设置
export function getMeetPermAndTime(cb) {
  commonPost('/meetinginfo/meetinginfoAction!getPublishAuthor.action',{},cb)
}

// 修改会议权限与时长设置
export function updateMeetPermAndTime(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!updatePublishAuthor.action',params,cb)
}

/* 会议室设置页面 */

// 查询所有区域
export function searchAllRegions(cb) {
  commonPost('/meetinginfo/meetinginfoAction!searchAllRegions.action',{},cb)
}

// 查询区域内会议室列表
export function searchRegionRoom(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!ajaxRegionRoom.action',params,cb)
}

// 新增、编辑区域
export function addOrEditRegion(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!addOrEditRegion.action',params,cb)
}

// 删除区域
export function deleteRegion(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!delRegion.action',params,cb)
}

/* 会议室 */

// 启用、禁用会议室
export function updateMeetRoomStatus(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!updateStatus.action',params,cb)
}

// 删除会议室
export function deleteMeetingRoom(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!ajaxBatchDelete.action',params,cb)
}

// 校验设备号
export function checkSignageId(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!ajaxCheckSignageId.action',params,cb,true)
}

// 校验审批人
export function isNeedAudit(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!judgeAuditNumber.action',params,cb)
}

// 新增会议室
export function addMeetingRoom(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!ajaxAddRoom.action',params,cb)
}

// 查看会议室详情
export function viewMeetRoom(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!ajaxViewRoom.action',params,cb)
}

// 编辑会议室
export function editMeetingRooom(params,cb) {
  commonPost('/meetinginfo/meetinginfoAction!ajaxUpdateRoom.action',params,cb)
}
