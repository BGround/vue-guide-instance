import axios from 'axios'

function commonPost(url,params,callback,showLoading=true, errorCallback){
    if(showLoading){
        _.showLoading('');
    }    
    axios.post(_.baseURL+url,params).then(function (result) {
      _.hideLoading('');
      if (result.code == '0'){
        callback(result.data);
      }else {
          if(errorCallback){
            errorCallback(result);
          } else {
            _.alert('提示',result.desc);
          }        
      }
    });
  }

  function commonGet(url,params,callback,showLoading=true, errorCallback){
    if(showLoading){
        _.showLoading('');
    }    
    axios.get(_.baseURL+url,params).then(function (result) {
      _.hideLoading('');
      if (result.code == '0'){
        callback(result.data);
      }else {
          if(errorCallback){
            errorCallback(result);
          } else {
            _.alert('提示',result.desc);
          }        
      }
    });
  }
/*列表页面*/
 // 获取主列表
export function getProductList(type,params,cb) {
    commonPost('/portal/product/productAction!ajaxSearch.action?type='+type,params,cb,false)
}
// 判断是否开启了一键阅读
export function getReadState(params,cb){
    commonPost('/portal/product/productAction!ajaxViewBatchReadState.action',params,cb, false)
}
// 一键阅读
export function batchRead(params, cb){
    commonPost('/portal/product/productAction!batchRead.action',params,cb);
}
//判断是否显示前往后台弹窗
export function guideDialog(params, cb){
    commonPost('/portal/managesetting!ajaxIsRemindUser.action',params, cb, false)
}
// 关闭提示
export function closeGuideDialog(params, cb){
    commonPost('/portal/managesetting!ajaxUpdateRemindUser.action',params, cb, false)
}
// 获取类别
export function getProTypeList(params,cb) {
    commonPost('/portal/product/productAction!ajaxSearchProType.action', params, cb);
}
// 类别列表知识百科下一页
export function getProNextList(params, cb){
    commonPost('/portal/product/productAction!ajaxSearchProductByType.action',params, cb, false);
}

/*详情页面*/
// 知识百科详情
export function getProDetail(isOpen,params, cb,errorCb){
    let url = isOpen ? '/open/productXyhOpenCtl/getProductById.do ':'/portal/product/productAction!ajaxView.action'; 
    commonPost(url, params,cb, true, errorCb);
}
// 上下篇
export function getNextProduct(params,cb){
    commonPost('/portal/product/productAction!getNextProduct.action',params,cb);
}
//  点赞
export function setPraise(params, cb){
    commonGet('/portal/product/productAction!setPraise.action',{params: params}, cb, false);
}
// 删除评论
export function delComment(params,cb){
    commonPost('/portal/product/productAction!deleteComment.action',params, cb);
}
// 添加评论
export function addComment(params, cb){
    commonPost('/portal/product/productAction!addProductComment.action',params, cb)
}
//评论列表
export function getCommentList(isOpen,params,cb){
    let url = isOpen ? '/open/productXyhOpenCtl/getProductCommentPager.do' : '/portal/product/productAction!getProductCommentPager.action';
    commonPost(url,params,cb, false);
}
// 阅读列表
export function getReadList(id,params,cb){
    commonPost('/portal/product/productAction!getProductReadPager.action?id='+id, params, cb, false);
}
// 点赞列表
export function getPraiseList(id,params,cb){
    commonPost('/portal/product/productAction!getProductPraisePager.action?id='+id, params, cb, false);
}
// 案例列表
export function getCaseList(isOpen,params,cb){
    let url = isOpen ? '/open/productXyhOpenCtl/getProductCasePager.do' : '/portal/product/productAction!getProductCasePager.action';
    commonPost(url, params, cb, false);
}

// 案例详情
export function getCaseDetail(isOpen,params,cb){
    let url = isOpen ? '/open/productXyhOpenCtl/getProductProductcase.do' : '/portal/product/productAction!getProductProductcase.action';
    commonPost(url, params, cb);
}