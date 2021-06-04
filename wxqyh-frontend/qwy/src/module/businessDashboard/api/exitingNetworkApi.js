import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config';

const SUCCESS_CODE = '0'


 const exitingNetwork = {

   /**
    * 冻结网点
    * @param params
    * @returns {Promise<AxiosResponse<any>>}
    */
   getFrozenDetails(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/frozenDotDetailsPcAction/getFrozenDetails.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
          throw new Error(data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },

  /**
    * 意向退网  整车情况+本周变化
    * @param params
    * @returns {Promise<AxiosResponse<any>>}
    */
   getIntentionExit(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/intendedWithdrawalDetailsPcAction/getIntentionExit.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
          throw new Error(data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },


  /**
    * 意向退网列表
    * @param params
    * @returns {Promise<AxiosResponse<any>>}
    */
   getIntentionExitList(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/intendedWithdrawalDetailsPcAction/getIntentionExitList.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
          throw new Error(data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },

  /**
    * 分月退网  整车情况
    * @param params
    * @returns {Promise<AxiosResponse<any>>}
    */
   getMonthWithdrawalNetwork(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/networkOutletDetailsPcAction/getMonthWithdrawalNetwork.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
          throw new Error(data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },

  /**
    * 分月退网列表
    * @param params
    * @returns {Promise<AxiosResponse<any>>}
    */
   getMonthWithdrawalNetworkList(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/networkOutletDetailsPcAction/getMonthWithdrawalNetworkList.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
          throw new Error(data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },

  /**
    * 分大区列表（整车情况跟分月退网  整车情况一致）
    * @param params
    * @returns {Promise<AxiosResponse<any>>}
    */
   getLargeAreaWithdrawalNetworkList(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/networkOutletDetailsPcAction/getLargeAreaWithdrawalNetworkList.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
          throw new Error(data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },

  /**
    * 僵尸网点
    * @param params
    * @returns {Promise<AxiosResponse<any>>}
    */
   getZombieNetworkDetails(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/zombieNetworkDetailsPcAction/getZombieNetworkDetails.do',
      params: params
    }).then((data)=>{
      if(data.code !== 0){
          throw new Error(data.msg)
      }
      return data.data
    }).catch((error)=>{
      dataBase.alert('提示', error.message);
    })
  },


}
export default exitingNetwork
