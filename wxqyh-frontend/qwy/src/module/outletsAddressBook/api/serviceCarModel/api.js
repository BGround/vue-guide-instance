import axios from "axios";



    /**
     * 查询 1.服务车型列表
     * @param
     * @return {Promise<unknown>}
     */
    export function ajaxSearchServiceModels(params){
        dataBase.loading = true;
        return axios({
            baseURL: _.baseURL,
            method: 'get',
            url: '/mgr/serviceModels/serviceModelsAction!ajaxSearch.action',
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
 * 2.服务车型新增:
 * @param
 * @return {Promise<unknown>}
 */
export function ajaxAddServiceModels(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'get',
        url: '/mgr/serviceModels/serviceModelsAction!ajaxAdd.action',
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
        url: '/mgr/serviceModels/serviceModelsAction!ajaxView.action',
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
 * 4.服务车型修改
 * @param
 * @return {Promise<unknown>}
 */
export function ajaxUpdateServiceModels(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'get',
        url: '/mgr/serviceModels/serviceModelsAction!ajaxUpdate.action',
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
export function ajaxBatchDeleteServiceModels(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/serviceModels/serviceModelsAction!ajaxBatchDelete.action',
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
