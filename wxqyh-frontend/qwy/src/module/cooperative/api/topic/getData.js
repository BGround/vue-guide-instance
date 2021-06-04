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

/* 同事社区发布与编辑界面 */
//获取可发布的话题类型
export function getTypeList(cb){
  commonPost('/topicMgr/topicMgrCtl/getCanPublishTypeList.do',{},cb);
}

//获取所有的话题类型
export function getAllTypeList(cb){
  commonPost('/topicAction/topicMgrAction!getTypeList.action',{},cb);
}

//根据话题id查询话题可见范围
export function getTopicVisiableRange(params,cb){
  commonPost('/topicAction/topicMgrAction!getTopicTypeVisibleTarget.action',params,cb);
}

//发布或保存草稿
export function addAjax(params,cb){
  commonPost('/topicAction/topicMgrAction!ajaxAddTopic.action',params,cb);
}

//获取话题信息
export function getTopicHistoryInfo(params,cb){
  commonPost('/topicAction/topicMgrAction!getTopicHistoryInfo.action',params,cb);
}

//更新话题
export function ajaxUpdateTopic(params,cb){
  commonPost('/topicAction/topicMgrAction!ajaxUpdateTopic.action',params,cb);
}

//新增话题类型
export function typeAddAjax(params,cb){
  commonPost('/topicAction/topicMgrAction!ajaxAdd.action',params,cb);
}

//获取话题类型信息
export function getTopicType(params,cb){
  commonPost('/topicAction/topicMgrAction!getTopicType.action',params,cb);
}

//更新话题类型信息
export function ajaxUpdateType(params,cb){
  commonPost('/topicAction/topicMgrAction!ajaxUpdate.action',params,cb);
}

//设置项是否开启一键已阅
export function ajaxViewBatchReadState(cb){
  commonPost('/topicAction/topicMgrAction!ajaxViewBatchReadState.action',{},cb);
}

//修改一键已阅状态
export function setBatchReadState(params,cb){
  commonPost('/topicAction/topicMgrAction!setBatchReadState.action',params,cb);
}

//设置项是否开启默认推送消息
export function ajaxViewDefaultSendMsgConfig(cb){
  commonPost('/topicAction/topicMgrAction!ajaxViewDefaultSendMsgConfig.action',{},cb);
}

//修改默认推送消息
export function setIsSendMsg(params,cb){
  commonPost('/topicAction/topicMgrAction!setIsSendMsg.action',params,cb);
}

//获取匿名设置
export function getTopicAnony(cb){
  commonPost('/topicAction/topicMgrAction!getTopicAnony.action',{},cb);
}

//修改匿名设置
export function editTopicAnony(params,cb){
  commonPost('/topicAction/topicMgrAction!editTopicAnony.action',params,cb);
}

//获取置顶个数
export function getTopicTopNum(cb){
  commonPost('/topicAction/topicMgrAction!getTopicTopNum.action',{},cb);
}

//设置置顶个数
export function editTopNumber(params,cb){
  commonPost('/topicAction/topicMgrAction!editTopNumber.action',params,cb);
}

//获取发布权限
export function getTopicPublishAuthor(cb){
  commonPost('/topicAction/topicMgrAction!getTopicPublishAuthor.action',{},cb);
}

//保存发布权限
export function updateTopicPublishAuthor(params,cb){
  commonPost('/topicAction/topicMgrAction!updateTopicPublishAuthor.action',params,cb);
}

//删除话题类型
export function delTopicType(params,cb){
  commonPost('/topicAction/topicMgrAction!delTopicType.action',params,cb);
}

//查询话题类型列表
export function searchTypeList(params,cb){
  commonPost('/topicAction/topicMgrAction!searchTypeList.action',params,cb);
}

//获取话题类型
export function getTopicList(params,cb){
  commonPost('/topicAction/topicMgrAction!searchListByOrgId.action',params,cb);
}

//修改置顶状态
export function updateTop(params,cb){
  commonPost('/topicAction/topicMgrAction!updateTop.action',params,cb);
}

//修改已发布话题的话题类型
export function editTopicType(params,cb){
  commonPost('/topicAction/topicMgrAction!editTopicType.action',params,cb);
}

//删除话题
export function ajaxBatchDelete(params,cb){
  commonPost('/topicAction/topicMgrAction!ajaxBatchDelete.action',params,cb);
}

//获取已阅话题人员列表
export function ajaxSearchRead(params,cb){
  commonPost('/topicAction/topicMgrAction!ajaxSearchRead.action',params,cb);
}

//获取已阅话题人员列表
export function getUnreadPager(params,cb){
  commonPost('/topicAction/topicMgrAction!getUnreadPager.action',params,cb);
}

//获取评论列表
export function ajaxSearchComment(params,cb){
  commonPost('/topicAction/topicMgrAction!ajaxSearchComment.action',params,cb);
}

//删除评论
export function ajaxDeleteComment(params,cb){
  commonPost('/topicAction/topicMgrAction!ajaxDeleteComment.action',params,cb);
}

//通过全部评论
export function ajaxReviewAllComment(cb){
  commonPost('/topicAction/topicMgrAction!ajaxReviewAllComment.action',{},cb);
}

//通过全部评论
export function ajaxReviewComment(params,cb){
  commonPost('/topicAction/topicMgrAction!ajaxReviewComment.action',params,cb);
}



