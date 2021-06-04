import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config.js'


//检查vip
export function checkFormAuthority(data) {
    return axios({
        url: baseURL + '/form/formDetail/checkFormAuthority.do',
        method: 'POST',
        data: data
    })
}

//select_form 表单关联选择
export function selectFormdata(data) {
	return axios({
		url: baseURL + '/portal/portalForm/formRefSearch.do',
		method: 'POST',
		data: data
	})
}

//表单详情翻页请求接口
export function changePage (data) {
	return axios({
		url:baseURL + '/portal/portalForm/getFormonePager.do',
		method:'POST',
		data:data
	})
}

//修改轨迹
export function getHistory (data) {
	return axios({
		url:baseURL + '/portal/portalForm/queryOrbit.do',
		method:'POST',
		data:data
	})
}

//详情审批人修改保存
export function updateFormByToUser(data) {
	return axios({
		url:baseURL + '/portal/portalForm/updateFormByUser.do',
		method:'POST',
		data:data
	})
}


//CRM客户信息
export function crmInfo(data) {
  return axios({
    url: baseURL + '/portal/clientAction!getClientList.action',
    method: 'POST',
    data: data
  })
}

//数据源请求
export function dataSource(data) {
  return axios({
    url: baseURL + '/open/openFormAction.action',
    method: 'POST',
    data: data
  })
}
//删除表单
export function deleteForm(data) {
  return axios({
    url: baseURL + '/form/formAction!ajaxBatchDeleteOrder.action',
    method: 'POST',
    data: data
  })
}
//获取可干预节点的信息以及对应的负责人
export function getIntercenceNode(data) {
  return axios({
    url: baseURL +'/flow/flowParallel/getInterveneNode.do',
    method: 'POST',
    data: data
  })
}
//获取可干预节点的信息以及对应的负责人
export function finishFlow(data) {
  return axios({
    url: baseURL + '/flow/flowParallel/finishFlowForIntervene.do',
    method: 'POST',
    data: data
  })
}
//获取可干预节点的信息
export function getFlowNodes(data) {
  return axios({
    url: baseURL + '/flow/flowParallel/ajaxGetInterveneNodes.do',
    method: 'POST',
    data: data
  })
}
//保存流程干预的信息
export function saveNodeChange(data) {
  return axios({
    url: baseURL + '/flow/flowParallel/saveInterveneNode.do',
    method: 'POST',
    data: data
  })
}
//流程干预（并行流程/自由流程）获取所有线对应的负责人
export function getParallelFlow(data) {
  return axios({
    url: baseURL + '/flow/flowParallel/getCurrentNodeAndHandlesByParallel.do',
    method: 'POST',
    data: data
  })
}
