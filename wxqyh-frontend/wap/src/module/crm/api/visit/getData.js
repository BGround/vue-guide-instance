import axios from 'axios';

// 获取拜访列表
export function getVisitList(params){
  return axios.post(`${_.baseURL}/portal/outsideworkinfoAction!searchOutsideAdvanced.action`,params);
}

// 一键已阅
export function readAll(){
  return axios.post(`${_.baseURL}/portal/outsideworkinfoAction!updateAllReadStatus.action`);
}

// 获取未阅信息
export function getNotReadNum(){
  return axios.post(`${_.baseURL}/portal/outsideworkinfoAction!countNotRead.action`);
}

// 删除拜访
export function delVisit(params){
  return axios.post(`${_.baseURL}/portal/outsideworkinfoAction!ajaxBatchDelete.action`, params);
}


//获取普通详情拜访列表
export function getDetailVisitList(opt,cb) {
  return axios.post(_.baseURL+'/portal/clientAction!seachClientOutworkList.action', {
    "clientId":opt.id,
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

//获取拜访详情
export function getVisitDetails(obj,cb) {
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

//获取高级搜索自定义字段
export function customerOption(){
  return axios.post(`${_.baseURL}/portal/outsideworkinfoAction!getOutworkSearchOptionPage.action`)
}

//获取启用和不启用数据列表
export function getOptionSetting(){
  return axios.post(`${_.baseURL}/portal/outsidework/searchOptionSetting.do`)
}

//提交自定义字段拖拽后数据
export function submitDragData(params){
  return axios.post(`${_.baseURL}/portal/outsidework/editOptionSetting.do`,params)
}


// 获取当前用户的信息
export function addUserTo(params){
  return axios.post(`${_.baseURL}/portal/contactAction!getPersonInfoByUserId.action`,params);
}

// 新增拜访
export function addOutsideWork(params){
  return axios.post(`${_.baseURL}/portal/outsideworkinfoAction!ajaxUpdate.action`,params);
}

// 编辑拜访
export function updateOutsideWork(params){
  return axios.post(`${_.baseURL}/portal/outsideworkinfoAction!ajaxUpdate.action`,params);
}

// 详情跳转新增，携带clientId，请求客户信息
export function getClientInfo(params){
  return axios.post(`${_.baseURL}/portal/contactsAction!getClient.action`,params);
}

// 加载上次联系人
export function getOldGivenList(keyWord,cb) {
  return axios.post(_.baseURL+'/portal/outsideworkinfoAction!getOldGivenList.action',
    keyWord
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

// 所属外勤单列表
export function searchOutworkList(params){
  return axios.post(`${_.baseURL}/portal/outworkAction!seachOutworkList.action`,params);
}

// 选择所属外勤单得出拜访客户
export function getOutworkDetail(params){
  return axios.post(`${_.baseURL}/portal/outworkAction!getOutworkDetail.action`,params);
}

// 拜访客户列表
export function searchClientList(params){
  return axios.post(`${_.baseURL}/portal/clientAction!searchClientList.action`,params);
}

// 选择客户后，获取相关人
export function showClientPerson(params){
  return axios.post(`${_.baseURL}/portal/clientAction!seachClientPersonList.action`,params);
}

// 拜访联系人列表
export function searchContactList(params){
  return axios.post(`${_.baseURL}/portal/contactsAction!searchContactList.action`,params);
}
//拜访商机列表
export function searchBusinessList(params){
  return axios.post(`${_.baseURL}/portal/businessAction!searchBusinessList.action`,params);
}
// 添加草稿
export function addToDraft(params){
  return axios.post(`${_.baseURL}/portal/outsideworkinfoAction!ajaxAdd.action`,params);
}

// 判断图片上传方式
export function photoSetting(params){
  return axios.post(`${_.baseURL}/portal/intercalateAction!getPhotoSetting.action`,params);
}

// 拜访人列表
export function getOptionLists(cb) {
  _.showLoading('')
  return axios.post(_.baseURL+'/portal/outsideworkinfoAction!getOptionItem.action',
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

// 编辑页面列表加载
export function getOutworkHistoryInfo(keyWord,cb) {
  return axios.post(_.baseURL+'/portal/outsideworkinfoAction!getOutworkHistoryInfo.action',
    keyWord
  ).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}
