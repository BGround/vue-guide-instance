import axios from 'axios';
import Qs from 'qs';

/**
 * 星途车型列表:
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxSearchCelebrityModels(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/celebrityModels/celebrityModelsAction!ajaxSearch.action',
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
 * 星途车型新增:
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxAddCelebrityModels(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/celebrityModels/celebrityModelsAction!ajaxAdd.action',
        data: data,
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
 * 经销商与星途车型权限---详情
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxViewDealerCelebrityModel(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/dealerCelebrityModels/dealerCelebrityModelsAction!ajaxView.action',
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
 * 经销商与星途车型权限---详情
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxUpdateCelebrityModel(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/celebrityModels/celebrityModelsAction!ajaxUpdate.action',
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
 * 星途车型删除
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxDeleteCelebrityModels(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/celebrityModels/celebrityModelsAction!ajaxBatchDelete.action',
        data: data,
        transformRequest: [
            function(data) {
                return Qs.stringify(data, { indices: false });
            }
        ],
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
 * 1.1.6.星途车型类型列表（下拉选择框）
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxListCelebrityModels(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/celebrityModels/celebrityModelsAction!ajaxList.action',
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
 * 2.1.1.经销商与星途车型权限---列表
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxSearchDealerCelebrityModels(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/dealerCelebrityModels/dealerCelebrityModelsAction!ajaxSearch.action',
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
 * 2.1.2.经销商与星途车型权限---新增:
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxAddDealerCelebrityModels(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/dealerCelebrityModels/dealerCelebrityModelsAction!ajaxAdd.action',
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
 * 2.1.3.经销商与星途车型权限---详情
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxViewDealerCelebrityModels(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/dealerCelebrityModels/dealerCelebrityModelsAction!ajaxView.action',
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
 * 2.1.4.经销商与星途车型权限---修改
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxUpdateDealerCelebrityModels(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/dealerCelebrityModels/dealerCelebrityModelsAction!ajaxUpdate.action',
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
 * 2.1.5.经销商与星途车型权限--删除
 * @param data
 * @return {Promise<unknown>}
 */
export function ajaxDeleteDealerCelebrityModels(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/dealerCelebrityModels/dealerCelebrityModelsAction!ajaxBatchDelete.action',
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
 * 查询
 * @param
 * @return {Promise<unknown>}
 */
export function searchServiceErp(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'get',
        url: '/pc/serviceAdminPortalAction/searchServiceErp.do',
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

