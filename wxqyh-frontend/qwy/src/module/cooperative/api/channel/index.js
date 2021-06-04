import axios from "axios";



/**
 * 列表查询
 * @param
 * @return {Promise<unknown>}
 */
export function ajaxSearch(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'get',
        url: '/dealer/dealerAction!ajaxSearchFileBag.action',
        params: params,
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.desc)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}


/**
 * 2.新增:
 * @param
 * @return {Promise<unknown>}
 */
export function ajaxAdd(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'get',
        url: '/dealer/dealerAction!ajaxAddFileBag.action',
        params: params,
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.desc)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}



/**
 * 3.服务车型---详情
 * @param
 * @return {Promise<unknown>}
 */
export function ajaxViewServiceModels(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'get',
        url: '/dealer/dealerAction!ajaxUpdateFileBag.action',
        params: params,
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.msg)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}



/**
 * 修改
 * @param
 * @return {Promise<unknown>}
 */
export function ajaxUpdate(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'get',
        url: '/dealer/dealerAction!ajaxUpdateFileBag.action',
        params: params,
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.desc)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}




/**
 * 5.服务车型删除
 * @param
 * @return {Promise<unknown>}
 */
export function ajaxBatchDelete(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/dealer/dealerAction!ajaxBatchDeleteFileBag.action',
        data: data,
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.msg)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}


/**
 * 查询
 * @param
 * @return {Promise<unknown>}
 */
export function getAllDealerFullNameList(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'get',
        url: '/mgr/fundingstatus/fundingStatusAction!getAllDealerFullNameList.action',
        params: params,
    }).then(function(result) {
        if (String(result.code) === '0') {
            return result.data;
        } else {
            _.alert('提示', result.msg)
        }
    }).finally(()=>{
        dataBase.loading = false
    })
}
