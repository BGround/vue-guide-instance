import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config.js'
async function asyncAxios(config) {
    const res = await axios(config);
    if(res.code == "0") {
        return res.data
    } else {
        _.alert('提示', res.desc);
        throw new Error(res);
    }
}

/**
 * 判断是否是管理员
 */
export function isAdministrator() {
  return axios({
    url: `${baseURL}/portal/managesetting!ajaxIsManager.action`,
    method: 'POST'
  })
}
/**
 * 查询反馈列表
 */
export function feedbackList() {
  return axios({
    url: `${baseURL}/portal/portalForm/getOpenFormForDo1FeedBack.do`,
    method: 'POST'
  })
}
/**
 * 白名单判断
 * @param {object} data
 */
export function whitePortCtl(data) {
  return axios({
    url: `${baseURL}/portal/corpIdWhitePortalCtl/isWhiteCorpId.do`,
    method: 'POST',
    data: data
  });
}
// 表单个项的数量
export function initHead(data) {
    return axios({
        url: baseURL + '/portal/portalForm/getFormDiyInfo.do',
        method: 'POST',
        data: data,
        async: false
    })
}

// 外部单--外部单提醒
export async function initOpen(data) {
    return await asyncAxios({
        url: baseURL + '/portal/portalForm/getMyOutFromList.do',
        method: 'POST',
        data: data
    })
}

// 外部单--我相关的
export function outerRelevant(data) {
    return axios({
        url: baseURL + '/portal/portalForm/getMyRelevantOurFromList.do',
        method: 'POST',
        data: data
    })
}

// 我相关的 / 我提交的 / 草稿
export function initRelevant(data) {
    return axios({
        url: baseURL + '/portal/portalForm/getWordOrderList.do',
        method: 'POST',
        data: data
    })
}

// 我相关的--高级搜索
export function relevantSearch(data) {
    return axios({
        url: baseURL + '/portal/portalForm/findMyRelevantWordOrderList.do',
        method: 'POST',
        data: data
    })
}

// 待办
export function initTodo(data) {
    return axios({
        url: baseURL + '/portal/portalForm/auditFormList.do',
        method: 'POST',
        data: data
    })
}

// 待办--高级搜索
export function todoSearch(data) {
    return axios({
        url: baseURL + '/portal/portalForm/findMyAuditFormList.do',
        method: 'POST',
        data: data
    })
}

// 我提交的--高级搜索
export function submitSearch(data) {
    return axios({
        url: baseURL + '/portal/portalForm/findMySubmitWordOrderList.do',
        method: 'POST',
        data: data
    })
}

// 我提交的--批量检查是否可以删除
export function submitCheck(ids) {
    return axios({
        url: baseURL + '/portal/portalForm/ajaxBatchCheck.do',
        method: 'POST',
        data: { "ids": ids },
        dataType: 'json'
    })
}

// 我提交的--批量删除
export function submitDel(ids) {
    return axios({
        url: baseURL + '/portal/portalForm/ajaxBatchDelete.do',
        method: 'POST',
        data: { 'ids': ids },
        dataType: 'json'
    })
}

// 明细数据--其他表单
export async function wordOrderMxList(data) {
    return await asyncAxios({
        url: baseURL + '/portal/portalForm/getWordOrderMxList.do',
        method: 'POST',
        data: data
    })
}

// 明细数据--外部单
export async function outerMxList(data) {
    return await asyncAxios({
        url: baseURL + '/portal/portalForm/getMyOutFromMxList.do',
        method: 'POST',
        data: data
    })
}

// 获取最近使用的表单显示个数
export function getRecentlySize() {
    return axios({
        url: baseURL + '/portal/portalForm/getQueryRecentlySize.do',
        method: 'POST'
    })
}
/** 用于首页获取前四个最近使用表单 */
export function getRecentlyForm() {
  return axios({
    url: baseURL + '/portal/portalForm/queryRecentlyTop4.do'
  })
}
// 保存最近使用的表单显示个数设置
export function setRecentlySize(data) {
    return axios({
        url: baseURL + '/portal/portalForm/setQueryRecentlySize.do',
        method: 'POST',
        data: {size: data}
    })
}


