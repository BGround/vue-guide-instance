

import axios from 'axios'
import wx from 'weixin-js-sdk';
import Qs from 'qs';
const instance  = axios.create();
var CancelToken = axios.CancelToken;
instance.defaults.transformRequest = [function (data) {
  var dataType = Object.prototype.toString.call(data);
  if(dataType !== '[object FormData]'){
    data = Qs.stringify(data);
  }
  return data;
}];

export function removeFileItem(file, fileList = []) {
  const matchKey = file.uid !== undefined ? 'uid' : 'name';
  const removed = fileList.filter(item => item[matchKey] !== file[matchKey]);
  if (removed.length === fileList.length) {
    return null;
  }
  return removed;
}

function  getFile(file) {
  let  fileList = this.uploadFiles;
  let target;
  fileList.every(item => {
    target = file.uid === item.uid ? item : null;
    return !target;
  });
  return target;
}

export function isWeChatApp () {
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry/i.test(ua);
  return (ua.match(/MicroMessenger/i)=="micromessenger") && ua.indexOf("windowswechat")==-1 && isMobile
}


export function httpRequest (option){
  const url = option.url;
  const headers = option.headers || {};
  var CancelToken = axios.CancelToken;
  instance.post(url, option.data, {
      headers: headers,
      onUploadProgress: function(ev){
          // 对原生进度事件的处理
          if (ev.total > 0) {
            ev.percent = ev.loaded / ev.total * 100;
          }
          option.onProgress(ev);
      },
      validateStatus: function (status) {
          return status >= 200 && status < 300; // 默认的
      },
      cancelToken: new CancelToken(function executor(c) { // 设置 cancel token
        option.onAbort(c);
      })
    }).then(function (response) {
      option.onSuccess(response);
    })
    .catch(function (error) {
      option.onError(error);
    });
}

export function wxChooseImage(type = ['album', 'camera'],count,callBack) {
  count = count && count <= 9? count : 9;
  wx.chooseImage({
    count: count, //限制上传图片张数
    sizeType: ['original', 'compressed'],                     //0 可以指定是原图还是压缩图，默认二者都有
    sourceType: type, 										// 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      //选择图片成功后
      let localIdList = res.localIds;
      let serverIdList = [];
      if (localIdList.length == 0) {
        _.alert("",'i18n.plzChoosePic');
        return;
      }
      _.showLoading("正在准备上传"+localIdList.length+"张图片");
      let i = 0;
      function uploadFormult(){
        wx.uploadImage({
          localId: localIdList[i],
          isShowProgressTips:0,
          success: function (res) {
            _.showLoading("正在上传第"+(i+1)+"张图片",true);
            i++;
            serverIdList.push(res.serverId);
            if (i < localIdList.length) {
              setTimeout(uploadFormult,500);
            }
            if(serverIdList.length==localIdList.length){
              callBack(serverIdList)
            }
          },
          fail: function (res) {
            _.hideLoading();
            _.alert("","图片上传失败"+res.errMsg+"，"+"请重新上传");
          }
        });
      }
      setTimeout(uploadFormult,500);
    }
  });
}
