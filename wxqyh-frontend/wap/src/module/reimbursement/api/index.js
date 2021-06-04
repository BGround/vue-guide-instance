import { RESULT_OK } from './config';
import axios from 'axios';

const api = {
  get(url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, { params }).then((res) => {
        if (res.code == RESULT_OK) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    }).catch(err => {
      return Promise.reject(err);
    })
  },
  post(url, data = {}, config) {
    return new Promise((resolve, reject) => {
      axios.post(url, data, config).then((res) => {
        if (res.code == RESULT_OK) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    }).catch(err => {
      return Promise.reject(err);
    })
  }
}

export default api;