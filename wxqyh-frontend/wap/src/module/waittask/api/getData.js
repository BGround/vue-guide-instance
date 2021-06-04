import axios from 'axios';

function commonPost(url,params,callback,status){
  _.showLoading();
  axios.post(_.baseURL+url,params).then(function (result) {
    _.hideLoading();
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
  _.showLoading();
  axios.get(_.baseURL+url,params).then(function (result) {
    _.hideLoading();
    if (result.code == '0'){
      callback(result.data);
    }else {
      dataBase.top_alert(result.desc,false,3000);
    }
  });
}

// 获取企微云办公、企微云文化开启应用
export function getAppOpenStatus(params,cb) {
  commonPost('/portal/qyservice/qyservicePortalAction!getCustomAgentDetail.action',params,cb)
}
