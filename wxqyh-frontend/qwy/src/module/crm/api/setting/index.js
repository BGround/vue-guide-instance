import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config';


/**
 * 获取图片是否加水印信息
 * @param {String} agentCode
 */
export function getImgWatermarkSet(agentCode = 'crm') {
  return axios({
    url: `${baseURL}/imgwatermark/imgwatermarkAction!getImgWatermarkSet.action`,
    method: 'POST',
    data: {
      agentCode
    },
  });
}

/**
 * 获取用户多负责人设置
 * @param {String} agentCode
 */
export function getClientCharge(agentCode = 'client') {
  return getPhotoSetting("client");
}

/**
 * 获取用户是否设置了 允许删除已审批合同
 */
export function getDeleteContract() {
  return axios({
    url: `${baseURL}/contract/getDelContractSetting.do`,
    method: 'get',

  });
}

/**
 * 获取竞争对手负责人多选设置
 */
export function getCompetitorCharge() {
  return axios({
    url: `${baseURL}/crm/competitor/getIfMultipleInCharge.do`,
    method: 'get',
  });
}


/**
 * 更新竞争对手负责人是否多选设置
 * @param {Number|String} multiple 0是关闭，1是打开
 */
export function updateCompetitorCharge(multiple) {
  return axios({
    url: `${baseURL}/crm/competitor/updateIfMultipleInCharge.do`,
    method: 'post',
    data: {
      multiple
    }
  });
}
/**
 * 修改是否给图片加水印
 * @param {String} isAddWatermark 1 || 0  ( 启用 || 关闭 )
 * @param {String} agentCode
 */
export function updateIsAddWatermark(isAddWatermark, agentCode = 'crm') {
  return axios({
    url: `${baseURL}/imgwatermark/imgwatermarkAction!updateIsAddWatermark.action`,
    method: 'post',
    data: {
      agentCode,
      isAddWatermark
    }
  });
}

/**
 *  修改是否多个负责人
 * @param {String} isPhotograph 1 || 0  ( 启用 || 关闭 )
 * @param {*} agentCode
 */
export function updateClientCharge(isPhotograph, agentCode = 'client') {
  return axios({
    url: `${baseURL}/intercalate/intercalateAction!savePhotoSetting.action`,
    method: 'post',
    data: {
      agentCode,
      isPhotograph
    }
  });
}
/**
 * 允许删除已审批合同
 * @param {String} isPhotograph 1 || 0  ( 启用 || 关闭 )
 * @param {String} agentCode delContractSetting
 */
export function updateDeleteContract(isPhotograph, agentCode = 'delContractSetting') {
  return axios({
    url: `${baseURL}/contract/saveDelContractSetting.do`,
    method: 'post',
    data: {
      "jsonData": JSON.stringify({
        agentCode,
        isPhotograph
      })
    }
  });
}

/**
 * 更新提醒设置
 * @param {String} isClientRecycleReminder 客户回收提醒,1 || 0  ( 启用 || 关闭 )
 * @param {String} isSalesBriefing  销售简报，1 || 0  ( 启用 || 关闭 )
 * @param {String} isContractExpirationReminder 合同到期提醒 1 || 0  ( 启用 || 关闭 )
 */
export function updateReminderSettings(data) {
  return axios({
    url: `${baseURL}/crm/otherSetting/updateReminderSettings.do`,
    method: 'post',
    data
  });

}
/**
 * 获取提醒设置
 */
export function getReminderSettings() {
  return axios({
    url: `${baseURL}/clientPool/listReminderSettings.do`,
    method: 'get',
  });
}

/**
 * 获取提醒设置 合同提醒人
 */
export function getReminderContract() {
  return getPhotoSetting("contract_tx_object");
}
/**
 *  保存提醒设置 合同提醒人
 * @param {String} isPhotograph 1|1|1 负责人，相关人，创建人
 */
export function saveReminderContract(isPhotograph) {
  return updatePhotoSetting(isPhotograph, "contract_tx_object");
}

