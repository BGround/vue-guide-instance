import axios from 'axios';

function commonPost(url,params,callback,status){
  dataBase.loading=true;
  axios.post(_.baseURL+url,params).then(function (result) {
    dataBase.loading=false;
    if (result.code == '0'){
      if (status){
        callback(result);
      }else {
        callback(result.data);
      }
    }else {
      dataBase.top_alert(result.desc,false,3000);
    }
  });
}

function commonGet(url,params,callback){
  dataBase.loading=true;
  axios.get(_.baseURL+url,params).then(function (result) {
    dataBase.loading=false;
    if (result.code == '0'){
      callback(result.data);
    }else {
      dataBase.top_alert(result.desc,false,3000);
    }
  });
}

/* 工作日志列表页 */

// 获取所有日志类型
export function getDiaryType (cb){
  commonPost('/diary/diaryAction!getDiaryTemplateByDqdp.action',{},cb)
}

// 获取所有工作日志
export function searchDiaryList(params,cb) {
  commonPost('/diary/diaryMgrCtl/ajaxSearchDiary.do',params,cb)
}

// 删除日志
export function delDiary(params,cb) {
  commonPost('/diary/diaryMgrCtl/ajaxBatchDeleteDiary.do',params,cb)
}

// 是否白名单
export function isWhiteName(cb) {
  commonPost('/diary/diaryMgrCtl/isWhiteName.do',{},cb)
}

/* 工作日志设置页 */

// 获取日志设置按钮开关
export function getDiarySetBtn(cb) {
  commonPost('/diary/diaryMgrCtl/getDiarySetting.do',{},cb)
}

// 修改日志设置按钮开关
export function updateDiarySetBtn(params,cb) {
  commonPost('/diary/diaryMgrCtl/updateDiarySetting.do',params,cb)
}

// 获取水印按钮开关
export function getWaterMarkBtn(cb) {
  commonPost('/imgwatermark/imgwatermarkAction!getImgWatermarkSet.action?agentCode=diary',{},cb)
}

// 修改水印按钮开关
export function updateWaterMarkBtn(params,cb) {
  commonPost('/imgwatermark/imgwatermarkAction!updateIsAddWatermark.action',params,cb)
}

// 获取日志统计设置
export function getCountPowerPersons(cb) {
  commonPost('/diary/diaryMgrCtl/getCountPowerPersons.do',{},cb)
}

// 保存日志统计设置
export function saveCountPowerPersons(params,cb) {
  commonPost('/diary/diaryMgrCtl/saveCountPowerPersons.do',params,cb)
}

/* 工作日志统计页 */

// 获取规则列表
export function getRulesList(cb) {
  commonPost('/diary/diaryMgrCtl/ajaxSearchSrules.do',{},cb)
}

// 获取日志记录
export function searchRuleRecord(params,cb) {
  commonPost('/diary/diaryMgrCtl/ajaxSearchSruleRecords.do',params,cb)
}

// 获取规则日志类型
export function searchRuleDiaryType(cb) {
  commonPost('/diary/diaryMgrCtl/ajaxSruleDiaryTypes.do',{},cb)
}

// 获取规则数据
export function viewRuleData(params,cb) {
  commonPost('/diary/diaryMgrCtl/ajaxViewSrule.do',params,cb)
}

// 新增或编辑规则数据
export function addOrEditRule(params,cb) {
  commonPost('/diary/diaryMgrCtl/addOrEditSrule.do',params,cb)
}

// 禁用/启用规则
export function updateRuleStatus(params,cb) {
  commonPost('/diary/diaryMgrCtl/updateSruleState.do',params,cb)
}

// 删除规则
export function deleteRule(params,cb) {
  commonPost('/diary/diaryMgrCtl/delSrule.do',params,cb)
}

// 查看已提交、未提交、请假详情
export function searchRuleDetail(params,cb) {
  commonPost('/diary/diaryMgrCtl/ajaxSearchSruleDetailPersons.do',params,cb)
}

/* 工作日志类型设置页 */

// 查找所有日志类型
export function searchDiaryType(params,cb) {
  commonPost('/diary/diaryMgrCtl/ajaxPageSearch.do',params,cb)
}

// 启用/禁用日志类型
export function updateDiaryStatus(params,cb) {
  commonPost('/diary/diaryMgrCtl/updateTemplateStatus.do',params,cb)
}

// 删除日志类型
export function deleteDiaryType(params,cb) {
  commonPost('/diary/diaryMgrCtl/ajaxBatchDeleteTemplate.do',params,cb)
}

// 查看日志类型
export function viewDiaryType(params,cb) {
  commonPost('/diary/diaryMgrCtl/ajaxViewTemplate.do',params,cb)
}

// 新增日志类型
export function addDiaryType(params,cb) {
  commonPost('/diary/diaryMgrCtl/ajaxAddTemplate.do',params,cb)
}

// 获取高级设置字段
export function getSettingLabel(params,cb) {
  commonGet('/title/labels.do',{params:params},cb)
}

// 保存日志类型
export function updateDiaryType(params,cb) {
  commonPost('/diary/diaryMgrCtl/ajaxUpdateTemplate.do',params,cb)
}
