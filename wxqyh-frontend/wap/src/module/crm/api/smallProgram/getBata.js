import axios from 'axios';

// 获取crm首页营销数据
export function getMarketing(callBack){
  // _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getIndexDynamicsList.do').then((result) => {
    if(result.code=='0'){
      // _.hideLoading('')
      callBack(result.data)
    }else{
      // _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//获取首页会话消息数量
export function getMessageNum(callBack){
  // _.showLoading('')
  axios.post(_.baseURL+'/portal/chat/searMessageTotalNum.do').then(result => {
    if(result.code=='0'){
      // _.hideLoading('')
      callBack(result.data)
    }else{
      // _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//获取我的名片数据
export function getCard(callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/findMarketingCard.do').then((result) => {
    if(result.code=='0'){
      _.hideLoading('')
      callBack(result.data)
    }else{
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

//提交我的名片编辑数据
export function submitCard(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/updateMarketingCard.do',
  {...data}).then((result) => {
    if(result.code=='0'){
      _.hideLoading('')
      _.tooltips_succeed('保存成功')
      callBack(result.data)
    }else{
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 获取群聊列表
export function getChatList(data, callBack) {
  _.showLoading('')
  axios.post(_.baseURL + '/portal/crm/chat/getChatList.do', {...data}).then(result => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示', result.desc)
    }
  })
}

// 查询会话聊天记录
export function searchChatList(data, callBack) {
  axios.post(_.baseURL + '/portal/crm/chat/ajaxSearch.do', {...data}).then(result => {
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示', result.desc)
    }
  })
}

// 获取小程序二维码
export function getSmallProgramQRcode(callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getMiniProgramCode.do').then((result) => {
    _.hideLoading('');
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

// 获取营销动态列表
export function getMarketingDynamicList(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getMoreDynamicsPage.do',{...data}).then((result) => {
      _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

// 查看管理员列表
export function getMangerList(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/managesetting/getUserInfoList.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

//查询会话ID
export function getChatId(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/chat/addChat.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

//获取白名单
export function getWhiteList(callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getSpecifyUserId.do').then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

//获取外部页面分享图
export function getExternalPage(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/open/crm/wxApp/getOpenMarketingCard.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}
//获取常用话术
export function getWordsList(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/chat/searchCommonTextList.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}
//新增话术
export function addWordsList(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/chat/addCommonText.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}
//删除话术
export function delWordsList(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/chat/deleteCommonText.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}
//新增形象标签
export function addTagList(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/addCardLabel.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}
//删除形象标签
export function delTagList(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/deleteCardLabel.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}
//查看标签认可用户列表
export function approvalTagList(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getApprovalUsers.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}
//获取指定年月的营销动态列表
export function appointDynamicList(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getDynamicsCalendarList.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

//获取动态用户信息
export function searchUserInfo(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getWxappUserInfo.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

//获取用户互动列表
export function searchUserDynamic(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getInteraction.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

//获取智能分析图表数据
export function getSmartAnalyse(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/getSmartAnalyse.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

//保存客户信息
export function saveCustomerInfo(data,callBack){
  _.showLoading('')
  axios.post(_.baseURL+'/portal/crm/wxApp/saveWxappUserInfo.do',{...data}).then((result) => {
    _.hideLoading('')
    if(result.code=='0'){
      _.tooltips_succeed('保存成功');
      callBack(result.data)
    }else{
      _.alert('提示',result.desc)
    }
  })
}

// 外部联系人注入agentConfig
export function getAgent(params){
  return axios.post(`${_.baseURL}/portal/weixinjs/weixinjsAction!agentAuthorize.action`,params);
}
