import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config'
//获取打印模版分享id
// 获取表单的模板数据
export function designPrinttemp(definitionVersionsId) {
  return axios({
    url: baseURL + '/form/form/designPrinttemp.do',//'/form/form/designPrinttemp.do',
    method: 'POST',
    async: false,
    data: { definitionVersionsId:definitionVersionsId }
  })
}
export function getPrinttemp(workOrderId,shareId) {
  return axios({
    url: baseURL + '/open/openForm/getPrinttemp.do',//'/form/form/designPrinttemp.do',/form/form/getPrinttemp.do
    method: 'POST',
    async: false,
    data: { workOrderId:workOrderId,shareId:shareId}
  })
}
//form/formAction!searchPrintTemplet.action?
// 保存模板的数据
export function addPrintTemplet( data) {
  return axios({
    url: baseURL + '/form/form/addPrintTemplet.do',//'/form/formAction!addPrintTemplet.action',//'/form/form/addPrintTemplet.do',
    method: 'POST',
    async: false,
    data: data
  })
}
// 设置已打印状态
export function setIsPrinted(workOrderId) {
  return axios({
    url: baseURL + '/form/form/setIsPrinted.do',
    method: 'POST',
    data: {workOrderId: workOrderId, isPrinted: 1}
  })
}
// 判断是否在白名单
export function isWhiteCorpId(data) {
  return axios({
    url: baseURL + '/portal/corpIdWhitePortalCtl/isWhiteCorpId.do',
    method: 'POST',
    dataType: 'json',
    data: data
  })
}

