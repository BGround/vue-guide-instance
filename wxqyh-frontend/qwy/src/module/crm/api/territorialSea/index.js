import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config';

// 获取回收站客户列表
export const getRecycleList = (obj) => {
  return axios({
    url: `${baseURL}/clientPool/ajaxSearch.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

//恢复客户
export const recoverClient = (obj) => {
  return axios({
    url: `${baseURL}/clientPool/recoverClient.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

//删除客户
export const deleteClient = (obj) => {
  return axios({
    url: `${baseURL}/clientPool/ajaxBatchDelete.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

//获取公海池列表
export const getPoolList = (obj) => {
  return axios({
    url: `${baseURL}/clientPool/getMyMgrClientPoolList.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}


//获取新增公海客户字段
export const getClientItem = () => {
  return axios({
    url: `${baseURL}/client/getClientItem.do`,
    method: 'POST',
    dataType: 'json',
    data: '',
  });
}

//新增公海客户
export const addClient = (obj) => {
  return axios({
    url: `${baseURL}/clientPool/ajaxAdd.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 获取公海成员
export const getPoolMember = obj => {
  return axios({
    url: `${baseURL}/crm/clientPoolUser/getPoolMember.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

// 获取行业
export const getIndustry = obj => {
  return axios({
    url: `${baseURL}/client/clientAction!getIndustryList.action`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

//校验客户名称，联系电话是否重复
export const validPhoneOrClient = obj => {
  return axios({
    url: `${baseURL}/clientPool/clientPoolAction!validPhoneOrClient.action`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};


//编辑公海池
export const updateClient = obj => {
  return axios({
    url: `${baseURL}/clientPool/ajaxUpdate.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};


//是否启用公海池
export const getUsingCrmPool = obj => {
  return axios({
    url: `${baseURL}/clientPool/isUsingCrmPool.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

//启用公海池
export const setOpenSetting = obj => {
  return axios({
    url: `${baseURL}/clientPool/updateCrmPoolStatus.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

//获取公海池客户列表
export const getSearchList = obj => {
  return axios({
    url: `${baseURL}/clientPool/ajaxSearch.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

//分配公海池成员
export const saveAssignSea = obj => {
  return axios({
    url: `${baseURL}/crm/clientPoolUser/divideClientManager.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

//变更公海池
export const changeTerritorialSea = obj => {
  return axios({
    url: `${baseURL}/clientPool/updateAnotherPool.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

//冻结公海池
export const frozenTerritorialSea = obj => {
  return axios({
    url: `${baseURL}/clientPool/frozenClient.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

//废弃公海
export const scrapTerritorialSea = obj => {
  return axios({
    url: `${baseURL}/clientPool/scrapClient.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

//删除公海
export const deleteTerritorialSea = obj => {
  let delUrl = obj.isAssignStatus ? `${baseURL}/client/clientAction!ajaxBatchDelete.action` : `${baseURL}/clientPool/ajaxBatchDelete.do`
  return axios({
    url: delUrl,
    method: 'POST',
    dataType: 'json',
    data: {
      ids:obj.ids
    }
  })
}

//回收公海
export const recoveryTerritorialSea = obj => {
  return axios({
    url: `${baseURL}/clientPool/clientPoolAction!recycleClientToPool.action`,
    method: 'POST',
    dataType: 'json',
    data: obj
  })
}

//获取导入摸板Url
export const importTemplateUrl = `${baseURL}/clientPool/exportPoolClientTemp.do`;

//导入竞争对手
//@param {*} file
// @param {String|Number} type 0 覆盖导入;1 不处理;2 保留重复数据
export function batchImportTerritorialSea(form) {
  return new Promise((resolve, reject) => {
    try {
      let xhr = new XMLHttpRequest();
      try {
        xhr.open("post", `${baseURL}/clientPool/batchImportPoolClient.do`, true);
      } catch (e) {
        reject(e)
      }
      xhr.onload = function () {
        if (xhr.status < 400) {
          var result = eval("(" + xhr.responseText + ")");
          resolve(result);
        } else {
          reject()
        }
      };
      xhr.send(form);
    } catch (e) {
      reject(e)
    }
  })
}

//查询导入结果
//@param {String} id 导入成功返回的id
export function viewImportProcess(id) {
  return axios({
    url: `${baseURL}/clientPool/viewImportProcess.do`,
    method: 'get',
    params: {
      id
    }
  });
}

//获取下载导入错误数据的url
//@param {String} id 导入返回的id
export function getExportErrorUrl(id) {
  return `${baseURL}/clientPool/exportErrorImportPoolClient.do?id=${id}`
}

// 获取公海详情
export const getPoolDetail = obj => {
  return axios({
    url: `${baseURL}/clientPool/getClientDetail.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

// 获取智能提示（人）
export const getPerson = obj => {
  return axios({
    url: `${baseURL}/contact/contactAction!ajaxSearchUserByPersonName.action`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};
