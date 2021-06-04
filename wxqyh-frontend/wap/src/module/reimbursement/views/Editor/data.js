const REIM_DETAIL_DATA = {
  ext1: '',
  projId: '',
  projName: '',
  deptId: '',
  subjectParentsId: '',
  subjId: '',
  control: '',
  cityId: '',
  time: '',
  endTimes: '',
  money: '',
  limitMoney: '',
  limitCycle: '',
  state: '',
  enabled: '',
  versionNumber: '',
  levelId: '',
  surplusMoney: '',
  remark: '',
  invoice: '',
  carId: '',
  askId: '',
  imgList: '',
  reimCustomFieldDataList:[],
  vatSpecialInvoice: '',
  invoiceNumber: '',
  noTaxesMoney: '',
  taxesMoney: '',
  adValorem: '',
}

// 报销销详数据
const detailData = () => {
  return {
    ext1: '',
    projId: '',
    projName: '',
    deptId: '',
    deptName: '',
    subjectParentsId: '',
    subjId: '',
    subjName: '', // 提交不需要
    subjFullName: '', // 提交不需要
    control: '',
    cityId: '',
    time: '',
    endTimes: '',
    money: '',
    limitMoney: '',
    limitCycle: '',
    state: '',
    enabled: '',
    versionNumber: '',
    levelId: '',
    surplusMoney: '',
    remark: '',
    reimCustomFieldDataList:[],
    invoice: '',
    fapiaoInfo: [], // 提交不需要
    carId: '',
    carTitle: '', // 提交不需要，用车标题
    takeTime: '', // 提交不需要，用车时间
    luqiaoFee: '', // 提交不需要，用车费用
    askId: '',
    askType: '', // 提交不需要， 请假类型
    content: '', // 提交不需要，请假详情
    createTime: '', // 提交不需要，请假创建时间
    startTime: '', // 提交不需要，请假开始时间
    sumAskDays: '', // 提交不需要，请假天数
    title: '',  // 提交不需要，请假标题
    endTime: '',  // 提交不需要，请假结束时间
    imgList: '',
    budgetState: '',  // 提交不需要，预算超额状态
    budgetEnabled: '', // 提交不需要, 预算超额是否可提交
    budgetExcess: '', // 提交不需要，超预算金额
    costCenterState: true, // 提交不需要，成本中心超时间是否超过
    costCenterMessage: '',  // 提交不需要，成本中心验证信息
    vatSpecialInvoice: '',
    invoiceNumber: '',
    noTaxesMoney: '',
    taxesMoney: '',
    adValorem: '',
  }
}

// 新建报销数据
const reimData = () => {
  return {
    'tbQyReimbursementPO.typeId':'',   // *报销单据类型id
    'tbQyReimbursementPO.typeName':'', // *报销单据类型名称
    'tbQyReimbursementPO.reimNo':'', // *报销单编号
    'tbQyReimbursementPO.title':'',  //*报销单标题
    'tbQyReimbursementPO.receiptFullName':'',  //*收款单位全称
    'tbQyReimbursementPO.bankAccount':'',  //*银行账号
    'tbQyReimbursementPO.depositBank':'',  //*开户银行
    'tbQyReimbursementPO.globalRemark':'',//全局--备注字段
    'tbQyReimbursementPO.totalMoney':'', //*报销单总金额
    'tbQyReimbursementPO.actualMoney': '',
    'tbQyReimbursementPO.settle': '',   //结算方式
    // 'tbQyReimbursementPO.versionNum': '', // 报销版本号
    // 'tbQyReimbursementPO.reimId': '', // 审批编辑、重新编辑, 草稿编辑参数
    // 'tbQyReimbursementPO.status':'', //*报销单提交状态，0保存为草稿1立马提交
    'tbQyReimbursementPO.attachmentCount': 0,  //*附件数量
    'tbQyReimbursementPO.isFree':'', //*流程类型 1自由 2固定 3分支
    'tbQyReimbursementPO.flowId':'', //*流程id
    'tbQyReimbursementPO.loanId': '',
    'tbQyReimbursementPO.verificationMoney': '',
    'relatives':'', //*相关人userId，多个相关人以,区分
    'incharges':'',  //*审核人userId，多个以,区分
    'flowDpId':'', // *直接负责部门id
    'nextNodeId':'', //*下一节点id
    'currentNodeId':'',  //*当前节点id
    'flowChioseNodeAuditUserJson':'',  //*流程节点选择审批人的用户json字符串
    'fapiaoInfoList': '[]', //*发票集合的json字符串
    'choiseFlowUser':'', //*当后台节点设置允许被上被上一节点指定处理人时传用户选择的处理人userId
    'mediaIds':'', //*附件id数组
    'parallelNextNodeIds':'',  //*下一个并行子节点
    'detailVO':[],
  }
};

const initDetailData = (options = {}, detail = detailData()) => {
  let ret = {};
  for (let k in detail) {
    if (detail.hasOwnProperty(k)) {
      ret[k] = options[k] == undefined ? detail[k] : options[k];
    }
  }
  return ret;
};

// 深拷贝对象
const deepCopy = (source) => {

  if (typeof source == 'object' && source != null) {
    let ret = {};
    for (let k in source) {
      if (source.hasOwnProperty(k)) {
        if (typeof source[k] == 'object' && source[k]!= null) {
          if (Array.isArray(source[k])) {
            ret[k] = source[k].map(v => deepCopy(v));
          } else {
            ret[k] = deepCopy(source[k]);
          }
        } else {
          ret[k] = source[k];
        }
      }
    }
    return ret;
  }

  return source;
};

const initCommitData = (data = {}) => {
  let commitData = deepCopy(data);

  let detailData = data.detailVO.map(detail => initDetailData(detail, REIM_DETAIL_DATA));

  commitData.detailVO = JSON.stringify(detailData);

  return commitData;
}


export {
  initDetailData,
  reimData,
  initCommitData,
};
