import axios from 'axios';
import { RESULT_OK } from './config';

const GET_REIM_GETDETAIL = `${_.baseURL}/portal/reimPortalCtl/getDetail.do`;



// 获取报销详情
export const getReimDetail = ({reimId, size}) => {
  return axios.post(GET_REIM_GETDETAIL,{reimId, size}).then((res) => {
    if (res.code == RESULT_OK) {
      return Promise.resolve(res);
    } else {
      return Promise.reject(res);
    }
  });
};

export function commentListMore(data, cb) {                                      //加载更多评论
  axios.post(_.baseURL + "/portal/reimPortalCtl/listComment.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

export function addCommentList(data, cb) {                                      //新增评论
  axios.post(_.baseURL + "/portal/reimPortalCtl/commitComment.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      _.tooltips_succeed("评论成功");
      cb(result.data)
    } else {
      _.alert('提示', result.desc)
    }
  })
}

export function deleteCommentList(data, cb) {                                  //删除评论
  _.showLoading("删除中...");
  axios.post(_.baseURL + "/portal/reimPortalCtl/deleteComment.do", {
    ...data
  }).then(function (result) {
    _.hideLoading();
    if (result.code === '0') {
      _.tooltips_succeed("删除成功");
      cb(result)
    } else {
      _.alert('提示', result.desc)
    }
  })
}
