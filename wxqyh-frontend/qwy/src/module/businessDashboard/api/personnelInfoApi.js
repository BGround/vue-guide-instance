import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config';

const personnelInfoApi = {
	/**
	  * 总览
	  * @param params
	  * @returns {Promise<AxiosResponse<any>>}
	  */
	 overviewHome(params){
	  return axios({
	    method: 'get',
	    baseURL: baseURL,
	    url: '/pc/personInfoReadOnlyAction/overviewHome.do',
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
	  * 分经销商
	  * @param params
	  * @returns {Promise<AxiosResponse<any>>}
	  */
	 dealerRank(params){
	  return axios({
	    method: 'get',
	    baseURL: baseURL,
	    url: '/pc/personInfoReadOnlyAction/dealerRank.do',
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
	  * 分大区
	  * @param params
	  * @returns {Promise<AxiosResponse<any>>}
	  */
	 regionalInfo(params){
	  return axios({
	    method: 'get',
	    baseURL: baseURL,
	    url: '/pc/personInfoReadOnlyAction/regionalInfo.do',
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
	  * 总览图表
	  * @param params
	  * @returns {Promise<AxiosResponse<any>>}
	  */
	 homeChart(params){
	  return axios({
	    method: 'get',
	    baseURL: baseURL,
	    url: '/pc/personInfoReadOnlyAction/homeChart.do',
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
	  * 分月
	  * @param params
	  * @returns {Promise<AxiosResponse<any>>}
	  */
	 monthProgress(params){
	  return axios({
	    method: 'get',
	    baseURL: baseURL,
	    url: '/pc/personInfoReadOnlyAction/monthProgress.do',
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
	  * 分月
	  * @param params
	  * @returns {Promise<AxiosResponse<any>>}
	  */
	 getLastUpdate(params){
	  return axios({
	    method: 'get',
	    baseURL: baseURL,
	    url: '/pc/personInfoReadOnlyAction/getLastUpdateVO.do',
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

export default personnelInfoApi