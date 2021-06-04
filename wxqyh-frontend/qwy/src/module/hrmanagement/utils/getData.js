import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config';
import { SUCCESS_CODE } from './config'

let getData =  function getData(url) {
    return (data, cb) => {
        axios.post(baseURL + url, { ...data })
        .then(result => {
            if(!result) return;
            if(result.code == SUCCESS_CODE) {
                cb && cb(result.data);
            }else {
                if(cb) {
                    cb(result.desc);
                }else {
                    dataBase.alert('提示', result.desc);
                }
            }
        })
    }
}

let getDataSecond = function getDataSecond(url) {
    return (data, cb) => {
        axios.post(baseURL + url, { ...data })
        .then(result => {
            if(!result) return;
            cb(result);
        })
    }
}
export {
    getData, getDataSecond
}




