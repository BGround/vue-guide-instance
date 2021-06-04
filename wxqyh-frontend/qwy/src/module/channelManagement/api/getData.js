import axios from "axios";
import Qs from "qs";

function commonPost(url, params, callback) {
  dataBase.loading = true;
  axios.post(_.baseURL + url, params).then(function(result) {
    dataBase.loading = false;
    if (result.code == "0") {
      callback(result.data);
    } else {
      _.alert("提示", result.desc);
    }
  });
}

// export function ajaxSearchMenuList(callback) {
//   commonPost(
//     "/menu/menuAction!ajaxSearchMenuList.action",
//     {
//       menuAssortment: "content"
//     },
//     callback
//   );
// }

// 渠道首页-战区下的省市，如果查询战区ID为空，默认查询战区数据
export function ajaxSearchDepatmentList(data, callback) {
  commonPost("/dealer/dealerAction!searchDepatmentList.action", data, callback);
}

export function getProvince() {
  return axios
    .get(_.baseURL + "/mgr/plancity/planCityMgrAction!getProvince.action")
    .then(result => {
      if (result.code !== "0") {
        throw new Error(result.desc);
      }
      return result.data;
    })
    .catch(error => {
      _.alert("提示", error.message);
    });
}

/**
 * pid
 */
export function getCity(params) {
  return axios
    .get(_.baseURL + "/mgr/plancity/planCityMgrAction!getCity.action", {
      params
    })
    .then(result => {
      if (result.code !== "0") {
        throw new Error(result.desc);
      }
      return result.data;
    })
    .catch(error => {
      _.alert("提示", error.message);
    });
}

export function getAreaList(params) {
  return axios
    .get(_.baseURL + "/area/AreaAction!getAreaList.action", { params })
    .then(result => {
      if (result.code !== "0") {
        throw new Error(result.desc);
      }
      return result.data;
    })
    .catch(error => {
      _.alert("提示", error.message);
    });
}

/**
 * 查询网点规划列表信息
 * @param {*} params
 */
export function searchPlanList(params) {
  dataBase.loading = true;
  return axios({
    url: _.baseURL + "/portal/serviceNetworkPlan/searchPlanList.do",
    data: params,
    method: "POST",
    transformRequest: [
      function(data) {
        return Qs.stringify(data, { indices: false });
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(result => {
      if (result.code !== "0") {
        throw new Error(result.desc);
      }
      return result.data;
    })
    .catch(error => {
      _.alert("提示", error.message);
    }).finally(()=>{
      dataBase.loading = false;
    })
}
// {headers:{'Content-Type': 'multipart/form-data'}}
const axiosInstance = axios.create();
/**
 * 导入网点规划信息
 * @param {*} data
 */
export function importServiceNetworkPlan(forms) {
  dataBase.loading = true;
  return axiosInstance
    .post(
      _.baseURL + "/portal/serviceNetworkPlan/importServiceNetworkPlan.do",
      forms,
    )
    .then(result => {
      if (result.data.code !== "0") {
        throw new Error(result.data.desc);
      }
      return result.data.data;
    })
    .catch(error => {
      _.alert("提示", error.message);
    }).finally(()=>{
      dataBase.loading = false;
    })
}

/**
 * 导出网点规划信息
 * @param {*} data
 */
export function exportServiceNetworkPlan(data) {
  const queryString = Qs.stringify(data);
  window.open(_.baseURL + "/portal/serviceNetworkPlan/exportServiceNetworkPlan.do?"+ queryString);
}

/**
 * 新增网点规划信息
 * @param {*} data
 */
export function addOrUpdateServiceNetworkPlan(params) {
  dataBase.loading = true;
  return axios
    .get(
      _.baseURL + "/portal/serviceNetworkPlan/addOrUpdateServiceNetworkPlan.do",
      { params }
    )
    .then(result => {
      if (result.code !== "0") {
        throw new Error(result.desc);
      }
      return result.data;
    })
    .catch(error => {
      _.alert("提示", error.message);
    }).finally(()=>{
      dataBase.loading = false;
    })
}

/**
 * 查询网点规划网点明细列表信息
 * @param {*} data
 */
export function searchPlanPointList(params) {
  dataBase.loading = true;
  return axios
    .get(_.baseURL + "/portal/serviceNetworkPlan/searchPlanPointList.do", {
      params
    })
    .then(result => {
      if (result.code !== "0") {
        throw new Error(result.desc);
      }
      return result.data;
    })
    .catch(error => {
      _.alert("提示", error.message);
    }).finally(()=>{
      dataBase.loading = false;
    })
}

/**
 * 查询网点规划网点明细列表信息
 * @param {*} data
 */
export function searchPointMapList(params) {
  dataBase.loading = true;
  return axios
    .get(_.baseURL + "/portal/serviceNetworkPlan/searchPointMapList.do", {
      params
    })
    .then(result => {
      if (result.code !== "0") {
        throw new Error(result.desc);
      }
      return result.data;
    })
    .catch(error => {
      _.alert("提示", error.message);
    }).finally(()=>{
      dataBase.loading = false;
    })
}

export function translate(params) {
  return axios
    .get("https://apis.map.qq.com/ws/coord/v1/translate", { params })
    .then(result => {
      if (result.status !== 0) {
        throw new Error(data.message);
      }
      return result.locations;
    })
    .catch(error => {
      _.alert("提示", error.message);
    });
}




export function checkReport(params) {
  return axios
    .post(_.baseURL + "/report/reportAction!checkReport.action", params, { "Content-Type": "application/json"})
    .then(result => {
      if (result.code !== "0") {
        throw new Error(data.desc);
      }
      return result.data;
    })
    .catch(error => {
      _.alert("提示", error.message);
    }).finally(()=>{
      dataBase.loading = false;
    })
}

export function createReportTask(params){
  return axios
    .post(_.baseURL + "/report/reportAction!createReportTask.action", params, { "Content-Type": "application/json"})
    .then(result => {
      if (result.code !== "0") {
        throw new Error(data.desc);
      }
      return result.data;
    })
    .catch(error => {
      _.alert("提示", error.message);
    }).finally(()=>{
      dataBase.loading = false;
    })
  
}


export function searchDepatmentList(params){
  return axios
    .post(_.baseURL + "/dealer/dealerAction!searchDepatmentList.action", params, { "Content-Type": "application/json"})
    .then(result => {
      if (result.code !== "0") {
        throw new Error(data.desc);
      }
      return result.data;
    })
    .catch(error => {
      _.alert("提示", error.message);
    }).finally(()=>{
      dataBase.loading = false;
    })
}

export function getAreaListByProvinceNameAndCityName(params){
  return axios
  .get(_.baseURL + "/portal/serviceNetworkPlan/getAreaListByProvinceNameAndCityName.do", {
    params
  })
  .then(result => {
    if (result.code !== "0") {
      
      throw new Error(data.desc);
    }
    return result.data;
  })
  .catch(error => {
    _.alert("提示", error.message);
  })
}

export function searchCoverList(params) {
  dataBase.loading = true;
  return axios({
    url: _.baseURL + "/portal/serviceNetworkPlan/searchCoverArea.do",
    data: params,
    method: "POST",
    transformRequest: [
      function(data) {
        return Qs.stringify(data, { indices: false });
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
    .then(result => {
      if (result.code !== "0") {
        throw new Error(result.desc);
      }
      return result.data;
    })
    .catch(error => {
      _.alert("提示", error.message);
    }).finally(()=>{
      dataBase.loading = false;
    })
}
