import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config';

// 获取竞争对手列表
export const getCompetitorList = (obj) => {
  return axios({
    url: `${baseURL}/crm/competitor/getCompetitorList.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 新增竞争对手
export const addCompetitor = (obj) => {
  return axios({
    url: `${baseURL}/crm/competitor/ajaxAdd.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 编辑竞争对手
export const editCompetitor = (obj) => {
  return axios({
    url: `${baseURL}/crm/competitor/ajaxUpdate.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}
/**
 * 获取竞争对手的责任人单/多选配置
 */
export function getCompetitorSetting() {
  return axios({
    url: `${_.baseURL}/crm/competitor/getIfMultipleInCharge.do`,
    method: 'get',
    dataType: 'json',
  });
}
// 删除竞争对手
export const deleteCompetitor = (obj) => {
  return axios({
    url: `${baseURL}/crm/competitor/deleteCompetitor.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 获取竞争对手详情
export const detailCompetitor = (obj) => {
  return axios({
    url: `${baseURL}/crm/competitor/getCompetitorDetail.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 转移竞争对手
export const transferCompetitor = (obj) => {
  return axios({
    url: `${baseURL}/crm/competitor/transfer.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 检查是否重复导出
export const checkReport = (obj) => {
  return axios({
    url: `${baseURL}/report/reportAction!checkReport.action`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 创建报表导出请求
export const createReportTask = (obj) => {
  return axios({
    url: `${baseURL}/report/reportAction!createReportTask.action`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

//获取当前登录用户负责的、相关的、创建的商机列表
export function listCompetitorBusiness(data) {
  return axios({
    url: `${_.baseURL}/crm/competitor/listCompetitorBusiness.do`,
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
    url: `${_.baseURL}/crm/competitor/addCompetitorBusiness.do`,
    method: 'post',
    dataType: 'json',
    data: {
      competitorId,
      businessIds
    }
  });
}

/**
 * 导入竞争对手
 * @param {*} file 
 * @param {String|Number} type 0 覆盖导入;1 不处理
 */
export function batchImportCompetitor(form) {
  return new Promise((resolve, reject) => {
    try {
      let xhr = new XMLHttpRequest();
      try {
        xhr.open("post", `${_.baseURL}/crm/competitor/batchImportCompetitor.do`, true);
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
  // return axios({
  //   url: `${_.baseURL}/crm/competitor/batchImportCompetitor.do `,
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   },
  //   data
  // });
}
/**
 * 获取导入摸板Url
 */
export const importTemplateUrl = `${_.baseURL}/crm/competitor/exportTemplate.do`;

/**
 * 查询导入结果
 * @param {String} id 导入成功返回的id
 */
export function viewImportProcess(id) {
  return axios({
    url: `${_.baseURL}/crm/competitor/viewImportProcess.do`,
    method: 'get',
    params: {
      id
    }
  });
}
/**
 * 获取下载导入错误数据的url
 * @param {String} id 导入返回的id
 */
export function getExportErrorUrl(id) {
  return `${baseURL}/crm/competitor/exportErrorCompetitor.do?id=${id}`
}
