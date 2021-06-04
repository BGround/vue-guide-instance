import {commonPost} from './getData.js'

//快递查询
export function searchExpressPager(params,callback) {
  commonPost('/express/expressAction!ajaxPageSearch.action',params,callback);
}
//快递删除
export function batchDeleteExpressPO(params, callback) {
  commonPost('/express/expressAction!ajaxBatchDel.action',params,callback);
}

//设置——初始化开关状态
export function getExpressUserPower(params, callback) {
  commonPost('/express/expressAction!getExpressUserPower.action',params,callback);
}

//设置——收录人关闭通知单权限
export function updateExpressUserPower(params, callback) {
  commonPost('/express/expressAction!updateExpressUserPower.action',params,callback);
}

//设置——设置快递是否需要上传图片
export function updateExpressPic(params, callback) {
  commonPost('/express/expressAction!updateExpressPic.action',params,callback);
}

//设置——快递记录相互可见
export function updateExpressViewOthers(params, callback) {
  commonPost('/express/expressAction!updateExpressViewOthers.action',params,callback);
}

//设置——获取默认备注提示信息
export function getExpressRemark(params, callback) {
  commonPost('/express/expressAction!getExpressRemark.action',params,callback);
}
//设置——更改默认备注提示信息
export function saveExpressRemark(params, callback) {
  commonPost('/express/expressAction!saveExpressRemark.action',params,callback);
}

//设置——设置收录与查看权限
//①查看是否已经添加过人员
export function viewIntercalate(params, callback) {
  commonPost('/intercalate/intercalateAction!viewIntercalate.action?keywork=expressSet&agent=express'
    ,params
    ,callback);
}
//②未添加过——新增
export function expressAdd(params, callback) {
  commonPost('/intercalate/intercalateAction!ajaxAdd.action',params,callback);
}
//③添加过——更新
export function expressUpdate(params, callback) {
  commonPost('/intercalate/intercalateAction!ajaxUpdate.action',params,callback);
}
