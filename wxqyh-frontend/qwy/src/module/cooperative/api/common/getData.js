import axios from 'axios';

function commonPost(url,params,callback){
  dataBase.loading=true;
  axios.post(_.baseURL+url,params).then(function (result) {
    dataBase.loading=false;
    if (result.code == '0'){
      callback(result.data);
    }else {
      _.alert('提示',result.desc);
    }
  });
}

export function ajaxSearchMenuList(callback){
  commonPost('/menu/menuAction!ajaxSearchMenuList.action',{
    menuAssortment: 'content',
  },callback);
}




/**
 * PC端-导入excel
 * @param data
 * @return {Promise<unknown>}
 */
export function batchImportExles(data){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/fileUploadMgr/fileUploadMgrAction!batchImportExles.action',
        data: data,
        transformRequest: [
            function(data) {
                const formData = new FormData();
                Object.keys(data).forEach((key)=>{
                    formData.append(key, data[key]);
                })
                return formData;
            }
        ],
        headers: {
            'Content-Type': 'multipart/form-data'
        }
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
 * PC端-查询处理结果
 * @param data
 * @return {Promise<unknown>}
 */
export function viewImportProcess(params){
    dataBase.loading = true;
    return axios({
        baseURL: _.baseURL,
        method: 'post',
        url: '/mgr/fileUploadMgr/fileUploadMgrAction!viewImportProcess.action',
        // /serviceModels/fileUploadMgr/fileUploadMgrAction!viewImportProcess.action
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
