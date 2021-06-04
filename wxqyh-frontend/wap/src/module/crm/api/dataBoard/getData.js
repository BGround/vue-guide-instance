import axios from 'axios';

// 获取团队列表 所有与我相关的团队
export function getTeamList(params){
    return axios.post(`${_.baseURL}/portal/clientPool/getMyAllTeamList.do`, params)
}

export function getSaleBehavior(data) {
    return axios.post(`${_.baseURL}/portal/business/getSaleBehaviorDetail.do`, data)
}

// 获取数据看板数据
export function getDataBoard(params) {
    return axios.post(`${_.baseURL}/portal/business/searchBusinessDataBoard.do`, params)
}

// 获取是否为团队负责人
export function isTeamCharge() {
    return axios.post(`${_.baseURL}/portal/clientPoolAction!isTeamInCharge.action`)
}

// 获取目标数据
export function getGoalPanel(params) {
    return axios.post(`${_.baseURL}/portal/crm/goal/searchPanelGoal.do`, params)
}

// 获取销售团队
export function getSaleTeam(params) {
    return axios.post(`${_.baseURL}/portal/clientPoolAction!getTeamList.action`, params);
}

// 获取当前用户是否为某团队负责人
export function validTeamMgr(params) {
    return axios.post(`${_.baseURL}/portal/clientPoolAction!validTeamIsMgr.action`, params);
}

// 获取成交客户列表
export function getSuccessClientList(params) {
    return axios.post(`${_.baseURL}/portal/client/searchSuccessClient.do`, params);
}

// 通过团队id获取团队名 http://localhost:8080/wxqyh/portal/clientPool/getTeamNameByTeamId.do?dqdp_csrf_token=af944a79a35673f2
export function getTeamNameByTeamId(params) {
    return axios.post(`${_.baseURL}/portal/clientPool/getTeamNameByTeamId.do`, params);
}

export function getfilter({data,success}) {
    _.showLoading('');

    axios.post(_.baseURL+ '/portal/crm/goal/ajaxGoalTeamInit.do',{...data})
        .then((result) => {
            if (result.code === '0') {
                _.hideLoading('');
                success(result.data)
            }else{
                _.hideLoading('');
                _.alert('提示',result.desc);
            }
        })
}

export function getGoalInfo({data,success}) {
    _.showLoading('');
    axios.post(_.baseURL+ '/portal/crm/goal/ajaxSearchGoalDetail.do',{...data})
        .then((result) => {
            if (result.code === '0') {
                _.hideLoading('');
                success(result.data)
            }else{
                _.hideLoading('');
                _.alert('提示',result.desc);
            }
        })
}

// 获取分配目标详情
export function getGoalDetail(goalId, stage, callback){
    _.showLoading('');
    axios.post(`${_.baseURL}/portal/crm/goal/shareGoalDetail.do`,{
        goalId,
        stage
    }).then(res => {
        _.hideLoading('');
        if(res.code == '0'){
            callback(res.data);
        }
        else{
            _.alert('提示',res.desc);
        }
    })
}

// 获取成员分页列表
export function getMemberList(obj, callback){
    axios.post(`${_.baseURL}/portal/crm/goal/ajaxSearchShare.do`,{
        goalId: obj.goalId,
        stage: obj.stage,
        countType: obj.countType,
        personName: obj.personName || '',
        page: obj.page,
        pageSize: obj.pageSize || 10,
        flag: obj.flag
    }).then(res => {
        if(res.code == '0'){
            callback(res.data);
        }
        else{
            _.alert('提示',res.desc);
        }
    })
}

// 获取成员分页列表 新接口
export function getAllMemberList(obj, callback){
    axios.post(`${_.baseURL}/portal/crm/goal/ajaxSearchAllShare.do`,{
        goalId: obj.goalId,
        stage: obj.stage,
        countType: obj.countType,
        personName: obj.personName || '',
        page: obj.page,
        pageSize: obj.pageSize || 10,
        flag: obj.flag
    }).then(res => {
        if(res.code == '0'){
            callback(res.data);
        }
        else{
            _.alert('提示',res.desc);
        }
    })
}

// 分配成员目标
export function assignGoal(obj, callback){
    axios.post(`${_.baseURL}/portal/crm/goal/shareGoal.do`,{
        goalId: obj.goalId,
        stage: obj.stage,
        dataJson: obj.dataJson,
        batch: obj.batch
    }).then(res => {
        if(res.code == '0'){
            callback(res.data);
        }
        else{
            _.alert('提示',res.desc);
        }
    })
}

// 获取负责的团队列表
export function getGoalTeamList(obj, callback){
    // _.showLoading('');
    axios.post(`${_.baseURL}/portal/clientPoolAction!getTeamList.action`,{...obj})
    .then(res => {
        // _.hideLoading('');
        if(res.code == '0'){
            callback(res.data);
        }
        else{
            _.alert('提示',res.desc);
        }
    })
}

// 获取成员目标
export function getMemberGoal(obj, callback){
    axios.post(`${_.baseURL}/portal/crm/goal/getMemberGoal.do`,{...obj})
    .then(res => {
        if(res.code == '0'){
            callback(res.data);
        }
        else{
            _.alert('提示',res.desc);
        }
    })
}

// 获取销售成交趋势数据
export function searchBusinesCharts(url,data) {
  return axios.post(url, data)
}

// 获取商机字段列表
export function getBasicItem(data) {
  return axios.post(`${_.baseURL}/portal/businessAction!getBasicItem.action`, data)
}

// 客户回收信息
export function getClientRecycle(parmas) {
    return axios.post(`${_.baseURL}/portal/clientPoolAction!ajaxSearchRecycle.action`, parmas)
}