
import axios from 'axios'
import { Toast } from 'quickwork-ui'

const SUCCESS_CODE = '0'
const BASE_URL = `${_.baseURL}`



export function getAllFundingStatus(params){
  return axios.get(BASE_URL+'/portal/fundingStatusPortalAction/getAllFundingStatus.do', {params})
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


export function getAllFundBalance(params){
  return axios.get(BASE_URL+'/portal/fundBalancePortalAction/getAllFundBalance.do', {params})
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
 * 个人信息 erpNo=10073
 */
export function getPersonInfo(params){
  return axios.get(BASE_URL+'/portal/personInfoAction/getPersonInfo.do', {params})
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
 * 个人信息详情
 * id=a012225b710e7c45a1e38b78c67574d7
 * @param {*} params
 */
export function getPersonInfoDetail(params){
  return axios.get(BASE_URL+'/portal/personInfoAction/getPersonInfoDetail.do', {params})
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
 * 股东 dealerId=1
 *
http://localhost:8080/wxqyh//?dealerId=1    //经销商ID
 * @param {*} params
 */
export function getShareHolder(params){
  return axios.get(BASE_URL+'/portal/shareHolderPortalAction/getShareHolder.do', {params})
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
 * http://localhost:8080/wxqyh//portal/shareHolderPortalAction/getShareHolderLog.do?dealerId=1  //经销商ID
 * 经销记录
 * @param {*} params
 */
export function getShareHolderLog(params){
  return axios.get(BASE_URL+'/portal/shareHolderPortalAction/getShareHolderLog.do', {params})
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
 * 基本信息
 * id=1
 */
export function getBasisInfo(params){
  return axios.get(BASE_URL+'/portal/qrbasisPortalCtl/selBasisInfo.do', {params})
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

//http://localhost:8999/wxqyh/qrbasis/qrbasisAction!selUserInfo.action?id=1
/**
 * 核心人员
 */
export function getSelUserInfo(params){
  return axios.get(BASE_URL+'/portal/qrbasisPortalCtl/selUserInfo.do', {params})
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
 * 开票信息
 * http://localhost:8999/wxqyh/qrbasis/qrbasisAction!selNoteInfo.action?id=1
 * @param {*} params
 */
export function getNoteInfo(params){
  return axios.get(BASE_URL+'/portal/qrbasisPortalCtl/selNoteInfo.do', {params})
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
 * 销售渠道?id=1
 * ?id=1
 */
export function getAuthorityInfo(params){
  return axios.get(BASE_URL+'/portal/qrbasisPortalCtl/selAuthorityInfo.do', {params})
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
 * 直营店
 */
export function getSelMaketList(params){

  return axios.get(BASE_URL+'/portal/marketPortalCtl/selMarketList.do', {params})
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
 * 废弃
 */
export function getUserTraining(params){
  return axios.get(BASE_URL+'/portal/plancity/userTrainingPortalAction!getUserTraining.action', {params})
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
 * 人员信息
 */
// 人员信息-业务类型接口 /portal/postPcAction/getAllPositionType.do
  export function getAllPositionType({type,postType}){
    return axios.post(BASE_URL+'/portal/postPcAction/getAllPositionType.do', {type,postType})
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

// 岗位类型
export function getPositionType(data){
    return axios.post(BASE_URL+'/portal/postPcAction/getPositionType.do', data)
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


// 人员信息-岗位配置接口 /wxqyh/portal/personInfoAction/getAllocationDetail.do
  export function getAllocationDetail(params){
    return axios.get(BASE_URL+'/portal/personInfoAction/getAllocationDetail.do', {params})
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
// 人员信息-在职人员接口 /wxqyh/portal/personInfoAction/getPersonList.do
  export function getPersonList(params){
    return axios.get(BASE_URL+'/portal/personInfoAction/getPersonList.do', {params})
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
// 人员信息-变更记录接口 /wxqyh/portal/personInfoAction/getChangeRecord.do
  export function getChangeRecord(params){
    return axios.get(BASE_URL+'/portal/personInfoAction/getChangeRecord.do', {params})
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
 * 培训信息
 */
export function getUserTrainingList(params){
  return axios.get(BASE_URL+'/portal/plancity/userTrainingPortalAction!getUserTrainingList.action', {params})
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
// 培训信息-产品培训明细接口
// /wxqyh/portal/plancity/userTrainingPortalAction!getProductTrainingData.action
export function getProductTrainingData(params){
  return axios.get(BASE_URL+'/portal/plancity/userTrainingPortalAction!getProductTrainingData.action', {params})
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
// 培训信息-培训总览接口
// /wxqyh/portal/plancity/userTrainingPortalAction!getOverviewTrainingData.action
// dealerId
export function getOverviewTrainingData(params){
  return axios.get(BASE_URL+'/portal/plancity/userTrainingPortalAction!getOverviewTrainingData.action', {params})
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
// 培训信息-认证明细接口
// /wxqyh/portal/plancity/userTrainingPortalAction!getAuthDetailList.action
export function getAuthDetailList(params){
  return axios.get(BASE_URL+'/portal/plancity/userTrainingPortalAction!getAuthDetailList.action', {params})
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
 * 直营店
 */
export function searchDealerAuthority(params){
  return axios.get(BASE_URL+'/portal/dealerPortalAction/searchDealerAuthority.do', {params})
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

// 2702b60c-3fa9-4f2a-8d0c-4a5ff0a72616
/**
 * 网销平台
 * @param {*} params
 */
export function getSelPlatFromList(params){
  return axios.get(BASE_URL+'/portal/platFromPortalCtl/selPlatFromList.do', {params})
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
 * dms售后服务权限接口-服务车型-轻应用端
 * @param {*} param.dealerId
 */
export function searchDmsAfterCarTypeByKey(params){
  return axios.get(BASE_URL+'/portal/dmsAfterSalePortalAction/searchDmsAfterCarTypeByKey.do', {params})
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
 * dms售后服务权限接口-销售区域-轻应用端
 * @param {*} param.dealerId
 * @param {*} param.categoryName
 */
export function searchDmsAfterSaleAreaByKey(params){
  return axios.get(BASE_URL+'/portal/dmsAfterSalePortalAction/searchDmsAfterSaleAreaByKey.do', {params})
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
   * dms售后服务权限接口-列表-轻应用端
   * @param {*} param
   */
  export function searchDealerSaleAfterByDealerId(params){
    return axios.get(BASE_URL+'/portal/dealerPortalAction/searchDealerSaleAfterByDealerId.do', {params})
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
   * dms售后服务权限接口-列表-轻应用端
   * @param {*} param
   */
  export function getAreaByDealerIdAndCarType(params){
    return axios.get(BASE_URL+'/portal/dealerPortalAction/getAreaByDealerIdAndCarType.do', {params})
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
   * 销售车型
   * @param {*} param
   */
  export function getCarTypeListByDealerId(params){
    return axios.get(BASE_URL+'/portal/dealerPortalAction/getCarTypeListByDealerId.do', {params})
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
 * 工商-通讯联络信息
 */
export function getLegalRepresentative(erpId){
  return axios.post(BASE_URL+'/portal/basicsBusinessInfoPcAction/getLegalRepresentative.do', {erpId})
  .then(data => {
    if (String(0) !== '0') {
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
 * 工商-基本信息
 */
export function getBasicInfo(erpId){
  return axios
    .post(BASE_URL+'/portal/basicsBusinessInfoPcAction/getBasicInfo.do', {
      erpId
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
 * 工商-开票信息
 */
export function getBillingInfo(erpId){
  return axios.post(BASE_URL+'/portal/basicsBusinessInfoPcAction/getBillingInfo.do', {erpId})
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
 * 工商-股东股本信息
 */
export function getStockRightInfoList(erpId){
  return axios
    .post(BASE_URL+'/portal/basicsBusinessInfoPcAction/getStockRightInfoList.do', {
      erpId
    })
  .then(data => {
    if (String(data.code) !== '0') {
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
 * 工商-变更记录
 */
export function getStockRightChangeInfoList(erpId){
  return axios
    .post(BASE_URL+'/portal/basicsBusinessInfoPcAction/getStockRightChangeInfoList.do', {
      erpId
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
 * 资金-资金构成
 */
export function getFacilityQuota(erpId, year, month){
  return axios
    .post(BASE_URL+'/portal/basicsCapitalInfoPcAction/getFacilityQuota.do', {
      erpId,
      year,
      month
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
 * 资金-盈利情况
 */
export function getProfitability(erpId, year, month){
  return axios
    .post(BASE_URL+'/portal/basicsCapitalInfoPcAction/getProfitability.do', {
      erpId,
      year,
      month
    })
  .then(data => {
    if (String(data.code) !== '0') {
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
 * 资金-整车资金余额
 */
export function getVehicleCapital(erpId, year, month){
  return axios
    .post(BASE_URL+'/portal/basicsCapitalInfoPcAction/getVehicleCapital.do', {
      erpId,
      year,
      month
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
 * 授权-销售权限
 */
export function getWarrantInfoList(erpId){
  return axios
    .post(BASE_URL+'/portal/basicsWarrantInfoPcAction/getWarrantInfoList.do', {
      erpId
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


