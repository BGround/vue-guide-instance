

import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config';

const SUCCESS_CODE = '0'


const businessDashboardApi = {

  /**
   * 新网销量
   * @param params
   * @returns {Promise<AxiosResponse<any>>}
   */
  getMonthlyStatistics(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/monthlyNewNetworkPcAction/getMonthlyStatistics.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
        throw new Error(response.data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },

  /**
   * 新网销量地区
   * @param params
   * @returns {Promise<AxiosResponse<any>>}
   */
  getLargeAreaStatistics(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/newNetworkDataDetailsPcAction/getLargeAreaStatistics.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
        throw new Error(response.data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },


  /**
   * 分区
   * @param params
   * @returns {Promise<AxiosResponse<any>>}
   */
  getCarList(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/newNetworkDataDetailsPcAction/getCarList.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
        throw new Error(response.data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },

  /**
   * 新网销量排名
   * @param params
   * @returns {Promise<AxiosResponse<any>>}
   */
  getDealerRanking(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/newNetworkDataDetailsPcAction/getDealerRanking.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
        throw new Error(response.data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },

  /**
   *  分经销商提车列表
   * @param params
   * @returns {Promise<AxiosResponse<any>>}
   */
  getDealerLiftNumberRankingList(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/newNetworkDataDetailsPcAction/getDealerLiftNumberRankingList.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
        throw new Error(response.data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },

  /**
   *  分经销商提车列表
   * @param params
   * @returns {Promise<AxiosResponse<any>>}
   */
  getDealerActualSalesNumberRankingList(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/newNetworkDataDetailsPcAction/getDealerActualSalesNumberRankingList.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
        throw new Error(response.data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },

  /**
   *  模块完成情况
   * @param params
   * @returns {Promise<AxiosResponse<any>>}
   */
  getModuleTopRanking(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/businessModuleCompletionDetailsPcAction/getModuleTopRanking.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
        throw new Error(response.data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },

  /**
   *  模块完成情况
   * @param params
   * @returns {Promise<AxiosResponse<any>>}
   */
  getModuleTopRankingList(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/businessModuleCompletionDetailsPcAction/getModuleTopRankingList.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
        throw new Error(response.data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },




}
export default businessDashboardApi
