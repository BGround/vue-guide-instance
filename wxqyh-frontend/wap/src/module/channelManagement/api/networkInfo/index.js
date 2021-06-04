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
 * 二网返利
 * erpNo=1001
 * @param {*} params 
 */
export function findByNetwork(params) {
  return axios
    .get(BASE_URL+'/portal/networkPortalAction/findByNetwork.do', {
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
 * 
 */
export function findByInvestment(params) {
  return axios
    .get(BASE_URL+'/portal/networkPortalAction/findByInvestment.do', {
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