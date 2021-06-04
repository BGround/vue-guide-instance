import axios from "axios";

/**
 * 网点通讯录
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxServiceOutlets(params){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'get',
      url: '/dealer/dealerAction!ajaxServiceOutlets.action',
      params: params,
  }).then(function(result) {
      if (String(result.code) === '0') {
          return result.data;
      } else {
          _.alert('提示', result.desc)
      }
  }).finally(()=>{
      dataBase.loading = false
  })
}

/**
 * 在售车型查询（动态表头）
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxServiceModelsName(params){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'get',
      url: '/mgr/serviceModels/serviceModelsAction!ajaxServiceModelsName.action',
      params: params,
  }).then(function(result) {
      if (String(result.code) === '0') {
          return result.data;
      } else {
          _.alert('提示', result.desc)
      }
  }).finally(()=>{
      dataBase.loading = false
  })
}
