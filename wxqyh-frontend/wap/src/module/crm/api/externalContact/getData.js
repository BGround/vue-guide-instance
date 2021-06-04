import axios from 'axios'
// 获取联系人列表
export function validClientName(params){
  return axios.post(`${_.baseURL}/portal/clientAction!validClientName.action`,params);
}

//传入userId获得外部联系人详情
export function getWxContactList(params){
  return axios.post(`${_.baseURL}/portal/wxqyhContactsCtrl/getWxContactList.do`, params);
}

//传入userId获得外部联系人详情
export function batchAddContact(params){
  return axios.post(`${_.baseURL}/portal/wxqyhContactsCtrl/batchAddContact.do`, params);
}