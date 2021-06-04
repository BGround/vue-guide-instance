import axios from 'axios';

//获取拜访列表
export const getSearchList = obj => {
  return axios({
    url: `${_.baseURL}/crm/outsideworkinfoMgrCtrl/ajaxPageSearch.do`,
    method: "POST",
    dataType: "json",
    params: {
      "type": 1
    },
    data: obj
  });
};

//删除拜访单
export const deleterVisit = obj => {
  return axios({
    url: `${_.baseURL}/crm/outsideworkinfoMgrCtrl/ajaxDelete.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

//同步负责人和相关人
export const snycVisit = obj => {
  return axios({
    url: `${_.baseURL}/crm/outsideworkinfoMgrCtrl/synOutsideworkinfoStaff.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

//转移负责人
export const transfeVisit = obj => {
  return axios({
    url: `${_.baseURL}/crm/outsideworkinfoMgrCtrl/changeOutworkCharge.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};


//获取导入摸板Url
export const importTemplateUrl = `${_.baseURL}/crm/outsideworkinfoMgrCtrl/exportOutworkTemp.do`;

//导入拜访
//@param {*} file
export function batchImportVisit(form) {
  return new Promise((resolve, reject) => {
    try {
      let xhr = new XMLHttpRequest();
      try {
        xhr.open("post", `${_.baseURL}/crm/outsideworkinfoMgrCtrl/batchImportOutwork.do`, true);
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
    url: `${_.baseURL}/crm/outsideworkinfoMgrCtrl/viewImportProcess.do`,
    method: 'get',
    params: {
      id
    }
  });
}

//获取下载导入错误数据的url
//@param {String} id 导入返回的id
export function getExportErrorUrl(id) {
  return `${_.baseURL}/crm/outsideworkinfoMgrCtrl/exportErrorOutwork.do?id=${id}`
}

// 导出请求 查重
export function checkReport(params) {
  return axios.post(`${_.baseURL}/report/reportAction!checkReport.action`, params);
}

// 导出
export function createReportTask(params) {
  return axios.post(`${_.baseURL}/report/reportAction!createReportTask.action`, params);
}

//获取拜访详情
export const getVisitDetail = obj => {
  return axios({
    url: `${_.baseURL}/crm/outsideworkinfoMgrCtrl/getDetail.do`,
    method: "GET",
    dataType: "json",
    params: obj
  });
};

//获取拜访详情列表
export const getDetailList = obj => {
  return axios({
    url: `${_.baseURL}/crm/outsideworkinfoMgrCtrl/searchClientOutworkList.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

//获取拜访字段
export const getOptionItem = obj => {
  return axios({
    url: `${_.baseURL}/crm/customFieldSetting/getOutsideItem.do`,
    method: "GET",
    dataType: "json",
    data: obj
  });
};

//保存编辑
export const updateOutside = obj => {
  return axios({
    url: `${_.baseURL}/crm/outsideworkinfoMgrCtrl/ajaxUpdateOutside.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

// 获取编辑详情
export const getVisitHistoryInfo = obj => {
  return axios({
    url: `${_.baseURL}/crm/outsideworkinfoMgrCtrl/getOutworkHistoryInfo.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

//拜访客户
export const visitClientList = obj => {
  return axios({
    url: `${_.baseURL}/client/clientAction!ajaxSearch.action`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

//拜访联系人
export const visitContactList = obj => {
  return axios({
    url: `${_.baseURL}/crm/contactsMgrCtrl/searchContactList.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

//拜访商机
export const visitBusinessList = obj => {
  return axios({
    url: `${_.baseURL}/business/businessAction!searchBusinessList.action`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

// 所属外勤单
export const visitOutworkList = obj => {
  return axios({
    url: `${_.baseURL}/crm/outsideworkinfoMgrCtrl/searchOutworkList.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

// 修改拜访客户后，获取新的客户地址
export const getClientAddress = obj => {
  return axios({
    url: `${_.baseURL}/crm/outsideworkinfoMgrCtrl/getClientAddress.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};
