

const pluszero = (v) => {
  return v<10?`0${v}`:v;
};

//微信端后台页面获取地址头:后台用，非外部
const getImgURLHead = (URL) => {
  if(URL.indexOf("manager/images/")>=0 || URL.indexOf("themes/default/images/")>=0 || URL.indexOf("/upload/img/birthday/")>=0 || URL.indexOf("/upload/img/zhounian/")>=0){
    return _.baseURL;
  }else{
    return _.compressURL;
  }
};

export {
  pluszero,
  getImgURLHead,
}