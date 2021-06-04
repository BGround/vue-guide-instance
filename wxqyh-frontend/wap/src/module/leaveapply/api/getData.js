import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config.js'

/**
 * 公共删除
 * @param {string} pageName 页面名称
 * @param {string} id askId
 */
export let deleteListItem = (pageName, id) => {
  if (pageName === 'apply') {
    return axios({
      url: `${baseURL}/portal/ask/ajaxBatchDelete.do`,
      method: 'POST',
      data: { "ids": id },
      dataType: 'json'
    })
  } else if (pageName === 'draft') {
    return axios({
      url: `${baseURL}/portal/ask/ajaxBatchDelete.do`,
      method: 'POST',
      data: { "ids": id }
    })
  }
}
/**
 * 获取列表
 * @param {string} pageName 页面名称
 * @param {string} params 请求参数
 */
export let getPageList = (pageName, params) => {
  if (pageName === 'apply' || pageName === 'related') {
    return axios({
      url: baseURL + '/portal/ask/myAsk.do',
      method: 'POST',
      data: params
    })
  } else if (pageName === 'draft') {
    return axios({
      url: `${baseURL}/portal/ask/myAsk.do`,
      method: 'POST',
      data: params
    })
  } else if (pageName === 'related') {

  }
}
/**
 * 删除列表项
 * @param {string} pageName 页面名称
 * @param {objec} that 上下文
 * @param {function} delCallback 删除操作
 */
export let listDelete = async (pageName, that, delCallback) => {
  dataBase.dialogBottomConfig.show = false;
  _.showLoading("正在删除...");
  let params = { ...that.postData, page: that.postData.page + 1 };
  let nextItem = null;
  if (that.postData.page < that.maxPage) {
    let result = await getPageList(pageName, params);
    if(result.code == 0) {
      nextItem = result.data.pageData[0];
      result = await deleteListItem(pageName, that.id);
          _.hideLoading();
      if(result.code != 0) return _.alert("提示", result.desc);
          /** 删除Item操作 */
          delCallback();
          that.list.push(nextItem);
          /** 更新最大页数 */
          that.maxPage = Math.ceil((--that.totalRows) / that.postData.pageSize);
          if (that.postData.page >= that.maxPage) that.busy = true;
          _.tooltips_succeed("删除成功", true);
    }else {
        return _.alert("提示", result.desc);
      }
  } else {
    let result = await deleteListItem(pageName, that.id);
      _.hideLoading();
    if(result.code != '0') return _.alert("提示", result.desc);
      delCallback();
      _.tooltips_succeed("删除成功", true);
  }
}
/**
 * 查询是否需要向导页指引
 */
export function initGuide() {
  return axios({
    url: `${baseURL}/portal/ask/getUserNoviceGuidanceTypes.do`,
    method: 'GET'
  })
}
/**
 * 更新引导状态
 * @param {string} type 
 */
export function changeGuideStatus(type) {
  return axios({
    url: `${baseURL}/portal/ask/addUserNoviceGuidanceType.do`,
    method: 'POST',
    data: {'type': type}
  })
}
/**
 * 获取不同类型模板数量(加班,出差,请假)
 * @return {object} 
 */
export function getTemplateTypeCount () {
  return axios({
    url: `${baseURL}/portal/ask/checkTemplateType.do`,
    method: 'GET'
  })
}

/**
 * 获取列表数量信息
 * @return void
 */
export function initHead() {
  axios({
    url: baseURL + '/portal/ask/ajaxAskInfoNum.do',
    method: 'POST',
  }).then(res => {
    if (res.code != "0") {
      return _.alert("提示", res.desc);
    }
    if (res.data.draftNum || res.data.draftNum > -1) {
      //草稿单
      dataBase.home.nav[3].num = res.data.draftNum;
    }
    if (res.data.waitingTaskNum || res.data.waitingTaskNum > -1) {
      //待办
      dataBase.home.homeFooterList.nav[1].num = res.data.waitingTaskNum;
    }
  });
}
//  新增申请-获取模板
export function getTemplateList(value,callback) {
  _.showLoading('');
  axios.get(`${baseURL}/portal/ask/getAskTemplate.do?type=${value}`)
  .then(function (result) {
    if (result.code === '0') {
      _.hideLoading('');
      callback(result.data.template);
    } else {
      _.hideLoading('');
      _.alert('提示', result.desc);
    }
  })
}
// 根据模板ID获取模板数据
export function getTemplateById(id,callback) {
  _.showLoading('');
  axios.get(`${baseURL}/portal/ask/getAskTemplateById.do?templateId=${id}`)
  .then(function(result){
    if(result.code === '0'){
      _.hideLoading('');
      callback(result.data);
    }else{
      _.hideLoading('');
      _.alert('提示', '未找到关联调休模板信息,请联系管理员!');
    }
  })
}
// 获取配置信息
export function getConfig(callback) {
  axios.get(_.baseURL + '/portal/moveapproveAction!configInfo.action').then(function (result) {
    if (result.code === '0') {
      callback(result.data.config.orgId.replace(/-/g, ''));
    } else {
      _.alert('提示', result.desc);
    }
  })
}

