import axios from 'axios';

// 获取公海客户列表数据
export function getPoolList(params){
    return axios.post(`${_.baseURL}/portal/clientPoolAction!searchClientAdvanced.action`, params);
}

// 公海回收站客户列表
export function getRecyclePoolList(params) {
  return axios.post(`${_.baseURL}/portal/clientPool/getPoolListByCharge.do`, params);
}

// 获取公海池列表数据
export function getClientPool(){
    return axios.post(`${_.baseURL}/portal/clientPoolAction!getMyClientPoolList.action`);
}

// 是否有公海池权限
export function checekManage(params){
    return axios.post(`${_.baseURL}/portal/clientPoolAction!validPoolMgr.action`, params);
}

// 领取公海客户
export function receivePoolClient(params){
    return axios.post(`${_.baseURL}/portal/clientPoolAction!receiveClient.action`, params);
}

// 分配公海客户
export function assignPoolClient(params){
    return axios.post(`${_.baseURL}/portal/clientPoolAction!divideClientManager.action`, params);
}

// 所属公海列表
export function getChargePoolList(params){
  return axios.post(`${_.baseURL}/portal/clientPoolAction!getChargePoolList.action`, params);
}

// 所属公海列表
export function getPoolListByCharge(params){
  return axios.post(`${_.baseURL}/portal/clientPool/getPoolListByCharge.do`, params);
}

// 编辑公海客户列表请求
export function getClientHistoryInfo(params){
  return axios.post(`${_.baseURL}/portal/clientPoolAction!getClientDetail.action`, params);
}

// 恢复冻结、废弃客户
export function recoverClient(params){
  return axios.post(`${_.baseURL}/portal/clientPoolAction!recoverClient.action`, params);
}

// 获取月季年数据
export function getCountBriefing(keyWord,cb) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/clientAction!countCrmDateBriefing.action',
    keyWord
  ).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 获取红点未读数据
export function getCrmBriefing(callback) {
  _.showLoading('')
  return axios.get(_.baseURL+'/portal/clientAction!getCrmDateBriefing.action').then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      callback(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 客户列表 新增
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

export function getValidClientName(params){
  return axios.post(`${_.baseURL}/portal/clientPoolAction!validPhoneOrClient.action`, params);
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

// 新增公海客户
export function getAddClient(params,cb) {
  _.showLoading('提交中')
  return axios.post(_.baseURL+'/portal/clientPoolAction!ajaxAdd.action',
    params
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc,'确定');
    }
    _.hideLoading('')
  })
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
  return axios.post(`${_.baseURL}/portal/clientPoolAction!ajaxUpdate.action`,params
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

//获取公海池详情
export function getPoolDetails(id,cb) {
  return axios.post(_.baseURL+'/portal/clientPoolAction!getClientDetail.action', {
    "clientId":id,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}


//获取公海池联系人详情列表
export function getPoolContactDetailsList(opt,cb) {
  return axios.post(_.baseURL+'/portal/clientPoolAction!searchClientContactList.action', {
    "poolClientId":opt.id,
    "page":opt.page,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//获取公海池联系人详情
export function getPoolContactDetails(obj,cb) {
  return axios.post(_.baseURL+'/portal/contactsAction!getContactDetail.action', {
    "id":obj.id,
    "size":obj.size,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//获取公海池详情商机列表
export function getPoolBusinessDetailsList(opt,cb) {
  return axios.post(_.baseURL+'/portal/clientPoolAction!searchClientBusinessList.action', {
    "poolClientId":opt.id,
    "page":opt.page,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//获取公海池商机详情
export function getPoolBusinessDetails(obj,cb) {
  return axios.post(_.baseURL+'/portal/businessAction!getBusinessDetail.action', {
    "id":obj.id,
    "size":obj.size,
    "isPartner":obj.isPartner,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//获取公海池详情拜访列表
export function getPoolVisitDetailsList(opt,cb) {
  return axios.post(_.baseURL+'/portal/clientPoolAction!searchClientOutsideWorkList.action', {
    "poolClientId":opt.id,
    "outworkId":opt.id,
    "page":opt.page,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//获取公海池拜访详情
export function getPoolVisitDetails(obj,cb) {
  return axios.post(_.baseURL+'/portal/outsideworkinfoAction!getOutsideworkDetail.action', {
    "id":obj.id,
    "size":obj.size,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//分配
export function distributeClient(param,cb) {
  return axios.post(_.baseURL+'/portal/clientPoolAction!divideClientManager.action', {
    "poolId":param.poolId,
    "clientIds":param.clientIds,
    "userId":param.userId,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('操作成功', true);
      cb(result);
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//冻结
export function frozenClient(obj,cb) {
  return axios.post(_.baseURL+'/portal/clientPoolAction!frozenClient.action', {
    "poolId":obj.poolId,
    "clientIds":obj.id,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('操作成功', true);
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

// 废弃
export function discardCleint(obj,cb) {
  return axios.post(_.baseURL+'/portal/clientPoolAction!scrapClient.action', {
    "poolId":obj.poolId,
    "clientIds":obj.id,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('操作成功', true);
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//删除
export function poolDelClient(obj,cb) {
  return axios.post(_.baseURL+'/portal/clientPoolAction!ajaxBatchDelete.action', {
    "poolId":obj.poolId,
    "clientIds":obj.id,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('操作成功', true);
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//转移客户到公海
export function transferClient(obj,cb) {
  return axios.post(_.baseURL+'/portal/clientPoolAction!updateAnotherPool.action',{
    "poolId":obj.poolId,
    "clientIds":obj.clientIds,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('操作成功', true);
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//领取
export function poolReceiveClient(obj,cb) {
  return axios.post(_.baseURL+'/portal/clientPoolAction!receiveClient.action', {
    "poolId":obj.poolId,
    "clientIds":obj.id,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed('操作成功', true);
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//所属公海池列表
export function poolTransferList(id,cb) {
  _.showLoading()
  return axios.post(_.baseURL+'/portal/clientPoolAction!getChargePoolList.action',{
    "id":id,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
      _.hideLoading();
    }else {
      _.hideLoading();
      _.alert('提示',result.desc)
    }
  })
}


//获取公海池说明
export function poolDesc(poolId,cb) {
  return axios.post(_.baseURL+'/portal/clientPool/getPoolDetailByPoolId.do',{
    "poolId":poolId,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}
