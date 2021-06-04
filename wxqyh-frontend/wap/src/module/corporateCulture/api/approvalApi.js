import axios from 'axios'
const BASE_URL = _.baseURL;

// http://localhost:8080/wxqyh



//?belongAgent=survey
/**
 * 调查问卷--我的审核数量统计接口
 * @param params
 * @return {Promise<unknown>|Promise<{notPassReview: number, passReview: number, waitReview: number}>}
 */
export function getQuestionnairAuditCount(params){
    _.showLoading('');
    return axios
        .get(BASE_URL + '/portal/questionnairCtl/getQuestionnaireAuditCount.do', { params })
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


/**
 * 调查问卷--我的审核数列表
 * @param params
 * @return {Promise<unknown>|Promise<{currPage: number, totalRows: number, pageData: [{joinNum: string, title: string, type: string, orgId: string, isJoin: string, userIds: string, statusName: null, isEndTimeOut: string, startTime: null, id: string, deptIds: null, lastEditTime: string, ext2: string, ext1: string, summary: string, answerType: string, createPerson: string, permission: string, userName: null, headPic: null, personName: string, isSurveyUser: string, isOpen: string, answer: null, createTime: string, lastEditor: null, questionNum: string, isCreateUser: string, belongAgent: string, endTime: string, status: string}], maxPage: number}>}
 */
export function getQuestionnaireDetail(params){
    _.showLoading('');
    return axios
        .get(BASE_URL + '/portal/questionnairCtl/getQuestionnaireDetail.do', { params })
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
 * 调查问卷--我的审核数列表--详情--审核操作
 * @param params
 * @return
 * */
export function auditQuestionnaire(data){
    _.showLoading('');
    return axios
        .post(BASE_URL + '/portal/questionnairCtl/auditQuestionnaire.do', data)
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
