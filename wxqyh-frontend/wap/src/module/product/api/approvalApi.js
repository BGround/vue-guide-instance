import axios from 'axios'
const BASE_URL = _.baseURL;

// http://localhost:8080/wxqyh



//?belongAgent=survey
/**
 * 应用端-动态审核各状态数量
 * @param params
 * @return
 */
export function geTproductReviewerCount(params){
    _.showLoading('');
    return axios
        .get(BASE_URL + '/portal/product/productReviewerAction!infoNum.action', { params })
        .then(data => {
            if (data.code !== '0') {
                throw new Error(data.desc)
            }
            return data.data
        })
        .catch(error => {
            _.alert('提示', error.message);
        }).finally(()=>{
            _.hideLoading('');
        })
}

/**
 * 调查问卷--我的审核数列表
 * @param params
 * @return {Promise<unknown>|Promise<{currPage: number, totalRows: number, pageData: [{joinNum: string, title: string, type: string, orgId: string, isJoin: string, userIds: string, statusName: null, isEndTimeOut: string, startTime: null, id: string, deptIds: null, lastEditTime: string, ext2: string, ext1: string, summary: string, answerType: string, createPerson: string, permission: string, userName: null, headPic: null, personName: string, isSurveyUser: string, isOpen: string, answer: null, createTime: string, lastEditor: null, questionNum: string, isCreateUser: string, belongAgent: string, endTime: string, status: string}], maxPage: number}>}
 */
export function ajaxAuditQuestionnairePager(params){
    _.showLoading('');
    return axios
        .get(BASE_URL + '/portal/questionnairCtl/ajaxAuditQuestionnairePager.do', { params })
        .then(data => {
            if (data.code !== '0') {
                throw new Error(data.desc)
            }
            return data.data
        })
        .catch(error => {
            _.alert('提示', error.message);
        }).finally(()=>{
            _.hideLoading('');
        })
}



//--------------------
/**
 * 调查问卷--我的审核数量统计接口
 * @param params
 * @return {Promise<unknown>|Promise<{notPassReview: number, passReview: number, waitReview: number}>}
 */
export function todoNum(data){
    _.showLoading('');
    return axios
        .post(BASE_URL + '/portal/product/productReviewerAction!todoNum.action', data )
        .then(data => {
            if (data.code !== '0') {
                throw new Error(data.desc)
            }
            return data.data
        })
        .catch(error => {
            _.alert('提示', error.message);
        }).finally(()=>{
            _.hideLoading('');
        })
}


/**
 * 应用端-动态审核分页数据
 * @param params
 * @return
 */
export function getProductReviewerPager(data){
    _.showLoading('');
    return axios
        .post(BASE_URL + '/portal/product/productReviewerAction!pager.action', data )
        .then(data => {
            if (data.code !== '0') {
                throw new Error(data.desc)
            }
            return data.data
        })
        .catch(error => {
            _.alert('提示', error.message);
        }).finally(()=>{
            _.hideLoading('');
        })
}




/**
 * 应用端-动态审核分页数据
 * @param params
 * @return
 */
export function notPass(data){
    _.showLoading('');
    return axios
        .post(BASE_URL + '/portal/product/productReviewerAction!notPass.action', data )
        .then(data => {
            if (data.code !== '0') {
                throw new Error(data.desc)
            }
            return data.data
        })
        .catch(error => {
            _.alert('提示', error.message);
        }).finally(()=>{
            _.hideLoading('');
        })
}

/**
 * 应用端-动态审核分页数据
 * @param params
 * @return
 */
export function pass(data){
    _.showLoading('');
    return axios
        .post(BASE_URL + '/portal/product/productReviewerAction!pass.action', data )
        .then(data => {
            if (data.code !== '0') {
                throw new Error(data.desc)
            }
            return data.data
        })
        .catch(error => {
            _.alert('提示', error.message);
        }).finally(()=>{
            _.hideLoading('');
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
        agent: 'productinfo'
    }
    return axios
        .get(BASE_URL+'/portal/imageupload/imageUploadAction!doSendFileToMe.action', {
            params,
        })
}



/**
 * 上传附件
 * @param data
 * @return {Promise<unknown>}
 */
export function uploadFile(data){
    const t = Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0,
    });
    return  instance({
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
            if(result && result.data && result.data.mediaInfo){
                Object.assign(result.data.mediaInfo, {
                    mediaOutTime: null,
                    sort: null
                })
            }
            return result.data;
        } else{
            throw new Error(result.desc);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
        console.error(error);
    }).finally(()=>{
        t.clear()
    })
}


/**
 * 上传Base64附件
 * @param data
 * @return {Promise<unknown>}
 */
export function uploadImageBase64(base64){
    const data ={
        imgFileBase: base64,
        agent: dataBase.wxqyh_uploadfile.agent,
        isOpen: window.location.href.indexOf("/open/")!=-1,
        orderId:'',
    }
    const t = Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0,
    });
    return  axios({
        method: 'POST',
        baseURL: _.baseURL,
        url: '/portal/imageupload/imageUploadAction!doUploadImageBase64.action',
        data: data,
    }).then( (result) => {
        if (result.code === "0"){
            if(result && result.data && result.data.mediaInfo){
                Object.assign(result.data.mediaInfo, {
                    mediaOutTime: null,
                    sort: null,
                    createTime: null,
                })
            }
            return result.data;
        } else{
            throw new Error(result.desc);
        }
    }).catch((error) => {
        _.alert("提示",error.message);
        console.error(error);
    }).finally(()=>{
        t.clear()
    })
}
