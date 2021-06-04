import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config';

// 获取销售团队
export const getTeamList = () => {
    return axios({
        url: `${baseURL}/crm/manageObjectSetUp/getTeamList.do`,
        method: 'GET',
        dataType: 'json'
    });
}

// 搜索目标数据
export const searchGoal = (obj) => {
    return axios({
        url: `${baseURL}/crm/goal/ajaxSearch.do`,
        method: 'POST',
        dataType: 'json',
        data: obj
    });
}

// 新增目标
export const addGoal = (obj) => {
    return axios({
        url: `${baseURL}/crm/goal/ajaxAdd.do`,
        method: 'POST',
        dataType: 'json',
        data: obj
    });
}

// 获取目标详情
export const getGoalDetail = (id) => {
    return axios({
        url: `${baseURL}/crm/goal/getGoalDetail.do`,
        method: 'POST',
        dataType: 'json',
        data: {id}
    });
}

// 编辑目标
export const editGoal = (obj) => {
    return axios({
        url: `${baseURL}/crm/goal/ajaxUpdate.do`,
        method: 'POST',
        dataType: 'json',
        data: obj
    });
}

// 删除目标
export const delGoal = (obj) => {
    return axios({
        url: `${baseURL}/crm/goal/delete.do`,
        method: 'POST',
        dataType: 'json',
        data: obj
    });
}