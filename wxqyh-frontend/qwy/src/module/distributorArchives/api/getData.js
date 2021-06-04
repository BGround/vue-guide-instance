import axios from 'axios'
import Qs from 'qs';

function commonPost(url, params, callback) {
  dataBase.loading = true
  axios.post(_.baseURL + url, params).then(function(result) {
    dataBase.loading = false
    if (result.code == '0') {
      callback(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

export function sendMsgToLeaders(){
  commonPost('/mgr/salesreport/salesreportMgrAction!sendMsgToLeaders.action')
}

export function ajaxSearchMenuList(callback) {
  commonPost(
    '/menu/menuAction!ajaxSearchMenuList.action',
    {
      menuAssortment: 'content'
    },
    callback
  )
}

// 档案袋-公司信息
export function ajaxGetselCompanyInfo(data, callback) {
  commonPost('/qrbasis/qrbasisAction!selCompanyInfo.action', data, callback)
}
// 规划开发-城市信息
export function ajaxPlanCityInfoAction(data, callback) {
  commonPost(
    '/mgr/plancity/planCityMgrAction!getCityInfo.action',
    data,
    callback
  )
}

// 规划开发-商圈信息
export function ajaxGetTradingArea(data, callback) {
  commonPost('/pc/trading/getTradingArea.do', data, callback)
}
// 规划开发-商圈信息表头
export function ajaxGetTradingAreaTable(data, callback) {
  commonPost('/pc/trading/getTradingAreaTable.do', data, callback)
}

// 规划开发-更多商圈信息
export function ajaxGetTradingAreaAll(data, callback) {
  commonPost('/pc/trading/getTradingAreaAll.do', data, callback)
}

// 规划开发-商圈地图
export function ajaxGetTradingInfo(data, callback) {
  commonPost('/pc/trading/getTradingInfo.do', data, callback)
}

// 规划开发-市场信息-城市区县市占率
export function ajaxGetCityStatistics(data, callback) {
  commonPost(
    '/mgr/plancity/planCityMgrAction!getCityStatistics.action',
    data,
    callback
  )
}

// 规划开发-市场信息-城市区县市占率（按传入年月统计月份）（查看更多 时使用这个接口
export function ajaxGetCityStatisticsByMonth(data, callback) {
  commonPost(
    '/mgr/plancity/planCityMgrAction!getCityStatisticsByMonth.action',
    data,
    callback
  )
}

// 规划开发-市场信息-分产品统计
export function ajaxGetProductStatistics(data, callback) {
  commonPost(
    '/mgr/plancity/planCityMgrAction!getProductStatistics.action',
    data,
    callback
  )
}

// 规划开发-市场信息-分品牌统计-全市场
export function ajaxGetBrandStatistics(data, callback) {
  commonPost(
    '/mgr/plancity/planCityMgrAction!getBrandStatistics.action',
    data,
    callback
  )
}
// 规划开发-市场信息-分品牌统计-自主品牌
export function ajaxGetBrandStatisticsByType(data, callback) {
  commonPost(
    '/mgr/plancity/planCityMgrAction!getBrandStatisticsByType.action',
    data,
    callback
  )
}

// 基础信息-公司基本信息-
export function ajaxGetBasisInfo(data, callback) {
  commonPost('/qrbasis/qrbasisAction!selBasisInfo.action', data, callback)
}
// 基础信息-公司基本信息-核心人员
export function ajaxGetSelUserInfo(data, callback) {
  commonPost('/qrbasis/qrbasisAction!selUserInfo.action', data, callback)
}
// 基础信息-公司基本信息-开票信息
export function ajaxGetSelNoteInfo(data, callback) {
  commonPost('/qrbasis/qrbasisAction!selNoteInfo.action', data, callback)
}
// 基础信息-公司基本信息-销售渠道
export function ajaxGetelAuthorityInfo(data, callback) {
  commonPost('/qrbasis/qrbasisAction!selAuthorityInfo.action', data, callback)
}

// 基础信息-人员信息-售前售后
// export function ajaxPersoninfoAction(data, callback) {
//   commonPost(
//     '/base/personinfo/personinfoAction!listPersonInfo.action', data, callback
//   )
// }
// 基础信息-人员信息-售前售后配备率及关键岗位、业务岗位、认证岗位、1.5网人员、在职人员信息
export function ajaxGetPersonRate(data, callback) {
  commonPost('/pc/personInfoAction/getPersonRate.do', data, callback)
}
// 基础信息-人员信息-人员变更
export function ajaxGetPersonChange(data, callback) {
  commonPost('/mgr/personChange/personChangeMgrAction!getPersonChange.action', data, callback)
}
// 基础信息-人员信息-人员变更详情
export function ajaxGetPersonChangeInfo(data, callback) {
  commonPost('/mgr/personChange/personChangeMgrAction!getUserInfo.action', data, callback)
}

// 基础信息-资金余额
export function ajaxGetAllFundBalance(data, callback) {
  commonPost('/pc/fundBalancePortalAction/getAllFundBalance.do', data, callback)
}

// 基础信息-资金状况
export function ajaxGetAllFundingStatus(data, callback) {
  commonPost(
    '/pc/fundingStatusPortalAction/getAllFundingStatus.do',
    data,
    callback
  )
}

// 基础信息-直营店信息
export function ajaxGetselMarketList(data, callback) {
  commonPost('/market/marketAction!selMarketList.action', data, callback)
}

// 基础信息-网销平台
export function ajaxGetselPlatFromInfo(data, callback) {
  commonPost(
    '/platfrom/platFromAction!selPlatFromInfo.action',
    data,
    callback
  )
}
// 基础信息-根据经销商ID查询销售车型
export function ajaxGetCarTypeListByDealerId(data, callback) {
  commonPost(
    '/dealer/dealerAction!getCarTypeListByDealerId.action', data, callback)
}
// 基础信息-销售车型查询销售区域
export function ajaxGetAreaByDealerIdAndCarType(data, callback) {
  commonPost(
    '/dealer/dealerAction!getAreaByDealerIdAndCarType.action', data, callback)
}
// 基础信息-根据经销商ID查询服务车系
export function ajaxGegDmsAfterCarTypeByKey(data, callback) {
  commonPost(
    '/mgr/dmsAfterSale/dmsAfterSalePcAction!searchDmsAfterCarTypeByKey.action', data, callback)
}
// 基础信息-销售车型查询服务区域
export function ajaxGetDmsAfterSaleAreaByKey(data, callback) {
  commonPost(
    '/mgr/dmsAfterSale/dmsAfterSalePcAction!searchDmsAfterSaleAreaByKey.action', data, callback)
}



// 渠道首页-战区下的省市，如果查询战区ID为空，默认查询战区数据
export function ajaxGetBasicInfoList(data, callback) {
  commonPost(
    '/dealer/dealerAction!searchDealerPagerByKey.action', data, callback
  )
}
// 渠道首页-人员信息
export function ajaxGetUserList(data, callback) {
  commonPost(
    '/dealer/dealerAction!searchDealerUserPagerByKey.action', data, callback
  )
}
// 渠道首页-运营信息
export function ajaxGetOperationsList(data, callback) {
  commonPost(
    '/dealer/dealerAction!searchOperationsDatePagerByKey.action', data, callback
  )
}


// 经销商档案-基础数据-获取在职人员列表
export function ajaxGetPersonInfoList(data, callback) {
  commonPost('/pc/personInfoAction/getPersonInfo.do', data, callback)
}
// 经销商档案-基础数据-获取人员详细信息
export function ajaxGetPersonInfoDetail(data, callback) {
  commonPost('/pc/personInfoAction/getPersonInfoDetail.do', data, callback)
}

// 经销商档案-基础数据-获取人员详细信息
export function ajaxGetPersonChangeById(data, callback) {
  commonPost('/mgr/personChange/personChangeMgrAction!getPersonChangeById.action', data, callback)
}



// 经销商档案-基础数据-股东股本信息列表获取
export function ajaxGetShareHolder(data, callback) {
  commonPost(
    '/mgr/shareholder/shareHolderMrgAction!getShareHolder.action',
    data,
    callback
  )
}
// 经销商档案-基础数据-股东股本信息查看变更信息
export function ajaxGetShareHolderLog(data, callback) {
  commonPost(
    '/mgr/shareholder/shareHolderMrgAction!getShareHolderLog.action',
    data,
    callback
  )
}


export function ajaxSearchDepatmentList(params) {
  dataBase.loading = true
  return axios.get(_.baseURL + '/dealer/dealerAction!searchDepatmentList.action', {params}).then(function(result) {
    dataBase.loading = false
    if (result.code == '0') {
      return result.data;
    } else {
      _.alert('提示', result.desc)
      throw new Error(result.desc);
    }
  })
}

// 经销商档案-人员培训
export function ajaxTrainingStatistics(data, callback) {
  commonPost(
    '/mgr/plancity/userTrainingMgrAction!getUserTrainingStatistics.action',
    data,
    callback
  )
}
// 经销商档案-岗位培训情况
export function ajaxTrainingPage(data, callback) {
  commonPost(
    '/mgr/plancity/userTrainingMgrAction!getTrainingPage.action',
    data,
    callback
  )
}
// 经销商档案-规划开发信息,一网规划方案
export function ajaxSearchPlanNetAnetInfoBykey(data, callback) {
  commonPost(
    '/mgr/plannet/plannetMgrAction!searchPlanNetAnetInfoBykey.action',
    data,
    callback
  )
}
// 经销商档案-规划开发信息,二网规划方案
export function ajaxSearchPlanNetBnetInfoBykey(data, callback) {
  commonPost(
    '/mgr/plannet/plannetMgrAction!searchPlanNetBnetInfoBykey.action',data,callback
  )
}

// 建设信息-建店及返利-一网建店返利
export function ajaxGetOneNetShopByErpNo(data, callback) {
  commonPost('/pc/oneNetShopRebatesAction/getOneNetShopByErpNo.do', data, callback)
}
// 建设信息-建店及返利-二网建店返利
export function ajaxGetSecondNetShopByErpNo(data, callback) {
  commonPost('/pc/secondNetShopRebatesAction/getSecondNetShopByErpNo.do', data, callback)
}

// 入网初始信息-入网陈述信息
export function ajaxGetfindAllNetWork(data, callback) {
  commonPost('/mgr/network/accessNetworkMgrAction!findAllNetWork.action', data, callback)
}

// 运营管理信息-盈利情况
export function ajaxGetProfitInfoListByErp(data, callback) {
  commonPost('/mgr/profit/profitMgrAction!getProfitInfoListByErp.action', data, callback)
}
// 运营管理信息-奖惩信息
export function ajaxGetRewardsList(data, callback) {
  commonPost('/rewards/rewardsAction!getRewardsInfoVOList.action', data, callback)
}
// 运营管理信息-年度表彰
export function ajaxGetRewardsAnnualList(data, callback) {
  commonPost('/annualRecognition/annualRecognitionAction!getRewardsInfoVOList.action', data, callback)
}
// 运营管理信息-服务运营
export function ajaxGetServiceOperateList(data, callback) {
  commonPost('/serOperateInfo/serOperateInfoAction!getRewardsInfoVOList.action', data, callback)
}
// 运营管理信息-综合运营评估
export function ajaxGetCompreOperateList(data, callback) {
  commonPost('/operationEvaluation/operationEvaluationAction!getInfoVOList.action', data, callback)
}
// 运营管理信息-历史销量
export function ajaxGetHistorySales(data, callback) {
  commonPost('/mgr/salesInfo/salesInfoPortalAction!getHistorySales.action', data, callback)
}
// 运营管理信息-销量趋势-月度销量
export function ajaxGetMonthSalesTrend(data, callback) {
  commonPost('/mgr/salesInfo/salesInfoPortalAction!getMonthSalesTrend.action', data, callback)
}
// 运营管理信息-销量趋势-年度销量
export function ajaxGetYearSalesTrend(data, callback) {
  commonPost('/mgr/salesInfo/salesInfoPortalAction!getYearSalesTrend.action', data, callback)
}
// 运营管理信息-销量情况-直营店实销
export function ajaxGetZhiYingDianShiXiao(data, callback) {
  commonPost('/mgr/salesInfo/salesInfoPortalAction!getZhiYingDianShiXiao.action', data, callback)
}
// 运营管理信息-销量情况-直营店实销2
export function ajaxGetZhiYingDianShiXiao2(data, callback) {
  commonPost('/mgr/salesInfo/salesInfoPortalAction!getZhiYingDianShiXiao2.action', data, callback)
}

export function ajaxGetSalesOperationByDealerId(params, callback) {
    commonPost('/pc/salesOperationPcAction/getSalesOperationByDealerId.do', params, callback)
}

// 运营管理信息-销量情况-分产品销量
export function ajaxGetFenChanPinXiaoLiang(data, callback) {
  commonPost('/mgr/salesInfo/salesInfoPortalAction!getFenChanPinXiaoLiang.action', data, callback)
}
// 运营管理信息-总体销量-当年目标
export function ajaxGetYearTarget(data, callback) {
  commonPost('/mgr/salesInfo/salesInfoPortalAction!getYearTarget.action', data, callback)
}
// 运营管理信息-总体销量-当年累计
export function ajaxGetYearAccumulated(data, callback) {
  commonPost('/mgr/salesInfo/salesInfoPortalAction!getYearAccumulated.action', data, callback)
}
// 运营管理信息-总体销量-本店当月完成
export function ajaxGetOverallSalesBDDYWC(data, callback) {
  commonPost('/mgr/salesInfo/salesInfoPortalAction!getOverallSalesBDDYWC.action', data, callback)
}
// 运营管理信息-总体销量-省当月完成
export function ajaxGetOverallSalesQSDYWC(data, callback) {
  commonPost('/mgr/salesInfo/salesInfoPortalAction!getOverallSalesQSDYWC.action', data, callback)
}
// 运营管理信息-总体销量-战区当月完成
export function ajaxGetOverallSalesZQDYWC(data, callback) {
  commonPost('/mgr/salesInfo/salesInfoPortalAction!getOverallSalesZQDYWC.action', data, callback)
}
// 运营管理信息-总体销量-全国当月完成
export function ajaxGetOverallSalesQGDYWC(data, callback) {
  commonPost('/mgr/salesInfo/salesInfoPortalAction!getOverallSalesQGDYWC.action', data, callback)
}
// 运营管理信息-总体销量-销售运营统计图数据
export function ajaxGetSalesOperation(data, callback) {
  commonPost('/pc/cluePcAction/getBdSalesOperationByErp.do', data, callback)
}
// 运营管理信息-总体销量-销售运营表格数据-本店
export function ajaxGetSalesOperationStoreTable(data, callback) {
  commonPost('/pc/cluePcAction/searchBdSalesOperationByErpAndYear.do', data, callback)
}
// 运营管理信息-总体销量-销售运营表格数据-全国
export function ajaxGetSalesOperationQgTable(data, callback) {
  commonPost('/pc/cluePcAction/searchQgSalesOperationByErpAndYear.do', data, callback)
}
// 运营管理信息-总体销量-销售运营表格数据-全省
export function ajaxGetSalesOperationQsTable(data, callback) {
  commonPost('/pc/cluePcAction/searchQsSalesOperationByErpAndYear.do', data, callback)
}
// 运营管理信息-总体销量-销售运营表格数据-战区
export function ajaxGetSalesOperationZqTable(data, callback) {
  commonPost('/pc/cluePcAction/searchZqSalesOperationByErpAndYear.do', data, callback)
}

// 获取省份
export function ajaxGetProvince(data, callback) {
  commonPost('/mgr/plancity/planCityMgrAction!getProvince.action', data, callback)
}
// 获取城市
export function ajaxGetCity(data, callback) {
  commonPost('/mgr/plancity/planCityMgrAction!getCity.action', data, callback)
}

// 形象建设信息-形象展示
// export function ajaxGetImageDisplay(data, callback) {
//   commonPost('/mgr/imageDisplayMgrAction/ImageDisplayMgrAction!selectByErpNo.action', data, callback)
// }
export function ajaxGetImageDisplay(data, callback) {
  commonPost('/mgr/imageDisplayMgrAction/ImageDisplayMgrAction!selectByDealerInfoId.action', data, callback)
}
// 形象建设信息-店面信息
export function ajaxGetShopInfoByErpNo(data, callback) {
  commonPost('/pc/shopInfoAction/getShopInfoByErpNo.do', data, callback)
}
// 形象建设信息-建设过程管理
export function ajaxGetConstructionProcess(data, callback) {
  commonPost('/pc/building/buildingPcAction!getConstructionProcess.action', data, callback)
}
// 形象建设信息-建设过程管理详情
export function ajaxGetConstructionImg(data, callback) {
  commonPost('/pc/building/buildingPcAction!getConstructionImg.action', data, callback)
}


// 预警退网信息-风险评估-财务情况
export function ajaxGetRiskAssessment(data, callback) {
  commonPost('/retire/riskAssessment/riskAssessmentAction!getRiskAssessment.action', data, callback)
}
// 预警退网信息-退网信息
export function ajaxGetRetireInfo(data, callback) {
  commonPost('/retire/info/retireAction!getRetireInfo.action', data, callback)
}
// 预警退网信息-退网清算状态
export function ajaxGetFlowStage(data, callback) {
  commonPost('/mgr/quitWarning/quitWarningPcAction!getFlowStage.action', data, callback)
}

//
export function ajaxGetPcQuitWarningForm2(data, callback) {
  commonPost('/mgr/quitWarning/quitWarningPcAction!getPcQuitWarningForm.action', data, callback)
}

// 预警退网信息-清算部门-当前清算状态
export function ajaxGetLiquidationDept(data, callback) {
  commonPost('/mgr/quitWarning/quitWarningPcAction!getLiquidationDept.action', data, callback)
}
// 预警退网信息-获取表单内容往来业务时间和保证金退款进度
export function ajaxGetPcQuitWarningForm(data, callback) {
  commonPost('/mgr/quitWarning/quitWarningPcAction!getPcQuitWarningForm.action', data, callback)
}
// 预警退网信息-预警陈述信息
export function ajaxGetFindAllEarlyWarning(data, callback) {
  commonPost('/earlyWarning/info/earlyWarningAction!findAllEarlyWarning.action', data, callback)
}
// 预警退网信息-陈述项目整改
export function ajaxGetEarlyRectification(data, callback) {
  commonPost('/earlyWarning/earlyRectification/earlyRectificationAction!findAllEarlyWarning.action', data, callback)
}
// 预警退网信息-预警陈述流程状态
export function ajaxGetSelectByState(data, callback) {
  commonPost('/earlyWarning/info/earlyWarningAction!selectByState.action', data, callback)
}

// 经销商档案-成绩单
export function ajaxGetSalesreportList(data, callback) {
  commonPost('/mgr/salesreport/salesreportMgrAction!searchSalesreportPage.action', data, callback)
}
// 经销商档案-成绩单-生成
export function ajaxCreateSalesreport(data, callback) {
  commonPost('/mgr/salesreport/salesreportMgrAction!createSalesreport.action', data, callback)
}
// 经销商档案-成绩单-发送
export function ajaxPushMessage(data, callback){
  commonPost('/mgr/salesreport/salesreportMgrAction!pushMessage.action', data, callback)
}
// 经销商档案-成绩单-删除
export function ajaxDelSalesreport(data, callback){
  commonPost('/mgr/salesreport/salesreportMgrAction!delSalesreport.action', data, callback)
}
// export function ajaxPushMessage(data, callback){
//   dataBase.loading = true
//   axios.post(_.baseURL + '/mgr/salesreport/salesreportMgrAction!pushMessage.action', data,{
//     transformRequest: [
//       function(data) {
//         return Qs.stringify(data, { arrayFormat: 'repeat' })
//       }
//     ],
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     }
//   }).then(function(result) {
//     dataBase.loading = false
//     if (result.code == '0') {
//       callback(result.data)
//     } else {
//       _.alert('提示', result.desc)
//     }
//   })
// }

// 经销商档案-成绩单-导出  /pc/dealerFeedBackPcAction/checkDealerDownLoadZip.do
export function checkDealerDownLoadZip(data){
  return axios
    .post(_.baseURL + '/pc/dealerFeedBackPcAction/checkDealerDownLoadZip.do', data).then(data => {
      if (data.code !== 0){
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      _.alert('提示',error.message)
    })
}
// export function checkDealerDownLoadZip(data){
//   commonPost('/pc/dealerFeedBackPcAction/checkDealerDownLoadZip.do', data)
// }
// 经销商档案-成绩单-提醒
export function ajaxPushNotesMessage(data, callback){
  commonPost('/mgr/salesreport/salesreportMgrAction!pushNotesMessage.action', data, callback)
}
// 经销商档案-成绩单-反馈审批
export function searchFeedBackList(params){
  return axios
    .post(_.baseURL + '/pc/dealerFeedBackPcAction/searchFeedBackList.do', params)
    .then(data => {
      if (data.code !== 0){
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      _.alert('提示',error.message)
    })
}
// 经销商档案-成绩单-反馈审批-审核经销商反馈申请
export function updateFeedBackByStatus(params,callback){
  return axios
    .post(_.baseURL + '/pc/dealerFeedBackPcAction/updateFeedBackByStatus.do', params)
    .then(data => {
      if (data.code !== 0){
        throw new Error(data.desc)
      }else{
        callback()
      }
    })
    .catch(error => {
      _.alert('提示', error.message)
    })
}
// export function ajaxPushNotesMessage(data, callback){
//   dataBase.loading = true
//   axios.post(_.baseURL + '/mgr/salesreport/salesreportMgrAction!pushNotesMessage.action', data,{
//     transformRequest: [
//       function(data) {
//         return Qs.stringify(data, { arrayFormat: 'repeat' })
//       }
//     ],
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     }
//   }).then(function(result) {
//     dataBase.loading = false
//     if (result.code == '0') {
//       callback(result.data)
//     } else {
//       _.alert('提示', result.desc)
//     }
//   })
// }

// 经销商档案-成绩单-详情
export function ajaxGetSalesreportDetail(data, callback) {
  commonPost('/mgr/salesreport/salesreportMgrAction!getSalesreportDetail.action', data, callback)
}
// 成绩单详情-经销商反馈 /wxqyh/mgr/salesreport/salesreportMgrAction!getSalesreportDetail.action
export function getSalesreportDetail(params){
  return axios
    .post(_.baseURL + '/mgr/salesreport/salesreportMgrAction!getSalesreportDetail.action', params)
    .then(data => {
      if (data.code !== "0"){
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      _.alert('提示', error.message)
    })
}

// 成绩单详情-退回记录列表
export function searchSalesreportRtnList(params){
  return axios
    .post(_.baseURL + '/mgr/salesreport/salesreportMgrAction!searchSalesreportRtnList.action', params)
    .then(data => {
      if (data.code !== "0"){
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      _.alert('提示', error.message)
    })
}

// 成绩单详情-提交退回申请
export function addRtnSalesreport(params){
  return axios
    .post(_.baseURL + '/mgr/salesreport/salesreportMgrAction!addRtnSalesreport.action', params)
    .then(data => {
      if (data.code !== "0"){
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      _.alert('提示', error.message)
    })
}

// 成绩单详情-退回人查询
export function queryRtnUser(params){
  return axios
    .post(_.baseURL + '/mgr/salesreport/salesreportMgrAction!queryRtnUser.action', params)
    .then(data => {
      if (data.code !== "0"){
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      _.alert('提示', error.message)
    })
}

// 成绩单详情-市场表现 /wxqyh/pc/marketReportMgrAction/getMarketReportInfo.do
export function getMarketReportInfo(params){
  return axios
    .post(_.baseURL + '/pc/marketReportMgrAction/getMarketReportInfo.do', params)
    .then(data => {
      if (data.code !== 0){
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      _.alert('提示', error.message)
    })
}
// 成绩单详情-销量表现 /wxqyh/pc/marketReportMgrAction/getSalesreportSales.do
export function getSalesreportSales(params){
  return axios
    .post(_.baseURL + '/pc/marketReportMgrAction/getSalesreportSales.do', params)
    .then(data => {
      if (data.code !== 0){
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      _.alert('提示', error.message)
    })
}
// 成绩单详情-奖惩信息 /wxqyh/pc/marketReportMgrAction/getSalesreportRewards.do
export function getSalesreportRewards(params){
  return axios
    .post(_.baseURL + '/pc/marketReportMgrAction/getSalesreportRewards.do', params)
    .then(data => {
      if (data.code !== 0){
        throw new Error(data.desc)
      }
      return data.data
    })
    .catch(error => {
      _.alert('提示', error.message)
    })
}
// 经销商档案-成绩单-开放详情
export function ajaxGetOpenSalesreportDetail(data, callback) {
  commonPost('/open/salesreport/salesreportOpenAction!getSalesreportDetail.action', data, callback)
}

// 经销商档案-售后成绩单详情
export function ajaxGetSalesAfetrReportById(data, callback) {
  commonPost('/mgr/salesreport/salesAfterMgrAction!getSalesAfetrReportById.action', data, callback)
}
// 经销商档案-售后成绩单
export function ajaxGetSalesAfetrReportList(data, callback) {
  commonPost('/mgr/salesreport/salesAfterMgrAction!ajaxServiceInfoSearch.action', data, callback)
}
// 经销商档案-售后成绩单-发送功能
// export function ajaxSalesAfetrPushMessage(data, callback) {
//   commonPost('/mgr/salesreport/salesAfterMgrAction!pushMessage.action', data, callback)
// }
export function ajaxSalesAfetrPushMessage(data, callback){
  dataBase.loading = true
  axios.post(_.baseURL + '/mgr/salesreport/salesAfterMgrAction!pushMessage.action', data,{
      transformRequest: [
        function(data) {
          return Qs.stringify(data, { arrayFormat: 'repeat' })
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
  }).then(function(result) {
    dataBase.loading = false
    if (result.code == '0') {
      callback(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

// 经销商档案-售后成绩单-提醒审阅
// export function ajaxSalesAfetrPushNotesMessage(data, callback) {
//   commonPost('/mgr/salesreport/salesAfterMgrAction!pushNotesMessage.action', data, callback)
// }
export function ajaxSalesAfetrPushNotesMessage(data, callback){
  dataBase.loading = true
  axios.post(_.baseURL + '/mgr/salesreport/salesAfterMgrAction!pushNotesMessage.action', data,{
    transformRequest: [
      function(data) {
        return Qs.stringify(data, { arrayFormat: 'repeat' })
      }
    ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function(result) {
    dataBase.loading = false
    if (result.code == '0') {
      callback(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

/**
 * 上传文件
 * @param file
 * @return {Promise<unknown>}
 */
export function doUploadFile(file){
    const data = {
        author: _.userName || '',
        file: file,
        agent: dataBase.agentCode,
    };
    dataBase.loading = true;
    return axios.post({
        baseURL: _.baseURL,
        url: '/fileupload/fileUploadMgrAction!doUploadFile.action',
        data: data,
    }).then(function(result) {
        dataBase.loading = false
        if (result.code === '0') {
            return result.data;
        } else {
            _.alert('提示', result.desc)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}

/**
 * 品牌列表
 * @param file
 * @return {Promise<unknown>}
 */
export function ajaxSearchBrand(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/pc/reportCardBrandMgrAction/ajaxSearch.do',
        data: data,
    }).then(function(result) {
        if (result.code === '0') {
            return result.data;
        } else {
            _.alert('提示', result.desc)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}
/**
 * 增加品牌
 * @param file
 * @return {Promise<unknown>}
 */
export function ajaxAddBrand(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/pc/reportCardBrandMgrAction/ajaxAdd.do',
        data: data,
    }).then(function(result) {
        if (result.code === '0') {
            return result.data;
        } else {
            _.alert('提示', result.desc)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}

/**
 * 竞品列表
 * @param
 * @return {Promise<unknown>}
 */
export function planEnterprisePager(params){
  return axios({
    method: 'POST',
    baseURL: _.baseURL,
    url: '/pc/reportCardBrandMgrAction/planEnterprisePager.do',
    params: params,
    // paramsSerializer: function(params) {
    //     return Qs.stringify(params, {arrayFormat: 'repeat'})
    // },
  }).then(function(result) {
      if (result.code === '0') {
          return result.data;
      } else {
          _.alert('提示', result.desc)
      }
  })
}

/**
 * 删除
 * @param
 * @return {Promise<unknown>}
 */
export function ajaxBatchDelete(params){
    return axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/pc/reportCardBrandMgrAction/ajaxBatchDelete.do',
        params: params,
        paramsSerializer: function(params) {
            return Qs.stringify(params, {arrayFormat: 'repeat'})
        },
    }).then(function(result) {
        if (result.code === '0') {
            return result.data;
        } else {
            _.alert('提示', result.desc)
        }
    })
}

/**
 * 删除
 * @param
 * @return {Promise<unknown>}
 */
export function ajaxUpdateBrand(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/pc/reportCardBrandMgrAction/ajaxUpdate.do',
        data: data,
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.desc)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}


/**
 * 获取企业名称
 * @param
 * @return {Promise<unknown>}
 */
export function getCompany(){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'get',
        url: '/pc/reportCardBrandMgrAction/getCompany.do',
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.desc)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}


/**
 * 获取品牌 ?pid=一汽丰田
 * @param.pid
 * @return {Promise<unknown>}
 */
export function getBrand(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'get',
        url: '/pc/reportCardBrandMgrAction/getBrand.do',
        params:params
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.desc)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}

/**
 * 竞品管理-企业信息更新-校验是否有新的更新未查看
 * @param
 * @return {Promise<unknown>}
 */
export function checkBrand(params){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'post',
      url: '/pc/reportCardBrandMgrAction/checkBrand.do',
      params:params
  }).then(function(result) {
      if (String(result.code) === '0') {
          return result.data;
      } else {
          _.alert('提示', result.desc)
      }
  }).finally(()=>{
      dataBase.loading = false
  })
}

/**
 * 竞品管理-企业信息更新-未查看状态更新为已阅
 * @param
 * @return {Promise<unknown>}
 */
export function batchUpdate(params){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'post',
      url: '/pc/reportCardBrandMgrAction/batchUpdate.do',
      params:params
  }).then(function(result) {
      if (String(result.code) === '0') {
          return result.data;
      } else {
          _.alert('提示', result.desc)
      }
  }).finally(()=>{
      dataBase.loading = false
  })
}

/**
 * 竞品管理-企业信息更新-分页查询企业信息
 * @param
 * @return {Promise<unknown>}
 */
export function ajaxPlanEnterprise(params){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'post',
      url: '/pc/reportCardBrandMgrAction/ajaxPlanEnterprise.do',
      params:params
  }).then(function(result) {
      if (String(result.code) === '0') {
          return result.data;
      } else {
          _.alert('提示', result.desc)
      }
  }).finally(()=>{
      dataBase.loading = false
  })
}

/**
 * 查询
 * @param
 * @return {Promise<unknown>}
 */
export function searchServiceErp(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'get',
        url: '/pc/serviceAdminPortalAction/searchServiceErp.do',
        params: params,
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.msg)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}


/**
 * 查询服务负责人
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxSearchServiceAdmin(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'GET',
        url: '/pc/serviceAdminPortalAction/ajaxSearch.do',
        params: params,
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.msg)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}


/**
 * 新增更新负责人
 * @param data
 * @return {Promise<unknown>}
 */
export function addAndUpdateSearchService(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/pc/serviceAdminPortalAction/addAndUpdate.do\n',
        data: data,
        transformRequest:[function (data) {
            return JSON.stringify(data);
        }],
        headers: {'Content-Type': 'application/json;charset=UTF-8'},
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result;
        } else {
            _.alert('提示', result.msg)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}


/**
 * PC端-大区负责人回显
 * @param data
 * @return {Promise<unknown>}
 */
export function serviceAdminPortalAction(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/pc/serviceAdminPortalAction/ajaxView.do',
        data: data,
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.msg)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}



/**
 * PC端-大区负责人删除
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxDeleteServiceAdmin(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/pc/serviceAdminPortalAction/ajaxDelete.do',
        data: data,
        transformRequest: [
          function(data) {
            return Qs.stringify(data, { indices: false });
          }
        ],
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result;
        } else {
            _.alert('提示', result.msg)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}

/**
 * 查询大区负责人（销售）
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxSearchSaleAdmin(params){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'GET',
      url: '/pc/serviceAdminPortalAction/ajaxSearchTwo.do',
      params: params,
  }).then(function(result) {
      if (String(result.code) === '0') {
          return result.data;
      } else {
          _.alert('提示', result.desc)
      }
  }).finally(()=>{
      dataBase.loading = false
  })
}


/**
* 新增更新负责人(销售)
* @param data
* @return {Promise<unknown>}
*/
export function addAndUpdateSearchSale(data){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'post',
      url: '/pc/serviceAdminPortalAction/addAndUpdateTwo.do\n',
      data: data,
      transformRequest:[function (data) {
          return JSON.stringify(data);
      }],
      headers: {'Content-Type': 'application/json;charset=UTF-8'},
  }).then(function(result) {
      if (String(result.code) === '0') {
          return result;
      } else {
          _.alert('提示', result.msg)
      }
  }).finally(()=>{
      dataBase.loading = false
  })
}


/**
* PC端-大区负责人回显（销售）
* @param data
* @return {Promise<unknown>}
*/
export function saleAdminPortalAction(data){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'post',
      url: '/pc/serviceAdminPortalAction/ajaxViewTwo.do',
      data: data,
  }).then(function(result) {
      if (String(result.code) === '0') {
          return result.data;
      } else {
          _.alert('提示', result.msg)
      }
  }).finally(()=>{
      dataBase.loading = false
  })
}



/**
* PC端-大区负责人删除（销售）
* @param data
* @return {Promise<unknown>}
*/
export function ajaxDeleteSaleAdmin(data){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'post',
      url: '/pc/serviceAdminPortalAction/ajaxDeleteTwo.do',
      data: data,
      transformRequest: [
        function(data) {
          return Qs.stringify(data, { indices: false });
        }
      ],
  }).then(function(result) {
      if (String(result.code) === '0') {
          return result;
      } else {
          _.alert('提示', result.msg)
      }
  }).finally(()=>{
      dataBase.loading = false
  })
}

/**
 * PC端-根据服务ERP查询人员接口
 * @param data
 * @return {Promise<unknown>}
 */
export function searchUserInfoByServiceErp(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/pc/serviceAdminPortalAction/searchUserInfoByServiceErp.do',
        data: data,
        transformRequest: [
            function(data) {
                return Qs.stringify(data, { arrayFormat: 'repeat' })
            }
        ],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.msg)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}

/**
 * PC端-导入excel
 * @param data
 * @return {Promise<unknown>}
 */
export function batchImportExles(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/fileUploadMgr/fileUploadMgrAction!batchImportExles.action',
        data: data,
        transformRequest: [
            function(data) {
                const formData = new FormData();
                Object.keys(data).forEach((key)=>{
                    formData.append(key, data[key]);
                })
                return formData;
            }
        ],
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.msg)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}

/**
 * PC端-查询处理结果
 * @param data
 * @return {Promise<unknown>}
 */
export function viewImportProcess(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/fileUploadMgr/fileUploadMgrAction!viewImportProcess.action',
        params: params,
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.msg)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}

/**
 * 查询成绩单已读人员列表
 * @param searchValue.id 成绩单id
 * @param searchValue.keyWord 关键字
 * @return {Promise<unknown>}
 */
export function searchSalesreportReadPage(params){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'GET',
      url: '/mgr/salesreport/salesreportMgrAction!searchSalesreportReadPage.action',
      params: params,
  }).then(function(result) {
      if (String(result.code) === '0') {
          return result.data;
      } else {
          _.alert('提示', result.desc)
      }
  }).finally(()=>{
      dataBase.loading = false
  })
}
