import axios from 'axios'
import Qs from 'qs';


axios.defaults.transformRequest=[function (data) {
  let agentCode = search('agentCode') || 'topic' ;
  let newData='';
  if(data != undefined){
    newData = Qs.stringify(data);
    newData += '&belongAgent=' + agentCode
  } else {
    newData = 'belongAgent=' + agentCode
  }
  return newData;
}];

//描述：初始化企微云文化
export function loadTeamWorkDetail(callback){
  commonGetData('/portal/qyservicePortalCtl/loadTeamWorkDetail.do',callback);
}

export function countViewMessage(params){
  axios.get(_.baseURL+'/portal/qyservicePortalCtl/countViewMessage.do',params);
}
//获取问卷
export function getSurvey(loadMore,url,callback){
  axios.post(_.baseURL+url,{
    ...loadMore
  }).then(function (result) {
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//关闭问卷
export function closeSurvey(id,callback){
  axios.post(_.baseURL+'/portal/questionnairCtl/closeQuestionnair.do',{
    id
  })
  .then(function (result) {
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//删除话题
export function deleteSurvey(ids,callback){
  axios.post(_.baseURL+'/portal/questionnair/questionnairAction!ajaxBatchDelete.action',{
    ids
  })
  .then(function (result) {
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//获取当前用户的草稿数量
export function getSurveyDraftNum(params,url,callback){
  axios.post(_.baseURL+url,{
    ...params
  })
  .then(function (result) {
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//获取话题
export function getTopic(loadMore,url,callback){
  axios.post(_.baseURL+url,{
    ...loadMore
  }).then(function (result) {
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}
//获取话题类型
export function getTopicType(callback){
  axios.post(_.baseURL+'/topic/topicAction!getTopicTypeList.action')
  .then(function (result) {
    if(result.code=='0'){
      callback(result);
    }else{
      _.alert('提示',result.desc);
    }
  })
}
//获取未阅话题
export function getUnreadTopic(callback){
  axios.post(_.baseURL+'/topic/topicAction!countUnReadTopic.action')
  .then(function (result) {
    if(result.code=='0'){
      callback(result);
    }else{
      _.alert('提示',result.desc);
    }
  })
}
//查询是否开启一键已阅功能
export function checkAllRead(callback){
  axios.post(_.baseURL+'/topic/topicAction!ajaxViewBatchReadState.action')
  .then(function (result) {
    if(result.code=='0'){
      if(result.data.isBatchRead){
        callback();
      }else{
        _.alert('提示','后台没有开启一键已阅功能<br>请联系管理员开启');
      }
    }else{
      _.alert('提示',result.desc);
    }
  })
}
//一键已阅
export function oneKeyRead(callback){
  axios.post(_.baseURL+'/topic/topicAction!batchRead.action')
  .then(function (result) {
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}
//删除话题
export function deleteTopic(topicIds,callback){
  axios.post(_.baseURL+'/topic/topicAction!deleteMyPublishTopic.action',{
    topicIds
  })
  .then(function (result) {
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}
//检查是否有评论
export function batchCheck(topicIds,callback){
  axios.post(_.baseURL+'/topic/topicAction!ajaxBatchCheck.action',{
    ids:topicIds
  })
  .then(function (result) {
    if(result.data.haveComment){
      _.alert('提示','该话题已存在评论内容，不可删除');
    }else{
      callback();
    }
  })
}
//获取待审核的话题数量
export function countTopicAuditNumber(callback){
  axios.post(_.baseURL+'/topic/topicAction!countTopicAuditNumber.action')
  .then(function (result) {
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}
//获取待审核的评论数量
export function countCommentAuditNumber(callback){
  axios.post(_.baseURL+'/topic/topicAction!countCommentAuditNumber.action')
  .then(function (result) {
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}
//判断是否有审核权限
export function checkPermission(callback){
  axios.post(_.baseURL+'/topic/topicAction!validPermission.action')
  .then(function (result) {
    if(result.code=='0'){
      callback(result.data);
    }
  })
}
//获取当前用户的草稿数量
export function getDraftNum(callback){
  axios.post(_.baseURL+'/topic/topicAction!getUserDrafTopicNumber.action')
  .then(function (result) {
    if(result.code=='0'){
      callback(result.data);
    }
  })
}

//查询当前用户是否有应用管理权限
export function checkManagement(callback){
  axios.post(_.baseURL+'/portal/qyservicePortalCtl/outPutCanEditAgent.do',{
    agentCode:'activity'
  }).then(function(result){
    if(result.code==='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc)
    }
  })
}

//获取开启的应用
export function getCustomAgent(callback){
  axios.post(_.baseURL+'/portal/qyservice/qyservicePortalAction!getCustomAgentDetail.action',{
    parentAgentCode:'activity'
  }).then(function(result){
    if(result.code==='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc)
    }
  })
}

//保存当前应用
export function saveAppChange(enableAgentCodes,callback){
  axios.post(_.baseURL+'/portal/qyservicePortalCtl/editOrgAgent.do',{
    parentAgentCode:'activity',enableAgentCodes:enableAgentCodes
  }).then(function(result){
    if(result.code==='0'){
      callback();
    }else{
      _.alert('提示',result.desc)
    }
  })
}


/*编辑页面*/
//判断链接是否有参数push，有就调用链接并将该参数传入
export function postPush(push){
  axios.post(_.baseURL+'/portal/qyservicePortalCtl/countViewMessage.do',{
    push:push
  }).then(function (result) {})
}

//获取话题的默认范围
export function getTarget(callback) {
  axios.post(_.baseURL+'/portal/managesetting!getTarget.action').then(function (result) {
    if(result.code==='0'){
      callback(result.data)
    }else {
      _.alert('提示','网络错误，请重试！');
    }
  })
}

//获取特定对象
export function checkDeptIsSpecific(callback) {
  axios.post(_.baseURL+'/portal/departmentAction!checkDeptIsSpecific.action')
  .then(function (result) {
    if(result.code==='0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  })
}

//查询是否有发表话题权限以及类型
export function getPermissionAndType(callback,failCallBack) {
  axios.post(_.baseURL+'/topic/topicAction!getPermission.action')
  .then(function (result) {
    if(result.code==='0'){
      callback(result.data);
    }else {
      failCallBack();
    }
  })
}

//查询是否有相同标题的话题
export function hasSameTitleTopic(title,sameCallback,unSameCallback){
  axios.post(_.baseURL+'/topic/topicAction!hasSameTitleTopic.action',{
    title
  })
  .then(function(result){
    if(result.code=='0'){
      if(result.data.hasTopic){
        sameCallback();
      }else{
        unSameCallback();
      }
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//发布话题或保存草稿
export function addOrUpdateTopic(url,commintData,callback){
  axios.post(_.baseURL+url,{
    ...commintData
  })
  .then(function(result){
    if(result.code=='0'){
      callback();
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//复制或编辑时获取话题信息
export function getTargetInfo(url,callback){
  axios.post(_.baseURL+url)
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//获取待审核的话题
export function getPagerTopicInfo(data,callback){
  axios.post(_.baseURL+'/topic/topicAction!getPagerTopicInfo.action',{
    ...data
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//通过审核
export function examineTopic(data,callback){
  axios.post(_.baseURL+'/topic/topicAction!ajaxReviewTopic.action',{
    ...data
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//获取待审核评论
export function getPagerCommentInfo(data,callback){
  axios.post(_.baseURL+'/topic/topicAction!getPagerCommentInfo.action',{
    ...data
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//通过评论审核
export function examineComment(data,callback){
  axios.post(_.baseURL+'/topic/topicAction!ajaxReviewComment.action',{
    ...data
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//获取话题详情
export function ajaxView(url,id,callback){
  axios.post(_.baseURL+url,{
    id
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//获取更多评论
export function listMoreComment(data,callback){
  axios.post(_.baseURL+'/topic/topicAction!listMoreComment.action',{
    ...data
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//添加评论
export function addTopicComment(reqData,callback){
  axios.post(_.baseURL+'/topic/topicAction!addTopicComment.action',{
    ...reqData
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//获取点赞人列表
export function getTopicPraisePager(data,callback){
  axios.post(_.baseURL+'/topic/topicAction!getTopicPraisePager.action',{
    ...data
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//点赞
export function topicPraise(id,callback){
  axios.post(_.baseURL+'/topic/topicAction!setPraise.action',{
    id
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//上一篇、下一篇
export function topicJump(data,callback){
  axios.post(_.baseURL+'/topic/topicAction!getNextTopic.action',{
    ...data
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//删除评论
export function deleteComment(commentId,callback){
  axios.post(_.baseURL+'/topic/topicAction!deleteComment.action',{
    commentId
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//后台是否开启推送消息
export function getOrgTopicConﬁg(callback){
  axios.post(_.baseURL+'/topic/topicAction!getOrgTopicConfig.action',{
    configKey:'topic_config_is_send_msg'
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//获取应用名称agentName
export function getAgentName(agentCodeStr,callback){
  axios.post(_.baseURL+'/portal/application/application!ajaxIsTrustAgentListForPortal.action',{
    agentCodes:agentCodeStr
  })
  .then(function (result) {
    if(result.code=='0'){
      callback(result);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//获取应用名称agentName
export function getTopicTypeVisibleTarget(topicTypeId,callback){
  axios.post(_.baseURL+'/topic/topicAction!getTopicTypeVisibleTarget.action',{
    topicTypeId
  })
  .then(function (result) {
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}






//活动接口

//查询草稿数量
export function ajaxActivityNum(callback){
  axios.post(_.baseURL+'/portal/activityManageAction!ajaxActivityNum.action')
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//查询首页列表数据
export function ajaxGetactivity(reqData,callback){
  axios.post(_.baseURL+'/portal/activityManageAction!ajaxGetactivity.action',{
    ...reqData
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//检查是否可以删除活动
export function ajaxBatchCheck(id,callback){
  axios.post(_.baseURL+'/portal/activityManageAction!ajaxBatchCheck.action',{
    ids:id
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}

//删除活动
export function ajaxBatchDelete(id,callback){
  axios.post(_.baseURL+'/portal/activityManageAction!ajaxBatchDelete.action',{
    ids:id
  })
  .then(function(result){
    if(result.code=='0'){
      callback(result.data);
    }else{
      _.alert('提示',result.desc);
    }
  })
}






//获取查询参数
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

function commonGetData(url,callback){
  _.showLoading('');
  axios.get(_.baseURL+url,{
    params:{
      'parentAgentCode':'activity',
      'topCount':3
    }
  }).then(function (result) {
    _.hideLoading('');
    if(result.code==='0'){
      callback(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

