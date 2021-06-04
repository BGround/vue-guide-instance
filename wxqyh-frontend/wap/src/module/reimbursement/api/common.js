import api from './index';

export const isBlackCorpId = params => api.post(`${_.baseURL}/portal/corpIdWhitePortalCtl/isBlackCorpId.do`, params);
