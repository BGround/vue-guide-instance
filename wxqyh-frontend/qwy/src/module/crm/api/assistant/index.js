import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config';

// 获取官网链接
export const getOfficialWebsite = () => {
  return axios({
    url: `${baseURL}/crm/wxApp/getOfficialWebsite.do`,
    method: 'POST',
    dataType: 'json'
  });
}

// 修改官网链接
export const setUpWebsite = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/setUpOfficialWebsite.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}


// 获取产品列表数据
export const searchProductList = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/searchProductList.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

// 删除产品
export const deleteProduct = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/deleteProduct.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

// 查看产品详情
export const getProductDetail = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/getProductDetail.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

// 编辑产品详情  /crm/wxApp/updateProduct.do
export const updateProduct = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/updateProduct.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

// 新增产品详情  /crm/wxApp/addProduct.do
export const addProduct = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/addProduct.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

// 查询授权人员列表 POST /crm/wxApp/getAuthorizer.do
export const getAuthorizer = () => {
  return axios({
    url: `${baseURL}/crm/wxApp/getAuthorizer.do`,
    method: 'POST',
    dataType: 'json'
  });
}

// 更新授权人员列表 /crm/wxApp/updateAuthorizer.do
export const updateAuthorizer = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/updateAuthorizer.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 查询官网模板 /crm/wxApp/getHomeBuildDetail.do
export const getHomeBuildDetail = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/getHomeBuildDetail.do`,
    method: 'get',
    dataType: 'json',
  });
}

// 保存官网模板 /crm/wxApp/saveHomeTemplate.do
export const saveHomeTemplate = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/saveHomeTemplate.do`,
    method: 'post',
    dataType: 'json',
    data: obj
  });
}
//有无官网 /crm/wxApp/getWxAppEntrance.do
export const getWxAppEntrance = () => {
  return axios({
    url: `${baseURL}/crm/wxApp/getWxAppEntrance.do`,
    method: 'get',
  });
}


//获取小程序菜单
export function getSmallProgramTab(callBack) {
  axios.post(baseURL + '/crm/wxApp/searchTabBarSetting.do').then((result) => {
    if (result.code == '0') {
      callBack(result.data)
    } else {
      dataBase.alert('提示',result.desc);
    }
  })
}

//更新小程序菜单
export function updateSmallProgramTab(data, callBack) {
  axios.post(baseURL + '/crm/wxApp/updateTabBarSetting.do', { ...data
  }).then((result) => {
    if (result.code == '0') {
      callBack(result.data)
    } else {
      dataBase.alert('提示',result.desc);
    }
  })
}

// 获取小程序编辑名片职位权限
export function getSmallProgrameEditPosition(data, callBack) {
  axios.post(baseURL + '/intercalate/intercalateAction!getPhotoSetting.action', { ...data
  }).then((result) => {
    if (result.code == '0') {
      callBack(result.data)
    } else {
      dataBase.top_alert(result.desc, false, 3000);
    }
  })
}

// 更改小程序编辑名片职位权限
export function changeSmallProgrameEditPosition(data, callBack) {
  axios.post(baseURL + '/intercalate/intercalateAction!savePhotoSetting.action', { ...data
  }).then((result) => {
    if (result.code == '0') {
      callBack(result.data)
    } else {
      dataBase.top_alert(result.desc, false, 3000);
    }
  })
}
//判断视频上传的服务商 1代表腾讯云服务，2代表阿里云服务
export const getVodServe = () => {
  return axios({
    url: `${baseURL}/qVod/qVodUpload/qVodUploadAction!getVodServe.action`,
    method: 'post',
    dataType: 'json',
  });
}

//腾讯视频上传
export const videoUpLoad = (obj) => {
  return axios({
    url: `${baseURL}/qVod/qVodUpload/qVodUploadAction!qUploadReady.action`,
    method: 'post',
    dataType: 'json',
    data: obj
  });
}

//获取腾讯云签名
export const getTencentSign = (obj) => {
  return axios({
    url: `${baseURL}/qcloudVod/getSign.do`,
    method: 'post',
    dataType: 'json',
    data: obj
  });
}

//视频转码是否成功
export const checkMediaState = (obj) => {
  return axios({
    url: `${baseURL}/alicloudupload/aliCloudUploadAction!checkMediaState.action`,
    method: 'post',
    dataType: 'json',
    data: obj
  });
}

//更新已上传的流量
export const uploadDataRecord = (obj) => {
  return axios({
    url: `${baseURL}/alicloudupload/aliCloudUploadAction!uploadDataRecord.action`,
    method: 'post',
    dataType: 'json',
    data: obj
  });
}

// 查询产品分类列表
export const getProductCategory = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/getProductCategoryList.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 新建产品分类
export const createProductCategory = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/addProductCategory.do`,
    method: 'post',
    dataType: 'json',
    data: obj
  });
}

// 编辑产品分类
export const renameProductCategory = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/updateCategoryName.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 删除产品分类
export const deleteProductCategory = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/deleteProductCategory.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 更改产品排序号
export const changeProductSort = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/updateProductSortNum.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 移动产品分类
export const moveProductCategory = (obj) => {
  return axios({
    url: `${baseURL}/crm/wxApp/moveProductCategory.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}


