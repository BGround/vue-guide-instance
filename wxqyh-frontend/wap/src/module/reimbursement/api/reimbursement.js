import api from './index';

// 请求报销列表, 有四种状态：
// 我的报销  status: 1,type: 1；
// 待我审批  status: 0,type: 2；
// 我相关的  status: 1,type: 2；
// 草稿  status: 0,type: 1
export const MY_REIM_URL = `${_.baseURL}/portal/reimPortalCtl/myReim.do`;
export const SEARCH_ADVANCED_URL = `${_.baseURL}/portal/reimPortalCtl/searchAdvanced.do`;
export const getReimList = (url, params) => api.post(url, params);

// 获取待办、草稿数量
export const getReimInfoNum = () => api.get(`${_.baseURL}/portal/reimPortalCtl/getReimInfoNum.do`);

// 删除“我的报销列表”
export const deleteMyReim = params => api.post(`${_.baseURL}/portal/reimPortalCtl/ajaxDelete.do`, params);

// 获取高级搜索 科目列表
export const getSearchProjects = () => api.post(`${_.baseURL}/portal/projectPortalCtl/projectList.do`);

// 获取高级搜索 项目列表
export const getSearchSubjects = () => api.post(`${_.baseURL}/portal/subjectPortalCtl/subjList.do`);

export const getSearchTypes= () => api.post(`${_.baseURL}/portal/reimConfigPortalCrl/typeList.do`);
