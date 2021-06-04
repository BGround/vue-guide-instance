import axios from 'axios'
import { Toast } from 'quickwork-ui'
const BASE_URL = `${_.baseURL}`

export function searchPositionList(params){
    return axios
        .get(BASE_URL + '/portal/dealerCensusoPortalCtl/searchPositionList.do', { params })
        .then(data => {
            if (data.code !== '0') {
                throw new Error(data.desc)
            }
            return data.data
        })
        .catch(error => {
            Toast({
                type: 'info',
                duration: 1500,
                content: error.message
            })
        })
}
