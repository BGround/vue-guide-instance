import axios from 'axios';

//提交竞争对手
export function addCompetitor(data) {
  // console.log(data);
  // return axios.post(`${_.baseURL}/portal/crm/competitor/ajaxAdd.do`, data)
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/ajaxAdd.do`,
    method: 'POST',
    dataType: 'json',
    data
  });
}
//更新竞争对手
export function updateCompetitor(data) {
  // return axios.post(`${_.baseURL}/portal/crm/competitor/ajaxAdd.do`, data)
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/ajaxUpdate.do`,
    method: 'POST',
    dataType: 'json',
    data
  });
}

/**
 * 获取竞争对手的责任人单/多选设置
 */
export function getCompetitorSetting() {
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/getIfMultipleInCharge.do`,
    method: 'get',
    dataType: 'json',
  });
}

/**
 * 加载上一次负责人
 * @param {Number}} type  类型 1-负责人 2-相关人
 */
export function getOldGivenList(type) {
  // return axios.post(`${_.baseURL}/portal/crm/competitor/ajaxAdd.do`, data)
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/getOldGivenList.do`,
    method: 'POST',
    dataType: 'json',
    data: {
      type
    }
  });
}

//查询竞争对手列表
export function getCompetitorList(data) {
  // return axios.post(`${_.baseURL}/portal/crm/competitor/ajaxAdd.do`, data)
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/getCompetitorList.do`,
    method: 'POST',
    dataType: 'json',
    data
  });
}

/**
 * 查询竞争详情
 * @param {String} id 
 */
export function getCompetitorDetail(id) {
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/getCompetitorDetail.do`,
    method: 'POST',
    dataType: 'json',
    data: {
      competitorId: id
    }
  });
}

//查询商机列表
export function getCompetitorBusinessList(param) {
  let id = param.id
  let page = param.page || 1
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/getCompetitorBusinessList.do`,
    method: 'POST',
    dataType: 'json',
    data: {
      competitorId: id,
      page
    }
  });
}

//查询修改记录
export function getModifyLog(id) {
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/getModifyLog.do`,
    method: 'POST',
    dataType: 'json',
    data: {
      competitorId: id
    }
  });
}

//删除竞争对手
export function deleteCompetitor(id) {
  console.log(id);
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/deleteCompetitor.do`,
    method: 'POST',
    dataType: 'json',
    data: {
      competitorIds: id
    }
  });
}

//转移竞争对手负责人
export function transferCompetitor(id, uid) {
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/transfer.do`,
    method: 'POST',
    dataType: 'json',
    data: {
      competitorIds: id,
      userId: uid
    }
  });
}

//获取商级列表
export function selectCompetitorBusinessList(data) {
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/selectCompetitorBusinessList.do`,
    method: 'POST',
    dataType: 'json',
    data
  });
}
//获取当前登录用户负责的、相关的、创建的商机列表
export function listCompetitorBusiness(data) {
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/listCompetitorBusiness.do`,
    method: 'post',
    dataType: 'json',
    data
  });
}

/**
 * 批量添加商机
 * @param {String} competitorId 竞争对手id
 * @param {String} businessIds 商机列表’,‘拼接
 */
export function addCompetitorBusiness(competitorId, businessIds) {
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/addCompetitorBusiness.do`,
    method: 'post',
    dataType: 'json',
    data: {
      competitorId,
      businessIds
    }
  });
}
/**
 * 获取未阅数
 * /portal/crm/competitor/getNotReadCompetitorNum.do
 */
export function getNotReadCompetitorNum() {
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/getNotReadCompetitorNum.do`,
    method: 'post',
  });
}
/**
 * 一键已阅
 */
export function updateAllReadStatus() {
  return axios({
    url: `${_.baseURL}/portal/crm/competitor/updateAllReadStatus.do`,
    method: 'post',
  });
}
