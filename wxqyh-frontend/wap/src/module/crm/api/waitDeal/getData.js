import axios from 'axios';

// 获取即将回收客户列表
export function getRecycle(params){
  return axios.post(`${_.baseURL}/portal/clientPoolAction!ajaxSearchRecycle.action`,params);
}