// 获取最近使用的表单
export function initRecently(data) {
    return axios({
        url: baseURL + '/portal/portalForm/queryRecently.do',
        method: 'POST',
        data: data
    })
}

// 获取分组
export function initGroup(data) {
    return axios({
        url: baseURL + '/portal/portalForm/ajaxSearchFormtype.do',
        method: 'POST',
        data: data
    })
}
/** 查询分组和表单 */
export function searchFormAndGroup(str) {
  return axios({
    url: baseURL + '/portal/portalForm/searchTypeAndForm.do',
    method: 'POST',
    data: {keyWord: str}
  })
}
// 获取表单
export function initForm(data) {
    return axios({
        url: baseURL + '/portal/portalForm/findFormList.do',
        method: 'POST',
        data: data
    })
}
// 获取分组表单
export function initGroupForm(id) {
  return axios({
      url: baseURL + '/portal/portalForm/getFormGroupInfo.do',
      method: 'POST',
      data: {'typeId': id}
  })
}
/**首页头部常用 每次返回4个*/
export function getHeaderCollection() {
  return axios({
    url: baseURL + '/portal/portalForm/getHomePageCollection.do',
    method: 'GET'
  })
}

// 收藏或取消收藏表单
export function collectForm(id) {
    return axios({
        url: baseURL + '/portal/portalForm/formCollection.do',
        method: 'POST',
        data: { id: id }
    })
}

// 查看某个表单是否已经收藏
export function isCollect(id) {
    return axios({
        url: baseURL + '/portal/portalForm/getFormCollectionInfo.do',
        method: 'POST',
        data: { id: id }
    })
}

//收藏或填单的明细数据
export function mxListDetailData(data) {
    return axios({
        url: baseURL + '/portal/portalForm/getWordOrderMxList.do',
        method: 'POST',
        data: data
    })
}

