import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config';

// 获取联系人固定字段
export const getContactsItem = () => {
  return axios({
    url: `${baseURL}/crm/contactsMgrCtrl/getContactsItem.do`,
    method: 'GET',
    dataType: 'json'
  });
}

//获取联系人详情
export const getContactDetail = obj => {
  return axios({
    url: `${_.baseURL}/crm/contactsMgrCtrl/ajaxView.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

// 获取联系人详情列表
export const getDetailList = obj => {
  return axios({
    url: `${_.baseURL}/client/clientAction!searchClientContact.action`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};
// 获取联系人详情列表
export const getClientList = data => {
  return axios({
    url: `${_.baseURL}/client/clientAction!ajaxSearch.action`,
    method: "POST",
    dataType: "json",
    data
  });
};
/**
 *检查联系人手机号
 *
 * @export
 * @param {String} mobile 手机号
 * @param {string} [agentCode="crmContactsMobile"]
 * @returns
 */
export function checkContactMobile(mobile, agentCode = "crmContactsMobile") {
  return axios({
    url: `${_.baseURL}/crm/contactsMgrCtrl/queryMobileRepeat.do`,
    method: "POST",
    dataType: "json",
    data: {
      mobile,
      agentCode
    }
  });
};

/**
 *新建联系人
 *
 * @export
 * @param {*} data
 * @param {number} [submitType=0] 0|1 是否发消息给相关人
 * @returns 
 */
export function addContact(data, submitType = 0) {
  return axios({
    url: `${_.baseURL}/crm/contactsMgrCtrl/ajaxAdd.do?&submitType=${submitType}`,
    method: "POST",
    dataType: "json",
    data
  });
};
/**
 *更新联系人
 *
 * @export
 * @param {*} data
 * @param {number} [submitType=0] 0|1 是否发消息给相关人
 * @returns 
 */
export function updateContact(data, submitType = 0) {
  return axios({
    url: `${_.baseURL}/crm/contactsMgrCtrl/ajaxUpdate.do?&submitType=${submitType}`,
    method: "POST",
    dataType: "json",
    data
  });
};
/**
 * 编辑时 获取联系人详情
 *  
 * @export
 * @param {String} id 联系人id
 * @returns
 */
export function getContactInfoByEdit(id) {
  return axios({
    url: `${_.baseURL}/crm/contactsMgrCtrl/getContactsHistoryInfo.do`,
    method: "POST",
    dataType: "json",
    data: {
      id
    }
  });
};

// 获取联系人列表
export function getContactsList(params) {
  return axios.post(`${_.baseURL}/crm/contactsMgrCtrl/getContactsList.do`, params);
}

//获取导入摸板Url
export const importTemplateUrl = `${_.baseURL}/crm/contactsMgrCtrl/exportTemplate.do`;

//导入联系人
//@param {*} file
// @param {String|Number} type 1 覆盖导入;0 不处理;
export function batchImportContact(form) {
  return new Promise((resolve, reject) => {
    try {
      let xhr = new XMLHttpRequest();
      try {
        xhr.open("post", `${_.baseURL}/crm/contactsMgrCtrl/batchImportContact.do`, true);
      } catch (e) {
        reject(e)
      }
      xhr.onload = function () {
        if (xhr.status < 400) {
          var result = eval("(" + xhr.responseText + ")");
          resolve(result);
        } else {
          reject()
        }
      };
      xhr.send(form);
    } catch (e) {
      reject(e)
    }
  })
}


//查询导入结果
//@param {String} id 导入成功返回的id
export function viewImportProcess(id) {
  return axios({
    url: `${_.baseURL}/crm/contactsMgrCtrl/ImportContactsProcess.do`,
    method: 'get',
    params: {
      id
    }
  });
}

//获取下载导入错误数据的url
//@param {String} id 导入返回的id
export function getExportErrorUrl(id) {
  return `${_.baseURL}/crm/contactsMgrCtrl/exportErrorImport.do?id=${id}`
}


// 转移联系人
export function changeContactsCharge(params) {
  return axios.post(`${_.baseURL}/crm/contactsMgrCtrl/changeContactsCharge.do`, params);
}

// 删除联系人
export function deleteContacts(params) {
  return axios.post(`${_.baseURL}/crm/contactsMgrCtrl/BatchDelete.do`, params);
}

// 同步负责人和相关人
export function synContactsStaff(params) {
  return axios.post(`${_.baseURL}/crm/contactsMgrCtrl/synContactsStaff.do`, params);
}

// 导出请求 查重
export function checkReport(params) {
  return axios.post(`${_.baseURL}/report/reportAction!checkReport.action`, params);
}

// 导出
export function createReportTask(params) {
  return axios.post(`${_.baseURL}/report/reportAction!createReportTask.action`, params);
}
