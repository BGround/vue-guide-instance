import axios from 'axios';

function commonPost(url,params,callback,status){
  dataBase.loading=true;
  axios.post(_.baseURL+url,params).then(function (result) {
    dataBase.loading=false;
    if (status){
      callback(result);
    }else {
      if (result.code == '0'){
        callback(result.data);
      }else {
        dataBase.top_alert(result.desc,false,3000);
      }
    }

  });
}

function commonGet(url,params,callback){
  dataBase.loading=true;
  axios.get(_.baseURL+url,params).then(function (result) {
    dataBase.loading=false;
    if (result.code == '0'){
      callback(result.data);
    }else {
      dataBase.top_alert(result.desc,false,3000);
    }
  });
}

/* 知识百科列表页 */

// 获取知识百科列表
export function searchProductList(params,cb) {
  commonPost('/productmanage/productmanageAction!ajaxPageSearch.action',params,cb)
}

// 获取授权人员列表
export function getAuthorizePeople(params,cb) {
  commonPost('/licensing/licensingAction!searchLicensingInfo.action',params,cb)
}

// 添加授权人员
export function addAuthorize(params,cb) {
  commonPost('/licensing/licensingAction!ajaxAdd.action',params,cb)
}

// 获取多个知识百科授权人员
export function getMoreAuthorize(cb) {
  commonPost('/licensing/licensingAction!searchMoreLicensingInfo.action',{},cb)
}

// 获取知识百科类别列表
export function getProductType(params,cb) {
  commonPost('/product/productMgrCtl/findProductTypeList.do',params,cb)
}

// 新增知识百科
export function addProduct(params,cb) {
  commonPost('/product/productMgrCtl/addNewProduct.do',params,cb)
}

// 保存草稿
export function saveProductDraft(params,cb) {
  commonPost('/product/productMgrCtl/saveProductDraft.do',params,cb)
}

// 获取知识百科详情
export function viewProductDetail(params,cb) {
  commonPost('/productmanage/productmanageAction!ajaxView.action',params,cb)
}

// 更新知识百科
export function updateProduct(params,cb) {
  commonPost('/product/productMgrCtl/updateProductSend.do',params,cb)
}

// 启用、禁用知识百科
export function updateProductStatus(params,cb) {
  commonPost('/productmanage/productmanageAction!disableProduct.action',params,cb)
}

// 删除知识百科
export function deleteProduct(params,cb) {
  commonPost('/productmanage/productmanageAction!batchDeleteProductPO.action',params,cb)
}

// 获取一键已阅功能按钮开关
export function viewBatchRead(params,cb) {
  commonPost('/productmanage/productmanageAction!ajaxViewBatchReadState.action',params,cb)
}

// 修改一键已阅功能按钮开关
export function updateBatchRead(params,cb) {
  commonPost('/productmanage/productmanageAction!setBatchReadState.action',params,cb)
}

// 查看已阅
export function viewReadCount(params,cb) {
  commonPost('/productmanage/productmanageAction!getProductReadPager.action',params,cb)
}

// 查看未阅
export function viewUnReadCount(params,cb) {
  commonPost('/productmanage/productmanageAction!getProductUnReadPager.action',params,cb,true)
}

// 提醒通知
export function sendRemind(params,cb) {
  commonPost('/productmanage/productmanageAction!sendMsgToUnRead.action',params,cb)
}

// 查询案例
export function searchCase(params,cb) {
  commonPost('/productmanage/productmanageAction!ajaxPageCaseSearch.action',params,cb)
}

// 删除案例
export function deleteCase(params,cb) {
  commonPost('/productmanage/productmanageAction!batchDeleteProductCasePO.action',params,cb)
}

// 新增案例
export function addProductCase(params,cb) {
  commonPost('/product/productMgrCtl/addtbXyhProductCasePO.do',params,cb)
}

// 查看案例详情
export function viewProductCase(params,cb) {
  commonPost('/productmanage/productmanageAction!ajaxProductCaseView.action',params,cb)
}

// 编辑案例
export function updateProductCase(params,cb) {
  commonPost('/product/productMgrCtl/updateTbXyhProductCasePO.do',params,cb)
}

// 查看类别详情
export function viewTypeDetail(params,cb) {
  commonPost('/productmanage/producttypeAction!ajaxView.action',params,cb)
}

// 保存类别
export function saveProductType(params,cb) {
  commonPost('/productmanage/producttypeAction!ajaxAdd.action',params,cb)
}

// 删除类别
export function deleteProductType(params,cb) {
  commonPost('/productmanage/producttypeAction!ajaxBatchDelete.action',params,cb)
}

// 已读经销商
export function searchGroupReadPager(params,callback) {
  commonGet('/productmanage/productmanageAction!searchGroupReadPager.action',{
    params: params
  },callback);
}
