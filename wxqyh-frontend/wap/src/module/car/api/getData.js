import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config.js'

//首页单的数量
export function initCount() {
  return axios({
    url: baseURL + '/portal/carask/ajaxCarInfoNum.do',
    method: 'POST',
    async: false
  })
}
//滴滴
export function openDidi() {
  return axios({
    url: baseURL + '/portal/didi/didiConfig/getDidiConfigForOpen.do',
    method: 'POST'
  })
}
//我的行程
export function initTravel(data) {
  return axios({
    url: baseURL + '/portal/carask/myAsk.do',
    method: 'POST',
    data: data
  })
}
//待我处理
export function initTodo(data) {
  return axios({
    url: baseURL + '/portal/carask/myWaitAsk.do',
    method: 'POST',
    data: data
  })
}
//车辆状态
export function initState(data) {
  return axios({
    url: baseURL + '/portal/car/carList.do',
    method: 'POST',
    data: data
  })
}
//相关申请
export function initRelate(data) {
  return axios({
    url: baseURL + '/portal/carask/searchCarAskList.do',
    method: 'POST',
    data: data
  })
}
//单位派车
export function getConfigInfo() {
  return axios({
    url: baseURL + '/portal/carask/configInfo.do',
    method: 'POST',
    async: false
  })
}
export function getCustomField() {
  return axios({
    url: baseURL + '/portal/carask/getCustomField.do',
    method: 'POST',
    async: false
  })
}
//加载上一次的人员
export function getOldGivenList(data){
  return axios({
    url: baseURL + '/portal/defatgroupPortalAction!findTbQyOldGivenVOList.action',
    method: 'POST',
    data: data
  })
}
//获取历史数据
export function getHistoryInfo(data){
  return axios({
    url: baseURL + '/portal/carask/getHistoryInfo.do',
    method: 'POST',
    data: data
  })
}
//获取详情数据
export function getDetail(data){
  return axios({
    url: baseURL + '/portal/carask/getDetail.do',
    method: 'POST',
    data: data
  })
}
//是否有审批过
export function hasAudited(data){
  return axios({
    url: baseURL + '/portal/carask/hasAudited.do',
    method: 'POST',
    data: data
  })
}
//查询评论
export function commentList(data){
  return axios({
    url: baseURL + '/portal/carask/listComment.do',
    method: 'POST',
    data: data
  })
}
//更多评论
export function commentListMore(data, cb) {                                      //加载更多评论
  axios.post(_.baseURL + "/portal/carask/listMoreComment.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
//增加评论
export function addCommentList(data, cb) {                                      //新增评论
  axios.post(_.baseURL + "/portal/carask/commitComment.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
//删除评论
export function deleteCommentList(data, cb) {                                  //删除评论
  _.showLoading("删除中...");
  axios.post(_.baseURL + "/portal/carask/deleteComment.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      _.tooltips_succeed("删除成功");
      cb(result)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
//车管员派车
export function sendCar(data,cb) {
  _.showLoading()
  axios.post(_.baseURL + "/portal/carask/sendCar.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
//车辆是否空闲
export function validCar(data, cb) {                                      //加载更多评论
  axios.post(_.baseURL + "/portal/carask/validCar.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
//车辆详情页
export function carDetail(data, cb) {                                      //加载更多评论
  axios.post(_.baseURL + "/portal/car/carDetail.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
//获取司机列表
export function ajaxGetUserListForDriver(data, cb) {                                      //加载更多评论
  axios.post(_.baseURL + "/portal/carask/ajaxGetUserListForDriver.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
//司机详情
export function driverDetail(data, cb) {                                      //加载更多评论
  axios.post(_.baseURL + "/portal/carask/driverDetail.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
// 延迟用车时间
export async function modifyTime(data) {
  return axios({
    url: baseURL + '/portal/carask/delayBackTime.do',
    method: 'POST',
    data: data
  })
}
//审批操作
export function updateAuditStatus(data, cb) {                                      //加载更多评论
  axios.post(_.baseURL + "/portal/carask/updateAuditStatus.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      _.tooltips_succeed('操作成功')
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
//修改里程
export function updataCarAskMileAndFeel(data, cb) {
  _.showLoading()
  axios.post(_.baseURL + "/portal/carask/updataCarAskMileAndFeel.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      _.tooltips_succeed('修改成功')
      cb(result)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

//结束用车
export function finishCarAsk(data,cb) {
  _.showLoading()
  axios.post(_.baseURL + "/portal/carask/finishCarAsk.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      _.tooltips_succeed('操作成功')
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
//关闭申请单
export function closeCarAskAfterAudited(data,cb) {
  _.showLoading()
  axios.post(_.baseURL + "/portal/carask/closeCarAskAfterAudited.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
//开始用车
export function startUseCar(data, cb) {
  _.showLoading()
  axios.post(_.baseURL + "/portal/carask/startUseCar.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result)
    } else {
      _.alert('提示', result.desc, ()=>{this.router.go(0)})
    }
  })
}
// 加签: type/加签类型，addCountersignPersons/处理人，reason/理由
export function addCountersignType({askId, type, addCountersignPersons, reason}, cb) {
  _.showLoading('正在加签...')
  axios.post(_.baseURL+'/portal/carask/addCountersignType.do',{
    askId, type, addCountersignPersons, reason
  }).then((result)=>{
    _.hideLoading();
    if(result.code==="0"){
      if(type=="1"){_.tooltips_succeed("加会签成功，您可以继续处理表单")}
      if(type=="2"){_.tooltips_succeed("加前签成功，需等待前签人员处理")}
      if(type=="3"){_.tooltips_succeed("加后签成功，当前节点处理后自动流转")}
      setTimeout(cb, 1000)
    }else {
      _.alert("i18n.notice",result.desc);
    }
  })
}
//获取新手引导页面
export function getGuidanceTypes(data){
  return axios({
    url: baseURL + '/portal/carask/getUserNoviceGuidanceTypes.do',
    method: 'GET',
    params : data
  })
}
//提交新手引导页面
export function addGuidanceType(data) {
  axios.post(_.baseURL + "/portal/carask/addUserNoviceGuidanceType.do", {
    ...data
  }).then(function (result) {
    if (result.code !== '0') _.alert('提示', result.desc)
  })
}
// 修改乘车人信息
export function updatePassenger(data,cb) {
  _.showLoading()
  axios.post(_.baseURL + "/portal/carask/updatePassenger.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