// 自定义菜单
/**
 * 获取自定义菜单 保存草稿
 */
export function getCustomMenus(agentCode = "crm") {
  return axios({
    url: `${baseURL}/custommenus/custommenusAction!ajaxGetMenus.action`,
    method: 'post',
    data: {
      agentCode
    }
  });

}
/**
 * 获取自定义菜单 发布
 */
export function getDefaultCustomMenus(agentCode = "crm") {
  return axios({
    url: `${baseURL}/custommenus/custommenusAction!ajaxGetDefaultMenus.action`,
    method: 'post',
    data: {
      agentCode
    }
  });

}
/**
 * 保存自定义菜单
 * @param {Array} list 自定义菜单列表
 * @param {String} agentCode crm
 */
export function saveCustomMenu(list, agentCode = "crm") {
  return axios({
    url: `${baseURL}/custommenus/custommenusAction!saveMenu.action`,
    method: 'post',
    data: {
      agentCode,
      strJson: JSON.stringify({
        data: {
          list
        }
      })
    }
  });

}
/**
 * 发布自定义菜单
 */
export function publishCustomMenu(list, agentCode = "crm") {
  return axios({
    url: `${baseURL}/custommenus/custommenusAction!publishMenu.action`,
    method: 'post',
    data: {
      agentCode,
      strJson: JSON.stringify({
        data: {
          list
        }
      })
    }
  });
}

// 拜访设置
/**
 * 获取是否允许修改拜访地址
 */
export function getVisitAddres() {
  return axios({
    url: `${baseURL}/crm/manageObjectSetUp/getVisitSetting.do`,
    method: 'get',
  });
}
/**
 * 获取是否允许选择图片
 * @param {*} agentCode crm
 */
export function getPhotoSetting(agentCode = 'crm') {
  return axios({
    url: `${baseURL}/intercalate/intercalateAction!getPhotoSetting.action`,
    method: 'POST',
    data: {
      agentCode
    }
  });
}
/**
 * 更新允许拍照上传图片设置
 * @param {String} isPhotograph 是否允许 1 || 0  ( 启用 || 关闭 )
 * @param {String} agentCode crm
 */
export function updatePhotoSetting(isPhotograph, agentCode = 'crm') {
  return axios({
    url: `${baseURL}/intercalate/intercalateAction!savePhotoSetting.action`,
    method: 'POST',
    data: {
      agentCode,
      isPhotograph
    }
  });
}
/**
 * 更新拜访设置
 * @param {String} status 是否开启 1 || 0  ( 启用 || 关闭 )
 */
export function updateVisitAddres(status) {
  return axios({
    url: `${baseURL}/crm/manageObjectSetUp/updateVisitSetting.do`,
    method: 'POST',
    data: {
      status
    }
  });
}
//公海规则设置
/**
 * 获取公海池规则
 */
export function getPoolRule() {
  return axios({
    url: `${baseURL}/crm/manageObjectSetUp/getPoolRule.do`,
    method: 'get',
  });
}
/**
 * 保存公海池规则
 */
