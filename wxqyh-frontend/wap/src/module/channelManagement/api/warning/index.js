import axios from 'axios'
import { Toast } from 'quickwork-ui'

const SUCCESS_CODE = '0'


const BASE_URL = `${_.baseURL}`;


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  _.showLoading('');
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  _.hideLoading('');
  return response;
}, function (error) {
  _.hideLoading('');
  return Promise.reject(error);
});



/**
 * 退网
 * erp=10039
 * @param {*} params
 * http://qdtest.mychery.com:8080/wxqyh?erp=10039
 */
export function getRetireInfo(params) {
  return axios
    .get(BASE_URL+'/portal/retirePortalAction/getRetireInfo.do', {
      params,
    })
    .then(data => {
      if (data.code !== '0') {
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      Toast({
        type: 'info',
        duration: 1500,
        content: error.message
      })
    })
}
export function getBackNetwork(erpNo) {
  return axios
    .post(BASE_URL+'/portal/backNetworkPcAction/getBackNetwork.do', {
      erpNo,
    })
    .then(data => {
      if (data.code !== 0) {
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      Toast({
        type: 'info',
        duration: 1500,
        content: error.message
      })
    })
}

/**
 * 风险评估
 * erp=10039
 * @param {*} params
 */
export function getRiskAssessment(params) {
  return axios
    .get(BASE_URL+'/portal/retirePortalAction/getRiskAssessment.do', {
      params,
    })
    .then(data => {
      if (data.code !== '0') {
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      Toast({
        type: 'info',
        duration: 1500,
        content: error.message
      })
    })
}


/**
 * 清算部门
 * @param {*} params
 * @param {*} params.dealerId
 */
export function liquidationDept(params) {
  return axios
    .get(BASE_URL+'/portal/quitWarning/liquidationDept.do', {
      params,
    })
    .then(data => {
      if (data.code !== 0) {
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      Toast({
        type: 'info',
        duration: 1500,
        content: error.message
      })
    })
}

/**
 * 获取表单内容
 * erp=10039
 * @param {*} params
 * http://qdtest.mychery.com:8080/wxqyh?erp=10039
 */
// export function quitWarningFormInfo(params) {
//   return axios
//     .get(BASE_URL+'/portal/quitWarning/quitWarningFormInfo.do', {
//       params,
//     })
//     .then(data => {
//       if (data.code !== 0) {
//         throw new Error(data.desc)
//       }
//       return data.data
//     })
//     .catch(error => {
//       Toast({
//         type: 'info',
//         duration: 1500,
//         content: error.message ||''
//       })
//     })
// }


/**
 * 预警陈述
 * dealerInfoId=1
 * @param {*} params
 */
export function getEarlyWarning(params) {
  return axios
    .get(BASE_URL+'/portal/earlyPortalAction/getEarlyWarning.do', {
      params,
    })
    .then(data => {
      if (data.code !== '0') {
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      Toast({
        type: 'info',
        duration: 1500,
        content: error.message
      })
    })
}

// http://xx.com/wxqyh/portal/eWarningPcAction/getEarlyWarningList.do
export function getEarlyWarningList(erpId) {
  return axios
    .post(BASE_URL+'/portal/homePagePcAction/getEarlyWarningList.do',{
      erpId
    })
    .then(data => {
      if (String(data.code) !== '0') {
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      Toast({
        type: 'info',
        duration: 1500,
        content: error.message
      })
    })
}



/**
 * 预警陈述整改信息
 * ?dealerInfoId=1&time=2019-11-01
 * @param {*} params
 */
export function getEarlyRectification(params) {
  return axios
    .get(BASE_URL+'/portal/earlyPortalAction/getEarlyRectification.do', {
      params,
    })
    .then(data => {
      if (data.code !== '0') {
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      Toast({
        type: 'info',
        duration: 1500,
        content: error.message
      })
    })
}

export function quitWarningFormInfo(params) {
  return axios
    .get(BASE_URL+'/portal/quitWarning/quitWarningFormInfo.do', {
      params,
    })
    .then(data => {
      if (data.code !== '0') {
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      Toast({
        type: 'info',
        duration: 1500,
        content: error.message
      })
    })
}

/**
 * 推送文件
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export function doSendFileToMe(mediaId) {
  const params = {
    mediaId,
    agent: dataBase.wxqyh_uploadfile.agent
  }
  return axios
    .get(BASE_URL+'/portal/imageupload/imageUploadAction!doSendFileToMe.action', {
      params,
    })
}
