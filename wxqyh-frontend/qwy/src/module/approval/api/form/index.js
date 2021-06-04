import axios from 'axios'
import baseURL from '@/assets/js/baseURL_config'

// 设置用户视图
export function setViewMode(viewMode) {
    return axios({
        url: baseURL + '/form/form/setViewMode.do',
        method: 'POST',
        async: false,
        data: { viewMode: viewMode }
    })
}

// 获取用户视图
export function getViewMode() {
    return axios({
        url: baseURL + '/form/form/getViewMode.do',
        method: 'POST',
        async: false
    })
}

// 获取分组
export function getGroup(id = "") {
    return axios({
        url: baseURL + '/form/form/findSubFormTypes.do',
        method: 'POST',
        data: { id: id }
    })
}

// 查询分组
export function searchGroup(data) {
    return axios({
        url: baseURL + '/form/form/getFormType.do',
        method: 'POST',
        data: data
    })
}

// 获取表单数据 data: { pageSize, viewMode, parentId}
export function getForm(data) {
    return axios({
        url: baseURL + '/form/formAction!ajaxSearch.action',
        method: 'POST',
        data: data,
        async: false
    })
}

// 删除表单 or 批量删除表单
export function delForm(ids) {
    return axios({
        url: baseURL + '/form/form/ajaxBatchDelete.do',
        method: 'POST',
        data: { ids: ids}
    })
}

// 前往编辑表单
export function gotoEditForm(id) {
    return axios({
        url: baseURL + '/form/formAction!checkIsEdit.action',
        method : "POST",
        data : { id : id},
        dataType : "json"
    })
}

// 禁用表单
export function forbidForm(id) {
    return axios({
        url: baseURL + '/form/formAction!shutStatus.action',
        method: 'POST',
        data: { id: id },
        cache: false,
        dataType: 'json'
    })
}

// 启用表单
export function openForm(id) {
    return axios({
        url: baseURL + '/form/formAction!openStatus.action',
        method: 'POST',
        data: { id: id },
        cache: false,
        dataType: 'json'
    })
}

// 生成二维码
export function getURL(id, isTask) {
    return axios({
        url: baseURL + '/form/formAction!ajaxGetEasyCode.action',
        method: 'POST',
        dataType: 'json',
        data: { id: id, task: isTask },
        async: false
    })
}

// 删除分组
export function delFormType(id) {
    return axios({
        url: baseURL + '/form/form/delFormType.do',
        method: 'POST',
        dataType: 'json',
        data: { id: id }
    })
}

// 启用或禁用分组
export function updateFormType(data) {
    return axios({
        url: baseURL + '/form/form/updateFormType.do',
        method: 'POST',
        dataType: 'json',
        data: data
    })
}

// 找到某个分组
export function findFormType(id) {
    return axios({
        url: baseURL + '/form/form/getFormTypeById.do',
        method: 'POST',
        data: { id: id }
    })
}

// 设置视图模式引导提示
export function setViewModeTips(value) {
    return axios({
        url: baseURL + '/form/form/setIsShowViewModeTip.do',
        method: 'POST',
        data: { value: value }
    })
}

// 获取视图模式引导提示
export function getViewModeTips() {
    return axios({
        url: baseURL + '/form/form/getIsShowViewModeTip.do',
        method: 'POST'
    })
}

// 判断是否在白名单
export function isWhiteCorpId(data) {
  return axios({
    url: baseURL + '/corpIdWhite/corpIdWhiteCtl/isWhiteCorpId.do',
    method: 'POST',
    dataType: 'json',
    data: data
  })
}

// 判断有无绑定通讯录
export function checkFormAuthority(data) {
  return axios({
    url: baseURL + '/form/formDetail/checkFormAuthorityStatus.do',
    method: 'POST',
    dataType: 'json',
    data: data
  })
}
