import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config'

// 保存应用模式的设置
export function saveModel(data) {
    return axios({
        url: baseURL + '/qyservice/qyserviceMgrCtl/editSingleModeAgentCode.do',
        method: 'POST',
        data: data,
    })
}

// 获取应用模式的设置
export function getModelConfig() {
    return axios({
        url: baseURL + '/qyservice/qyserviceMgrCtl/getSingleModeAgentCode.do',
        method: 'POST',
        data: { parentAgentCode: 'meetingassistant' },
    })
}