//编辑获取历史信息
export function getFormHistory(askId, callback) {
  _.showLoading();
  axios.get(`${_.baseURL}/portal/ask/getAskHistoryInfo.do?askId=${askId}`).then(function (result) {
    if (result.code === '0'||result.code === '23002') {
      _.hideLoading('');
      callback(result.data);
    } else {
      _.hideLoading('');
      _.alert('提示', result.desc);
    }
  })
}
// 加载上次审批人、相关人
export function getOldccOrTolist(type, callback) {
  _.showLoading();
  axios.post(_.baseURL + '/portal/defatgroupPortalAction!findTbQyOldGivenVOList.action', {
    type: type,
    applyType: 'ask',
    agentCode: 'ask'
  }).then(function (result) {
    if (result.code === '0') {
      _.hideLoading('');
      callback(result.data.ccOrTolist);
    } else {
      _.hideLoading('');
      _.alert('提示', result.desc);
    }
  })
}

// 加载默认相关人
export function getccPersonList(id, callback) {
  _.showLoading();
  axios.post(`${baseURL}/portal/ask/loadCCAndTo.do`, {
    askId: id
  }).then(function (result) {
    if (result.code === '0') {
      _.hideLoading('');
      callback(result.data)
    } else {
      _.hideLoading('');
      _.alert('提示', result.desc);
    }
  })
}
// 获取可用请假时间以及冻结时间
export function getVacationsLimit(data,callback) {
  _.showLoading();
  axios.post(`${baseURL}/portal/ask/getVacationInfo.do`,{
    ...data}).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      callback(result.data)
    } else {
      _.hideLoading('');
      _.alert('提示', result.desc);
    }
  })
}
// 用户托管考勤时的默认规则工作时间
export function getCheckWorkTime(resolve,reject) {
  _.showLoading();
  axios.get(`${baseURL}/portal/checkworkAction!getAskWorkDateInfo.action?type=2`).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      resolve(result.data)
    } else {
      reject()
    }
  })
}
// 用户托管考勤时的起止时间间隔天数的计算
export function getCheckedApplyDays(date, resolve, reject) {
  _.showLoading();
  axios.post(`${baseURL}/portal/checkworkAction!getAskWorkDateInfo.action?type=1`, {
    ...date
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      resolve(result.data)
    } else {
      reject(result.desc)
    }
  })
}
// 用户未托管考勤时的默认规则工作时间
export function getDefaultWorkTime(callback) {
  _.showLoading();
  axios.get(`${baseURL}/portal/managesetting!getWorkhourAndWorkTime.action`).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      callback(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
// 用户非托管考勤时的起止时间内有多少假期的计算
export function getDefaultApplyDays(date, resolve, reject) {
  _.showLoading();
  axios.post(`${baseURL}/portal/ask/getHolidayByTimes.do`, {
    ...date
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      if(result.holiday !== '0'){
        resolve(result.data)
      }
      else{
        reject()
      }
    } else {
      _.alert('提示', result.desc)
    }
  })
}
/**
 * 删除转申意见
 * @param {string} id
 */
export function delApprove(id) {
  return axios({
    url: baseURL + '/portal/workflowAction!delApprove.action',
    method: 'POST',
    data: { "id": id },
    dataType: 'json'
  })
}
export function updateTaskStatus(id, status, data) {
  return axios({
    url: baseURL + '/portal/ask/updateTaskStatus.do?askId=' + id + '&status=' + status,
    method: 'POST',
    data: data,
    dataType: 'json'
  })
}

export function checkHasRevoked(askId) {
  return axios({
    url: baseURL + '/portal/ask/checkHasRevoked.do',
    method: 'POST',
    data: { "askId": askId },
    dataType: "json"
  })
}

/**
 * 获取review列表
 * @param {object} data 请求参数
 * @return Promise
 */
export function getReviewList(data) {
  return axios({
    url: baseURL + '/portal/ask/findMyAskTaskTodo.do',
    method: 'POST',
    data: data
  })
}


// 获取表单详情数据
export function getFormDetail(param, callback) {
  _.showLoading()
  axios.post(_.baseURL + '/portal/ask/getAskDetail.do', {
    ...param
  }).then(function (res) {
    if (res.code === '0') {
      _.hideLoading('')
      callback(res.data)
    } else {
      _.hideLoading('')
      _.alert('提示', res.desc || '获取表单详情数据失败')
    }
  })
}

// 查看评论
export function commentListMore(param, callback) {
  _.showLoading()
  axios.post(_.baseURL + '/portal/ask/listComment.do', {
    ...param
  }).then(function (res) {
    if (res.code === '0') {
      _.hideLoading('')
      callback(res.data)
    } else {
      _.hideLoading('')
      _.alert('提示', res.desc || '获取评论失败')
    }
  })
}

// 发表评论
export function addCommentList(data, callback) {
  axios.post(_.baseURL + "/portal/ask/commitComment.do", {
    ...data
  }).then((res) => {
    _.hideLoading()
    if (res.code === '0') {
      callback(res.data)
    } else {
      _.alert('提示', res.desc || '发表评论失败')
    }
  })
}

// 删除评论
export function deleteCommentList(data, callback) {
  _.showLoading("删除中...")
  axios.post(_.baseURL + "/portal/ask/deleteComment.do", {
    ...data
  }).then((res) => {
    _.hideLoading()
    if (res.code === '0') {
      _.tooltips_succeed("删除成功")
      callback(res)
    } else {
      _.alert('提示', res.desc || '删除失败')
    }
  })
}

export function getRevokeFlowList (data,callback) {
  axios.post(_.baseURL+"/portal/ask/getFixedFlowForRevokedAsk.do",{
    ...data
  }).then((res) => {
    _.hideLoading()
    if(res.code === '0'){
      callback(res.data.flowList)
    }else{
      _alert('提示',res.desc||'获取流程信息失败')
    }
  })
}