export function savePoolRule(data) {
  return axios({
    url: `${baseURL}/crm/manageObjectSetUp/savePoolRule.do`,
    method: 'post',
    data
  });
}
//获取客户自定义列表
export function getClientCustom() {
  return axios({
    url: `${baseURL}/crm/customFieldSetting/getClientCustomItem.do`,
    method: 'post',
  })
}
//保存客户自定义字段
export function saveClientCustom(obj) {
  return axios({
    url: `${baseURL}/crm/customFieldSetting/saveClientCustomItem.do`,
    method: 'post',
    data: obj
  })
}
//获取联系人自定义列表
export function getContactCustom() {
  return axios({
    url: `${baseURL}/crm/customFieldSetting/getContactsItem.do`,
    method: 'post'
  })
}
//保存联系人自定义列表
export function saveContactCustom(obj) {
  return axios({
    url: `${baseURL}/crm/customFieldSetting/saveContactsItem.do`,
    method: 'post',
    data: obj
  })
}
//获取商机自定义列表
export function getBusinessCustom() {
  return axios({
    url: `${baseURL}/crm/customFieldSetting/getBusinessItem.do`,
    method: 'post',
  })
}
//保存商机自定义列表
export function saveBusinessCustom(obj) {
  return axios({
    url: `${baseURL}/crm/customFieldSetting/saveBusinessItem.do`,
    method: 'post',
    data: obj
  })
}
//获取拜访自定义列表
export function getVisitCustom() {
  return axios({
    url: `${baseURL}/crm/customFieldSetting/getOutsideItem.do`,
    method: 'post',
  })
}
//保存拜访自定义列表
export function saveVisitCustom(obj) {
  return axios({
    url: `${baseURL}/crm/customFieldSetting/saveOutsideItem.do`,
    method: 'post',
    data: obj
  })
}
//获取合同自定义字段
export function getContractCustom() {
  return axios({
    url: `${baseURL}/crm/customFieldSetting/getContractItem.do`,
    method: 'post',
  })
}
//保存合同自定义字段
export function saveContractCustom(obj) {
  return axios({
    url: `${baseURL}/crm/customFieldSetting/saveContractItem.do`,
    method: 'post',
    data: obj
  })
}
//获取查重规则列表
export function getReapeatRuleList() {
  return axios({
    url: `${baseURL}/crm/manageObjectSetUp/getRepeatSetting.do`,
    method: 'get',
  })
}
//保存查重规则列表
export function saveReapeatRule(obj) {
  return axios({
    url: `${baseURL}/crm/manageObjectSetUp/saveRepeatSetting.do`,
    method: 'post',
    data: obj
  })
}
/**
 * 通过负责人获取客户
 * @param {Object} data
 */
export function seachClient(data) {
  return axios({
    url: `${baseURL}/client/clientAction!ajaxSeachClient.action`,
    method: 'post',
    data
  })
}
/**
 * 客户负责人转派
 * @param {Object} data
 */
export function updateClientUser(data) {
  return axios({
    // url: `${baseURL}/client/clientAction!updateClientUser.action`,
    url: `${baseURL}/crm/otherSetting/updateClientUser.do`,
    method: 'post',
    data
  })
}

// 获取用户等级设置
export const getClientGrade = () => {
  return axios({
    url: `${baseURL}/client/getClientGrade.do`,
    method: 'GET',
    dataType: 'json'
  });
}

// 保存用户设置
export const saveClientGrade = (data) => {
  return axios({
    url: `${baseURL}/client/saveClientGrade.do`,
    method: 'POST',
    dataType: 'json',
    data: data
  });
}

// 获取数值+下拉框类型自定义字段
export const getCustomFieldSpecial = (data) => {
  return axios({
    url: `${baseURL}/client/getCustomFieldSpecial.do`,
    method: 'POST',
    dataType: 'json',
    data: data
  });
}

// 验证计算公式
export const validArithmeticExpression = (data) => {
  return axios({
    url: `${baseURL}/client/validArithmeticExpression.do`,
    method: 'POST',
    dataType: 'json',
    data: data
  });
}

// 校验 指标表单 是否填写正确
export const validClientGradeIndexData = (data) => {
  return axios({
    url: `${baseURL}/client/validClientGradeIndexData.do`,
    method: 'POST',
    dataType: 'json',
    data: data
  });
}
/**
 * 客户智能分级(0|1) 关闭|开启
 */
export function getClientGradeStatus() {
  return getPhotoSetting("crm_client_grade");
}

/**
 * 更新客户智能分级(0|1) 关闭|开启
 */
export function updateClientGradeStatus(is_photograph) {
  return axios({
    url: `${baseURL}/client/saveClientGradeSetting.do`,
    method: 'POST',
    dataType: 'json',
    data: {
      is_photograph
    }
  });
}


// 获取团队数据
export function getTeamList() {
  return axios.get(`${_.baseURL}/crm/manageObjectSetUp/getTeamList.do`);
}

