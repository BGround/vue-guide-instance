import axios from 'axios';

// 获取合同列表数据
export function getContractList(params){
  return axios.post(`${_.baseURL}/portal/contractAction!searchContractAdvanced.action`, params);
}

// 一键已阅
export function readAll(){
  return axios.post(`${_.baseURL}/portal/contractAction!updateAllReadStatus.action`);
}

// 删除合同
export function delContract(params){
  return axios.post(`${_.baseURL}/portal/contractAction!deleteContract.action`, params);
}

// 获取合同状态
export function getContractStatus(){
  return axios.post(`${_.baseURL}/portal/contractAction!getContractStatusList.action`);
}

// 获取合同类型
export function getContractType(){
  return axios.post(`${_.baseURL}/portal/contractAction!getTypeList.action`);
}

//获取普通详情合同列表
export function getDetailContractList(opt,cb) {
  return axios.post(_.baseURL+'/portal/contractAction!searchClientContractList.action', {
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

//获取合同详情
export function getContractDetails(id,cb) {
  return axios.post(_.baseURL+'/portal/contractAction!getContractDetail.action', {
    "id":id,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//获取合同状态列表
export function getContractStatusList(cb) {
  return axios.post(_.baseURL+'/portal/contractAction!getContractStatusList.action').then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//加载更多评论
export function commentListMore(param, cb) {
  axios.post(_.baseURL + "/portal/contractAction!searchContractComment.action", {
    'page':param.page,
    'id':param.id
  }).then(function (result) {
    if (result.code === '0') {
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

//新增评论
export function addCommentList(param, cb) {
  axios.post(_.baseURL + "/portal/contractAction!addComment.action", {
    'tbCrmContractCommentPO.content': param.content,
    'userIds':param.userIds,
    'userId': param.userId,
    'tbCrmContractCommentPO.contractId': param.contractId,
    'id':  param.id,
    'flowDpId':'',
    'signImg':'',
    'searchValue.field_contractType':  param.contractType,
    'searchValue.field_contractAmount':  param.contractAmount,
    'nextNodeId':'',
    'currentNodeId':'',
      }).then(function (result) {
    if (result.code === '0') {
      _.tooltips_succeed("评论成功");
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

//删除评论
export function deleteCommentList(commentId, cb) {
  axios.post(_.baseURL + "/portal/contractAction!deleteComment.action", {
    'commentId':commentId,
  }).then(function (result) {
    if (result.code === '0') {
      _.tooltips_succeed("删除成功");
      cb(result)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

//更新合同执行状态
export function updateContractStatus(obj) {
  return axios.post(_.baseURL+'/portal/contractAction!updateContractStatus.action', {
    "id":obj.id,
    "contractStatus":obj.contractStatus,
  }).then(function (result) {
    if(result.code==='0'){
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//合同流程审批状态
export function updateAuditStatus(param,cb) {
  return axios.post(_.baseURL+'/portal/contract/updateAuditStatus.do', {
    "flowChioseNodeAuditUserJson":param.flowChioseNodeAuditUserJson,
    "nextNodeId":param.nextNodeId,
    "flowDpId":param.flowDpId,
    "contractId":param.contractId,
    "status":param.status,
    "reason":param.reason,
    "parallelNextNodeIds":param.parallelNextNodeIds,
    "signImg":param.signImg,
    "currentNodeId":param.currentNodeId,
    "chooseFlowUser":param.chooseFlowUser,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//加签审批
export function addSign(param,cb) {
  return axios.post(_.baseURL+'/portal/contractAction!addCountersignType.action', {
    "id":param.contractId,
    "currentNodeId":param.currentNodeId,
    "isFree":param.isFree,
    "reason":param.reason,
    "addCounterSignPersonStr":param.addCounterSignPersonStr,
    "type":param.type,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//删除合同
export function removeContract(id,cb) {
  return axios.post(_.baseURL+'/portal/contractAction!deleteContract.action', {
    "id":id,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}


//回款明细
export function returnMoney(id,cb) {
  return axios.post(_.baseURL+'/portal/contractReceiveAction!ajaxSearch.action', {
    "contractId":id,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//保存回款计划
export function savePlanReturn(obj,cb) {
  return axios.post(_.baseURL+'/portal/contractReceiveAction!ajaxAdd.action', {
    "receiveDetailPO.id":"",
    "contractId": obj.contractId,
    "step": obj.step,
    "receiveDetailPO.stepType": obj.stepType,
    "receiveDetailPO.content": obj.content,
    "receiveDetailPO.receiveDate": obj.date,
    "receiveDetailPO.money": obj.money,
    "receiveDetailPO.payment":obj.payment,
    "receiveDetailPO.invoiceType":obj.invoiceType,
    "receiveDetailPO.invoiceRatio":obj.invoiceRatio,
    "receiveDetailPO.invoiceCode":obj.invoiceCode,
    "receiveDetailPO.remark": obj.remark,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed("保存成功");
      cb(result)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//编辑回款计划
export function editPlanReturn(id,cb) {
  return axios.post(_.baseURL+'/portal/contractReceiveAction!ajaxGet.action', {
    "id":id,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//更新保存回款计划
export function updatePlanReturn(obj,cb) {
  return axios.post(_.baseURL+'/portal/contractReceiveAction!ajaxUpdate.action', {
    "receiveDetailPO.id":obj.receiveDetailPOId,
    "contractId": obj.contractId,
    "step": obj.step,
    "receiveDetailPO.stepType": obj.stepType,
    "receiveDetailPO.content": obj.content,
    "receiveDetailPO.receiveDate": obj.date,
    "receiveDetailPO.money": obj.money,
    "receiveDetailPO.payment":obj.payment,
    "receiveDetailPO.invoiceType":obj.invoiceType,
    "receiveDetailPO.invoiceRatio":obj.invoiceRatio,
    "receiveDetailPO.invoiceCode":obj.invoiceCode,
    "receiveDetailPO.remark": obj.remark,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed("保存成功");
      cb(result)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//删除计划回款
export function delPlanReturn(id,cb) {
  return axios.post(_.baseURL+'/portal/contractReceiveAction!ajaxDelete.action', {
    "id":id,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed("删除成功");
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//删除期次
export function delStep(id,cb) {
  return axios.post(_.baseURL+'/portal/contractReceiveAction!ajaxDeleteStep.action', {
    "stepId":id,
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed("删除成功");
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

//发票类型
export function getTaxType(cb) {
  return axios.post(_.baseURL+'/portal/contractReceiveAction!findTaxType.action', {
    "system":true,
  }).then(function (result) {
    if(result.code==='0'){
      cb(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

// 合同新增编辑页获取合同类型
export function searchContractType(params){
    return axios.post(`${_.baseURL}/portal/contractAction!searchTypeList.action`, params);
}

// 获取当前登录人信息
export function addUserTo(params){
    return axios.post(`${_.baseURL}/portal/contactAction!findUserInfoByUserId.action`, params);
}

// 获取所属客户
export function searchClient(params){
    return axios.post(`${_.baseURL}/portal/clientAction!searchClientList.action`, params);
}

// 获取所属商机
export function searchBusiness(params){
    return axios.post(`${_.baseURL}/portal/businessAction!searchBusinessList.action`, params);
}

// 获取客户签约人
export function searchClientSignatory(params){
    return axios.post(`${_.baseURL}/portal/contactsAction!searchContactList.action`, params);
}

//获取高级搜索自定义字段
export function customerOption(){
  return axios.post(`${_.baseURL}/portal/contract/getContractSearchOptionPage.do`)
}

//获取启用和不启用数据列表
export function getOptionSetting(){
  return axios.post(`${_.baseURL}/portal/contract/searchOptionSetting.do`)
}

//提交自定义字段拖拽后数据
export function submitDragData(params){
  return axios.post(`${_.baseURL}/portal/contract/editOptionSetting.do`,params)
}

// 获取合同字段数据
export function getFieldData(params){
    return axios.post(`${_.baseURL}/portal/contractAction!getContractOption.action`,params);
}

// 加载上次联系人
export function getOldGivenList(params){
    return axios.post(`${_.baseURL}/portal/contractAction!getOldGivenList.action`,params);
}

// 新增合同
export function saveContract(params){
    return axios.post(`${_.baseURL}/portal/contractAction!ajaxAdd.action`,params);
}

// 编辑合同
export function updateContract(params){
    return axios.post(`${_.baseURL}/portal/contractAction!ajaxUpdate.action`,params);
}

// 获取合同详情信息
export function getContractDetail(params){
    return axios.post(`${_.baseURL}/portal/contractAction!getHistoryInfo.action`,params);
}

// 获取是否存在合同自定义类型
export function getCustomContract(){
    return axios.post(`${_.baseURL}/portal/contractAction!isHasContractType.action`);
}

// 获取流程相关人
export function getContractTypePerson(params){
    return axios.post(`${_.baseURL}/portal/contractAction!getContractTypePerson.action`, params);
}

// 获取合同首页信息
export function getIndexInfo(){
    return axios.post(`${_.baseURL}/portal/contractAction!getContractIndexInfo.action`);
}

// 获取所属客户
export function getClientInfo(params){
  return axios.post(`${_.baseURL}/portal/contactsAction!getClient.action`, params);
}


