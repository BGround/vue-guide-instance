import axios from 'axios';
import { RESULT_OK } from './config';

const GET_ELECTRONIC = `${_.baseURL}/portal/fapiaoAction!downLoadFaPiaoInfo.action`;


// 下载电子发票
export const getElectronic = ({code,cardId,type,wxqyh_terrace_type}) => {
  return axios.post(GET_ELECTRONIC,{code,cardId,type,wxqyh_terrace_type}).then((res) => {
    if (res.code == RESULT_OK) {
      return Promise.resolve(res);
    } else {
      return Promise.reject(res);
    }
  });
};