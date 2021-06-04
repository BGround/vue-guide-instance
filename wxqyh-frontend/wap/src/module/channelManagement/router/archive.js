
//经销商档案
const dealerProfile = r =>
  require.ensure([], () => r(require('@/module/channelManagement/views/dealerProfile')), 'dealerProfile')
// 经销商详情
const dealerDetail = r =>
  require.ensure([], () => r(require('@/module/channelManagement/views/dealerDetail')), 'dealerDetail')


//home
const index = r =>
  require.ensure([], () => r(require('@/module/channelManagement/views/index/index')), 'index')

// 规划开发信息
const development = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/development/index')),
    'index'
  )
// 城市信息
const cityInfo = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/development/cityInfo')),
    'cityInfo'
  )
// // 品牌占有率
// const brandShare = r =>
//   require.ensure(
//     [],
//     () => r(require('@/module/channelManagement/views/index/development/brandShare')),
//     'brandShare'
//   )
// 城市占有率
const cityShare = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/development/cityShare')),
    'cityShare'
  )
// 商圈信息
// const businessDistrict = r =>
//   require.ensure(
//     [],
//     () => r(require('@/module/channelManagement/views/index/development/businessDistrict')),
//     'businessDistrict'
//   )
// // 商圈详情
// const businessDistrictDetail = r =>
//   require.ensure(
//     [],
//     () => r(require('@/module/channelManagement/views/index/development/businessDistrictDetail')),
//     'businessDistrictDetail'
//   )
// 网络规划一网
const oneNetworkPlanning = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/development/oneNetworkPlanning')),
    'oneNetworkPlanning'
  )

  // 网络规划二网
  const twoNetworkPlanning = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/development/twoNetworkPlanning')),
    'twoNetworkPlanning'
  )

  // // 一网规划详情
  // const networkPlanningDetail =  r =>
  // require.ensure(
  //   [],
  //   () => r(require('@/module/channelManagement/views/index/development/networkPlanningDetail')),
  //   'networkPlanningDetail'
  // )

// 入网信息
const networkInfo = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/networkInfo/index')),
    'networkInfo'
  )
// 入网陈述
const description = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/networkInfo/description')),
    'description'
  )

// 主要投资人
const investor = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/networkInfo/investor')),
    'investor'
  )

// 投资人详情
const investorDetail = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/networkInfo/investorDetail')),
  'investorDetail'
)
// 人员信息
const employmentInfo = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/employmentInfo/index')),
  'employmentInfo'
)
const employment = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/employmentInfo/employment')),
  'employment'
)
// 人员信息详情
const employmentDetail = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/employmentInfo/employmentDetail')),
  'employmentDetail'
)
// 变更记录详情
const employmentTransfer = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/employmentInfo/employmentTransfer')),
  'employmentTransfer'
)
// 培训信息
const trainingInfo = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/employmentInfo/trainingInfo')),
  'trainingInfo'
)
// 认证明细
const certificationDetail = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/employmentInfo/certificationDetail')),
  'certificationDetail'
)
// 建设信息
const building = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/building/index')),
  'building'
)


// 建设完成信息
const completionInfo = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/building/completionInfo')),
  'completionInfo'
)

// 建设过程管理
const processManagement = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/building/processManagement')),
  'processManagement'
)

// 建店返利
const buildingRebate = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/building/buildingRebate')),
  'buildingRebate'
)

// 返利详情
const buildingRebateDetail = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/building/buildingRebateDetail')),
  'buildingRebateDetail'
)

// 建店返利
const completionInfoDetail = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/building/completionInfoDetail')),
  'completionInfoDetail'
)

// 一网建设
const firstNetBuilding = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/building/firstNetBuilding')),
    'firstNetBuilding'
  )

// 一网返利
const firstNetRebate = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/building/firstNetRebate')),
    'firstNetRebate'
  )

// 二网建设
const secondNetBuilding = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/building/secondNetBuilding')),
    'secondNetBuilding'
  )

// 二网建设详情
const secondNetBuildingDetail = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/building/secondNetBuildingDetail')),
    'secondNetBuildingDetail'
  )

