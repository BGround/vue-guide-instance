import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config';

// 管理后台登录或个人网页登录
export const toLogin = (obj) => {
    return axios({
        url: `${baseURL}/wxqyhLoginApiCtl/checkUserByTips.do`,
        method: 'POST',
        dataType: 'json',
        data: obj
    });
}

// 获取preCode和dqdp_csrf_token
export const getWxqyhConfig = (obj) => {
    return axios({
        url: `${baseURL}/wxqyhLoginApiCtl/wxqyhConfig.do`,
        method: 'POST',
        dataType: 'json',
        data: obj
    });
}
