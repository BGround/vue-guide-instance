import api from './index';

/**
 * 判断是否是管理员
 */
export const isAdministrator = () => api.post(`${_.baseURL}/portal/managesetting!ajaxIsManager.action`);

/**
 * 查询反馈列表
 */
export const feedbackList = () => api.post(`${_.baseURL}/portal/portalForm/getOpenFormForDo1FeedBack.do`);