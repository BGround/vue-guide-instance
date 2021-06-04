/**
 * Created by linyue on 2017/10/20.
 */
import axios from 'axios'
import Vue from 'vue'
import '../../assets/js/config.js';
;(function(w){
	function qwy(){}
	qwy.prototype={
		//封装ajax
		ajax:function(){
    		var argument = arguments[0];
    		axios({
    		  method: argument.type,
    		  url:argument.url,
    		  data:argument.data
    		}).then(function(response){
    		  if(response){
    		    if(argument.success){
    		      argument.success(response)
    		    }
    		  }
    		})
  		},
  		//alert弹框
		alert:function(title, msg, callback, btnName, isShowCancelBtn,cancelCallback){
			dataBase.alert(title, msg, callback, btnName, isShowCancelBtn,cancelCallback);
		},
		/**
     * js获取地址栏参数值
     */	//URL识别
		getUrlParam(url,name) {
      var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)","i"); //构造一个含有目标参数的正则表达式对象
      if(reg.test(url.replace('#/',''))){ //匹配目标参数
        return unescape(RegExp.$2.replace(/\+/g," "))
      }
      return null; //返回参数值
    },
	}
  w.qwy=qwy;
})(window)

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")   ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

// VUE 过滤器 ：为目标数据(金额)添加千分位符
// 例子：
// {{ money | formatMoney }}
Vue.filter('formatMoney', function (money = 0) {
  // 返回处理后的值
  var v, j, sj, rv = "";
  money = money.toString();
  v = money.replace(/,/g, "").split(".");
  j = v[0].length % 3;
  sj = v[0].substr(j).toString();
  for (var i = 0; i < sj.length; i++) {
    rv = (i % 3 == 0) ? rv + "," + sj.substr(i, 1) : rv + sj.substr(i, 1);
  }
  var rvalue = (v[1] == undefined) ? v[0].substr(0, j) + rv : v[0].substr(0, j) + rv + "." + v[1];
  if (rvalue.charCodeAt(0) == 44) {
    rvalue = rvalue.substr(1);
  }
  return rvalue;
})
