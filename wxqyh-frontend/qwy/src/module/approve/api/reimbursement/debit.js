import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config'

//获取借款单类型 @params{pageSize,page}
export function getLoanTypes(data) {
  return axios({
    url: baseURL + '/loanConfig/loanConfigCtl/getLoanTypes.do',
    method: 'POST',
    async: false,
    data: data
  })
}

//获取借款列表显示字段
export function loanRankList() {
  return axios({
    url: baseURL + '/reim/loanMgrCtl/loanRankList.do',
    method: 'POST',
    async: false
  })
}

//保存借款列表显示字段
/*@params{
rankList		rankList
rankName		字段名称
rank	字段
id		字段ID
sort		排序
type		类型，0隐藏-1显示
}*/
export function saveLoanRank(data) {
  return axios({
    url: baseURL + '/reim/loanMgrCtl/saveLoanRank.do',
    method: 'POST',
    async: false,
    data: data
  })
}

//分页查询借款
/* @params{
  page	页码
  pageSize	否	每页大小
  creator		借款人
  loanNo		借款单编号
  title		借款主题
  loanDate		借款日期
  repayDate		还款日期
  deptId		所属部门
  deptName		所属部门
  status		单据状态
  nodeName		当前节点
  currentProcessPerson		审批人
  closePersonName		最后审批人
  approvalStartTime- approvalEndTime		审批时间
  flowName		流程名称
  printState		打印状态
  startTime- endTime		创建时间
}*/
export function ajaxSearchLoan(data) {
  return axios({
    url: baseURL + '/reim/loanMgrCtl/ajaxSearchLoan.do',
    method: 'POST',
    async: false,
    data: data
  })
}

//分页查询提交还款的申请
/*
@params{
  page	页码
  pageSize	每页大小
  title		借款主题
}
 */
export function ajaxSearchRepay(data) {
  return axios({
    url: baseURL + '/reim/loanMgrCtl/ajaxSearchRepay.do',
    method: 'POST',
    async: false,
    data: data
  })
}

//确认转账,借款单状态置为已转账，待还款
/*
@params{
  ids	借款单ID数组
  openWxTransfer	是否需要微信转账
}
 */
export function confirmTransfer(data) {
  return axios({
    url: baseURL + '/reim/loanMgrCtl/transfer.do',
    method: 'POST',
    async: false,
    data: data
  })
}

//确认还款，驳回，还款申请状态更新
/*
@params{
  loanId	借款单ID
  status	状态
}
 */
export function confirmRepay(data) {
  return axios({
    url: baseURL + '/reim/loanMgrCtl/confirmRepay.do',
    method: 'POST',
    async: false,
    data: data
  })
}

//撤销驳回的还款申请
export function rejectCancel(data) {
  return axios({
    url: baseURL + '/reim/loanMgrCtl/rejectCancel.do',
    method: 'POST',
    async: false,
    data: data
  })
}

//删除借款单/*@params{ ids}*/
export function ajaxDelLoan(data) {
  return axios({
    url: baseURL + '/reim/loanMgrCtl/ajaxDelLoan.do',
    method: 'POST',
    async: false,
    data: data
  })
}
//还款申请数量
export function ajaxGetRepayCount(data) {
  return axios({
    url: baseURL + '/reim/loanMgrCtl/ajaxGetRepayCount.do',
    method: 'POST',
    async: false,
    data: data
  })
}

//提醒还款，推送消息模版
/*@params{loanId	借款单ID}*/
export function remindRepayment(data) {
  return axios({
    url: baseURL + '/reim/loanMgrCtl/remindRepayment.do',
    method: 'POST',
    async: false,
    data: data
  })
}

/*借款详情 @params{loanId	借款单ID}*/
export function debitDetail(data) {
  return axios({
    url: baseURL + '/reim/loanMgrCtl/getLoanDetail.do',
    method: 'POST',
    async: false,
    data: data
  })
}

//查询借支基本设置
export function getLoanBaseSetting(data) {
  return axios({
    url: baseURL + '/loanConfig/loanConfigCtl/getLoanBaseSetting.do',
    method: 'POST',
    async: false,
    data: data
  })
}

//查询单据明细(编辑)
/*@params{loanTypeId 借款单类型id}*/
export function getLoanTypeDetail(data) {
  return axios({
    url: baseURL + '/loanConfig/loanConfigCtl/getLoanTypeDetail.do',
    method: 'POST',
    async: false,
    data: data
  })
}

//新增借款单类型
/*@params{loanType.typeName 类型名称，loanType.sort 排序号，loanType.ranges 是否属于特定对象：1所有人，3特定对象，userIds ，deptIds}*/
export function addLoanType(data) {
  return axios({
    url: baseURL + '/loanConfig/loanConfigCtl/addLoanType.do',
    method: 'POST',
    async: false,
    data: data
  })
}

//删除借款单类型（可批量）
/*@params{loanTypeIds }*/
export function deleteLoanType(data) {
  return axios({
    url: baseURL + '/loanConfig/loanConfigCtl/deleteLoanType.do',
    method: 'POST',
    async: false,
    data: data
  })
}
//下载图片/附件
export function downLoadLog(fileId) {
  return axios({
    url : _.baseURL+"/qydiskMgr/qydiskMgrAction!downloadLog.action",
    method: 'POST',
    async: false,
    data : fileId,
  });
}

//获取流程
export function getFlow(fileId) {
  return axios({
    url : _.baseURL+"/flow/flowParallel/ajaxGetParallelFlowSerial.do",
    method: 'POST',
    async: false,
    data : fileId,
  });
}


// 获取借款单字段设置
export function getLoanFieldSetting() {
  return axios({
    url: baseURL + '/loanConfig/loanConfigCtl/getLoanFieldSetting.do',
    method: 'POST',
    async: false
  });
}

//保存借款单字段设置
export function setLoanFieldSetting(data) {
  return axios({
    url: baseURL + '/loanConfig/loanConfigCtl/setLoanFieldSetting.do',
    method: 'POST',
    data: data,
  });
}

// 获取借款单打印设置
export function getLoanPrintSetting() {
  return axios({
    url: baseURL + '/loanConfig/loanConfigCtl/getLoanPrintSetting.do',
    method: 'POST',
    async: false
  });
}

// 保存借款单打印设置
export function setLoanPrintSetting(data) {
  return axios({
    url: baseURL + '/loanConfig/loanConfigCtl/setLoanPrintSetting.do',
    method: 'POST',
    data: data,
  });
}

// 借款白名单判断
export function isWhiteCorpId(data) {
  return axios({
    url: baseURL + '/corpIdWhite/corpIdWhiteCtl/isWhiteCorpId.do',
    method: 'POST',
    data: data,
  });
}