// 二网返利
const secondNetRebate = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/building/secondNetRebate')),
    'secondNetRebate'
  )

// 二网返利详情
const secondNetRebateDetail = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/building/secondNetRebateDetail')),
    'secondNetRebateDetail'
  )

// 基础档案
const basicFile = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/index')),
  'basicFile'
)
// 股东股本
const basicInfo = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/basicInfo')),
  'basicInfo'
)

// 股东股本
const equity = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/equity')),
  'equity'
)


// 核心人员
const coreStaff = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/coreStaff')),
  'coreStaff'
)

// 人员信息
// const employment = r =>
// require.ensure(
//   [],
//   () => r(require('@/module/channelManagement/views/index/basicFile/employment')),
//   'employment'
// )

// 经验权限
const operatingAuthority = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/operatingAuthority')),
  'operatingAuthority'
)


// 资金余额
const fundBalance = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/fundBalance')),
  'fundBalance'
)

// 资金状况
const fundStatus = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/fundStatus')),
  'fundStatus'
)

// 直营店信息
const storeInfo = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/storeInfo')),
  'storeInfo'
)

// 直营店详情
const storeInfoDetails = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/storeInfoDetails')),
  'storeInfoDetails'
)

// 网销平台
const onlineSalesPlatform = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/onlineSalesPlatform')),
  'onlineSalesPlatform'
)

// 网销平台
const onlineSalesPlatformDetail = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/onlineSalesPlatformDetail')),
  'onlineSalesPlatformDetail'
)
// 培训信息
const trainingInfor = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/trainingInfor')),
  'trainingInfor'
)

// 运营情况
const operation = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/operation/index')),
  'operation'
)

// 盈利情况
const profitStatus = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/operation/profitStatus')),
  'profitStatus'
)

// 销量情况
const salesVolumeStatus = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/operation/salesVolumeStatus')),
  'salesVolumeStatus'
)

// 销售运营
const salesOperation = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/operation/salesOperation')),
  'salesOperation'
)

// 服务运营
const serviceOperation = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/operation/serviceOperation')),
  'serviceOperation'
)

// 服务运营详情
const serviceOperationDetail = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/operation/serviceOperationDetail')),
  'serviceOperationDetail'
)

// 综合运营评估
const evaluation = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/operation/evaluation')),
  'evaluation'
)


// 得分详情
const evaluationDetail = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/operation/evaluationDetail')),
  'evaluationDetail'
)

// 日常奖惩
const rewardsAndPunishments = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/operation/rewardsAndPunishments')),
  'rewardsAndPunishments'
)

// 产品销量
const productSales = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/operation/productSales')),
  'productSales'
)

// 年度表彰
const annualCommendation = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/operation/annualCommendation')),
    'annualCommendation'
  )

// 销量数据
const salesData = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/operation/salesData')),
    'salesData'
  )

// 业绩评估
const performanceEvaluation = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/operation/performanceEvaluation')),
    'performanceEvaluation'
  )

// 运营评估
const operationEvaluation = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/operation/operationEvaluation')),
    'operationEvaluation'
  )

// 奖惩信息
const rewardAndPunishment = r =>
  require.ensure(
    [],
    () => r(require('@/module/channelManagement/views/index/operation/rewardAndPunishment')),
    'rewardAndPunishment'
  )


// 退网

// 年度表彰
const warning = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/warning/index')),
  'warning'
)

// 预警陈述
const warningDesc = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/warning/warningDesc')),
  'warningDesc'
)
const warningInfo = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/warning/warningInfo')),
  'warningInfo'
)

// 预警陈述详情
const warningDescDetail = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/warning/warningDescDetail')),
  'warningDescDetail'
)
const warningDetail = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/warning/warningDetail')),
  'warningDetail'
)

// 退网信息
const exitInfo = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/warning/exitInfo')),
  'exitInfo'
)
const exitNetInfo = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/warning/exitNetInfo')),
  'exitNetInfo'
)

