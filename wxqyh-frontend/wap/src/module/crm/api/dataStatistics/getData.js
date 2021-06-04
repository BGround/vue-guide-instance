import axios from 'axios';

// 获取合同回款详情
export function getContractRepayDetail(boardSearchData, callBack) {
  _.showLoading('')
  axios.post(_.baseURL + '/portal/receive/searchContractRepayDetail.do', {
    ...boardSearchData
  }).then((result) => {
    if (result.code == '0') {
      _.hideLoading('')
      callBack(result.data)
    } else {
      _.hideLoading('');
      _.alert('提示', result.desc)
    }
  })
}

// 获取销售团队
export function getSaleTeam(params) {
  return axios.post(`${_.baseURL}/portal/clientPoolAction!getTeamList.action`, params);
}

//获取回款合同列表
export function getReceiveContract(params) {
  return axios.post(`${_.baseURL}/portal/receive/searchContractReceiveDetail.do`, params)
}
