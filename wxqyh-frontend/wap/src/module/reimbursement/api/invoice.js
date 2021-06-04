import api from './index';

// 拉取用户电子发票卡券类参数
export const wxcardAuthorize = () => api.post(`${_.baseURL}/wxcardjs/wxcardAction!authorize.action`);

// 
export const getWxcardInfo = params => api.post(`${_.baseURL}/portal/fapiaoAction!getWxFaPiaoByCodeAndCardId.action`, params);

// 下载发票
export const downLoadWxCard = params => api.get(`${_.baseURL}/portal/fapiaoAction!downLoadFaPiaoInfo.action`, params);
