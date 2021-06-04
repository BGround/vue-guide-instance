
import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config';

//查询机构corpId
export function getOrgInfo(params,callBack){
  axios.post(`${baseURL}/accountmgr/accountmgrAction!getOrgInfo.action`, params)
    .then(function (result) {
      callBack(result)
    });
}


//查询机构的应用人数,校验corpId
export function getOrgAgentUserCount(params,callBack){
  axios.post(`${baseURL}/open/selectUserMgrCtl/getOrgAgentUserCount.do`, params)
    .then(function (result) {
      callBack(result)
  });
}

//查找商品价格体系
export function findProductListByServiceId(params,callBack){
  axios.post(`${baseURL}/open/productOpenCtl/findProductListByServiceId.do`, params)
    .then(function (result) {
      if(result.code=='0'){
        callBack(result)
      } else{
        dataBase.top_alert(result.desc, false, 3000);
      }
    });
}

//查找尊享版价格信息
export function doViprespectDetail(params,callBack){
  axios.post(`${baseURL}/open/productOpenCtl/doViprespectDetail.do`, params)
    .then(function (result) {
      if(result.code=='0'){
        callBack(result)
      } else{
        dataBase.top_alert(result.desc, false, 3000);
      }
    });
}

//购买套餐价格估算
export function estimateMulitPrice(params,callBack){
  axios.post(`${baseURL}/portal/tradePortal!estimateMulitPrice.action`, params)
    .then(function (result) {
      if(result.code=='0'){
        callBack(result)
      } else{
        dataBase.top_alert(result.desc, false, 3000);
      }
    });
}

//查询扩容套餐
export function getOrgViprespectDetail(params,callBack) {
    axios.post(`${baseURL}/open/vipOpenCtl/getOrgViprespectDetail.do`, params)
      .then(function (result) {
        if(result.code=='0'){
          callBack(result)
        } else{
          dataBase.top_alert(result.desc, false, 3000);
        }
      });
}
