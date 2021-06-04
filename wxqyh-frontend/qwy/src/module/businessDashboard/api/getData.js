import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config';

const SUCCESS_CODE = '0'


 const businessDashboardApi = {

   /**
    * 企业变更
    * @param params
    * @returns {Promise<AxiosResponse<any>>}
    */
   countByChangeTypeAndState(params){
    return axios({
      method: 'get',
      baseURL: baseURL,
      url: '/pc/changeEnterprisePcAction/countByChangeTypeAndState.do',
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
    * 企业变更变化
    * @param params
    * @returns {Promise<AxiosResponse<any>>}
    */
   getChangeWeek(params){
     return axios({
       method: 'get',
       baseURL: baseURL,
       url: '/pc/changeEnterprisePcAction/getChangeWeek.do',
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
    * 企业变更图表
    * @returns {Promise<AxiosResponse<any>>}
    */
     getChangeEnterpriseVOListByYear(params){
       return axios({
         method: 'get',
         baseURL: baseURL,
         url: '/pc/changeEnterprisePcAction/getChangeEnterpriseVOListByYear.do',
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
    * 统计
    * @returns {Promise<AxiosResponse<any>>}
    */
   selectStatisticsByMonth(params){
     return axios({
       method: 'get',
       baseURL: baseURL,
       url: '/pc/violationStatisticsAction/selectStatisticsByMonth.do',
       params: params
     }).then((data)=>{
       if(data.code !== '0'){
         throw new Error(response.data.msg)
       }
       return data.data
     }).catch((error)=>{
       dataBase.alert('提示', error.message);
     })
   },


   selectStatisticsByArea(params){
     return axios({
       method: 'get',
       baseURL: baseURL,
       url: '/pc/violationStatisticsAction/selectStatisticsByArea.do',
       params: params
     }).then((data)=>{
       if(data.code !== '0'){
         throw new Error(response.data.msg)
       }
       return data.data
     }).catch((error)=>{
       dataBase.alert('提示', error.message);
     })
   },

   selectStatisticsByDealer(params){
     return axios({
       method: 'get',
       baseURL: baseURL,
       url: '/pc/violationStatisticsAction/selectStatisticsByDealer.do',
       params: params
     }).then((data)=>{
       if(data.code !== '0'){
         throw new Error(response.data.msg)
       }
       return data.data
     }).catch((error)=>{
       dataBase.alert('提示', error.message);
     })

   },

    // 网络看板
     /**
      * 一网规模
      * @param params
      * @returns {Promise<AxiosResponse<any>>}
      */
     getOneScale(params){
         return axios({
             method: 'get',
             baseURL: baseURL,
             url: '/pc/scaleOverviewPcAction/getOneScale.do',
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
      * 二网规模
      * @param params
      * @returns {Promise<AxiosResponse<any>>}
      */
     getTwoScale(params){
         return axios({
             method: 'get',
             baseURL: baseURL,
             url: '/pc/scaleOverviewPcAction/getTwoScale.do',
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
      * 一网规划进展
      * @param params
      * @return {Promise<AxiosResponse<any>>}
      */
     getOneProgressNetworkPlanning(params){
         return axios({
             method: 'get',
             baseURL: baseURL,
             url: '/pc/progressNetworkPlanningPcAction/getOneProgressNetworkPlanning.do',
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
      * 一网规划进展
      * @param params
      * @return {Promise<AxiosResponse<any>>}
      */
     getTwoProgressNetworkPlanning(params){
         return axios({
             method: 'get',
             baseURL: baseURL,
             url: '/pc/progressNetworkPlanningPcAction/getTwoProgressNetworkPlanning.do',
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
      * 产品授权
      * @param params
      * @return {Promise<AxiosResponse<any>>}
      */
     getProductAuthorizationList(params){

         return axios({
             method: 'get',
             baseURL: baseURL,
             url: '/pc/productAuthorizationPcAction/getProductAuthorizationList.do',
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
      * 行业竞品
      * @param params
      * @return {Promise<AxiosResponse<any>>}
      */
     getIndustryCompetitorList(params){

         return axios({
             method: 'get',
             baseURL: baseURL,
             url: '/pc/industryCompetitorPcAction/getIndustryCompetitorList.do',
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
      * 二网变化
      * @param params
      * @return {Promise<AxiosResponse<any>>}
      */
     getScaleManagementList(params){
         return axios({
             method: 'get',
             baseURL: baseURL,
             url: '/pc/twoScaleManagementPcAction/getScaleManagement.do',
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
      * 一网变化
      * @param params
      * @return {Promise<AxiosResponse<any>>}
      */
      getOneScaleManagement(params){
        return axios({
            method: 'get',
            baseURL: baseURL,
            url: '/pc/oneScaleManagementPcAction/getOneScaleManagement.do',
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
     getScaleManagement(params){

         return axios({
             method: 'get',
             baseURL: baseURL,
             url: '/pc/oneScaleManagementPcAction/getOneScaleManagement.do',
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
      * 开发计划
      * @param params
      * @return {Promise<AxiosResponse<any>>}
      */
     getOneDevelopmentPlan(params){

         return axios({
             method: 'get',
             baseURL: baseURL,
             url: '/pc/oneDevelopmentPlanPcAction/getOneDevelopmentPlan.do',
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
      * 入网进展
      * @param params
      * @return {Promise<AxiosResponse<any>>}
      */
     getOneNetworkProgress(params){

         return axios({
             method: 'get',
             baseURL: baseURL,
             url: '/pc/oneNetworkProgressPcAction/getOneNetworkProgress.do',
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
      * 网络开通
      * @param params
      * @return {Promise<AxiosResponse<any>>}
      */
     getOpeningProgress(params){
         return axios({
             method: 'get',
             baseURL: baseURL,
             url: '/pc/openingProgressPcAction/getOpeningProgress.do',
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
      * 网络开通
      * @param params
      * @return {Promise<AxiosResponse<any>>}
      */
     getNetStorefrontBuild(params){
         return axios({
             method: 'get',
             baseURL: baseURL,
             url: '/pc/onenetStorefrontBuildPcAction/getNetStorefrontBuild.do',
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
