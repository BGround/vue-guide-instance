import axios from 'axios'
//选项卡切换
// 获取月季年数据
export function getCountBriefing(keyWord,cb) {
  // _.showLoading('')
  return axios.post(_.baseURL+'/portal/clientAction!countCrmDateBriefing.action',
    keyWord
  ).then(function (result) {
    if(result.code==='0'){
      // _.hideLoading('');
      cb(result.data)
    }else {
      // _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

 // 获取红点未读数据
export function getCrmBriefing(callback) {
  // _.showLoading('')
  return axios.get(_.baseURL+'/portal/clientAction!getCrmDateBriefing.action').then(function (result) {
    if(result.code==='0'){
      // _.hideLoading('');
      callback(result.data)
    }else {
      // _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

 // 新增客户
export function getClientBriefing(callback) {
  _.showLoading('')
  return axios.get(_.baseURL+'/portal/clientAction!getClientItem.action').then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 判断客户是否存在
export function getValidClientName(keyWord,cb) {
  return axios.post(_.baseURL+'/portal/clientAction!validClientName.action',
  keyWord
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

// 加载上次联系人
export function getOldGivenList(keyWord,cb) {
  return axios.post(_.baseURL+'/portal/clientAction!getOldGivenList.action',
  keyWord
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

// 详情页接口
export function getClientDetail(keyWord,cb) {
  return axios.post(_.baseURL+'/portal/clientAction!searchClientAdvanced.action',
  keyWord
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      cb(result.desc)
    }
  })
}

// 新增客户
export function getAddClient(params,cb) {
  _.showLoading('提交中')
  return axios.post(_.baseURL+'/portal/clientAction!ajaxAdd.action',
  params
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc,'确定');
    }
    _.hideLoading('');
  })
}

// 编辑客户列表
export function getClientHistoryInfo(params,cb) {
  return axios.post(_.baseURL+'/portal/clientAction!getClientHistoryInfo.action',
  params
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      cb(result.desc)
    }
  })
}

// 验证手机号重复
export function getValidPhone(params,cb) {
  return axios.post(_.baseURL+'/portal/clientAction!validPhone.action',
  params
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.code)
    }else{
      _.alert('提示',result.desc,'确定')
      cb(result.code)
    }
  })
}

// 获取当前用户的信息
export function addUserTo(params){
  return axios.post(`${_.baseURL}/portal/contactAction!getPersonInfoByUserId.action`,params);
}

// 获取客户类别列表信息
export function getTypeList(params,cb){
  return axios.post(`${_.baseURL}/portal/clientAction!getTypeList.action`,params
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else{
      _.alert('提示',result.desc,'确定');
    }
  })
}

// 获取客户列表
export function getClientList (params) {
  return axios.post(`${_.baseURL}/portal/clientAction!searchClientAdvanced.action`, params);
}

// 获取未阅客户信息数量
export function getNotReadNum () {
  return axios.post(`${_.baseURL}/portal/clientAction!countNotRead.action`);
}

// 标记已阅
export function readAll () {
  return axios.post(`${_.baseURL}/portal/clientAction!updateAllReadStatus.action`);
}

// 获取商机阶段
export function getBussinessStage () {
  return axios.post(`${_.baseURL}/portal/businessAction!getBusinessStage.action`);
}

// 获取合同状态
export function getContractStatus () {
  return axios.post(`${_.baseURL}/portal/contractAction!getContractStatusList.action`);
}

// 获取所属公海列表信息
export function getPoolList(params,cb){
  return axios.post(`${_.baseURL}/portal/clientAction!getMyClientPoolList.action`,params
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else{
      _.alert('提示',result.desc,'确定');
    }
  })
}

// 获取行业列表信息
export function getIndustryList(params,cb){
  return axios.post(`${_.baseURL}/portal/industry/getIndustryList.do`,params
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else{
      _.alert('提示',result.desc,'确定');
    }
  })
}
// 客户编辑更新提交
export function getClientUpdate(params,cb){
  _.showLoading('提交中')
  return axios.post(`${_.baseURL}/portal/clientAction!ajaxUpdate.action`,params
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else{
      _.alert('提示',result.desc,'确定');
    }
    _.hideLoading('')
  })
}
// 客户能否选择多个负责人
export function getPhotoSetting(params,cb){
  return axios.post(`${_.baseURL}/portal/intercalateAction!getPhotoSetting.action`,params
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else{
      _.alert('提示',result.desc,'确定');
    }
  })
}

