import axios from "axios";
import { Toast } from "quickwork-ui";
import Qs from "qs";

const SUCCESS_CODE = "0";

const BASE_URL = `${_.baseURL}`;

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    _.showLoading("");
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    _.hideLoading("");
    return response;
  },
  function(error) {
    _.hideLoading("");
    return Promise.reject(error);
  }
);

/**
 * 销售成绩单：
 */
export function searchSalesReportPage(params) {
  return axios
    .get(
      BASE_URL +
        "/portal/salesreport/salesreportPortalAction!searchSalesreportPage.action",
      { params }
    )
    .then(data => {
      if (data.code !== '0') {
        throw new Error(data.desc);
      }
      return data.data;
    })
    .catch(error => {
      Toast({
        type: "info",
        duration: 1500,
        content: error.message
      });
    });
}

/**
 * 销售成绩单：
 */
export function getSalesreportDetail(params) {
  return axios
    .post(
      BASE_URL +
        "/portal/salesreport/salesreportPortalAction!getSalesreportDetail.action",
        params
    )
    .then(data => {
      if (data.code !== '0') {
        throw new Error(data.desc);
      }
      return data.data;
    })
    .catch(error => {
      Toast({
        type: "info",
        duration: 1500,
        content: error.message
      });
    });
}

/**
 * 售后成绩单详情：
 * dealerId
 * ?id=4fba5243844e440c8787aab373c8cd23
 */
export function getSalesAfetrReportById(params) {
  return axios
    .get(
      BASE_URL +
        "/portal/salesreport/salesAfterPortalAction!getSalesAfetrReportById.action",
      { params }
    )
    .then(data => {
      if (data.code !== "0") {
        throw new Error(data.desc);
      }
      return data.data;
    })
    .catch(error => {
      Toast({
        type: "info",
        duration: 1500,
        content: error.message
      });
    });
}

/**
 * 售后成绩单
 */
export function searchPortalSalesAfeterreportPage(params) {
  return axios
    .get(
      BASE_URL +
        "/portal/salesreport/salesAfterPortalAction!searchPortalSalesAfeterreportPage.action",
      { params }
    )
    .then(data => {
      if (data.code !== "0") {
        throw new Error(data.desc);
      }
      return data.data;
    })
    .catch(error => {
      Toast({
        type: "info",
        duration: 1500,
        content: error.message
      });
    });
}

/**
 * s说明
 * @param params
 * @return {Promise<AxiosResponse<any> | never>}
 */
export function getSalesReportExplain(params) {
  return axios
    .get(
      BASE_URL +
        "/portal/homePagePcAction/getSalesReportExplain.do",
      { params }
    )
    .then(data => {
      if (data.code !== "0") {
        throw new Error(data.desc);
      }
      return data.data;
    })
    .catch(error => {
      Toast({
        type: "info",
        duration: 1500,
        content: error.message
      });
    });
}

/**
 * 保存反馈
 * @param params
 * @return {Promise<AxiosResponse<any> | never>}
 */

/**
 * 售后反馈
 * @param data
 * @return {Promise<AxiosResponse<any> | never>}
 */
// export function saveFeedback(params) {
//   return axios({
//     url:
//       BASE_URL +
//       "/portal/salesreport/salesAfterPortalAction!saveFeedback.action",
//     method: "POST",
//     data: params,
//     transformRequest: [
//       function(data) {
//         return Qs.stringify(data, { indices: false });
//       }
//     ],
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded"
//     }
//   })
//     .then(data => {
//       if (data.code !== "0") {
//         throw new Error(data.desc);
//       }
//       return data.data;
//     })
//     .catch(error => {
//       Toast({
//         type: "info",
//         duration: 1500,
//         content: error.message
//       });
//     });
// }

/**
 * 销售反馈
 */