//收藏
export function collection(data) {
	return axios({
		url: baseURL + '/portal/portalForm/getMyCollectionFromList.do',
		method: 'POST',
		data: data
	})
}
/** 保存排序 */
export function saveCollectionSort(definitionArr) {
  return axios({
    url: baseURL + '/portal/portalForm/saveMyFormOrder.do',
    method: 'POST',
    data: definitionArr
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
//外部单发送邮件
export function sendEmail (data) {
	return axios({
		url:baseURL + '/open/openForm/sendEmail.do',
		method:'POST',
		data:data
	})
}

//详情审批人修改保存
export function updateFormByToUser(data) {
	return axios({
		url:baseURL + '/portal/portalForm/updateFormByToUser.do',
		method:'POST',
		data:data
	})
}

// 是否存在相同条件的下载
export function isExistRunTask(data) {
    return axios({
        url: baseURL + '/portal/portalForm/isExistRunTask.do',
        method: 'POST',
        dataType: 'json',
        data: data
    })
}

// 下载明细数据
export function downloadMx(data) {
    return axios({
        url: baseURL + '/portal/portalForm/downloadOrdersMx.do',
        method: 'POST',
        data: data,
        dataTyep: 'json'
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

// 统计报表统计
export async function getDataReport(data) {
    _.showLoading();
    const res = await axios({
        url: baseURL + '/portal/portalForm/searchAnalysis.do',
        method: 'POST',
        data: data
    });
    _.hideLoading();
    if(res.code == "0") {
        return res.data
    } else {
        _.alert('提示', res.desc);
        throw Error;
    }
}

// 统计报表埋点
export async function reportVisitLog(data) {
    const res = await axios({
        url: baseURL + '/portal/portalForm/insertVisitLog.do',
        method: 'POST',
        data: data
    });
    if(res.code == "0") {
        return res.data
    } else {
        _.alert('提示', res.desc);
        throw Error;
    }
}
// 获取表单分组
export const findSubFormTypes = (data) =>{
  return axios.post(baseURL+'/portal/portalType/findSubFormTypes.do',{
    requestSource:2,
    status:1,
    ...data
  })
}
// 创建或复制表单设计
export const formAjaxAdd = (data) =>{
  return axios.post(baseURL+'/form/form/ajaxAdd.do',{
    ...data
  })
}
// 判断用户是否有操作权限。创建表单：formAdd
export const wxqyhConfigNew = (outputPermissions) =>{
  return axios.post(baseURL+'/vip/vipMgrCtl/wxqyhConfigNew.do',{
    outputPermissions
  })
}

// 获取委托人规则
export function entrustRule(data) {
  return axios({
    url: baseURL + '/portal/flow/flowEntrust/findMyEntrustRule.do',
    method: 'POST',
    data:data
  })
}

// 获取委托人记录
export function entrustRecord(data) {
  return axios({
    url: baseURL + '/portal/flow/flowEntrust/findMyEntrustRecord.do',
    method: 'POST',
    data:data
  })
}

// 委托规则状态更改
export async function entrustRuleStatus(data) {
  _.showLoading();
  const res = await axios({
    url: baseURL + '/portal/flow/flowEntrust/ajaxUpdateERStatus.do',
    method: 'POST',
    data: data
  });
  _.hideLoading();
  if(res.code == "0") {
    return res.data
  } else {
    _.alert('提示', res.desc);
    throw Error;
  }
}

//删除委托规则
export async function delEntrustRule(data) {
  _.showLoading();
  const res = await axios({
    url: baseURL + '/portal/flow/flowEntrust/ajaxDeleteEntrustRule.do',
    method: 'POST',
    data: data
  });
  _.hideLoading();
  if(res.code == "0") {
    return res.data
  } else {
    _.alert('提示', res.desc);
    throw Error;
  }
}
// 表单信息
export async function getFormInfo(versionId) {
    const res = await axios({
        url: baseURL + '/portal/portalForm/getFormOverView.do',
        method: 'POST',
        data: { versionId: versionId }
    });
    if(res.code == "0") {
        return res.data
    } else {
        _.alert('提示', res.desc);
        throw Error;
    }
}
/** 向导页查询 */
export function getGuideInfo() {
  return axios({
    url: baseURL + '/portal/portalForm/getIsShowHomePageTip.do',
    method: 'GET'
  })
}
/** 向导页设置 */
export function setGuideInfo(value) {
  return axios({
    url: baseURL + '/portal/portalForm/setIsShowHomePageTip.do',
    method: 'POST',
    data: {"value": value}
  })
}

// 获取应用工单数
export async function getFormType(data) {
  return await asyncAxios({
    url: baseURL + '/portal/portalForm/getOrderNumGroupByType.do',
    method: 'POST',
    data: data
  })
}

// 获取表单模板工单数
export async function getFormTemplate(data) {
  return await asyncAxios({
    url: baseURL + '/portal/portalForm/getOrderNumGroupByForm.do',
    method: 'POST',
    data: data
  })
}
// 添加视图
export async function addFormView(data) {
    return await asyncAxios({
        url: baseURL + '/portal/portalForm/addFormView.do',
        method: 'POST',
        data: data
    })
}

// 删除视图
export async function deleteFormView(data) {
    return await asyncAxios({
        url: baseURL + '/portal/portalForm/deleteFormView.do',
        method: 'POST',
        data: data
    })
}

// 更新视图
export async function updateFormView(data) {
    return await asyncAxios({
        url: baseURL + '/portal/portalForm/updateFormView.do',
        method: 'POST',
        data: data
    })
}

// 查找视图
export async function findFormViews(data) {
    return await asyncAxios({
        url: baseURL + '/portal/portalForm/findFormViews.do',
        method: 'POST',
        data: data
    })
}

export async function getFlowBoardList(data) {
    return await asyncAxios({
        url: baseURL + '/portal/portalForm/getFlowBoardList.do',
        method: 'POST',
        data: data
    })
}

export async function showFlowBoard(data) {
    return await asyncAxios({
        url: baseURL + '/portal/portalForm/showFlowBoard.do',
        method: 'POST',
        data: data
    })
}

export async function saveNodeStatus(data) {
    return await asyncAxios({
        url: baseURL + '/portal/portalForm/saveNodeStatus.do',
        method: 'POST',
        data: data
    })
}

export async function initListByType(data) {
    return await asyncAxios({
        url: baseURL + '/portal/portalForm/getWorkOrderListByType.do',
        method: 'POST',
        data: data
    })
}
