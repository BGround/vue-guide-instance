import axios from 'axios'
import { Toast } from 'quickwork-ui'

import BASE_URL from '@/assets/js/baseURL_config'
/*
 *
 * @param {*} lat 纬度
 * @param {*} lng 经度
 */
export function getAddressbyLocation(lat, lng) {
  return axios
    .get('https://apis.map.qq.com/ws/geocoder/v1/', {
      params: {
        location: `${lat},${lng}`,
        key: window.dataBase.qqMapKey
      }
    })
    .then(response => {
      if (response.status !== 0) {
        throw new error(response.message)
      } else {
        return response.result
      }
    })
}

/**
 * 区域
 */
export function searchDepatmentList(params) {
  return axios
    .get(BASE_URL + '/portal/dealerPortalAction/searchDepatmentList.do', {
      params
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
 * 公司信息
 * @param {*} params
 */
export function getCompanyInfo(params) {
  return axios
    .get(BASE_URL + '/portal/qrbasisPortalCtl/selCompanyInfo.do', { params })
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
 * 建设信息是否合并接口
 * @param 参数：dealerId
 * @return true 合并 false 展开}
 */
export function processIsComplete(params) {
  return axios
    .get(BASE_URL + '/portal/networkPortalAction/processIsComplete.do', { params })
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
 * 网信息是否合并接口
 * @param 参数：dealerId
 * @return true 合并 false 展开}
 */
export function isComplete(params) {
  return axios
    .get(BASE_URL + '/portal/networkPortalAction/isComplete.do', { params })
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
 * ch
 * @param 参数：cityName
 * @return
 */
export function getdepartmentIdList(params) {
    return axios
        .get(BASE_URL + '/portal/homePagePcAction/getdepartmentIdList.do', { params })
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
 * 城市查部门
 * @param 参数：cityName
 */
export function getdepartmentId(params) {
  return axios
      .get(BASE_URL + '/portal/homePagePcAction/getdepartmentId.do', { params })
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

export function getDealerMapByCity(params){
    return axios
        .get(BASE_URL + '/portal/homePagePcAction/getDealerMapByCity.do', { params })
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
 * 是否有权限打卡档案袋
 * @param params
 * @return {Promise<AxiosResponse<any>>}
 */
export function hasHomePermission(){
    return axios
        .get(`${BASE_URL}/portal/homePagePcAction/hasHomePermission.do`)
        .then(data => {
            return String(data.code) === '0'
        })

}

