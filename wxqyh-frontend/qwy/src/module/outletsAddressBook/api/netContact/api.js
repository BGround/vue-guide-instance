import axios from "axios";

/**
 * 网点通讯录
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxBranchesSearch(params){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'get',
      url: '/dealer/dealerAction!ajaxBranchesSearch.action',
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
export function ajaxModelsOnSaleByName(params){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'get',
      url: '/mgr/modelsOnSaleAction/modelsOnSaleAction!ajaxModelsOnSaleByName.action',
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
 * 星途车型查询（动态表头）
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxCelebrityModelsByName(params){
  dataBase.loading = true;
  return axios({
      baseURL: _.baseURL,
      method: 'get',
      url: '/mgr/celebrityModels/celebrityModelsAction!ajaxCelebrityModelsByName.action',
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