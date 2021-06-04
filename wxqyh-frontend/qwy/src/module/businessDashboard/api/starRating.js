import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config';

const starRatingApi = {
	/**
	  * 整体情况
	  * @param params
	  * @returns {Promise<AxiosResponse<any>>}
	  */
	 getAllSituation(params){
	  return axios({
	    method: 'get',
	    baseURL: baseURL,
	    url: '/pc/starRankPcAction/getAllSituation.do',
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
	  * 指标分析
	  * @param params
	  * @returns {Promise<AxiosResponse<any>>}
	  */
	 getIndexAnalysis(params){
	  return axios({
	    method: 'get',
	    baseURL: baseURL,
	    url: '/pc/starRankPcAction/getIndexAnalysis.do',
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
	 getDealerSituation(params){
	  return axios({
	    method: 'get',
	    baseURL: baseURL,
	    url: '/pc/starRankPcAction/getDealerSituation.do',
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

export default starRatingApi