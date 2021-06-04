import axios from 'axios';

export function baseAxios(url,params,callback){
  axios.post(_.baseURL+url,params).then(function (result) {
    if(result.code==='0'){
      callback(result.data)
    }else {
      _.alert('提示',result.desc)
    }
  })
}

export function ajaxSearch(callback){
  axios.post(_.baseURL+'/reim/reimMgrCtl/ajaxSearch.do',{
    page:1,
    pageSize:10
  }).then(function(result){
    callback(result.data);
  })
}

export function rankList(callback){
  axios.post(_.baseURL+'/reim/reimCrl/rankList.do').then(function(result){
    callback(result.data);
  })
}
