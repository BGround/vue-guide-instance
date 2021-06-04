export function imgUploadHandler(file,limit) {
  let uploadFormat = ['image/jpeg','image/png'];
  let baseSize = 1048576;
  let isImg = uploadFormat.includes(file.type);
  let isExceedLimit = file.size > limit * baseSize;

  if(!isImg){
    dataBase.top_alert('图片仅支持JPG/PNG/JPEG格式',false,3000);
    return false;
  }

  if (isExceedLimit){
    dataBase.top_alert("文件大小不能超过"+limit+"M，请重新选择",false,3000);
    return false;
  }
  return true;
}
