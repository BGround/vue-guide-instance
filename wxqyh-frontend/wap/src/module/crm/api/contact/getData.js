import axios from 'axios'
// 获取联系人列表
export function getContactList(params){
  return axios.post(`${_.baseURL}/portal/contactsAction!searchContact.action`,params);
}

// 一键已阅
export function readAll(){
  return axios.post(`${_.baseURL}/portal/contactsAction!updateAllReadStatus.action`);
}

// 新增客户跳转联系人列表
export function contactGetClient(params){
  return axios.post(`${_.baseURL}/portal/contactsAction!getClient.action`,params);
}

// 选择客户后，获取相关人
export function showClientPerson(params){
  return axios.post(`${_.baseURL}/portal/clientAction!seachClientPersonList.action`,params);
}

// 新增编辑联系人input框加载请求
export function getContactsItem(cb) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/contactsAction!getOptionItem.action',
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
// 编辑页面数据请求
export function getContactHistoryInfo(params,cb) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/contactsAction!getContactHistoryInfo.action',
  params).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 所属客户列表请求
export function searchClientList(params){
  return axios.post(`${_.baseURL}/portal/clientAction!searchClientList.action`,params);
}

// 新增联系人
export function addContact(params,cb) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/contactsAction!ajaxAdd.action',
  params).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}
// 编辑联系人
export function updateContact(params,cb) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/contactsAction!ajaxUpdate.action',
  params).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data)
    }else {
      _.hideLoading('');
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
// 联系人联系电话重复判断接口
export function queryMobileRepeat(keyWord,cb) {
  return axios.post(_.baseURL+'/portal/contactsAction!queryMobileRepeat.action',
  keyWord
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
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

// 外部联系人接口
export function getWxContactInfo(params){
  return axios.post(`${_.baseURL}/portal/wxqyhContactsCtrl/getWxContactInfo.do`,params);
}

// 获取当前用户的信息
export function addUserTo(params){
  return axios.post(`${_.baseURL}/portal/contactAction!findUserInfoByUserId.action`,params);
}

// 外部联系人注入agentConfig
export function getAgent(params){
  return axios.post(`${_.baseURL}/portal/weixinjs/weixinjsAction!agentAuthorize.action`,params);
}

//传入userId获得外部联系人详情
export function getWxContactDetail(params){
  return axios.post(`${_.baseURL}/portal/wxqyhContactsCtrl/getWxContactDetail.do`, params);
}

// 微信config
export function weixinjsAction(params){
  return axios.post(`${_.baseURL}/portal/weixinjs/weixinjsAction!authorizeMe.action`, params);
}

//获取普通详情联系人列表
export function getDetailContactList(opt,cb) {
  return axios.post(_.baseURL+'/portal/contactsAction!searchClientContact.action', {
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

//获取联系人详情
export function getContactDetails(obj,cb) {
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