// 风险评估
const riskAssessment = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/warning/riskAssessment')),
  'riskAssessment'
)
//工商信息
const businessInfo = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/businessInfo')),
  'businessInfo'
)

//授权信息
const authorizeInfo = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/authorizeInfo')),
  'authorizeInfo'
)

//资金信息
const fundsInfo = r =>
require.ensure(
  [],
  () => r(require('@/module/channelManagement/views/index/basicFile/fundsInfo')),
  'fundsInfo'
)
export default [
  {
    path: '/dealerProfile',
    name: 'dealerProfile',
    meta: { title: '经销商档案' },
    component: dealerProfile
  },
  {
    path: '/dealerDetail',
    name: 'dealerDetail',
    meta: { title: '详情' },
    component: dealerDetail
  },
  {
    path: '/index',
    name: 'index',
    meta: { title: '首页' },
    component: index,
    redirect: '/index/development/cityInfo',
    children: [
      {
        path: '/index/development',
        name: 'development',
        meta: { title: '规划开发信息' },
        component: development,
        redirect: '/index/development/cityInfo',
        children: [
          {
            path: '/index/development/cityInfo',
            name: 'cityInfo',
            meta: { title: '城市信息' },
            component: cityInfo
          },
          {
            path: '/index/development/cityShare',
            name: 'cityShare',
            meta: { title: '城市占有率' },
            component: cityShare
          },
          {
            path: '/index/development/oneNetworkPlanning',
            name: 'oneNetworkPlanning',
            meta: { title: '一网规划' },
            component: oneNetworkPlanning
          },
          {
            path: '/index/development/twoNetworkPlanning',
            name: 'twoNetworkPlanning',
            meta: { title: '二网规划' },
            component: twoNetworkPlanning
          },

        ]
      },
      {
        path: '/index/networkInfo',
        name: 'networkInfo',
        meta: { title: '入网信息' },
        component: networkInfo,
        redirect: '/index/networkInfo/description',
        children: [
          {
            path: '/index/networkInfo/description',
            name: 'description',
            meta: { title: '入网陈述' },
            component: description
          },
          {
            path: '/index/networkInfo/investor',
            name: 'investor',
            meta: { title: '主要投资人' },
            component: investor
          },
          {
            path: '/index/networkInfo/investorDetail',
            name: 'investorDetail',
            meta: { title: '投资人详情' },
            component: investorDetail
          }
        ]
      },
      {
        path: '/index/employmentInfo',
        name: 'employmentInfo',
        meta: { title: '人员信息管理' },
        component: employmentInfo,
        redirect: '/index/employmentInfo/employment',
        children: [
          {
            path: '/index/employmentInfo/employment',
            name: 'employment',
            meta: { title: '人员信息管理' },
            component: employment
          },
          {
            path: '/index/employmentInfo/employmentDetail',
            name: 'employmentDetail',
            meta: { title: '人员信息管理' },
            component: employmentDetail
          },
          {
            path: '/index/employmentInfo/employmentTransfer',
            name: 'employmentTransfer',
            meta: {title: '人员信息管理'},
            component: employmentTransfer
          },
          {
            path: '/index/employmentInfo/trainingInfo',
            name: 'trainingInfo',
            meta: { title: '培训信息管理' },
            component: trainingInfo
          },
          {
            path: '/index/employmentInfo/certificationDetail',
            name: 'certificationDetail',
            meta: { title: '培训信息管理' },
            component: certificationDetail
          },
        ]
      },
      {
        path: '/index/building',
        name: 'building',
        meta: { title: '建设信息' },
        component: building,
        redirect: '/index/building/firstNetBuilding',
        children: [
          {
            path: '/index/building/completionInfo',
            name: 'completionInfo',
            meta: { title: '完工信息' },
            component: completionInfo
          },
          {
            path: '/index/building/processManagement',
            name: 'processManagement',
            meta: { title: '建设过程管理' },
            component: processManagement
          },
          {
            path: '/index/building/buildingRebate',
            name: 'buildingRebate',
            meta: { title: '建店返利' },
            component: buildingRebate

          },
          {
            path: '/index/building/buildingRebateDetail',
            name: 'buildingRebateDetail',
            meta: { title: '建店返利详情' },
            component: buildingRebateDetail
          },
          {
            path: '/index/building/completionInfoDetail',
            name: 'completionInfoDetail',
            meta: { title: '完工信息' },
            component: completionInfoDetail

          },
          {
            path: '/index/building/firstNetBuilding',
            name: 'firstNetBuilding',
            meta: { title: '一网建设' },
            component: firstNetBuilding
          },
          {
            path: '/index/building/firstNetRebate',
            name: 'firstNetRebate',
            meta: { title: '一网返利' },
            component: firstNetRebate
          },
          {
            path: '/index/building/secondNetBuilding',
            name: 'secondNetBuilding',
            meta: { title: '二网建设' },
            component: secondNetBuilding
          },
          {
            path: '/index/building/secondNetBuildingDetail',
            name: 'secondNetBuildingDetail',
            meta: { title: '二网建设详情' },
            component: secondNetBuildingDetail
          },
          {
            path: '/index/building/secondNetRebate',
            name: 'secondNetRebate',
            meta: { title: '二网返利' },
            component: secondNetRebate
          },
          {
            path: '/index/building/secondNetRebateDetail',
            name: 'secondNetRebateDetail',
            meta: { title: '二网返利详情' },
            component: secondNetRebateDetail
          },
        ]
      },

      {
        path: '/index/basicFile',
        name: 'basicFile',
        meta: { title: '基础档案' },
        component: basicFile,
        redirect: '/index/basicFile/businessInfo',
        children: [
          {
            path: '/index/basicFile/basicInfo',
            name: 'basicInfo',
            meta: { title: '完工信息' },
            component: basicInfo
          },
          {
            path: '/index/basicFile/equity',
            name: 'equity',
            meta: { title: '股东股本' },
            component: equity
          },
          {
            path: '/index/basicFile/employment',
            name: 'employment',
            meta: { title: '人员信息' },
            component: employment
          },
          {
            path: '/index/basicFile/employmentDetail',
            name: 'employmentDetail',
            meta: { title: '人员信息' },
            component: employmentDetail
          },
          {
            path: '/index/basicFile/trainingInfor',
            name: 'trainingInfor',
            meta: { title: '培训信息' },
            component: trainingInfor
          },
          {
            path: '/index/basicFile/coreStaff',
            name: 'coreStaff',
            meta: { title: '核心人员' },
            component: coreStaff
          },
          {
            path: '/index/basicFile/operatingAuthority',
            name: 'operatingAuthority',
            meta: { title: '经营权限' },
            component: operatingAuthority
          },
          {
            path: '/index/basicFile/fundStatus',
            name: 'fundStatus',
            meta: { title: '资金情况' },
            component: fundStatus
          },
          {
            path: '/index/basicFile/fundBalance',
            name: 'fundBalance',
            meta: { title: '资金余额' },
            component: fundBalance
          },
          {
            path: '/index/basicFile/storeInfo',
            name: 'storeInfo',
            meta: { title: '直营店信息' },
            component: storeInfo
          },
          {
            path: '/index/basicFile/storeInfoDetails',
            name: 'storeInfoDetails',
            meta: { title: '直营店详情' },
            component: storeInfoDetails
          },
          {
            path: '/index/basicFile/onlineSalesPlatform',
            name: 'onlineSalesPlatform',
            meta: { title: '网销平台' },
            component: onlineSalesPlatform
          },
          {
            path: '/index/basicFile/onlineSalesPlatformDetail',
            name: 'onlineSalesPlatformDetail',
            meta: { title: '网销平台' },
            component: onlineSalesPlatformDetail
          },
          {
            path: '/index/basicFile/businessInfo',
            name: 'businessInfo',
            meta: { title: '工商信息' },
            component: businessInfo
          },
          {
            path: '/index/basicFile/authorizeInfo',
            name: 'authorizeInfo',
            meta: { title: '授权信息' },
            component: authorizeInfo
          },
          {
            path: '/index/basicFile/fundsInfo',
            name: 'fundsInfo',
            meta: { title: '资金信息' },
            component: fundsInfo
          }
        ]
      },

      {
        path: '/index/operation',
        name: 'operation',
        meta: { title: '基础档案' },
        component: operation,
        redirect: '/index/operation/salesData',
        children: [
          {
            path: '/index/operation/profitStatus',
            name: 'profitStatus',
            meta: { title: '盈利情况' },
            component: profitStatus
          },
          {
            path: '/index/operation/salesVolumeStatus',
            name: 'salesVolumeStatus',
            meta: { title: '销量情况'},
            component: salesVolumeStatus,
          },
          {
            path: '/index/operation/salesOperation',
            name: 'salesOperation',
            meta: { title: '销售运营'},
            component: salesOperation,
          },
          {
            path: '/index/operation/serviceOperation',
            name: 'serviceOperation',
            meta: { title: '服务运营'},
            component: serviceOperation,
          },
          {
            path: '/index/operation/serviceOperationDetail',
            name: 'serviceOperationDetail',
            meta: { title: '服务运营详情'},
            component: serviceOperationDetail,
          },
          {
            path: '/index/operation/evaluation',
            name: 'evaluation',
            meta: { title: '综合运营评估'},
            component: evaluation,
          },
          {
            path: '/index/operation/evaluationDetail',
            name: 'evaluationDetail',
            meta: { title: '得分详情'},
            component: evaluationDetail,
          },
          {
            path: '/index/operation/rewardsAndPunishments',
            name: 'rewardsAndPunishments',
            meta: { title: '日常奖惩'},
            component: rewardsAndPunishments,
          },
          {
            path: '/index/operation/productSales',
            name: 'productSales',
            meta: { title: '产品销量'},
            component: productSales,
          },
          {
            path: '/index/operation/annualCommendation',
            name: 'annualCommendation',
            meta: { title: '年度表彰'},
            component: annualCommendation,
          },
          {
            path: '/index/operation/salesData',
            name: 'salesData',
            meta: { title: '销量数据'},
            component: salesData,
          },
          {
            path: '/index/operation/performanceEvaluation',
            name: 'performanceEvaluation',
            meta: { title: '业绩评估'},
            component: performanceEvaluation,
          },
          {
            path: '/index/operation/operationEvaluation',
            name: 'operationEvaluation',
            meta: { title: '运营评估'},
            component: operationEvaluation,
          },
          {
            path: '/index/operation/rewardAndPunishment',
            name: 'rewardAndPunishment',
            meta: { title: '奖惩信息'},
            component: rewardAndPunishment,
          },
        ]
      },

      {
        path: '/index/warning',
        name: 'warning',
        meta: { title: '退网信息' },
        component: warning,
        // redirect: '/index/warning/warningDesc',
        redirect: '/index/warning/warningInfo',
        children: [
          {
            path: '/index/warning/warningDesc',
            name: 'warningDesc',
            meta: { title: '预警陈述' },
            component: warningDesc
          },
          {
            path: '/index/warning/warningInfo',
            name: 'warningInfo',
            meta: { title: '预警陈述' },
            component: warningInfo
          },
          {
            path: '/index/warning/warningDescDetail',
            name: 'warningDescDetail',
            meta: { title: '预警陈述详情' },
            component: warningDescDetail
          },
          {
            path: '/index/warning/warningDetail',
            name: 'warningDetail',
            meta: { title: '预警陈述详情' },
            component: warningDetail
          },
          {
            path: '/index/warning/exitInfo',
            name: 'exitInfo',
            meta: { title: '退网信息' },
            component: exitInfo
          },
          {
            path: '/index/warning/exitNetInfo',
            name: 'exitNetInfo',
            meta: { title: '退网信息' },
            component: exitNetInfo
          },
          {
            path: '/index/warning/riskAssessment',
            name: 'riskAssessment',
            meta: { title: '风险评估' },
            component: riskAssessment
          },
        ]
      },
    ]
  }
]
