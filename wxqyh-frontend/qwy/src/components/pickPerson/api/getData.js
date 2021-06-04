import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config'

// 获取全部标签
export function getTagGroup(intersectionTagIds) {
  return axios({
    url: baseURL + '/tag/tagAction!searchTagGroupPage.action',
    method: 'POST',
    data: {
      intersectionTagIds:intersectionTagIds,
      agentCode: dataBase.agent || dataBase.agentCode
    }
  })
}

// 获取标签对应的全部人员(用来全选)
export function getTagPersons(tagId,toUser) {
  return axios({
    url: baseURL + '/tag/tagAction!searchTagGroupRefAll.action',
    method: 'POST',
    data: {
      agentCode: dataBase.agent || dataBase.agentCode,
      tagId: tagId,
      toUser: toUser
    }
  })
}

//获取根节点(企业名称)
export function getRootCompanyName() {
  return axios({
    url: baseURL + '/contact/contactAction!getRootNodeByUser.action',
    method: 'POST',
    data: {
      agentCode: dataBase.agent || dataBase.agentCode,
    }
  })
}

//获取全部部门
export function getDeptGroup(nodeId,intersectionDeptIds,intersectionTagIds) {
  return axios({
    url: baseURL + '/department/departmentAction!listOrgNodeByParent.action',
    method: 'POST',
    data: {
      nodeId:nodeId,
      agentCode: dataBase.agent || dataBase.agentCode,
      intersectionDeptIds:intersectionDeptIds,
      intersectionTagIds:intersectionTagIds
    }
  })
}

//搜索联想，获取部门
export function getDeptByKeyword(keyWord,intersectionDeptIds,intersectionTagIds) {
  return axios({
    url: baseURL + '/department/departmentAction!searchDepartByCondition.action',
    method: 'POST',
    data: {
      condition: keyWord,
      intersectionDeptIds:intersectionDeptIds,
      intersectionTagIds:intersectionTagIds,
      isNeedParent: 0,
      agentCode: dataBase.agent || dataBase.agentCode
    }
  })
}

//批量导入
export function getBatchData(param,intersectionDeptIds,intersectionTagIds,intersectionUserIds) {
  return axios({
    url: baseURL + '/contact/selectUserMgrAction!getEffectiveUsersFromData.action',
    method: 'POST',
    data: {
      param:param,
      intersectionDeptIds:intersectionDeptIds,
      intersectionTagIds:intersectionTagIds,
      intersectionUserIds:intersectionUserIds,
      batchNum: 100,
      agentCode: dataBase.agent || dataBase.agentCode
    }
  })
}

//获取职位
export function getPosition() {
  return axios({
    url: baseURL + '/post/postAction!queryPositionList.action',
    method: 'POST',
    data: {
      page: 1,
      pageSize: 1000,
      'searchValue.name': '',
      'searchValue.catalog': ''
    }
  })
}

//获取职位
// export function getPositionList() {
//   return axios({
//     url: baseURL + '/post/postAction!getPositionList.action',
//     method: 'POST',
//   })
// }

//按关键字搜索职位
export function getPositionByKey(param) {
  return axios({
    url: baseURL + '/post/postAction!getPositionByVagueSearch.action',
    method: 'POST',
    data: {
      keyWord:param
    }
  })
}

//获取通讯录自定义字段（高级搜索中使用）
export function getKeyParams(intersectionDeptIds,intersectionTagIds,intersectionUserIds) {
  return axios({
    url: baseURL + '/contact/selectUserMgrAction!ajaxSearch.action',
    method: 'POST',
    data: {
      intersectionDeptIds:intersectionDeptIds,
      intersectionTagIds:intersectionTagIds,
      intersectionUserIds:intersectionUserIds,
      agentCode: 'addressBook'
    }
  })
}

//获取管理员列表
export function getAdminList() {
  return axios({
    url: baseURL + '/managesetting/managesettingAction!getUserList.action',
    method: 'POST',
    data: {
      isNeedAllManageUser: 1,
      pageSize: 30000,
      page: 1
    }
  })
}

//获取管理员列表
export function getNewAdminList() {
  return axios({
    url: baseURL + '/task/taskMgrCtl/getUserList.do',
    method: 'POST',
    data: {
      isNeedAllManageUser: 1,
      pageSize: 1000,
      page: 1
    }
  })
}

//批量导入管理员列表
export function batchAdminList(param) {
  return axios({
    url: baseURL + '/managesetting/managesettingMgrCtl/batchImportManagerUser.do',
    method: 'POST',
    data: {
      manageUserIds: param
    }
  })
}



//获取经销商列表
export function getDealerList(param) {
  return axios({
    url: baseURL + '/dealer/dealerAction!getAllDealerFullNameListBySearch.action',
    method: 'POST',
    data: {
      manageUserIds: param
    }
  })
}
