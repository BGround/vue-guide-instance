import axios from 'axios';

//获取商机详情
export const getBusinessDetail = obj => {
    return axios({
      url: `${_.baseURL}/businessAction/businessAction!ajaxView.action`,
      method: "POST",
      dataType: "json",
      data: obj
    });
};

//获取商机详情列表
export const getDetailList = obj => {
  return axios({
    url: `${_.baseURL}/client/clientAction!seachClientBusinessList.action`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};