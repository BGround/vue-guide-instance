import axios from 'axios'
import { Toast } from 'quickwork-ui'

const SUCCESS_CODE = '0'

const BASE_URL = `${_.baseURL}`

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    _.showLoading('')
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    _.hideLoading('')
    return response
  },
  function(error) {
    _.hideLoading('')
    return Promise.reject(error)
  }
)

/**
 * 年度表彰：
 * dealerId
 */
export function getAnnualRecognitionVOList(params) {
  return axios
    .get(
      BASE_URL +
        '/portal/annualRecognitionPortalAction/getAnnualRecognitionVOList.do',
      { params }
    )
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
 * 奖惩信息
 * dealerId（经销商ID）,rewardsType(奖惩类别),startYear(开始年)，endYear（结束年）
 */
export function getRewardsInfoVOList(params) {
  return axios
    .get(BASE_URL + '/portal/rewardsPortalAction/getRewardsInfoVOList.do', {
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
 * 当年奖惩信息明细
 * dealerId（经销商ID）,year(年)
 */
export function ajaxYearRewardAndPenaltySearch(params) {
  return axios
    .get(BASE_URL + '/portal/rewardsPortalAction/ajaxYearRewardAndPenaltySearch.do', {
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
 * 服务运营
 * 参数：dealerId（经销商ID）year（年）
 */
export function getServiceOperateInfoList(params) {
  return axios
    .get(BASE_URL + '/portal/serOperateInfoPortalAction/getInfoVOList.do', {
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
 * 综合运营评估：
 * 参数：dealerId（经销商ID）
 */
export function getOperationEvaluationInfoList(params) {
  return axios
    .get(
      BASE_URL + '/portal/operationEvaluationPortalAction/getInfoVOList.do',
      { params }
    )
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
 * 盈利情况
 * 参数：erp （erp号前不用加00000）
 */
export function getProfitInfoList(params) {
  return axios
    .get(BASE_URL + '/portal/wxProfitPortalAction/profitInfoList.do', {
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
 * 销售情况-按照月分查询提车实销图标
 * @param {*} erp （erp号前面需要加00000）
 */

export function getMonthSalesTrend(params) {
  return axios
    .get(
      BASE_URL + '/portal/wxSalesInfoPortalAction/monthSalesTrend.do',
      { params }
    )
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
 * 销售情况-提车实销库存
 * erp (erp号前面需要加00000） erp=0000010145&yyyymm=201902
 */
export function getBdOverallSalesByMonth(params){
  return axios
  .get(
    BASE_URL + '/portal/wxSalesInfoPortalAction/bdOverallSalesByMonth.do',
    { params }
  )
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
 * 销售情况-车型提车实销 (erp号前面需要加00000）
 * erp=0000010145&yyyymm=201902
 */
export function fenChanPinXiaoLiang(params){
  return axios
  .get(
    BASE_URL + '/portal/wxSalesInfoPortalAction/fenChanPinXiaoLiang.do',
    { params }
  )
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
 * 产品销量
 * erp=0000010145 (erp号前面需要加00000）
 * @param {*} params
 */
export function chanPinXiaoLiang(params){
  return axios
  .get(
    BASE_URL + '/portal/wxSalesInfoPortalAction/chanPinXiaoLiang.do',
    { params }
  )
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
 * 销售运营
 * @param {*} params
 */
export function getSalesOperation(params){
  return axios
  .get(
    BASE_URL + '/portal/cluePortalAction/getSalesOperation.do',
    { params }
  )
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
 * 销售运营
 * @param {*} params
 */
export function searchSalesOperationByErpAndYear(params){
  return axios
  .get(
    BASE_URL + '/portal/cluePortalAction/searchBdSalesOperationByErpAndYear.do',
    { params }
  )
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
 * 销售运营
 * @param {*} params
 */
export function getSalesOperationByDealerId(params){
    return axios
        .get(
            BASE_URL + '/portal/salesOperationPortalAction/getSalesOperationByDealerId.do',
            { params }
        )
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


// 2020-06-09

/**
 * 运营评估-销售运营
 * @param {*} params
 */
export function getSalesOperationDetail(params){
  return axios
    .get(
      BASE_URL + '/portal/salesOperationPortalAction/getSalesOperationDetail.do',
      { params }
    )
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
 * 运营评估-服务运营
 * @param {*} params
 */
export function getSerOperationDetail(params){
  return axios
    .get(
      BASE_URL + '/portal/serOperateInfoPortalAction/getSerOperationDetail.do',
      { params }
    )
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
 * 运营评估-星级评估
 * @param {*} params
 */
export function getOperationEvaluationList(params){
  return axios
    .get(
      BASE_URL + '/portal/operationEvaluationPortalAction/getOperationEvaluationList.do',
      { params }
    )
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
 * 奖惩信息-日常奖惩
 * @param {*} params
 */
export function getRewardsInfo(params){
  return axios
    .get(
      BASE_URL + '/portal/rewardsPortalAction/getRewardsInfo.do',
      { params }
    )
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
 * 奖惩信息-年度表彰
 * @param {*} params
 */
export function getAnnualRecognitionList(params){
  return axios
    .get(
      BASE_URL + '/portal/annualRecognitionPortalAction/getAnnualRecognitionList.do',
      { params }
    )
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
 * 销量数据-当年销量
 * @param {*} params
 */
export function getSalesDetail(params){
  return axios
    .get(
      BASE_URL + '/portal/salesMgtPortalAction/getSalesDetail.do',
      { params }
    )
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
 * 销量数据-历史销量
 * @param {*} params
 */
export function getHistorySales(params){
  return axios
    .get(
      BASE_URL + '/portal/salesMgtPortalAction/getHistorySales.do',
      { params }
    )
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
 * 销量数据-分产品销量
 * @param {*} params
 */
export function getSalesProductDetail(params){
  return axios
    .get(
      BASE_URL + '/portal/salesMgtPortalAction/getSalesProductDetail.do',
      { params }
    )
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
 * 销售成绩单
 * @param {String} params.dealerId
 * @param {String} params.year
 * @param {String} params.month
 */
export function getEvaluationDetail(params){
    return axios
        .get(
            BASE_URL + '/portal/homePagePcAction/getEvaluationDetail.do',
            { params }
        )
        .then(data => {
            if (data.code === '0' || data.code === '1001') {
                return data.data
            }
            throw new Error(data.desc)
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
 * 服务成绩单
 * @param {String} params.dealerId
 * @param {String} params.year
 * @param {String} params.month
 * @return {Promise<axios>}
 */
export function getAfterEvaluationDetail(params){
    return axios
        .get(
            BASE_URL + '/portal/homePagePcAction/getAfterEvaluationDetail.do',
            { params }
        )
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