// 删除团队数据
export function delTeamItem(params) {
  return axios.post(`${_.baseURL}/crm/manageObjectSetUp/deleteTeam.do`, params);
}

// 新增团队数据
export function addTeamItem(params) {
  return axios.post(`${_.baseURL}/crm/manageObjectSetUp/ajaxAddOrUpdateTeam.do`, params);
}

// 查看团队数据
export function searchTeamItem(params) {
  return axios.get(`${_.baseURL}/crm/manageObjectSetUp/ajaxSearchTeam.do`, {params});
}

// 查看团队详情
export function getTeamDetail(params) {
  return axios.get(`${_.baseURL}/crm/manageObjectSetUp/getTeamDetail.do`, {params});
}

// 保存或更新团队成员和查阅人员信息
export function saveDetail(params) {
  return axios.post(`${_.baseURL}/crm/manageObjectSetUp/ajaxAddOrUpdateTeamDetail.do`, params);
}

// 查看发票详情
export function findTaxType(params) {
  return axios.get(`${_.baseURL}/crm/manageObjectSetUp/findTaxType.do`, {params});
}

// 新增发票类型
export function saveTaxType(params) {
  return axios.post(`${_.baseURL}/crm/manageObjectSetUp/saveTaxType.do`, params);
}

// 删除发票类型
export function delTaxType(params) {
  return axios.post(`${_.baseURL}/crm/manageObjectSetUp/deleteTaxType.do`, params);
}
// 获取可 添加公海负责人 列表
export function getUserListForCrmPool(params) {
  return axios.post(`${_.baseURL}/managesetting/managesettingAction!getUserListForCrmPool.action`, params);
}

// 合同类型列表
export function getTypeList(params){
  return axios.get(`${_.baseURL}/crm/manageObjectSetUp/getContractTypeList.do`,{params});
}

// 合同类型列表
export function getContractTypeDetail(params){
  return axios.post(`${_.baseURL}/contract/contractAction!getContractTypeDetail.action`,params);
}

// 保存合同类型
export function saveContractType(params){
  return axios.post(`${_.baseURL}/crm/manageObjectSetUp/saveContractType.do`,params);
}

// 删除合同类型
export function deleteType(params){
  return axios.post(`${_.baseURL}/crm/manageObjectSetUp/deleteContractType.do`,params);
}

// 固定流程列表
export function getFlowGroup(params){
  return axios.post(`${_.baseURL}/flow/flowGroupAction!ajaxGetAllFlowGroup.action`,params);
}

// 固定流程详情
export function flowPageSearch(params){
  return axios.post(`${_.baseURL}/flow/flowAction!ajaxPageSearch.action`,params);
}

// 公海列表
export function getPoolList(params){
  return axios.get(`${_.baseURL}/crm/manageObjectSetUp/getPoolList.do`,{params});
}

// 后台设置页面查询公海详情
export function getPoolDetail(params){
  return axios.get(`${_.baseURL}/crm/manageObjectSetUp/getPoolConfigDetail.do`,{params});
}

// 保存公海详情
export function savePoolConfig(params){
  return axios.post(`${_.baseURL}/crm/manageObjectSetUp/savePoolConfig.do`,params);
}

// 删除公海
export function delPoolItem(params){
  return axios.post(`${_.baseURL}/crm/manageObjectSetUp/deletePool.do`,params);
}

// 查询客户类别
export function searchClientTypeList(params){
  return axios.get(`${_.baseURL}/crm/manageObjectSetUp/searchClientTypeList.do`,{params});
}

// 查询客户类别
export function getTypeDetail(params){
  return axios.get(`${_.baseURL}/crm/manageObjectSetUp/getTypeDetail.do`,{params});
}

// 编辑客户类别
export function editClientType(params){
  return axios.post(`${_.baseURL}/crm/manageObjectSetUp/editClientType.do`,params);
}

// 删除客户类别
export function delClientType(params){
  return axios.post(`${_.baseURL}/crm/manageObjectSetUp/delClientType.do`,params);
}
