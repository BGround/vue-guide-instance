import axios from 'axios';

/**
 * 获取客户列表
 * @param {*} data
 *  {
        page: 1,
        pageSize: 10,
        ["searchValue.title"]: "" //搜索字段
      }
 */
export const getClientList = data => {
  return axios({
    url: `${_.baseURL}/client/clientAction!ajaxSearch.action`,
    method: "POST",
    dataType: "json",
    data
  });
};
