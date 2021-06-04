import axios from 'axios';

// 获取商机列表数据
export function getBusinessList(params){
    return axios.post(`${_.baseURL}/portal/businessAction!searchBusinessAdvanced.action`, params);
}

// 获取商机阶段和商机类别
export function getBussinessStage(){
    return axios.post(`${_.baseURL}/portal/businessAction!getBusinessStage.action`);
}

// 一键已阅
export function readAll(){
    return axios.post(`${_.baseURL}/portal/businessAction!updateAllReadStatus.action`);
}

// 删除商机
export function delBusiness(params){
    return axios.post(`${_.baseURL}/portal/businessAction!ajaxBatchDelete.action`, params);
}

//获取高级搜索自定义字段
export function customerOption(){
    return axios.post(`${_.baseURL}/portal/businessAction!getBusinessSearchOptionPage.action`)
}

//获取启用和不启用数据列表
export function getOptionSetting(){
    return axios.post(`${_.baseURL}/portal/business/searchOptionSetting.do`)
}

//提交自定义字段拖拽后数据
export function submitDragData(params){
    return axios.post(`${_.baseURL}/portal/business/editOptionSetting.do`,params)
}

// 选择客户后，获取相关人
export function showClientPerson(params){
  return axios.post(`${_.baseURL}/portal/clientAction!seachClientPersonList.action`,params);
}

// 详情跳转新增，携带clientId，请求客户信息
export function getClientInfo(params){
  return axios.post(`${_.baseURL}/portal/contactsAction!getClient.action`,params);
}

// 新增商机
export function addBusiness(params){
  return axios.post(`${_.baseURL}/portal/businessAction!ajaxAdd.action`, params);
}

// 编辑商机
export function updateBusiness(params){
  return axios.post(`${_.baseURL}/portal/businessAction!ajaxUpdate.action`, params);
}

// 客户列表查询
export function searchClientList(params){
  return axios.post(`${_.baseURL}/portal/clientAction!searchClientList.action`, params);
}
// 竞争对手列表查询
export function searchCompetitorList(params){
  return axios.post(`${_.baseURL}/portal/crm/competitor/getCompetitorListSimplify.do`, params);
}

// 获取当前用户的信息
export function addUserTo(params){
  return axios.post(`${_.baseURL}/portal/contactAction!findUserInfoByUserId.action`,params);
}

// 获取客户联系人列表
export function searchContactList(params){
  return axios.post(`${_.baseURL}/portal/contactsAction!searchContactList.action`,params);
}

// 商机列表
export function getOptionLists(cb) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/businessAction!getOptionItem.action',
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

// 商机编辑页面列表加载
export function getBusinessInfo(keyWord,cb) {
  return axios.post(_.baseURL+'/portal/businessAction!getBusinessInfo.action',
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
  return axios.post(_.baseURL+'/portal/businessAction!getOldGivenList.action',
    keyWord
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//获取普通详情商机列表
export function getDetailBusinessList(opt,cb) {
  return axios.post(_.baseURL+'/portal/businessAction!seachClientBusinessList.action', {
    "id":opt.id,
    "page":opt.page,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//获取普通商机详情
export function getBusinessDetail(obj,cb) {
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

//上一个/下一个商机
export function nextBusiness(obj,cb) {
  // _.showLoading()
  return axios.post(_.baseURL+'/portal/businessAction!getNextDetail.action', {
    "id":obj.id,
    "type":obj.type,
    "typeId":obj.typeId,
    "keyWord":obj.keyWord,
  }).then(function (result) {
    if(result.code==='0'){
      // _.hideLoading();
      cb(result.data)
    }else {
      // _.hideLoading();
      _.alert('提示',result.desc)
    }
  })
}



