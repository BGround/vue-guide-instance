import axios from 'axios'

function commonPost(url,params,callback,showLoading=true){
  if(showLoading){
    _.showLoading('');
  }
  axios.post(_.baseURL+url,params).then(function (result) {
    _.hideLoading('');
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  });
}

// 获取用户性别
export function getUserInfo(callback){
    commonPost('/portal/contactAction!viewMyInfo.action',{},callback, false)
}

// 根据地址信息和性别获取当前地址下所有厕所的状态
export function getAllToiletList(params, callback){
    commonPost('/portal/toiletSeat/findAllToiletSeatInfo.do',params, callback);
}

// 修改厕位状态
export function updateToiletStatus(params, callback){
    commonPost('/portal/toiletSeat/updateToiletSeatStatus.do',params, callback);
}

// 管理员设置厕位状态
export function setToiletStatus(params, callback){
    commonPost('/portal/toiletSeat/setToiletSeatStatus.do', params, callback);
}

//通过性别查找对应的厕位信息和厕位状态
export function toiletSeatList(params, callback){
    commonPost('/portal/toiletSeat/findToiletSeatInfo.do', params, callback);
}