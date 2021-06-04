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

// 搜索
export function getCompany(keyWord,cb) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/publishcountPortalCtl/getCompany.do',{
    keyWord
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data.pageData)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 搜索 PC端企业列表查询(带详情)
export function getCompanyDetailList(keyWord,cb) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/publishcountPortalCtl/getCompanyDetailList.do',{
    keyWord
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data.pageData)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
    }
  })
}

// 企业详情
export function getCompanyDetail(corpId,cb) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/publishcountPortalCtl/getCompanyDetail.do',{
    corpId
  }).then(function (result) {
    if(result.code==='0'){
      _.hideLoading('');
      cb(result.data)
    }else {
      _.hideLoading('');
     _.alert('提示',result.desc)
    }
  })
}

export function operationRemarks(experienceInfoPO,cb,failcb) {
  _.showLoading('')
  axios.post(_.baseURL+'/portal/publishcountPortalCtl/operationRemarks.do',{
    experienceInfoPO
  }).then(function (result) {
    if(result.code==='0'){
      _.tooltips_succeed("操作成功");
      cb(result.data)
    }else {
      _.hideLoading('');
      _.alert('提示',result.desc)
      failcb()
    }
  })
}

export function getQrCode(cb) {
  commonPost('/portal/publishcountPortalCtl/getRegisterUrl.do',{},cb)
}
