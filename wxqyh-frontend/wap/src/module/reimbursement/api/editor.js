import api from './index';

// 用车单列表接口
export const VEH_URL = `${_.baseURL}/portal/reimPortalCtl/getVeh.do`;

// 请假单列表接口
export const ASKINFO_URL = `${_.baseURL}/portal/reimPortalCtl/getAskInfo.do`;

export const LOANLIST_URL = `${_.baseURL}/portal/loan/loanPortalCtl/getNonRepaymentLoanList.do`;

// 获取新建配置信息
export const getConfigInfo = params => api.post(`${_.baseURL}/portal/reimPortalCtl/configInfo.do`, params);

// 获取上次收款信息
export const getLastReceiptAccount = () => api.post(`${_.baseURL}/portal/reimPortalCtl/findLastReceiptAccount.do`);

// 根据银行卡获取开户行
export const getBankName = params => api.post(`${_.baseURL}/portal/reimPortalCtl/getBankName.do`, params);

// 获取请假类型
export const getAskType = params => api.post(`${_.baseURL}/portal/reimPortalCtl/getAskTemplateName.do`, params);

// 获取省份列表
export const getProvinceList = api.post(`${_.baseURL}/portal/portalAreaAction!getProvinceList.action`);

// 获取城市列表
export const getCityList = api.post(`${_.baseURL}/portal/portalAreaAction!getAllCityList.action`);

// 获取选择的成本中心列表
export const getCenterCostList = params => api.post(`${_.baseURL}/portal/projectPortalCtl/centerCostList.do`, params);

// 获取科目选择的列表
export const getSubjectList = params => api.post(`${_.baseURL}/portal/subjectPortalCtl/choiceSubject.do`, params);

// 判断是否超额
export const judgeSubjectMoney = params => api.post(`${_.baseURL}/portal/reimPortalCtl/batchJudgeSubjectMoney.do`, params);

// 获取报销历史
export const getHistoryInfo = params => api.post(`${_.baseURL}/portal/reimPortalCtl/getHistoryInfo.do`, params);

// 获取用车单详情
export const getVehDetail = params => api.post(`${_.baseURL}/portal/caraskAction!getDetail.action`, params);

// 提交报销、保存草稿
export const commitReim = (url, params) => api.post(url, params);

// 审批人提交报销
export const approveUpdate = params => api.post(`${_.baseURL}/portal/reimPortalCtl/approveUpdate.do`, params);

// 校验成本中心时间
export const checkCostCenter = params => api.post(`${_.baseURL}/portal/reimPortalCtl/batchCheckCostCenter.do`, params);

// 校验是否发布自定义字段新版本
export const isNewCustomVersion = params => api.post(`${_.baseURL}/portal/reimPortalCtl/isNewCustomVersion.do`, params);

//获取结算方式
export const getSettle = params => api.post(`${_.baseURL}/portal/reimConfigPortalCrl/getSettleDataByTypeId.do`, params);

// 是否对接金蝶
export const kingDeeInfo = () => api.post(`${_.baseURL}/portal/reimConfigPortalCrl/hasSynchronousData.do`);

// 获取借款详情
export const getLoanDetail = params => api.post(`${_.baseURL}/portal/loan/loanPortalCtl/getSimpleLoanDetail.do`, params);