import axios from 'axios';

// 获取即将回收客户列表
export function searchAnnouncement(params){
  return axios.post(`${_.baseURL}/portal/crm/announcement/searchAnnouncement.do`,params);
}
