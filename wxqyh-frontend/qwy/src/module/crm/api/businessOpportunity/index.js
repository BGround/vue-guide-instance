import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config';

// 获取 详情 - 竞争商机 - 列表
export const getCompetitorChanceList = (obj) => {
    return axios({
        url: `${baseURL}/crm/competitor/getCompetitorBusinessList.do`,
        method: 'POST',
        dataType: 'json',
        data: obj
    });
}

// 获取 详情 - 竞争商机 - 列表 - 详情
export const detailCompetitorChance = (obj) => {
    return axios({
        url: `${baseURL}/businessAction/businessAction!ajaxView.action`,
        method: 'POST',
        dataType: 'json',
        data: obj
    });
}
 