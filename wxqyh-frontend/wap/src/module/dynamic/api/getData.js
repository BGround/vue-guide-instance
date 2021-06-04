import axios from 'axios'

function commonPost(url,params,callback,showLoading=true,loadingTips=''){
  if(showLoading){
    _.showLoading(loadingTips);
  }
  axios.post(_.baseURL+url,params).then(function (result) {
    _.hideLoading('');
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  });
}

// 获取发布权限
export function getPermission(id, callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!getPermission.action',{
    belongAgent: dataBase.wxqyh_uploadfile.agent,
    id: id
  }).then(function (result) {
    _.hideLoading('');
    callback(result);
  })
}

// 获取搜索框的切换选项
export function getDynamicType(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!getDynamicType.action',{
    isForSelect: 0,
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 手机端点击【立即体验】时，获取用户身份（新接口）
export function getUserTypeForBless(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/DynamicPortalCtl/getUserTypeForBless.do').then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//获取页面标题
export function getTitle(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/application/application!ajaxIsTrustAgentForPortal.action',{
    agentCode:dataBase.wxqyh_uploadfile.agent,
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//获取动态审核数量
export function getDynamicNum(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/dynamicinfo/dynamicinfoAction!getDynamicAuditCount.action',{
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//获取评论审核数量
export function getCommentNum(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/dynamicinfo/dynamicinfoAction!getCommentAuditCount.action',{
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//获取我发布的数量
export function getMyPublishNum(callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!getMyPublishCountInfo.action',{
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//查询后台设置是否可以一键已阅
export function markUnreadPower(callback) {
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!ajaxViewBatchReadState.action',{
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      callback(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//一键已阅
export function markUnread(callback) {
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!batchRead.action',{
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('标记成功')
      callback(result)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//删除草稿
export function deleteDraft(id, callback) {
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!batchDel.action',{
    ids:id,
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('删除成功')
    }else {
      _.alert('提示',result.desc)
    }
    callback(result)
  })
}

//通过或删除评论
export function passComment(id, status, callback) {
  axios.post(_.baseURL+'/portal/dynamicinfo/dynamicinfoAction!auditComment.action',{
    ids:id,
    isPassReview:status,
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      callback(result)
    }else {
      _.alert('提示',result.desc)
    }
  })
}
//通过动态
export function passDynamic(id, status, callback) {
  _.showLoading('加载中', true);
  axios.post(_.baseURL+'/portal/dynamicinfo/dynamicinfoAction!auditDynamic.action',{
    ids:id,
    isPassReview:status,
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    if(result.code==='0'){
      callback(result)
    }else {
      _.alert('提示',result.desc)
    }
  }).finally(()=>{
      _.hideLoading('');
  })
}

/*发布页面 */
// 获取新闻类型
export function getEditDynamicType(callback) {
  _.showLoading('加载中', true);
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!getDynamicType.action',{
    isForSelect: 1,
    belongAgent: dataBase.wxqyh_uploadfile.agent
  }).then(function (result) {
    _.hideLoading('');
    if(result.code==='0'){
      callback(result);
    }else {
      _.alert('提示',result.desc)
    }
  })
}
// 根据ids获取部门和人员
export function getDeptAndUser(deptIds, userIds, callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/departmentAction!getDeptsAndUsers.action',{
    deptIds: deptIds,
    userIds: userIds
  }).then(function (result) {
    _.hideLoading('');
    if(result.code==='0'){
      callback(result);
    }else {
      _.alert('提示',result.desc)
    }
  })
}
// 获取新闻详情
export function getDynamicDetail(dataPost, callback) {
  _.showLoading('加载中', true);
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!getDynamicDetail.action',dataPost)
  .then(function (result) {
    _.hideLoading('');
    if(result.code==='0'){
      callback(result);
    }else {
      _.alert('提示',result.desc)
    }
  })
}
// 发布或保存
export function saveAndpublishDynamic(url, dataPost, callback) {
  _.showLoading('提交中')
  axios.post(_.baseURL+url,dataPost)
  .then(function (result) {
    _.hideLoading('');
    if(result.code==='0'){
      callback(result);
    }else {
      _.alert('提示',result.desc)
    }
  })
}

// 获取新闻公告点赞列表
export function getPraiseList(dataPost, callback) {
  _.showLoading('');
  axios.post(_.baseURL+'/portal/dynamicinfo/dynamicinfoAction!getDynamicPraisePager.action',dataPost)
  .then(function (result) {
    _.hideLoading('');
    if(result.code==='0'){
      callback(result);
    }else {
      _.alert('提示',result.desc)
    }
  })
}

// 获取员工祝福列表
export function getBlessList(dataPost, callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/dynamicinfomanage/dynamicinfomanageAction!ajaxTemplateNews.action',dataPost)
  .then(function (result) {
    _.hideLoading('');
    if(result.code==='0'){
      callback(result);
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//获取创建者
export function getCreator(dataPost, callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/dynamicinfo/dynamicinfoAction!getDynamicCreator.action',dataPost)
  .then(function (result) {
    _.hideLoading('');
    if(result.code==='0'){
      callback(result);
    }else {
      _.alert('提示',result.desc)
    }
  })
}

// 提醒未阅读
export function sendMsgToUnRead(dataPost, callback) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/dynamicinfo/dynamicinfoAction!sendMsgToUnRead.action',dataPost)
  .then(function (result) {
    _.hideLoading('');
    if(result.code==='0'){
      callback(result);
    }else {
      _.alert('提示',result.desc)
    }
  })
}
// 获取管理后台是否开启全局水印
export function checkIsOpenWaterMark(agentCode,callback) {
  _.showLoading('')
  axios.get(_.baseURL+'/portal/contact/contactOtherPortalCtl/isOpenWaterMark.do?agentCode='+agentCode)
  .then(function (result) {
    _.hideLoading('');
    if(result.code==='0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc)
    }
  })
}

// 发表评论
export function addComment(params,callback){
  commonPost('/portal/dynamicinfo/dynamicinfoAction!addDynamicInfoComment.action',params,callback,true,'评论发送中')
}

// 审核评论
export function auditComment(belongAgent,params,callback){
  commonPost('/portal/dynamicinfo/dynamicinfoAction!auditComment.action?belongAgent='+belongAgent,params,callback)
}

// 删除评论
export function deleteComment(belongAgent,params,callback){
  commonPost('/portal/dynamicinfo/dynamicinfoAction!deleteComment.action?belongAgent='+belongAgent,params,callback)
}

// 更多评论
export function getMoreComment(isOpen,belongAgent,params,callback){
  let url = isOpen ? '/open/dynamicinfo/dynamicinfoAction!listComment.action':
  '/portal/dynamicinfo/dynamicinfoAction!listMoreComment.action?belongAgent='+belongAgent;
  commonPost(url,params,callback,false)
}
