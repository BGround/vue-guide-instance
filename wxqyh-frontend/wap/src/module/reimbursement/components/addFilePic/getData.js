// 删除附件图片
export function deleteTaskPic(params,cb) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/deleteTaskPicOrFile.do',params).then((result) => {
    if (result.code == '0') {
      cb(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  })
}
// 新增附件图片
export function updateTaskPic(params,cb) {
  axios.post(_.baseURL+'/portal/taskPortalCtl/insertTaskPicOrFile.do',params).then((result) => {
    if (result.code == '0') {
      cb(result.data);
    } else {
      _.alert('提示', result.desc);
    }
  })
}