export function saveSalesFeedback(params) {
  return axios({
    url:
      BASE_URL +
      "/portal/salesreport/salesreportPortalAction!saveFeedback.action",
    method: "POST",
    data: params,
    transformRequest: [
      function(data) {
        return Qs.stringify(data, { indices: false });
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(data => {
      if (data.code !== "0") {
        throw new Error(data.desc);
      }
      return data.data;
    })
    // .catch(error => {
    //   Toast({
    //     type: "info",
    //     duration: 1500,
    //     content: error.message
    //   });
    // });
}

/**
 * 销售反馈
 */
export function readSalesreport(params) {
  return axios
    .get(
      BASE_URL +
        "/portal/salesreport/salesreportPortalAction!readSalesreport.action",
      { params }
    )
    .then(data => {
      if(data.code === '1002'){
        Toast({
          type: "info",
          duration: 1500,
          content: data.desc
        });
        return 'NO_PERMISSION'
      }
      if (data.code !== "0") {
        throw new Error(data.desc);
      }
      return data.data;
    })
    .catch(error => {
      Toast({
        type: "info",
        duration: 1500,
        content: error.message
      });
    });
}

/**
 * 判断是否为大区负责人
 */
export function checkRegionAdmin() {
  return axios
    .get(
      BASE_URL +
        "/portal/salesreport/salesreportPortalAction!checkRegionAdmin.action"
    )
    .then(data => {
      if(data.code === '1002'){
        Toast({
          type: "info",
          duration: 1500,
          content: data.desc
        });
        return 'NO_PERMISSION'
      }
      if (data.code !== "0") {
        throw new Error(data.desc);
      }
      return data.data;
    })
    .catch(error => {
      Toast({
        type: "info",
        duration: 1500,
        content: error.message
      });
    });
}


/**
 * 战区负责人保存整改意见
 */
export function saveRemediationAction(params) {
  return axios({
    url:
      BASE_URL +
      "/portal/salesAfterPortalAction/saveRemediationAction.do",
    method: "POST",
      params: params,
    // transformRequest: [
    //   function(data) {
    //     return Qs.stringify(data, { indices: false });
    //   }
    // ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(data => {
      if (data.code !== '0') {
        throw new Error(data.desc);
      }
      return data.data;
    })
    .catch(error => {
      Toast({
        type: "info",
        duration: 1500,
        content: error.message
      });
    });
}

/**
 * 总经理确认查阅保存投资人意见
 */
export function saveManagerFeedback(params) {
  return axios({
    url:
      BASE_URL +
      "/portal/salesAfterPortalAction/saveManagerFeedback.do",
    method: "POST",
    data: params,
    transformRequest: [
      function(data) {
        return Qs.stringify(data, { indices: false });
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(data => {
      if (data.code !== '0') {
        throw new Error(data.desc);
      }
      return data;
    })
    .catch(error => {
      Toast({
        type: "info",
        duration: 1500,
        content: error.message
      });
    });
}

/**
 * 保存服务总监上传的附件和图片
 * @param {*} params
 */
export function saveFeedback(params) {

    return axios({
      url:BASE_URL + "/portal/salesreport/salesAfterPortalAction!saveFeedback.action",
      method: "POST",
      data: params,
      transformRequest: [
        function(data) {
          return Qs.stringify(data, { indices: false });
        }
      ],
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .then(data => {
        if (data.code !== "0") {
          throw new Error(data.desc);
        }
        return data.data;
      })
      .catch(error => {
        Toast({
          type: "info",
          duration: 1500,
          content: error.message
        });
      });
}


export function uploadWxImage(params){
    _.showLoading()
    return  axios.post(`${_.baseURL}/portal/newimageupload/newimageUploadAction!newimageUpload.action`,params).then( (result) => {
        if (result.code === "0"){
            return result.data;
        } else{
            throw new Error(result.desc);
        }
    }).catch((error) => {
        if(error.code === 'ECONNABORTED'){
            _.alert("提示", '接口超时了');
        }else {
            _.alert("提示",error.message);
        }
        console.error(error);
    }).finally(()=>{
        _.hideLoading();
    })
}

/**
 * 上传附件
 * @param data
 * @return {Promise<unknown>}
 */
export function uploadFile(data){
    _.showLoading()
    return  axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/portal/imageupload/imageUploadAction!doUploadFile.action',
        params:{
            agent: dataBase.wxqyh_uploadfile.agent
        },
        data: data,
        transformRequest: [function (data) {
            const form = new FormData();
            Object.keys(data).forEach((key)=>{
                form.append(key, data[key]);
            })
            return form;
        }],
    }).then( (result) => {
        if (result.code === "0"){
            return result.data;
        } else{
            throw new Error(result.msg);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
        console.error(error);
    }).finally(()=>{
        _.hideLoading();
    })
}

/**
 * 上传Base64附件
 * @param base64
 * @return {Promise<unknown>}
 */
export function uploadImageBase64(base64){
    const data ={
        imgFileBase: base64,
        agent: dataBase.wxqyh_uploadfile.agent,
        isOpen: window.location.href.indexOf("/open/")!=-1,
        orderId:'',
    }
    _.showLoading()
    return  axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/portal/imageupload/imageUploadAction!doUploadImageBase64.action',
        data: data,
    }).then( (result) => {
        if (result.code === "0"){
            return result.data;
        } else{
            throw new Error(result.msg);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
    }).finally(()=>{
        _.hideLoading();
    })
}

/**
 * 手机端-经销商反馈新增项目
 * @param base64
 * @return {Promise<unknown>}
 */
export function addFeedProject(data){
    _.showLoading()
    return  axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/portal/dealerFeedBackPortalAction/addFeedProject.do',
        data: data,
        transformRequest: [function (data) {
           return JSON.stringify(data);
        }],
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then( (result) => {
        if (result.code === 0){
            return result.data;
        } else{
            throw new Error(result.msg);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
    }).finally(()=>{
        _.hideLoading();
    })
}

/**
 * 手机端-经销商反馈新增项目
 * @param base64
 * @return {Promise<unknown>}
 */
export function updateFeedProject(data){
    _.showLoading()
    return  axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/portal/dealerFeedBackPortalAction/updateFeedProject.do',
        data: data,
        transformRequest: [function (data) {
            return JSON.stringify(data);
        }],
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then( (result) => {
        if (result.code === 0){
            return result.data;
        } else{
            throw new Error(result.msg);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
    }).finally(()=>{
        _.hideLoading();
    })
}

/**
 * 手机端-经销商添加反馈修改申请

 * @param base64
 * @return {Promise<unknown>}
 */
export function addFeedBack(data){
    _.showLoading()
    return  axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/portal/dealerFeedBackPortalAction/addFeedBack.do',
        data: data,
        transformRequest: [function (data) {
            return JSON.stringify(data);
        }],
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then( (result) => {
        if (result.code === 0){
            return result.data || {};
        } else{
            throw new Error(result.msg);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
    }).finally(()=>{
        _.hideLoading();
    })
}


/**
 * 查看已反馈项目的列表
 * @param params
 * @return {Promise<AxiosResponse<any>>}
 */
export function viewFeedProject(params) {
    return axios.get(
            BASE_URL +
            "/portal/dealerFeedBackPortalAction/viewFeedProject.do",
            { params }
        )
        .then(data => {
            if (data.code !== 0) {
                throw new Error(data.msg);
            }
            return data.data || {};
        })
        .catch(error => {
            Toast({
                type: "info",
                duration: 1500,
                content: error.message
            });
        });
}


/**
 * 查看反馈申请修改是否通过
 * @param params
 * @return {Promise<AxiosResponse<any>>}
 */
export function viewFeedBack(params) {
    return axios.get(
        BASE_URL +
        "/portal/dealerFeedBackPortalAction/viewFeedBack.do",
        { params }
    )
        .then(data => {
            if (data.code !== 0) {
                throw new Error(data.msg);
            }
            return data.data;
        })
        .catch(error => {
            Toast({
                type: "info",
                duration: 1500,
                content: error.message
            });
        });
}


/**
 * 更新反馈申请
 * @param base64
 * @return {Promise<unknown>}
 */
export function updateFeedBack(data){
    _.showLoading()
    return  axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/portal/dealerFeedBackPortalAction/updateFeedBack.do',
        data: data,
        transformRequest: [function (data) {
            return JSON.stringify(data);
        }],
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then( (result) => {
        if (result.code === 0){
            return result.data || {};
        } else{
            throw new Error(result.msg);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
    }).finally(()=>{
        _.hideLoading();
    })
}



/**
 * 更新反馈申请
 * @param base64
 * @return {Promise<unknown>}
 */
export function getSalesreportRewards(params){
    _.showLoading()
    return  axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/portal/marketReportPortalAction/getSalesreportRewards.do',
        params: params,
        // transformRequest: [function (data) {
        //     return JSON.stringify(data);
        // }],
        // headers:{
        //     'Content-Type': 'application/json;charset=utf-8'
        // }
    }).then( (result) => {
        if (result.code === 0){
            return result.data || {};
        } else{
            throw new Error(result.desc);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
    }).finally(()=>{
        _.hideLoading();
    })
}




/**
 * 销量表现
 * @param base64
 * @return {Promise<unknown>}
 */
export function getSalesreportSales(params){
    _.showLoading()
    return  axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/portal/marketReportPortalAction/getSalesreportSales.do',
        params: params,
        // transformRequest: [function (data) {
        //     return JSON.stringify(data);
        // }],
        // headers:{
        //     'Content-Type': 'application/json;charset=utf-8'
        // }
    }).then( (result) => {
        if (result.code === 0){
            return result.data || {};
        } else{
            throw new Error(result.desc);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
    }).finally(()=>{
        _.hideLoading();
    })
}



/**
 * 销量表现
 * @param base64
 * @return {Promise<unknown>}
 */
export function getMarketReportInfo(params){
    _.showLoading()
    return  axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/portal/marketReportPortalAction/getMarketReportInfo.do',
        params: params,
        // transformRequest: [function (data) {
        //     return JSON.stringify(data);
        // }],
        // headers:{
        //     'Content-Type': 'application/json;charset=utf-8'
        // }
    }).then( (result) => {
        if (result.code === 0){
            return result.data || {};
        } else{
            throw new Error(result.desc);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
    }).finally(()=>{
        _.hideLoading();
    })
}


/**
 * 推送文件
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export function doSendFileToMe(mediaId) {
    const params = {
        mediaId,
        agent: 'reportcard'
    }
    return axios
        .get(BASE_URL+'/portal/imageupload/imageUploadAction!doSendFileToMe.action', {
            params,
        })
}

/**
 * 手机端-服务总监提交整改计划表
 * @param params
 * @param data
 * @return {Promise<unknown>}
 */
export function saveServiceFeedback(params,data){
    _.showLoading()
    return  axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/portal/salesAfterPortalAction/saveServiceFeedback.do',
        params: params,
        data: data,
        transformRequest: [function (data) {
            return JSON.stringify(data);
        }],
        headers:{
            'Content-Type': 'application/json;charset=utf-8'
        }
    }).then( (result) => {
        if (String(result.code) === '0'){
            return result.data || {};
        } else{
            throw new Error(result.desc);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
    }).finally(()=>{
        _.hideLoading();
    })
}

/**
 * 手机端-大区负责人确认查阅
 * @param id
 * @param data
 * @return {Promise<unknown>}
 */
export function saveLeaderFeedback(data){
    console.log(data);
    _.showLoading()
    return  axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/portal/salesAfterPortalAction/saveLeaderFeedback.do',
        params: data,
        // transformRequest: [function (data) {
        //     console.log(JSON.stringify(data))
        //     return JSON.stringify(data);
        // }],
        // headers:{
        //     'Content-Type': 'application/json;charset=utf-8'
        // }
    }).then( (result) => {
        if (String(result.code) === '0'){
            return result.data || {};
        } else{
            throw new Error(result.desc);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
    }).finally(()=>{
        _.hideLoading();
    })
}
