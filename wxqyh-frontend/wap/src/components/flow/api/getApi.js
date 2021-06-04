/**
 * Created by lishanggang 2018/07/24
 */

import axios from 'axios';

// 新建页面获取节点信息、流程列表
export function searchFlowList(params){
  return axios.post(`${_.baseURL}/portal/flow/flowAction!ajaxSearchFlowList.action`, params);
}

//详情页面获取当前处理人、下一节点处理人、节点信息
export function getDetailFlowAudit(params){
  return axios.post(`${_.baseURL}/portal/flow/flowParallel/ajaxGetFlowAudit.do`, params);
}

//获取下一节点信息
export function findBranchFlowNextNodeInfo(params){
  return axios.post(`${_.baseURL}/portal/flow/flowBranchAction!findBranchFlowNextNodeInfo.action`, params);
}

//获取审核用户节点信息
export function getFlowAuditUser(params){
  return axios.post(`${_.baseURL}/portal/flow/flowParallel/ajaxGetFlowAuditUser.do`, params);
}

//获取部门信息
export function getDepartmentInfo(params){
  return axios.post(`${_.baseURL}/portal/flow/flowAction!getDepartmentInfo.action`, params);
}

//查看流程节点
export function findFlowNodeList(params){
  return axios.post(`${_.baseURL}/portal/flow/flowAction!findFlowNodeList.action`, params);
}

//查询流转明细
export function getParallelFlowSerial(params){
  return axios.post(`${_.baseURL}/portal/flow/flowParallel/getParallelFlowSerial.do`, params);
}

/* 获取可退审节点
* @refId      单的id
* @isBranch  是否是分支流程
* @currentNodeId    当前节点id
* @isMiddleAudit 是否并行流程子节点
* */
export function getFlowReturnAudit(data) {
  let {callback,...commitData} = data
  _.showLoading('')
  axios.post(_.baseURL+'/portal/flow/flowParallel/getFlowReturnAudit.do',{
    ...commitData
  }).then((result)=>{
    _.hideLoading('')
    if(result.code==="0"){
      callback(result.data)
    }else {
      _.alert("i18n.notice",result.desc);
    }
  })
}

// 创建者是否离职
export function getUserInfoIsLeave(userId,callback) {
  axios.post(_.baseURL+'/portal/flow/flowParallel/getUserInfoIsLeave.do',{
    userId
  }).then((result)=>{
    if(result.code==="0"){
      callback(result.data.isLeave)
    }else {
      _.alert("i18n.notice",result.desc);
    }
  })
}

// 获取流程审批是否按顺序
export function getFreeFlowConfig(id, callback) {
  _.showLoading();
  axios.post(_.baseURL + '/portal/flow/flowParallel/getFreeFlowConfig.do', {
    templateId: id
  }).then(function (result) {
    _.hideLoading('');
    if (result.code === '0') {
      callback(result.data)
    } else {
      _.alert('提示', result.desc);
    }
  })
}
