import axios from 'axios'
import { Toast } from 'quickwork-ui'
import {isOpenH5} from "../../js/utils";

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


let cityInfoSource = null
/**
 * 城市信息
 * @param {*} params
 */
export function getCityInfoPage(params) {
  cityInfoSource = axios.CancelToken.source()
  return axios
    .get(BASE_URL+'/portal/plancity/plancityPortalAction!getCityInfoPage.action', {
      params,
      cancelToken: cityInfoSource.token
    })
    .then(data => {
      if (data.code !== SUCCESS_CODE) {
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      if (axios.isCancel(error)) {
        return
      }
      Toast({
        type: 'info',
        duration: 1500,
        content: error.message
      })
    })
}

/**
 * 取消请求城市信息请求
 */
export function cancelGetCityInfoPage() {
  cityInfoSource && cityInfoSource.cancel('取消请求城市数据')
}

// ?dealerId=3&year=2019&type=1
/**
 * 柱状图
 */
export function getStatisticsVoList(params) {
  return axios
    .get(BASE_URL+'/portal/plancity/plancityPortalAction!getStatisticsVoList.action', {
      params
    })
    .then(data => {
      if (data.code !== SUCCESS_CODE) {
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


export function getCityList(params) {
  return axios
    .get(BASE_URL+'/portal/plancity/plancityPortalAction!getCityList.action', { params })
    .then(data => {
      if (data.code !== SUCCESS_CODE) {
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
 * 商圈图表
 * @param {*} params
 */
export function getTradingMobile(params) {
  return axios
    .get(BASE_URL+'/portal/trading/getTradingMobile.do', { params })
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
 * province=%E5%8C%97%E4%BA%AC%E5%B8%82&city=%E5%8C%97%E4%BA%AC%E5%B8%82
 * @param {*} params
 */
export function getTradingInfo(params) {
  return axios
    .get(BASE_URL+'/portal/trading/getTradingInfoMobile.do', { params })
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
 * 按品牌
 * @param {*} params
 */
export function getBrandStatistics(params) {
  return axios
    .get(BASE_URL+'/portal/plancity/plancityPortalAction!getBrandStatistics.action', { params })
    .then(data => {
      if (data.code !== SUCCESS_CODE) {
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
 * 按产品
 * @param {*} params
 */
export function getQiruiBrandStatistics(params) {
  return axios
    .get(BASE_URL+'/portal/plancity/plancityPortalAction!getQiruiBrandStatistics.action', { params })
    .then(data => {
      if (data.code !== SUCCESS_CODE) {
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
 * 按产品
 * @param {*} params
 */
export function searchDealerPagerByKey(params) {
  const api = isOpenH5()? '/portal/dealerPortalAction/searchDealerPagerByKey.do' : '/portal/dealerPortalAction/searchFileBagDealerPagerByKey.do'
  return axios
    .get(BASE_URL+api, { params })
    .then(data => {
      if (data.code !== SUCCESS_CODE) {
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


// http://wujincheng.mynatapp.cc/wxqyh?dealerId=3&year=2019
/**
 * dealerId=3&year=2019
 * 一网规划
 */
export function searchPlanNetAnetInfoBykey(params){
  return axios
    .get(BASE_URL+'/portal/plannetPortalAction/searchPlanNetAnetInfoBykey.do', { params })
    .then(data => {
      if (data.code !== SUCCESS_CODE) {
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
 * @param {*} params
 */
export function searchPlanNetBnetInfoBykey(params){
  return axios
    .get(BASE_URL+'/portal/plannetPortalAction/searchPlanNetBnetInfoBykey.do', { params })
    .then(data => {
      if (data.code !== SUCCESS_CODE) {
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
 * 高管
 * @param {*} params
 */
export function searchDealerUserByKey(params){
  return axios
    .get(BASE_URL+'/portal/dealerPortalAction/searchDealerUserByKey.do', { params })
    .then(data => {
      if (data.code !== SUCCESS_CODE) {
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
 * 获取省份列表
 */
export function getProvinceList(){
  return axios
    .get(BASE_URL+'/portal/plancity/plancityPortalAction!getProvinceList.action')
    .then(data => {
      if (data.code !== SUCCESS_CODE) {
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

// /**
//  * 获取城市列表
//  * pName
//  * @param {*} params
//  */
// export function getCityList(params){
//   return axios
//     .get(BASE_URL+'/portal/plancity/plancityPortalAction!getCityList.action', {params})
//     .then(data => {
//       if (data.code !== SUCCESS_CODE) {
//         throw new Error(data.desc)
//       }
//       return data.data
//     })
//     .catch(error => {
//       Toast({
//         type: 'info',
//         duration: 1500,
//         content: error.message
//       })
//     })
// }


//////-------

/**
 * 城市介绍-行政信息
 * @param {*} params
 */
export function getCityInfoAdministrative(params){
  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/plancity/planningDevPortalAction!getCityInfoAdministrative.action',
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
 * 城市介绍-城市商圈
 * @param {*} params
 */
export function getCityInfoByBusinessInfo(params){
  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/plancity/planningDevPortalAction!getCityInfoByBusinessInfo.action',
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
 * 城市市占-城市市占率表格
 * @param {*} params
 */
export function getCityStatistics(params){

  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/plancity/planningDevPortalAction!getCityStatistics.action',
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
 * 城市市占-城市展示表格
 * @param {*} params
 */
export function getCityStatisticsDetail(params){
  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/plancity/planningDevPortalAction!getCityStatisticsDetail.action',
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
 * 城市市占-省份展示表格
 * @param {*} params
 */
export function getProvinceStatisticsDetail(params){

  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/plancity/planningDevPortalAction!getProvinceStatisticsDetail.action',
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
 * 城市市占-全国展示表格
 * @param {*} params
 */
export function getCountryStatisticsDetail(params){
  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/plancity/planningDevPortalAction!getCountryStatisticsDetail.action',
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
 * 一网规划
 * @param {*} params
 */
export function getCityInfoByNetPlannet(params){
  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/plancity/planningDevPortalAction!getCityInfoByNetPlannet.action',
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
 * 二网规划
 * @param {*} params
 */
export function getCityInfoBySecondPlanning(params){
  return axios({
    method: 'POST',
    baseURL: BASE_URL,
    url: '/portal/plancity/planningDevPortalAction!getCityInfoBySecondPlanning.action',
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
