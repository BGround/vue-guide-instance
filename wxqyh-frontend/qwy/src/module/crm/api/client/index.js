import axios from 'axios';
import baseURL from '@/assets/js/baseURL_config';
//获取客户详情
export const getClientDetail = obj => {
    return axios({
      url: `${_.baseURL}/client/getClientDetail.do`,
      method: "POST",
      dataType: "json",
      data: obj
    });
}
// 获取自定义字段设置
export const getCustomField = () => {
  return axios({
    method:'post',
    url:`${baseURL}/client/getClientListSearchOption.do`
  })
}
//保存自定义字段设置
export const saveCustomField = (obj) => {
  return axios({
    method: 'post',
    url:`${baseURL}/client/saveClientListSearchOption.do`,
    data: obj
  })
}
//获取列表数据
export const getClientList = (obj) => {
  return axios({
    method:'post',
    url:`${baseURL}/client/ajaxSearchHeadPage.do`,
    data:obj
  })
}
//获取商机阶段
export const getBusinessStage = () => {
  return axios({
    method:'get',
    url:`${baseURL}/business/businessAction!getBusinessStage.action`
  })
}

// 获取客户字段信息
export const getClientItem = (obj) => {
  return axios({
    url: `${_.baseURL}/client/getClientItem.do`,
    method: 'POST',
    dataType: 'json',
    data: obj
  });
}

// 新增客户
export const addClient = obj => {
  return axios({
    url: `${_.baseURL}/client/ajaxAdd.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

// 获取客户编辑详情
export const getEditDetail = obj => {
  return axios({
    url: `${_.baseURL}/client/getClientHistoryInfo.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

// 编辑客户
export const editClient = obj => {
  return axios({
    url: `${_.baseURL}/client/ajaxUpdate.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

// 验证电话
export const validPhone = obj => {
  return axios({
    url: `${_.baseURL}/client/validPhone.do`,
    method: "POST",
    dataType: "json",
    data: obj
  });
};

// 获取客户类别
export const getClientType = obj =>{
  return axios({
    url: `${_.baseURL}/crm/manageObjectSetUp/searchClientTypeList.do`,
    method: "GET",
    dataType: "json",
    data: obj
  });
}

// 是否多个负责人
export const checkToPerson = obj =>{
  return axios({
    url: `${_.baseURL}/intercalate/intercalateAction!getPhotoSetting.action`,
    method: "POST",
    dataType: "json",
    data: obj
  });
}


//客户转移
export const transferClient = (obj) => {
  return axios({
    method: 'post',
    url: `${baseURL}/client/changeClientCharge.do`,
    data:obj
  })
}
//下载客户模板
export const importTemplateUrl = `${baseURL}/crm/clientImport/exportClientTemp.do`

//导入客户数据
export const doBatchImport = (form) => {
  return new Promise((resolve, reject) => {
    try {
      let xhr = new XMLHttpRequest();
      try {
        xhr.open("post", `${baseURL}/crm/clientImport/batchImportClient.do`, true);
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
//导入过程
export const viewImportProcess = (id) => {
  return axios({
    method: 'get',
    url: `${baseURL}/crm/clientImport/viewImportProcess.do`,
    params:{id}
  })
}
//导出错误结果
export const getExportErrorUrl = (id) =>{
  return `${baseURL}/clientPool/exportErrorImportPoolClient.do?id=${id}`
}
//删除客户
export const delClient = (ids) => {
  return axios({
    method:'post',
    url:`${baseURL}/client/ajaxBatchDelete.do`,
    data: ids
  })
}
//获取导出选项
export const getExportOption = () => {
  return axios({
    method:'get',
    url:`${baseURL}/crm/clientImport/getExportOption.do`
  })
}
//检测导出
export const checkExport = (obj) => {
  return axios({
    method:'post',
    url:`${baseURL}/report/reportAction!checkReport.action`,
    data:obj
  })
}
//创建导出任务
export const createExportTask = (obj) => {
  return axios({
    method:'post',
    url:`${baseURL}/report/reportAction!createReportTask.action`,
    data:obj
  })
}
//添加导出记录
export const inserExportRecord = (obj) => {
  return axios({
    method:'post',
    url:`${baseURL}/crm/clientImport/insertRecords.do`,
    data:obj
  })
}
//验证用户是否为vip
export const isVipUser = () => {
  return axios({
    method:'post',
    url:`${baseURL}/crm/clientImport/validLoginUserVip.do`
  })
}
//获取客户级别
export const getClientLevel = () => {
  return axios({
    method: 'get',
    url: `${baseURL}/client/getClientLevel.do`
  })
}

//判断是否开启了客户分级
export const startClientGrade = () => {
  return axios({
    method: 'post',
    url: `${baseURL}/intercalate/intercalateAction!getPhotoSetting.action`,
    data:{
      agentCode: "crm_client_grade"
    }
  })
}