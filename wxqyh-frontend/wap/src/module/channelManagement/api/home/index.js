import axios from 'axios'
import { Toast } from 'quickwork-ui'

const SUCCESS_CODE = '0'


const BASE_URL = `${_.baseURL}`;
// const BASE_URL = `http://2hcz7m.natappfree.cc/wxqyh`;


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

// /**
//  * 二网返利
//  * erpNo=1001
//  * @param {*} params
//  */
// export function findByNetwork(params) {
//   return axios({
//     method: 'post',
//     baseURL: _.baseURL,
//     url: '/portal/fzticketPortalCtl/getInvoiceInfoByCodeAndCardId.do',
//     data: data,
//     headers:{
//         'Content-Type': 'application/json;charset=utf-8'
//     },
//     transformRequest: [function (data) {
//         return JSON.stringify(data, { skipNulls: true });
//     }],
//   }).then(data => {
//       if (data.code !== '0') {
//         throw new Error(data.desc)
//       }
//       return data.data
//     }).catch(error => {
//       Toast({
//         type: 'info',
//         duration: 1500,
//         content: error.message
//       })
//     })
// }

/**
 * 首页banner
 * @param {*} params
 */
export function getbannerImage(params={}){
  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/homePagePcAction/getbannerImage.do',
    params: params,
    // paramsSerializer: function(params) {
    //     return Qs.stringify(params, {arrayFormat: 'repeat'})
    // },
  }).then(data => {
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
 * 渠道头条
 * @param {*} params
 */
export function getchannelHeadlines(params){
  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/homePagePcAction/getchannelHeadlines.do',
    params: params,
    // paramsSerializer: function(params) {
    //     return Qs.stringify(params, {arrayFormat: 'repeat'})
    // },
  }).then(data => {
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
 * 城市查部门
 * @param {*} params
 */
export function getdepartmentId(params){
  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/homePagePcAction/getdepartmentId.do',
    params: params,
    // paramsSerializer: function(params) {
    //     return Qs.stringify(params, {arrayFormat: 'repeat'})
    // },
  }).then(data => {
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
 * 全国网点覆盖情况一览
 * @param {*} params
 */
export function getnationalNetwork(params){
  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/homePagePcAction/getnationalNetwork.do',
    params: params,
    // paramsSerializer: function(params) {
    //     return Qs.stringify(params, {arrayFormat: 'repeat'})
    // },
  }).then(data => {
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
 * 城市详情
 * @param {*} params
 */
export function getCityDetails(params){
  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/homePagePcAction/getCityDetails.do',
    params: params,
    // paramsSerializer: function(params) {
    //     return Qs.stringify(params, {arrayFormat: 'repeat'})
    // },
  }).then(data => {
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
 * 城市查部门列表
 * @param {*} params
 */
export function getdepartmentIdList(params){
  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/homePagePcAction/getdepartmentIdList.do',
    params: params,
    // paramsSerializer: function(params) {
    //     return Qs.stringify(params, {arrayFormat: 'repeat'})
    // },
  }).then(data => {
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
