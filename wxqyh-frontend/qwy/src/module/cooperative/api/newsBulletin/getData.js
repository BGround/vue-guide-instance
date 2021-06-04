import axios from 'axios';

export function commonPost(url,params,callback){
  dataBase.loading=true;
  axios.post(_.baseURL+url,params).then(function (result) {
    dataBase.loading=false;
    if (result.code == '0'){
      callback(result.data);
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

export function getDynamicType(params,callback){
  commonGet('/dynamicinfomanageback/dynamicinfomanagebackAction!getDynamicType.action',{
    params:params
  },callback);
}

export function searchDynamicPager(params,callback) {
  commonPost('/dynamicMgr/dynamicMgrCtl/searchDynamicPager.do',params,callback);
}

export function updateTop(params,callback) {
  commonGet('/dynamicinfomanageback/dynamicinfomanagebackAction!updateTop.action',{
    params:params
  },callback);
}

export function updateEnable(params,callback) {
  commonGet('/dynamicinfomanageback/dynamicinfomanagebackAction!updateEnable.action',{
    params:params
  },callback);
}

export function batchDeleteDynamicinfoPO(params, callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!batchDeleteDynamicinfoPO.action',params,callback);
}

export function ajaxSearchRead(params,callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!ajaxSearchRead.action',params,callback);
}

export function searchGroupReadPager(params,callback) {
    commonPost('/dynamicMgr/dynamicMgrCtl/searchGroupReadPager.do',params,callback);
}

export function getUnreadPager(params,callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!getUnreadPager.action',params,callback);
}

export function sendMsgToUnRead(params,callback) {
  commonGet('/dynamicinfomanageback/dynamicinfomanagebackAction!sendMsgToUnRead.action',{
    params:params
  },callback);
}

export function getArticleGroupList(params,callback) {
  commonPost('/articleMgr/articleMgrAction!getArticleGroupList.action?agentCode='+dataBase.agentCode,params,callback);
}

export function batchDelArticleGroup(params,callback) {
  commonPost('/articleMgr/articleMgrAction!batchDelArticleGroup.action',params,callback);
}

export function ajaxViewBatchReadState(params,callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!ajaxViewBatchReadState.action',params,callback);
}

export function setBatchReadState(params,callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!setBatchReadState.action',params,callback);
}

export function searchDynamicTypePager(params,callback) {
  commonPost('/dynamicMgr/dynamicMgrCtl/searchDynamicTypePager.do',params,callback);
}

export function delDynamicType(params,callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!delDynamicType.action?belongAgent='+dataBase.agentCode,params,callback);
}

export function getDynamicPublishAuthor(params, callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!getDynamicPublishAuthor.action',params,callback);
}

export function updateDynamicPublishAuthor(params,callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!updateDynamicPublishAuthor.action',params,callback);
}

export function getDynamicTypePost(params,callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!getDynamicType.action',params,callback);
}

export function addtbXyhDynamicinfoPO(params,callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!addtbXyhDynamicinfoPO.action',params,callback)
}

export function ajaxAddTimingNews(params, callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!ajaxAddTimingNews.action',params,callback);
}

export function saveAndPublish(params, callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!saveAndPublish.action',params,callback);
}

export function ajaxView(params, callback) {
  commonGet('/dynamicinfomanageback/dynamicinfomanagebackAction!ajaxView.action',{
    params:params
  },callback);
}

export function updateTiming(params, callback) {
  commonGet('/dynamicinfomanageback/dynamicinfomanagebackAction!updateTiming.action',{
    params:params
  },callback);
}

export function updateTimingNews(params, callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!updateTimingNews.action',params,callback);
}

export function updateTbXyhDynamicinfoPO(params, callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!updateTbXyhDynamicinfoPO.action',params,callback);
}

export function updateAndPublish(params, callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!updateAndPublish.action',params,callback);
}

export function saveArticleGroup(params, callback) {
  commonPost('/articleMgr/articleMgrAction!saveArticleGroup.action',params,callback);
}

export function getArticleGroupInfo(params, callback) {
  commonPost('/articleMgr/articleMgrAction!getArticleGroupInfo.action',params,callback);
}

export function getBirthdayTemp(params, callback) {
  commonPost('/dynamicinfomanageback/dynamicinfomanagebackAction!getBirthdayTemp.action?belongAgent='+dataBase.agentCode,params,callback);
}

// 检测是否开启全局水印
export function checkIsOpenWaterMark(callback){
  commonGet('/contact/contactOtherCtl/isOpenWaterMark.do?agentCode='+dataBase.agentCode,{},callback);
}
