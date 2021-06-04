import api from './index';

// 新建借款获取配置
export const getConfigInfo = (params) => api.post(`${_.baseURL}/portal/loan/loanPortalCtl/getLoanConfigInfo.do`,params);

// 提交借款单接口ajaxAddLoan,编辑提交与一般提交在新增页面用URL区分
export const ajaxAddLoan = (URL, params) => api.post(URL, params);

/*// 审批人提交借款
export const approveUpdate = params => api.post(`${_.baseURL}/portal/loanPortalCtl/approveUpdate.do`, params);*/

// 编辑时候提交借款接口
export const ajaxUpdate = (params) =>api.post(`${_.baseURL}/portal/loan/loanPortalCtl/ajaxUpdate.do`,params);
// 加载上一次银行信息
export const getLastReceiptAccount = (params) =>api.post(`${_.baseURL}/portal/loan/loanPortalCtl/getLastReceiptAccount.do`,params);
// 根据银行卡获取银行
export const getBankName = (params) =>api.post(`${_.baseURL}/portal/loan/loanPortalCtl/getBankName.do`,params);

//获取借款单明细
export const getLoanDetail = (params) => api.post(`${_.baseURL}/portal/loan/loanPortalCtl/getLoanDetail.do`, params);

//提交还款
export const commitRepayRequest = (params) => api.post(`${_.baseURL}/portal/loan/loanPortalCtl/commitRepayRequest.do`, params);

//获取借款单列表数据
export const searchLoanAndReimPage = (params) => api.post(`${_.baseURL}/portal/loan/loanPortalCtl/searchLoanAndReimPage.do`, params);

//删除借款单
export const ajaxLoanDelete = (params) => api.post(`${_.baseURL}/portal/loan/loanPortalCtl/ajaxDelete.do`, params);

//加签处理
export const addCounterSignType = (params) => api.post(`${_.baseURL}/portal/loan/loanPortalCtl/addCounterSignType.do`, params);

//更新节点流程
export const updateAuditStatus = (params) => api.post(`${_.baseURL}/portal/loan/loanPortalCtl/updateAuditStatus.do`, params);

export function commitComment(data, cb) {                                      //新增评论
  api.post(_.baseURL + "/portal/loan/loanPortalCtl/commitComment.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      _.tooltips_succeed("评论成功");
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

export function commentListMore(data, cb) {                                      //加载评论
  api.post(_.baseURL + "/portal/loan/loanPortalCtl/commentList.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

export function deleteCommentList(data, cb) {                                  //删除评论
  _.showLoading("删除中...");
  api.post(_.baseURL + "/portal/loan/loanPortalCtl/deleteComment.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      _.tooltips_succeed("删除成功");
      cb(result)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

//白名单判断
export const isWhiteCorpId = (params) => api.post(`${_.baseURL}/portal/corpIdWhitePortalCtl/isWhiteCorpId.do`, params);

//获取关联的报销单详情
export const getSimpleReimDetail = (params) => api.post(`${_.baseURL}/portal/reimPortalCtl/getSimpleReimDetail.do`, params);

//获取报销以及借款待办和草稿数量
export const getWaitAndDraftNum = (params) => api.post(`${_.baseURL}/portal/loan/loanPortalCtl/getWaitAndDraftNum.do`, params);


