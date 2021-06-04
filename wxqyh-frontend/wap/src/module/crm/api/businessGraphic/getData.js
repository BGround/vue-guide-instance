import axios from 'axios';

// 获取商机列表数据
export function getTeamList(params){
    return axios.post(`${_.baseURL}/portal/clientPoolAction!getTeamList.action`, params);
}

// 获取商机分布数据
export function searchBusinessGraphic(params){
    return axios.post(`${_.baseURL}/portal/business/searchBusinessGraphic.do`, params);
}

// 获取商机字段列表
export function getBasicItem(params){
    return axios.post(`${_.baseURL}/portal/businessAction!getBasicItem.action`, params);
}

// 获取商机字段列表
export function searchBusinessViewList(params){
    return axios.post(`${_.baseURL}/portal/businessAction!searchBusinessViewList.action`, params);
}

// 从成交趋势获取商机字段列表
export function searchBusinessTrendList(params){
    return axios.post(`${_.baseURL}/portal/business/searchBusinessTrendList.do`, params);
}

// 从成交趋势获取合同字段列表
export function searchContractTrendList(params){
    return axios.post(`${_.baseURL}/portal/contract/searchContractTrendList.do`, params);
}

