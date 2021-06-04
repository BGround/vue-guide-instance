/**
 * Created by linyue on 2017/10/20.
 */
import baseURL from './baseURL_config'
var config={};
//axios兼容ie以及低版本的安卓或ios
import promise from 'es6-promise';
promise.polyfill();
import axios from 'axios';
//axios兼容参数转字符
import Qs from 'qs';
// 请求前的参数处理
axios.defaults.transformRequest=[function (data) {
  data = Qs.stringify(data);
  return data;
}];
// 响应拦截
axios.interceptors.response.use(function (response) {
  // 处理响应数据
  try{
    if(typeof JSON.parse(response.request.response) !='object'){
      window.location.href = '/module/login.html'
    }
    return response.data;
  }catch(e){
      window.location.href = '/module/login.html'
  }
},function(response){
  if(response.request.status==0){
    window.location.href = '/module/login.html'
  }else{
    var _qwy_ = new qwy()
    _qwy_.alert("提示","网络错误")
  }
});
//axios兼容参数转formData
axios.defaults.headers={'X-Requested-With': 'XMLHttpRequest','Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'};

// 执行登陆验证
window.getLoginMessagePromise = function(){
  var p = new Promise(function(resolve, reject){
    getLoginMessage(resolve)
  });
  return p
}

//判断登录成功还是未登录
function getLoginMessage(resolve){
  // 过滤登陆页面
    config.logo={
      copyright : ""+new Date().getFullYear()
    }
    for(var v in config){
      qwy.prototype[v]=config[v];
    }
    var _qwy = new qwy();
    window._qwy = _qwy;
    window._ = _qwy;
    dataBase.loading=false;
    resolve();
}