// 新增联系人
export function addContacts(params,cb){
  return axios.post(`${_.baseURL}/portal/contactsAction!getOptionItem.action`,params
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else{
      _.alert('提示',result.desc,'确定');
    }
  })
}

// 获取客户类型父级列表
export function getClientTypeList(params){
  return axios.post(`${_.baseURL}/portal/clientAction!ajaxPagerType.action`, params);
}

// 获取客户类型子级列表
export function getChildTypeList(params){
  return axios.post(`${_.baseURL}/portal/clientAction!getChildTypeAndClient.action`, params);
}

//客户详情页面
export function getClientDetails(obj,callback) {
  axios.post(_.baseURL+'/portal/clientAction!getClientDetail.action',{
    id: obj.id,
    size:obj.size,
    isClient:obj.isClient,
    isManager:obj.isManager
  }).then(function (result) {
    if(result.code==='0'){
      callback(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//退回客户到公海
export function returnClient(id,cb) {
  axios.post(_.baseURL+'/portal/clientPoolAction!recoveryClientToPool.action',{
    clientId: id,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('操作成功', true);
      cb(result)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//回收客户
export function recoveryClient(id,cb) {
  axios.post(_.baseURL+'/portal/clientPoolAction!recycleClientToPool.action',{
    clientId: id,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('操作成功', true);
      cb(result)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//删除客户
export function deleteClient(id,cb) {
  axios.post(_.baseURL+'/portal/clientPoolAction!ajaxDelete.action',{
    clientId: id,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('操作成功', true);
      cb(result)
    }else {
      _.alert('提示',result.desc);
    }
  })
}

//转移客户
export function transferClient(param,cb) {
  axios.post(_.baseURL+'/portal/clientPoolAction!updateAnotherPerson.action',{
    userId: param.userId,
    clientId:param.clientId,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('操作成功', true);
      cb(result)
    }else {
      _.alert('提示',result.desc);
    }
  })
}

//变更公海
export function changePool(clientId,cb) {
  axios.post(_.baseURL+'/portal/clientPool/getClientChargePoolList.do',{
    clientId:clientId,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc);
    }
  })
}

//变更公海确定转移
export function changePoolTransferClient(param,cb) {
  axios.post(_.baseURL+'/portal/clientPool/changeClientToOtherPool.do',{
    poolId:param.poolId,
    clientIds:param.clientIds,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('操作成功', true);
      cb(result)
    }else {
      _.alert('提示',result.desc);
    }
  })
}

//获取高级搜索自定义字段
export function customerOption(){
  return axios.post(`${_.baseURL}/portal/client/getClientSearchOptionPage.do`)
}

//获取启用和不启用数据列表
export function getOptionSetting(){
  return axios.post(`${_.baseURL}/portal/client/searchOptionSetting.do`)
}

//提交自定义字段拖拽后数据
export function submitDragData(params){
  return axios.post(`${_.baseURL}/portal/client/editOptionSetting.do`,params)
}

//获取提醒设置数据
export function getRemindData(params){
  return axios.post(`${_.baseURL}/portal/remindtaskAction!ajaxView.action`,params)
}

//获取提醒设置数据
export function saveRemindData(params){
  return axios.post(`${_.baseURL}/portal/remindtaskAction!ajaxUpdate.action`,params)
}
