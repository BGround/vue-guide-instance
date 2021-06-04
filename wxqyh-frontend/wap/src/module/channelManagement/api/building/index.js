import axios from 'axios'
import {
  Toast
} from 'quickwork-ui'

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
export function getSecondNetShopByErpNo(params) {
  return axios
    .get(BASE_URL + '/portal/secondNetShopRebatesPortalAction/getSecondNetShopByErpNo.do', {
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
 * 一网返利
 * erpNo=1001
 * @param {*} params
 */
export function getOneNetShopByErpNo(params) {
  return axios
    .get(BASE_URL + '/portal/oneNetShopRebatesPortalAction/getOneNetShopByErpNo.do', {
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
 *
 */
export function getsaleImg(params) {
  return axios
    .get(BASE_URL + '/portal/plancity/saleImgPortalAction!ajaxSearch.action', {
      params,
    })
    .then(data => {
      if (data.code !== "0") {
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

export function getImageDisplay(params) {
  return axios
    .get(BASE_URL + '/portal/imageDisplayPortalAction/selectByDealerInfoId.do', {
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
 * 完工信息
 * @param {*} params
 */
export function getShopInfoByErpNo(params) {
  return axios
    .get(BASE_URL + '/portal/shopInfoPortalAction/getShopInfoByErpNo.do', {
      params,
    })
    .then(data => {
      if (data.code !== 0) {
        throw new Error(data.desc)
      }
      return data.data;
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
 * 进度
 * @param {*} params
 * dealerId=1&currentIndex=1
 */
export function getConstructionProcess(params) {
  return axios
    .get(BASE_URL + '/portal/building/buildingPortalAction!getConstructionProcess.action', {
      params,
    })
    .then(data => {
      if (data.code !== '0') {
        throw new Error(data.desc)
      }
      return data.data;
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
 * 进度图片
 * @param {*} params
 * processId=xxxxxx
 */
export function getConstructionImg(params) {
  return axios
    .get(BASE_URL + '/portal/building/buildingPortalAction!getConstructionImg.action', {
      params,
    })
    .then(data => {
      if (data.code !== '0') {
        throw new Error(data.desc)
      }
      return data.data;
    })
    .catch(error => {
      Toast({
        type: 'info',
        duration: 1500,
        content: error.message
      })
    })
}

// 2020-06-12
/**
 * 一网建设
 * @param {*} params
 */
export function getOneNetBuildManageVOByCategory(params) {
  return axios
    .get(BASE_URL + '/portal/oneNetShopRebatesPortalAction/getOneNetBuildManageVOByCategory.do', {
      params,
    })
    .then(data => {
      if (data.code !== 0) {
        throw new Error(data.desc)
      }
      return data.data;
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
 * 一网返利
 * @param {*} params
 */
export function getOneNetStoreRebateVOByCategory(params) {
  return axios
    .get(BASE_URL + '/portal/oneNetShopRebatesPortalAction/getOneNetStoreRebateVOByCategory.do', {
      params,
    })
    .then(data => {
      if (data.code !== 0) {
        throw new Error(data.desc)
      }
      return data.data;
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
 * 二网建设
 * @param {*} params
 */
export function getSecondBuildManageByDealerId(params) {
  return axios
    .get(BASE_URL + '/portal/secondNetShopRebatesPortalAction/getSecondBuildManageByDealerId.do', {
      params,
    })
    .then(data => {
      if (data.code !== 0) {
        throw new Error(data.desc)
      }
      return data.data;
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
 * 二网返利
 * @param {*} params
 */
export function getSecondNetShopByDealerId(params) {
  return axios
    .get(BASE_URL + '/portal/secondNetShopRebatesPortalAction/getSecondNetShopByDealerId.do', {
      params,
    })
    .then(data => {
      if (data.code !== 0) {
        throw new Error(data.desc)
      }
      return data.data;
    })
    .catch(error => {
      Toast({
        type: 'info',
        duration: 1500,
        content: error.message
      })
    })
}
