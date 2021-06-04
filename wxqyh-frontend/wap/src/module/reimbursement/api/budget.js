import api from './index';

// 预算看板权限检验
export const checkCenterCostPermission = () => api.post(`${_.baseURL}/portal/projectPortalCtl/checkCenterCostPermission.do`);

// 预算看板数据
export const getBudgetBoard = params => api.post(`${_.baseURL}/portal/projectPortalCtl/getBudgetBoard.do`, params);

// 预算看板详情
export const getBudgetDetail = params => api.post(`${_.baseURL}/portal/projectPortalCtl/getBudgetDetailBoard.do`, params);

// 获取成本中心有预算的年份
export const getHasBudgetYear = params => api.post(`${_.baseURL}/portal/projectPortalCtl/getHasBudgetCenterYearCostAndYear.do`, params);

