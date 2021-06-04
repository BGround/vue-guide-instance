import axios from 'axios';

// 获取商机列表数据
export function getTeamList(params){
    return axios.post(`${_.baseURL}/portal/clientPoolAction!getTeamList.action`, params);
}

// 获取商机分布数据
export function searchBusinessFunnel(params){
    return axios.post(`${_.baseURL}/portal/businessAction!searchBusinessFunnel.action`, params);
}

// 获取商机字段列表
export function getBasicItem(params){
    return axios.post(`${_.baseURL}/portal/businessAction!getBasicItem.action`, params);
}

// 获取商机字段列表
export function searchBusinessViewList(params){
    return axios.post(`${_.baseURL}/portal/businessAction!searchBusinessViewList.action`, params);
}

// 获取各个阶段的商机数据
export function searchBusinessStageDetail(params){
    return axios.post(`${_.baseURL}/portal/businessAction!searchBusinessStageDetail.action`, params);
}

// 商机阶段数据列表时获取商机阶段
export function getBusinessStage(params){
    return axios.post(`${_.baseURL}/portal/businessAction!getBusinessStage.action`, params);
}

