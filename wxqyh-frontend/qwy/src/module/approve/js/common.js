import store from '../store'

export const permission = (operation) => {
  let permData = store.state.header.permission;
  if(operation !=undefined&&!permData[operation]){
    return false;
  }else {
    return true;
  }
}

export function add0(m){return m<10?'0'+m:m }
export const format =(time,value)=>{
  //time(时间戳)是整数，否则要parseInt转换，value（想要得到返回的时间格式day:天 second:具体到秒）
  var time = new Date(time);
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  if(value=='day'){
    return y+'-'+add0(m)+'-'+add0(d)
  }else if(value=='second'){
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
  }
};

//返回传递给他的任意对象的类
export const isClass = (o) => {
  if (o === null) return "Null";
  if (o === undefined) return "Undefined";
  return Object.prototype.toString.call(o).slice(8, -1);
}
//深度克隆
export const deepClone = (obj) => {
  if (!obj) { return null }
  let result, oClass = isClass(obj);
  //确定result的类型
  if (oClass === "Object") {
    result = {};
  } else if (oClass === "Array") {
    result = [];
  } else {
    return obj;
  }

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let copy = obj[key];
      if (isClass(copy) == "Object") {
        result[key] = deepClone(copy);//递归调用
      } else if (isClass(copy) == "Array") {
        result[key] = deepClone(copy);
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}
